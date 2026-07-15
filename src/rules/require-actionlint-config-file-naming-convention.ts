import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createFilenameRule } from "../_internal/config-rule-factories.js";

/**
 * RequireActionlintConfigFileNamingConventionRule ESLint rule contract.
 */
const requireActionlintConfigFileNamingConventionRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createFilenameRule({
    allowedPattern: /(?:^|\/)\.github\/actionlint\.ya?ml$/v,
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description:
        "require Actionlint config files to use .github/actionlint.yaml or .github/actionlint.yml.",
    name: "require-actionlint-config-file-naming-convention",
    recommended: true,
});

export default requireActionlintConfigFileNamingConventionRule;
