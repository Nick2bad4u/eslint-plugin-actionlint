# disallow-actionlint-unknown-config-properties

disallow unknown top-level Actionlint config properties.

## Rule details

This rule is part of `eslint-plugin-actionlint` and reports Actionlint bridge or config-authoring diagnostics through ESLint flat config.

## ESLint flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.recommended];
```
