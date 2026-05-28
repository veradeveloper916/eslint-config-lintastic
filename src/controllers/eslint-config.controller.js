/**
 * 🛡️ ESLINT CONFIG CONTROLLER - DevSecOps Configuration Controller
 *
 * Controlador principal que orquesta la configuración de ESLint
 * Implementa patrón MVC con funciones puras y composición funcional
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import RuleModel from "../models/rule.model.js";
import SecurityPatternModel from "../models/security-pattern.model.js";
import VulnerabilityModel from "../models/vulnerability.model.js";

/**
 * Creates a complete ESLint configuration with security focus
 * @param {Object} options - Configuration options
 * @param {Array<Object>} options.rules - Base rules array
 * @param {Array<Object>} options.securityPatterns - Security patterns array
 * @param {Array<Object>} options.vulnerabilities - Vulnerabilities array
 * @param {Object} options.plugins - Plugin configurations
 * @param {Array<string>} options.ignores - Files to ignore
 * @returns {Object} Complete ESLint configuration
 * @example
 * const config = createESLintConfig({
 *   rules: baseRules,
 *   securityPatterns: patterns,
 *   vulnerabilities: vulns,
 *   plugins: pluginConfig
 * });
 */
export const createESLintConfig = (options = {}) => {
  const {
    rules = [],
    securityPatterns = [],
    vulnerabilities = [],
    plugins = {},
    ignores = [],
    languageOptions = {},
  } = options;

  // Process and validate rules
  const processedRules = processRules(rules);
  const securityRules = generateSecurityRules(
    securityPatterns,
    vulnerabilities
  );
  const allRules = mergeRules(processedRules, securityRules);

  // Generate configuration object
  return {
    name: "lintastic:devsecops-config",
    languageOptions: {
      sourceType: "module",
      ...languageOptions,
    },
    plugins,
    rules: allRules,
    ignores,
    settings: {
      lintastic: {
        version: "1.0.0",
        type: "devsecops-security",
        generatedAt: new Date().toISOString(),
      },
    },
  };
};

/**
 * Processes and validates rules array using RuleModel
 * @param {Array<Object>} rules - Array of rule objects
 * @returns {Object} Processed rules in ESLint format
 * @example
 * const processed = processRules([rule1, rule2]);
 */
export const processRules = (rules) => {
  const validRules = rules.filter((rule) => {
    const validation = RuleModel.validate(rule);
    if (!validation.isValid) {
      // Log validation errors for debugging in development
      if (process.env.NODE_ENV === "development") {
        process.stderr.write(
          `Invalid rule ${rule.name}: ${validation.errors.join(", ")}\n`
        );
      }
      return false;
    }
    return true;
  });

  return RuleModel.toESLintRules(validRules);
};

/**
 * Generates security rules from patterns and vulnerabilities
 * @param {Array<Object>} securityPatterns - Security patterns array
 * @param {Array<Object>} vulnerabilities - Vulnerabilities array
 * @returns {Object} Security rules in ESLint format
 * @example
 * const securityRules = generateSecurityRules(patterns, vulns);
 */
export const generateSecurityRules = (securityPatterns, vulnerabilities) => {
  const patternRules = generatePatternBasedRules(securityPatterns);
  const vulnerabilityRules = generateVulnerabilityBasedRules(vulnerabilities);

  return mergeRules(patternRules, vulnerabilityRules);
};

/**
 * Generates rules from security patterns
 * @param {Array<Object>} patterns - Security patterns array
 * @returns {Object} Pattern-based rules
 * @example
 * const rules = generatePatternBasedRules(securityPatterns);
 */
export const generatePatternBasedRules = (patterns) => {
  const validPatterns = patterns.filter((pattern) => {
    const validation = SecurityPatternModel.validate(pattern);
    if (!validation.isValid) {
      // Log validation errors for debugging in development
      if (process.env.NODE_ENV === "development") {
        process.stderr.write(
          `Invalid security pattern: ${validation.errors.join(", ")}\n`
        );
      }
      return false;
    }
    return true;
  });

  // Group patterns by severity for rule generation
  const groupedPatterns = SecurityPatternModel.groupBySeverity(validPatterns);
  const rules = {};

  // Generate no-restricted-syntax rules for critical patterns
  if (groupedPatterns.critical?.length > 0) {
    rules["no-restricted-syntax"] = [
      "error",
      ...groupedPatterns.critical.map((pattern) => ({
        selector: pattern.selector,
        message: pattern.message,
      })),
    ];
  }

  return rules;
};

/**
 * Generates rules from vulnerability data
 * @param {Array<Object>} vulnerabilities - Vulnerabilities array
 * @returns {Object} Vulnerability-based rules
 * @example
 * const rules = generateVulnerabilityBasedRules(vulnerabilities);
 */
export const generateVulnerabilityBasedRules = (vulnerabilities) => {
  const validVulns = vulnerabilities.filter((vuln) => {
    const validation = VulnerabilityModel.validate(vuln);
    if (!validation.isValid) {
      // Log validation errors for debugging in development
      if (process.env.NODE_ENV === "development") {
        process.stderr.write(
          `Invalid vulnerability ${vuln.name}: ${validation.errors.join(
            ", "
          )}\n`
        );
      }
      return false;
    }
    return true;
  });

  // Group vulnerabilities by severity
  const groupedVulns = VulnerabilityModel.groupBySeverity(validVulns);
  const rules = {};

  // Generate no-restricted-imports rules for critical vulnerabilities
  const criticalVulns = groupedVulns.critical || [];
  const highVulns = groupedVulns.high || [];

  if (criticalVulns.length > 0 || highVulns.length > 0) {
    const restrictedPaths = [
      ...criticalVulns.map((vuln) => ({
        name: vuln.name,
        message: `🔴 SECURITY: ${vuln.vulnerability} - ${vuln.fix}`,
      })),
      ...highVulns.map((vuln) => ({
        name: vuln.name,
        message: `⚠️ SECURITY: ${vuln.vulnerability} - ${vuln.fix}`,
      })),
    ];

    rules["no-restricted-imports"] = ["error", { paths: restrictedPaths }];
  }

  return rules;
};

