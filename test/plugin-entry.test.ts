import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import actionlintPlugin from "../src/plugin";

const requireFromTestModule = createRequire(import.meta.url);
const packageJson = requireFromTestModule("../package.json") as {
    name: string;
    version: string;
};

describe("plugin entry module", () => {
    it("exports the default plugin object with rule and config registries", () => {
        expect(actionlintPlugin.meta).toStrictEqual(
            expect.objectContaining({
                name: "eslint-plugin-actionlint",
                namespace: "actionlint",
                version: packageJson.version,
            })
        );
        expect(Object.keys(actionlintPlugin.rules)).toContain("actionlint");
    });

    it("resolves the package through self-reference CJS require", () => {
        const runtimePlugin = requireFromTestModule(packageJson.name) as {
            meta?: { name?: string };
        };

        expect(runtimePlugin.meta?.name).toBe("eslint-plugin-actionlint");
    });
});
