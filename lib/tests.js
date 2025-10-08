import js from "@eslint/js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    name: "node:tests",
    files: ["{test}/**/*.{js}"],
    languageOptions: {
      globals: {
        asserts: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-expressions": "off",
      "no-undefined": "off",
      "max-lines-per-function": [
        "error",
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
    },
  },
];
