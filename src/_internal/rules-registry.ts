import actionlintRule from "../rules/actionlint.js";
import disallowActionlintEmptyIgnorePatternsRule from "../rules/disallow-actionlint-empty-ignore-patterns.js";
import disallowActionlintUnknownConfigPropertiesRule from "../rules/disallow-actionlint-unknown-config-properties.js";
import preferActionlintIgnoreArraysRule from "../rules/prefer-actionlint-ignore-arrays.js";
import requireActionlintConfigFileNamingConventionRule from "../rules/require-actionlint-config-file-naming-convention.js";
import requireActionlintConfigObjectRule from "../rules/require-actionlint-config-object.js";
import requireActionlintConfigVariablesArrayRule from "../rules/require-actionlint-config-variables-array.js";
import requireActionlintPathsObjectRule from "../rules/require-actionlint-paths-object.js";
import requireActionlintSelfHostedRunnerLabelsArrayRule from "../rules/require-actionlint-self-hosted-runner-labels-array.js";
import sortActionlintConfigArraysRule from "../rules/sort-actionlint-config-arrays.js";

type ActionlintRulesRegistry = Readonly<{
    actionlint: typeof actionlintRule;
    "disallow-actionlint-empty-ignore-patterns": typeof disallowActionlintEmptyIgnorePatternsRule;
    "disallow-actionlint-unknown-config-properties": typeof disallowActionlintUnknownConfigPropertiesRule;
    "prefer-actionlint-ignore-arrays": typeof preferActionlintIgnoreArraysRule;
    "require-actionlint-config-file-naming-convention": typeof requireActionlintConfigFileNamingConventionRule;
    "require-actionlint-config-object": typeof requireActionlintConfigObjectRule;
    "require-actionlint-config-variables-array": typeof requireActionlintConfigVariablesArrayRule;
    "require-actionlint-paths-object": typeof requireActionlintPathsObjectRule;
    "require-actionlint-self-hosted-runner-labels-array": typeof requireActionlintSelfHostedRunnerLabelsArrayRule;
    "sort-actionlint-config-arrays": typeof sortActionlintConfigArraysRule;
}>;

export const actionlintRules: ActionlintRulesRegistry = {
    actionlint: actionlintRule,
    "disallow-actionlint-empty-ignore-patterns":
        disallowActionlintEmptyIgnorePatternsRule,
    "disallow-actionlint-unknown-config-properties":
        disallowActionlintUnknownConfigPropertiesRule,
    "prefer-actionlint-ignore-arrays": preferActionlintIgnoreArraysRule,
    "require-actionlint-config-file-naming-convention":
        requireActionlintConfigFileNamingConventionRule,
    "require-actionlint-config-object": requireActionlintConfigObjectRule,
    "require-actionlint-config-variables-array":
        requireActionlintConfigVariablesArrayRule,
    "require-actionlint-paths-object": requireActionlintPathsObjectRule,
    "require-actionlint-self-hosted-runner-labels-array":
        requireActionlintSelfHostedRunnerLabelsArrayRule,
    "sort-actionlint-config-arrays": sortActionlintConfigArraysRule,
} as const satisfies ActionlintRulesRegistry;

export type ActionlintRuleNamePattern = keyof typeof actionlintRules;

export default actionlintRules;
