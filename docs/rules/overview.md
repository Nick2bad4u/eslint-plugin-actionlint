# Rule overview

`eslint-plugin-actionlint` brings Actionlint diagnostics into the ESLint run you already use for editors, CI, and pull-request checks. The bridge rule runs the upstream Actionlint CLI, while the config-authoring rules keep common Actionlint policy decisions close to the rest of your flat config.

## What belongs here

Use this plugin when GitHub Actions workflow files should fail in the same lint job as TypeScript, Markdown, package metadata, and other repository policy checks. The plugin does not reimplement Actionlint's workflow parser or validation model. It delegates workflow analysis to Actionlint and translates the findings into ESLint reports.

## Recommended path

Start with `actionlint.configs.recommended` for normal workflow diagnostics. Add `actionlint.configs.configuration` when a repository has an Actionlint config file and you want ESLint to enforce naming, object shape, expected arrays, known top-level properties, and sorted config arrays.

## Rule groups

| Group              | Use it for                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Bridge diagnostics | Run Actionlint against workflow text and surface native findings through ESLint.                  |
| Config shape       | Catch missing config objects, unknown top-level config keys, and unsupported filenames.           |
| Config consistency | Prefer arrays for multi-value fields, reject empty ignore entries, and keep config arrays sorted. |

## Upstream options

Pass upstream behavior through the bridge rule options instead of duplicating Actionlint configuration in ESLint. Use the Actionlint config file for Actionlint-specific policy, and use this plugin's config rules for repository conventions around that config file.
