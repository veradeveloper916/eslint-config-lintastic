/**
 * 🛡️ TYPESCRIPT ESLINT CONFIG - DevSecOps TypeScript Configuration
 *
 * ESLint configuration for TypeScript projects (files: .ts, .tsx)
 */

import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

import { ESLintConfigController } from "../src/controllers/eslint-config.controller.js";
import { SecurityRulesController } from "../src/controllers/security-rules.controller.js";
import { ESLintConfig } from "../src/config/eslint-config.js";

const languageOptions = {
  sourceType: "module",
  globals: globals.browser,
  ecmaVersion: 2022,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

async function generateTSConfig() {
  try {
    const configController = new ESLintConfigController();
    const securityController = new SecurityRulesController();

    const baseConfig = await configController.createESLintConfig();
    const securityRules = await securityController.createSecurityRules();

    const mergedRules = {
      ...baseConfig.rules,
      ...securityRules,
      // TypeScript-specific adjustments
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
    };

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{ts,tsx,js,jsx}"],
        name: "typescript:base-devsecops",
        languageOptions,
        plugins: [
          ...new Set([...(baseConfig.plugins || Object.keys(ESLintConfig.SECURITY_PLUGINS)), "@typescript-eslint"]),
        ],
        rules: mergedRules,
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: "module",
          project: true,
          ecmaFeatures: { jsx: true },
        },
      },
      {
        ignores: baseConfig.ignorePatterns || ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  } catch (error) {
    process.stderr.write(
      `Warning: TypeScript config generation failed, using fallback: ${error.message}\n`
    );

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{ts,tsx}"],
        name: "typescript:base-fallback",
        languageOptions,
        plugins: Object.keys(ESLintConfig.SECURITY_PLUGINS),
        parser: "@typescript-eslint/parser",
        parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
        rules: {
          ...ESLintConfig.CORE_SECURITY_RULES,
          "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
      },
      {
        ignores: ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  }
}

const tsConfig = await generateTSConfig();

export default tsConfig;
