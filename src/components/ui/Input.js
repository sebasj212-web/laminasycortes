/**
 * Componente Input reutilizable
 * @param {Object} props
 * @param {string} props.name - Nombre del input (requerido)
 * @param {string} props.id - ID del input (usa name si no se proporciona)
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.label - Texto del label
 * @param {string} props.placeholder - Texto placeholder
 * @param {string} props.value - Valor inicial
 * @param {boolean} props.required - Campo requerido
 * @param {boolean} props.disabled - Campo deshabilitado
 * @param {string} props.error - Mensaje de error
 * @param {string} props.className - Clases CSS adicionales
 * @param {Function} props.onChange - Callback cuando cambia el valor
 * @returns {HTMLDivElement}
 */
export function Input({
  name,
  id,
  type = 'text',
  label,
  placeholder = '',
  value = '',
  required = false,
  disabled = false,
  error = '',
  className = '',
  onChange
}) {
  // Container principal
  const container = document.createElement('div');
  const classes = ['input-group'];
  if (className) {
    classes.push(className);
  }
  container.className = classes.join(' ');

  // ID del input (usa name si no se proporciona id)
  const inputId = id || name;

  // Label (opcional)
  if (label) {
    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', inputId);
    labelElement.textContent = label;
    labelElement.className = 'input-label';
    container.appendChild(labelElement);
  }

  // Input
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = inputId;
  input.placeholder = placeholder;
  input.value = value;
  input.required = required;
  input.disabled = disabled;

  // Clase base + clase de error si existe
  const inputClasses = ['input'];
  if (error) {
    inputClasses.push('input--error');
  }
  input.className = inputClasses.join(' ');

  // Event listener para onChange
  if (onChange) {
    input.addEventListener('input', onChange);
  }

  container.appendChild(input);

  // Mensaje de error (si existe)
  if (error) {
    const errorElement = document.createElement('div');
    errorElement.className = 'input-error';
    errorElement.textContent = error;
    container.appendChild(errorElement);
  }

  return container;
}
