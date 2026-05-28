/**
 * 🛡️ RULE GENERATOR SERVICE - DevSecOps Rule Generation Service
 *
 * Servicio especializado en la generación dinámica de reglas ESLint
 * Implementa paradigma funcional con generación de reglas basada en patrones
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import RuleModel from "../models/rule.model.js";
import SecurityPatternModel from "../models/security-pattern.model.js";
import VulnerabilityModel from "../models/vulnerability.model.js";

/**
 * Rule generation strategies for different security contexts
 */
export const GENERATION_STRATEGIES = Object.freeze({
  OWASP_FOCUSED: "owasp-focused",
  VULNERABILITY_DRIVEN: "vulnerability-driven",
  PATTERN_BASED: "pattern-based",
  COMPREHENSIVE: "comprehensive",
  MINIMAL_SECURITY: "minimal-security",
});

/**
 * Rule templates for common security patterns
 */
export const RULE_TEMPLATES = Object.freeze({
  NO_RESTRICTED_SYNTAX: {
    name: "no-restricted-syntax",
    template: (patterns) => [
      "error",
      ...patterns.map((pattern) => ({
        selector: pattern.selector,
        message: pattern.message,
      })),
    ],
  },
  NO_RESTRICTED_IMPORTS: {
    name: "no-restricted-imports",
    template: (vulnerabilities) => [
      "error",
      {
        paths: vulnerabilities.map((vuln) => ({
          name: vuln.name,
          message: `🔴 SECURITY: ${vuln.vulnerability} - ${vuln.fix}`,
        })),
      },
    ],
  },
  NO_RESTRICTED_GLOBALS: {
    name: "no-restricted-globals",
    template: (globals) => [
      "error",
      ...globals.map((global) => ({
        name: global.name,
        message: global.message,
      })),
    ],
  },
});

/**
 * Generates comprehensive ESLint rules based on strategy and data
 * @param {Object} options - Rule generation options
 * @param {string} options.strategy - Generation strategy
 * @param {Array<Object>} options.vulnerabilities - Vulnerability data
 * @param {Array<Object>} options.securityPatterns - Security patterns
 * @param {Array<Object>} options.customRules - Custom rule definitions
 * @param {string} options.severity - Default severity level
 * @returns {Object} Generated ESLint rules configuration
 * @example
 * const rules = generateRules({
 *   strategy: 'comprehensive',
 *   vulnerabilities: vulnData,
 *   securityPatterns: patterns,
 *   severity: 'error'
 * });
 */
export const generateRules = (options = {}) => {
  const {
    strategy = GENERATION_STRATEGIES.COMPREHENSIVE,
    vulnerabilities = [],
    securityPatterns = [],
    customRules = [],
    severity = "error",
  } = options;

  const generationContext = {
    strategy,
    vulnerabilities,
    securityPatterns,
    customRules,
    defaultSeverity: severity,
    generatedAt: new Date().toISOString(),
  };

  switch (strategy) {
    case GENERATION_STRATEGIES.OWASP_FOCUSED:
      return generateOwaspFocusedRules(generationContext);

    case GENERATION_STRATEGIES.VULNERABILITY_DRIVEN:
      return generateVulnerabilityDrivenRules(generationContext);

    case GENERATION_STRATEGIES.PATTERN_BASED:
      return generatePatternBasedRules(generationContext);

    case GENERATION_STRATEGIES.MINIMAL_SECURITY:
      return generateMinimalSecurityRules(generationContext);

    case GENERATION_STRATEGIES.COMPREHENSIVE:
    default:
      return generateComprehensiveRules(generationContext);
  }
};

/**
 * Generates OWASP Top 10 focused rules
 * @param {Object} context - Generation context
 * @returns {Object} OWASP-focused rules
 * @example
 * const owaspRules = generateOwaspFocusedRules(context);
 */
