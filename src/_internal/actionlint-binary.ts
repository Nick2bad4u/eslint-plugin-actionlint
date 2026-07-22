import type { UnknownRecord } from "type-fest";

import AdmZip from "adm-zip";
import { createHash, randomUUID } from "node:crypto";
import { constants as fileSystemConstants } from "node:fs";
import {
    chmod,
    copyFile,
    mkdir,
    mkdtemp,
    rename,
    rm,
    stat,
    writeFile,
} from "node:fs/promises";
import * as path from "node:path";
import { extract as extractTarArchive } from "tar";
import { assertDefined, isDefined, stringSplit } from "ts-extras";

/* eslint-disable import-x/extensions -- Native type-stripped worker execution needs the source extension; TypeScript rewrites it to .js for the package build. */
import {
    type ActionlintPlatformAsset,
    type ActionlintRuntimeEnvironment,
    getActionlintCacheDirectory,
    getActionlintPlatformAsset,
    getActionlintRuntimeEnvironment,
    getUnsupportedActionlintPlatformMessage,
} from "./actionlint-platform.ts";
/* eslint-enable import-x/extensions -- Restore the package-wide extension policy after the native-worker import. */

const inFlightDownloads = new Map<string, Promise<string>>();

type DownloadOptions = Readonly<{
    architecture?: string;
    environment?: ActionlintRuntimeEnvironment;
    fetchImplementation?: typeof fetch;
    platform?: string;
}>;

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const getErrorCode = (error: unknown): string | undefined => {
    if (!isUnknownRecord(error)) return undefined;
    const code = error["code"];
    return typeof code === "string" ? code : undefined;
};

const isRegularFile = async (filePath: string): Promise<boolean> => {
    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- Callers provide a configured binary or a path constrained to the bridge cache.
        const fileStatus = await stat(filePath);
        return fileStatus.isFile();
    } catch {
        return false;
    }
};

const isLowerHexChecksum = (checksum: string): boolean => {
    if (checksum.length !== 64) return false;
    for (const character of checksum) {
        const isHexCharacter =
            (character >= "0" && character <= "9") ||
            (character >= "a" && character <= "f");
        if (!isHexCharacter) return false;
    }
    return true;
};

const download = async (
    url: string,
    environment: ActionlintRuntimeEnvironment,
    fetchImplementation: typeof fetch
): Promise<Buffer> => {
    const headers = new Headers({
        Accept: "application/octet-stream",
        "User-Agent": "eslint-plugin-actionlint",
    });
    const token = environment["GITHUB_TOKEN"];
    if (isDefined(token) && token.length > 0) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetchImplementation(url, {
        headers,
        redirect: "follow",
    });
    if (!response.ok) {
        throw new Error(
            `Actionlint download failed: ${String(response.status)} ${response.statusText} for ${url}`
        );
    }
    return Buffer.from(await response.arrayBuffer());
};

/** Read the official checksum for an exact release asset. */
export const readExpectedChecksum = (
    checksumManifest: string,
    assetName: string
): string => {
    const checksumLines = stringSplit(
        checksumManifest.replaceAll("\r\n", "\n"),
        "\n"
    );
    for (const line of checksumLines) {
        const normalizedLine = line.trim();
        const checksum = normalizedLine.slice(0, 64);
        const rawFileName = normalizedLine.slice(64).trimStart();
        const fileName = rawFileName.startsWith("*")
            ? rawFileName.slice(1)
            : rawFileName;
        if (fileName === assetName && isLowerHexChecksum(checksum)) {
            return checksum;
        }
    }
    throw new Error(
        `The official Actionlint checksum manifest does not contain '${assetName}'.`
    );
};

/** Assert that an archive matches its official SHA-256 checksum. */
export const verifyArchiveChecksum = (
    archive: Readonly<Uint8Array>,
    expectedChecksum: string,
    assetName: string
): void => {
    const actualChecksum = createHash("sha256")
        .update(Buffer.from(archive))
        .digest("hex");
    if (actualChecksum !== expectedChecksum) {
        throw new Error(
            `Actionlint checksum verification failed for '${assetName}': expected ${expectedChecksum}, received ${actualChecksum}.`
        );
    }
};

const extractArchive = async (
    archivePath: string,
    destination: string,
    asset: ActionlintPlatformAsset
): Promise<void> => {
    if (asset.archiveExtension === "zip") {
        const archive = new AdmZip(archivePath);
        archive.extractAllTo(destination, true, false);
        return;
    }
    await extractTarArchive({
        cwd: destination,
        file: archivePath,
        preservePaths: false,
        strict: true,
    });
};

