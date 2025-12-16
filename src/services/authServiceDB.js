/**
 * AuthService - Database Version
 * Manages authentication using Supabase Auth
 *
 * Supabase Auth provides:
 * - Secure password hashing
 * - JWT tokens for session management
 * - Email verification (optional)
 * - Password reset functionality
 * - OAuth integration (Google, GitHub, etc.) - can be enabled later
 */

import { supabase } from '../config/supabase.js';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired
} from '../utils/validators.js';

/**
 * Handle Supabase Auth errors
 */
function handleAuthError(error, operation) {
  console.error(`Error in ${operation}:`, error);

  // Map common Supabase error messages to user-friendly messages
  const errorMessages = {
    'User already registered': 'El email ya está registrado',
    'Invalid login credentials': 'Credenciales inválidas',
    'Email not confirmed': 'Por favor confirma tu email',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres'
  };

  const message = errorMessages[error.message] || error.message || 'Error en la autenticación';

  return {
    success: false,
    error: message
  };
}

/**
 * Authentication Service (Database Version)
 * All methods are async and interact with Supabase Auth
 */
export const AuthServiceDB = {
  /**
   * Register a new user
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>} - { success: boolean, user?: Object, error?: string }
   */
  async register({ name, email, password }) {
    // 1. Validate name
    if (!validateName(name)) {
      return {
        success: false,
        error: 'El nombre debe tener al menos 2 caracteres'
      };
    }

    // 2. Validate email
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    // 3. Validate password
    if (!validatePassword(password)) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      };
    }

    // 4. Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: {
          name: name.trim()
        }
      }
    });

    if (error) {
      return handleAuthError(error, 'register');
    }

    // 5. Return user data
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || name.trim(),
          createdAt: data.user.created_at
        }
      };
    }

    return {
      success: false,
      error: 'Error al crear usuario'
    };
  },

  /**
   * Log in user
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} - { success: boolean, user?: Object, error?: string }
   */
  async login(email, password) {
    // 1. Validate required fields
    if (!validateRequired(email) || !validateRequired(password)) {
      return {
        success: false,
        error: 'Email y contraseña son requeridos'
      };
    }

    // 2. Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password
    });

    if (error) {
      return handleAuthError(error, 'login');
    }

    // 3. Return user data
    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || '',
          createdAt: data.user.created_at
        }
      };
    }

    return {
      success: false,
      error: 'Error al iniciar sesión'
    };
  },

  /**
   * Log out current user
   * @returns {Promise<void>}
   */
  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error);
      throw new Error('Error al cerrar sesión');
    }
  },

  /**
   * Get currently logged in user
   * @returns {Promise<Object|null>} - User or null if not authenticated
   */
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      createdAt: user.created_at
    };
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Called when auth state changes
   * @returns {Object} - Subscription object with unsubscribe method
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ? {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || '',
          createdAt: session.user.created_at
        } : null;

        callback(event, user);
      }
    );

    return subscription;
  },

  /**
   * Request password reset email
   * @param {string} email
   * @returns {Promise<Object>} - { success: boolean, error?: string }
   */
  async requestPasswordReset(email) {
    if (!validateEmail(email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: window.location.origin + '/reset-password'
      }
    );

    if (error) {
      return handleAuthError(error, 'password reset request');
    }

    return {
      success: true
    };
  },

  /**
   * Update password
   * @param {string} newPassword
   * @returns {Promise<Object>} - { success: boolean, error?: string }
   */
  async updatePassword(newPassword) {
    if (!validatePassword(newPassword)) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 8 caracteres'
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      return handleAuthError(error, 'password update');
    }

    return {
      success: true
    };
  },

  /**
   * Update user profile
   * @param {Object} updates - { name?: string, email?: string }
   * @returns {Promise<Object>} - { success: boolean, user?: Object, error?: string }
   */
  async updateProfile(updates) {
    const userData = {};

    if (updates.name !== undefined) {
      if (!validateName(updates.name)) {
        return {
          success: false,
          error: 'El nombre debe tener al menos 2 caracteres'
        };
      }
      userData.data = { name: updates.name.trim() };
    }

    if (updates.email !== undefined) {
      if (!validateEmail(updates.email)) {
        return {
          success: false,
          error: 'Email inválido'
        };
      }
      userData.email = updates.email.trim().toLowerCase();
    }

    const { data, error } = await supabase.auth.updateUser(userData);

    if (error) {
      return handleAuthError(error, 'profile update');
    }

    if (data.user) {
      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || '',
          createdAt: data.user.created_at
        }
      };
    }

    return {
      success: false,
      error: 'Error al actualizar perfil'
    };
  }
};

export default AuthServiceDB;
