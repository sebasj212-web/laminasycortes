/**
 * Tests para el componente Input
 */
import { Input } from '../../components/ui/Input';

describe('Input Component', () => {
  describe('Renderizado básico', () => {
    test('debe renderizar un input', () => {
      const input = Input({ name: 'test' });
      const inputElement = input.querySelector('input');

      expect(inputElement).toBeTruthy();
      expect(inputElement.tagName).toBe('INPUT');
    });

    test('debe tener la clase base input-group', () => {
      const input = Input({ name: 'test' });

      expect(input.classList.contains('input-group')).toBe(true);
    });

    test('debe renderizar un label si se proporciona', () => {
      const input = Input({ name: 'test', label: 'Test Label' });
      const label = input.querySelector('label');

      expect(label).toBeTruthy();
      expect(label.textContent).toBe('Test Label');
    });

    test('no debe renderizar label si no se proporciona', () => {
      const input = Input({ name: 'test' });
      const label = input.querySelector('label');

      expect(label).toBeNull();
    });
  });

  describe('Atributos del input', () => {
    test('debe configurar el atributo name', () => {
      const input = Input({ name: 'email' });
      const inputElement = input.querySelector('input');

      expect(inputElement.name).toBe('email');
    });

    test('debe configurar el atributo id', () => {
      const input = Input({ name: 'email', id: 'email-input' });
      const inputElement = input.querySelector('input');

      expect(inputElement.id).toBe('email-input');
    });

    test('debe usar name como id si no se proporciona id', () => {
      const input = Input({ name: 'email' });
      const inputElement = input.querySelector('input');

      expect(inputElement.id).toBe('email');
    });

    test('debe configurar el tipo de input', () => {
      const input = Input({ name: 'password', type: 'password' });
      const inputElement = input.querySelector('input');

      expect(inputElement.type).toBe('password');
    });

    test('debe ser tipo text por defecto', () => {
      const input = Input({ name: 'test' });
      const inputElement = input.querySelector('input');

      expect(inputElement.type).toBe('text');
    });

    test('debe configurar placeholder', () => {
      const input = Input({ name: 'test', placeholder: 'Enter text' });
      const inputElement = input.querySelector('input');

      expect(inputElement.placeholder).toBe('Enter text');
    });

    test('debe configurar required', () => {
      const input = Input({ name: 'test', required: true });
      const inputElement = input.querySelector('input');

      expect(inputElement.required).toBe(true);
    });

    test('debe configurar disabled', () => {
      const input = Input({ name: 'test', disabled: true });
      const inputElement = input.querySelector('input');

      expect(inputElement.disabled).toBe(true);
    });

    test('debe configurar value', () => {
      const input = Input({ name: 'test', value: 'initial value' });
      const inputElement = input.querySelector('input');

      expect(inputElement.value).toBe('initial value');
    });
  });

  describe('Mensajes de error', () => {
    test('no debe mostrar error por defecto', () => {
      const input = Input({ name: 'test' });
      const errorElement = input.querySelector('.input-error');

      expect(errorElement).toBeNull();
    });

    test('debe mostrar mensaje de error si se proporciona', () => {
      const input = Input({ name: 'test', error: 'This field is required' });
      const errorElement = input.querySelector('.input-error');

      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent).toBe('This field is required');
    });

    test('debe agregar clase de error al input si hay error', () => {
      const input = Input({ name: 'test', error: 'Error message' });
      const inputElement = input.querySelector('input');

      expect(inputElement.classList.contains('input--error')).toBe(true);
    });
  });

  describe('Asociación label-input', () => {
    test('el label debe estar asociado al input mediante for/id', () => {
      const input = Input({ name: 'email', label: 'Email' });
      const label = input.querySelector('label');
      const inputElement = input.querySelector('input');

      expect(label.getAttribute('for')).toBe(inputElement.id);
    });
  });
});
