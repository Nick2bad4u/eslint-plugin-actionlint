import type { JsonObject } from "type-fest";

import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import * as path from "node:path";
import { isMainThread, parentPort } from "node:worker_threads";
import { isDefined, stringSplit } from "ts-extras";

import type {
    ActionlintWorkerRequest,
    ActionlintWorkerResponse,
    SerializableActionlintMessage,
    SerializableActionlintResult,
} from "./actionlint-worker-types.js";

const DONE_STATE = 1 as const;
const DEFAULT_TIMEOUT_IN_MILLISECONDS = 30_000 as const;
const requireFromWorker = createRequire(import.meta.url);
const packageJsonPath = requireFromWorker.resolve(
    "github-actionlint/package.json"
);
const packageRoot = path.dirname(packageJsonPath);
const actionlintEntry = path.join(packageRoot, "dist", "bin", "actionlint.js");
type JsonRecord = Readonly<JsonObject>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
    typeof value === "object" && value !== null;

const toJsonRecord = (value: unknown): JsonRecord =>
    isJsonRecord(value) ? value : {};

const toSpawnArguments = (
    request: ActionlintWorkerRequest,
    temporaryFilePath: string
): string[] => {
    const options = request.options;
    const cwd = options.cwd ?? process.cwd();
    const args = [
        actionlintEntry,
        "-format",
        "{{json .}}",
    ];
    if (isDefined(options.configFile)) {
        args.push("-config-file", path.resolve(cwd, options.configFile));
    }
    if (options.shellcheck === false) args.push("-shellcheck", "");
    else if (typeof options.shellcheck === "string")
        args.push("-shellcheck", options.shellcheck);
    if (options.pyflakes === false) args.push("-pyflakes", "");
    else if (typeof options.pyflakes === "string")
        args.push("-pyflakes", options.pyflakes);
    const ignorePatterns = options.ignore ?? [];
    for (const pattern of ignorePatterns) args.push("-ignore", pattern);
    args.push(temporaryFilePath);
    return args;
};

const parseActionlintOutput = (
    stdout: string
): SerializableActionlintMessage[] => {
    const messages: SerializableActionlintMessage[] = [];
    const pushParsedMessage = (value: unknown, fallback: string): void => {
        const parsed = toJsonRecord(value);
        const column = parsed["column"];
        const endColumn = parsed["end_column"];
        const endLine = parsed["end_line"];
        const kind = parsed["kind"];
        const lineNumber = parsed["line"];
        const message = parsed["message"];
        messages.push({
            column: typeof column === "number" ? column : 1,
            ...(typeof endColumn === "number" && { endColumn }),
            ...(typeof endLine === "number" && { endLine }),
            kind: typeof kind === "string" ? kind : "actionlint",
            line: typeof lineNumber === "number" ? lineNumber : 1,
            message: typeof message === "string" ? message : fallback,
        });
    };
    const outputLines = stringSplit(stdout.replaceAll("\r\n", "\n"), "\n");
    for (const line of outputLines) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;
        const parsedJson: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsedJson)) {
            for (const item of parsedJson) pushParsedMessage(item, trimmed);
        } else {
            pushParsedMessage(parsedJson, trimmed);
        }
    }
    return messages;
};

const createTemporaryWorkflowPath = (
    request: ActionlintWorkerRequest
): readonly [directory: string, filePath: string] => {
    // eslint-disable-next-line n/no-sync -- The worker isolates blocking filesystem work so the ESLint rule can remain synchronous.
    const temporaryDirectory = mkdtempSync(
        path.join(tmpdir(), "eslint-actionlint-")
    );
    return [
        temporaryDirectory,
        path.join(
            temporaryDirectory,
            path.basename(request.options.codeFilename) || "workflow.yml"
        ),
    ];
};

const writeTemporaryWorkflow = (filePath: string, code: string): void => {
    // eslint-disable-next-line n/no-sync, security/detect-non-literal-fs-filename -- The file path is created from mkdtempSync in this worker.
    writeFileSync(filePath, code, "utf8");
};

const spawnActionlint = (
    request: ActionlintWorkerRequest,
    temporaryFilePath: string
): SpawnSyncReturns<string> =>
    // eslint-disable-next-line n/no-sync -- The synchronous worker bridge is required by ESLint rule execution.
    spawnSync(process.execPath, toSpawnArguments(request, temporaryFilePath), {
        cwd: request.options.cwd ?? process.cwd(),
        encoding: "utf8",
        timeout: request.options.timeoutMs ?? DEFAULT_TIMEOUT_IN_MILLISECONDS,
        windowsHide: true,
    });

const assertSuccessfulActionlintResult = (
    result: Readonly<SpawnSyncReturns<string>>
): void => {
    if (isDefined(result.error)) throw result.error;
    if ((result.status ?? 0) <= 1) return;
    throw new Error(
        result.stderr ||
            `Actionlint exited with status ${String(result.status)}.`
    );
};

const removeTemporaryDirectory = (temporaryDirectory: string): void => {
    // eslint-disable-next-line n/no-sync -- The worker owns this temporary directory and must remove it before responding.
    rmSync(temporaryDirectory, { force: true, recursive: true });
};

const runActionlint = (
    request: ActionlintWorkerRequest
): SerializableActionlintResult => {
    const [temporaryDirectory, temporaryFilePath] =
        createTemporaryWorkflowPath(request);
    try {
        writeTemporaryWorkflow(temporaryFilePath, request.options.code);
        const result = spawnActionlint(request, temporaryFilePath);
        assertSuccessfulActionlintResult(result);
        return { messages: parseActionlintOutput(result.stdout) };
    } finally {
        removeTemporaryDirectory(temporaryDirectory);
    }
};

const notifyCompletion = (
    request: ActionlintWorkerRequest,
    response: ActionlintWorkerResponse
): void => {
    // eslint-disable-next-line unicorn/require-post-message-target-origin -- MessagePort from node:worker_threads has no browser targetOrigin parameter.
    request.port.postMessage(response);
    request.port.close();
    const signal = new Int32Array(request.signalBuffer);
    Atomics.store(signal, 0, DONE_STATE);
    Atomics.notify(signal, 0);
};

const handleRequest = (request: ActionlintWorkerRequest): void => {
    try {
        notifyCompletion(request, { ok: true, result: runActionlint(request) });
    } catch (error: unknown) {
        const normalizedError =
            error instanceof Error
                ? {
                      message: error.message,
                      name: error.name,
                      ...(isDefined(error.stack) && { stack: error.stack }),
                  }
                : {
                      message: `Unknown Actionlint worker failure: ${String(error)}`,
                      name: "ActionlintWorkerError",
                  };
        notifyCompletion(request, { error: normalizedError, ok: false });
    }
};

if (!isMainThread) {
    const onMessage = (request: ActionlintWorkerRequest): void => {
        handleRequest(request);
    };
    const removeOnExit = (): void => {
        parentPort?.off("message", onMessage);
    };
    parentPort?.on("message", onMessage);
    process.once("exit", removeOnExit);
}
