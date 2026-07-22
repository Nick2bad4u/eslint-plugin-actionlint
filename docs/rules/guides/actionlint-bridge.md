# Actionlint bridge

The `actionlint/actionlint` rule runs Actionlint and converts upstream diagnostics into ESLint reports. ESLint owns file selection, ignore behavior, formatter output, and editor integration. Actionlint owns workflow parsing and GitHub Actions semantics.

## What the bridge reports

The bridge is for workflow files, typically `.github/workflows/*.{yaml,yml}`. It reports Actionlint findings such as invalid workflow syntax, invalid action usage, expression mistakes, and workflow-specific schema problems.

The plugin downloads Actionlint 1.7.12 from the official `rhysd/actionlint` GitHub release on first use, verifies the archive against the release's SHA-256 checksum manifest, and caches the executable. Set `ACTIONLINT_RELEASE` to select another official release, `ACTIONLINT_BIN` to use an existing executable, or `ACTIONLINT_CACHE_DIR` to move the cache. `GITHUB_TOKEN` is forwarded when downloading release assets.

## What stays upstream

Keep Actionlint-specific behavior in Actionlint configuration. Do not duplicate that config in ESLint unless the bridge rule exposes a small pass-through option for runtime wiring.

Use ESLint options for:

- Choosing which files ESLint visits.
- Deciding which preset or rule severity to apply.
- Integrating findings into an existing lint job.

Use Actionlint config for:

- Ignoring Actionlint findings.
- Customizing Actionlint's workflow checks.
- Actionlint-specific runtime behavior.

## Related rules

- [`actionlint/actionlint`](../actionlint.md) runs the bridge.
- [`require-actionlint-config-file-naming-convention`](../require-actionlint-config-file-naming-convention.md) keeps config file names predictable.
- [`disallow-actionlint-unknown-config-properties`](../disallow-actionlint-unknown-config-properties.md) catches config keys that the repository policy does not allow.