/**
 * Merges multiple rule objects into one
 * @param {...Object} ruleObjects - Rule objects to merge
 * @returns {Object} Merged rules object
 * @example
 * const merged = mergeRules(baseRules, securityRules, customRules);
 */
export const mergeRules = (...ruleObjects) => {
  return ruleObjects.reduce(
    (merged, rules) => ({
      ...merged,
      ...rules,
    }),
    {}
  );
};

/**
 * Creates a configuration for Node.js projects with security focus
 * @param {Object} options - Configuration options
 * @returns {Object} Node.js ESLint configuration
 * @example
 * const nodeConfig = createNodeConfig({ strictMode: true });
 */
export const createNodeConfig = (options = {}) => {
  const {
    strictMode = true,
    maxComplexity = 6,
    maxLinesPerFunction = 50,
    additionalRules = {},
    additionalPlugins = {},
  } = options;

  const baseNodeRules = {
    "no-console": "off", // Allow console in Node.js
    "no-process-env": "off", // Allow process.env access
    "max-params": ["error", 4],
    "new-cap": ["error", { capIsNew: false }],
    ...(strictMode && { strict: ["error", "global"] }),
    complexity: ["error", { max: maxComplexity }],
    "max-lines-per-function": [
      "error",
      {
        max: maxLinesPerFunction,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    ...additionalRules,
  };

  return {
    name: "lintastic:node",
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        Buffer: "readonly",
        __filename: "readonly",
        __dirname: "readonly",
      },
    },
    plugins: additionalPlugins,
    rules: baseNodeRules,
  };
};

/**
 * Creates a configuration for test files
 * @param {Object} options - Test configuration options
 * @returns {Object} Test ESLint configuration
 * @example
 * const testConfig = createTestConfig({ testGlobals: ['describe', 'it'] });
 */
export const createTestConfig = (options = {}) => {
  const {
    testGlobals = [
      "test",
      "describe",
      "it",
      "expect",
      "beforeEach",
      "afterEach",
    ],
    maxLinesPerFunction = 150,
    allowedTestPatterns = ["{test,tests}/**/*.{js,mjs}"],
  } = options;

  const testGlobalsObject = testGlobals.reduce(
    (globals, name) => ({
      ...globals,
      [name]: "readonly",
    }),
    {}
  );

  return {
    name: "lintastic:tests",
    files: allowedTestPatterns,
    languageOptions: {
      globals: testGlobalsObject,
    },
    rules: {
      "no-unused-expressions": "off",
      "no-undefined": "off",
      "max-lines-per-function": [
        "error",
        {
          max: maxLinesPerFunction,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  };
};

/**
 * Validates the complete ESLint configuration
 * @param {Object} config - ESLint configuration to validate
 * @returns {Object} Validation result
 * @example
 * const result = validateConfig(eslintConfig);
 * if (!result.isValid) console.log(result.errors);
 */
export const validateConfig = (config) => {
  const errors = [];

  // Check required properties
  if (!config.rules || typeof config.rules !== "object") {
    errors.push("Configuration must have a rules object");
  }

  // Validate rule format
  if (config.rules) {
    Object.entries(config.rules).forEach(([ruleName, ruleConfig]) => {
      if (
        !["off", "warn", "error", 0, 1, 2].includes(
          Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig
        )
      ) {
        errors.push(`Invalid rule configuration for ${ruleName}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    ruleCount: config.rules ? Object.keys(config.rules).length : 0,
  };
};

/**
 * ESLint Configuration Controller Class
 * Implements functional programming with class-like interface
 */
export class ESLintConfigController {
  /**
   * Creates ESLint configuration
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} ESLint configuration
   */
  async createESLintConfig(options = {}) {
    // Load security rules if not provided
    if (!options.rules || options.rules.length === 0) {
      const { SecurityRulesController } = await import(
        "./security-rules.controller.js"
      );
      const securityController = new SecurityRulesController();
      const securityRules = await securityController.createSecurityRules();

      // Use security rules directly in the configuration
      return {
        name: "lintastic:devsecops-config",
        languageOptions: {
          sourceType: "module",
          ...options.languageOptions,
        },
        plugins: options.plugins || {},
        rules: securityRules,
        ignores: options.ignores || [],
        settings: {
          lintastic: {
            version: "2.0.0",
            type: "devsecops-security-mvc",
            generatedAt: new Date().toISOString(),
          },
        },
      };
    }

    return createESLintConfig(options);
  }

  /**
   * Creates Node.js specific configuration
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Node.js ESLint configuration
   */
  async createNodeConfig(options = {}) {
    return createNodeConfig(options);
  }

  /**
   * Creates test-specific configuration
   * @param {Object} options - Configuration options
   * @returns {Promise<Object>} Test ESLint configuration
   */
  async createTestConfig(options = {}) {
    return createTestConfig(options);
  }

  /**
   * Validates configuration
   * @param {Object} config - Configuration to validate
   * @returns {Object} Validation result
   */
  validateConfig(config) {
    return validateConfig(config);
  }
}

// Pure function exports for functional composition
export const ESLintConfigFunctions = Object.freeze({
  createConfig: createESLintConfig,
  createNodeConfig,
  createTestConfig,
  processRules,
  generateSecurityRules,
  generatePatternBasedRules,
  generateVulnerabilityBasedRules,
  mergeRules,
  validateConfig,
});

export default ESLintConfigController;
