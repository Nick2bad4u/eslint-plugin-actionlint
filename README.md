# eslint-plugin-actionlint

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-actionlint?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-actionlint/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-actionlint?color=pink)](https://www.npmjs.com/package/eslint-plugin-actionlint) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-actionlint?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-actionlint/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-actionlint?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-actionlint/stargazers)

`eslint-plugin-actionlint` runs Actionlint from ESLint and adds Actionlint-specific config authoring rules.

## Installation

```sh
npm install --save-dev eslint-plugin-actionlint eslint github-actionlint yaml-eslint-parser
```

### Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only
- **Node.js runtime:** `>=22.0.0`

## Quick start

```ts
import actionlint from "eslint-plugin-actionlint";

export default [...actionlint.configs.recommended];
```

## Presets

| Preset                                                                         | Purpose                                                      |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`actionlint.configs.recommended`](./docs/rules/presets/recommended.md)        | Enable the Actionlint bridge plus config authoring guidance. |
| [`actionlint.configs.actionlintOnly`](./docs/rules/presets/actionlint-only.md) | Enable only the Actionlint bridge workflow.                  |
| [`actionlint.configs.configuration`](./docs/rules/presets/configuration.md)    | Enable only Actionlint config authoring rules.               |
| [`actionlint.configs.all`](./docs/rules/presets/all.md)                        | Enable every rule shipped by the plugin.                     |

Aliases remain available:

- `actionlint.configs.workflows` -> `actionlint.configs.actionlintOnly`
- `actionlint.configs.configs` -> `actionlint.configs.configuration`

## Rules

Fix legend:

- `🔧` = autofixable
- `—` = report only

Preset key legend:

- [`🟡`](./docs/rules/presets/recommended.md) — [`actionlint.configs.recommended`](./docs/rules/presets/recommended.md)
- [`🧪`](./docs/rules/presets/actionlint-only.md) — [`actionlint.configs.actionlintOnly`](./docs/rules/presets/actionlint-only.md)
- [`🔧`](./docs/rules/presets/configuration.md) — [`actionlint.configs.configuration`](./docs/rules/presets/configuration.md)
- [`🟣`](./docs/rules/presets/all.md) — [`actionlint.configs.all`](./docs/rules/presets/all.md)

| Rule                                                                                                                                                                        | Fix | Preset key                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-: | :------------------------------------------------------------------------------------------------------------------------ |
| [`actionlint`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint)                                                                                 |  —  | [🟡](./docs/rules/presets/recommended.md) [🧪](./docs/rules/presets/actionlint-only.md) [🟣](./docs/rules/presets/all.md) |
| [`disallow-actionlint-empty-ignore-patterns`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-empty-ignore-patterns)                   |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`disallow-actionlint-unknown-config-properties`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/disallow-actionlint-unknown-config-properties)           |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`prefer-actionlint-ignore-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/prefer-actionlint-ignore-arrays)                                       |  —  | [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)                                             |
| [`require-actionlint-config-file-naming-convention`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-file-naming-convention)     |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`require-actionlint-config-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-object)                                     |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`require-actionlint-config-variables-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-config-variables-array)                   |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`require-actionlint-paths-object`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-paths-object)                                       |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`require-actionlint-self-hosted-runner-labels-array`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/require-actionlint-self-hosted-runner-labels-array) |  —  | [🟡](./docs/rules/presets/recommended.md) [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)   |
| [`sort-actionlint-config-arrays`](https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/sort-actionlint-config-arrays)                                           |  —  | [🔧](./docs/rules/presets/configuration.md) [🟣](./docs/rules/presets/all.md)                                             |
