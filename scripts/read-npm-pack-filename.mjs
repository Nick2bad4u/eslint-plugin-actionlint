#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const [packMetadataPath] = process.argv.slice(2);

if (packMetadataPath === undefined) {
    throw new TypeError("Missing npm pack metadata path.");
}

const packMetadata = /** @type {unknown} */ (
    JSON.parse(await readFile(packMetadataPath, "utf8"))
);
const entries = Array.isArray(packMetadata)
    ? packMetadata
    : packMetadata !== null && typeof packMetadata === "object"
      ? Object.values(packMetadata)
      : [];
const [entry] = entries;

if (
    entries.length !== 1 ||
    entry === null ||
    typeof entry !== "object" ||
    !("filename" in entry) ||
    typeof entry.filename !== "string"
) {
    throw new TypeError("Unexpected npm pack --json output.");
}

process.stdout.write(entry.filename);
