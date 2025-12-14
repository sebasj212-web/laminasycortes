/**
 * Página de demostración de componentes UI
 * Sprint 2: Componentes Base
 */

import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card } from './components/ui/Card';
import { Alert } from './components/ui/Alert';

/**
 * Renderiza la página de demostración
 * @param {HTMLElement} container - Contenedor donde renderizar
 */
export function renderDemo(container) {
  // Limpiar contenedor
  container.innerHTML = '';

  // Crear layout principal
  const mainLayout = createMainLayout();
  container.appendChild(mainLayout);
}

/**
 * Crea el layout principal de la demo
 */
function createMainLayout() {
  const main = document.createElement('div');
  main.style.maxWidth = '1200px';
  main.style.margin = '0 auto';
  main.style.padding = '2rem';

  // Header
  const header = createHeader();
  main.appendChild(header);

  // Sección de Alerts
  const alertsSection = createSection(
    'Alerts',
    'Mensajes de notificación con diferentes tipos',
    createAlertsDemo()
  );
  main.appendChild(alertsSection);

  // Sección de Buttons
  const buttonsSection = createSection(
    'Buttons',
    'Botones con diferentes variantes y estados',
    createButtonsDemo()
  );
  main.appendChild(buttonsSection);

  // Sección de Inputs
  const inputsSection = createSection(
    'Inputs',
    'Campos de entrada con validación',
    createInputsDemo()
  );
  main.appendChild(inputsSection);

  // Sección de Cards
  const cardsSection = createSection(
    'Cards',
    'Contenedores para agrupar contenido',
    createCardsDemo()
  );
  main.appendChild(cardsSection);

  return main;
}

/**
 * Crea el header de la demo
 */
function createHeader() {
  const header = document.createElement('header');
  header.style.marginBottom = '3rem';
  header.style.textAlign = 'center';

  const title = document.createElement('h1');
  title.textContent = '🎨 Demo de Componentes UI';
  title.style.fontSize = '2.5rem';
  title.style.color = 'var(--color-dark)';
  title.style.marginBottom = '0.5rem';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Sprint 2: Componentes Base - Láminas y Cortes';
  subtitle.style.color = 'var(--color-gray)';
  subtitle.style.fontSize = '1.1rem';

  const coverage = document.createElement('p');
  coverage.innerHTML = '<strong>56 tests pasando</strong> | <strong>97.91% coverage</strong>';
  coverage.style.color = 'var(--color-success)';
  coverage.style.marginTop = '0.5rem';

  header.appendChild(title);
  header.appendChild(subtitle);
  header.appendChild(coverage);

  return header;
}

/**
 * Crea una sección de demostración
 */
function createSection(title, description, content) {
  const section = document.createElement('section');
  section.style.marginBottom = '3rem';

  const titleEl = document.createElement('h2');
  titleEl.textContent = title;
  titleEl.style.fontSize = '1.8rem';
  titleEl.style.color = 'var(--color-dark)';
  titleEl.style.marginBottom = '0.5rem';

  const descEl = document.createElement('p');
  descEl.textContent = description;
  descEl.style.color = 'var(--color-gray)';
  descEl.style.marginBottom = '1.5rem';

  section.appendChild(titleEl);
  section.appendChild(descEl);
  section.appendChild(content);

  return section;
}

/**
 * Demo de Alerts
 */
function createAlertsDemo() {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '1rem';

  // Alert de éxito
  const successAlert = Alert({
    type: 'success',
    title: '¡Éxito!',
    message: 'La operación se completó correctamente',
    dismissible: true,
    onDismiss: () => console.log('Success alert cerrado')
  });
  container.appendChild(successAlert);

  // Alert de error
  const errorAlert = Alert({
    type: 'error',
    title: 'Error',
    message: 'Hubo un problema al procesar tu solicitud',
    dismissible: true
  });
  container.appendChild(errorAlert);

  // Alert de warning
  const warningAlert = Alert({
    type: 'warning',
    message: 'Por favor verifica tu información antes de continuar',
    dismissible: true
  });
  container.appendChild(warningAlert);

  // Alert de info
  const infoAlert = Alert({
    type: 'info',
    message: 'Todos los componentes están funcionando correctamente'
  });
  container.appendChild(infoAlert);

  return container;
}

