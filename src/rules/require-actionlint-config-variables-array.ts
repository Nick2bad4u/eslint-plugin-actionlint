import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

/**
 * RequireActionlintConfigVariablesArrayRule ESLint rule contract.
 */
const requireActionlintConfigVariablesArrayRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description: "require config-variables to be an array when present.",
    name: "require-actionlint-config-variables-array",
    propertyName: "config-variables",
    recommended: true,
});

export default requireActionlintConfigVariablesArrayRule;
