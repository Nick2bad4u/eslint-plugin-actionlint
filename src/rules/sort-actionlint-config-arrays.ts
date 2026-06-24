import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const sortActionlintConfigArraysRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description:
        "sort Actionlint string-array settings for deterministic reviews.",
    name: "sort-actionlint-config-arrays",
    propertyName: "config-variables",
    recommended: false,
});

export default sortActionlintConfigArraysRule;
