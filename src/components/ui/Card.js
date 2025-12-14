/**
 * Componente Card reutilizable
 * @param {Object} props
 * @param {string} props.title - Título del card (opcional)
 * @param {string|HTMLElement|Array} props.children - Contenido del card
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.padded - Si debe tener padding (true por defecto)
 * @returns {HTMLDivElement}
 */
export function Card({
  title,
  children,
  className = '',
  padded = true
} = {}) {
  const card = document.createElement('div');

  // Configurar clases
  const classes = ['card'];
  if (padded) {
    classes.push('card--padded');
  }
  if (className) {
    classes.push(className);
  }
  card.className = classes.join(' ');

  // Agregar título si existe
  if (title) {
    const titleElement = document.createElement('h2');
    titleElement.className = 'card-title';
    titleElement.textContent = title;
    card.appendChild(titleElement);
  }

  // Agregar contenido
  if (children) {
    const body = document.createElement('div');
    body.className = 'card-body';

    // Manejar diferentes tipos de children
    if (typeof children === 'string') {
      body.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string') {
          body.textContent += child;
        } else {
          body.appendChild(child);
        }
      });
    } else {
      body.appendChild(children);
    }

    card.appendChild(body);
  }

  return card;
}
