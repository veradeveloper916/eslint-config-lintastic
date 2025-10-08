/**
 * 🔍 VULNERABLE DEPENDENCIES LOADER
 *
 * Carga dinámicamente las configuraciones de dependencias vulnerables desde archivos JSON
 * Permite agregar nuevas vulnerabilidades simplemente editando los archivos JSON
 *
 * @author Esteban Vera (@veradeveloper916)
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Carga un archivo JSON de vulnerabilidades
 * @param {string} category - Categoría de vulnerabilidad (critical, high, medium, recommendations)
 * @returns {Object} Configuración de vulnerabilidades
 */
function loadVulnerabilityData(category) {
  try {
    const filePath = join(__dirname, "json", `${category}.json`);
    const data = readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.warn(`⚠️ No se pudo cargar ${category}.json:`, error.message);
    return { metadata: {}, dependencies: [] };
  }
}

/**
 * Convierte los datos JSON a formato compatible con ESLint
 * @param {Object} vulnerabilityData - Datos de vulnerabilidad del JSON
 * @returns {Array} Array de strings en formato "package@version"
 */
function convertToESLintFormat(vulnerabilityData) {
  return vulnerabilityData.dependencies.map(
    (dep) => `${dep.name}@${dep.version}`
  );
}

/**
 * Genera mensajes detallados para cada dependencia
 * @param {Object} vulnerabilityData - Datos de vulnerabilidad del JSON
 * @returns {Object} Objeto con mensajes por dependencia
 */
function generateMessages(vulnerabilityData) {
  const messages = {};

  vulnerabilityData.dependencies.forEach((dep) => {
    const severity = vulnerabilityData.metadata.severity;
    const alternatives = dep.alternatives
      ? `\n🔄 ALTERNATIVAS: ${dep.alternatives.join(", ")}`
      : "";
    const fix = dep.fix ? `\n🔧 SOLUCIÓN: ${dep.fix}` : "";

    messages[dep.name] = `${severity}: ${dep.description}${alternatives}${fix}`;
  });

  return messages;
}

// Cargar todas las configuraciones
const criticalData = loadVulnerabilityData("critical");
const highData = loadVulnerabilityData("high");
const mediumData = loadVulnerabilityData("medium");
const recommendationsData = loadVulnerabilityData("recommendations");

// Exportar en formato compatible con la configuración existente
export const vulnerableDependencies = {
  // Formato legacy para retrocompatibilidad
  critical: convertToESLintFormat(criticalData),
  high: convertToESLintFormat(highData),
  medium: convertToESLintFormat(mediumData),
  recommendations: convertToESLintFormat(recommendationsData),

  // Datos completos para análisis avanzado
  detailed: {
    critical: criticalData,
    high: highData,
    medium: mediumData,
    recommendations: recommendationsData,
  },

  // Mensajes para ESLint rules
  messages: {
    critical: generateMessages(criticalData),
    high: generateMessages(highData),
    medium: generateMessages(mediumData),
    recommendations: generateMessages(recommendationsData),
  },

  // Estadísticas
  stats: {
    total:
      criticalData.dependencies.length +
      highData.dependencies.length +
      mediumData.dependencies.length +
      recommendationsData.dependencies.length,
    critical: criticalData.dependencies.length,
    high: highData.dependencies.length,
    medium: mediumData.dependencies.length,
    recommendations: recommendationsData.dependencies.length,
  },
};

/**
 * Obtiene información detallada de una dependencia específica
 * @param {string} packageName - Nombre del paquete
 * @returns {Object|null} Información detallada o null si no se encuentra
 */
export function getDependencyInfo(packageName) {
  const allData = [criticalData, highData, mediumData, recommendationsData];

  for (const categoryData of allData) {
    const dep = categoryData.dependencies.find((d) => d.name === packageName);
    if (dep) {
      return {
        ...dep,
        category: categoryData.metadata.category,
        severity: categoryData.metadata.severity,
        action: categoryData.metadata.action,
      };
    }
  }

  return null;
}

/**
 * Genera reporte de seguridad completo
 * @returns {Object} Reporte de seguridad
 */
export function generateSecurityReport() {
  return {
    summary: vulnerableDependencies.stats,
    categories: {
      critical: {
        count: criticalData.dependencies.length,
        action: "🚫 BLOQUEO AUTOMÁTICO",
        dependencies: criticalData.dependencies.map((d) => ({
          name: d.name,
          cve: d.cve,
          description: d.description,
        })),
      },
      high: {
        count: highData.dependencies.length,
        action: "⚠️ WARNING + REPORT",
        dependencies: highData.dependencies.map((d) => ({
          name: d.name,
          cve: d.cve,
          description: d.description,
        })),
      },
      medium: {
        count: mediumData.dependencies.length,
        action: "📊 MONITORING",
        dependencies: mediumData.dependencies.map((d) => ({
          name: d.name,
          description: d.description,
        })),
      },
      recommendations: {
        count: recommendationsData.dependencies.length,
        action: "💡 GUIDANCE ONLY",
        dependencies: recommendationsData.dependencies.map((d) => ({
          name: d.name,
          description: d.description,
        })),
      },
    },
    timestamp: new Date().toISOString(),
  };
}

export default vulnerableDependencies;
