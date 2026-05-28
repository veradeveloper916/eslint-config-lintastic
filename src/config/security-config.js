/**
 * 🛡️ SECURITY CONFIG - DevSecOps Security Rules Configuration
 *
 * Configuración especializada de reglas de seguridad para DevSecOps
 * Incluye patrones de vulnerabilidades, reglas OWASP y configuraciones de análisis estático
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

// Critical security rules that should always be enforced
export const CRITICAL_SECURITY_RULES = Object.freeze({
  "no-eval": {
    level: "error",
    category: "code-injection",
    owasp: "A03_INJECTION",
    description:
      "Prevents eval() usage which can lead to code injection vulnerabilities",
    examples: {
      bad: ["eval(userInput)", 'eval("(" + json + ")")'],
      good: ["JSON.parse(json)", "Function.prototype.call.bind(fn)()"],
    },
  },
  "no-implied-eval": {
    level: "error",
    category: "code-injection",
    owasp: "A03_INJECTION",
    description:
      "Prevents implied eval through setTimeout/setInterval string arguments",
    examples: {
      bad: [
        'setTimeout("alert(1)", 100)',
        'setInterval("doSomething()", 1000)',
      ],
      good: [
        "setTimeout(() => alert(1), 100)",
        "setInterval(doSomething, 1000)",
      ],
    },
  },
  "no-new-func": {
    level: "error",
    category: "code-injection",
    owasp: "A03_INJECTION",
    description:
      "Prevents Function constructor usage which can execute arbitrary code",
    examples: {
      bad: [
        'new Function("return " + userInput)',
        'Function("a", "b", "return a + b")',
      ],
      good: ["(a, b) => a + b", "function add(a, b) { return a + b; }"],
    },
  },
  "security/detect-object-injection": {
    level: "error",
    category: "object-injection",
    owasp: "A01_BROKEN_ACCESS_CONTROL",
    description: "Detects object injection vulnerabilities",
    examples: {
      bad: ["obj[userInput]", 'eval("obj." + userInput)'],
      good: [
        "obj.hasOwnProperty(userInput) && obj[userInput]",
        "Map or Set for dynamic keys",
      ],
    },
  },
  "security/detect-eval-with-expression": {
    level: "error",
    category: "code-injection",
    owasp: "A03_INJECTION",
    description: "Detects eval with dynamic expressions",
    examples: {
      bad: ["eval(expr + userInput)", "eval(`${base}${userInput}`)"],
      good: ["JSON.parse(validJsonString)", "predefined function mapping"],
    },
  },
});

// High severity security rules
export const HIGH_SECURITY_RULES = Object.freeze({
  "security/detect-non-literal-regexp": {
    level: "error",
    category: "regex-injection",
    owasp: "A03_INJECTION",
    description: "Prevents ReDoS attacks through dynamic regex patterns",
    examples: {
      bad: ["new RegExp(userInput)", "RegExp(pattern + userInput)"],
      good: [
        "predefined regex patterns",
        "regex validation before construction",
      ],
    },
  },
  "security/detect-unsafe-regex": {
    level: "error",
    category: "regex-dos",
    owasp: "A03_INJECTION",
    description:
      "Detects potentially catastrophic exponential-time regular expressions",
    examples: {
      bad: ["/^(a+)+$/", "/(a|a)*/", "/a*a*a*a*a*a*a*a*a*c/"],
      good: ["/^a+$/", "/^(a|b)+$/", "atomic grouping patterns"],
    },
  },
  "security/detect-pseudoRandomBytes": {
    level: "error",
    category: "weak-randomness",
    owasp: "A02_CRYPTOGRAPHIC_FAILURES",
    description:
      "Detects usage of cryptographically weak pseudo-random number generation",
    examples: {
      bad: ["crypto.pseudoRandomBytes()", "Math.random() for security"],
      good: ["crypto.randomBytes()", "crypto.getRandomValues()"],
    },
  },
  "security/detect-possible-timing-attacks": {
    level: "error",
    category: "timing-attack",
    owasp: "A02_CRYPTOGRAPHIC_FAILURES",
    description:
      "Detects potential timing attack vulnerabilities in comparisons",
    examples: {
      bad: ["if (userToken === correctToken)", "password === storedPassword"],
      good: ["crypto.timingSafeEqual()", "constant-time comparison libraries"],
    },
  },
  "security/detect-buffer-noassert": {
    level: "error",
    category: "buffer-overflow",
    owasp: "A06_VULNERABLE_COMPONENTS",
    description:
      "Detects Buffer usage without assertion which can lead to memory corruption",
    examples: {
      bad: [
        "Buffer.allocUnsafe()",
        "buf.write(string, offset, length, encoding)",
      ],
      good: ["Buffer.alloc()", "Buffer.from() with validation"],
    },
  },
});

