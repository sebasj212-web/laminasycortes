/**
 * Tests para utilidades de validación
 */
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired
} from '../../utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('debe retornar true para emails válidos', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user_name@subdomain.example.com')).toBe(true);
      expect(validateEmail('123@example.com')).toBe(true);
    });

    test('debe retornar false para emails inválidos', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('user@example')).toBe(false);
      expect(validateEmail('user..name@example.com')).toBe(false);
    });

    test('debe retornar false para valores null o undefined', () => {
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
    });

    test('debe trimear espacios antes de validar', () => {
      expect(validateEmail('  test@example.com  ')).toBe(true);
      expect(validateEmail(' user@example.com ')).toBe(true);
    });
  });

  describe('validatePassword', () => {
    test('debe retornar true para contraseñas válidas (mínimo 8 caracteres)', () => {
      expect(validatePassword('12345678')).toBe(true);
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('MyP@ssw0rd!')).toBe(true);
      expect(validatePassword('verylongpassword')).toBe(true);
    });

    test('debe retornar false para contraseñas cortas', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('1234567')).toBe(false); // 7 caracteres
      expect(validatePassword('short')).toBe(false);
    });

    test('debe retornar false para valores null o undefined', () => {
      expect(validatePassword(null)).toBe(false);
      expect(validatePassword(undefined)).toBe(false);
    });

    test('debe contar caracteres después de trimear espacios', () => {
      expect(validatePassword('  12345678  ')).toBe(true);
      expect(validatePassword('  1234567  ')).toBe(false); // 7 caracteres sin espacios
    });
  });

  describe('validateName', () => {
    test('debe retornar true para nombres válidos (mínimo 2 caracteres)', () => {
      expect(validateName('Jo')).toBe(true);
      expect(validateName('Juan')).toBe(true);
      expect(validateName('María García')).toBe(true);
      expect(validateName('José Luis')).toBe(true);
      expect(validateName('Anne-Marie')).toBe(true);
    });

    test('debe retornar false para nombres muy cortos', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('A')).toBe(false);
      expect(validateName(' ')).toBe(false);
    });

    test('debe retornar false para valores null o undefined', () => {
      expect(validateName(null)).toBe(false);
      expect(validateName(undefined)).toBe(false);
    });

    test('debe trimear espacios y validar', () => {
      expect(validateName('  Juan  ')).toBe(true);
      expect(validateName('  J  ')).toBe(false); // 1 carácter
      expect(validateName('   ')).toBe(false); // solo espacios
    });
  });

  describe('validateRequired', () => {
    test('debe retornar true para valores no vacíos', () => {
      expect(validateRequired('texto')).toBe(true);
      expect(validateRequired('0')).toBe(true);
      expect(validateRequired('false')).toBe(true);
      expect(validateRequired('  contenido  ')).toBe(true);
    });

    test('debe retornar false para valores vacíos', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false); // solo espacios
    });

    test('debe retornar false para null o undefined', () => {
      expect(validateRequired(null)).toBe(false);
      expect(validateRequired(undefined)).toBe(false);
    });

    test('debe trimear espacios antes de validar', () => {
      expect(validateRequired('  valor  ')).toBe(true);
      expect(validateRequired('     ')).toBe(false);
    });
  });
});
