/**
 * 🛡️ PLUGIN SERVICE - DevSecOps ESLint Plugin Management Service
 *
 * Servicio especializado en la gestión y configuración de plugins ESLint
 * Implementa paradigma funcional con servicios puros y composición
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

/**
 * Core plugins registry with their configurations
 */
export const CORE_PLUGINS = Object.freeze({
  JSDOC: {
    name: "jsdoc",
    package: "eslint-plugin-jsdoc",
    version: "^61.0.0",
    purpose: "JSDoc validation and enforcement",
    security: false,
    required: true,
  },
  STYLISTIC_JS: {
    name: "@stylistic/js",
    package: "@stylistic/eslint-plugin-js",
    version: "^4.4.1",
    purpose: "JavaScript stylistic rules",
    security: false,
    required: true,
  },
  SECURITY: {
    name: "security",
    package: "eslint-plugin-security",
    version: "^1.7.1",
    purpose: "Security-focused linting rules",
    security: true,
    required: false,
  },
});

/**
 * Security-focused plugins for DevSecOps environments
 */
export const SECURITY_PLUGINS = Object.freeze({
  NO_SECRETS: {
    name: "no-secrets",
    package: "eslint-plugin-no-secrets",
    version: "^0.8.9",
    purpose: "Detect hardcoded secrets and credentials",
    security: true,
    owaspCategory: "A07:2021",
  },
  NO_UNSANITIZED: {
    name: "no-unsanitized",
    package: "eslint-plugin-no-unsanitized",
    version: "^4.0.2",
    purpose: "Prevent DOM XSS vulnerabilities",
    security: true,
    owaspCategory: "A03:2021",
  },
});

/**
 * Creates a plugin configuration object
 * @param {Object} pluginData - Plugin configuration data
 * @returns {Object} Immutable plugin configuration
 * @example
 * const plugin = createPluginConfig({
 *   name: 'security',
 *   package: 'eslint-plugin-security',
 *   enabled: true
 * });
 */
export const createPluginConfig = (pluginData) =>
  Object.freeze({
    name: pluginData.name,
    package: pluginData.package,
    version: pluginData.version,
    enabled: pluginData.enabled ?? true,
    purpose: pluginData.purpose,
    security: pluginData.security ?? false,
    owaspCategory: pluginData.owaspCategory,
    configuration: pluginData.configuration
      ? Object.freeze({ ...pluginData.configuration })
      : null,
    createdAt: new Date().toISOString(),
  });

/**
 * Loads and configures ESLint plugins from registry
 * @param {Array<string>} requestedPlugins - Array of plugin names to load
 * @param {Object} options - Loading options
 * @param {boolean} options.includeSecurityPlugins - Include security-focused plugins
 * @param {boolean} options.onlyRequired - Load only required plugins
 * @returns {Object} Configured plugins object
 * @example
 * const plugins = loadPlugins(['jsdoc', '@stylistic/js'], { includeSecurityPlugins: true });
 */
export const loadPlugins = (requestedPlugins = [], options = {}) => {
  const { includeSecurityPlugins = true, onlyRequired = false } = options;

  const availablePlugins = {
    ...CORE_PLUGINS,
    ...(includeSecurityPlugins ? SECURITY_PLUGINS : {}),
  };

  const pluginsToLoad = onlyRequired
    ? Object.values(availablePlugins).filter((plugin) => plugin.required)
    : Object.values(availablePlugins).filter(
        (plugin) =>
          requestedPlugins.length === 0 ||
          requestedPlugins.includes(plugin.name)
      );

  return pluginsToLoad.reduce((plugins, pluginConfig) => {
    try {
      const plugin = loadSinglePlugin(pluginConfig);
      return {
        ...plugins,
        [pluginConfig.name]: plugin,
      };
    } catch (error) {
      // Log error in development mode only
      if (process.env.NODE_ENV === "development") {
        process.stderr.write(
          `Failed to load plugin ${pluginConfig.name}: ${error.message}\n`
        );
      }
      return plugins;
    }
  }, {});
};

/**
 * Loads a single ESLint plugin dynamically
 * @param {Object} pluginConfig - Plugin configuration
 * @returns {Object} Loaded plugin object
 * @example
 * const jsdocPlugin = loadSinglePlugin(CORE_PLUGINS.JSDOC);
 */
export const loadSinglePlugin = (pluginConfig) => {
  // In a real implementation, this would use dynamic imports
  // For now, we return a mock plugin structure
  const mockPlugins = {
    jsdoc: createJSDocPlugin(),
    "@stylistic/js": createStylisticPlugin(),
    security: createSecurityPlugin(),
    "no-secrets": createNoSecretsPlugin(),
  };

  const plugin = mockPlugins[pluginConfig.name];
  if (!plugin) {
    throw new Error(`Plugin ${pluginConfig.name} not available`);
  }

  return plugin;
};

/**
 * Creates JSDoc plugin configuration
 * @returns {Object} JSDoc plugin object
 * @example
 * const jsdocPlugin = createJSDocPlugin();
 */
export const createJSDocPlugin = () => ({
  meta: {
    name: "eslint-plugin-jsdoc",
    version: "61.0.0",
  },
  configs: {
    recommended: {
      rules: {
        "jsdoc/check-alignment": "warn",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-types": "warn",
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-returns": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/require-example": [
          "error",
          {
            contexts: [
              "FunctionDeclaration",
              "MethodDefinition",
              "ClassDeclaration",
              "ArrowFunctionExpression",
              "FunctionExpression",
            ],
          },
        ],
      },
    },
  },
});

