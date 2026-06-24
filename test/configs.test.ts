import { describe, expect, it } from "vitest";

import { actionlintConfigNames } from "../src/_internal/actionlint-config-references";
import actionlintPlugin from "../src/plugin";

describe("actionlint plugin configs", () => {
    it("exports exactly the supported config keys", () => {
        expect(Object.keys(actionlintPlugin.configs).toSorted()).toStrictEqual(
            [...actionlintConfigNames].toSorted()
        );
    });

    it("keeps aliases wired to preferred preset names", () => {
        expect(actionlintPlugin.configs.workflows).toBe(
            actionlintPlugin.configs.actionlintOnly
        );
        expect(actionlintPlugin.configs.configs).toBe(
            actionlintPlugin.configs.configuration
        );
    });
});
