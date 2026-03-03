const globals = require("globals");
const js = require("@eslint/js");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    },
    eslintConfigPrettier,
];
