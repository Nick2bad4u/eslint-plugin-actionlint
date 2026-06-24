import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createNoEmptyStringRule } from "../_internal/config-rule-factories.js";

/**
 * DisallowActionlintEmptyIgnorePatternsRule ESLint rule contract.
 */
const disallowActionlintEmptyIgnorePatternsRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createNoEmptyStringRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description: "disallow empty Actionlint ignore patterns.",
    name: "disallow-actionlint-empty-ignore-patterns",
    recommended: true,
});

export default disallowActionlintEmptyIgnorePatternsRule;
