# require-actionlint-self-hosted-runner-labels-array

require self-hosted-runner.labels to be an array when present.

## Rule details

This rule is part of `eslint-plugin-actionlint` and reports Actionlint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.recommended];
```
