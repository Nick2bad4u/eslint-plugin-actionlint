import { ESLint, type Linter } from "eslint";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import actionlintPlugin from "../src/plugin";

const bridgeConfig = actionlintPlugin.configs.actionlintOnly as Linter.Config;
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
        expect.hasAssertions();

        const temporaryDirectory = mkdtempSync(
            path.join(tmpdir(), "actionlint-bridge-")
        );
        try {
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
            const [result] = await eslint.lintText(
                "name: test\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo ${{ secrets.NOPE }}\n",
                {
                    filePath: ".github/workflows/test.yml",
                }
            );

            expect(result).toBeDefined();
            expect(result!.messages.length).toBeGreaterThan(0);
            expect(result!.messages[0]?.ruleId).toBe("actionlint/actionlint");
        } finally {
            rmSync(temporaryDirectory, { force: true, recursive: true });
        }
    }, 30_000);
});
