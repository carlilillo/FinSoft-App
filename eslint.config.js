import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
    globalIgnores(["dist", "coverage"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            jsxA11y.flatConfigs.recommended,
        ],
        plugins: {
            "react-hooks": reactHooks,
        },
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
            parserOptions: {
                // Type information is what makes no-floating-promises work.
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // React
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // TypeScript
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/consistent-type-imports": "error",

            // Core JavaScript
            eqeqeq: ["error", "always"],
            "prefer-const": "error",
            "no-var": "error",
            complexity: ["error", 10],
            "max-depth": ["error", 3],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../*"],
                            message:
                                'Import from a parent folder with "@/..." instead of "../".',
                        },
                    ],
                },
            ],
        },
    },
    {
        // Config files are not part of the app's tsconfig, so lint them without type information.
        files: ["*.config.{js,ts}"],
        extends: [tseslint.configs.disableTypeChecked],
    },
    // Must stay last: turns off every rule that would fight with Prettier.
    prettier,
]);
