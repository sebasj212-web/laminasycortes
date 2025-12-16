import { Input } from '../ui/Input.js';
import { Button } from '../ui/Button.js';
import { Card } from '../ui/Card.js';
import { Alert } from '../ui/Alert.js';
import { validateRequired, validateEmail } from '../../utils/validators.js';
import QuotesService from '../../services/quotesService.js';
import { AuthService } from '../../services/authService.js';

/**
 * Componente de formulario para crear cotizaciones
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback cuando se crea exitosamente
 * @param {Function} props.onCancel - Callback cuando se cancela
 * @returns {HTMLElement}
 */
export function QuoteForm({ onSuccess, onCancel } = {}) {
  const form = document.createElement('form');
  form.className = 'quote-form';

  // Estado del formulario
  let formData = {
    client: { name: '', email: '', phone: '' },
    product: { description: '', quantity: '', unitPrice: '' }
  };

  let errors = {};
  let alertElement = null;

  // Función para validar el formulario
  function validateForm() {
    const newErrors = {};

    // Validar cliente
    if (!validateRequired(formData.client.name)) {
      newErrors.clientName = 'El nombre del cliente es requerido';
    }

    if (formData.client.email && !validateEmail(formData.client.email)) {
      newErrors.clientEmail = 'El email no es válido';
    }

    // Validar producto
    if (!validateRequired(formData.product.description)) {
      newErrors.productDescription = 'La descripción del producto es requerida';
    }

    if (!validateRequired(formData.product.quantity)) {
      newErrors.productQuantity = 'La cantidad es requerida';
    } else if (Number(formData.product.quantity) <= 0) {
      newErrors.productQuantity = 'La cantidad debe ser mayor a 0';
    }

    if (!validateRequired(formData.product.unitPrice)) {
      newErrors.productUnitPrice = 'El precio unitario es requerido';
    } else if (Number(formData.product.unitPrice) <= 0) {
      newErrors.productUnitPrice = 'El precio debe ser mayor a 0';
    }

    return newErrors;
  }

  // Función para calcular valores
  function calculateValues() {
    const quantity = Number(formData.product.quantity) || 0;
    const unitPrice = Number(formData.product.unitPrice) || 0;
    const subtotal = quantity * unitPrice;
    const iva = subtotal * 0.16;
    const total = subtotal * 1.16;

    return { subtotal, iva, total };
  }

  // Función para actualizar la vista del total
  function updateTotal() {
    const subtotalElement = form.querySelector('.quote-subtotal-value');
    const ivaElement = form.querySelector('.quote-iva-value');
    const totalElement = form.querySelector('.quote-total-value');

    const { subtotal, iva, total } = calculateValues();

    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (ivaElement) {
      ivaElement.textContent = `$${iva.toFixed(2)}`;
    }
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  }

  // Función para mostrar errores
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

    form.insertBefore(alertElement, form.firstChild);
  }

  // Función para renderizar inputs con errores
  function renderInput(config) {
    return Input({
      ...config,
      error: errors[config.name] || '',
      value: formData[config.section]?.[config.field] || '',
      onChange: (e) => {
        formData[config.section][config.field] = e.target.value;
        errors[config.name] = '';

        // Actualizar total si cambia cantidad o precio
        if (config.field === 'quantity' || config.field === 'unitPrice') {
          updateTotal();
        }
      }
    });
  }

  // Manejar envío del formulario
  async function handleSubmit(e) {
    e.preventDefault();

    // Validar
    errors = validateForm();

    if (Object.keys(errors).length > 0) {
      // Re-renderizar para mostrar errores
      render();
      showAlert('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      // Obtener usuario actual
      const currentUser = AuthService.getCurrentUser();

      // Crear cotización
      const quote = QuotesService.createQuote({
        client: {
          name: formData.client.name,
          email: formData.client.email,
          phone: formData.client.phone
        },
        product: {
          description: formData.product.description,
          quantity: Number(formData.product.quantity),
          unitPrice: Number(formData.product.unitPrice)
        }
      }, currentUser?.email);

      showAlert(`Cotización ${quote.number} creada exitosamente`, 'success');

      // Llamar callback
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(quote);
        }, 1500);
      }
    } catch (error) {
      showAlert(error.message || 'Error al crear la cotización');
    }
  }

  // Función para renderizar el formulario
  function render() {
    form.innerHTML = '';

    // Sección de cliente
    const clientSection = Card({
      title: 'Información del Cliente',
      padded: true,
      children: [
        renderInput({
          name: 'clientName',
          section: 'client',
          field: 'name',
          label: 'Nombre del cliente *',
          type: 'text',
          placeholder: 'Ej: Juan Pérez',
          required: true
        }),
        renderInput({
          name: 'clientEmail',
          section: 'client',
          field: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'Ej: juan@example.com'
        }),
        renderInput({
          name: 'clientPhone',
          section: 'client',
          field: 'phone',
          label: 'Teléfono',
          type: 'tel',
          placeholder: 'Ej: +52 123 456 7890'
        })
      ]
    });

    // Sección de producto
    const productSection = Card({
      title: 'Información del Producto',
      padded: true,
      children: [
        renderInput({
          name: 'productDescription',
          section: 'product',
          field: 'description',
          label: 'Descripción del producto *',
          type: 'text',
          placeholder: 'Ej: Lámina de acero 2x1m',
          required: true
        }),
        renderInput({
          name: 'productQuantity',
          section: 'product',
          field: 'quantity',
          label: 'Cantidad *',
          type: 'number',
          placeholder: 'Ej: 5',
          required: true
        }),
        renderInput({
          name: 'productUnitPrice',
          section: 'product',
          field: 'unitPrice',
          label: 'Precio unitario *',
          type: 'number',
          placeholder: 'Ej: 1500',
          required: true
        })
      ]
    });

    // Resumen de totales
    const { subtotal, iva, total } = calculateValues();
    const totalSection = document.createElement('div');
    totalSection.className = 'quote-totals';
    totalSection.innerHTML = `
      <div class="quote-total-row">
        <div class="quote-total-label">Subtotal:</div>
        <div class="quote-subtotal-value">$${subtotal.toFixed(2)}</div>
      </div>
      <div class="quote-total-row">
        <div class="quote-total-label">IVA (16%):</div>
        <div class="quote-iva-value">$${iva.toFixed(2)}</div>
      </div>
      <div class="quote-total-row quote-total-row-final">
        <div class="quote-total-label">Total:</div>
        <div class="quote-total-value">$${total.toFixed(2)}</div>
      </div>
    `;

    // Botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'quote-form-buttons';

    const submitButton = Button({
      type: 'submit',
      variant: 'primary',
      children: 'Crear Cotización'
    });

    const cancelButton = Button({
      type: 'button',
      variant: 'secondary',
      children: 'Cancelar',
      onClick: () => {
        if (onCancel) {
          onCancel();
        }
      }
    });

    buttonsContainer.appendChild(cancelButton);
    buttonsContainer.appendChild(submitButton);

    // Agregar todo al formulario
    form.appendChild(clientSection);
    form.appendChild(productSection);
    form.appendChild(totalSection);
    form.appendChild(buttonsContainer);
  }

  // Agregar listener al submit
  form.addEventListener('submit', handleSubmit);

  // Renderizar inicialmente
  render();

  return form;
}
