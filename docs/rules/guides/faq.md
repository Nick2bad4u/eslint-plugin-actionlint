# FAQ

## Does this replace Actionlint?

No. The bridge delegates workflow analysis to Actionlint and reports the results through ESLint.

## Should I run Actionlint separately in CI?

Usually no, if ESLint already runs the `actionlint/actionlint` rule over workflow files. Running both can be useful during migration, but long term it creates duplicate findings.

## Where should Actionlint options live?

Keep Actionlint behavior in the Actionlint config file or in the bridge rule's narrow pass-through options. Use ESLint config for file selection, severity, and repository policy rules.

## Why are there config-authoring rules?

They catch config drift that native workflow validation does not try to police: filename conventions, object shape, unknown properties, empty entries, and stable sorting.

## Which preset should I use?

Use [`recommended`](../presets/recommended.md) for normal adoption. Use [`actionlint-only`](../presets/actionlint-only.md) when you only want upstream diagnostics, and [`configuration`](../presets/configuration.md) when another job already handles workflow validation.
