/**
 * Authentication Initialization Helper
 *
 * This file handles auto-authentication with a demo user for development.
 * In production, you would replace this with proper login/register pages.
 */

import { AuthServiceDB } from '../services/authServiceDB.js';

const DEMO_USER = {
  name: 'Usuario Demo',
  email: 'demo@laminasycortes.com',
  password: 'demo1234'
};

/**
 * Initialize authentication
 * - Checks if user is already logged in
 * - If not, tries to login with demo user
 * - If demo user doesn't exist, creates it
 *
 * @returns {Promise<Object>} - User object or null
 */
export async function initAuth() {
  try {
    // Check if already authenticated
    const isAuth = await AuthServiceDB.isAuthenticated();

    if (isAuth) {
      const user = await AuthServiceDB.getCurrentUser();
      console.log('✅ Usuario autenticado:', user.email);
      return user;
    }

    console.log('ℹ️  No hay sesión activa, intentando login automático con usuario demo...');

    // Try to login with demo user
    let result = await AuthServiceDB.login(DEMO_USER.email, DEMO_USER.password);

    // If demo user doesn't exist, create it
    if (!result.success && result.error.includes('Credenciales inválidas')) {
      console.log('ℹ️  Usuario demo no existe, creándolo...');

      result = await AuthServiceDB.register(DEMO_USER);

      if (result.success) {
        console.log('✅ Usuario demo creado exitosamente');

        // Login after registration
        result = await AuthServiceDB.login(DEMO_USER.email, DEMO_USER.password);
      }
    }

    if (result.success) {
      console.log('✅ Login exitoso:', result.user.email);
      return result.user;
    } else {
      console.error('❌ Error en autenticación:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error inicializando autenticación:', error);
    return null;
  }
}

/**
 * Show authentication status in the UI
 * @param {HTMLElement} container - Container element to add status to
 * @param {Object} user - Current user
 */
export function showAuthStatus(container, user) {
  if (!user) return;

  const statusBar = document.createElement('div');
  statusBar.className = 'auth-status-bar';
  statusBar.innerHTML = `
    <div class="auth-status-content">
      <span class="auth-status-user">👤 ${user.name || user.email}</span>
      <button class="auth-status-logout" id="logout-btn">Cerrar Sesión</button>
    </div>
  `;

  // Add logout handler
  statusBar.querySelector('#logout-btn').addEventListener('click', async () => {
    try {
      await AuthServiceDB.logout();
      console.log('✅ Sesión cerrada');
      window.location.reload(); // Reload page after logout
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  });

  container.insertBefore(statusBar, container.firstChild);
}
