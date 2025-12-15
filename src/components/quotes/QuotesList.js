import { Card } from '../ui/Card.js';
import { Button } from '../ui/Button.js';
import { Alert } from '../ui/Alert.js';
import QuotesService from '../../services/quotesService.js';

/**
 * Componente para mostrar la lista de cotizaciones
 * @param {Object} props
 * @param {Function} props.onEdit - Callback cuando se edita una cotización
 * @param {Function} props.onView - Callback cuando se ve el detalle
 * @param {Function} props.onDelete - Callback cuando se elimina una cotización
 * @returns {HTMLElement}
 */
export function QuotesList({ onEdit, onView, onDelete } = {}) {
  const container = document.createElement('div');
  container.className = 'quotes-list';

  let alertElement = null;

  // Función para mostrar alertas
  function showAlert(message, type = 'info') {
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

    container.insertBefore(alertElement, container.firstChild);
  }

  // Función para formatear fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Función para formatear moneda
  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }

  // Función para manejar la eliminación
  function handleDelete(quoteId, quoteNumber) {
    if (confirm(`¿Estás seguro de eliminar la cotización ${quoteNumber}?`)) {
      const success = QuotesService.deleteQuote(quoteId);

      if (success) {
        showAlert(`Cotización ${quoteNumber} eliminada exitosamente`, 'success');
        render();

        if (onDelete) {
          onDelete(quoteId);
        }
      } else {
        showAlert('Error al eliminar la cotización', 'error');
      }
    }
  }

  // Función para crear una tarjeta de cotización
  function createQuoteCard(quote) {
    const quoteCard = document.createElement('div');
    quoteCard.className = 'quote-card';

    // Header
    const header = document.createElement('div');
    header.className = 'quote-card-header';

    const numberAndDate = document.createElement('div');
    numberAndDate.className = 'quote-card-info';

    const numberElement = document.createElement('div');
    numberElement.className = 'quote-number';
    numberElement.textContent = quote.number;

    const dateElement = document.createElement('div');
    dateElement.className = 'quote-date';
    dateElement.textContent = formatDate(quote.createdAt);

    numberAndDate.appendChild(numberElement);
    numberAndDate.appendChild(dateElement);

    const totalElement = document.createElement('div');
    totalElement.className = 'quote-total-badge';
    totalElement.textContent = formatCurrency(quote.product.total);

    header.appendChild(numberAndDate);
    header.appendChild(totalElement);

    // Body
    const body = document.createElement('div');
    body.className = 'quote-card-body';

    const clientInfo = document.createElement('div');
    clientInfo.className = 'quote-client';
    clientInfo.innerHTML = `
      <div class="quote-client-name"><strong>Cliente:</strong> ${quote.client.name}</div>
      ${quote.client.email ? `<div class="quote-client-email">${quote.client.email}</div>` : ''}
      ${quote.client.phone ? `<div class="quote-client-phone">${quote.client.phone}</div>` : ''}
    `;

    const productInfo = document.createElement('div');
    productInfo.className = 'quote-product';
    productInfo.innerHTML = `
      <div class="quote-product-desc"><strong>Producto:</strong> ${quote.product.description}</div>
      <div class="quote-product-details">
        <span>${quote.product.quantity} x ${formatCurrency(quote.product.unitPrice)}</span>
      </div>
    `;

    body.appendChild(clientInfo);
    body.appendChild(productInfo);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'quote-card-actions';

    const viewButton = Button({
      variant: 'secondary',
      children: 'Ver Detalles',
      onClick: () => {
        if (onView) {
          onView(quote);
        }
      }
    });

    const deleteButton = Button({
      variant: 'danger',
      children: 'Eliminar',
      onClick: () => handleDelete(quote.id, quote.number)
    });

    actions.appendChild(viewButton);
    actions.appendChild(deleteButton);

    // Ensamblar tarjeta
    quoteCard.appendChild(header);
    quoteCard.appendChild(body);
    quoteCard.appendChild(actions);

    return quoteCard;
  }

  // Función para renderizar la lista
  function render() {
    // Limpiar contenedor excepto alertas
    const existingAlert = container.querySelector('.alert');
    container.innerHTML = '';
    if (existingAlert) {
      container.appendChild(existingAlert);
    }

    // Obtener cotizaciones
    const quotes = QuotesService.getAllQuotes();

    if (quotes.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'quotes-empty-state';
      emptyDiv.innerHTML = `
        <p>No hay cotizaciones creadas aún.</p>
        <p>Crea tu primera cotización para comenzar.</p>
      `;

      const emptyState = Card({
        padded: true,
        children: emptyDiv
      });

      container.appendChild(emptyState);
      return;
    }

    // Ordenar por fecha (más recientes primero)
    const sortedQuotes = [...quotes].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Header de la lista
    const listHeader = document.createElement('div');
    listHeader.className = 'quotes-list-header';
    listHeader.innerHTML = `
      <h2>Cotizaciones (${quotes.length})</h2>
    `;
    container.appendChild(listHeader);

    // Crear tarjetas
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'quotes-cards-container';

    sortedQuotes.forEach(quote => {
      const card = createQuoteCard(quote);
      cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
  }

  // Renderizar inicialmente
  render();

  // Exponer método refresh para actualizar desde fuera
  container.refresh = render;

  return container;
}
