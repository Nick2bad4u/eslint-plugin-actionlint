import type { ArrayValues } from "type-fest";

import { objectHasOwn } from "ts-extras";

/**
 * ActionlintConfigNames actionlint config names contract.
 */
export const actionlintConfigNames = [
    "actionlintOnly",
    "all",
    "configs",
    "configuration",
    "recommended",
    "workflows",
] as const;

/**
 * ActionlintConfigMetadata actionlint config metadata contract.
 */
export type ActionlintConfigMetadata = Readonly<{
    icon: string;
    presetName: `actionlint:${ActionlintConfigName}`;
    readmeOrder: number;
}>;

/**
 * ActionlintConfigName actionlint config name contract.
 */
export type ActionlintConfigName = ArrayValues<typeof actionlintConfigNames>;

/**
 * ActionlintConfigMetadataByName actionlint config metadata by name contract.
 */
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

/**
 * ActionlintConfigNamesByReadmeOrder actionlint config names by readme order
 * contract.
 */
export const actionlintConfigNamesByReadmeOrder: readonly ActionlintConfigName[] =
    [
        "recommended",
        "actionlintOnly",
        "configuration",
        "all",
    ];

/**
 * ActionlintConfigReferenceToName actionlint config reference to name contract.
 */
export const actionlintConfigReferenceToName = {
    "actionlint.configs.actionlintOnly": "actionlintOnly",
    "actionlint.configs.all": "all",
    "actionlint.configs.configs": "configuration",
    "actionlint.configs.configuration": "configuration",
    "actionlint.configs.recommended": "recommended",
    "actionlint.configs.workflows": "actionlintOnly",
} as const;

/**
 * ActionlintConfigReference actionlint config reference contract.
 */
export type ActionlintConfigReference =
    keyof typeof actionlintConfigReferenceToName;

/**
 * IsActionlintConfigReference is actionlint config reference contract.
 */
export const isActionlintConfigReference = (
    value: string
): value is ActionlintConfigReference =>
    objectHasOwn(actionlintConfigReferenceToName, value);
