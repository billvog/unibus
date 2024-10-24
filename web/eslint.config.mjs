import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "!**/.*",
      "**/node_modules",
      ".next/*",
      "*.config.{js,mjs,cjs,ts}",
    ],
  },
  ...compat.extends(
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ),
  {
    plugins: {
      "@next/next": nextPlugin,
      "@typescript-eslint": typescriptEslint,
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },

    settings: {
      typescript: {},

      "import/resolver": {
        typescript: {
          project: "tsconfig.json",
        },
      },
    },

    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
      "@next/next/no-page-custom-font": "off",

      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",

      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/require-await": "off",

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "import/no-default-export": "off",

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling"],
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