// Medium severity security rules
export const MEDIUM_SECURITY_RULES = Object.freeze({
  "security/detect-child-process": {
    level: "warn",
    category: "command-injection",
    owasp: "A05_SECURITY_MISCONFIGURATION",
    description:
      "Detects child process usage that could lead to command injection",
    examples: {
      bad: ["child_process.exec(userInput)", "spawn(command, [userArg])"],
      good: ["spawn with array arguments", "input sanitization and validation"],
    },
  },
  "security/detect-non-literal-fs-filename": {
    level: "warn",
    category: "path-traversal",
    owasp: "A05_SECURITY_MISCONFIGURATION",
    description: "Detects file system operations with non-literal filenames",
    examples: {
      bad: ["fs.readFile(userPath)", 'fs.writeFile(userInput + ".txt")'],
      good: ["path.join with validation", "whitelist of allowed paths"],
    },
  },
  "security/detect-disable-mustache-escape": {
    level: "warn",
    category: "xss-prevention",
    owasp: "A04_INSECURE_DESIGN",
    description: "Detects disabled mustache escaping which can lead to XSS",
    examples: {
      bad: ["{{{unescapedContent}}}", "Handlebars.SafeString(userContent)"],
      good: ["{{escapedContent}}", "proper output encoding"],
    },
  },
  "security/detect-no-csrf-before-method-override": {
    level: "warn",
    category: "csrf-protection",
    owasp: "A04_INSECURE_DESIGN",
    description:
      "Detects missing CSRF protection before method override middleware",
    examples: {
      bad: ["app.use(methodOverride) before CSRF"],
      good: [
        "CSRF middleware before methodOverride",
        "proper middleware ordering",
      ],
    },
  },
  "no-script-url": {
    level: "warn",
    category: "xss-prevention",
    owasp: "A03_INJECTION",
    description: "Prevents javascript: URLs which can lead to XSS",
    examples: {
      bad: ['href="javascript:void(0)"', 'location = "javascript:alert(1)"'],
      good: ['href="#"', "addEventListener for events", "data attributes"],
    },
  },
});

// Security rule categories for organization
export const SECURITY_CATEGORIES = Object.freeze({
  CODE_INJECTION: {
    name: "Code Injection",
    description: "Rules preventing code injection vulnerabilities",
    severity: "critical",
    rules: [
      "no-eval",
      "no-implied-eval",
      "no-new-func",
      "security/detect-eval-with-expression",
    ],
  },
  XSS_PREVENTION: {
    name: "Cross-Site Scripting Prevention",
    description: "Rules preventing XSS vulnerabilities",
    severity: "high",
    rules: ["no-script-url", "security/detect-disable-mustache-escape"],
  },
  OBJECT_INJECTION: {
    name: "Object Injection",
    description: "Rules preventing object injection attacks",
    severity: "critical",
    rules: ["security/detect-object-injection"],
  },
  REGEX_VULNERABILITIES: {
    name: "Regex Vulnerabilities",
    description: "Rules preventing regex-based attacks",
    severity: "high",
    rules: [
      "security/detect-unsafe-regex",
      "security/detect-non-literal-regexp",
    ],
  },
  CRYPTOGRAPHIC_FAILURES: {
    name: "Cryptographic Failures",
    description: "Rules preventing cryptographic vulnerabilities",
    severity: "high",
    rules: [
      "security/detect-pseudoRandomBytes",
      "security/detect-possible-timing-attacks",
    ],
  },
  COMMAND_INJECTION: {
    name: "Command Injection",
    description: "Rules preventing command injection vulnerabilities",
    severity: "medium",
    rules: ["security/detect-child-process"],
  },
  PATH_TRAVERSAL: {
    name: "Path Traversal",
    description: "Rules preventing path traversal attacks",
    severity: "medium",
    rules: ["security/detect-non-literal-fs-filename"],
  },
  BUFFER_VULNERABILITIES: {
    name: "Buffer Vulnerabilities",
    description: "Rules preventing buffer-related security issues",
    severity: "high",
    rules: ["security/detect-buffer-noassert"],
  },
});

