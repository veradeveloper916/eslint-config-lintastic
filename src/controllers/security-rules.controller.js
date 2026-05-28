/**
 * 🛡️ SECURITY RULES CONTROLLER - DevSecOps Security Rules Orchestration
 *
 * Controlador especializado en la gestión de reglas de seguridad DevSecOps
 * Implementa patrón MVC con funciones puras y composición funcional
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import SecurityPatternModel from "../models/security-pattern.model.js";
import VulnerabilityModel from "../models/vulnerability.model.js";

/**
 * OWASP Top 10 security rule categories with their associated rules
 */
export const OWASP_RULE_CATEGORIES = Object.freeze({
  A01_BROKEN_ACCESS_CONTROL: "A01:2021",
  A02_CRYPTOGRAPHIC_FAILURES: "A02:2021",
  A03_INJECTION: "A03:2021",
  A04_INSECURE_DESIGN: "A04:2021",
  A05_SECURITY_MISCONFIGURATION: "A05:2021",
  A06_VULNERABLE_COMPONENTS: "A06:2021",
  A07_IDENTIFICATION_FAILURES: "A07:2021",
  A08_SOFTWARE_INTEGRITY_FAILURES: "A08:2021",
  A09_LOGGING_FAILURES: "A09:2021",
  A10_SERVER_SIDE_REQUEST_FORGERY: "A10:2021",
});

/**
 * Creates comprehensive security rules following OWASP Top 10 guidelines
 * @param {Object} options - Security rules options
 * @param {Array<Object>} options.vulnerabilities - Known vulnerabilities
 * @param {Array<Object>} options.securityPatterns - Security patterns
 * @param {string} options.severityLevel - Minimum severity level ('critical', 'high', 'medium')
 * @returns {Object} Complete security rules configuration
 * @example
 * const securityRules = createSecurityRules({
 *   vulnerabilities: vulnData,
 *   securityPatterns: patterns,
 *   severityLevel: 'high'
 * });
 */
export const createSecurityRules = (options = {}) => {
  const {
    vulnerabilities = [],
    securityPatterns = [],
    severityLevel = "medium",
  } = options;

  const coreSecurityRules = createCoreSecurityRules();
  const injectionRules = createInjectionPreventionRules(securityPatterns);
  const cryptographicRules = createCryptographicRules();
  const componentRules = createVulnerableComponentRules(
    vulnerabilities,
    severityLevel
  );
  const designRules = createSecureDesignRules();

  return mergeSecurityRules(
    coreSecurityRules,
    injectionRules,
    cryptographicRules,
    componentRules,
    designRules
  );
};

/**
 * Creates core security rules for general security practices
 * @returns {Object} Core security rules
 * @example
 * const coreRules = createCoreSecurityRules();
 */
export const createCoreSecurityRules = () => ({
  // A03:2021 – Injection Prevention
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",

  // A05:2021 – Security Misconfiguration
  "no-proto": "error",
  "no-iterator": "error",
  "no-with": "error",

  // General security practices
  "no-unsafe-finally": "error",
  "no-unsafe-negation": "error",
  "use-isnan": "error",
  "valid-typeof": "error",

  // Prevent prototype pollution
  "no-extend-native": "error",
  "no-global-assign": "error",
  "no-implicit-globals": "error",

  // Secure variable handling
  "no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: false,
      varsIgnorePattern: "^_",
      argsIgnorePattern: "^_",
    },
  ],

  // Control flow security
  "no-unreachable": "error",
  "no-dupe-keys": "error",
  "no-dupe-args": "error",
  "no-duplicate-case": "error",
});

/**
 * Creates injection prevention rules from security patterns
 * @param {Array<Object>} securityPatterns - Security patterns array
 * @returns {Object} Injection prevention rules
 * @example
 * const injectionRules = createInjectionPreventionRules(patterns);
 */
export const createInjectionPreventionRules = (securityPatterns) => {
  const injectionPatterns = SecurityPatternModel.filterByType(
    securityPatterns,
    SecurityPatternModel.TYPES.CODE_INJECTION
  );

  const xssPatterns = SecurityPatternModel.filterByType(
    securityPatterns,
    SecurityPatternModel.TYPES.XSS_PREVENTION
  );

  const rules = {};

  // Create no-restricted-syntax rules for injection patterns
  if (injectionPatterns.length > 0) {
    const restrictedSyntax = injectionPatterns.map((pattern) => ({
      selector: pattern.selector,
      message: `🔴 INJECTION RISK: ${pattern.message}`,
    }));

    rules["no-restricted-syntax"] = ["error", ...restrictedSyntax];
  }

  // Add XSS prevention rules
  if (xssPatterns.length > 0) {
    // Extract innerHTML and DOM manipulation patterns
    const domPatterns = xssPatterns.filter(
      (pattern) =>
        pattern.selector.includes("innerHTML") ||
        pattern.selector.includes("outerHTML")
    );

    if (domPatterns.length > 0) {
      rules["no-restricted-properties"] = [
        "error",
        ...domPatterns.map((_pattern) => ({
          object: "element",
          property: "innerHTML",
          message: "🔴 XSS RISK: Use textContent or safe DOM methods instead",
        })),
      ];
    }
  }

  return rules;
};

