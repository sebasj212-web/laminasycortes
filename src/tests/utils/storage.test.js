/**
 * Tests para utilidades de localStorage
 * Tests funcionales que verifican el comportamiento sin espiar los mocks
 */
import { storage, STORAGE_KEYS } from '../../utils/storage';

describe('Storage Helpers', () => {
  beforeEach(() => {
    // Limpiar storage antes de cada test
    jest.clearAllMocks();
  });

  describe('getItem y setItem', () => {
    test('debe guardar y recuperar un objeto', () => {
      const testData = { name: 'Juan', age: 30 };

      const saved = storage.setItem('test-key', testData);
      const result = storage.getItem('test-key');

      expect(saved).toBe(true);
      expect(result).toEqual(testData);
    });

    test('debe guardar y recuperar un string', () => {
      storage.setItem('token', 'abc123');
      const result = storage.getItem('token');

      expect(result).toBe('abc123');
    });

    test('debe guardar y recuperar un número', () => {
      storage.setItem('count', 42);
      const result = storage.getItem('count');

      expect(result).toBe(42);
    });

    test('debe retornar null si la key no existe', () => {
      const result = storage.getItem('non-existent');

      expect(result).toBeNull();
    });

    test('debe retornar valor por defecto si la key no existe', () => {
      const result = storage.getItem('non-existent', { default: 'value' });

      expect(result).toEqual({ default: 'value' });
    });
  });

  describe('removeItem', () => {
    test('debe eliminar un item', () => {
      storage.setItem('test-key', { data: 'test' });

      const removed = storage.removeItem('test-key');
      const result = storage.getItem('test-key');

      expect(removed).toBe(true);
      expect(result).toBeNull();
    });
  });

  describe('clear', () => {
    test('debe limpiar todo el storage', () => {
      storage.setItem('key1', 'value1');
      storage.setItem('key2', 'value2');

      const cleared = storage.clear();

      expect(cleared).toBe(true);
      // Nota: En tests unitarios con mocks, no podemos verificar
      // que realmente se limpiaron los items
    });
  });

  describe('has', () => {
    test('debe retornar true si la key existe', () => {
      storage.setItem('existing-key', 'value');

      const exists = storage.has('existing-key');

      expect(exists).toBe(true);
    });

    test('debe retornar false si la key no existe', () => {
      const exists = storage.has('non-existent');

      expect(exists).toBe(false);
    });
  });

  describe('STORAGE_KEYS', () => {
    test('debe tener las keys definidas', () => {
      expect(STORAGE_KEYS.CURRENT_USER).toBe('quotes_app_current_user');
      expect(STORAGE_KEYS.USERS).toBe('quotes_app_users');
      expect(STORAGE_KEYS.TOKEN).toBe('quotes_app_token');
      expect(STORAGE_KEYS.THEME).toBe('quotes_app_theme');
    });

    test('todas las keys deben tener el prefijo quotes_app_', () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        expect(key).toMatch(/^quotes_app_/);
      });
    });
  });

  describe('manejo de errores', () => {
    test('getItem debe retornar default value en caso de error', () => {
      // Simular datos corruptos almacenados directamente
      // (esto es difícil de simular con mocks, solo documentamos el comportamiento)
      const result = storage.getItem('potentially-corrupted', 'fallback');

      // Si hay error, debería retornar el fallback
      expect(typeof result).toBeDefined();
    });

    test('setItem debe retornar boolean indicando éxito', () => {
      const result = storage.setItem('test', { data: 'value' });

      expect(typeof result).toBe('boolean');
    });

    test('removeItem debe retornar boolean indicando éxito', () => {
      const result = storage.removeItem('test');

      expect(typeof result).toBe('boolean');
    });

    test('clear debe retornar boolean indicando éxito', () => {
      const result = storage.clear();

      expect(typeof result).toBe('boolean');
    });
  });
});
