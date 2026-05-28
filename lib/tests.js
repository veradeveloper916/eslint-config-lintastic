/**
 * 🛡️ TEST ESLINT CONFIG - DevSecOps Testing Configuration
 *
 * Configuración ESLint especializada para archivos de test
 * Reglas relajadas para permitir testing de vulnerabilidades
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 * @version 2.0.0 - MVC Architecture
 */

import js from "@eslint/js";

// Import security configuration for test environment
import { SecurityConfig } from "../src/config/security-config.js";

// Get testing environment configuration
const testingConfig = SecurityConfig.ENVIRONMENT_SECURITY_CONFIGS.TESTING;

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    name: "node:tests-devsecops",
    files: [
      "{test,tests}/**/*.{js}",
      "**/*.test.js",
      "**/*.spec.js",
      "**/test/**/*.js",
      "**/tests/**/*.js",
    ],
    languageOptions: {
      globals: {
        // Testing globals
        asserts: true,
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        before: true,
        after: true,
        // Global testing utilities from setupTest.js
        lint: true,
        securityTestUtils: true,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      // Base recommended rules
      ...js.configs.recommended.rules,

      // Testing-specific rule adjustments
      "no-unused-expressions": "off",
      "no-undefined": "off",
      "max-lines-per-function": [
        "error",
        { max: 150, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],

      // DevSecOps testing overrides (from security config)
      ...testingConfig.overrides,

      // Allow security testing patterns
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-child-process": "off",
      "security/detect-eval-with-expression": "off",

      // Critical security rules still enforced in tests (unless testing them)
      "no-eval": "off", // Allow for security testing
      "no-implied-eval": "off", // Allow for security testing
      "no-new-func": "off", // Allow for security testing

      // Keep important test quality rules
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",
    },
  },

  // Special configuration for security test samples
  {
    name: "node:security-samples",
    files: ["**/samples/**/*.js", "**/*.sample.js", "**/security-test.js"],
    languageOptions: {
      globals: {
        // Browser globals for XSS testing
        location: true,
        document: true,
        window: true,
      },
    },
    rules: {
      // Disable ALL security rules for security test samples
      // These files intentionally contain vulnerabilities for testing
      "no-eval": "off",
      "no-implied-eval": "off",
      "no-new-func": "off",
      "no-script-url": "off",
      "no-console": "off",
      "no-alert": "off",
      "no-unused-vars": "off",

      // Disable all security plugin rules
      "security/detect-object-injection": "off",
      "security/detect-eval-with-expression": "off",
      "security/detect-non-literal-regexp": "off",
      "security/detect-unsafe-regex": "off",
      "security/detect-pseudoRandomBytes": "off",
      "security/detect-possible-timing-attacks": "off",
      "security/detect-buffer-noassert": "off",
      "security/detect-child-process": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-disable-mustache-escape": "off",
      "security/detect-no-csrf-before-method-override": "off",
    },
  },
];
