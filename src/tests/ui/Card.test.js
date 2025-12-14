/**
 * Tests para el componente Card
 */
import { Card } from '../../components/ui/Card';

describe('Card Component', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar un div con clase card', () => {
      const card = Card();

      expect(card.tagName).toBe('DIV');
      expect(card.classList.contains('card')).toBe(true);
    });

    test('debe renderizar contenido de texto', () => {
      const card = Card({ children: 'Test content' });

      expect(card.textContent).toBe('Test content');
    });

    test('debe renderizar contenido HTML', () => {
      const content = document.createElement('p');
      content.textContent = 'Test paragraph';
      const card = Card({ children: content });

      const paragraph = card.querySelector('p');
      expect(paragraph).toBeTruthy();
      expect(paragraph.textContent).toBe('Test paragraph');
    });

    test('debe renderizar múltiples elementos hijos', () => {
      const child1 = document.createElement('h2');
      child1.textContent = 'Title';
      const child2 = document.createElement('p');
      child2.textContent = 'Content';

      const card = Card({ children: [child1, child2] });

      expect(card.querySelector('h2').textContent).toBe('Title');
      expect(card.querySelector('p').textContent).toBe('Content');
    });
  });

  describe('Título del Card', () => {
    test('debe renderizar título si se proporciona', () => {
      const card = Card({ title: 'Card Title' });
      const title = card.querySelector('.card-title');

      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Card Title');
    });

    test('no debe renderizar título si no se proporciona', () => {
      const card = Card({ children: 'Content' });
      const title = card.querySelector('.card-title');

      expect(title).toBeNull();
    });

    test('debe renderizar título y contenido juntos', () => {
      const card = Card({ title: 'Title', children: 'Content' });

      expect(card.querySelector('.card-title').textContent).toBe('Title');
      expect(card.querySelector('.card-body').textContent).toBe('Content');
    });
  });

  describe('Clases adicionales', () => {
    test('debe aplicar className adicional', () => {
      const card = Card({ className: 'custom-class' });

      expect(card.classList.contains('card')).toBe(true);
      expect(card.classList.contains('custom-class')).toBe(true);
    });
  });

  describe('Padding', () => {
    test('debe tener padding por defecto', () => {
      const card = Card();

      expect(card.classList.contains('card--padded')).toBe(true);
    });

    test('puede desactivar padding', () => {
      const card = Card({ padded: false });

      expect(card.classList.contains('card--padded')).toBe(false);
    });
  });
});
