# require-actionlint-config-file-naming-convention

Require config file naming convention keeps actionlint configuration files predictable when they are reviewed beside ESLint configuration.

> **Rule catalog ID:** R005

## Targeted pattern scope

This rule targets GitHub Actions workflow and Actionlint configuration. Use it in repositories where ESLint is the central feedback surface for local development, CI, and editor diagnostics.

### Matched patterns

- Files matched by the bridge rule or the configuration preset that enables `actionlint/require-actionlint-config-file-naming-convention`.
- `.github/actionlint.yml`, `.github/actionlint.yaml`, `ActionLintConfig.yml`, and `ActionLintConfig.yaml` files.

### Detection boundaries

The rule does not reimplement the full Actionlint configuration language. It validates the bridge-facing behavior that ESLint can report reliably and leaves deeper domain checks to Actionlint.

## What this rule reports

The rule reports Actionlint configuration files unless they use one of the established bridge names: `.github/actionlint.yml`, `.github/actionlint.yaml`, `ActionLintConfig.yml`, or `ActionLintConfig.yaml`.

## Why this rule exists

Bridge plugins are useful only when they preserve upstream behavior and keep configuration reviewable. This rule keeps actionlint feedback close to ESLint without forcing users to copy an entire upstream config into ESLint options.

## ❌ Incorrect

```yaml
// eslint.config.mjs
export default [{
  rules: {
    "actionlint/require-actionlint-config-file-naming-convention": "error"
  }
}];

// config file present: actionlint.config.yaml
```

## ✅ Correct

```yaml
// config file present: .github/actionlint.yml
```

## Behavior and migration notes

Start with the recommended preset when adopting the plugin. Move project-specific actionlint options into the upstream config file and keep ESLint options limited to file selection, config path, and bridge behavior.

## Additional examples

```js
import actionlint from "eslint-plugin-actionlint";

export default [
 actionlint.configs.recommended,
 {
  rules: {
   "actionlint/require-actionlint-config-file-naming-convention": "error",
  },
 },
];
```

## ESLint flat config example

```js
import actionlint from "eslint-plugin-actionlint";

export default [actionlint.configs.recommended];
```

## When not to use it

Do not enable this rule when Actionlint is intentionally run outside ESLint and duplicate editor or CI diagnostics would slow the project down.

## Package documentation

eslint-plugin-actionlint package documentation:

- [Plugin README](https://github.com/Nick2bad4u/eslint-plugin-actionlint#readme)
- [Rule source](https://github.com/Nick2bad4u/eslint-plugin-actionlint/tree/main/src/rules)

## Further reading

- [Actionlint documentation](https://github.com/rhysd/actionlint)
- [ESLint flat config documentation](https://eslint.org/docs/latest/use/configure/configuration-files)

## Adoption resources

- Enable the recommended preset first.
- Keep upstream configuration in `.github/actionlint.yml` unless a rule option explicitly asks for a different file.
- Run `npm run lint:remark` before publishing docs changes so heading drift is caught locally.
