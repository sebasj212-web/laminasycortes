import { QuoteForm } from '../components/quotes/QuoteForm.js';
import { QuotesList } from '../components/quotes/QuotesList.js';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import '../styles/components/quote-form.css';
import '../styles/components/quotes-list.css';

/**
 * Página principal de cotizaciones
 * Maneja la vista de lista y formulario
 */
export function QuotesPage() {
  const container = document.createElement('div');
  container.className = 'quotes-page';

  let currentView = 'list'; // 'list' o 'form'
  let quotesList = null;

  // Función para mostrar el formulario
  function showForm() {
    currentView = 'form';
    render();
  }

  // Función para mostrar la lista
  function showList() {
    currentView = 'list';
    render();
  }

  // Función para renderizar la página
  function render() {
    container.innerHTML = '';

    // Header
    const header = document.createElement('header');
    header.className = 'quotes-page-header';

    const title = document.createElement('h1');
    title.textContent = 'Sistema de Cotizaciones';
    title.className = 'quotes-page-title';

    header.appendChild(title);

    // Si estamos en la lista, agregar botón de nueva cotización
    if (currentView === 'list') {
      const newQuoteButton = Button({
        variant: 'primary',
        children: '+ Nueva Cotización',
        onClick: showForm
      });
      header.appendChild(newQuoteButton);
    }

    container.appendChild(header);

    // Content
    const content = document.createElement('main');
    content.className = 'quotes-page-content';

    if (currentView === 'form') {
      const formCard = Card({
        title: 'Nueva Cotización',
        padded: false,
        children: [
          QuoteForm({
            onSuccess: (quote) => {
              showList();
            },
            onCancel: showList
          })
        ]
      });

      content.appendChild(formCard);
    } else {
      quotesList = QuotesList({
        onView: (quote) => {
          alert(`Ver detalle de ${quote.number}\n\nCliente: ${quote.client.name}\nProducto: ${quote.product.description}\nTotal: $${quote.product.total}`);
        },
        onDelete: (quoteId) => {
          // La lista ya se actualiza internamente
        }
      });

      content.appendChild(quotesList);
    }

    container.appendChild(content);
  }

  // Renderizar inicialmente
  render();

  return container;
}
