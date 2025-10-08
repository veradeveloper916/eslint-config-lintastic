/**
 * 🔍 DEMOSTRACIÓN DE ANÁLISIS DE DEPENDENCIAS VULNERABLES
 *
 * Este archivo demuestra cómo usar las nuevas funcionalidades de análisis
 * de dependencias basadas en archivos JSON dinámicos
 */

import {
  vulnerableDependencies,
  getDependencyInfo,
  generateSecurityReport,
} from "./vulnerabilities-loader.js";

/**
 * Ejemplo de análisis de dependencia específica
 * @param {string} packageName - Nombre del paquete a analizar
 * @example
 * analyzeDependency('lodash');
 */
function analyzeDependency(packageName) {
  const info = getDependencyInfo(packageName);

  if (info) {
    console.log(`\n📦 Análisis de ${packageName}:`);
    console.log(`${info.severity} ${info.vulnerability}`);
    console.log(`📝 Descripción: ${info.description}`);

    if (info.alternatives) {
      console.log(`🔄 Alternativas: ${info.alternatives.join(", ")}`);
    }

    if (info.fix) {
      console.log(`🔧 Solución: ${info.fix}`);
    }

    if (info.cve && info.cve !== "N/A") {
      console.log(`🚨 CVE: ${info.cve}`);
    }
  } else {
    console.log(
      `✅ ${packageName} no está en la base de datos de vulnerabilidades`
    );
  }
}

/**
 * Genera reporte completo de seguridad
 * @example
 * generateFullReport();
 */
function generateFullReport() {
  const report = generateSecurityReport();

  console.log("\n🛡️ REPORTE DE SEGURIDAD LINTASTIC DevSecOps");
  console.log("================================================");
  console.log(`📊 Total de dependencias monitoreadas: ${report.summary.total}`);
  console.log(`🔴 Críticas (bloquean build): ${report.summary.critical}`);
  console.log(`🟠 Alto riesgo (warnings): ${report.summary.high}`);
  console.log(`🟡 Riesgo medio (monitoreo): ${report.summary.medium}`);
  console.log(`💡 Recomendaciones: ${report.summary.recommendations}`);

  return report;
}

/**
 * Demuestra estadísticas rápidas
 * @example
 * showStats();
 */
function showStats() {
  console.log("\n📈 ESTADÍSTICAS DE VULNERABILIDADES:");
  console.log(
    `Total: ${vulnerableDependencies.stats.total} dependencias monitoreadas`
  );
  console.log(`🔴 Críticas: ${vulnerableDependencies.stats.critical}`);
  console.log(`🟠 Alto: ${vulnerableDependencies.stats.high}`);
  console.log(`🟡 Medio: ${vulnerableDependencies.stats.medium}`);
  console.log(
    `💡 Recomendaciones: ${vulnerableDependencies.stats.recommendations}`
  );
}

// Ejemplos de uso
if (import.meta.url === new URL(import.meta.url).href) {
  console.log("🚀 Ejecutando demo de análisis de seguridad...\n");

  // Analizar dependencias específicas
  analyzeDependency("lodash");
  analyzeDependency("express");
  analyzeDependency("react"); // No debería estar en la base de datos

  // Mostrar estadísticas
  showStats();

  // Generar reporte completo (comentado para no saturar la consola)
  // generateFullReport();
}

export { analyzeDependency, generateFullReport, showStats };