const publishExecutable = async (
    extractedExecutable: string,
    executablePath: string
): Promise<string> => {
    const temporaryExecutable = path.join(
        path.dirname(executablePath),
        `.${path.basename(executablePath)}.${String(process.pid)}.${randomUUID()}.tmp`
    );
    await copyFile(
        extractedExecutable,
        temporaryExecutable,
        fileSystemConstants.COPYFILE_EXCL
    );
    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- This unique file is constrained to the bridge cache directory.
        await chmod(temporaryExecutable, 0o755);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define -- The helper is initialized before this function can be called after module evaluation.
        return await renameOrUsePublishedExecutable(
            temporaryExecutable,
            executablePath
        );
    } finally {
        await rm(temporaryExecutable, { force: true });
    }
};

const renameOrUsePublishedExecutable = async (
    temporaryExecutable: string,
    executablePath: string
): Promise<string> => {
    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- Both paths are constrained to the bridge cache directory.
        await rename(temporaryExecutable, executablePath);
        return executablePath;
    } catch (error: unknown) {
        const code = getErrorCode(error);
        if (
            (code === "EEXIST" || code === "EPERM") &&
            (await isRegularFile(executablePath))
        ) {
            return executablePath;
        }
        throw error;
    }
};

const downloadAndPublish = async (
    version: string,
    executablePath: string,
    asset: ActionlintPlatformAsset,
    environment: ActionlintRuntimeEnvironment,
    fetchImplementation: typeof fetch
): Promise<string> => {
    const versionDirectory = path.dirname(executablePath);
    const cacheDirectory = path.dirname(versionDirectory);
    // eslint-disable-next-line security/detect-non-literal-fs-filename -- The directory is constrained to the bridge cache and validated release version.
    await mkdir(versionDirectory, { recursive: true });
    const stagingDirectory = await mkdtemp(
        path.join(cacheDirectory, ".actionlint-download-")
    );
    try {
        const [archive, checksumManifest] = await Promise.all([
            download(asset.url, environment, fetchImplementation),
            download(asset.checksumUrl, environment, fetchImplementation),
        ]);
        const expectedChecksum = readExpectedChecksum(
            checksumManifest.toString("utf8"),
            asset.assetName
        );
        verifyArchiveChecksum(archive, expectedChecksum, asset.assetName);

        const archivePath = path.join(
            stagingDirectory,
            `archive.${asset.archiveExtension}`
        );
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- The archive path is inside a unique mkdtemp directory.
        await writeFile(archivePath, archive, { flag: "wx" });
        await extractArchive(archivePath, stagingDirectory, asset);
        const extractedExecutable = path.join(
            stagingDirectory,
            asset.executableName
        );
        if (!(await isRegularFile(extractedExecutable))) {
            throw new Error(
                `The verified Actionlint ${version} archive did not contain '${asset.executableName}'.`
            );
        }
        return await publishExecutable(extractedExecutable, executablePath);
    } finally {
        await rm(stagingDirectory, { force: true, recursive: true });
    }
};

/** Resolve a configured Actionlint binary or download a verified official one. */
export const getActionlintBinaryPath = async (
    version: string,
    options: DownloadOptions = {}
): Promise<string> => {
    const environment =
        options.environment ?? getActionlintRuntimeEnvironment();
    const configuredBinary = environment["ACTIONLINT_BIN"];
    if (
        isDefined(configuredBinary) &&
        configuredBinary.length > 0 &&
        (await isRegularFile(configuredBinary))
    ) {
        return configuredBinary;
    }

    const asset = getActionlintPlatformAsset(
        version,
        options.platform ?? process.platform,
        options.architecture ?? process.arch
    );
    assertDefined(
        asset,
        getUnsupportedActionlintPlatformMessage(
            options.platform,
            options.architecture,
            version
        )
    );

    const executablePath = path.join(
        getActionlintCacheDirectory(environment),
        version,
        asset.executableName
    );
    if (await isRegularFile(executablePath)) return executablePath;

    const existingDownload = inFlightDownloads.get(executablePath);
    if (isDefined(existingDownload)) return await existingDownload;

    const pendingDownload = downloadAndPublish(
        version,
        executablePath,
        asset,
        environment,
        options.fetchImplementation ?? fetch
    );
    inFlightDownloads.set(executablePath, pendingDownload);
    try {
        return await pendingDownload;
    } finally {
        inFlightDownloads.delete(executablePath);
    }
};
