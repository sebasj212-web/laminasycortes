/**
 * Utilidades de validación
 * Funciones para validar diferentes tipos de entrada de usuario
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si el email es válido
 */
export function validateEmail(email) {
  // Verificar que existe y no es null/undefined
  if (!email || email === null || email === undefined) {
    return false;
  }

  // Convertir a string y trimear espacios
  const trimmedEmail = String(email).trim();

  // Verificar que no esté vacío después de trimear
  if (!trimmedEmail) {
    return false;
  }

  // Regex para validar formato de email
  // Formato: texto@dominio.extension
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validaciones adicionales
  // No permitir puntos consecutivos
  if (trimmedEmail.includes('..')) {
    return false;
  }

  // Probar con la regex
  return emailRegex.test(trimmedEmail);
}

/**
 * Valida que la contraseña cumpla requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si la contraseña es válida
 */
export function validatePassword(password) {
  // Verificar que existe y no es null/undefined
  if (!password || password === null || password === undefined) {
    return false;
  }

  // Convertir a string y trimear espacios
  const trimmedPassword = String(password).trim();

  // Verificar que tenga al menos 8 caracteres
  return trimmedPassword.length >= 8;
}

/**
 * Valida que el nombre tenga al menos 2 caracteres
 * @param {string} name - Nombre a validar
 * @returns {boolean} - true si el nombre es válido
 */
export function validateName(name) {
  // Verificar que existe y no es null/undefined
  if (!name || name === null || name === undefined) {
    return false;
  }

  // Convertir a string y trimear espacios
  const trimmedName = String(name).trim();

  // Verificar que tenga al menos 2 caracteres
  return trimmedName.length >= 2;
}

/**
 * Valida que un campo no esté vacío
 * @param {string} value - Valor a validar
 * @returns {boolean} - true si el valor no está vacío
 */
export function validateRequired(value) {
  // Verificar que existe y no es null/undefined
  if (value === null || value === undefined) {
    return false;
  }

  // Convertir a string y trimear espacios
  const trimmedValue = String(value).trim();

  // Verificar que no esté vacío
  return trimmedValue.length > 0;
}

/**
 * Valida múltiples campos con sus respectivas reglas
 * @param {Object} fields - Objeto con los campos a validar
 * @param {Object} rules - Objeto con las reglas de validación
 * @returns {Object} - Objeto con errores por campo
 *
 * @example
 * const errors = validateFields(
 *   { email: 'test@example.com', password: '123' },
 *   {
 *     email: [validateRequired, validateEmail],
 *     password: [validateRequired, validatePassword]
 *   }
 * );
 * // errors = { password: 'invalid' }
 */
export function validateFields(fields, rules) {
  const errors = {};

  Object.keys(rules).forEach(fieldName => {
    const value = fields[fieldName];
    const fieldRules = rules[fieldName];

    // Ejecutar cada regla de validación para el campo
    for (const rule of fieldRules) {
      if (!rule(value)) {
        errors[fieldName] = 'invalid';
        break; // Si una regla falla, no seguir validando
      }
    }
  });

  return errors;
}
