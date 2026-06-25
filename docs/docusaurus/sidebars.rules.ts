import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars = {
    rules: [
        {
            className: "sb-doc-overview",
            id: "overview",
            label: "🏁 Overview",
            type: "doc",
        },
        {
            className: "sb-cat-guides",
            collapsed: false,
            items: [
                "guides/intro",
                "guides/getting-started",
                "guides/actionlint-bridge",
                "guides/config-authoring",
                "guides/tool-to-rule-map",
                "guides/faq",
            ],
            label: "📚 Guides",
            type: "category",
        },
        {
            className: "sb-cat-presets",
            collapsed: false,
            items: [
                {
                    className: "sb-preset-recommended",
                    id: "presets/recommended",
                    label: "🟡 Recommended",
                    type: "doc",
                },
                {
                    className: "sb-preset-only",
                    id: "presets/actionlint-only",
                    label: "🧪 Actionlint bridge only",
                    type: "doc",
                },
                {
                    className: "sb-preset-configuration",
                    id: "presets/configuration",
                    label: "🔧 Configuration",
                    type: "doc",
                },
                {
                    className: "sb-preset-all",
                    id: "presets/all",
                    label: "🟣 All",
                    type: "doc",
                },
            ],
            label: "🛠️ Presets",
            link: { id: "presets/index", type: "doc" },
            type: "category",
        },
        {
            className: "sb-cat-rules",
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
            label: "📜 Rules",
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
