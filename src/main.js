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

// Importar página de cotizaciones
import { QuotesPage } from './pages/quotes';

// Importar utilidades de autenticación
import { initAuth, showAuthStatus } from './utils/auth-init';

// Inicializar aplicación
async function initApp() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ No se encontró elemento #app');
    return;
  }

  // Mostrar loading
  app.innerHTML = '<div class="loading">Cargando...</div>';

  try {
    // Inicializar autenticación
    console.log('🔐 Inicializando autenticación...');
    const user = await initAuth();

    if (!user) {
      app.innerHTML = '<div class="error">Error al inicializar la aplicación. Por favor recarga la página.</div>';
      return;
    }

    // Renderizar aplicación
    app.innerHTML = '';
    const quotesPage = QuotesPage();
    app.appendChild(quotesPage);

    // Mostrar estado de autenticación
    showAuthStatus(quotesPage, user);

    console.log('💼 Sistema de Cotizaciones cargado');
    console.log('✅ FASE 2: Base de datos PostgreSQL integrada');
  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
    app.innerHTML = '<div class="error">Error al cargar la aplicación. Por favor recarga la página.</div>';
  }
}

// Iniciar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
