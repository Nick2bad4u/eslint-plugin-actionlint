import { ESLint, type Linter } from "eslint";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { describe, expect, it } from "vitest";

import actionlintPlugin from "../src/plugin";

const bridgeConfig = actionlintPlugin.configs.actionlintOnly as Linter.Config;
const invalidWorkflowText = [
    "name: test",
    "on: [push]",
    "jobs:",
    "  build:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - uses: actions/checkout@v4",
    "        with:",
    "          definitely-not-real: true",
    "",
].join("\n");
const validWorkflowText = [
    "name: test",
    "on: [push]",
    "jobs:",
    "  build:",
    "    runs-on: ubuntu-latest",
    "    steps:",
    "      - run: echo ok",
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
    it("accepts valid workflow files without diagnostics", async () => {
        expect.assertions(1);

        const eslint = createEngine({
            ignore: [],
            pyflakes: false,
            shellcheck: false,
            timeoutMs: 30_000,
        });
        const [result] = await eslint.lintText(validWorkflowText, {
            filePath: ".github/workflows/test.yml",
        });

        expect(result?.messages).toHaveLength(0);
    }, 30_000);

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

    it("reports Actionlint execution failures as configuration errors", async () => {
        expect.assertions(2);

        const eslint = createEngine({
            configFile: "missing-actionlint-config.yaml",
            pyflakes: false,
            shellcheck: false,
        });
        const [result] = await eslint.lintText(validWorkflowText, {
            filePath: ".github/workflows/test.yml",
        });

        expect(result?.messages[0]?.ruleId).toBe("actionlint/actionlint");
        expect(result?.messages[0]?.message).toContain(
            "Actionlint configuration error"
        );
    }, 30_000);
});
