import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            collapsed: false,
            items: [
                "guides/intro",
                "guides/getting-started",
                "guides/actionlint-bridge",
                "guides/config-authoring",
                "guides/faq",
            ],
            label: "Guides",
            type: "category",
        },
        {
            collapsed: false,
            items: [
                "presets/recommended",
                "presets/actionlint-only",
                "presets/configuration",
                "presets/all",
            ],
            label: "Presets",
            link: { id: "presets/index", type: "doc" },
            type: "category",
        },
        {
            collapsed: false,
            items: [
                "actionlint",
                "require-actionlint-config-file-naming-convention",
                "require-actionlint-config-object",
                "disallow-actionlint-unknown-config-properties",
                "require-actionlint-config-variables-array",
                "require-actionlint-self-hosted-runner-labels-array",
                "require-actionlint-paths-object",
                "prefer-actionlint-ignore-arrays",
                "disallow-actionlint-empty-ignore-patterns",
                "sort-actionlint-config-arrays",
            ],
            label: "Rules",
            link: {
                slug: "/",
                title: "Rule Reference",
                type: "generated-index",
            },
            type: "category",
        },
    ],
} satisfies SidebarsConfig;
export default sidebars;
