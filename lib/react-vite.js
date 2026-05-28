/**
 * 🛡️ REACT + VITE ESLINT CONFIG - DevSecOps React (Vite) Configuration
 *
 * ESLint configuration tuned for React applications scaffolded with Vite
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

async function generateReactViteConfig() {
  try {
    const configController = new ESLintConfigController();
    const securityController = new SecurityRulesController();

    const baseConfig = await configController.createESLintConfig();
    const securityRules = await securityController.createSecurityRules();

    const mergedRules = {
      ...baseConfig.rules,
      ...securityRules,
      // React-specific rules
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    };

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{jsx,tsx,js,ts}"],
        name: "react-vite:base-devsecops",
        languageOptions,
        plugins: [
          ...new Set([...(baseConfig.plugins || Object.keys(ESLintConfig.SECURITY_PLUGINS)), "react", "react-hooks"]),
        ],
        rules: mergedRules,
        parser: "@typescript-eslint/parser",
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: "module",
          ecmaFeatures: { jsx: true },
          project: true,
        },
        settings: {
          react: { version: "detect" },
        },
      },
      {
        ignores: baseConfig.ignorePatterns || ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  } catch (error) {
    process.stderr.write(
      `Warning: React Vite config generation failed, using fallback: ${error.message}\n`
    );

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{jsx,tsx}"],
        name: "react-vite:base-fallback",
        languageOptions,
        plugins: Object.keys(ESLintConfig.SECURITY_PLUGINS),
        parser: "@typescript-eslint/parser",
        parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
        rules: {
          ...ESLintConfig.CORE_SECURITY_RULES,
        },
        settings: { react: { version: "detect" } },
      },
      {
        ignores: ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  }
}

const reactViteConfig = await generateReactViteConfig();

export default reactViteConfig;
