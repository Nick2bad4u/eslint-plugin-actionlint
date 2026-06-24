import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { isMainThread, parentPort } from "node:worker_threads";
import { isDefined, safeCastTo, stringSplit } from "ts-extras";

import type {
    ActionlintWorkerRequest,
    ActionlintWorkerResponse,
    SerializableActionlintMessage,
    SerializableActionlintResult,
} from "./actionlint-worker-types.js";

const DONE_STATE = 1 as const;
const requireFromWorker = createRequire(import.meta.url);
const packageJsonPath = requireFromWorker.resolve(
    "github-actionlint/package.json"
);
const packageRoot = path.dirname(packageJsonPath);
const actionlintEntry = path.join(packageRoot, "dist", "bin", "actionlint.js");

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
    for (const pattern of options.ignore ?? []) args.push("-ignore", pattern);
    args.push(temporaryFilePath);
    return args;
};

const parseActionlintOutput = (
    stdout: string
): SerializableActionlintMessage[] => {
    const messages: SerializableActionlintMessage[] = [];
    for (const line of stringSplit(stdout.replaceAll("\r\n", "\n"), "\n")) {
        const trimmed = line.trim();
        if (trimmed.length === 0) continue;
        const parsed = safeCastTo<{
            column?: unknown;
            kind?: unknown;
            line?: unknown;
            message?: unknown;
        }>(JSON.parse(trimmed));
        messages.push({
            column: typeof parsed.column === "number" ? parsed.column : 1,
            kind: typeof parsed.kind === "string" ? parsed.kind : "actionlint",
            line: typeof parsed.line === "number" ? parsed.line : 1,
            message:
                typeof parsed.message === "string" ? parsed.message : trimmed,
        });
    }
    return messages;
};

const runActionlint = (
    request: ActionlintWorkerRequest
): SerializableActionlintResult => {
    const temporaryDirectory = mkdtempSync(
        path.join(tmpdir(), "eslint-actionlint-")
    );
    const temporaryFilePath = path.join(
        temporaryDirectory,
        path.basename(request.options.codeFilename) || "workflow.yml"
    );
    try {
        writeFileSync(temporaryFilePath, request.options.code, "utf8");
        const result = spawnSync(
            process.execPath,
            toSpawnArguments(request, temporaryFilePath),
            {
                cwd: request.options.cwd ?? process.cwd(),
                encoding: "utf8",
                timeout: request.options.timeoutMs ?? 30_000,
                windowsHide: true,
            }
        );
        if (isDefined(result.error)) throw result.error;
        if ((result.status ?? 0) > 1) {
            throw new Error(
                result.stderr ||
                    `Actionlint exited with status ${String(result.status)}.`
            );
        }
        return { messages: parseActionlintOutput(result.stdout) };
    } finally {
        rmSync(temporaryDirectory, { force: true, recursive: true });
    }
};

const notifyCompletion = (
    request: ActionlintWorkerRequest,
    response: ActionlintWorkerResponse
): void => {
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
