import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            prettier: prettierPlugin,
        },
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "prettier/prettier": "error", // spouští Prettier jako ESLint pravidlo
        },
    },
    {
        files: ["tests/**/*.ts"],
        languageOptions: {
            globals: {
                test: "readonly",
                expect: "readonly",
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]);
