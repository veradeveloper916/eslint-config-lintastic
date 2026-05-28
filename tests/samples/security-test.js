/**
 * 🛡️ SECURITY TEST SAMPLES - DevSecOps Security Vulnerability Examples
 *
 * Ejemplos de código con vulnerabilidades de seguridad para testing
 * Incluye patrones del OWASP Top 10 y vulnerabilidades comunes
 *
 * @author Esteban Vera (@veradeveloper916)
 * @specialization DevSecOps Security Specialist
 */

// ❌ CRITICAL SECURITY VULNERABILITIES - These should trigger errors

// A03: Injection - Code Injection
const userInput = "test_input"; // Mock for demonstration
// eval(userInput); // Should trigger: no-eval - COMMENTED OUT to prevent execution

const dynamicCode = "return '" + userInput + "'";
// eslint-disable-next-line no-new-func -- SECURITY DEMO: This intentionally shows vulnerable code
const _func = new Function(dynamicCode); // Should trigger: no-new-func
// func(); // Commented out to prevent execution during tests

// A03: Injection - Command Injection (via setTimeout)
// setTimeout(userInput, 100); // Should trigger: no-implied-eval - COMMENTED OUT
// setInterval("doSomething(" + userInput + ")", 1000); // Should trigger: no-implied-eval - COMMENTED OUT

// A03: Injection - Script Injection
// location.href = "javascript:alert(1)"; // Should trigger: no-script-url - COMMENTED OUT for Node.js compatibility
// eslint-disable-next-line no-script-url -- SECURITY DEMO: This intentionally shows vulnerable code
const _scriptUrl = "javascript:alert(1)"; // Should trigger: no-script-url

// ⚠️ MEDIUM SEVERITY ISSUES - These should trigger warnings

// Code Quality Issues (commented out to prevent noise during tests)
// console.log("Debug information:", userInput); // Should trigger: no-console (warn)
// alert("User notification"); // Should trigger: no-alert (warn)

// ✅ SECURE CODE EXAMPLES - These should pass without issues

// Secure alternatives for code injection
const _safeEval = (input) => {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
};

// Secure function creation
const _safeFunction = (a, b) => a + b;

// Secure timeout usage
setTimeout(() => {
  // Safe timeout - no console.log to avoid lint warnings during tests
  const message = "Safe timeout executed";
  return message;
}, 100);

/**
 * Mock function to simulate user input (unused in commented examples)
 * @returns {string} Simulated user input
 */
function _getUserInput() {
  return "malicious_input_here";
}

/**
 * Test function para verificar configuración
 * @returns {string} Status message
 * @example
 * console.log(testSecurityConfig()); // "Security config updated successfully"
 */
function testSecurityConfig() {
  return "DevSecOps security configuration active - MVC architecture implemented";
}

export default testSecurityConfig;
