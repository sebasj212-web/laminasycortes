/**
 * AuthService - Servicio de autenticación
 * Maneja registro, login, logout y gestión de sesión con localStorage
 */

import {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired
} from '../utils/validators';
import { storage, STORAGE_KEYS } from '../utils/storage';

/**
 * Servicio de autenticación
 */
export const AuthService = {
  /**
   * Registra un nuevo usuario
   * @param {Object} userData - { name, email, password }
   * @returns {Object} - { success: boolean, user?: Object, error?: string }
   */
  register({ name, email, password }) {
    // 1. Validar nombre
    if (!validateName(name)) {
      return {
        success: false,
        error: 'El nombre debe tener al menos 2 caracteres'
      };
    }

    // 2. Validar email
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    // 3. Validar password
    if (!validatePassword(password)) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      };
    }

    // 4. Verificar que el email no esté registrado
    const users = this._getUsers();
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
    }

    // 5. Crear nuevo usuario
    const newUser = {
      id: this._generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // En producción esto debería estar hasheado
      createdAt: new Date().toISOString()
    };

    // 6. Guardar usuario
    users.push(newUser);
    storage.setItem(STORAGE_KEYS.USERS, users);

    // 7. Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      user: userWithoutPassword
    };
  },

  /**
   * Inicia sesión de usuario
   * @param {string} email
   * @param {string} password
   * @returns {Object} - { success: boolean, user?: Object, error?: string }
   */
  login(email, password) {
    // 1. Validar que vengan los datos
    if (!validateRequired(email) || !validateRequired(password)) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    // 2. Buscar usuario
    const users = this._getUsers();
    const user = users.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );

    // 3. Verificar credenciales
    if (!user) {
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    // 4. Guardar sesión (sin password)
    const { password: _, ...userWithoutPassword } = user;
    storage.setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);

    return {
      success: true,
      user: userWithoutPassword
    };
  },

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    storage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Obtiene el usuario actualmente logueado
   * @returns {Object|null} - Usuario o null si no hay sesión
   */
  getCurrentUser() {
    return storage.getItem(STORAGE_KEYS.CURRENT_USER, null);
  },

  /**
   * Verifica si hay un usuario logueado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Obtiene todos los usuarios registrados (privado)
   * @private
   * @returns {Array}
   */
  _getUsers() {
    return storage.getItem(STORAGE_KEYS.USERS, []);
  },

  /**
   * Genera un ID único para el usuario (privado)
   * @private
   * @returns {string}
   */
  _generateId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
