/**
 * Utilidades para trabajar con localStorage
 * Proporciona métodos seguros para almacenar y recuperar datos
 */

/**
 * Storage helper - Wrapper para localStorage con manejo de errores
 */
export const storage = {
  /**
   * Obtiene un item del localStorage y lo parsea
   * @param {string} key - Clave del item
   * @param {*} defaultValue - Valor por defecto si no existe
   * @returns {*} - Valor parseado o defaultValue
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);

      // Si no existe, retornar valor por defecto
      if (item === null) {
        return defaultValue;
      }

      // Intentar parsear como JSON
      return JSON.parse(item);
    } catch (error) {
      // Si hay error de parse, retornar valor por defecto
      console.error(`Error getting item "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Guarda un item en localStorage como JSON
   * @param {string} key - Clave del item
   * @param {*} value - Valor a guardar (será convertido a JSON)
   * @returns {boolean} - true si se guardó correctamente
   */
  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      // Puede fallar por QuotaExceededError o otros errores
      console.error(`Error setting item "${key}" in localStorage:`, error);
      return false;
    }
  },

  /**
   * Elimina un item del localStorage
   * @param {string} key - Clave del item a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item "${key}" from localStorage:`, error);
      return false;
    }
  },

  /**
   * Limpia todo el localStorage
   * @returns {boolean} - true si se limpió correctamente
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Verifica si existe una key en localStorage
   * @param {string} key - Clave a verificar
   * @returns {boolean} - true si existe
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }
};

/**
 * Keys constantes para localStorage
 * Centraliza las keys usadas en la aplicación
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'quotes_app_current_user',
  USERS: 'quotes_app_users',
  TOKEN: 'quotes_app_token',
  THEME: 'quotes_app_theme',
};
