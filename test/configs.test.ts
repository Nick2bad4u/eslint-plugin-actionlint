import type { Linter } from "eslint";

import { describe, expect, it } from "vitest";

import { actionlintConfigNames } from "../src/_internal/actionlint-config-references";
import actionlintPlugin, { type ActionlintConfig } from "../src/plugin";

const toNameSet = (values: Iterable<string>): ReadonlySet<string> =>
    new Set(values);

const isConfigArray = (
    config: ActionlintConfig
): config is readonly Linter.Config[] => Array.isArray(config);

const enabledRules = (configName: "all" | "recommended"): readonly string[] =>
    (isConfigArray(actionlintPlugin.configs[configName])
        ? actionlintPlugin.configs[configName]
        : [actionlintPlugin.configs[configName]]
    ).flatMap((config) => Object.keys(config.rules ?? {}));

describe("actionlint plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        expect.assertions(1);

        expect(toNameSet(Object.keys(actionlintPlugin.configs))).toStrictEqual(
            toNameSet(actionlintConfigNames)
        );
    });

    it("keeps aliases wired to preferred preset names", () => {
        expect.assertions(2);

        expect(actionlintPlugin.configs.workflows).toBe(
            actionlintPlugin.configs.actionlintOnly
        );
        expect(actionlintPlugin.configs.configs).toBe(
            actionlintPlugin.configs.configuration
        );
    });

    it("keeps recommended narrower than all", () => {
        expect.assertions(4);

        expect(toNameSet(enabledRules("recommended"))).toStrictEqual(
            toNameSet([
                "actionlint/actionlint",
                "actionlint/disallow-actionlint-empty-ignore-patterns",
                "actionlint/disallow-actionlint-unknown-config-properties",
                "actionlint/require-actionlint-config-file-naming-convention",
                "actionlint/require-actionlint-config-object",
                "actionlint/require-actionlint-config-variables-array",
                "actionlint/require-actionlint-paths-object",
                "actionlint/require-actionlint-self-hosted-runner-labels-array",
            ])
        );
        expect(enabledRules("all")).toContain(
            "actionlint/prefer-actionlint-ignore-arrays"
        );
        expect(enabledRules("all")).toContain(
            "actionlint/sort-actionlint-config-arrays"
        );
        expect(enabledRules("recommended")).not.toContain(
            "actionlint/sort-actionlint-config-arrays"
        );
    });
});
