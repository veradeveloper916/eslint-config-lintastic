/**
 * 🛡️ RULE MODEL - DevSecOps ESLint Rule Data Model
 *
 * Modelo funcional para el manejo de reglas de ESLint y seguridad
 * Implementa principios funcionales: inmutabilidad, composición, pure functions
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

/**
 * Rule severity levels with their corresponding actions
 */
export const RULE_SEVERITIES = Object.freeze({
  OFF: "off",
  WARN: "warn",
  ERROR: "error",
});

/**
 * Rule categories for organization and filtering
 */
export const RULE_CATEGORIES = Object.freeze({
  SECURITY: "security",
  PERFORMANCE: "performance",
  STYLE: "style",
  BEST_PRACTICES: "best-practices",
  DEVSECOPS: "devsecops",
  OWASP: "owasp",
});

/**
 * Creates a new ESLint rule object with immutable properties
 * @param {Object} data - Rule data
 * @param {string} data.name - Rule name
 * @param {string} data.severity - Rule severity ('off', 'warn', 'error')
 * @param {Object|Array} data.options - Rule options/configuration
 * @param {string} data.category - Rule category
 * @param {string} data.description - Rule description
 * @param {string} data.rationale - Security/DevSecOps rationale
 * @param {Array<string>} data.tags - Rule tags for filtering
 * @returns {Object} Immutable rule object
 * @example
 * const rule = createRule({
 *   name: 'no-eval',
 *   severity: 'error',
 *   category: 'security',
 *   description: 'Disallow eval() usage',
 *   rationale: 'Prevents code injection attacks'
 * });
 */
export const createRule = (data) =>
  Object.freeze({
    id: generateRuleId(data.name, data.category),
    name: data.name,
    severity: data.severity || RULE_SEVERITIES.ERROR,
    options: data.options
      ? Object.freeze(
          Array.isArray(data.options) ? [...data.options] : { ...data.options }
        )
      : null,
    category: data.category || RULE_CATEGORIES.BEST_PRACTICES,
    description: data.description,
    rationale: data.rationale,
    tags: Object.freeze([...(data.tags || [])]),
    plugin: data.plugin || null,
    createdAt: new Date().toISOString(),
    isSecurityRule: isSecurityRelated(data.category, data.tags),
  });

/**
 * Generates a unique ID for rule tracking
 * @param {string} ruleName - Rule name
 * @param {string} category - Rule category
 * @returns {string} Unique rule ID
 * @example
 * generateRuleId('no-eval', 'security') // => 'security_no-eval'
 */
export const generateRuleId = (ruleName, category) =>
  `${category}_${ruleName}`.replace(/[^a-zA-Z0-9_-]/g, "_");

/**
 * Determines if a rule is security-related
 * @param {string} category - Rule category
 * @param {Array<string>} tags - Rule tags
 * @returns {boolean} True if security-related
 * @example
 * isSecurityRelated('security', ['owasp', 'injection']) // => true
 */
export const isSecurityRelated = (category, tags = []) => {
  const securityCategories = ["security", "devsecops", "owasp"];
  const securityTags = [
    "security",
    "vulnerability",
    "owasp",
    "injection",
    "xss",
    "csrf",
  ];

  return (
    securityCategories.includes(category) ||
    tags.some((tag) => securityTags.includes(tag.toLowerCase()))
  );
};

/**
 * Validates rule data structure
 * @param {Object} data - Rule data to validate
 * @returns {Object} Validation result with isValid and errors
 * @example
 * const result = validateRule({ name: 'no-eval', severity: 'error' });
 * if (!result.isValid) console.log(result.errors);
 */
