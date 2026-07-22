import AdmZip from "adm-zip";
import { createHash } from "node:crypto";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { create as createTarArchive } from "tar";
import { describe, expect, it, vi } from "vitest";

import {
    getActionlintBinaryPath,
    readExpectedChecksum,
    verifyArchiveChecksum,
} from "../src/_internal/actionlint-binary";

const usingTemporaryDirectory = async <Result>(
    callback: (temporaryDirectory: string) => Promise<Result>
): Promise<Result> => {
    const temporaryDirectory = await mkdtemp(
        path.join(tmpdir(), "actionlint-binary-test-")
    );
    try {
        return await callback(temporaryDirectory);
    } finally {
        await rm(temporaryDirectory, { force: true, recursive: true });
    }
};

const checksumFor = (content: Uint8Array): string =>
    createHash("sha256").update(content).digest("hex");

const createFetch = (
    archive: Uint8Array,
    assetName: string,
    checksum = checksumFor(archive)
): { fetchImplementation: typeof fetch; requests: string[] } => {
    const requests: string[] = [];
    const fetchImplementation = vi.fn<typeof fetch>((input) => {
        const url =
            typeof input === "string"
                ? input
                : input instanceof URL
                  ? input.href
                  : input.url;
        requests.push(url);
        if (url.endsWith("_checksums.txt")) {
            return Promise.resolve(new Response(`${checksum}  ${assetName}\n`));
        }
        const archiveBody = new Uint8Array(archive);
        return Promise.resolve(new Response(archiveBody.buffer));
    });
    return { fetchImplementation, requests };
};

describe("actionlint binary acquisition", () => {
    it("extracts a verified Windows archive and reuses the atomic cache", async () => {
        expect.assertions(5);

        await usingTemporaryDirectory(async (temporaryDirectory) => {
            const executable = Buffer.from("windows-actionlint");
            const zip = new AdmZip();
            zip.addFile("actionlint.exe", executable);
            const archive = zip.toBuffer();
            const assetName = "actionlint_1.7.12_windows_amd64.zip";
            const { fetchImplementation, requests } = createFetch(
                archive,
                assetName
            );
            const options = {
                architecture: "x64",
                environment: { ACTIONLINT_CACHE_DIR: temporaryDirectory },
                fetchImplementation,
                platform: "win32",
            } as const;

            const [firstPath, concurrentPath] = await Promise.all([
                getActionlintBinaryPath("1.7.12", options),
                getActionlintBinaryPath("1.7.12", options),
            ]);
            const cachedPath = await getActionlintBinaryPath("1.7.12", options);

            expect(firstPath).toBe(
                path.join(temporaryDirectory, "bin", "1.7.12", "actionlint.exe")
            );
            expect(concurrentPath).toBe(firstPath);
            expect(cachedPath).toBe(firstPath);
            await expect(readFile(firstPath)).resolves.toStrictEqual(
                executable
            );
            expect(requests).toHaveLength(2);
        });
    });

    it("extracts and publishes a verified tar.gz archive", async () => {
        expect.assertions(2);

        await usingTemporaryDirectory(async (temporaryDirectory) => {
            const archivePath = path.join(
                temporaryDirectory,
                "actionlint.tar.gz"
            );
            const createdSourceDirectory = await mkdtemp(
                path.join(temporaryDirectory, "archive-source-")
            );
            const sourceExecutable = path.join(
                createdSourceDirectory,
                "actionlint"
            );
            await writeFile(sourceExecutable, "linux-actionlint", "utf8");
            await chmod(sourceExecutable, 0o755);
            await createTarArchive(
                {
                    cwd: createdSourceDirectory,
                    file: archivePath,
                    gzip: true,
                    portable: true,
                },
                ["actionlint"]
            );
            const archive = await readFile(archivePath);
            const { fetchImplementation } = createFetch(
                archive,
                "actionlint_1.7.12_linux_amd64.tar.gz"
            );
            const binaryPath = await getActionlintBinaryPath("1.7.12", {
                architecture: "x64",
                environment: {
                    ACTIONLINT_CACHE_DIR: path.join(
                        temporaryDirectory,
                        "linux-cache"
                    ),
                },
                fetchImplementation,
                platform: "linux",
            });

            expect(binaryPath.endsWith(path.join("1.7.12", "actionlint"))).toBe(
                true
            );
            await expect(readFile(binaryPath, "utf8")).resolves.toBe(
                "linux-actionlint"
            );
        });
    });

    it("rejects checksum mismatches without publishing a binary", async () => {
        expect.assertions(2);

        await usingTemporaryDirectory(async (temporaryDirectory) => {
            const zip = new AdmZip();
            zip.addFile("actionlint.exe", Buffer.from("untrusted"));
            const archive = zip.toBuffer();
            const { fetchImplementation } = createFetch(
                archive,
                "actionlint_1.7.12_windows_amd64.zip",
                "0".repeat(64)
            );
            const expectedPath = path.join(
                temporaryDirectory,
                "bin",
                "1.7.12",
                "actionlint.exe"
            );

            await expect(
                getActionlintBinaryPath("1.7.12", {
                    architecture: "x64",
                    environment: { ACTIONLINT_CACHE_DIR: temporaryDirectory },
                    fetchImplementation,
                    platform: "win32",
                })
            ).rejects.toThrow("checksum verification failed");
            await expect(readFile(expectedPath)).rejects.toThrow("ENOENT");
        });
    });

    it("surfaces download failures and cleans staging files", async () => {
        expect.assertions(2);

        await usingTemporaryDirectory(async (temporaryDirectory) => {
            const fetchImplementation = vi.fn<typeof fetch>(() =>
                Promise.resolve(
                    new Response("unavailable", {
                        status: 503,
                        statusText: "Unavailable",
                    })
                )
            );

            await expect(
                getActionlintBinaryPath("1.7.12", {
                    architecture: "x64",
                    environment: { ACTIONLINT_CACHE_DIR: temporaryDirectory },
                    fetchImplementation,
                    platform: "linux",
                })
            ).rejects.toThrow("503 Unavailable");
            await expect(
                readFile(
                    path.join(temporaryDirectory, "bin", "1.7.12", "actionlint")
                )
            ).rejects.toThrow("ENOENT");
        });
    });

    it("honors an existing ACTIONLINT_BIN without downloading", async () => {
        expect.assertions(2);

        await usingTemporaryDirectory(async (temporaryDirectory) => {
            const configuredBinary = path.join(
                temporaryDirectory,
                "actionlint"
            );
            await writeFile(configuredBinary, "configured", "utf8");
            const fetchImplementation = vi.fn<typeof fetch>();

            await expect(
                getActionlintBinaryPath("1.7.12", {
                    environment: { ACTIONLINT_BIN: configuredBinary },
                    fetchImplementation,
                })
            ).resolves.toBe(configuredBinary);
            expect(fetchImplementation).not.toHaveBeenCalled();
        });
    });
});

describe("actionlint checksum parsing", () => {
    it("selects the checksum for the exact asset", () => {
        expect.assertions(1);

        expect(
            readExpectedChecksum(
                `${"1".repeat(64)}  other.zip\n${"2".repeat(64)} *wanted.zip\n`,
                "wanted.zip"
            )
        ).toBe("2".repeat(64));
    });

    it("rejects missing entries and mismatched content", () => {
        expect.assertions(2);

        expect(() => readExpectedChecksum("", "missing.zip")).toThrow(
            "does not contain"
        );
        expect(() => {
            verifyArchiveChecksum(
                Buffer.from("archive"),
                "0".repeat(64),
                "archive.zip"
            );
        }).toThrow("checksum verification failed");
    });
});
