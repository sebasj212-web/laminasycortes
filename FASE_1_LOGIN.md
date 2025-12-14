# FASE 1: Sistema de Autenticación - Guía Detallada

## 🎯 Objetivos de Aprendizaje

Al completar esta fase habrás aprendido:
- ✅ Configurar un proyecto moderno con Vite
- ✅ Implementar testing con Jest
- ✅ Crear componentes reutilizables
- ✅ Manejar estado y validaciones
- ✅ Trabajar con Git flow profesional
- ✅ Desplegar a producción

---

## 📐 Arquitectura Propuesta

### Estructura de Carpetas
```
laminasycortes/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.js          # Formulario de login
│   │   │   ├── RegisterForm.js       # Formulario de registro
│   │   │   ├── AuthGuard.js          # Protección de rutas
│   │   │   └── LogoutButton.js       # Botón de cerrar sesión
│   │   └── ui/
│   │       ├── Button.js             # Botón reutilizable
│   │       ├── Input.js              # Input con validación
│   │       ├── Card.js               # Card container
│   │       └── Alert.js              # Mensajes de error/éxito
│   ├── services/
│   │   └── authService.js            # Lógica de autenticación
│   ├── utils/
│   │   ├── validators.js             # Validaciones
│   │   └── storage.js                # LocalStorage helpers
│   ├── styles/
│   │   ├── variables.css             # Variables CSS
│   │   ├── reset.css                 # CSS reset
│   │   └── components/               # Estilos por componente
│   ├── tests/
│   │   ├── auth/
│   │   │   ├── LoginForm.test.js
│   │   │   └── authService.test.js
│   │   └── utils/
│   │       └── validators.test.js
│   ├── main.js                       # Entry point
│   └── router.js                     # Routing simple
├── public/
│   └── index.html
├── dist/                             # Build output (git-ignored)
├── node_modules/                     # Dependencies (git-ignored)
├── package.json
├── vite.config.js
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

---

## 🔧 Paso 1: Configuración del Entorno

### 1.1 Inicializar Node.js
```bash
npm init -y
```

### 1.2 Instalar Vite
```bash
npm install -D vite
```

### 1.3 Instalar Dependencias de Testing
```bash
npm install -D jest @testing-library/dom @testing-library/jest-dom jest-environment-jsdom
```

### 1.4 Instalar Herramientas de Calidad
```bash
npm install -D eslint prettier husky lint-staged
```

### 1.5 Configurar Scripts en package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.js"
  }
}
```

---

## 🎨 Paso 2: Sistema de Diseño

### 2.1 Variables CSS (src/styles/variables.css)
```css
:root {
  /* Colores Primarios */
  --color-primary: #3498db;
  --color-primary-dark: #2980b9;
  --color-primary-light: #5dade2;

  /* Colores Neutrales */
  --color-dark: #2c3e50;
  --color-gray: #7f8c8d;
  --color-light: #ecf0f1;
  --color-white: #ffffff;

  /* Estados */
  --color-success: #27ae60;
  --color-error: #e74c3c;
  --color-warning: #f39c12;
  --color-info: #3498db;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;

  /* Tipografía */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-xxl: 2rem;

  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 20px rgba(0,0,0,0.15);

  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
}
```

---

## 🧪 Paso 3: Testing First (TDD)

### 3.1 Configurar Jest (jest.config.js)
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 3.2 Setup de Testing (src/tests/setup.js)
```javascript
import '@testing-library/jest-dom';
```

### 3.3 Primer Test - Validators

**Test (src/tests/utils/validators.test.js)**
```javascript
import { validateEmail, validatePassword } from '../../utils/validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    test('debe retornar true para email válido', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    test('debe retornar false para email inválido', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('debe retornar true para contraseña válida (min 8 caracteres)', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    test('debe retornar false para contraseña inválida', () => {
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('1234567')).toBe(false); // < 8 caracteres
    });
  });
});
```

**Implementación (src/utils/validators.js)**
```javascript
/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que la contraseña tenga mínimo 8 caracteres
 * @param {string} password
 * @returns {boolean}
 */
export function validatePassword(password) {
  if (!password) return false;
  return password.length >= 8;
}

/**
 * Valida nombre (mínimo 2 caracteres)
 * @param {string} name
 * @returns {boolean}
 */
export function validateName(name) {
  if (!name) return false;
  return name.trim().length >= 2;
}
```

---

## 🔐 Paso 4: Servicio de Autenticación

