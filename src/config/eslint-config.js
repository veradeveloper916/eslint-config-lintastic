/**
 * 🛡️ ESLINT CONFIG - DevSecOps Security Configuration
 *
 * Configuración principal de ESLint con enfoque en DevSecOps
 * Integra reglas de seguridad, patrones de vulnerabilidades y configuraciones especializadas
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

// Core security plugins configuration
export const SECURITY_PLUGINS = Object.freeze({
  security: {
    name: "@eslint-community/eslint-plugin-security",
    rules: {
      "security/detect-unsafe-regex": "error",
      "security/detect-buffer-noassert": "error",
      "security/detect-child-process": "error",
      "security/detect-disable-mustache-escape": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-no-csrf-before-method-override": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-non-literal-require": "error",
      "security/detect-object-injection": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-pseudoRandomBytes": "error",
      "security/detect-bidi-characters": "error",
    },
  },
  node: {
    name: "eslint-plugin-node",
    rules: {
      "node/no-deprecated-api": "error",
      "node/no-extraneous-import": "error",
      "node/no-extraneous-require": "error",
      "node/no-missing-import": "error",
      "node/no-missing-require": "error",
      "node/no-unpublished-bin": "error",
      "node/no-unpublished-import": "error",
      "node/no-unpublished-require": "error",
      "node/no-unsupported-features/es-builtins": "error",
      "node/no-unsupported-features/es-syntax": "error",
      "node/no-unsupported-features/node-builtins": "error",
      "node/process-exit-as-throw": "error",
      "node/shebang": "error",
    },
  },
  import: {
    name: "eslint-plugin-import",
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-restricted-paths": "error",
      "import/no-absolute-path": "error",
      "import/no-dynamic-require": "error",
      "import/no-internal-modules": "off",
      "import/no-webpack-loader-syntax": "error",
      "import/no-self-import": "error",
      "import/no-cycle": "error",
      "import/no-useless-path-segments": "error",
    },
  },
});

// ESLint core rules with security focus
export const CORE_SECURITY_RULES = Object.freeze({
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-script-url": "error",
  "no-proto": "error",
  "no-iterator": "error",
  "no-restricted-syntax": [
    "error",
    {
      selector: 'CallExpression[callee.name="eval"]',
      message: "eval() is dangerous and should not be used",
    },
    {
      selector: 'NewExpression[callee.name="Function"]',
      message: "Function constructor is dangerous and should not be used",
    },
    {
      selector: 'AssignmentExpression[left.property.name="innerHTML"]',
      message:
        "innerHTML can lead to XSS vulnerabilities, use textContent or safer methods",
    },
    {
      selector:
        'CallExpression[callee.object.name="document"][callee.property.name="write"]',
      message: "document.write() can lead to XSS vulnerabilities",
    },
  ],
  "no-global-assign": "error",
  "no-implicit-globals": "error",
  "no-extend-native": "error",
  "no-alert": "error",
  "no-console": "warn",
  "no-debugger": "error",
  strict: ["error", "never"],
  "prefer-const": "error",
  "no-var": "error",
  "no-unused-vars": [
    "error",
    {
      vars: "all",
      args: "after-used",
      ignoreRestSiblings: true,
      argsIgnorePattern: "^_",
    },
  ],
  "no-undef": "error",
  "no-redeclare": "error",
  "no-shadow": "error",
  "no-shadow-restricted-names": "error",
  "no-use-before-define": [
    "error",
    { functions: false, classes: true, variables: true },
  ],
});

// Environment configurations
export const ENVIRONMENTS = Object.freeze({
  node: {
    node: true,
    es6: true,
    es2017: true,
    es2020: true,
    es2021: true,
    es2022: true,
  },
  browser: {
    browser: true,
    es6: true,
    es2017: true,
    es2020: true,
    es2021: true,
    es2022: true,
  },
  test: {
    node: true,
    es6: true,
    jest: true,
    mocha: true,
  },
});

// Parser configurations
export const PARSER_CONFIG = Object.freeze({
  ecmaVersion: 2022,
  sourceType: "module",
  ecmaFeatures: {
    globalReturn: false,
    impliedStrict: true,
    jsx: false,
  },
});

// File ignore patterns for security scanning
export const IGNORE_PATTERNS = Object.freeze([
  "node_modules/**",
  "dist/**",
  "build/**",
  "coverage/**",
  "*.min.js",
  "*.bundle.js",
  ".git/**",
  ".vscode/**",
  ".idea/**",
  "tmp/**",
  "temp/**",
  "logs/**",
  "*.log",
  ".env*",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

// Severity levels for different rule categories
export const SEVERITY_LEVELS = Object.freeze({
  CRITICAL: "error", // Security vulnerabilities, code injection
  HIGH: "error", // Data exposure, authentication issues
  MEDIUM: "warn", // Code quality, maintainability
  LOW: "warn", // Style preferences, optimizations
  INFO: "off", // Informational only
});

// OWASP Top 10 rule mappings
export const OWASP_MAPPINGS = Object.freeze({
  A01_BROKEN_ACCESS_CONTROL: [
    "security/detect-object-injection",
    "no-global-assign",
    "no-implicit-globals",
  ],
  A02_CRYPTOGRAPHIC_FAILURES: [
    "security/detect-pseudoRandomBytes",
    "security/detect-possible-timing-attacks",
  ],
  A03_INJECTION: [
    "security/detect-eval-with-expression",
    "security/detect-non-literal-regexp",
    "security/detect-unsafe-regex",
    "no-eval",
    "no-implied-eval",
    "no-new-func",
  ],
  A04_INSECURE_DESIGN: [
    "security/detect-disable-mustache-escape",
    "security/detect-no-csrf-before-method-override",
  ],
  A05_SECURITY_MISCONFIGURATION: [
    "security/detect-child-process",
    "security/detect-non-literal-fs-filename",
  ],
  A06_VULNERABLE_COMPONENTS: [
    "security/detect-buffer-noassert",
    "node/no-deprecated-api",
  ],
  A07_IDENTIFICATION_FAILURES: ["security/detect-possible-timing-attacks"],
  A08_SOFTWARE_INTEGRITY_FAILURES: [
    "security/detect-non-literal-require",
    "import/no-dynamic-require",
  ],
  A09_LOGGING_FAILURES: ["no-console"],
  A10_SERVER_SIDE_REQUEST_FORGERY: [
    "security/detect-non-literal-fs-filename",
    "security/detect-child-process",
  ],
});

// Configuration presets
export const CONFIG_PRESETS = Object.freeze({
  STRICT: {
    extends: ["eslint:recommended"],
    rules: {
      ...CORE_SECURITY_RULES,
      "no-console": "error",
      "no-alert": "error",
      "no-debugger": "error",
    },
    plugins: Object.keys(SECURITY_PLUGINS),
  },
  MODERATE: {
    extends: ["eslint:recommended"],
    rules: {
      ...CORE_SECURITY_RULES,
      "no-console": "warn",
      "no-alert": "warn",
    },
    plugins: ["security", "node"],
  },
  BASIC: {
    extends: ["eslint:recommended"],
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
    plugins: ["security"],
  },
});

/**
 * Deep freeze utility for complete immutability
 * @param {Object} obj - Object to deep freeze
 * @returns {Object} Deep frozen object
 */
