/**
 * 🛡️ SECURITY PATTERN MODEL - DevSecOps AST Security Pattern Data Model
 *
 * Modelo funcional para el manejo de patrones de seguridad AST
 * Implementa principios funcionales: inmutabilidad, composición, pure functions
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

/**
 * Security pattern severity levels
 */
export const PATTERN_SEVERITIES = Object.freeze({
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
  INFO: "info",
});

/**
 * OWASP Top 10 categories for pattern classification
 */
export const OWASP_CATEGORIES = Object.freeze({
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
 * Security pattern types for categorization
 */
export const PATTERN_TYPES = Object.freeze({
  CODE_INJECTION: "code-injection",
  XSS_PREVENTION: "xss-prevention",
  PROTOTYPE_POLLUTION: "prototype-pollution",
  INSECURE_RANDOM: "insecure-random",
  HARDCODED_CREDENTIALS: "hardcoded-credentials",
  UNSAFE_EVAL: "unsafe-eval",
  DOM_MANIPULATION: "dom-manipulation",
  CRYPTOGRAPHIC: "cryptographic",
});

/**
 * Creates a new security pattern object with immutable properties
 * @param {Object} data - Security pattern data
 * @param {string} data.selector - AST selector for pattern matching
 * @param {string} data.message - Security warning message
 * @param {string} data.severity - Pattern severity level
 * @param {string} data.type - Pattern type category
 * @param {string} data.owaspCategory - OWASP Top 10 category
 * @param {string} data.description - Detailed pattern description
 * @param {Array<string>} data.references - Security references
 * @param {Array<string>} data.alternatives - Secure alternatives
 * @returns {Object} Immutable security pattern object
 * @example
 * const pattern = createSecurityPattern({
 *   selector: "CallExpression[callee.name='eval']",
 *   message: "eval() usage detected - Code injection risk",
 *   severity: 'critical',
 *   type: 'code-injection'
 * });
 */
export const createSecurityPattern = (data) =>
  Object.freeze({
    id: generatePatternId(data.selector, data.type),
    selector: data.selector,
    message: data.message,
    severity: data.severity || PATTERN_SEVERITIES.HIGH,
    type: data.type,
    owaspCategory: data.owaspCategory,
    description: data.description,
    rationale: data.rationale,
    references: Object.freeze([...(data.references || [])]),
    alternatives: Object.freeze([...(data.alternatives || [])]),
    examples: Object.freeze([...(data.examples || [])]),
    createdAt: new Date().toISOString(),
    riskLevel: mapSeverityToRiskLevel(data.severity),
  });

/**
 * Generates a unique ID for security pattern tracking
 * @param {string} selector - AST selector
 * @param {string} type - Pattern type
 * @returns {string} Unique pattern ID
 * @example
 * generatePatternId("CallExpression[callee.name='eval']", 'code-injection')
 * // => 'code-injection_CallExpression_callee_eval'
 */
export const generatePatternId = (selector, type) => {
  const cleanSelector = selector.replace(/[^a-zA-Z0-9_]/g, "_");
  return `${type}_${cleanSelector}`.substring(0, 100);
};

/**
 * Maps severity level to risk assessment
 * @param {string} severity - Severity level
 * @returns {string} Risk level classification
 * @example
 * mapSeverityToRiskLevel('critical') // => 'immediate'
 */
export const mapSeverityToRiskLevel = (severity) => {
  const riskMap = Object.freeze({
    critical: "immediate",
    high: "urgent",
    medium: "moderate",
    low: "minor",
    info: "informational",
  });

  return riskMap[severity] || "unknown";
};

/**
 * Validates security pattern data structure
 * @param {Object} data - Pattern data to validate
 * @returns {Object} Validation result with isValid and errors
 * @example
 * const result = validateSecurityPattern({ selector: 'CallExpression', message: 'Test' });
 * if (!result.isValid) console.log(result.errors);
 */
export const validateSecurityPattern = (data) => {
  const errors = [];

  // Check required fields
  const requiredFields = ["selector", "message", "severity", "type"];
  requiredFields.forEach((field) => {
    if (!data[field] || typeof data[field] !== "string") {
      errors.push(`Missing or invalid required field: ${field}`);
    }
  });

  // Validate severity level
  const validSeverities = Object.values(PATTERN_SEVERITIES);
  if (data.severity && !validSeverities.includes(data.severity)) {
    errors.push(
      `Invalid severity level: ${
        data.severity
      }. Must be one of: ${validSeverities.join(", ")}`
    );
  }

  // Validate pattern type
  const validTypes = Object.values(PATTERN_TYPES);
  if (data.type && !validTypes.includes(data.type)) {
    errors.push(
      `Invalid pattern type: ${data.type}. Must be one of: ${validTypes.join(
        ", "
      )}`
    );
  }

  // Basic AST selector validation
  if (
    data.selector &&
    !data.selector.includes("Expression") &&
    !data.selector.includes("Statement")
  ) {
    errors.push(
      `Potentially invalid AST selector: ${data.selector}. Should contain Expression or Statement`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Filters patterns by severity level
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @param {string} severity - Severity level to filter by
 * @returns {Array<Object>} Filtered patterns
 * @example
 * const criticalPatterns = filterBySeverity(patterns, 'critical');
 */
export const filterBySeverity = (patterns, severity) =>
  patterns.filter((pattern) => pattern.severity === severity);

/**
 * Filters patterns by type
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @param {string} type - Pattern type to filter by
 * @returns {Array<Object>} Filtered patterns
 * @example
 * const injectionPatterns = filterByType(patterns, 'code-injection');
 */
export const filterByType = (patterns, type) =>
  patterns.filter((pattern) => pattern.type === type);

/**
 * Filters patterns by OWASP category
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @param {string} owaspCategory - OWASP category to filter by
 * @returns {Array<Object>} Filtered patterns
 * @example
 * const injectionPatterns = filterByOwaspCategory(patterns, 'A03:2021');
 */
export const filterByOwaspCategory = (patterns, owaspCategory) =>
  patterns.filter((pattern) => pattern.owaspCategory === owaspCategory);

/**
 * Gets critical security patterns only
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @returns {Array<Object>} Critical patterns only
 * @example
 * const criticalPatterns = getCriticalPatterns(patterns);
 */
export const getCriticalPatterns = (patterns) =>
  patterns.filter(
    (pattern) => pattern.severity === PATTERN_SEVERITIES.CRITICAL
  );

/**
 * Groups patterns by severity level
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @returns {Object} Patterns grouped by severity
 * @example
 * const grouped = groupBySeverity(patterns);
 * // { critical: [...], high: [...], medium: [...] }
 */
export const groupBySeverity = (patterns) =>
  patterns.reduce((groups, pattern) => {
    const severity = pattern.severity;
    return {
      ...groups,
      [severity]: [...(groups[severity] || []), pattern],
    };
  }, {});

/**
 * Groups patterns by type
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @returns {Object} Patterns grouped by type
 * @example
 * const grouped = groupByType(patterns);
 * // { 'code-injection': [...], 'xss-prevention': [...] }
 */
export const groupByType = (patterns) =>
  patterns.reduce((groups, pattern) => {
    const type = pattern.type;
    return {
      ...groups,
      [type]: [...(groups[type] || []), pattern],
    };
  }, {});

/**
 * Sorts patterns by severity (critical first)
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @returns {Array<Object>} Sorted patterns
 * @example
 * const sorted = sortBySeverity(patterns);
 */
export const sortBySeverity = (patterns) => {
  const severityOrder = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };

  return [...patterns].sort((a, b) => {
    const orderA = severityOrder[a.severity] ?? 999;
    const orderB = severityOrder[b.severity] ?? 999;
    return orderA - orderB;
  });
};

/**
 * Searches patterns by selector, message, or type
 * @param {Array<Object>} patterns - Array of security pattern objects
 * @param {string} query - Search query
 * @returns {Array<Object>} Matching patterns
 * @example
 * const results = searchPatterns(patterns, 'eval');
 */
export const searchPatterns = (patterns, query) => {
  const searchTerm = query.toLowerCase();

  return patterns.filter(
    (pattern) =>
      pattern.selector.toLowerCase().includes(searchTerm) ||
      pattern.message.toLowerCase().includes(searchTerm) ||
      pattern.type.toLowerCase().includes(searchTerm) ||
      pattern.description?.toLowerCase().includes(searchTerm)
  );
};

/**
 * Converts security pattern to ESLint AST rule format
 * @param {Object} pattern - Security pattern object
 * @returns {Object} ESLint AST rule configuration
 * @example
 * const astRule = toESLintASTRule(pattern);
 */
export const toESLintASTRule = (pattern) => ({
  selector: pattern.selector,
  message: pattern.message,
  severity: pattern.severity,
  data: {
    type: pattern.type,
    owaspCategory: pattern.owaspCategory,
    alternatives: pattern.alternatives,
  },
});

/**
 * Creates a code injection security pattern
 * @param {Object} data - Pattern-specific data
 * @returns {Object} Code injection security pattern
 * @example
 * const evalPattern = createCodeInjectionPattern({
 *   selector: "CallExpression[callee.name='eval']",
 *   message: "eval() usage detected"
 * });
 */
export const createCodeInjectionPattern = (data) =>
  createSecurityPattern({
    ...data,
    type: PATTERN_TYPES.CODE_INJECTION,
    owaspCategory: OWASP_CATEGORIES.A03_INJECTION,
    severity: data.severity || PATTERN_SEVERITIES.CRITICAL,
  });

// Pure function exports for functional composition
export const SecurityPatternModel = Object.freeze({
  create: createSecurityPattern,
  createCodeInjection: createCodeInjectionPattern,
  validate: validateSecurityPattern,
  filterBySeverity,
  filterByType,
  filterByOwaspCategory,
  getCriticalPatterns,
  groupBySeverity,
  groupByType,
  sortBySeverity,
  search: searchPatterns,
  toESLintASTRule,
  generateId: generatePatternId,
  mapSeverityToRiskLevel,
  SEVERITIES: PATTERN_SEVERITIES,
  OWASP_CATEGORIES,
  TYPES: PATTERN_TYPES,
});

export default SecurityPatternModel;