export const validateRule = (data) => {
  const errors = [];

  // Check required fields
  if (!data.name || typeof data.name !== "string") {
    errors.push("Missing or invalid required field: name");
  }

  // Validate severity
  const validSeverities = Object.values(RULE_SEVERITIES);
  if (data.severity && !validSeverities.includes(data.severity)) {
    errors.push(
      `Invalid severity level: ${
        data.severity
      }. Must be one of: ${validSeverities.join(", ")}`
    );
  }

  // Validate category
  const validCategories = Object.values(RULE_CATEGORIES);
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(
      `Invalid category: ${
        data.category
      }. Must be one of: ${validCategories.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Filters rules by category
 * @param {Array<Object>} rules - Array of rule objects
 * @param {string} category - Category to filter by
 * @returns {Array<Object>} Filtered rules
 * @example
 * const securityRules = filterByCategory(rules, 'security');
 */
export const filterByCategory = (rules, category) =>
  rules.filter((rule) => rule.category === category);

/**
 * Filters rules by severity level
 * @param {Array<Object>} rules - Array of rule objects
 * @param {string} severity - Severity level to filter by
 * @returns {Array<Object>} Filtered rules
 * @example
 * const errorRules = filterBySeverity(rules, 'error');
 */
export const filterBySeverity = (rules, severity) =>
  rules.filter((rule) => rule.severity === severity);

/**
 * Gets only security-related rules
 * @param {Array<Object>} rules - Array of rule objects
 * @returns {Array<Object>} Security rules only
 * @example
 * const securityRules = getSecurityRules(rules);
 */
export const getSecurityRules = (rules) =>
  rules.filter((rule) => rule.isSecurityRule);

/**
 * Groups rules by category
 * @param {Array<Object>} rules - Array of rule objects
 * @returns {Object} Rules grouped by category
 * @example
 * const grouped = groupByCategory(rules);
 * // { security: [...], performance: [...], style: [...] }
 */
export const groupByCategory = (rules) =>
  rules.reduce((groups, rule) => {
    const category = rule.category;
    return {
      ...groups,
      [category]: [...(groups[category] || []), rule],
    };
  }, {});

/**
 * Searches rules by name, description, or tags
 * @param {Array<Object>} rules - Array of rule objects
 * @param {string} query - Search query
 * @returns {Array<Object>} Matching rules
 * @example
 * const results = searchRules(rules, 'security');
 */
export const searchRules = (rules, query) => {
  const searchTerm = query.toLowerCase();

  return rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm) ||
      rule.description?.toLowerCase().includes(searchTerm) ||
      rule.rationale?.toLowerCase().includes(searchTerm) ||
      rule.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
};

/**
 * Converts rule to ESLint configuration format
 * @param {Object} rule - Rule object
 * @returns {Array} ESLint rule configuration [severity, options]
 * @example
 * const config = toESLintConfig(rule);
 * // ['error', { max: 10 }]
 */
export const toESLintConfig = (rule) => {
  if (rule.options) {
    return [rule.severity, rule.options];
  }
  return rule.severity;
};

/**
 * Converts multiple rules to ESLint rules object
 * @param {Array<Object>} rules - Array of rule objects
 * @returns {Object} ESLint rules configuration object
 * @example
 * const eslintRules = toESLintRules([rule1, rule2]);
 * // { 'no-eval': 'error', 'max-lines': ['error', { max: 300 }] }
 */
export const toESLintRules = (rules) =>
  rules.reduce(
    (eslintRules, rule) => ({
      ...eslintRules,
      [rule.name]: toESLintConfig(rule),
    }),
    {}
  );

/**
 * Creates a security-focused rule with DevSecOps rationale
 * @param {Object} data - Rule data with security context
 * @returns {Object} Security rule object
 * @example
 * const securityRule = createSecurityRule({
 *   name: 'no-eval',
 *   description: 'Disallow eval() usage',
 *   owaspCategory: 'A03:2021',
 *   riskLevel: 'critical'
 * });
 */
export const createSecurityRule = (data) =>
  createRule({
    ...data,
    category: RULE_CATEGORIES.SECURITY,
    severity: data.severity || RULE_SEVERITIES.ERROR,
    tags: [...(data.tags || []), "security", "devsecops"],
    rationale: data.rationale || `DevSecOps Security Rule: ${data.description}`,
    owaspCategory: data.owaspCategory,
    riskLevel: data.riskLevel,
  });

// Pure function exports for functional composition
export const RuleModel = Object.freeze({
  create: createRule,
  createSecurity: createSecurityRule,
  validate: validateRule,
  filterByCategory,
  filterBySeverity,
  getSecurityRules,
  groupByCategory,
  search: searchRules,
  toESLintConfig,
  toESLintRules,
  generateId: generateRuleId,
  isSecurityRelated,
  SEVERITIES: RULE_SEVERITIES,
  CATEGORIES: RULE_CATEGORIES,
});

export default RuleModel;
