declare const _default: ({
    readonly rules: Readonly<import("eslint").Linter.RulesRecord>;
} | import("typescript-eslint").CompatibleConfig | {
    ignores: string[];
    languageOptions?: undefined;
    rules?: undefined;
} | {
    languageOptions: {
        globals: any;
        parserOptions: {
            ecmaVersion: string;
            sourceType: string;
        };
    };
    rules: {
        'no-unused-vars': string;
        '@typescript-eslint/no-unused-vars': (string | {
            argsIgnorePattern: string;
            varsIgnorePattern: string;
            caughtErrorsIgnorePattern: string;
        })[];
        '@typescript-eslint/no-explicit-any': string;
        '@typescript-eslint/consistent-type-imports': string;
        'prefer-const': string;
        'no-var': string;
    };
    ignores?: undefined;
})[];
export default _default;
//# sourceMappingURL=eslint.config.d.ts.map