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
