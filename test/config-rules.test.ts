import type { RuleTester } from "@typescript-eslint/rule-tester";

import { ESLint, type Linter } from "eslint";
import { describe, expect, it } from "vitest";

import { hasConfigProperty } from "../src/_internal/config-rule-factories";
import actionlintPlugin from "../src/plugin";

type RuleWithDocs = Parameters<RuleTester["run"]>[1] & {
    meta: {
        docs: {
            url: string;
        };
    };
};

const isRuleModule = (value: unknown): value is RuleWithDocs =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as { create?: unknown }).create === "function" &&
    typeof (value as { meta?: { docs?: { url?: unknown } } }).meta?.docs
        ?.url === "string";

const configRules = actionlintPlugin.configs.configuration as Linter.Config;
const createConfigRuleEngine = (): ESLint =>
    new ESLint({
        overrideConfig: [
            {
                ...configRules,
                files: ["**/*.{yml,yaml}"],
            },
        ],
        overrideConfigFile: true,
    });

describe("actionlint config rules", () => {
    it("registers config-authoring rules with docs metadata", () => {
        expect.hasAssertions();
        expect(isRuleModule({})).not.toBe(true);

        for (const [name, rule] of Object.entries(actionlintPlugin.rules)) {
            if (!isRuleModule(rule)) {
                throw new TypeError(
                    `${name} is not a rule module with docs metadata.`
                );
            }

            expect(rule.meta.docs.url).toContain("/docs/rules/");
        }
    });

    it("detects Actionlint config properties across supported syntaxes", () => {
        expect.assertions(4);

        expect(
            hasConfigProperty(
                "config-variables:\n  - NODE_ENV\n",
                "config-variables"
            )
        ).toBe(true);
        expect(
            hasConfigProperty(
                "export default { paths: ['.github/workflows/*.yml'] };",
                "paths"
            )
        ).toBe(true);
        expect(
            hasConfigProperty(
                '{ "self-hosted-runner": { labels: [] } }',
                "self-hosted-runner"
            )
        ).toBe(true);
        expect(hasConfigProperty("secrets:\n  inherit: true\n", "paths")).toBe(
            false
        );
    });

    it("reports config-authoring problems through the configuration preset", async () => {
        expect.assertions(7);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            [
                "config-variables:",
                "  - NODE_ENV",
                "paths:",
                '  - ""',
                "unexpected-property: true",
                "",
            ].join("\n"),
            { filePath: "wrong-name.yaml" }
        );

        const messages = result?.messages ?? [];
        const ruleIds = new Set(messages.map((message) => message.ruleId));

        expect(ruleIds).toContain(
            "actionlint/disallow-actionlint-empty-ignore-patterns"
        );
        expect(ruleIds).toContain(
            "actionlint/disallow-actionlint-unknown-config-properties"
        );
        expect(ruleIds).toContain(
            "actionlint/require-actionlint-config-file-naming-convention"
        );
        expect(ruleIds).not.toContain(
            "actionlint/require-actionlint-config-object"
        );
        expect(messages.some((message) => message.line === 1)).toBe(true);
        expect(messages.map((message) => message.severity)).toStrictEqual(
            expect.arrayContaining([1])
        );
        expect(messages.map((message) => message.message)).toStrictEqual(
            expect.arrayContaining([
                expect.stringContaining("Unexpected top-level config property"),
            ])
        );
    });

    it("accepts valid Actionlint config files", async () => {
        expect.assertions(1);

        const eslint = createConfigRuleEngine();
        const [result] = await eslint.lintText(
            [
                "config-variables:",
                "  - NODE_ENV",
                "paths:",
                "  - .github/workflows/*.yml",
                "self-hosted-runner:",
                "  labels:",
                "    - linux",
                "",
            ].join("\n"),
            { filePath: ".github/actionlint.yaml" }
        );

        expect(result?.messages).toHaveLength(0);
    });
});
