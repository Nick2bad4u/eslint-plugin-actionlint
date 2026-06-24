import type { MessagePort } from "node:worker_threads";

export type ActionlintWorkerErrorResponse = Readonly<{
    error: Readonly<{ message: string; name: string; stack?: string }>;
    ok: false;
}>;

export type ActionlintWorkerRequest = Readonly<{
    options: SerializableActionlintLintOptions;
    port: MessagePort;
    signalBuffer: SharedArrayBuffer;
}>;

export type ActionlintWorkerResponse =
    | ActionlintWorkerErrorResponse
    | ActionlintWorkerSuccessResponse;

export type ActionlintWorkerSuccessResponse = Readonly<{
    ok: true;
    result: SerializableActionlintResult;
}>;
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
export type SerializableActionlintMessage = Readonly<{
    column: number;
    kind: string;
    line: number;
    message: string;
}>;
export type SerializableActionlintResult = Readonly<{
    messages: readonly SerializableActionlintMessage[];
}>;
