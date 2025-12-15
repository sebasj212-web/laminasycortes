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

// Importar estilos de páginas
import './styles/pages/quotes.css';

// Importar página de cotizaciones
import { QuotesPage } from './pages/quotes';

// Renderizar aplicación
const app = document.getElementById('app');
if (app) {
  const quotesPage = QuotesPage();
  app.appendChild(quotesPage);
}

console.log('💼 Sistema de Cotizaciones cargado');
console.log('✅ FASE 1 MVP completado');
