/**
 * Main entry point de la aplicación
 * Láminas y Cortes - Sistema de Cotizaciones
 * Sprint 2: Demo de Componentes UI
 */

// Importar estilos globales
import './styles/reset.css';
import './styles/variables.css';

// Importar estilos de componentes
import './styles/components/button.css';
import './styles/components/input.css';
import './styles/components/card.css';
import './styles/components/alert.css';

// Importar página de demo
import { renderDemo } from './demo';

// Renderizar demo en el DOM
const app = document.getElementById('app');
if (app) {
  renderDemo(app);
}

console.log('🎨 Demo de Componentes UI cargada');
console.log('✅ Sprint 2 completado');
