import { ESLint, type Linter } from "eslint";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import actionlintPlugin from "../src/plugin";

const bridgeConfig = actionlintPlugin.configs.actionlintOnly as Linter.Config;
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

const usingTemporaryDirectory = async <Result>(
    prefix: string,
    callback: (temporaryDirectory: string) => Promise<Result>
): Promise<Result> => {
    const temporaryDirectory = mkdtempSync(path.join(tmpdir(), prefix));
    try {
        return await callback(temporaryDirectory);
    } finally {
        rmSync(temporaryDirectory, { force: true, recursive: true });
    }
};
const createEngine = (
    ruleOptions: Readonly<Record<string, unknown>> = {}
): ESLint =>
    new ESLint({
        overrideConfig: [
            {
                ...bridgeConfig,
                rules: {
                    "actionlint/actionlint": ["error", ruleOptions],
                },
            },
        ],
        overrideConfigFile: true,
    });

describe("actionlint bridge rule", () => {
    it("reports Actionlint diagnostics through ESLint", async () => {
        expect.assertions(3);

        await usingTemporaryDirectory(
            "actionlint-bridge-",
            async (temporaryDirectory) => {
                const configPath = path.join(
                    temporaryDirectory,
                    "ActionLintConfig.yaml"
                );
                writeFileSync(configPath, "config-variables:\n  - NODE_ENV\n");
                const eslint = createEngine({
                    configFile: configPath,
                    pyflakes: false,
                    shellcheck: false,
                });
                const [result] = await eslint.lintText(invalidWorkflowText, {
                    filePath: ".github/workflows/test.yml",
                });

                expect(result?.messages).not.toHaveLength(0);
                expect(result?.messages[0]?.ruleId).toBe(
                    "actionlint/actionlint"
                );
                expect(result?.messages[0]?.message).toStrictEqual(
                    expect.any(String)
                );
            }
        );
    }, 30_000);
});
