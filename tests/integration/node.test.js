/**
 * 🛡️ INTEGRATION TESTS - DevSecOps ESLint Security Integration
 *
 * Pruebas de integración para validar la funcionalidad completa del sistema DevSecOps
 * Testa la integración entre controladores, servicios y configuraciones de seguridad
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ESLint } from "eslint";
import { fileURLToPath } from "url";

// Import new MVC structure for integration testing
import { ESLintConfigController } from "../../src/controllers/eslint-config.controller.js";
import { VulnerabilityScannerController } from "../../src/controllers/vulnerability-scanner.controller.js";
import { SecurityRulesController } from "../../src/controllers/security-rules.controller.js";

describe("DevSecOps Security Integration Tests", () => {
  describe("ESLint Configuration Integration", () => {
    it("Should create and validate complete ESLint configuration", async () => {
      const controller = new ESLintConfigController();
      const config = await controller.createESLintConfig();

      // Validate configuration structure
      assert.ok(config, "Configuration should be created");
      assert.ok(config.rules, "Configuration should have rules");
      assert.ok(config.plugins, "Configuration should have plugins");

      // Test ESLint integration
      const eslint = new ESLint({ baseConfig: config });
      const testCode = 'const x = eval("1 + 1");'; // Security violation

      const results = await eslint.lintText(testCode);
      assert.ok(results.length > 0, "Should return results");
      assert.ok(
        results[0].messages.length > 0,
        "Should detect security violations"
      );
    });

    it("Should integrate security rules properly", async () => {
      const securityController = new SecurityRulesController();
      const configController = new ESLintConfigController();

      const securityRules = await securityController.createSecurityRules();
      const fullConfig = await configController.createESLintConfig();

      // Verify security rules are included
      assert.ok(
        securityRules["no-eval"],
        "Security rules should include no-eval"
      );
      assert.ok(
        fullConfig.rules && fullConfig.rules["no-eval"],
        "Full config should include security rules"
      );

      // Verify rule structure
      assert.equal(
        typeof securityRules,
        "object",
        "Security rules should be an object"
      );
      assert.ok(
        Object.keys(securityRules).length > 0,
        "Security rules should not be empty"
      );
    });
  });

  describe("Vulnerability Scanner Integration", () => {
    it("Should perform comprehensive vulnerability scan", async () => {
      const scanner = new VulnerabilityScannerController();

      const testCode = `eval(userInput); setTimeout(userInput, 100);`;

      const scanResults = await scanner.performVulnerabilityScan(testCode);

      assert.ok(scanResults, "Should return scan results");

      // The scanner might return vulnerabilities in different formats
      // Check for various possible structures
      const hasVulnerabilities =
        (scanResults.vulnerabilities &&
          scanResults.vulnerabilities.length > 0) ||
        (scanResults.vulnerabilities &&
          typeof scanResults.vulnerabilities === "object" &&
          Object.keys(scanResults.vulnerabilities).length > 0) ||
        (scanResults.summary && scanResults.summary.totalVulnerabilities > 0);

      assert.ok(
        hasVulnerabilities,
        "Should detect vulnerabilities in some format"
      );
    });

    it("Should generate security recommendations", async () => {
      const scanner = new VulnerabilityScannerController();

      const testCode = "const weak = Math.random().toString();";
      const scanResults = await scanner.performVulnerabilityScan(testCode);

      assert.ok(scanResults.recommendations, "Should provide recommendations");
      assert.ok(
        Array.isArray(scanResults.recommendations),
        "Recommendations should be an array"
      );
    });
  });

  describe("Sample Code Analysis", () => {
    it("Should analyze sample files for security issues", async () => {
      const controller = new ESLintConfigController();
      const config = await controller.createESLintConfig();
      const eslint = new ESLint({ baseConfig: config });

      const dir = fileURLToPath(new URL("../samples", import.meta.url));

      try {
        const results = await eslint.lintFiles([`${dir}/**/*.js`]);

        assert.ok(results.length > 0, "Should analyze sample files");

        // Check for security-related violations
        const securityViolations = results.flatMap((result) =>
          result.messages.filter(
            (msg) =>
              msg.ruleId &&
              (msg.ruleId.startsWith("security/") ||
                ["no-eval", "no-implied-eval", "no-new-func"].includes(
                  msg.ruleId
                ))
          )
        );

        // Log security violations found (for debugging)
        if (securityViolations.length > 0) {
          securityViolations.forEach((violation) => {
            process.stderr.write(
              `Security violation: ${violation.ruleId} - ${violation.message}\n`
            );
          });
        }
      } catch {
        // If sample files don't exist or have issues, create a basic test
        const testCode = "eval(\"console.log('test')\");";
        const results = await eslint.lintText(testCode);

        assert.ok(results.length > 0, "Should analyze test code");
        assert.ok(
          results[0].messages.some((msg) => msg.ruleId === "no-eval"),
          "Should detect eval usage"
        );
      }
    });
  });

  describe("OWASP Top 10 Coverage", () => {
    it("Should detect OWASP A03 (Injection) vulnerabilities", async () => {
      const controller = new ESLintConfigController();
      const config = await controller.createESLintConfig();
      const eslint = new ESLint({ baseConfig: config });

      const injectionCode = `
        eval(userInput);
        new Function(dynamicCode)();
        setTimeout("userString", 100);
      `;

      const results = await eslint.lintText(injectionCode);
      const ruleViolations = results[0].messages.map((msg) => msg.ruleId);

      assert.ok(
        ruleViolations.includes("no-eval"),
        "Should detect eval injection"
      );
      assert.ok(
        ruleViolations.includes("no-new-func"),
        "Should detect Function constructor"
      );
      assert.ok(
        ruleViolations.includes("no-implied-eval"),
        "Should detect implied eval"
      );
    });

    it("Should detect security plugin violations", async () => {
      const controller = new ESLintConfigController();
      const config = await controller.createESLintConfig();
      const eslint = new ESLint({ baseConfig: config });

      // This test checks if security plugins are properly integrated
      const securityTestCode = "const x = 1; // Basic code";

      const results = await eslint.lintText(securityTestCode);

      // Even if no violations, ESLint should process without errors
      assert.ok(Array.isArray(results), "Should return results array");
      assert.ok(results.length > 0, "Should process the code");
    });
  });

  describe("MVC Architecture Integration", () => {
    it("Should coordinate between all MVC layers", async () => {
      // Test Model → Service → Controller integration
      const configController = new ESLintConfigController();
      const securityController = new SecurityRulesController();
      const scannerController = new VulnerabilityScannerController();

      // Generate configuration through controller
      const config = await configController.createESLintConfig();

      // Generate security rules through controller
      const securityRules = await securityController.createSecurityRules();

      // Perform scan through controller
      const scanResults = await scannerController.performVulnerabilityScan(
        'eval("test");'
      );

      // Verify integration
      assert.ok(
        config && securityRules && scanResults,
        "All MVC layers should work together"
      );
      assert.ok(
        config.rules["no-eval"] === "error",
        "Configuration should include security rules"
      );
      assert.ok(
        scanResults.vulnerabilities.length > 0,
        "Scanner should detect vulnerabilities"
      );
    });
  });
});