const deepFreeze = (obj) => {
  // Retrieve property names defined on obj
  Object.getOwnPropertyNames(obj).forEach(function (name) {
    const value = obj[name];

    // Freeze properties before freezing self
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  });

  return Object.freeze(obj);
};

// Default configuration with complete immutability
const defaultConfigBase = {
  env: ENVIRONMENTS.node,
  parserOptions: PARSER_CONFIG,
  plugins: Object.keys(SECURITY_PLUGINS),
  rules: {
    ...CORE_SECURITY_RULES,
    ...Object.values(SECURITY_PLUGINS).reduce(
      (acc, plugin) => ({
        ...acc,
        ...plugin.rules,
      }),
      {}
    ),
  },
  ignorePatterns: IGNORE_PATTERNS,
  overrides: [
    {
      files: ["**/*.test.js", "**/*.spec.js", "**/tests/**/*.js"],
      env: ENVIRONMENTS.test,
      rules: {
        "no-console": "off",
        "security/detect-non-literal-fs-filename": "off",
      },
    },
  ],
};

export const DEFAULT_CONFIG = deepFreeze(defaultConfigBase);

// Export configuration object
export const ESLintConfig = Object.freeze({
  SECURITY_PLUGINS,
  CORE_SECURITY_RULES,
  ENVIRONMENTS,
  PARSER_CONFIG,
  IGNORE_PATTERNS,
  SEVERITY_LEVELS,
  OWASP_MAPPINGS,
  CONFIG_PRESETS,
  DEFAULT_CONFIG,
});

export default ESLintConfig;
