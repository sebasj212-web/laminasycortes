/**
 * Página de Register
 * Permite a los usuarios crear una cuenta nueva
 */

import { Input } from '../components/ui/Input.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Alert } from '../components/ui/Alert.js';
import { validateRequired, validateEmail, validatePassword, validateName } from '../utils/validators.js';
import { AuthServiceDB } from '../services/authServiceDB.js';

/**
 * Componente de página de Register
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback cuando el registro es exitoso
 * @param {Function} props.onLoginClick - Callback cuando se hace clic en "Iniciar sesión"
 * @returns {HTMLElement}
 */
export function RegisterPage({ onSuccess, onLoginClick } = {}) {
  const container = document.createElement('div');
  container.className = 'auth-page';

  // Estado del formulario
  let formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  let errors = {};
  let alertElement = null;
  let isLoading = false;

  // Función para validar el formulario
  function validateForm() {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'El nombre es requerido';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    submitButton.textContent = 'Creando cuenta...';

    try {
      // Intentar registro
      const result = await AuthServiceDB.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        showAlert('¡Cuenta creada exitosamente! Iniciando sesión...', 'success');

        // Auto-login después de registro
        const loginResult = await AuthServiceDB.login(formData.email, formData.password);

        if (loginResult.success && onSuccess) {
          setTimeout(() => {
            onSuccess(loginResult.user);
          }, 1000);
        }
      } else {
        isLoading = false;
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        showAlert(result.error || 'Error al crear la cuenta');
      }
    } catch (error) {
      isLoading = false;
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      showAlert(error.message || 'Error al crear la cuenta');
    }
  }

  // Función para renderizar el formulario
  function render() {
    container.innerHTML = '';

    // Logo/Título
    const header = document.createElement('div');
    header.className = 'auth-header';
    header.innerHTML = `
      <div class="auth-logo">
        <img src="/images/logo.png" alt="Láminas y Cortes Bogotá" />
      </div>
      <h1 class="auth-title">Láminas y Cortes</h1>
      <p class="auth-subtitle">Crear Cuenta Nueva</p>
    `;

    // Formulario
    const form = document.createElement('form');
    form.className = 'auth-form';

    const formCard = Card({
      title: 'Registro',
      padded: true,
      children: [
        Input({
          name: 'name',
          label: 'Nombre completo',
          type: 'text',
          placeholder: 'Juan Pérez',
          value: formData.name,
          error: errors.name || '',
          required: true,
          onChange: (e) => {
            formData.name = e.target.value;
            errors.name = '';
          }
        }),
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
        }),
        Input({
          name: 'confirmPassword',
          label: 'Confirmar contraseña',
          type: 'password',
          placeholder: '••••••••',
          value: formData.confirmPassword,
          error: errors.confirmPassword || '',
          required: true,
          onChange: (e) => {
            formData.confirmPassword = e.target.value;
            errors.confirmPassword = '';
          }
        })
      ]
    });

    // Botón de submit
    const submitButton = Button({
      type: 'submit',
      variant: 'primary',
      children: 'Crear Cuenta',
      fullWidth: true
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'auth-button-container';
    buttonContainer.appendChild(submitButton);

    // Link a login
    const loginLink = document.createElement('div');
    loginLink.className = 'auth-link';
    loginLink.innerHTML = `
      ¿Ya tienes cuenta? <a href="#" class="auth-link-anchor">Inicia sesión aquí</a>
    `;

    loginLink.querySelector('.auth-link-anchor').addEventListener('click', (e) => {
      e.preventDefault();
      if (onLoginClick) {
        onLoginClick();
      }
    });

    // Ensamblar formulario
    form.appendChild(formCard);
    formCard.appendChild(buttonContainer);
    formCard.appendChild(loginLink);

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
