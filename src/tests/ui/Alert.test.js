/**
 * Tests para el componente Alert
 */
import { Alert } from '../../components/ui/Alert';

describe('Alert Component', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar un div con clase alert', () => {
      const alert = Alert({ message: 'Test message' });

      expect(alert.tagName).toBe('DIV');
      expect(alert.classList.contains('alert')).toBe(true);
    });

    test('debe renderizar el mensaje', () => {
      const alert = Alert({ message: 'This is a test message' });

      expect(alert.textContent).toContain('This is a test message');
    });
  });

  describe('Tipos de alerta', () => {
    test('debe aplicar tipo info por defecto', () => {
      const alert = Alert({ message: 'Test' });

      expect(alert.classList.contains('alert--info')).toBe(true);
    });

    test('debe aplicar tipo success', () => {
      const alert = Alert({ type: 'success', message: 'Test' });

      expect(alert.classList.contains('alert--success')).toBe(true);
    });

    test('debe aplicar tipo error', () => {
      const alert = Alert({ type: 'error', message: 'Test' });

      expect(alert.classList.contains('alert--error')).toBe(true);
    });

    test('debe aplicar tipo warning', () => {
      const alert = Alert({ type: 'warning', message: 'Test' });

      expect(alert.classList.contains('alert--warning')).toBe(true);
    });

    test('debe aplicar tipo info', () => {
      const alert = Alert({ type: 'info', message: 'Test' });

      expect(alert.classList.contains('alert--info')).toBe(true);
    });
  });

  describe('Título opcional', () => {
    test('no debe renderizar título por defecto', () => {
      const alert = Alert({ message: 'Test' });
      const title = alert.querySelector('.alert-title');

      expect(title).toBeNull();
    });

    test('debe renderizar título si se proporciona', () => {
      const alert = Alert({ title: 'Alert Title', message: 'Test' });
      const title = alert.querySelector('.alert-title');

      expect(title).toBeTruthy();
      expect(title.textContent).toBe('Alert Title');
    });
  });

  describe('Botón de cierre', () => {
    test('no debe mostrar botón de cierre por defecto', () => {
      const alert = Alert({ message: 'Test' });
      const closeButton = alert.querySelector('.alert-close');

      expect(closeButton).toBeNull();
    });

    test('debe mostrar botón de cierre si dismissible es true', () => {
      const alert = Alert({ message: 'Test', dismissible: true });
      const closeButton = alert.querySelector('.alert-close');

      expect(closeButton).toBeTruthy();
    });

    test('debe ejecutar onDismiss cuando se hace click en cerrar', () => {
      const handleDismiss = jest.fn();
      const alert = Alert({
        message: 'Test',
        dismissible: true,
        onDismiss: handleDismiss
      });

      const closeButton = alert.querySelector('.alert-close');
      closeButton.click();

      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    test('debe remover el alert del DOM cuando se cierra', () => {
      const container = document.createElement('div');
      const alert = Alert({ message: 'Test', dismissible: true });
      container.appendChild(alert);

      const closeButton = alert.querySelector('.alert-close');
      closeButton.click();

      expect(container.contains(alert)).toBe(false);
    });
  });

  describe('Clases adicionales', () => {
    test('debe aplicar className adicional', () => {
      const alert = Alert({ message: 'Test', className: 'custom-class' });

      expect(alert.classList.contains('alert')).toBe(true);
      expect(alert.classList.contains('custom-class')).toBe(true);
    });
  });
});
