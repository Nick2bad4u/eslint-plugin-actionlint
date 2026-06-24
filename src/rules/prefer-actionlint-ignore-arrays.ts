import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const preferActionlintIgnoreArraysRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description: "prefer ignore entries to be arrays of patterns.",
    name: "prefer-actionlint-ignore-arrays",
    propertyName: "config-variables",
    recommended: false,
});

export default preferActionlintIgnoreArraysRule;
