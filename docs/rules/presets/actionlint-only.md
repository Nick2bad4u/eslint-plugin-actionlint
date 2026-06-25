# Actionlint bridge only

Enable only the Actionlint bridge rule for GitHub Actions workflow YAML.

This is the smallest adoption surface. It runs upstream Actionlint through ESLint and leaves Actionlint config-authoring policy out of the preset.

## Flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [actionlint.configs.actionlintOnly];
```

Legacy alias: `actionlint.configs.workflows` remains supported.

## Best fit

- Repositories that only want workflow diagnostics in ESLint.
- Teams migrating from a standalone `actionlint` CI step.
- Projects that already manage Actionlint config conventions elsewhere.

## What this preset includes

- `actionlint/actionlint`
- YAML parser wiring for the workflow files matched by the preset.

## What this preset does not include

- Actionlint config file naming checks.
- Shape, empty-value, duplicate, or sorting policy for Actionlint config files.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Configuration preset](./configuration.md)
- [All preset](./all.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `actionlint.configs.actionlintOnly`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                                        | Fix | This preset | Also enabled in                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------------------- |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | 🧪 Enabled  | [🟡](./recommended.md) [🟣](./all.md)                          |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                        |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | —           | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md) |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)                        |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