### 4.1 Test del AuthService (src/tests/auth/authService.test.js)
```javascript
import { AuthService } from '../../services/authService';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('register', () => {
    test('debe registrar usuario correctamente', () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = AuthService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user).toHaveProperty('id');
      expect(result.user.email).toBe(userData.email);
      expect(result.user).not.toHaveProperty('password'); // No exponer password
    });

    test('debe rechazar email duplicado', () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      AuthService.register(userData);
      const result = AuthService.register(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('El email ya está registrado');
    });
  });

  describe('login', () => {
    test('debe hacer login con credenciales válidas', () => {
      // Primero registrar
      AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Luego login
      const result = AuthService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('test@example.com');
    });

    test('debe rechazar credenciales inválidas', () => {
      const result = AuthService.login('fake@example.com', 'wrong');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });
  });

  describe('getCurrentUser', () => {
    test('debe retornar usuario si está logueado', () => {
      AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');

      const user = AuthService.getCurrentUser();

      expect(user).not.toBeNull();
      expect(user.email).toBe('test@example.com');
    });

    test('debe retornar null si no está logueado', () => {
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    test('debe cerrar sesión correctamente', () => {
      AuthService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      AuthService.login('test@example.com', 'password123');

      AuthService.logout();

      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });
  });
});
```

### 4.2 Implementación del AuthService (src/services/authService.js)
```javascript
/**
 * Servicio de autenticación
 * Maneja registro, login, logout y gestión de sesión
 */
export const AuthService = {
  STORAGE_KEYS: {
    USERS: 'quotes_app_users',
    CURRENT_USER: 'quotes_app_current_user'
  },

  /**
   * Obtiene todos los usuarios registrados
   * @returns {Array}
   */
  getUsers() {
    const users = localStorage.getItem(this.STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  /**
   * Guarda usuarios en localStorage
   * @param {Array} users
   */
  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - { name, email, password }
   * @returns {Object} - { success, user, error }
   */
  register({ name, email, password }) {
    const users = this.getUsers();

    // Validar si el email ya existe
    if (users.some(u => u.email === email)) {
      return {
        success: false,
        error: 'El email ya está registrado'
      };
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // En producción esto debería estar hasheado
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);

    // Retornar usuario sin password
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      user: userWithoutPassword
    };
  },

  /**
   * Inicia sesión
   * @param {string} email
   * @param {string} password
   * @returns {Object} - { success, user, error }
   */
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    // Guardar sesión
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(
      this.STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(userWithoutPassword)
    );

    return {
      success: true,
      user: userWithoutPassword
    };
  },

  /**
   * Obtiene el usuario actual logueado
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Cierra sesión
   */
  logout() {
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  },

  /**
   * Verifica si hay un usuario logueado
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  }
};
```

---

## 🎨 Paso 5: Componentes UI

### 5.1 Componente Button (src/components/ui/Button.js)
```javascript
/**
 * Componente Button reutilizable
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'danger'
 * @param {boolean} props.disabled
 * @param {string} props.type - 'button' | 'submit' | 'reset'
 * @param {Function} props.onClick
 * @param {string} props.children
 */
export function Button({
  variant = 'primary',
  disabled = false,
  type = 'button',
  onClick,
  children
}) {
  const button = document.createElement('button');
  button.type = type;
  button.className = `btn btn--${variant}`;
  button.textContent = children;
  button.disabled = disabled;

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
```

### 5.2 Estilos del Button (src/styles/components/button.css)
```css
.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: 600;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background-color: var(--color-light);
  color: var(--color-dark);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-gray);
  color: var(--color-white);
}

.btn--danger {
  background-color: var(--color-error);
  color: var(--color-white);
}

.btn--danger:hover:not(:disabled) {
  background-color: #c0392b;
}
```

---

## 📝 Paso 6: Formularios de Login y Registro

