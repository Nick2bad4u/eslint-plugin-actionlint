import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const scriptPath = fileURLToPath(
    new URL("../scripts/read-npm-pack-filename.mjs", import.meta.url)
);

const runParser = async (packMetadata: unknown) => {
    const temporaryDirectory = await mkdtemp(
        path.join(tmpdir(), "eslint-plugin-actionlint-pack-")
    );
    const metadataPath = path.join(temporaryDirectory, "npm-pack.json");

    try {
        await writeFile(metadataPath, JSON.stringify(packMetadata), "utf8");

        return spawnSync(process.execPath, [scriptPath, metadataPath], {
            encoding: "utf8",
        });
    } finally {
        await rm(temporaryDirectory, { force: true, recursive: true });
    }
};

describe("read npm pack filename", () => {
    it("reads npm 12 object-shaped metadata", async () => {
        expect.assertions(3);

        const result = await runParser({
            "eslint-plugin-actionlint": {
                filename: "eslint-plugin-actionlint-1.0.2.tgz",
            },
        });

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe("eslint-plugin-actionlint-1.0.2.tgz");
    });

    it("keeps accepting npm 11 array-shaped metadata", async () => {
        expect.assertions(3);

        const result = await runParser([
            { filename: "eslint-plugin-actionlint-1.0.2.tgz" },
        ]);

        expect(result.status).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toBe("eslint-plugin-actionlint-1.0.2.tgz");
    });

    it("rejects ambiguous metadata instead of selecting the wrong tarball", async () => {
        expect.assertions(2);

        const result = await runParser([
            { filename: "first.tgz" },
            { filename: "second.tgz" },
        ]);

        expect(result.status).not.toBe(0);
        expect(result.stderr).toContain("Unexpected npm pack --json output.");
    });
});
