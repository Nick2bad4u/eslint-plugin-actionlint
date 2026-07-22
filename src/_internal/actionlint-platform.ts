import * as path from "node:path";
import { arrayFirst, isDefined, stringSplit } from "ts-extras";

/** Description of an official Actionlint release archive. */
export type ActionlintPlatformAsset = Readonly<{
    archiveExtension: "tar.gz" | "zip";
    assetName: string;
    checksumUrl: string;
    executableName: "actionlint" | "actionlint.exe";
    url: string;
}>;

/** Environment values used by the Actionlint runtime bridge. */
export type ActionlintRuntimeEnvironment = Readonly<
    Record<string, string | undefined>
>;

/** Official Actionlint release used unless ACTIONLINT_RELEASE overrides it. */
export const DEFAULT_ACTIONLINT_VERSION = "1.7.12" as const;

const ACTIONLINT_REPOSITORY = "rhysd/actionlint" as const;
type SupportedArchitecture =
    | "386"
    | "amd64"
    | "arm64"
    | "armv6";
type SupportedOperatingSystem =
    | "darwin"
    | "freebsd"
    | "linux"
    | "windows";
// eslint-disable-next-line n/no-process-env -- Reading the documented bridge environment is the runtime boundary for this module.
const runtimeEnvironment: ActionlintRuntimeEnvironment = process.env;

const architectureByPlatform: Readonly<
    Record<
        string,
        Readonly<Record<string, SupportedArchitecture | undefined>> | undefined
    >
> = {
    darwin: { arm64: "arm64", x64: "amd64" },
    freebsd: { ia32: "386", x64: "amd64" },
    linux: {
        arm: "armv6",
        arm64: "arm64",
        ia32: "386",
        x64: "amd64",
    },
    win32: { arm64: "arm64", ia32: "386", x64: "amd64" },
};

const operatingSystemByPlatform: Readonly<
    Record<string, SupportedOperatingSystem | undefined>
> = {
    darwin: "darwin",
    freebsd: "freebsd",
    linux: "linux",
    win32: "windows",
};

const isAsciiDigit = (character: string): boolean =>
    character >= "0" && character <= "9";

const isValidVersionCharacter = (character: string): boolean =>
    isAsciiDigit(character) ||
    (character >= "A" && character <= "Z") ||
    (character >= "a" && character <= "z") ||
    character === "." ||
    character === "+" ||
    character === "-";

const isEveryCharacterMatching = (
    value: string,
    isMatchingCharacter: (character: string) => boolean
): boolean => {
    for (const character of value) {
        if (!isMatchingCharacter(character)) return false;
    }
    return true;
};

const assertValidVersion = (version: string): void => {
    const suffixSeparatorIndexes = [version.indexOf("+"), version.indexOf("-")]
        .filter((index) => index >= 0)
        .toSorted((left, right) => left - right);
    const firstSuffixIndex =
        arrayFirst(suffixSeparatorIndexes) ?? version.length;
    const versionCore = version.slice(0, firstSuffixIndex);
    const coreSegments = stringSplit(versionCore, ".");
    const isValidCore =
        coreSegments.length === 3 &&
        coreSegments.every(
            (segment) =>
                segment.length > 0 &&
                isEveryCharacterMatching(segment, isAsciiDigit)
        );
    const isValidVersion =
        isValidCore &&
        firstSuffixIndex !== version.length - 1 &&
        isEveryCharacterMatching(version, isValidVersionCharacter);
    if (!isValidVersion) {
        throw new Error(
            `Invalid Actionlint release version '${version}'. Expected a semantic version without a leading 'v'.`
        );
    }
};

/** Resolve the explicit, environment, or built-in Actionlint release version. */
export const resolveActionlintVersion = (
    explicitVersion?: string,
    environment: ActionlintRuntimeEnvironment = runtimeEnvironment
): string => {
    const version =
        explicitVersion ??
        environment["ACTIONLINT_RELEASE"] ??
        DEFAULT_ACTIONLINT_VERSION;
    assertValidVersion(version);
    return version;
};

/** Return the live process environment used by the runtime bridge. */
export const getActionlintRuntimeEnvironment =
    (): ActionlintRuntimeEnvironment => runtimeEnvironment;

/** Return the official release asset for a Node platform and architecture. */
export const getActionlintPlatformAsset = (
    version: string,
    platform: string = process.platform,
    architecture: string = process.arch
): ActionlintPlatformAsset | undefined => {
    assertValidVersion(version);
    const architectures = architectureByPlatform[platform];
    const operatingSystem = operatingSystemByPlatform[platform];
    if (!isDefined(architectures) || !isDefined(operatingSystem)) {
        return undefined;
    }
    const supportedArchitecture = architectures[architecture];
    if (!isDefined(supportedArchitecture)) return undefined;
    const archiveExtension = platform === "win32" ? "zip" : "tar.gz";
    const assetName = `actionlint_${version}_${operatingSystem}_${supportedArchitecture}.${archiveExtension}`;
    const releaseRoot = `https://github.com/${ACTIONLINT_REPOSITORY}/releases/download/v${version}`;

    return {
        archiveExtension,
        assetName,
        checksumUrl: `${releaseRoot}/actionlint_${version}_checksums.txt`,
        executableName: platform === "win32" ? "actionlint.exe" : "actionlint",
        url: `${releaseRoot}/${assetName}`,
    };
};

/** Explain why a platform cannot run the requested official Actionlint binary. */
export const getUnsupportedActionlintPlatformMessage = (
    platform: string = process.platform,
    architecture: string = process.arch,
    version: string = resolveActionlintVersion()
): string =>
    `Platform ${platform}/${architecture} is not supported by Actionlint ${version}. Supported targets are darwin (x64, arm64), linux (x64, arm64, ia32, arm), win32 (x64, arm64, ia32), and freebsd (x64, ia32).`;

/** Return the stable cache location used by the former bridge package. */
export const getActionlintCacheDirectory = (
    environment: ActionlintRuntimeEnvironment = runtimeEnvironment
): string => {
    const cacheRoot =
        environment["ACTIONLINT_CACHE_DIR"] ??
        path.join(
            environment["HOME"] ?? environment["USERPROFILE"] ?? process.cwd(),
            ".github-actionlint"
        );
    return path.join(cacheRoot, "bin");
};
