import { isDefined } from "ts-extras";

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
type Options = readonly [ActionlintRuleOption?];

type ReportLocation = Readonly<{
    end: { column: number; line: number };
    start: { column: number; line: number };
}>;

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

const actionlintRule: RuleModuleWithDocs<MessageIds, Options> = createTypedRule<
    MessageIds,
    Options
>({
    create: (context, [rawOptions = {}]) =>
        toRuleListener({
            Program() {
                let lintResult: ReturnType<typeof runActionlintSynchronously>;
                try {
                    lintResult = runActionlintSynchronously({
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
                    });
                } catch (error: unknown) {
                    context.report({
                        data: {
                            message:
                                error instanceof Error
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
                "run Actionlint against GitHub Actions workflow files from ESLint.",
            recommended: true,
            requiresTypeChecking: false,
            url: "https://nick2bad4u.github.io/eslint-plugin-actionlint/docs/rules/actionlint",
        },
        messages: {
            actionlintConfigError:
                "Actionlint configuration error: {{message}}",
            actionlintProblem: "Actionlint ({{rule}}): {{text}}",
        },
        schema: [{ additionalProperties: true, type: "object" }],
        type: "problem",
    },
    name: "actionlint",
});

export default actionlintRule;