export const generateOwaspFocusedRules = (context) => {
  const { securityPatterns, defaultSeverity } = context;

  const rules = {
    // A01:2021 – Broken Access Control
    "no-restricted-globals": [
      defaultSeverity,
      {
        name: "event",
        message: "🔴 A01:2021 - Global event variable can be manipulated",
      },
    ],

    // A02:2021 – Cryptographic Failures
    "no-restricted-syntax": generateCryptographicFailureRules(defaultSeverity),

    // A03:2021 – Injection
    "no-eval": defaultSeverity,
    "no-implied-eval": defaultSeverity,
    "no-new-func": defaultSeverity,

    // A04:2021 – Insecure Design
    complexity: [defaultSeverity, { max: 6 }],
    "max-depth": [defaultSeverity, { max: 4 }],

    // A05:2021 – Security Misconfiguration
    "no-proto": defaultSeverity,
    "no-with": defaultSeverity,

    // A06:2021 – Vulnerable and Outdated Components
    "no-restricted-imports": generateVulnerableComponentRules(
      context.vulnerabilities,
      defaultSeverity
    ),
  };

  // Add pattern-based rules for OWASP categories
  const owaspPatterns = securityPatterns.filter(
    (pattern) => pattern.owaspCategory
  );
  if (owaspPatterns.length > 0) {
    const existingRestricted = rules["no-restricted-syntax"];
    const patternRules = owaspPatterns.map((pattern) => ({
      selector: pattern.selector,
      message: `🔴 ${pattern.owaspCategory} - ${pattern.message}`,
    }));

    rules["no-restricted-syntax"] = Array.isArray(existingRestricted)
      ? [...existingRestricted, ...patternRules]
      : [defaultSeverity, ...patternRules];
  }

  return rules;
};

/**
 * Generates vulnerability-driven rules
 * @param {Object} context - Generation context
 * @returns {Object} Vulnerability-driven rules
 * @example
 * const vulnRules = generateVulnerabilityDrivenRules(context);
 */
export const generateVulnerabilityDrivenRules = (context) => {
  const { vulnerabilities, defaultSeverity } = context;

  if (vulnerabilities.length === 0) {
    return {};
  }

  // Group vulnerabilities by severity
  const groupedVulns = VulnerabilityModel.groupBySeverity(vulnerabilities);

  const rules = {};

  // Critical vulnerabilities - block imports
  if (groupedVulns.critical?.length > 0) {
    rules["no-restricted-imports"] = [
      "error",
      {
        paths: groupedVulns.critical.map((vuln) => ({
          name: vuln.name,
          message: `🔴 CRITICAL: ${vuln.vulnerability} (${vuln.cve}) - ${vuln.fix}`,
        })),
      },
    ];
  }

  // High severity vulnerabilities - warn on patterns
  if (groupedVulns.high?.length > 0) {
    const highVulnPatterns = groupedVulns.high
      .filter((vuln) => vuln.pattern)
      .map((vuln) => ({
        group: [`*${vuln.name}*`],
        message: `⚠️ HIGH RISK: ${
          vuln.vulnerability
        } - Consider alternatives: ${vuln.alternatives?.join(", ")}`,
      }));

    if (highVulnPatterns.length > 0) {
      rules["no-restricted-imports"] = rules["no-restricted-imports"]
        ? [...rules["no-restricted-imports"], { patterns: highVulnPatterns }]
        : [defaultSeverity, { patterns: highVulnPatterns }];
    }
  }

  // Medium vulnerabilities - informational warnings
  if (groupedVulns.medium?.length > 0) {
    groupedVulns.medium.forEach((vuln) => {
      if (vuln.name && vuln.alternatives?.length > 0) {
        const ruleName = `no-restricted-${vuln.name.replace(
          /[^a-zA-Z0-9]/g,
          "-"
        )}`;
        rules[ruleName] = [
          "warn",
          `💡 Consider alternatives to ${vuln.name}: ${vuln.alternatives.join(
            ", "
          )}`,
        ];
      }
    });
  }

  return rules;
};

/**
 * Generates pattern-based security rules
 * @param {Object} context - Generation context
 * @returns {Object} Pattern-based rules
 * @example
 * const patternRules = generatePatternBasedRules(context);
 */
