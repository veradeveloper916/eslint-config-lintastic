/**
 * 🛡️ NODE ESLINT CONFIG - DevSecOps Node.js Security Configuration
 *
 * Configuración ESLint especializada para Node.js con enfoque DevSecOps
 * Utiliza nueva arquitectura MVC para generación dinámica de reglas
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 * @version 2.0.0 - MVC Architecture
 */

import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

// Import MVC controllers for rule generation
import { ESLintConfigController } from "../src/controllers/eslint-config.controller.js";
import { SecurityRulesController } from "../src/controllers/security-rules.controller.js";

// Import configuration
import { ESLintConfig } from "../src/config/eslint-config.js";

// Import test configuration
import tests from "#lib/tests";

// Language options for Node.js environment
const languageOptions = {
  sourceType: "module",
  globals: globals.node,
  ecmaVersion: 2022,
  parserOptions: {
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
    },
  },
};

/**
 * Generate dynamic ESLint configuration using MVC architecture
 * @returns {Promise<Array>} ESLint configuration array
 */
async function generateNodeConfig() {
  try {
    // Initialize controllers
    const configController = new ESLintConfigController();
    const securityController = new SecurityRulesController();

    // Generate configurations
    const baseConfig = await configController.createESLintConfig();
    const securityRules = await securityController.createSecurityRules();

    // Merge configurations
    const mergedRules = {
      ...baseConfig.rules,
      ...securityRules,
      // Node.js specific rules
      "max-params": ["error", 4],
      "new-cap": ["error", { capIsNew: false }],
      "node/no-deprecated-api": "error",
      "node/no-missing-import": "error",
    };

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{js}"],
        name: "node:base-devsecops",
        languageOptions,
        plugins: baseConfig.plugins || ESLintConfig.SECURITY_PLUGINS,
        rules: mergedRules,
      },
      ...tests,
      {
        ignores: baseConfig.ignorePatterns || ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  } catch (error) {
    // Fallback to static configuration if dynamic generation fails
    process.stderr.write(
      `Warning: Dynamic config generation failed, using fallback: ${error.message}\n`
    );

    return [
      jsdoc.configs["flat/recommended-error"],
      {
        files: ["**/*.{js}"],
        name: "node:base-fallback",
        languageOptions,
        plugins: Object.keys(ESLintConfig.SECURITY_PLUGINS),
        rules: {
          ...ESLintConfig.CORE_SECURITY_RULES,
          "max-params": ["error", 4],
          "new-cap": ["error", { capIsNew: false }],
        },
      },
      ...tests,
      {
        ignores: ESLintConfig.IGNORE_PATTERNS,
      },
    ];
  }
}

// Export the configuration
const nodeConfig = await generateNodeConfig();

/** @type {import("eslint").Linter.Config[]} */
export default nodeConfig;
