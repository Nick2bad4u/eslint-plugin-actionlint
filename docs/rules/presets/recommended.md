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
