# Presets

`eslint-plugin-actionlint` exposes focused flat-config presets for GitHub Actions workflow linting and Actionlint config authoring.

- `🟡` [`actionlint.configs.recommended`](./recommended.md) — default rollout path for workflow diagnostics plus common config hygiene.
- `🧪` [`actionlint.configs.actionlintOnly`](./actionlint-only.md) — bridge-only workflow linting.
- `🔧` [`actionlint.configs.configuration`](./configuration.md) — config-authoring rules without workflow linting.
- `🟣` [`actionlint.configs.all`](./all.md) — every current bridge and config-authoring rule.

Legacy aliases remain available for compatibility:

- `actionlint.configs.workflows` → `actionlint.configs.actionlintOnly`
- `actionlint.configs.configs` → `actionlint.configs.configuration`

Use the preset pages in this section for copy/paste config snippets and rollout notes.

## Rule matrix

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./recommended.md) — [`actionlint.configs.recommended`](./recommended.md)
- [`🧪`](./actionlint-only.md) — [`actionlint.configs.actionlintOnly`](./actionlint-only.md)
- [`🔧`](./configuration.md) — [`actionlint.configs.configuration`](./configuration.md)
- [`🟣`](./all.md) — [`actionlint.configs.all`](./all.md)

| Rule                                                                                                                                                                        | Fix | Preset key                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :--------------------------------------------------------------- |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | [🟡](./recommended.md) [🧪](./actionlint-only.md) [🟣](./all.md) |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | [🔧](./configuration.md) [🟣](./all.md)                          |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | [🟡](./recommended.md) [🔧](./configuration.md) [🟣](./all.md)   |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | [🔧](./configuration.md) [🟣](./all.md)                          |