/**
 * Creates cryptographic security rules
 * @returns {Object} Cryptographic rules
 * @example
 * const cryptoRules = createCryptographicRules();
 */
export const createCryptographicRules = () => ({
  // A02:2021 – Cryptographic Failures
  "no-restricted-globals": [
    "error",
    {
      name: "Math.random",
      message:
        "🔴 CRYPTO: Math.random() is not cryptographically secure. Use crypto.randomBytes()",
    },
  ],

  // Prevent weak random number generation
  "no-restricted-syntax": [
    "error",
    {
      selector:
        "CallExpression[callee.object.name='Math'][callee.property.name='random']",
      message:
        "🔴 CRYPTO: Math.random() is not cryptographically secure for sensitive operations",
    },
  ],
});

/**
 * Creates rules for vulnerable component management
 * @param {Array<Object>} vulnerabilities - Vulnerabilities array
 * @param {string} severityLevel - Minimum severity level
 * @returns {Object} Vulnerable component rules
 * @example
 * const componentRules = createVulnerableComponentRules(vulns, 'high');
 */
export const createVulnerableComponentRules = (
  vulnerabilities,
  severityLevel
) => {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const minSeverityOrder = severityOrder[severityLevel] ?? 2;

  // Filter vulnerabilities by minimum severity
  const relevantVulns = vulnerabilities.filter((vuln) => {
    const vulnSeverityOrder = severityOrder[vuln.severity] ?? 3;
    return vulnSeverityOrder <= minSeverityOrder;
  });

  if (relevantVulns.length === 0) {
    return {};
  }

  // Group vulnerabilities by severity for different rule treatments
  const groupedVulns = VulnerabilityModel.groupBySeverity(relevantVulns);

  const restrictedPaths = [];
  const restrictedPatterns = [];

  // Critical vulnerabilities - block completely
  if (groupedVulns.critical) {
    restrictedPaths.push(
      ...groupedVulns.critical.map((vuln) => ({
        name: vuln.name,
        message: `🔴 CRITICAL: ${vuln.vulnerability} (${vuln.cve}). ${vuln.fix}`,
      }))
    );
  }

  // High vulnerabilities - warn with detailed info
  if (groupedVulns.high) {
    restrictedPaths.push(
      ...groupedVulns.high.map((vuln) => ({
        name: vuln.name,
        message: `⚠️ HIGH RISK: ${vuln.vulnerability} (${vuln.cve}). ${vuln.fix}`,
      }))
    );
  }

  // Medium vulnerabilities - info level
  if (groupedVulns.medium) {
    restrictedPatterns.push(
      ...groupedVulns.medium.map((vuln) => ({
        group: [`*${vuln.name}*`],
        message: `💡 MEDIUM RISK: ${vuln.vulnerability}. Consider: ${
          vuln.alternatives?.join(", ") || "alternative solutions"
        }`,
      }))
    );
  }

  return {
    "no-restricted-imports": [
      "error",
      {
        paths: restrictedPaths,
        patterns: restrictedPatterns,
      },
    ],
  };
};

/**
 * Creates secure design rules
 * @returns {Object} Secure design rules
 * @example
 * const designRules = createSecureDesignRules();
 */
export const createSecureDesignRules = () => ({
  // A04:2021 – Insecure Design
  complexity: ["error", { max: 6 }],
  "max-depth": ["error", { max: 4 }],
  "max-params": ["error", { max: 4 }],
  "max-lines-per-function": [
    "error",
    { max: 50, skipBlankLines: true, skipComments: true },
  ],

  // Prevent hardcoded credentials
  "no-restricted-syntax": [
    "error",
    {
      selector: "Property[key.name='password'][value.type='Literal']",
      message:
        "🔴 SECURITY: Hardcoded password detected. Use environment variables",
    },
    {
      selector: "Property[key.name='secret'][value.type='Literal']",
      message:
        "🔴 SECURITY: Hardcoded secret detected. Use environment variables",
    },
    {
      selector: "Property[key.name='apiKey'][value.type='Literal']",
      message:
        "🔴 SECURITY: Hardcoded API key detected. Use environment variables",
    },
  ],
});

