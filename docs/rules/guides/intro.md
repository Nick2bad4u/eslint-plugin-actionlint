# Guide overview

`eslint-plugin-actionlint` is a bridge plugin. It lets ESLint run Actionlint and report the same workflow findings you would expect from Actionlint, while separate rules cover the shape and maintainability of Actionlint config files.

## Use the guides in this order

1. Start with [Getting started](../getting-started.md) to add the recommended preset.
2. Read [Actionlint bridge](./actionlint-bridge.md) when you need to understand what the bridge rule delegates to upstream Actionlint.
3. Read [Config authoring](./config-authoring.md) before enabling the configuration preset on `.github/actionlint.yml`.
4. Use [Tool behavior to rule map](./tool-to-rule-map.md) when deciding whether a finding should come from Actionlint or from this plugin's ESLint rules.

## Boundary

This plugin should not become a second Actionlint implementation. If a setting changes how workflows are interpreted, keep it in the Actionlint config file or in the bridge rule options. If a rule enforces repository consistency around that config file, it belongs in the configuration preset.
