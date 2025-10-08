import js from "@eslint/js";

export const rulesJS = {
  ...js.configs.all.rules,
  // Reglas generales
  eqeqeq: "error",
  strict: ["error", "global"],
  curly: "off",
  complexity: ["error", { max: 6, variant: "modified" }],
  "id-length": "off",
  "init-declarations": "off",
  "no-console": "off",
  "no-var": "error",
  "prefer-const": "error",
  "arrow-body-style": "off",
  "no-magic-numbers": "off",
  "no-negated-condition": "off",
  "no-inline-comments": "off",
  "no-ternary": "off",
  "no-undefined": "error",
  "no-plusplus": "off",
  "max-lines-per-function": [
    "error",
    { max: 50, skipBlankLines: true, skipComments: true, IIFEs: true },
  ],
  "one-var": "off",
  "require-unicode-regexp": "off",
  "sort-keys": "off",

  // Variables y argumentos
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
  "no-useless-catch": "error",

  // stylistic
  "@stylistic/js/indent": ["error", 2],

  // JSDoc
  "jsdoc/check-alignment": "warn",
  "jsdoc/check-param-names": "error",
  "jsdoc/check-tag-names": "error",
  "jsdoc/check-types": "warn",
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
  "jsdoc/no-defaults": "off",
  "jsdoc/require-param": "error",
  "jsdoc/require-param-description": "error",
  "jsdoc/require-param-type": "error",
  "jsdoc/require-returns": "error",
  "jsdoc/require-returns-description": "error",
  "jsdoc/require-returns-type": "error",
  "no-restricted-syntax": [
    "error",
    {
      selector:
        "CallExpression[callee.name='axios'][arguments.0.type='Literal'][arguments.0.value^='http']",
      message:
        "No se permite usar axios con una URL directamente. Usa una instancia creada con axios.create().",
    },
  ],
  // 🛡️ REGLAS DE SEGURIDAD AVANZADAS - DevSecOps
  "no-eval": "error", // Prevenir inyección de código
  "no-implied-eval": "error", // Prevenir eval() implícito
  "no-new-func": "error", // Prevenir Function() constructor
  "no-script-url": "error", // Prevenir javascript: URLs
  "no-proto": "error", // Prevenir uso de __proto__
  "no-iterator": "error", // Prevenir uso de __iterator__
  "no-with": "error", // Prevenir statement 'with' inseguro

  // 🔐 DETECCIÓN DE SECRETS Y CREDENCIALES
  "no-secrets/no-secrets": "error", // Plugin para detectar secrets

  // 🚫 IMPORTS BLOQUEADOS POR SEGURIDAD (DevSecOps Policy)
  "no-restricted-imports": [
    "error",
    {
      paths: [
        // 🔴 VULNERABILIDADES CRÍTICAS DE SEGURIDAD
        {
          name: "@types/axios",
          message:
            '🔴 SECURITY: No se permite importar "@types/axios". Usa la definición de tipos incluida en axios.',
        },
        {
          name: "date-fns",
          message:
            '⚠️ SECURITY: El uso de "date-fns" no está recomendado. Consulta https://youmightnotneed.com/date-fns para alternativas más ligeras o nativas.',
        },
        {
          name: "dotenv",
          message:
            '🔴 SECURITY: Evita usar "dotenv". RIESGO: Exposición accidental de secrets. Usa variables de entorno nativas de Node.js mediante "process.env".',
        },
        {
          name: "lodash",
          message:
            '🔴 SECURITY: El uso de "lodash" está bloqueado. RIESGO: Prototype pollution vulnerabilities. Consulta https://youmightnotneed.com/lodash.',
        },
        {
          name: "moment",
          message:
            '🔴 SECURITY: "moment.js" está deprecado y contiene CVEs. RIESGO: Multiple security vulnerabilities. Usa Date nativo o date-fns-tz.',
        },
        {
          name: "morgan",
          message:
            '⚠️ SECURITY: Evita usar "morgan". RIESGO: Information disclosure. Usa herramientas más modernas como Winston o Pino con configuración segura.',
        },
        {
          name: "numeral",
          message:
            '🔴 SECURITY: "numeral.js" abandonado desde 2017. RIESGO: Unpatched vulnerabilities. Usa API Intl nativa o numbro.',
        },
        {
          name: "sort-by",
          message:
            '⚠️ SECURITY: "sort-by" no está recomendado. Implementa funciones nativas de ordenación más seguras.',
        },
        {
          name: "http-errors",
          message:
            '🔴 SECURITY: "http-errors" presenta riesgos. RIESGO: Information disclosure. Implementa clases de error personalizadas.',
        },
        // 🔴 NUEVAS REGLAS DE SEGURIDAD DevSecOps - CRÍTICAS SOLAMENTE
        {
          name: "xml2js",
          message:
            '🔴 SECURITY: "xml2js" vulnerable a XXE attacks. RIESGO: XML External Entity injection. Usa fast-xml-parser con configuración segura.',
        },
        {
          name: "handlebars",
          message:
            "🔴 SECURITY: Handlebars sin configuración segura. RIESGO: Template injection. Configura con noEscape: false y helpers restringidos.",
        },
      ],
      patterns: [
        // 🔴 FRAMEWORKS DE TESTING INSEGUROS
        {
          group: ["*jest*"],
          message:
            '⚠️ SECURITY: Evita usar "jest" y derivados. RIESGO: Bloated dependencies con potenciales CVEs. Usa Node.js native test runner.',
        },
        // 🔴 LIBRERÍAS FRONTEND INSEGURAS
        {
          group: ["datatables*", "react-data-table-component"],
          message:
            '🔴 SECURITY: "Datatables" contiene jQuery. RIESGO: XSS vulnerabilities. Usa alternativas modernas sin jQuery.',
        },
        {
          group: ["jquery*", ".*jquery.*", "$", "jQuery"],
          message:
            "🔴 SECURITY: jQuery bloqueado. RIESGO: Multiple XSS vectors, DOM manipulation vulnerabilities. Usa JavaScript nativo o frameworks modernos.",
        },
        // 🔴 PATRONES DE IMPORTACIÓN INSEGUROS
        {
          group: ["../*"],
          message:
            '⚠️ SECURITY: Rutas relativas "../" pueden exponer estructura. Usa alias definidos para mejorar seguridad y consistencia.',
        },
        // 🔴 NUEVOS PATRONES DE SEGURIDAD DevSecOps
        {
          group: ["*debug*", "*console*"],
          message:
            "🔴 SECURITY: Librerías de debug pueden exponer información sensible en producción. Configura adecuadamente NODE_ENV.",
        },
        {
          group: ["*crypto-js*"],
          message:
            "🔴 SECURITY: crypto-js tiene vulnerabilidades conocidas. RIESGO: Weak cryptographic implementations. Usa Node.js crypto nativo.",
        },
        {
          group: ["*md5*", "*sha1*"],
          message:
            "🔴 SECURITY: MD5/SHA1 son criptográficamente inseguros. RIESGO: Hash collisions. Usa SHA-256 o superior.",
        },
        {
          group: ["*eval*", "*vm2*", "*vm*"],
          message:
            "🔴 SECURITY: Ejecución de código dinámico. RIESGO: Code injection attacks. Evita eval, Function(), y VMs inseguros.",
        },
        {
          group: ["*sql*"],
          message:
            "⚠️ SECURITY: Librerías SQL requieren validación. RIESGO: SQL injection. Usa prepared statements y ORMs con protección.",
        },
      ],
    },
  ],

  // 🛡️ REGLAS ADICIONALES DE SEGURIDAD DevSecOps

  // 🔐 PROTECCIÓN CONTRA INYECCIONES
  "no-useless-escape": "error", // Prevenir escapes innecesarios que pueden enmascarar inyecciones
  "no-control-regex": "error", // Prevenir caracteres de control en regex
  "no-regex-spaces": "error", // Detectar espacios múltiples en regex (posible typo/bypass)
  "no-empty-character-class": "error", // Prevenir clases de caracteres vacías en regex
  "no-invalid-regexp": "error", // Detectar expresiones regulares inválidas

  // 🚫 PREVENCIÓN DE PROTOTYPE POLLUTION
  "no-extend-native": "error", // Prevenir extensión de prototipos nativos
  "no-global-assign": "error", // Prevenir asignación a variables globales
  "no-implicit-globals": "error", // Prevenir variables globales implícitas

  // 🔒 SEGURIDAD EN MANEJO DE DATOS
  "no-unsafe-finally": "error", // Prevenir control flow inseguro en finally
  "no-unsafe-negation": "error", // Prevenir negaciones inseguras
  "use-isnan": "error", // Forzar uso de isNaN() para comparaciones seguras
  "valid-typeof": "error", // Validar operadores typeof

  // 🛠️ DETECCIÓN DE PATRONES INSEGUROS
  "no-unreachable": "error", // Código inalcanzable puede ocultar vulnerabilidades
  "no-dupe-keys": "error", // Claves duplicadas pueden causar comportamiento inesperado
  "no-dupe-args": "error", // Argumentos duplicados en funciones
  "no-duplicate-case": "error", // Cases duplicados en switch

  // 🔍 ANÁLISIS ESTÁTICO DE SEGURIDAD (Custom Rules)
  "no-restricted-globals": [
    "error",
    {
      name: "event",
      message:
        "🔴 SECURITY: Variable global 'event' puede ser manipulada. Usa parámetros explícitos.",
    },
    {
      name: "name",
      message:
        "🔴 SECURITY: Variable global 'name' puede causar conflictos. Usa nombres más específicos.",
    },
  ],
};

// 📝 REGLAS DE RECOMENDACIÓN DE SEGURIDAD (Solo warnings, no bloquean)
export const securityRecommendations = {
  // Estas reglas proporcionan guidance sin bloquear el desarrollo
  "no-console": ["warn"], // Permite console en desarrollo, pero advierte para producción
  "prefer-const": ["warn"], // Sugiere const pero no bloquea
};

// 💡 LIBRERÍAS CON RECOMENDACIONES (No bloqueadas)
export const recommendedLibraries = {
  express: {
    message:
      "💡 RECOMENDACIÓN: Express requiere configuración de seguridad adicional. Usa helmet, cors, rate-limiting.",
    severity: "info",
    blocked: false,
  },
  "body-parser": {
    message:
      "💡 RECOMENDACIÓN: body-parser incluido en Express 4.16+. Usa express.json() y express.urlencoded().",
    severity: "info",
    blocked: false,
  },
  request: {
    message:
      "💡 RECOMENDACIÓN: 'request' deprecated. Considera axios, node-fetch, o fetch nativo Node.js 18+.",
    severity: "warning",
    blocked: false,
  },
};

export default rulesJS;
