/**
 * 🛡️ UNIT TESTS - DevSecOps ESLint Configuration
 *
 * Pruebas unitarias para configuraciones de ESLint con enfoque DevSecOps
 * Valida reglas de seguridad, configuraciones y estructura MVC
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

// Import new MVC structure
import { ESLintConfigController } from "../../src/controllers/eslint-config.controller.js";
import { SecurityRulesController } from "../../src/controllers/security-rules.controller.js";
import { ESLintConfig } from "../../src/config/eslint-config.js";
import { SecurityConfig } from "../../src/config/security-config.js";

describe("DevSecOps ESLint Configuration", () => {
  describe("Configuration Structure", () => {
    it("Should have valid default configuration", () => {
      const config = ESLintConfig.DEFAULT_CONFIG;

      assert.ok(config.env, "Missing environment configuration");
      assert.ok(config.parserOptions, "Missing parser options");
      assert.ok(config.plugins, "Missing plugins configuration");
      assert.ok(config.rules, "Missing rules configuration");
      assert.ok(
        Array.isArray(config.ignorePatterns),
        "Missing ignore patterns"
      );
    });

    it("Should include security plugins", () => {
      const plugins = ESLintConfig.SECURITY_PLUGINS;

      assert.ok(plugins.security, "Missing security plugin");
      assert.ok(plugins.node, "Missing node plugin");
      assert.ok(plugins.import, "Missing import plugin");
    });

    it("Should have OWASP Top 10 mappings", () => {
      const mappings = ESLintConfig.OWASP_MAPPINGS;

      // Test for OWASP categories
      assert.ok(mappings.A01_BROKEN_ACCESS_CONTROL, "Missing A01 mapping");
      assert.ok(mappings.A02_CRYPTOGRAPHIC_FAILURES, "Missing A02 mapping");
      assert.ok(mappings.A03_INJECTION, "Missing A03 mapping");
      assert.ok(
        mappings.A08_SOFTWARE_INTEGRITY_FAILURES,
        "Missing A08 mapping"
      );
    });
  });

  describe("Security Rules Configuration", () => {
    it("Should have critical security rules", () => {
      const criticalRules = SecurityConfig.CRITICAL_SECURITY_RULES;

      assert.ok(criticalRules["no-eval"], "Missing no-eval rule");
      assert.ok(
        criticalRules["no-implied-eval"],
        "Missing no-implied-eval rule"
      );
      assert.ok(criticalRules["no-new-func"], "Missing no-new-func rule");
      assert.ok(
        criticalRules["security/detect-object-injection"],
        "Missing object injection detection"
      );
    });

    it("Should categorize security rules properly", () => {
      const categories = SecurityConfig.SECURITY_CATEGORIES;

      assert.ok(categories.CODE_INJECTION, "Missing code injection category");
      assert.ok(categories.XSS_PREVENTION, "Missing XSS prevention category");
      assert.ok(
        categories.CRYPTOGRAPHIC_FAILURES,
        "Missing cryptographic failures category"
      );
    });

    it("Should have environment-specific configurations", () => {
      const envConfigs = SecurityConfig.ENVIRONMENT_SECURITY_CONFIGS;

      assert.ok(envConfigs.PRODUCTION, "Missing production configuration");
      assert.ok(envConfigs.DEVELOPMENT, "Missing development configuration");
      assert.ok(envConfigs.TESTING, "Missing testing configuration");
    });
  });

  describe("MVC Controllers", () => {
    it("Should create ESLint configuration through controller", async () => {
      const controller = new ESLintConfigController();
      const config = await controller.createESLintConfig();

      assert.ok(config, "Controller should return configuration");
      assert.ok(config.rules, "Configuration should have rules");
      assert.ok(config.plugins, "Configuration should have plugins");
    });

    it("Should generate security rules through controller", async () => {
      const controller = new SecurityRulesController();
      const rules = await controller.createSecurityRules();

      assert.ok(rules, "Controller should return security rules");
      assert.ok(Object.keys(rules).length > 0, "Should have security rules");
    });
  });

  describe("Functional Programming Implementation", () => {
    it("Should use immutable configurations", () => {
      const config = ESLintConfig.DEFAULT_CONFIG;

      // Test that configuration objects are frozen
      assert.equal(
        Object.isFrozen(config),
        true,
        "Main configuration should be frozen"
      );
      assert.equal(
        Object.isFrozen(config.rules),
        true,
        "Rules object should be frozen"
      );
      assert.equal(
        Object.isFrozen(config.plugins),
        true,
        "Plugins array should be frozen"
      );

      // Test that attempting to modify throws an error (strict mode behavior)
      const originalRulesCount = Object.keys(config.rules).length;

      assert.throws(
        () => {
          config.rules["new-rule"] = "error";
        },
        TypeError,
        "Adding new rule should throw TypeError"
      );

      assert.equal(
        Object.keys(config.rules).length,
        originalRulesCount,
        "Configuration should remain immutable"
      );
      assert.equal(
        config.rules["new-rule"],
        undefined,
        "New rule should not be added"
      );
    });

    it("Should have pure functions in controllers", () => {
      // Test that controllers export functions/classes (not side effects)
      assert.equal(
        typeof ESLintConfigController,
        "function",
        "ESLintConfigController should be a function/class"
      );
      assert.equal(
        typeof SecurityRulesController,
        "function",
        "SecurityRulesController should be a function/class"
      );
    });
  });
});
