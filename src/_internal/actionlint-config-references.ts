import type { ArrayValues } from "type-fest";

import { objectHasOwn } from "ts-extras";

export const actionlintConfigNames = [
    "actionlintOnly",
    "all",
    "configs",
    "configuration",
    "recommended",
    "workflows",
] as const;

export type ActionlintConfigMetadata = Readonly<{
    icon: string;
    presetName: `actionlint:${ActionlintConfigName}`;
    readmeOrder: number;
}>;

export type ActionlintConfigName = ArrayValues<typeof actionlintConfigNames>;

export const actionlintConfigMetadataByName: Readonly<
    Record<ActionlintConfigName, ActionlintConfigMetadata>
> = {
    actionlintOnly: {
        icon: "🧪",
        presetName: "actionlint:actionlintOnly",
        readmeOrder: 2,
    },
    all: { icon: "🟣", presetName: "actionlint:all", readmeOrder: 4 },
    configs: { icon: "🔧", presetName: "actionlint:configs", readmeOrder: 6 },
    configuration: {
        icon: "🔧",
        presetName: "actionlint:configuration",
        readmeOrder: 3,
    },
    recommended: {
        icon: "🟡",
        presetName: "actionlint:recommended",
        readmeOrder: 1,
    },
    workflows: {
        icon: "🧪",
        presetName: "actionlint:workflows",
        readmeOrder: 5,
    },
};

export const actionlintConfigNamesByReadmeOrder: readonly ActionlintConfigName[] =
    [
        "recommended",
        "actionlintOnly",
        "configuration",
        "all",
    ];

export const actionlintConfigReferenceToName = {
    "actionlint.configs.actionlintOnly": "actionlintOnly",
    "actionlint.configs.all": "all",
    "actionlint.configs.configs": "configuration",
    "actionlint.configs.configuration": "configuration",
    "actionlint.configs.recommended": "recommended",
    "actionlint.configs.workflows": "actionlintOnly",
} as const;

export type ActionlintConfigReference =
    keyof typeof actionlintConfigReferenceToName;

export const isActionlintConfigReference = (
    value: string
): value is ActionlintConfigReference =>
    objectHasOwn(actionlintConfigReferenceToName, value);
