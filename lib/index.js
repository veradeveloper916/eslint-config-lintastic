#!/usr/bin/node --experimental-specifier-resolution=node

/**
 * 🛡️ ESLINT-CONFIG-LINTASTIC - DevSecOps Security ESLint Configuration
 *
 * Punto de entrada principal para configuraciones ESLint con enfoque DevSecOps
 * Arquitectura MVC modular y escalable con paradigma funcional
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 * @version 2.0.0 - MVC Architecture
 */

// Main ESLint configuration exports
export { default as node } from "./node.js";
export { default as tests } from "./tests.js";
export { default as typescript } from "./typescript.js";
export { default as reactVite } from "./react-vite.js";

// MVC Architecture exports for advanced usage
export { ESLintConfigController } from "../src/controllers/eslint-config.controller.js";
export { SecurityRulesController } from "../src/controllers/security-rules.controller.js";
export { VulnerabilityScannerController } from "../src/controllers/vulnerability-scanner.controller.js";

// Configuration exports
export { ESLintConfig } from "../src/config/eslint-config.js";
export { SecurityConfig } from "../src/config/security-config.js";

// Service exports
export { PluginService } from "../src/services/plugin.service.js";
export { RuleGeneratorService } from "../src/services/rule-generator.service.js";
export { VulnerabilityLoaderService } from "../src/services/vulnerability-loader.service.js";

// Utility exports
export { FunctionalHelpers } from "../src/utils/functional-helpers.js";
export { SecurityHelpers } from "../src/utils/security-helpers.js";
