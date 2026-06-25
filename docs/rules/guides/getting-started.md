# Adoption checklist

Use this checklist when adding the plugin to an existing repository.

## Start small

- Enable [`actionlint.configs.recommended`](../presets/recommended.md) only for `.github/workflows/*.{yaml,yml}`.
- Run ESLint locally and in CI before adding config-authoring rules.
- Keep the native Actionlint config file as the source of truth for Actionlint behavior.

## Add policy after the bridge is green

- Add [`actionlint.configs.configuration`](../presets/configuration.md) for `.github/actionlint.{yaml,yml}`.
- Fix naming and shape problems before turning on stricter consistency rules in shared configs.
- Review the [tool behavior map](./tool-to-rule-map.md) if a finding looks like it could belong to either Actionlint or ESLint.

## CI rollout

Run ESLint in the same job that already checks TypeScript, Markdown, and package metadata. The value of the bridge is one diagnostics stream, not another standalone command that developers forget to run.
