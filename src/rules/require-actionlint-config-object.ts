import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

/**
 * RequireActionlintConfigObjectRule ESLint rule contract.
 */
const requireActionlintConfigObjectRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description:
        "require Actionlint config files to define a top-level mapping.",
    name: "require-actionlint-config-object",
    propertyName: "config-variables",
    recommended: true,
});

export default requireActionlintConfigObjectRule;
