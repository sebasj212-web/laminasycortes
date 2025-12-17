/**
 * Main entry point de la aplicación
 * Láminas y Cortes - Sistema de Cotizaciones
 */

// Importar estilos globales
import './styles/reset.css';
import './styles/variables.css';

// Importar estilos de componentes
import './styles/components/button.css';
import './styles/components/input.css';
import './styles/components/card.css';
import './styles/components/alert.css';
import './styles/components/auth-status.css';

// Importar estilos de páginas
import './styles/pages/quotes.css';
import './styles/pages/auth.css';

// Importar páginas
import { QuotesPage } from './pages/quotes';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';

// Importar servicios
import { AuthServiceDB } from './services/authServiceDB';

/**
 * Función para mostrar la barra de estado de autenticación
 */
function showAuthStatus(container, user) {
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

/**
 * Aplicación principal
 */
class App {
  constructor() {
    this.container = document.getElementById('app');
    this.currentUser = null;
    this.currentView = null;
  }

  /**
   * Inicializar aplicación
   */
  async init() {
    if (!this.container) {
      console.error('❌ No se encontró elemento #app');
      return;
    }

    // Mostrar loading inicial
    this.showLoading();

    try {
      // Verificar si hay usuario autenticado
      console.log('🔐 Verificando autenticación...');
      const isAuth = await AuthServiceDB.isAuthenticated();

      if (isAuth) {
        const user = await AuthServiceDB.getCurrentUser();
        if (user) {
          console.log('✅ Usuario autenticado:', user.email);
          this.currentUser = user;
          this.showApp();
          return;
        }
      }

      // No hay usuario autenticado, mostrar login
      console.log('ℹ️ No hay sesión activa, mostrando login');
      this.showLogin();
    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
      this.showError('Error al cargar la aplicación. Por favor recarga la página.');
    }
  }

  /**
   * Mostrar loading
   */
  showLoading() {
    this.container.innerHTML = '<div class="loading">Cargando...</div>';
  }

  /**
   * Mostrar error
   */
  showError(message) {
    this.container.innerHTML = `<div class="error">${message}</div>`;
  }

  /**
   * Mostrar página de login
   */
  showLogin() {
    this.currentView = 'login';
    this.container.innerHTML = '';

    const loginPage = LoginPage({
      onSuccess: (user) => {
        this.currentUser = user;
        this.showApp();
      },
      onRegisterClick: () => {
        this.showRegister();
      }
    });

    this.container.appendChild(loginPage);
  }

  /**
   * Mostrar página de registro
   */
  showRegister() {
    this.currentView = 'register';
    this.container.innerHTML = '';

    const registerPage = RegisterPage({
      onSuccess: (user) => {
        this.currentUser = user;
        this.showApp();
      },
      onLoginClick: () => {
        this.showLogin();
      }
    });

    this.container.appendChild(registerPage);
  }

  /**
   * Mostrar aplicación principal (quotes)
   */
  showApp() {
    this.currentView = 'app';
    this.container.innerHTML = '';

    const quotesPage = QuotesPage();
    this.container.appendChild(quotesPage);

    // Mostrar estado de autenticación
    showAuthStatus(quotesPage, this.currentUser);

    console.log('💼 Sistema de Cotizaciones cargado');
    console.log('✅ FASE 2: Base de datos PostgreSQL integrada');
  }
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
  });
} else {
  const app = new App();
  app.init();
}