export const generatePatternBasedRules = (context) => {
  const { securityPatterns, defaultSeverity } = context;

  if (securityPatterns.length === 0) {
    return {};
  }

  // Group patterns by type and severity
  const groupedPatterns = SecurityPatternModel.groupByType(securityPatterns);
  const rules = {};

  // Code injection patterns
  if (groupedPatterns["code-injection"]?.length > 0) {
    rules["no-restricted-syntax"] = [
      defaultSeverity,
      ...groupedPatterns["code-injection"].map((pattern) => ({
        selector: pattern.selector,
        message: `🔴 CODE INJECTION: ${pattern.message}`,
      })),
    ];
  }

  // XSS prevention patterns
  if (groupedPatterns["xss-prevention"]?.length > 0) {
    const xssRules = groupedPatterns["xss-prevention"].map((pattern) => ({
      selector: pattern.selector,
      message: `🔴 XSS RISK: ${pattern.message}`,
    }));

    rules["no-restricted-syntax"] = rules["no-restricted-syntax"]
      ? [...rules["no-restricted-syntax"], ...xssRules]
      : [defaultSeverity, ...xssRules];
  }

  // Prototype pollution patterns
  if (groupedPatterns["prototype-pollution"]?.length > 0) {
    const pollutionRules = groupedPatterns["prototype-pollution"].map(
      (pattern) => ({
        selector: pattern.selector,
        message: `🔴 PROTOTYPE POLLUTION: ${pattern.message}`,
      })
    );

    rules["no-restricted-syntax"] = rules["no-restricted-syntax"]
      ? [...rules["no-restricted-syntax"], ...pollutionRules]
      : [defaultSeverity, ...pollutionRules];
  }

  // Cryptographic patterns
  if (groupedPatterns["cryptographic"]?.length > 0) {
    groupedPatterns["cryptographic"].forEach((pattern) => {
      if (pattern.selector.includes("Math.random")) {
        rules["no-restricted-globals"] = [
          defaultSeverity,
          {
            name: "Math.random",
            message:
              "🔴 CRYPTO: Use crypto.randomBytes() for security-sensitive operations",
          },
        ];
      }
    });
  }

  return rules;
};

/**
 * Generates minimal security rules for basic protection
 * @param {Object} context - Generation context
 * @returns {Object} Minimal security rules
 * @example
 * const minimalRules = generateMinimalSecurityRules(context);
 */
export const generateMinimalSecurityRules = (context) => {
  const { defaultSeverity } = context;

  return {
    // Essential injection prevention
    "no-eval": defaultSeverity,
    "no-implied-eval": defaultSeverity,
    "no-new-func": defaultSeverity,

    // Basic prototype protection
    "no-proto": defaultSeverity,
    "no-extend-native": defaultSeverity,

    // Secure variable handling
    "no-global-assign": defaultSeverity,
    "no-implicit-globals": defaultSeverity,

    // Basic complexity control
    complexity: [defaultSeverity, { max: 10 }],
  };
};

/**
 * Generates comprehensive rules combining all strategies
 * @param {Object} context - Generation context
 * @returns {Object} Comprehensive rules
 * @example
 * const comprehensiveRules = generateComprehensiveRules(context);
 */
export const generateComprehensiveRules = (context) => {
  const owaspRules = generateOwaspFocusedRules(context);
  const vulnRules = generateVulnerabilityDrivenRules(context);
  const patternRules = generatePatternBasedRules(context);
  const customRules = generateCustomRules(
    context.customRules,
    context.defaultSeverity
  );

  return mergeRuleConfigurations(
    owaspRules,
    vulnRules,
    patternRules,
    customRules
  );
};

/**
 * Generates custom rules from user definitions
 * @param {Array<Object>} customRuleData - Custom rule definitions
 * @param {string} defaultSeverity - Default severity level
 * @returns {Object} Custom rules configuration
 * @example
 * const customRules = generateCustomRules(customRuleData, 'error');
 */
export const generateCustomRules = (customRuleData, defaultSeverity) => {
  return customRuleData.reduce((rules, ruleData) => {
    const validation = RuleModel.validate(ruleData);
    if (validation.isValid) {
      const rule = RuleModel.create({
        ...ruleData,
        severity: ruleData.severity || defaultSeverity,
      });
      return {
        ...rules,
        [rule.name]: RuleModel.toESLintConfig(rule),
      };
    } else {
      // Log validation errors in development
      if (process.env.NODE_ENV === "development") {
        process.stderr.write(
          `Invalid custom rule ${ruleData.name}: ${validation.errors.join(
            ", "
          )}\n`
        );
      }
      return rules;
    }
  }, {});
};

