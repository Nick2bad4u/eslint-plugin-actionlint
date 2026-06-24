# actionlint

Run Actionlint through ESLint and surface upstream diagnostics in the same output stream as the rest of the project.

> **Rule catalog ID:** R001

## Targeted pattern scope

This rule targets GitHub Actions workflow and Actionlint configuration. Use it in repositories where ESLint is the central feedback surface for local development, CI, and editor diagnostics.

### Matched patterns

- Files matched by the bridge rule or the configuration preset that enables `actionlint/actionlint`.
- Native Actionlint diagnostics returned for project files.

### Detection boundaries

The rule does not reimplement the full Actionlint configuration language. It validates the bridge-facing behavior that ESLint can report reliably and leaves deeper domain checks to Actionlint.

## What this rule reports

The rule reports diagnostics emitted by Actionlint. ESLint receives the original message, location, and severity so editor output stays aligned with the upstream linter.

## Why this rule exists

Bridge plugins are useful only when they preserve upstream behavior and keep configuration reviewable. This rule keeps actionlint feedback close to ESLint without forcing users to copy an entire upstream config into ESLint options.

## ❌ Incorrect

```yaml
name: CI
on: push
jobs:
 test:
  runs-on: ubuntu-latestt
  steps:
   - run: npm test
```

## ✅ Correct

```yaml
name: CI
on: push
jobs:
 test:
  runs-on: ubuntu-latest
  steps:
   - run: npm test
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
   "actionlint/actionlint": "error",
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
