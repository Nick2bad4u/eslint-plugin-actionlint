import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

/**
 * RequireActionlintPathsObjectRule ESLint rule contract.
 */
const requireActionlintPathsObjectRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description: "require paths to be an object when present.",
    name: "require-actionlint-paths-object",
    propertyName: "paths",
    recommended: true,
});

export default requireActionlintPathsObjectRule;