/**
 * Merges multiple security rule objects
 * @param {...Object} ruleObjects - Security rule objects to merge
 * @returns {Object} Merged security rules
 * @example
 * const merged = mergeSecurityRules(coreRules, injectionRules, cryptoRules);
 */
export const mergeSecurityRules = (...ruleObjects) => {
  return ruleObjects.reduce((merged, rules) => {
    Object.entries(rules).forEach(([ruleName, ruleConfig]) => {
      if (merged[ruleName]) {
        // Special handling for array-based rules like no-restricted-syntax
        if (Array.isArray(ruleConfig) && Array.isArray(merged[ruleName])) {
          const [severity, ...existingOptions] = merged[ruleName];
          const [_newSeverity, ...newOptions] = ruleConfig;
          merged[ruleName] = [severity, ...existingOptions, ...newOptions];
        } else {
          // Override with new rule
          merged[ruleName] = ruleConfig;
        }
      } else {
        merged[ruleName] = ruleConfig;
      }
    });
    return merged;
  }, {});
};

/**
 * Filters security rules by OWASP category
 * @param {Object} rules - Security rules object
 * @param {string} owaspCategory - OWASP Top 10 category
 * @returns {Object} Filtered rules
 * @example
 * const injectionRules = filterByOwaspCategory(rules, 'A03:2021');
 */
export const filterByOwaspCategory = (rules, owaspCategory) => {
  // This would require metadata about which rules belong to which OWASP category
  // For now, return basic filtering based on rule names
  const categoryMapping = {
    "A03:2021": ["no-eval", "no-implied-eval", "no-new-func", "no-script-url"],
    "A02:2021": ["no-restricted-globals"],
    "A05:2021": ["no-proto", "no-iterator", "no-with"],
    "A06:2021": ["no-restricted-imports"],
  };

  const relevantRuleNames = categoryMapping[owaspCategory] || [];

  return Object.keys(rules)
    .filter((ruleName) => relevantRuleNames.includes(ruleName))
    .reduce(
      (filtered, ruleName) => ({
        ...filtered,
        [ruleName]: rules[ruleName],
      }),
      {}
    );
};

/**
 * Validates security rules configuration
 * @param {Object} securityRules - Security rules to validate
 * @returns {Object} Validation result
 * @example
 * const result = validateSecurityRules(rules);
 */
export const validateSecurityRules = (securityRules) => {
  const errors = [];
  const warnings = [];

  // Check for essential security rules
  const essentialRules = ["no-eval", "no-implied-eval", "no-new-func"];
  essentialRules.forEach((ruleName) => {
    if (!securityRules[ruleName]) {
      errors.push(`Missing essential security rule: ${ruleName}`);
    }
  });

  // Check for vulnerable component protection
  if (!securityRules["no-restricted-imports"]) {
    warnings.push("No vulnerable component restrictions configured");
  }

  // Validate rule configurations
  Object.entries(securityRules).forEach(([ruleName, ruleConfig]) => {
    if (typeof ruleConfig !== "string" && !Array.isArray(ruleConfig)) {
      errors.push(`Invalid configuration for rule: ${ruleName}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    securityRuleCount: Object.keys(securityRules).length,
  };
};

/**
 * Security Rules Controller Class
 * Implements functional programming with class-like interface for OWASP Top 10
 */
export class SecurityRulesController {
  /**
   * Creates comprehensive security rules
   * @param {Object} options - Rule generation options
   * @returns {Promise<Object>} Security rules object
   */
  async createSecurityRules(options = {}) {
    return createSecurityRules(options);
  }

  /**
   * Creates core security rules (OWASP focus)
   * @param {Object} options - Core rule options
   * @returns {Promise<Object>} Core security rules
   */
  async createCoreSecurityRules(options = {}) {
    return createCoreSecurityRules(options);
  }

  /**
   * Validates security rules configuration
   * @param {Object} securityRules - Rules to validate
   * @returns {Object} Validation result
   */
  validateSecurityRules(securityRules) {
    return validateSecurityRules(securityRules);
  }

  /**
   * Gets OWASP rule categories
   * @returns {Object} OWASP categories
   */
  getOwaspCategories() {
    return OWASP_RULE_CATEGORIES;
  }
}

// Pure function exports for functional composition
export const SecurityRulesFunctions = Object.freeze({
  createSecurityRules,
  createCoreSecurityRules,
  createInjectionPreventionRules,
  createCryptographicRules,
  createVulnerableComponentRules,
  createSecureDesignRules,
  mergeSecurityRules,
  filterByOwaspCategory,
  validateSecurityRules,
  OWASP_RULE_CATEGORIES,
});

export default SecurityRulesController;
