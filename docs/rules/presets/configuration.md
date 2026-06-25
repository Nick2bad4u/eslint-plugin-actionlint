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
