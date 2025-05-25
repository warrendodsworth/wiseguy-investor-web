import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['**/node_modules', '**/dist', '**/*.js', '**/*.mjs'] },
  { files: ['**/*.{ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-unused-vars': ['off'],
    },
  },
];

// import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
// import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import _import from "eslint-plugin-import";
// import globals from "globals";
// import tsParser from "@typescript-eslint/parser";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import js from "@eslint/js";

// import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
// import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import _import from "eslint-plugin-import";
// import globals from "globals";
// import tsParser from "@typescript-eslint/parser";
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import js from "@eslint/js";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({
//     baseDirectory: __dirname,
//     recommendedConfig: js.configs.recommended,
//     allConfig: js.configs.all
// });

// export default [{
//     ignores: ["**/node_modules", "**/lib"],
// }, ...fixupConfigRules(compat.extends(
//     "eslint:recommended",
//     "plugin:import/errors",
//     "plugin:import/warnings",
//     "plugin:import/typescript",
//     "google",
//     "plugin:@typescript-eslint/recommended",
// )), {
//     plugins: {
//         "@typescript-eslint": fixupPluginRules(typescriptEslint),
//         import: fixupPluginRules(_import),
//     },

//     languageOptions: {
//         globals: {
//             ...globals.node,
//             ...globals.jest,
//         },

//         parser: tsParser,
//         ecmaVersion: 5,
//         sourceType: "module",

//         parserOptions: {
//             project: ["tsconfig.json", "tsconfig.app.json", "tsconfig.spec.json"],
//         },
//     },

//     rules: {
//         quotes: ["warn", "single", {
//             avoidEscape: true,
//             allowTemplateLiterals: true,
//         }],

//         "max-len": ["off"],
//         "object-curly-spacing": "off",
//         "arrow-parens": ["off", "always"],
//         "quote-props": "off",
//         "no-trailing-spaces": "off",
//         "valid-jsdoc": ["off"],
//         "require-jsdoc": "off",
//         "no-multiple-empty-lines": "warn",
//         indent: "off",
//     },
// }];