/**
 * Demo de Buttons
 */
function createButtonsDemo() {
  const container = document.createElement('div');

  // Primary buttons
  const primaryRow = createButtonRow('Primary');
  primaryRow.appendChild(Button({
    variant: 'primary',
    children: 'Primary Button',
    onClick: () => alert('Primary clicked!')
  }));
  primaryRow.appendChild(Button({
    variant: 'primary',
    disabled: true,
    children: 'Disabled'
  }));
  container.appendChild(primaryRow);

  // Secondary buttons
  const secondaryRow = createButtonRow('Secondary');
  secondaryRow.appendChild(Button({
    variant: 'secondary',
    children: 'Secondary Button',
    onClick: () => alert('Secondary clicked!')
  }));
  secondaryRow.appendChild(Button({
    variant: 'secondary',
    disabled: true,
    children: 'Disabled'
  }));
  container.appendChild(secondaryRow);

  // Danger buttons
  const dangerRow = createButtonRow('Danger');
  dangerRow.appendChild(Button({
    variant: 'danger',
    children: 'Delete',
    onClick: () => {
      if (confirm('¿Estás seguro?')) {
        alert('Deleted!');
      }
    }
  }));
  dangerRow.appendChild(Button({
    variant: 'danger',
    disabled: true,
    children: 'Disabled'
  }));
  container.appendChild(dangerRow);

  return container;
}

/**
 * Crea una fila de botones
 */
function createButtonRow(label) {
  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '1rem';
  row.style.marginBottom = '1rem';

  const labelEl = document.createElement('span');
  labelEl.textContent = label + ':';
  labelEl.style.fontWeight = '600';
  labelEl.style.minWidth = '100px';
  labelEl.style.color = 'var(--color-dark)';

  row.appendChild(labelEl);

  return row;
}

/**
 * Demo de Inputs
 */
function createInputsDemo() {
  const container = document.createElement('div');
  container.style.maxWidth = '500px';

  // Input normal
  container.appendChild(Input({
    name: 'name',
    label: 'Nombre completo',
    placeholder: 'Ingresa tu nombre',
    required: true
  }));

  // Input email
  container.appendChild(Input({
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'tu@email.com',
    required: true
  }));

  // Input password
  container.appendChild(Input({
    name: 'password',
    type: 'password',
    label: 'Contraseña',
    placeholder: 'Mínimo 8 caracteres',
    required: true
  }));

  // Input con error
  container.appendChild(Input({
    name: 'email-error',
    type: 'email',
    label: 'Email (con error)',
    value: 'invalidemail',
    error: 'El formato del email no es válido'
  }));

  // Input deshabilitado
  container.appendChild(Input({
    name: 'disabled',
    label: 'Campo deshabilitado',
    value: 'No editable',
    disabled: true
  }));

  return container;
}

/**
 * Demo de Cards
 */
function createCardsDemo() {
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
  container.style.gap = '1.5rem';

  // Card simple
  const simpleCard = Card({
    title: 'Card Simple',
    children: 'Este es un card simple con título y contenido. Tiene padding por defecto y una sombra suave.'
  });
  container.appendChild(simpleCard);

  // Card con contenido HTML
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = `
    <p style="margin-bottom: 1rem;">Este card contiene <strong>contenido HTML</strong>.</p>
    <ul style="list-style: disc; margin-left: 1.5rem;">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  `;
  const htmlCard = Card({
    title: 'Card con HTML',
    children: contentDiv
  });
  container.appendChild(htmlCard);

  // Card sin título
  const noTitleCard = Card({
    children: 'Este card no tiene título, solo contenido. También funciona perfectamente.'
  });
  container.appendChild(noTitleCard);

  return container;
}
