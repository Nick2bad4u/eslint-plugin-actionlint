import type { UnknownRecord } from "type-fest";

import { isDefined, keyIn } from "ts-extras";

import { runActionlintSynchronously } from "../_internal/actionlint-runner.js";
import {
    createTypedRule,
    type RuleModuleWithDocs,
    toRuleListener,
} from "../_internal/typed-rule.js";

type ActionlintRuleOption = Readonly<{
    configFile?: string;
    ignore?: readonly string[];
    pyflakes?: false | string;
    shellcheck?: false | string;
    timeoutMs?: number;
}>;
type MessageIds = "actionlintConfigError" | "actionlintProblem";
type Options = [ActionlintRuleOption?];

type ReportLocation = Readonly<{
    end: { column: number; line: number };
    start: { column: number; line: number };
}>;

const isUnknownRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const toEslintLoc = (
    message: Readonly<{
        column: number;
        endColumn?: number;
        endLine?: number;
        line: number;
    }>
): ReportLocation => ({
    end: {
        column: Math.max((message.endColumn ?? message.column + 1) - 1, 0),
        line: message.endLine ?? message.line,
    },
    start: {
        column: Math.max(message.column - 1, 0),
        line: message.line,
    },
});

const isErrorLike = (value: unknown): value is Readonly<{ message: string }> =>
    isUnknownRecord(value) &&
    keyIn(value, "message") &&
    typeof value["message"] === "string";

/**
 * ActionlintRule ESLint bridge rule contract.
 */
const actionlintRule: RuleModuleWithDocs<MessageIds, Options> = createTypedRule<
    MessageIds,
    Options
>({
    create: (context, [rawOptions = {}]) =>
        toRuleListener({
            // eslint-disable-next-line sonarjs/function-name -- ESLint visitor keys must match AST node type names.
            Program() {
                const lintOptions = {
                    code: context.sourceCode.text,
                    codeFilename: context.physicalFilename,
                    cwd: context.cwd,
                    ...(isDefined(rawOptions.configFile) && {
                        configFile: rawOptions.configFile,
                    }),
                    ...(isDefined(rawOptions.ignore) && {
                        ignore: rawOptions.ignore,
                    }),
                    ...(isDefined(rawOptions.pyflakes) && {
                        pyflakes: rawOptions.pyflakes,
                    }),
                    ...(isDefined(rawOptions.shellcheck) && {
                        shellcheck: rawOptions.shellcheck,
                    }),
                    ...(isDefined(rawOptions.timeoutMs) && {
                        timeoutMs: rawOptions.timeoutMs,
                    }),
                };
                let lintResult: ReturnType<typeof runActionlintSynchronously>;
                try {
                    lintResult = runActionlintSynchronously(lintOptions);
                } catch (error: unknown) {
                    context.report({
                        data: {
                            message: isErrorLike(error)
                                ? error.message
                                : String(error),
                        },
                        loc: {
                            end: { column: 0, line: 1 },
                            start: { column: 0, line: 1 },
                        },
                        messageId: "actionlintConfigError",
                        node: context.sourceCode.ast,
                    });
                    return;
                }
                for (const message of lintResult.messages) {
                    context.report({
                        data: { rule: message.kind, text: message.message },
                        loc: toEslintLoc(message),
                        messageId: "actionlintProblem",
                        node: context.sourceCode.ast,
                    });
                }
            },
        }),
    // eslint-disable-next-line eslint-plugin/require-meta-languages -- Current ESLint rule metadata types do not expose the ESLint 10 languages extension.
    meta: {
        defaultOptions: [{}],
        deprecated: false,
        docs: {
            configs: [
                "actionlint.configs.recommended",
                "actionlint.configs.actionlintOnly",
                "actionlint.configs.all",
            ],
            description:
                "require Actionlint diagnostics for GitHub Actions workflow files from ESLint.",
            recommended: true,
            requiresTypeChecking: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint",
        },
        messages: {
            actionlintConfigError:
                "Actionlint configuration error: {{message}}",
            actionlintProblem: "Actionlint ({{rule}}): {{text}}",
        },
        schema: [
            {
                additionalProperties: true,
                description:
                    "Options forwarded to the underlying bridge linter for this ESLint rule.",
                type: "object",
            },
        ],
        type: "problem",
    },
    name: "actionlint",
});

export default actionlintRule;
