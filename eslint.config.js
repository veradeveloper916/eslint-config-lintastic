import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  // 📁 Archivos a ignorar SIEMPRE PRIMERO
  {
    name: "lintastic:ignores",
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".git/**",
      "test/samples/**",
      "coverage/**",
      "*.min.js",
    ],
  },
  // 🛡️ Configuración base DevSecOps
  {
    name: "lintastic:base",
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2024,
        lint: "readonly",
      },
    },
    rules: {
      // 📝 Reglas básicas de JavaScript
      ...pluginJs.configs.recommended.rules,

      // ⚠️ Variables y código no usado
      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // 🔴 REGLAS DE SEGURIDAD CRÍTICAS - DevSecOps
      "no-eval": "error", // Prevenir inyección de código
      "no-implied-eval": "error", // Prevenir eval() implícito
      "no-new-func": "error", // Prevenir Function() constructor
      "no-script-url": "error", // Prevenir javascript: URLs
      "no-proto": "error", // Prevenir uso de __proto__
      "no-with": "error", // Prevenir statement 'with' inseguro

      // 🚫 PREVENCIÓN DE PROTOTYPE POLLUTION
      "no-extend-native": "error", // Prevenir extensión de prototipos nativos
      "no-global-assign": "error", // Prevenir asignación a variables globales
      "no-implicit-globals": "error", // Prevenir variables globales implícitas

      // 🔍 CÓDIGO SOSPECHOSO
      "no-unreachable": "error", // Código inalcanzable puede ocultar vulnerabilidades
      "no-dupe-keys": "error", // Claves duplicadas pueden causar comportamiento inesperado
      "no-dupe-args": "error", // Argumentos duplicados en funciones
      "no-duplicate-case": "error", // Cases duplicados en switch

      // ⚡ CALIDAD DE CÓDIGO
      "prefer-const": "warn", // Sugerir const cuando sea posible
      "no-var": "error", // Prohibir var, usar let/const
      "no-console": "warn", // Advertir sobre console.log (permitir en desarrollo)

      // 🔒 VALIDACIONES SEGURAS
      "use-isnan": "error", // Forzar uso de isNaN() para comparaciones seguras
      "valid-typeof": "error", // Validar operadores typeof
      "no-unsafe-finally": "error", // Prevenir control flow inseguro en finally
      "no-unsafe-negation": "error", // Prevenir negaciones inseguras
    },
  },
];
