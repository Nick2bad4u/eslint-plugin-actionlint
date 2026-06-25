# Configuration

Enable only the Actionlint config-authoring rules.

Use this preset when Actionlint workflow diagnostics are handled elsewhere, but ESLint should still keep `.github/actionlint.yml` style configuration predictable and reviewable.

## Flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [actionlint.configs.configuration];
```

Legacy alias: `actionlint.configs.configs` remains supported.

## Best fit

- Shared config repositories that publish Actionlint defaults.
- Monorepos with centralized workflow linting but local Actionlint config files.
- Teams that want config hygiene without running the workflow bridge through ESLint.

## What this preset includes

- Actionlint config filename checks.
- Required config object and array-shape checks.
- Unknown-property, empty-ignore, self-hosted runner label, path, variable, and sorting policy.

## What this preset does not include

- The `actionlint/actionlint` bridge rule.
- Workflow YAML diagnostics from upstream Actionlint.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Actionlint-only preset](./actionlint-only.md)
- [All preset](./all.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `actionlint.configs.configuration`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                                        | Fix | This preset | Also enabled in                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :--------------------------------------------------------------- |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | —           | [🟡](./recommended.md) [🧪](./actionlint-only.md) [🟣](./all.md) |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | 🔧 Enabled  | [🟣](./all.md)                                                   |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | 🔧 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                            |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | 🔧 Enabled  | [🟣](./all.md)                                                   |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
