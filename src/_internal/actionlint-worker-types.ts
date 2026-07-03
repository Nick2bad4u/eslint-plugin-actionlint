import type { MessagePort } from "node:worker_threads";

/**
 * ActionlintWorkerErrorResponse actionlint worker error response contract.
 */
export type ActionlintWorkerErrorResponse = Readonly<{
    error: Readonly<{ message: string; name: string; stack?: string }>;
    ok: false;
}>;

/**
 * ActionlintWorkerRequest actionlint worker request contract.
 */
export type ActionlintWorkerRequest = Readonly<{
    options: SerializableActionlintLintOptions;
    port: MessagePort;
    signalBuffer: SharedArrayBuffer;
}>;

/**
 * ActionlintWorkerResponse actionlint worker response contract.
 */
export type ActionlintWorkerResponse =
    ActionlintWorkerErrorResponse | ActionlintWorkerSuccessResponse;

/**
 * ActionlintWorkerSuccessResponse actionlint worker success response contract.
 */
export type ActionlintWorkerSuccessResponse = Readonly<{
    ok: true;
    result: SerializableActionlintResult;
}>;
/**
 * SerializableActionlintLintOptions serializable actionlint lint options
 * contract.
 */
export type SerializableActionlintLintOptions = Readonly<{
    code: string;
    codeFilename: string;
    configFile?: string;
    cwd?: string;
    ignore?: readonly string[];
    pyflakes?: false | string;
    shellcheck?: false | string;
    timeoutMs?: number;
}>;
/**
 * SerializableActionlintMessage serializable actionlint message contract.
 */
export type SerializableActionlintMessage = Readonly<{
    column: number;
    endColumn?: number;
    endLine?: number;
    kind: string;
    line: number;
    message: string;
}>;
/**
 * SerializableActionlintResult serializable actionlint result contract.
 */
export type SerializableActionlintResult = Readonly<{
    messages: readonly SerializableActionlintMessage[];
}>;
