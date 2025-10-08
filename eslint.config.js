import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ...pluginJs.configs.recommended,
    name: "lintastic:base",
    languageOptions: {
      globals: {
        ...globals.node,
        lint: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
    },
    ignores: ["test/samples/**"],
  },
];
