import type { ESLint, Linter } from "eslint";

import * as yamlParser from "yaml-eslint-parser";

import packageJson from "../package.json" with { type: "json" };
import {
    actionlintConfigMetadataByName,
    type ActionlintConfigName as InternalActionlintConfigName,
} from "./_internal/actionlint-config-references.js";
import { actionlintRules } from "./_internal/rules-registry.js";

export type ActionlintConfigName = InternalActionlintConfigName;

const pluginName = "eslint-plugin-actionlint" as const;
const pluginNamespace = "actionlint" as const;
const bridgeFiles = [".github/workflows/**/*.{yml,yaml}"] as const;
const configFiles = [
    "**/.github/actionlint.{yml,yaml}",
    "**/ActionLintConfig.{yml,yaml}",
] as const;

export type ActionlintConfig = Linter.Config | readonly Linter.Config[];
export type ActionlintConfigs = Record<ActionlintConfigName, ActionlintConfig>;
export type ActionlintRuleId = `actionlint/${ActionlintRuleName}`;
export type ActionlintRuleName = keyof typeof actionlintRules;
type FlatConfigRules = NonNullable<Linter.Config["rules"]>;

const eslintPluginRules = actionlintRules as NonNullable<
    ESLint.Plugin["rules"]
> &
    typeof actionlintRules;
const version =
    typeof packageJson.version === "string" ? packageJson.version : "0.0.0";

const actionlintPlugin: ESLint.Plugin & {
    configs: ActionlintConfigs;
    meta: { name: string; namespace: string; version: string };
    rules: typeof eslintPluginRules;
} = {
    configs: {
        actionlintOnly: {},
        all: [],
        configs: {},
        configuration: {},
        recommended: [],
        workflows: {},
    },
    meta: { name: pluginName, namespace: pluginNamespace, version },
    processors: {},
    rules: eslintPluginRules,
};

const actionlintOnlyPreset: Linter.Config = {
    files: [...bridgeFiles],

    languageOptions: { parser: yamlParser },
    name: actionlintConfigMetadataByName.actionlintOnly.presetName,
    plugins: { [pluginNamespace]: actionlintPlugin },
    rules: { "actionlint/actionlint": "error" },
};

const configurationRules = {
    "actionlint/disallow-actionlint-empty-ignore-patterns": "warn",
    "actionlint/disallow-actionlint-unknown-config-properties": "warn",
    "actionlint/prefer-actionlint-ignore-arrays": "warn",
    "actionlint/require-actionlint-config-file-naming-convention": "warn",
    "actionlint/require-actionlint-config-object": "warn",
    "actionlint/require-actionlint-config-variables-array": "warn",
    "actionlint/require-actionlint-paths-object": "warn",
    "actionlint/require-actionlint-self-hosted-runner-labels-array": "warn",
    "actionlint/sort-actionlint-config-arrays": "warn",
} as const satisfies FlatConfigRules;

const configurationPreset: Linter.Config = {
    files: [...configFiles],
    languageOptions: {
        parser: yamlParser,
        parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    name: actionlintConfigMetadataByName.configuration.presetName,
    plugins: { [pluginNamespace]: actionlintPlugin },
    rules: configurationRules,
};

actionlintPlugin.configs = {
    actionlintOnly: actionlintOnlyPreset,
    all: [actionlintOnlyPreset, configurationPreset],
    configs: configurationPreset,
    configuration: configurationPreset,
    recommended: [actionlintOnlyPreset, configurationPreset],
    workflows: actionlintOnlyPreset,
};

export type ActionlintPlugin = typeof actionlintPlugin;
export default actionlintPlugin;