// Security rule configuration by environment
export const ENVIRONMENT_SECURITY_CONFIGS = Object.freeze({
  PRODUCTION: {
    name: "Production Environment",
    description: "Strictest security rules for production code",
    rules: {
      ...CRITICAL_SECURITY_RULES,
      ...HIGH_SECURITY_RULES,
      ...MEDIUM_SECURITY_RULES,
    },
    overrides: {
      "no-console": "error",
      "no-debugger": "error",
      "no-alert": "error",
    },
  },
  DEVELOPMENT: {
    name: "Development Environment",
    description: "Balanced security rules for development",
    rules: {
      ...CRITICAL_SECURITY_RULES,
      ...HIGH_SECURITY_RULES,
    },
    overrides: {
      "no-console": "warn",
      "no-debugger": "warn",
    },
  },
  TESTING: {
    name: "Testing Environment",
    description: "Relaxed security rules for test code",
    rules: {
      ...CRITICAL_SECURITY_RULES,
    },
    overrides: {
      "no-console": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-child-process": "off",
    },
  },
});

// Rule customization options
export const RULE_CUSTOMIZATION = Object.freeze({
  SEVERITY_MAPPINGS: {
    BLOCK: "error", // Blocks build/commit
    WARN: "warn", // Shows warning but allows
    INFO: "off", // Informational only
  },
  CUSTOM_MESSAGES: {
    "no-eval":
      "DevSecOps: eval() usage detected - this can lead to code injection vulnerabilities",
    "security/detect-object-injection":
      "DevSecOps: Potential object injection detected - validate user input",
    "security/detect-unsafe-regex":
      "DevSecOps: Unsafe regex pattern detected - may cause ReDoS attacks",
  },
  RULE_EXCEPTIONS: {
    // Specific files/patterns that can be exempt from certain rules
    TEST_FILES: {
      patterns: ["**/*.test.js", "**/*.spec.js", "**/test/**", "**/tests/**"],
      exemptions: [
        "security/detect-non-literal-fs-filename",
        "security/detect-child-process",
      ],
    },
    BUILD_FILES: {
      patterns: ["webpack.config.js", "rollup.config.js", "**/scripts/**"],
      exemptions: [
        "security/detect-non-literal-require",
        "import/no-dynamic-require",
      ],
    },
  },
});

// Security metrics and reporting
export const SECURITY_METRICS = Object.freeze({
  VULNERABILITY_WEIGHTS: {
    CRITICAL: 10,
    HIGH: 7,
    MEDIUM: 4,
    LOW: 1,
  },
  COMPLIANCE_THRESHOLDS: {
    EXCELLENT: 95,
    GOOD: 85,
    ACCEPTABLE: 70,
    POOR: 50,
  },
  OWASP_COVERAGE: {
    A01_BROKEN_ACCESS_CONTROL: ["security/detect-object-injection"],
    A02_CRYPTOGRAPHIC_FAILURES: [
      "security/detect-pseudoRandomBytes",
      "security/detect-possible-timing-attacks",
    ],
    A03_INJECTION: [
      "no-eval",
      "no-implied-eval",
      "security/detect-eval-with-expression",
    ],
    A04_INSECURE_DESIGN: ["security/detect-disable-mustache-escape"],
    A05_SECURITY_MISCONFIGURATION: [
      "security/detect-child-process",
      "security/detect-non-literal-fs-filename",
    ],
    A06_VULNERABLE_COMPONENTS: ["security/detect-buffer-noassert"],
    A07_IDENTIFICATION_FAILURES: ["security/detect-possible-timing-attacks"],
    A08_SOFTWARE_INTEGRITY_FAILURES: ["security/detect-non-literal-require"],
    A09_LOGGING_FAILURES: ["no-console"],
    A10_SERVER_SIDE_REQUEST_FORGERY: ["security/detect-child-process"],
  },
});

// Export main security configuration
export const SecurityConfig = Object.freeze({
  CRITICAL_SECURITY_RULES,
  HIGH_SECURITY_RULES,
  MEDIUM_SECURITY_RULES,
  SECURITY_CATEGORIES,
  ENVIRONMENT_SECURITY_CONFIGS,
  RULE_CUSTOMIZATION,
  SECURITY_METRICS,
});

export default SecurityConfig;
