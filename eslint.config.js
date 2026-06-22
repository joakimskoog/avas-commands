import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        chrome: "readonly",
      },
      sourceType: "module",
    },
  },
  {
    files: ["eslint.config.js", "prettier.config.js", "vite.config.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
);
