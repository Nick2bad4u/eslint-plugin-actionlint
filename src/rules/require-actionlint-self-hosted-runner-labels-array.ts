import type { RuleModuleWithDocs } from "../_internal/typed-rule.js";

import { createRequirePropertyRule } from "../_internal/config-rule-factories.js";

const requireActionlintSelfHostedRunnerLabelsArrayRule: RuleModuleWithDocs<
    "configProblem",
    readonly []
> = createRequirePropertyRule({
    configs: [
        "actionlint.configs.configuration",
        "actionlint.configs.recommended",
        "actionlint.configs.all",
    ],
    description:
        "require self-hosted-runner.labels to be an array when present.",
    name: "require-actionlint-self-hosted-runner-labels-array",
    propertyName: "self-hosted-runner",
    recommended: true,
});

export default requireActionlintSelfHostedRunnerLabelsArrayRule;
