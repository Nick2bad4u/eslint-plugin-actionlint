# Tool behavior to rule map

Use this page to decide whether a finding should come from Actionlint itself or from this plugin's ESLint rules.

| Concern                                      | Source of truth   | ESLint rule                                                                                                      |
| -------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| GitHub Actions workflow syntax and semantics | Actionlint        | [`actionlint/actionlint`](../actionlint.md)                                                                      |
| Actionlint config filename                   | Repository policy | [`require-actionlint-config-file-naming-convention`](../require-actionlint-config-file-naming-convention.md)     |
| Config root value                            | Repository policy | [`require-actionlint-config-object`](../require-actionlint-config-object.md)                                     |
| Known top-level config keys                  | Repository policy | [`disallow-actionlint-unknown-config-properties`](../disallow-actionlint-unknown-config-properties.md)           |
| `ignore` entries should be arrays            | Repository policy | [`prefer-actionlint-ignore-arrays`](../prefer-actionlint-ignore-arrays.md)                                       |
| Empty ignore patterns                        | Repository policy | [`disallow-actionlint-empty-ignore-patterns`](../disallow-actionlint-empty-ignore-patterns.md)                   |
| `paths` object shape                         | Repository policy | [`require-actionlint-paths-object`](../require-actionlint-paths-object.md)                                       |
| `variables` array shape                      | Repository policy | [`require-actionlint-config-variables-array`](../require-actionlint-config-variables-array.md)                   |
| Self-hosted runner label arrays              | Repository policy | [`require-actionlint-self-hosted-runner-labels-array`](../require-actionlint-self-hosted-runner-labels-array.md) |
| Stable config array ordering                 | Repository policy | [`sort-actionlint-config-arrays`](../sort-actionlint-config-arrays.md)                                           |

If the issue changes whether a workflow is valid, let Actionlint own it. If the issue makes the Actionlint config easier to review and share across repositories, enforce it with this plugin.
