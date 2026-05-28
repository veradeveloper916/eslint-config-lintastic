import { ESLint } from "eslint";

/**
 * 🛡️ TEST SETUP - DevSecOps Security Testing Configuration
 *
 * Configuración de pruebas para ESLint config con enfoque DevSecOps
 * Utilidades globales para testing de reglas de seguridad
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

/**
 * Linta el texto proporcionado utilizando una configuración de ESLint.
 *
 * @param {ESLint.Options} baseConfig - Configuración de ESLint a utilizar.
 * @param {string} text - El texto que se va a analizar.
 * @returns {Promise<Array>} Una promesa que se resuelve con los resultados del linting.
 *                             Los resultados son un array de objetos de tipo `LintResult`.
 */
global.lint = (baseConfig, text) => {
  const cli = new ESLint({ baseConfig });

  return cli.lintText(text);
};

/**
 * Utilities for security-focused testing
 */
global.securityTestUtils = {
  /**
   * Tests if a code snippet triggers security rules
   * @param {string} code - Code to test
   * @param {Array<string>} expectedRules - Expected security rules to trigger
   * @returns {Promise<boolean>} Whether security rules were triggered
   */
  testSecurityViolation: async (code, expectedRules) => {
    const config = await import("../src/config/eslint-config.js");
    const results = await global.lint(config.DEFAULT_CONFIG, code);

    if (results.length === 0) return false;

    const triggeredRules = results[0].messages.map((msg) => msg.ruleId);
    return expectedRules.every((rule) => triggeredRules.includes(rule));
  },

  /**
   * Gets vulnerability patterns for testing
   * @returns {Promise<Object>} Vulnerability patterns
   */
  getVulnerabilityPatterns: async () => {
    const { default: vulnerabilityLoader } = await import(
      "../src/services/vulnerability-loader.service.js"
    );
    return vulnerabilityLoader.loadVulnerabilityData();
  },
};
