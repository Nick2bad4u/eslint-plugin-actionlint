import * as path from "node:path";
import { describe, expect, it } from "vitest";

import {
    DEFAULT_ACTIONLINT_VERSION,
    getActionlintCacheDirectory,
    getActionlintPlatformAsset,
    getUnsupportedActionlintPlatformMessage,
    resolveActionlintVersion,
} from "../src/_internal/actionlint-platform";

const supportedTargets = [
    [
        "darwin",
        "arm64",
        "darwin_arm64.tar.gz",
    ],
    [
        "darwin",
        "x64",
        "darwin_amd64.tar.gz",
    ],
    [
        "freebsd",
        "ia32",
        "freebsd_386.tar.gz",
    ],
    [
        "freebsd",
        "x64",
        "freebsd_amd64.tar.gz",
    ],
    [
        "linux",
        "arm64",
        "linux_arm64.tar.gz",
    ],
    [
        "linux",
        "arm",
        "linux_armv6.tar.gz",
    ],
    [
        "linux",
        "ia32",
        "linux_386.tar.gz",
    ],
    [
        "linux",
        "x64",
        "linux_amd64.tar.gz",
    ],
    [
        "win32",
        "arm64",
        "windows_arm64.zip",
    ],
    [
        "win32",
        "ia32",
        "windows_386.zip",
    ],
    [
        "win32",
        "x64",
        "windows_amd64.zip",
    ],
] as const;

describe("actionlint platform resolution", () => {
    it.each(supportedTargets)(
        "maps %s/%s to the official %s archive",
        (platform, architecture, assetSuffix) => {
            expect.assertions(4);

            const asset = getActionlintPlatformAsset(
                DEFAULT_ACTIONLINT_VERSION,
                platform,
                architecture
            );

            expect(asset?.assetName).toBe(
                `actionlint_${DEFAULT_ACTIONLINT_VERSION}_${assetSuffix}`
            );
            expect(asset?.url).toContain(
                `/releases/download/v${DEFAULT_ACTIONLINT_VERSION}/`
            );
            expect(
                asset?.checksumUrl.endsWith(
                    `actionlint_${DEFAULT_ACTIONLINT_VERSION}_checksums.txt`
                )
            ).toBe(true);
            expect(asset?.executableName).toBe(
                platform === "win32" ? "actionlint.exe" : "actionlint"
            );
        }
    );

    it("rejects unsupported platform and architecture pairs", () => {
        expect.assertions(2);

        expect(
            getActionlintPlatformAsset("1.7.12", "aix", "x64")
        ).toBeUndefined();
        expect(
            getActionlintPlatformAsset("1.7.12", "darwin", "ia32")
        ).toBeUndefined();
    });

    it("reports the explicitly requested release for unsupported targets", () => {
        expect.assertions(1);

        expect(
            getUnsupportedActionlintPlatformMessage("aix", "ppc64", "2.3.4")
        ).toContain("Actionlint 2.3.4");
    });

    it("uses explicit, environment, and built-in versions in precedence order", () => {
        expect.assertions(3);

        expect(
            resolveActionlintVersion("1.2.3", {
                ACTIONLINT_RELEASE: "2.3.4",
            })
        ).toBe("1.2.3");
        expect(
            resolveActionlintVersion(undefined, {
                ACTIONLINT_RELEASE: "2.3.4",
            })
        ).toBe("2.3.4");
        expect(resolveActionlintVersion(undefined, {})).toBe(
            DEFAULT_ACTIONLINT_VERSION
        );
    });

    it("rejects release values that could escape the cache directory", () => {
        expect.assertions(2);

        expect(() => resolveActionlintVersion("v1.7.12", {})).toThrow(
            "without a leading 'v'"
        );
        expect(() => resolveActionlintVersion("../1.7.12", {})).toThrow(
            "Invalid Actionlint release version"
        );
    });

    it("preserves the bridge cache environment contract", () => {
        expect.assertions(2);

        const root = path.parse(process.cwd()).root;
        const customCacheRoot = path.join("custom", "cache");

        expect(
            getActionlintCacheDirectory({
                ACTIONLINT_CACHE_DIR: customCacheRoot,
            })
        ).toBe(path.join(customCacheRoot, "bin"));
        expect(
            getActionlintCacheDirectory({
                HOME: root,
            })
        ).toBe(path.join(root, ".github-actionlint", "bin"));
    });
});
