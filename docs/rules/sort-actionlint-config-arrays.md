# sort-actionlint-config-arrays

sort Actionlint string-array settings for deterministic reviews.

## Rule details

This rule is part of `eslint-plugin-actionlint` and reports Actionlint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.recommended];
```
