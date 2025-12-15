/**
 * Tests para AuthService
 * Servicio de autenticación con localStorage
 */
import { AuthService } from '../../services/authService';
import { storage, STORAGE_KEYS } from '../../utils/storage';

describe('AuthService', () => {
  beforeEach(() => {
    // Limpiar storage antes de cada test
    storage.clear();
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('debe registrar un usuario con datos válidos', () => {
      const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      };

      const result = AuthService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBeDefined();
      expect(result.user.name).toBe('Juan Pérez');
      expect(result.user.email).toBe('juan@example.com');
      expect(result.user).not.toHaveProperty('password'); // No debe exponer password
    });

    test('debe rechazar registro con email inválido', () => {
      const result = AuthService.register({
        name: 'Test',
        email: 'invalid-email',
        password: 'password123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email inválido');
    });

    test('debe rechazar registro con password corto', () => {
      const result = AuthService.register({
        name: 'Test',
        email: 'test@example.com',
        password: '123' // muy corto
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('La contraseña debe tener al menos 8 caracteres');
    });

    test('debe rechazar registro con nombre muy corto', () => {
      const result = AuthService.register({
        name: 'A', // solo 1 carácter
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('El nombre debe tener al menos 2 caracteres');
    });

    test('debe rechazar email duplicado', () => {
      const userData = {
        name: 'Juan',
        email: 'juan@example.com',
        password: 'password123'
      };

      // Registrar primera vez
      AuthService.register(userData);

      // Intentar registrar de nuevo
      const result = AuthService.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('El email ya está registrado');
    });

    test('debe guardar el usuario en localStorage', () => {
      const userData = {
        name: 'María',
        email: 'maria@example.com',
        password: 'password123'
      };

      AuthService.register(userData);

      const users = storage.getItem(STORAGE_KEYS.USERS);
      expect(users).toBeDefined();
      expect(users.length).toBe(1);
      expect(users[0].email).toBe('maria@example.com');
    });

    test('debe generar un ID único para cada usuario', () => {
      const user1 = AuthService.register({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123'
      });

      const user2 = AuthService.register({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123'
      });

      expect(user1.user.id).toBeDefined();
      expect(user2.user.id).toBeDefined();
      expect(user1.user.id).not.toBe(user2.user.id);
    });
  });

  describe('login', () => {
    beforeEach(() => {
      // Registrar un usuario para las pruebas
      AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    test('debe hacer login con credenciales válidas', () => {
      const result = AuthService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user).not.toHaveProperty('password');
    });

    test('debe rechazar login con email incorrecto', () => {
      const result = AuthService.login('wrong@example.com', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });

    test('debe rechazar login con password incorrecta', () => {
      const result = AuthService.login('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });

    test('debe guardar la sesión en localStorage', () => {
      AuthService.login('test@example.com', 'password123');

      const currentUser = storage.getItem(STORAGE_KEYS.CURRENT_USER);
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe('test@example.com');
    });

    test('debe rechazar email vacío', () => {
      const result = AuthService.login('', 'password123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email y contraseña son requeridos');
    });

    test('debe rechazar password vacía', () => {
      const result = AuthService.login('test@example.com', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email y contraseña son requeridos');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Registrar y hacer login
      AuthService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');
    });

    test('debe cerrar sesión correctamente', () => {
      AuthService.logout();

      const currentUser = storage.getItem(STORAGE_KEYS.CURRENT_USER);
      expect(currentUser).toBeNull();
    });

    test('debe limpiar la sesión aunque no haya usuario logueado', () => {
      AuthService.logout();
      AuthService.logout(); // Segunda vez

      const currentUser = storage.getItem(STORAGE_KEYS.CURRENT_USER);
      expect(currentUser).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    test('debe retornar null si no hay sesión', () => {
      const user = AuthService.getCurrentUser();

      expect(user).toBeNull();
    });

    test('debe retornar el usuario logueado', () => {
      AuthService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');

      const user = AuthService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user).not.toHaveProperty('password');
    });
  });

  describe('isAuthenticated', () => {
    test('debe retornar false si no hay sesión', () => {
      const isAuth = AuthService.isAuthenticated();

      expect(isAuth).toBe(false);
    });

    test('debe retornar true si hay sesión activa', () => {
      AuthService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');

      const isAuth = AuthService.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    test('debe retornar false después de logout', () => {
      AuthService.register({
        name: 'Test',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');
      AuthService.logout();

      const isAuth = AuthService.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });

  describe('Flujo completo de autenticación', () => {
    test('debe manejar registro → login → logout correctamente', () => {
      // 1. Registrar
      const registerResult = AuthService.register({
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'password123'
      });
      expect(registerResult.success).toBe(true);

      // 2. Login
      const loginResult = AuthService.login('juan@example.com', 'password123');
      expect(loginResult.success).toBe(true);
      expect(AuthService.isAuthenticated()).toBe(true);

      // 3. Verificar sesión
      const currentUser = AuthService.getCurrentUser();
      expect(currentUser.email).toBe('juan@example.com');

      // 4. Logout
      AuthService.logout();
      expect(AuthService.isAuthenticated()).toBe(false);
      expect(AuthService.getCurrentUser()).toBeNull();
    });

    test('debe mantener múltiples usuarios registrados', () => {
      // Registrar 3 usuarios
      AuthService.register({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123'
      });

      AuthService.register({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123'
      });

      AuthService.register({
        name: 'User 3',
        email: 'user3@example.com',
        password: 'password123'
      });

      // Verificar que todos estén guardados
      const users = storage.getItem(STORAGE_KEYS.USERS);
      expect(users.length).toBe(3);

      // Login con el segundo usuario
      const result = AuthService.login('user2@example.com', 'password123');
      expect(result.success).toBe(true);
      expect(result.user.name).toBe('User 2');
    });
  });
});
