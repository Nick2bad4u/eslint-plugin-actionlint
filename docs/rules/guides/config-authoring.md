# Config authoring

The configuration preset checks Actionlint config files as repository policy. It is not a replacement for Actionlint's own workflow analysis.

## What to enforce

- Use the expected Actionlint config filename so tools and humans find it quickly.
- Keep the config root as an object.
- Reject unknown top-level properties.
- Prefer arrays for multi-value fields.
- Avoid empty ignore patterns.
- Keep arrays sorted when order is not meaningful.

## Example

```js
import actionlint from "eslint-plugin-actionlint";

export default [
 {
  files: [".github/actionlint.{yaml,yml}"],
  ...actionlint.configs.configuration,
 },
];
```

## Related pages

Use the [configuration preset](../presets/configuration.md) for the curated set. Use the [tool behavior map](./tool-to-rule-map.md) to decide whether a policy should be enforced by Actionlint or by one of this plugin's config-authoring rules.
