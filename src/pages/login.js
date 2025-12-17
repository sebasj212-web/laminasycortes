/**
 * Página de Login
 * Permite a los usuarios iniciar sesión en la aplicación
 */

import { Input } from '../components/ui/Input.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Alert } from '../components/ui/Alert.js';
import { validateRequired, validateEmail } from '../utils/validators.js';
import { AuthServiceDB } from '../services/authServiceDB.js';

/**
 * Componente de página de Login
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback cuando el login es exitoso
 * @param {Function} props.onRegisterClick - Callback cuando se hace clic en "Registrarse"
 * @returns {HTMLElement}
 */
export function LoginPage({ onSuccess, onRegisterClick } = {}) {
  const container = document.createElement('div');
  container.className = 'auth-page';

  // Estado del formulario
  let formData = {
    email: '',
    password: ''
  };

  let errors = {};
  let alertElement = null;
  let isLoading = false;

  // Función para validar el formulario
  function validateForm() {
    const newErrors = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'La contraseña es requerida';
    }

    return newErrors;
  }

  // Función para mostrar alertas
  function showAlert(message, type = 'error') {
    if (alertElement) {
      alertElement.remove();
    }

    alertElement = Alert({
      type,
      message,
      dismissible: true,
      onDismiss: () => {
        alertElement = null;
      }
    });

    const form = container.querySelector('.auth-form');
    if (form) {
      form.insertBefore(alertElement, form.firstChild);
    }
  }

  // Manejar envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    if (isLoading) return;

    // Validar
    errors = validateForm();

    if (Object.keys(errors).length > 0) {
      render();
      showAlert('Por favor, corrige los errores en el formulario');
      return;
    }

    // Deshabilitar botón y mostrar loading
    isLoading = true;
    const submitButton = container.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Iniciando sesión...';

    try {
      // Intentar login
      const result = await AuthServiceDB.login(formData.email, formData.password);

      if (result.success) {
        showAlert('¡Bienvenido! Iniciando sesión...', 'success');

        // Llamar callback de éxito
        if (onSuccess) {
          setTimeout(() => {
            onSuccess(result.user);
          }, 1000);
        }
      } else {
        isLoading = false;
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        showAlert(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      isLoading = false;
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      showAlert(error.message || 'Error al iniciar sesión');
    }
  }

  // Función para renderizar el formulario
  function render() {
    container.innerHTML = '';

    // Logo/Título
    const header = document.createElement('div');
    header.className = 'auth-header';
    header.innerHTML = `
      <h1 class="auth-title">Láminas y Cortes</h1>
      <p class="auth-subtitle">Sistema de Cotizaciones</p>
    `;

    // Formulario
    const form = document.createElement('form');
    form.className = 'auth-form';

    const formCard = Card({
      title: 'Iniciar Sesión',
      padded: true,
      children: [
        Input({
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'tu@email.com',
          value: formData.email,
          error: errors.email || '',
          required: true,
          onChange: (e) => {
            formData.email = e.target.value;
            errors.email = '';
          }
        }),
        Input({
          name: 'password',
          label: 'Contraseña',
          type: 'password',
          placeholder: '••••••••',
          value: formData.password,
          error: errors.password || '',
          required: true,
          onChange: (e) => {
            formData.password = e.target.value;
            errors.password = '';
          }
        })
      ]
    });

    // Botón de submit
    const submitButton = Button({
      type: 'submit',
      variant: 'primary',
      children: 'Iniciar Sesión',
      fullWidth: true
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'auth-button-container';
    buttonContainer.appendChild(submitButton);

    // Link a registro
    const registerLink = document.createElement('div');
    registerLink.className = 'auth-link';
    registerLink.innerHTML = `
      ¿No tienes cuenta? <a href="#" class="auth-link-anchor">Regístrate aquí</a>
    `;

    registerLink.querySelector('.auth-link-anchor').addEventListener('click', (e) => {
      e.preventDefault();
      if (onRegisterClick) {
        onRegisterClick();
      }
    });

    // Ensamblar formulario
    form.appendChild(formCard);
    formCard.appendChild(buttonContainer);
    formCard.appendChild(registerLink);

    // Agregar listener al submit
    form.addEventListener('submit', handleSubmit);

    // Ensamblar página
    container.appendChild(header);
    container.appendChild(form);
  }

  // Renderizar inicialmente
  render();

  return container;
}
