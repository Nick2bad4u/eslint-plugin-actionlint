import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createUnknownPropertiesRule } from "../_internal/config-rule-factories.js";

/**
 * DisallowActionlintUnknownConfigPropertiesRule ESLint rule contract.
 */
const disallowActionlintUnknownConfigPropertiesRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createUnknownPropertiesRule({
    allowedProperties: [
        "config-variables",
        "paths",
        "self-hosted-runner",
        "secrets",
    ],
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description: "disallow unknown top-level Actionlint config properties.",
    name: "disallow-actionlint-unknown-config-properties",
    recommended: true,
});

export default disallowActionlintUnknownConfigPropertiesRule;
