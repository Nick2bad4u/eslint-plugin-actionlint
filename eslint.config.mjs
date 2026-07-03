import { createConfig } from "eslint-config-nick2bad4u";

import plugin from "./plugin.mjs";

const actionlintPlugin =
    /** @type {import("./src/plugin").ActionlintPlugin} */ (plugin);
const configurationPreset = actionlintPlugin.configs.configuration;
if (Array.isArray(configurationPreset))
    throw new TypeError(
        "Expected actionlint.configs.configuration to be a flat config object."
    );
const localConfigurationPreset = /** @type {import("eslint").Linter.Config} */ (
    configurationPreset
);

/** @type {import("eslint").Linter.Config[]} */
const config = [
    ...createConfig({
        allowDefaultProjectFilePatterns: [
            ".remarkrc.mjs",
            "eslint.config.mjs",
            "knip.config.ts",
            "prettier.config.mjs",
            "stylelint.config.mjs",
        ],
        plugins: { actionlint: false },
    }),
    {
        ignores: [
            ".github/workflows/**",
            "dist/**",
            "coverage/**",
            ".cache/**",
            "docs/docusaurus/.docusaurus/**",
            "docs/docusaurus/build/**",
            "docs/docusaurus/static/manifest.json",
            "docs/docusaurus/site-docs/**",
            "docs/docusaurus/static/*-inspector/**",
            "plugin.*",
            "test/**/*.test-d.ts",
            "untyped-third-party-modules.d.ts",
        ],
    },
    {
        files: ["docs/docusaurus/src/js/modern-enhancements.ts"],
        rules: {
            "unicorn/prefer-observer-apis": "off",
        },
    },
    {
        files: ["src/rules/**/*.ts"],
        rules: {
            "unicorn/consistent-boolean-name": "off",
        },
    },
    { ...localConfigurationPreset, name: "Local Actionlint config rules" },
];

export default config;
