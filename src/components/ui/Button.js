/**
 * Componente Button reutilizable
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger'
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {string} props.type - 'button' | 'submit' | 'reset'
 * @param {Function} props.onClick - Manejador de click
 * @param {string} props.children - Texto del botón
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.fullWidth - Botón de ancho completo
 * @returns {HTMLButtonElement}
 */
export function Button({
  variant = 'primary',
  disabled = false,
  type = 'button',
  onClick,
  children,
  className = '',
  fullWidth = false
}) {
  const button = document.createElement('button');

  // Configurar tipo
  button.type = type;

  // Configurar clases
  const classes = ['btn', `btn--${variant}`];
  if (fullWidth) {
    classes.push('btn--full-width');
  }
  if (className) {
    classes.push(className);
  }
  button.className = classes.join(' ');

  // Configurar contenido
  button.textContent = children;

  // Configurar estado deshabilitado
  button.disabled = disabled;

  // Configurar evento onClick
  if (onClick && !disabled) {
    button.addEventListener('click', onClick);
  }

  return button;
}
