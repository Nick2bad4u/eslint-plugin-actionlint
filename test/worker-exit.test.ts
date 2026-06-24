import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const runnerEntryUrl = new URL(
    "../src/_internal/actionlint-runner.ts",
    import.meta.url
);
const runnerEntry = runnerEntryUrl.href;
const secretExpression = ["$", "{{ secrets.NOPE }}"].join("");
const invalidWorkflowText = [
    "name: test",
    "on: [push]",
    "jobs:",
    "  build:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    `      - run: echo ${secretExpression}`,
    "",
].join("\n");

describe("actionlint worker lifecycle", () => {
    it("allows an isolated process to exit after bridge execution", () => {
        expect.assertions(2);

        const script = `
            import { runActionlintSynchronously } from ${JSON.stringify(runnerEntry)};
            runActionlintSynchronously({
                code: ${JSON.stringify(invalidWorkflowText)},
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

        expect(result.error).toBeUndefined();
        expect(result.signal).toBeNull();
    }, 30_000);
});
