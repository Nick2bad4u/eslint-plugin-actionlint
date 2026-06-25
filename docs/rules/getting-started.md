# Getting started

Install `eslint-plugin-actionlint`, add one flat-config preset, and run ESLint over the workflow and config files you want covered.

## Install

```sh
npm install --save-dev eslint-plugin-actionlint
```

The plugin already depends on the Actionlint bridge runtime used by the `actionlint/actionlint` rule. You do not need to model the full Actionlint config inside ESLint.

## Add the recommended preset

```js
import actionlint from "eslint-plugin-actionlint";

export default [
 {
  files: [".github/workflows/*.{yaml,yml}"],
  ...actionlint.configs.recommended,
 },
];
```

Use the recommended preset first when the goal is to surface workflow diagnostics in the same ESLint stream as the rest of the repository.

## Add config-file checks

```js
import actionlint from "eslint-plugin-actionlint";

export default [
 {
  files: [".github/workflows/*.{yaml,yml}"],
  ...actionlint.configs.recommended,
 },
 {
  files: [".github/actionlint.{yaml,yml}"],
  ...actionlint.configs.configuration,
 },
];
```

The configuration preset checks repository conventions around Actionlint config files. Native workflow validation still belongs to Actionlint.

## Choose a narrower preset

- Use [`actionlint.configs.actionlintOnly`](./presets/actionlint-only.md) when you only want upstream Actionlint diagnostics.
- Use [`actionlint.configs.configuration`](./presets/configuration.md) when another job already runs Actionlint and ESLint should only police config files.
- Use [`actionlint.configs.all`](./presets/all.md) when you want every rule enabled explicitly.

Next, read the [Actionlint bridge guide](./guides/actionlint-bridge.md) and the [config-authoring guide](./guides/config-authoring.md).
