import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const runnerEntryUrl = new URL(
    "../src/_internal/actionlint-runner.ts",
    import.meta.url
).href;

describe("actionlint worker lifecycle", () => {
    it("allows an isolated process to exit after bridge execution", () => {
        expect.hasAssertions();

        const script = `
            import { runActionlintSynchronously } from ${JSON.stringify(runnerEntryUrl)};
            runActionlintSynchronously({
                code: ${JSON.stringify("name: test\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo ${{ secrets.NOPE }}\n")},
                codeFilename: ".github/workflows/test.yml",
                cwd: process.cwd(),
                shellcheck: false, pyflakes: false,
            });
        `;
        const result = spawnSync(
            process.execPath,
            [
                "--experimental-strip-types",
                "--input-type=module",
                "--eval",
                script,
            ],
            {
                cwd: process.cwd(),
                encoding: "utf8",
                timeout: 20_000,
                windowsHide: true,
            }
        );

        expect(result.error?.message.includes("timed out") === true).toBe(
            false
        );
        expect(result.signal).toBeNull();
    }, 30_000);
});
