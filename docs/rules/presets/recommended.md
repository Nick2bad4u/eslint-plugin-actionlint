# Recommended

Enable the Actionlint bridge plus the common Actionlint config-authoring checks.

This is the default rollout path for most repositories. It surfaces workflow findings in ESLint while enforcing low-noise config structure rules.

## Flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.recommended];
```

## Best fit

- Application and package repositories that want one ESLint command to cover workflow YAML and Actionlint config files.
- Teams adopting Actionlint in editors and CI at the same time.
- Repositories that want config hygiene without enabling every stricter policy immediately.

## What this preset includes

- `actionlint/actionlint`
- High-signal Actionlint config rules for required objects, expected arrays, file naming, unknown properties, and empty ignore patterns.

## What this preset does not include

- More opinionated config cleanup from [`configuration`](./configuration.md), such as ignore-array preference and config array sorting.
- The full policy surface from [`all`](./all.md).

## Related preset docs

- [Presets overview](./index.md)
- [Actionlint-only preset](./actionlint-only.md)
- [Configuration preset](./configuration.md)
- [All preset](./all.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `actionlint.configs.recommended`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                                        | Fix | This preset | Also enabled in                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :---------------------------------------- |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | 🟡 Enabled  | [🧪](./actionlint-only.md) [🟣](./all.md) |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)   |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | 🟡 Enabled  | [🔧](./configuration.md) [🟣](./all.md)   |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | —           | [🔧](./configuration.md) [🟣](./all.md)   |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