/**
 * Creates Stylistic JS plugin configuration
 * @returns {Object} Stylistic plugin object
 * @example
 * const stylisticPlugin = createStylisticPlugin();
 */
export const createStylisticPlugin = () => ({
  meta: {
    name: "@stylistic/eslint-plugin-js",
    version: "4.4.1",
  },
  rules: {
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
  },
});

/**
 * Creates Security plugin configuration
 * @returns {Object} Security plugin object
 * @example
 * const securityPlugin = createSecurityPlugin();
 */
export const createSecurityPlugin = () => ({
  meta: {
    name: "eslint-plugin-security",
    version: "1.7.1",
  },
  rules: {
    "detect-eval-with-expression": "error",
    "detect-non-literal-regexp": "warn",
    "detect-non-literal-require": "warn",
    "detect-object-injection": "warn",
    "detect-possible-timing-attacks": "warn",
    "detect-pseudoRandomBytes": "error",
    "detect-unsafe-regex": "error",
  },
});

/**
 * Creates No Secrets plugin configuration
 * @returns {Object} No Secrets plugin object
 * @example
 * const noSecretsPlugin = createNoSecretsPlugin();
 */
export const createNoSecretsPlugin = () => ({
  meta: {
    name: "eslint-plugin-no-secrets",
    version: "0.8.9",
  },
  rules: {
    "no-secrets": [
      "error",
      {
        tolerance: 4.2,
        ignoreContent: ["^EXAMPLE_", "^TEST_"],
        ignoreModules: true,
        ignoreIdentifiers: ["BASE64_CHARS", "HEX_CHARS"],
      },
    ],
  },
});

/**
 * Validates plugin configuration
 * @param {Object} pluginConfig - Plugin configuration to validate
 * @returns {Object} Validation result
 * @example
 * const result = validatePluginConfig(pluginConfig);
 * if (!result.isValid) console.log(result.errors);
 */
export const validatePluginConfig = (pluginConfig) => {
  const errors = [];

  // Check required fields
  const requiredFields = ["name", "package"];
  requiredFields.forEach((field) => {
    if (!pluginConfig[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate plugin name format
  if (pluginConfig.name && !pluginConfig.name.match(/^[a-zA-Z0-9@/_-]+$/)) {
    errors.push(`Invalid plugin name format: ${pluginConfig.name}`);
  }

  // Validate package name format
  if (
    pluginConfig.package &&
    !pluginConfig.package.match(/^[a-zA-Z0-9@/_-]+$/)
  ) {
    errors.push(`Invalid package name format: ${pluginConfig.package}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets security-focused plugins only
 * @param {Object} plugins - All loaded plugins
 * @returns {Object} Security plugins only
 * @example
 * const securityPlugins = getSecurityPlugins(allPlugins);
 */
export const getSecurityPlugins = (plugins) => {
  return Object.entries(plugins)
    .filter(([_name, plugin]) => plugin.meta?.security === true)
    .reduce(
      (securityPlugins, [name, plugin]) => ({
        ...securityPlugins,
        [name]: plugin,
      }),
      {}
    );
};

/**
 * Gets plugin recommendations based on project type
 * @param {string} projectType - Project type ('node', 'web', 'api', 'library')
 * @param {Object} options - Recommendation options
 * @returns {Array<Object>} Recommended plugins
 * @example
 * const recommendations = getPluginRecommendations('node', { security: true });
 */
export const getPluginRecommendations = (projectType, options = {}) => {
  const { security = true, documentation = true } = options;

  const baseRecommendations = [];

  // Always recommend JSDoc for documentation
  if (documentation) {
    baseRecommendations.push({
      plugin: CORE_PLUGINS.JSDOC,
      reason: "Ensures comprehensive API documentation",
      priority: "high",
    });
  }

  // Always recommend stylistic rules
  baseRecommendations.push({
    plugin: CORE_PLUGINS.STYLISTIC_JS,
    reason: "Maintains consistent code style",
    priority: "medium",
  });

  // Security recommendations for all project types
  if (security) {
    baseRecommendations.push({
      plugin: SECURITY_PLUGINS.NO_SECRETS,
      reason: "Prevents accidental credential exposure",
      priority: "critical",
    });
  }

  // Project-specific recommendations
  if (projectType === "web" && security) {
    baseRecommendations.push({
      plugin: SECURITY_PLUGINS.NO_UNSANITIZED,
      reason: "Prevents DOM-based XSS vulnerabilities",
      priority: "critical",
    });
  }

  return baseRecommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
  });
};

/**
 * Merges plugin configurations
 * @param {...Object} pluginObjects - Plugin objects to merge
 * @returns {Object} Merged plugins configuration
 * @example
 * const merged = mergePluginConfigs(corePlugins, securityPlugins);
 */
export const mergePluginConfigs = (...pluginObjects) => {
  return pluginObjects.reduce(
    (merged, plugins) => ({
      ...merged,
      ...plugins,
    }),
    {}
  );
};

// Pure function exports for functional composition
export const PluginService = Object.freeze({
  createConfig: createPluginConfig,
  loadPlugins,
  loadSinglePlugin,
  validateConfig: validatePluginConfig,
  getSecurityPlugins,
  getRecommendations: getPluginRecommendations,
  mergeConfigs: mergePluginConfigs,
  CORE_PLUGINS,
  SECURITY_PLUGINS,
});

export default PluginService;