/**
 * Generates cryptographic failure prevention rules
 * @param {string} severity - Rule severity
 * @returns {Array} Cryptographic rules configuration
 * @example
 * const cryptoRules = generateCryptographicFailureRules('error');
 */
export const generateCryptographicFailureRules = (severity) => [
  severity,
  {
    selector:
      "CallExpression[callee.object.name='Math'][callee.property.name='random']",
    message: "🔴 A02:2021 - Math.random() is cryptographically insecure",
  },
  {
    selector: "Property[key.name='password'][value.type='Literal']",
    message: "🔴 A02:2021 - Hardcoded password detected",
  },
  {
    selector: "Property[key.name='secret'][value.type='Literal']",
    message: "🔴 A02:2021 - Hardcoded secret detected",
  },
];

/**
 * Generates vulnerable component rules from vulnerability data
 * @param {Array<Object>} vulnerabilities - Vulnerability data
 * @param {string} severity - Rule severity
 * @returns {Array} Vulnerable component rules
 * @example
 * const componentRules = generateVulnerableComponentRules(vulns, 'error');
 */
export const generateVulnerableComponentRules = (vulnerabilities, severity) => {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return [severity, { paths: [] }];
  }

  const criticalVulns = VulnerabilityModel.filterBySeverity(
    vulnerabilities,
    "critical"
  );
  const highVulns = VulnerabilityModel.filterBySeverity(
    vulnerabilities,
    "high"
  );

  const restrictedPaths = [
    ...criticalVulns.map((vuln) => ({
      name: vuln.name,
      message: `🔴 A06:2021 - Critical vulnerability: ${vuln.cve}`,
    })),
    ...highVulns.map((vuln) => ({
      name: vuln.name,
      message: `⚠️ A06:2021 - High vulnerability: ${vuln.cve}`,
    })),
  ];

  return [severity, { paths: restrictedPaths }];
};

/**
 * Merges multiple rule configurations with conflict resolution
 * @param {...Object} ruleConfigs - Rule configuration objects to merge
 * @returns {Object} Merged rule configuration
 * @example
 * const merged = mergeRuleConfigurations(rules1, rules2, rules3);
 */
export const mergeRuleConfigurations = (...ruleConfigs) => {
  return ruleConfigs.reduce((merged, rules) => {
    Object.entries(rules).forEach(([ruleName, ruleConfig]) => {
      if (merged[ruleName]) {
        // Handle array-based rules (like no-restricted-syntax)
        if (Array.isArray(ruleConfig) && Array.isArray(merged[ruleName])) {
          const [severity1, ...options1] = merged[ruleName];
          const [_severity2, ...options2] = ruleConfig;
          merged[ruleName] = [severity1, ...options1, ...options2];
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
 * Validates generated rules configuration
 * @param {Object} rules - Generated rules to validate
 * @returns {Object} Validation result
 * @example
 * const result = validateGeneratedRules(rules);
 */
export const validateGeneratedRules = (rules) => {
  const errors = [];
  const warnings = [];

  // Check for essential security rules
  const essentialRules = ["no-eval", "no-implied-eval", "no-new-func"];
  essentialRules.forEach((ruleName) => {
    if (!rules[ruleName]) {
      warnings.push(`Missing recommended security rule: ${ruleName}`);
    }
  });

  // Validate rule configurations
  Object.entries(rules).forEach(([ruleName, ruleConfig]) => {
    if (typeof ruleConfig !== "string" && !Array.isArray(ruleConfig)) {
      errors.push(`Invalid configuration for rule: ${ruleName}`);
    }

    // Validate severity levels
    const severity = Array.isArray(ruleConfig) ? ruleConfig[0] : ruleConfig;
    if (!["off", "warn", "error", 0, 1, 2].includes(severity)) {
      errors.push(`Invalid severity level for rule ${ruleName}: ${severity}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    ruleCount: Object.keys(rules).length,
  };
};

// Pure function exports for functional composition
export const RuleGeneratorService = Object.freeze({
  generateRules,
  generateOwaspFocusedRules,
  generateVulnerabilityDrivenRules,
  generatePatternBasedRules,
  generateMinimalSecurityRules,
  generateComprehensiveRules,
  generateCustomRules,
  mergeRuleConfigurations,
  validateGeneratedRules,
  GENERATION_STRATEGIES,
  RULE_TEMPLATES,
});

export default RuleGeneratorService;
