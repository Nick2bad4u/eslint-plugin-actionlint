import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createFilenameRule } from "../_internal/config-rule-factories.js";

const requireActionlintConfigFileNamingConventionRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createFilenameRule({
    allowedPattern:
        /(?:^|\/)(ActionLintConfig\.ya?ml|\.github\/actionlint\.ya?ml)$/v,
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description:
        "require Actionlint config files to use ActionLintConfig.yaml/yml or .github/actionlint.yaml/yml.",
    name: "require-actionlint-config-file-naming-convention",
    recommended: true,
});

export default requireActionlintConfigFileNamingConventionRule;
