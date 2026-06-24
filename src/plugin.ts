import type { ESLint, Linter } from "eslint";

import * as yamlParser from "yaml-eslint-parser";

// eslint-disable-next-line import-x/extensions -- Node JSON import attributes require the file extension at runtime.
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

const eslintPluginRules: typeof actionlintRules = actionlintRules;
const version =
    typeof packageJson.version === "string" ? packageJson.version : "0.0.0";

const actionlintPlugin: {
    configs: ActionlintConfigs;
    meta: { name: string; namespace: string; version: string };
    processors: NonNullable<ESLint.Plugin["processors"]>;
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
const actionlintPluginForEslint =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- ESLint's public Plugin type requires mutable option/config arrays, while this package exposes readonly typed rule metadata internally.
    actionlintPlugin as unknown as ESLint.Plugin;

const actionlintOnlyPreset: Linter.Config = {
    files: [...bridgeFiles],

    languageOptions: { parser: yamlParser },
    name: actionlintConfigMetadataByName.actionlintOnly.presetName,
    plugins: { [pluginNamespace]: actionlintPluginForEslint },
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

const recommendedConfigurationRules = {
    "actionlint/disallow-actionlint-empty-ignore-patterns": "warn",
    "actionlint/disallow-actionlint-unknown-config-properties": "warn",
    "actionlint/require-actionlint-config-file-naming-convention": "warn",
    "actionlint/require-actionlint-config-object": "warn",
    "actionlint/require-actionlint-config-variables-array": "warn",
    "actionlint/require-actionlint-paths-object": "warn",
    "actionlint/require-actionlint-self-hosted-runner-labels-array": "warn",
} as const satisfies FlatConfigRules;

const configurationPreset: Linter.Config = {
    files: [...configFiles],
    languageOptions: {
        parser: yamlParser,
        parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    name: actionlintConfigMetadataByName.configuration.presetName,
    plugins: { [pluginNamespace]: actionlintPluginForEslint },
    rules: configurationRules,
};

const recommendedConfigurationPreset: Linter.Config = {
    ...configurationPreset,
    name: actionlintConfigMetadataByName.recommended.presetName,
    rules: recommendedConfigurationRules,
};

actionlintPlugin.configs = {
    actionlintOnly: actionlintOnlyPreset,
    all: [actionlintOnlyPreset, configurationPreset],
    configs: configurationPreset,
    configuration: configurationPreset,
    recommended: [actionlintOnlyPreset, recommendedConfigurationPreset],
    workflows: actionlintOnlyPreset,
};

export type ActionlintPlugin = typeof actionlintPlugin;
export default actionlintPlugin;
