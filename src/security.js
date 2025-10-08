/**
 * 🛡️ LINTASTIC DEVSECOPS - SECURITY RULES
 *
 * Reglas de seguridad avanzadas para análisis estático (SAST)
 * Cumple con estándares OWASP Top 10 y mejores prácticas DevSecOps
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization Técnico Analista  y desarrollador de software especialista en Seguridad de la Información
 */

// 🔐 PATRONES DE SEGURIDAD AVANZADOS PARA AST ANALYSIS
export const securityPatterns = [
  // 🔴 CODE INJECTION PATTERNS
  {
    selector: "CallExpression[callee.name='eval']",
    message:
      "🔴 SECURITY: eval() está prohibido. RIESGO: Code injection attack. Usa alternativas seguras.",
    severity: "critical",
  },
  {
    selector: "NewExpression[callee.name='Function']",
    message:
      "🔴 SECURITY: Function() constructor prohibido. RIESGO: Code injection. Usa funciones declaradas.",
    severity: "critical",
  },
  {
    selector:
      "CallExpression[callee.name='setTimeout'][arguments.0.type='Literal']",
    message:
      "🔴 SECURITY: setTimeout con string es eval implícito. Usa función callback.",
    severity: "high",
  },
  {
    selector:
      "CallExpression[callee.name='setInterval'][arguments.0.type='Literal']",
    message:
      "🔴 SECURITY: setInterval con string es eval implícito. Usa función callback.",
    severity: "high",
  },

  // 🔴 XSS PREVENTION PATTERNS
  {
    selector: "CallExpression[callee.property.name='innerHTML']",
    message:
      "🔴 SECURITY: innerHTML puede ser vulnerable a XSS. Usa textContent o DOM methods seguros.",
    severity: "high",
  },
  {
    selector: "AssignmentExpression[left.property.name='innerHTML']",
    message:
      "🔴 SECURITY: Asignación a innerHTML vulnerable a XSS. Usa textContent o sanitización.",
    severity: "high",
  },

  // 🔴 PROTOTYPE POLLUTION PATTERNS
  {
    selector: "MemberExpression[property.name='__proto__']",
    message:
      "🔴 SECURITY: __proto__ puede causar prototype pollution. Usa Object.getPrototypeOf().",
    severity: "high",
  },
  {
    selector: "AssignmentExpression[left.property.name='__proto__']",
    message:
      "🔴 SECURITY: Asignación a __proto__ prohibida. RIESGO: Prototype pollution attack.",
    severity: "critical",
  },

  // 🔴 INSECURE RANDOM PATTERNS
  {
    selector:
      "CallExpression[callee.object.name='Math'][callee.property.name='random']",
    message:
      "⚠️ SECURITY: Math.random() no es criptográficamente seguro. Usa crypto.randomBytes() para seguridad.",
    severity: "medium",
  },

  // 🔴 HARDCODED CREDENTIALS PATTERNS
  {
    selector: "Property[key.name='password'][value.type='Literal']",
    message:
      "🔴 SECURITY: Password hardcodeado detectado. RIESGO: Credential exposure. Usa variables de entorno.",
    severity: "critical",
  },
  {
    selector: "Property[key.name='secret'][value.type='Literal']",
    message:
      "🔴 SECURITY: Secret hardcodeado detectado. RIESGO: Secret exposure. Usa variables de entorno.",
    severity: "critical",
  },
];

// 🛡️ REGLAS DE SEGURIDAD ESPECÍFICAS POR CATEGORÍA OWASP
export const owaspSecurityRules = {
  // A01:2021 – Broken Access Control
  "security/no-hardcoded-credentials": "error",
  "security/no-weak-random": "error",

  // A02:2021 – Cryptographic Failures
  "security/no-weak-crypto": "error",
  "security/no-hardcoded-secrets": "error",

  // A03:2021 – Injection
  "security/no-sql-injection": "error",
  "security/no-code-injection": "error",
  "security/no-command-injection": "error",

  // A04:2021 – Insecure Design
  "security/no-debug-in-production": "error",
  "security/no-console-in-production": "warn",

  // A05:2021 – Security Misconfiguration
  "security/no-default-passwords": "error",
  "security/no-insecure-protocols": "error",

  // A06:2021 – Vulnerable and Outdated Components
  "security/no-deprecated-deps": "error",
  "security/no-vulnerable-deps": "error",

  // A07:2021 – Identification and Authentication Failures
  "security/no-weak-auth": "error",
  "security/no-session-fixation": "error",

  // A08:2021 – Software and Data Integrity Failures
  "security/no-unsafe-deserialization": "error",
  "security/no-prototype-pollution": "error",

  // A09:2021 – Security Logging and Monitoring Failures
  "security/require-security-logging": "warn",
  "security/no-sensitive-data-in-logs": "error",

  // A10:2021 – Server-Side Request Forgery (SSRF)
  "security/no-ssrf": "error",
  "security/validate-urls": "error",
};

// 🔍 ANÁLISIS DE DEPENDENCIAS VULNERABLES - Carga dinámica desde JSON
import {
  vulnerableDependencies,
  getDependencyInfo,
  generateSecurityReport,
} from "./vulnerabilities-loader.js";

// Re-exportar para compatibilidad
export { vulnerableDependencies, getDependencyInfo, generateSecurityReport };

// 🔐 CONFIGURACIÓN DE HEADERS DE SEGURIDAD
export const securityHeaders = {
  required: [
    "Content-Security-Policy",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
  ],
  forbidden: [
    "X-Powered-By", // Information disclosure
    "Server", // Information disclosure
  ],
};

// 🛠️ CONFIGURACIÓN DEVSECOPS
export const devSecOpsConfig = {
  // Integración con herramientas SAST
  tools: {
    sonarqube: true,
    codeql: true,
    semgrep: true,
    bandit: false, // Python only
    checkmarx: false, // Enterprise only
  },

  // Niveles de severidad según CVSS
  severity: {
    critical: { score: "9.0-10.0", action: "block" },
    high: { score: "7.0-8.9", action: "warn" },
    medium: { score: "4.0-6.9", action: "info" },
    low: { score: "0.1-3.9", action: "ignore" },
  },

  // Compliance requirements
  compliance: {
    owasp: "top-10-2021",
    nist: "cybersecurity-framework",
    iso27001: true,
    sox: false,
    pci: false,
  },
};

export default {
  securityPatterns,
  owaspSecurityRules,
  vulnerableDependencies,
  securityHeaders,
  devSecOpsConfig,
};
