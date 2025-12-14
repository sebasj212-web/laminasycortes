/**
 * Tests para el componente Button
 */
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar un botón con texto', () => {
      const button = Button({ children: 'Click me' });

      expect(button.tagName).toBe('BUTTON');
      expect(button.textContent).toBe('Click me');
    });

    test('debe tener la clase base btn', () => {
      const button = Button({ children: 'Test' });

      expect(button.classList.contains('btn')).toBe(true);
    });
  });

  describe('Variantes', () => {
    test('debe aplicar variante primary por defecto', () => {
      const button = Button({ children: 'Test' });

      expect(button.classList.contains('btn--primary')).toBe(true);
    });

    test('debe aplicar variante secondary', () => {
      const button = Button({ variant: 'secondary', children: 'Test' });

      expect(button.classList.contains('btn--secondary')).toBe(true);
    });

    test('debe aplicar variante danger', () => {
      const button = Button({ variant: 'danger', children: 'Test' });

      expect(button.classList.contains('btn--danger')).toBe(true);
    });
  });

  describe('Estados', () => {
    test('debe estar habilitado por defecto', () => {
      const button = Button({ children: 'Test' });

      expect(button.disabled).toBe(false);
    });

    test('debe poder estar deshabilitado', () => {
      const button = Button({ disabled: true, children: 'Test' });

      expect(button.disabled).toBe(true);
    });
  });

  describe('Tipos de botón', () => {
    test('debe ser tipo button por defecto', () => {
      const button = Button({ children: 'Test' });

      expect(button.type).toBe('button');
    });

    test('debe poder ser tipo submit', () => {
      const button = Button({ type: 'submit', children: 'Test' });

      expect(button.type).toBe('submit');
    });

    test('debe poder ser tipo reset', () => {
      const button = Button({ type: 'reset', children: 'Test' });

      expect(button.type).toBe('reset');
    });
  });

  describe('Eventos', () => {
    test('debe ejecutar onClick cuando se hace click', () => {
      const handleClick = jest.fn();
      const button = Button({ onClick: handleClick, children: 'Test' });

      button.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('no debe ejecutar onClick si está deshabilitado', () => {
      const handleClick = jest.fn();
      const button = Button({
        onClick: handleClick,
        disabled: true,
        children: 'Test'
      });

      button.click();

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Clases adicionales', () => {
    test('debe aplicar className adicional', () => {
      const button = Button({
        className: 'custom-class',
        children: 'Test'
      });

      expect(button.classList.contains('btn')).toBe(true);
      expect(button.classList.contains('custom-class')).toBe(true);
    });
  });
});
