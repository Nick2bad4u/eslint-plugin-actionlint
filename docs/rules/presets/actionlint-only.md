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
