import { ESLint } from "eslint";

/**
 * Linta el texto proporcionado utilizando una configuración de ESLint.
 *
 * @param {ESLint.Options} baseConfig - Configuración de ESLint a utilizar.
 * @param {string} text - El texto que se va a analizar.
 * @returns {Promise<Array>} Una promesa que se resuelve con los resultados del linting.
 *                             Los resultados son un array de objetos de tipo `LintResult`.
 */
global.lint = (baseConfig, text) => {
  const cli = new ESLint({ baseConfig })

  return cli.lintText(text);
};