### 6.1 LoginForm Component (src/components/auth/LoginForm.js)
```javascript
import { validateEmail, validatePassword } from '../../utils/validators';
import { AuthService } from '../../services/authService';

export class LoginForm {
  constructor(onSuccess) {
    this.onSuccess = onSuccess;
    this.errors = {};
  }

  validate(formData) {
    this.errors = {};

    if (!validateEmail(formData.email)) {
      this.errors.email = 'Email inválido';
    }

    if (!validatePassword(formData.password)) {
      this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    return Object.keys(this.errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    // Limpiar errores previos
    this.clearErrors();

    // Validar
    if (!this.validate(formData)) {
      this.showErrors();
      return;
    }

    // Intentar login
    const result = AuthService.login(formData.email, formData.password);

    if (result.success) {
      if (this.onSuccess) {
        this.onSuccess(result.user);
      }
    } else {
      this.errors.general = result.error;
      this.showErrors();
    }
  }

  clearErrors() {
    const errorElements = this.element.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
  }

  showErrors() {
    Object.keys(this.errors).forEach(field => {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = this.errors[field];

      if (field === 'general') {
        this.element.querySelector('form').prepend(errorDiv);
      } else {
        const input = this.element.querySelector(`[name="${field}"]`);
        input.parentNode.appendChild(errorDiv);
      }
    });
  }

  render() {
    const container = document.createElement('div');
    container.className = 'login-form';
    container.innerHTML = `
      <div class="card">
        <h2>Iniciar Sesión</h2>
        <form id="loginForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button type="submit" class="btn btn--primary btn--full">
            Iniciar Sesión
          </button>
        </form>

        <p class="form-footer">
          ¿No tienes cuenta?
          <a href="#register" id="goToRegister">Regístrate aquí</a>
        </p>
      </div>
    `;

    this.element = container;

    // Event listeners
    const form = container.querySelector('form');
    form.addEventListener('submit', this.handleSubmit.bind(this));

    return container;
  }
}
```

---

## 🚀 Checklist de Implementación

### Sprint 1: Setup (1-2 días)
- [ ] Inicializar package.json
- [ ] Instalar Vite
- [ ] Instalar Jest y testing tools
- [ ] Crear estructura de carpetas
- [ ] Configurar ESLint y Prettier
- [ ] Configurar scripts npm
- [ ] Primer commit: "chore: setup proyecto con Vite y Jest"

### Sprint 2: Sistema de Diseño (1 día)
- [ ] Crear variables.css con tokens de diseño
- [ ] Crear reset.css
- [ ] Implementar componente Button
- [ ] Implementar componente Input
- [ ] Implementar componente Card
- [ ] Implementar componente Alert
- [ ] Commit: "feat: agregar sistema de diseño y componentes UI"

### Sprint 3: Validaciones (1 día)
- [ ] Escribir tests para validators
- [ ] Implementar validators
- [ ] Ejecutar tests y verificar coverage
- [ ] Commit: "feat: agregar utilidades de validación con tests"

### Sprint 4: AuthService (2 días)
- [ ] Escribir tests para AuthService
- [ ] Implementar AuthService
- [ ] Implementar storage helpers
- [ ] Ejecutar tests y verificar coverage
- [ ] Commit: "feat: implementar servicio de autenticación"

### Sprint 5: Formularios (2-3 días)
- [ ] Implementar LoginForm
- [ ] Implementar RegisterForm
- [ ] Escribir tests de integración
- [ ] Estilos de formularios
- [ ] Commit: "feat: agregar formularios de login y registro"

### Sprint 6: Routing y Guards (1 día)
- [ ] Implementar router simple
- [ ] Implementar AuthGuard
- [ ] Proteger rutas privadas
- [ ] Tests de routing
- [ ] Commit: "feat: agregar routing y protección de rutas"

### Sprint 7: Testing Final (1 día)
- [ ] Ejecutar suite completa de tests
- [ ] Verificar coverage >80%
- [ ] Arreglar tests fallidos
- [ ] Commit: "test: completar suite de tests"

### Sprint 8: Despliegue (1 día)
- [ ] Configurar build de producción
- [ ] Crear cuenta en Netlify/Vercel
- [ ] Configurar despliegue automático
- [ ] Probar en producción
- [ ] Commit: "chore: configurar despliegue a producción"

---

## 🎓 Recursos de Aprendizaje

### Git
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Testing
- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [TDD Tutorial](https://testdriven.io/)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

### UX
- [Material Design](https://material.io/design)
- [Laws of UX](https://lawsofux.com/)

---

## 🤝 Flujo de Trabajo Git

```bash
# 1. Verificar rama actual
git status

# 2. Crear feature branch para cada tarea
git checkout -b feature/login-form

# 3. Hacer commits frecuentes
git add .
git commit -m "feat: agregar validación de email"

# 4. Push a GitHub
git push -u origin feature/login-form

# 5. Al terminar, merge a branch principal
git checkout claude/quotes-app-login-phase-1p1n9
git merge feature/login-form

# 6. Push final
git push origin claude/quotes-app-login-phase-1p1n9
```

---

**¿Listo para empezar con el Sprint 1?** 🎯
