# All

Enable the Actionlint bridge and every Actionlint config-authoring rule shipped by this plugin.

Use this preset when you want the broadest policy surface and are comfortable with new config rules becoming active as the plugin grows.

## Flat config example

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.all];
```

## Best fit

- Repository templates that should enforce the full Actionlint policy from day one.
- Shared workflow packages with a low tolerance for config drift.
- Mature repositories after the recommended preset has already been rolled out.

## What this preset includes

- `actionlint/actionlint`
- Every configuration-authoring rule currently exported by the plugin.

## What this preset does not include

- Nothing from this plugin is excluded.

## Related preset docs

- [Presets overview](./index.md)
- [Recommended preset](./recommended.md)
- [Actionlint-only preset](./actionlint-only.md)
- [Configuration preset](./configuration.md)

## Rules in this preset

<!-- GENERATED_PRESET_RULES_MATRIX_START -->

This table is generated from runtime plugin metadata for `actionlint.configs.all`.

Fix legend:

- `🔧` = autofixable
- `—` = report only

| Rule                                                                                                                                                                        | Fix | This preset | Also enabled in                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :---------- | :------------------------------------------------ |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🧪](./actionlint-only.md) |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | 🟣 Enabled  | [🔧](./configuration.md)                          |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | 🟣 Enabled  | [🟡](./recommended.md) [🔧](./configuration.md)   |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | 🟣 Enabled  | [🔧](./configuration.md)                          |

<!-- GENERATED_PRESET_RULES_MATRIX_END -->
