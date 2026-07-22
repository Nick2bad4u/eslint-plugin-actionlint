import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import { getActionlintBinaryPath } from "../src/_internal/actionlint-binary";
import { resolveActionlintVersion } from "../src/_internal/actionlint-platform";

describe("official Actionlint binary", () => {
    it("downloads and runs the configured official release", async () => {
        expect.assertions(3);

        const version = resolveActionlintVersion();
        const binaryPath = await getActionlintBinaryPath(version);
        const result = spawnSync(binaryPath, ["-version"], {
            encoding: "utf8",
            timeout: 30_000,
            windowsHide: true,
        });

        expect(result.error).toBeUndefined();
        expect(result.status).toBe(0);
        expect(`${result.stdout}${result.stderr}`).toContain(version);
    }, 60_000);
});
