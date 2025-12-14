/**
 * Componente Alert reutilizable
 * @param {Object} props
 * @param {string} props.type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} props.title - Título del alert (opcional)
 * @param {string} props.message - Mensaje del alert (requerido)
 * @param {boolean} props.dismissible - Si puede cerrarse
 * @param {Function} props.onDismiss - Callback al cerrar
 * @param {string} props.className - Clases CSS adicionales
 * @returns {HTMLDivElement}
 */
export function Alert({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = ''
}) {
  const alert = document.createElement('div');

  // Configurar clases
  const classes = ['alert', `alert--${type}`];
  if (className) {
    classes.push(className);
  }
  alert.className = classes.join(' ');

  // Contenedor de contenido
  const content = document.createElement('div');
  content.className = 'alert-content';

  // Título (opcional)
  if (title) {
    const titleElement = document.createElement('div');
    titleElement.className = 'alert-title';
    titleElement.textContent = title;
    content.appendChild(titleElement);
  }

  // Mensaje
  const messageElement = document.createElement('div');
  messageElement.className = 'alert-message';
  messageElement.textContent = message;
  content.appendChild(messageElement);

  alert.appendChild(content);

  // Botón de cierre (opcional)
  if (dismissible) {
    const closeButton = document.createElement('button');
    closeButton.className = 'alert-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Cerrar');
    closeButton.type = 'button';

    closeButton.addEventListener('click', () => {
      // Remover del DOM
      alert.remove();

      // Ejecutar callback si existe
      if (onDismiss) {
        onDismiss();
      }
    });

    alert.appendChild(closeButton);
  }

  return alert;
}
