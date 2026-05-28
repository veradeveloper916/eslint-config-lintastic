/**
 * 🛡️ SECURITY HELPERS - DevSecOps Security Utilities
 *
 * Utilidades especializadas para análisis de seguridad DevSecOps
 * Funciones puras para validación, sanitización y análisis de vulnerabilidades
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

import { memoize, isString, isObject, isEmpty } from "./functional-helpers.js";

/**
 * Validates if a string contains potentially dangerous patterns
 * @param {string} input - Input to validate
 * @returns {Object} Validation result with security details
 * @example
 * const result = validateSecurityPattern('eval(userInput)');
 * // => { isSecure: false, threats: ['code-injection'], severity: 'critical' }
 */
export const validateSecurityPattern = memoize((input) => {
  if (!isString(input)) {
    return { isSecure: true, threats: [], severity: "none" };
  }

  const dangerousPatterns = {
    critical: [
      /eval\s*\(/i,
      /new\s+Function\s*\(/i,
      /document\.write\s*\(/i,
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /\$\{.*\}/, // Template literal injection
      /javascript:/i,
      /data:.*script/i,
    ],
    high: [
      /setTimeout\s*\(\s*["'].*["']\s*\)/,
      /setInterval\s*\(\s*["'].*["']\s*\)/,
      /window\[.*\]/,
      /location\s*\.\s*href\s*=/i,
      /window\.location/i,
      /document\.cookie/i,
      /localStorage\./i,
      /sessionStorage\./i,
    ],
    medium: [
      /alert\s*\(/i,
      /confirm\s*\(/i,
      /prompt\s*\(/i,
      /console\./i,
      /process\.env/i,
      /require\s*\(/i,
      /import\s*\(/i,
    ],
  };

  const threats = [];
  let severity = "none";

  // Check critical patterns
  for (const pattern of dangerousPatterns.critical) {
    if (pattern.test(input)) {
      threats.push("code-injection");
      severity = "critical";
      break;
    }
  }

  // Check high severity patterns
  if (severity !== "critical") {
    for (const pattern of dangerousPatterns.high) {
      if (pattern.test(input)) {
        threats.push("data-exposure");
        severity = "high";
        break;
      }
    }
  }

  // Check medium severity patterns
  if (severity === "none") {
    for (const pattern of dangerousPatterns.medium) {
      if (pattern.test(input)) {
        threats.push("information-disclosure");
        severity = "medium";
        break;
      }
    }
  }

  return {
    isSecure: threats.length === 0,
    threats,
    severity,
  };
});

/**
 * Sanitizes input to prevent common injection attacks
 * @param {string} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {string} Sanitized input
 * @example
 * const safe = sanitizeInput('<script>alert("xss")</script>');
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
export const sanitizeInput = (input, options = {}) => {
  if (!isString(input)) {
    return String(input);
  }

  const {
    allowHtml = false,
    allowScriptTags = false,
    allowEventHandlers = false,
    maxLength = 1000,
  } = options;

  let sanitized = input.slice(0, maxLength);

  // HTML entity encoding
  if (!allowHtml) {
    sanitized = sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  // Remove script tags
  if (!allowScriptTags) {
    sanitized = sanitized.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      ""
    );
  }

  // Remove event handlers
  if (!allowEventHandlers) {
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  }

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, "");

  return sanitized;
};

/**
 * Analyzes dependency for known vulnerabilities
 * @param {Object} dependency - Dependency object with name and version
 * @returns {Promise<Object>} Vulnerability analysis result
 * @example
 * const analysis = await analyzeDependencyVulnerability({
 *   name: 'lodash',
 *   version: '4.17.15'
 * });
 */
export const analyzeDependencyVulnerability = memoize(async (dependency) => {
  if (!isObject(dependency) || !dependency.name || !dependency.version) {
    return { hasVulnerabilities: false, vulnerabilities: [] };
  }

  // This would typically integrate with vulnerability databases
  // For now, return a mock analysis based on known patterns
  const knownVulnerabilities = {
    lodash: {
      "4.17.15": [
        {
          id: "CVE-2020-8203",
          severity: "high",
          description: "Prototype Pollution vulnerability",
          fixVersion: "4.17.19",
        },
      ],
    },
    moment: {
      "2.24.0": [
        {
          id: "CVE-2022-24785",
          severity: "high",
          description: "Path traversal vulnerability",
          fixVersion: "2.29.2",
        },
      ],
    },
  };

  const depVulns = knownVulnerabilities[dependency.name];
  const versionVulns = depVulns?.[dependency.version] || [];

  return {
    hasVulnerabilities: versionVulns.length > 0,
    vulnerabilities: versionVulns,
    recommendation:
      versionVulns.length > 0
        ? `Update ${dependency.name} to version ${versionVulns[0].fixVersion} or later`
        : "No known vulnerabilities found",
  };
});

/**
 * Generates a security score for code snippet
 * @param {string} code - Code to analyze
 * @returns {Object} Security score and recommendations
 * @example
 * const score = calculateSecurityScore('const data = eval(userInput);');
 * // => { score: 20, grade: 'F', issues: [...], recommendations: [...] }
 */
export const calculateSecurityScore = (code) => {
  if (!isString(code) || isEmpty(code)) {
    return { score: 100, grade: "A", issues: [], recommendations: [] };
  }

  const securityChecks = [
    {
      name: "No eval usage",
      test: (c) => !/eval\s*\(/i.test(c),
      weight: 25,
      message: "Avoid using eval() - it can execute arbitrary code",
    },
    {
      name: "No Function constructor",
      test: (c) => !/new\s+Function\s*\(/i.test(c),
      weight: 25,
      message: "Avoid Function constructor - it can execute arbitrary code",
    },
    {
      name: "No innerHTML assignment",
      test: (c) => !/innerHTML\s*=/i.test(c),
      weight: 15,
      message: "Use textContent or safer DOM methods instead of innerHTML",
    },
    {
      name: "No document.write",
      test: (c) => !/document\.write\s*\(/i.test(c),
      weight: 15,
      message: "Avoid document.write - it can lead to XSS vulnerabilities",
    },
    {
      name: "No dangerous timeouts",
      test: (c) => !/setTimeout\s*\(\s*["'].*["']\s*\)/i.test(c),
      weight: 10,
      message: "Pass functions to setTimeout, not strings",
    },
    {
      name: "No javascript: protocol",
      test: (c) => !/javascript:/i.test(c),
      weight: 10,
      message: "Avoid javascript: protocol in URLs",
    },
  ];

  const results = securityChecks.map((check) => ({
    ...check,
    passed: check.test(code),
  }));

  const score = results.reduce((total, result) => {
    return total + (result.passed ? result.weight : 0);
  }, 0);

  const issues = results.filter((r) => !r.passed);
  const recommendations = issues.map((issue) => issue.message);

  const getGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  return {
    score,
    grade: getGrade(score),
    issues: issues.map((i) => ({ name: i.name, weight: i.weight })),
    recommendations,
  };
};

/**
 * Validates CSP (Content Security Policy) header
 * @param {string} csp - CSP header value
 * @returns {Object} CSP validation result
 * @example
 * const result = validateCSP("default-src 'self'; script-src 'unsafe-eval'");
 * // => { isSecure: false, issues: ['unsafe-eval'], recommendations: [...] }
 */
export const validateCSP = (csp) => {
  if (!isString(csp) || isEmpty(csp)) {
    return {
      isSecure: false,
      issues: ["missing-csp"],
      recommendations: ["Implement a Content Security Policy header"],
    };
  }

  const dangerousDirectives = [
    "'unsafe-eval'",
    "'unsafe-inline'",
    "data:",
    "*",
    "http:",
    "https://*",
  ];

  const issues = [];
  const recommendations = [];

  // Check for dangerous directives
  dangerousDirectives.forEach((directive) => {
    if (csp.includes(directive)) {
      issues.push(`dangerous-directive-${directive.replace(/['"*:]/g, "")}`);
      recommendations.push(
        `Avoid using ${directive} in CSP - it reduces security`
      );
    }
  });

  // Check for required directives
  const requiredDirectives = ["default-src", "script-src", "style-src"];
  requiredDirectives.forEach((directive) => {
    if (!csp.includes(directive)) {
      issues.push(`missing-${directive}`);
      recommendations.push(`Include ${directive} directive in CSP`);
    }
  });

  return {
    isSecure: issues.length === 0,
    issues,
    recommendations,
  };
};

/**
 * Checks for common security headers
 * @param {Object} headers - HTTP headers object
 * @returns {Object} Security headers analysis
 * @example
 * const analysis = analyzeSecurityHeaders({
 *   'x-frame-options': 'DENY',
 *   'x-content-type-options': 'nosniff'
 * });
 */
export const analyzeSecurityHeaders = (headers) => {
  if (!isObject(headers)) {
    return { score: 0, missing: [], present: [], recommendations: [] };
  }

  const securityHeaders = {
    "x-frame-options": {
      description: "Prevents clickjacking attacks",
      weight: 15,
    },
    "x-content-type-options": {
      description: "Prevents MIME type sniffing",
      weight: 10,
    },
    "x-xss-protection": {
      description: "Enables XSS filtering",
      weight: 10,
    },
    "strict-transport-security": {
      description: "Enforces HTTPS connections",
      weight: 20,
    },
    "content-security-policy": {
      description: "Controls resource loading",
      weight: 25,
    },
    "referrer-policy": {
      description: "Controls referrer information",
      weight: 10,
    },
    "permissions-policy": {
      description: "Controls browser features",
      weight: 10,
    },
  };

  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key];
    return acc;
  }, {});

  const present = [];
  const missing = [];

  Object.entries(securityHeaders).forEach(([header, info]) => {
    if (normalizedHeaders[header]) {
      present.push({ header, ...info });
    } else {
      missing.push({ header, ...info });
    }
  });

  const score = present.reduce((total, item) => total + item.weight, 0);
  const recommendations = missing.map(
    (item) => `Add ${item.header} header: ${item.description}`
  );

  return {
    score,
    maxScore: 100,
    present: present.map((p) => p.header),
    missing: missing.map((m) => m.header),
    recommendations,
  };
};

/**
 * Generates secure random values
 * @param {number} length - Length of random value
 * @param {string} charset - Character set to use
 * @returns {string} Secure random string
 * @example
 * const token = generateSecureRandom(32, 'alphanumeric');
 * // => 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6'
 */
export const generateSecureRandom = (length = 32, charset = "alphanumeric") => {
  const charsets = {
    numeric: "0123456789",
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    alphanumeric:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    hex: "0123456789abcdef",
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    symbols:
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*",
  };

  const chars = charsets[charset] || charset;
  let result = "";

  // Use crypto.randomBytes if available (Node.js)
  if (typeof require !== "undefined") {
    try {
      const crypto = require("crypto");
      const bytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
      }
      return result;
    } catch {
      // Fall back to Math.random if crypto is not available
    }
  }

  // Fallback for browser environments
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} Password strength analysis
 * @example
 * const strength = validatePasswordStrength('MyP@ssw0rd123');
 * // => { score: 85, grade: 'Strong', issues: [], recommendations: [] }
 */
export const validatePasswordStrength = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    maxLength = 128,
  } = options;

  if (!isString(password)) {
    return {
      score: 0,
      grade: "Invalid",
      issues: ["not-string"],
      recommendations: [],
    };
  }

  const checks = [
    {
      name: "length",
      test: () => password.length >= minLength && password.length <= maxLength,
      weight: 25,
      message: `Password must be between ${minLength} and ${maxLength} characters`,
    },
    {
      name: "uppercase",
      test: () => !requireUppercase || /[A-Z]/.test(password),
      weight: 20,
      message: "Password must contain uppercase letters",
    },
    {
      name: "lowercase",
      test: () => !requireLowercase || /[a-z]/.test(password),
      weight: 20,
      message: "Password must contain lowercase letters",
    },
    {
      name: "numbers",
      test: () => !requireNumbers || /[0-9]/.test(password),
      weight: 20,
      message: "Password must contain numbers",
    },
    {
      name: "special-chars",
      test: () => !requireSpecialChars || /[^a-zA-Z0-9]/.test(password),
      weight: 15,
      message: "Password must contain special characters",
    },
  ];

  const results = checks.map((check) => ({
    ...check,
    passed: check.test(),
  }));

  const score = results.reduce(
    (total, result) => total + (result.passed ? result.weight : 0),
    0
  );

  const issues = results.filter((r) => !r.passed).map((r) => r.name);
  const recommendations = results
    .filter((r) => !r.passed)
    .map((r) => r.message);

  const getGrade = (score) => {
    if (score >= 90) return "Very Strong";
    if (score >= 75) return "Strong";
    if (score >= 60) return "Medium";
    if (score >= 40) return "Weak";
    return "Very Weak";
  };

  return {
    score,
    grade: getGrade(score),
    issues,
    recommendations,
  };
};

// Security utilities object for easy importing
export const SecurityHelpers = Object.freeze({
  validateSecurityPattern,
  sanitizeInput,
  analyzeDependencyVulnerability,
  calculateSecurityScore,
  validateCSP,
  analyzeSecurityHeaders,
  generateSecureRandom,
  validatePasswordStrength,
});

export default SecurityHelpers;
