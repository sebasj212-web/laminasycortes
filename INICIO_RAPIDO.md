# 🚀 Inicio Rápido - Fase 1: Login

## ¿Por dónde empezar?

Si eres nuevo en este proyecto o quieres comenzar con la Fase 1, sigue estos pasos:

---

## 📚 Paso 1: Lee la Documentación

### 1. Visión General del Proyecto
👉 **Lee primero**: [README.md](./README.md)
- Entenderás qué es el proyecto
- Conocerás las tecnologías
- Verás el roadmap completo

### 2. Plan de Desarrollo Completo
👉 **Lee segundo**: [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)
- Plan completo de las 5 fases
- Stack tecnológico detallado
- Buenas prácticas a seguir
- Metodología de trabajo

### 3. Guía Detallada Fase 1
👉 **Lee tercero**: [FASE_1_LOGIN.md](./FASE_1_LOGIN.md)
- Arquitectura de la Fase 1
- Código de ejemplo completo
- Tests incluidos
- Checklist de implementación paso a paso

---

## 🎯 Paso 2: Configura tu Entorno

### Requisitos Previos
```bash
# Verificar que tienes instalado:
node --version  # Debería mostrar v14 o superior
npm --version   # Debería mostrar v6 o superior
git --version   # Cualquier versión reciente
```

### Si no tienes Node.js
- Descarga desde: https://nodejs.org/ (LTS recomendado)
- O usa `nvm` (Node Version Manager): https://github.com/nvm-sh/nvm

---

## 🏗️ Paso 3: Sigue el Plan de Implementación

### Sprint 1: Setup del Proyecto (Comenzar aquí)

#### 3.1 Inicializar npm
```bash
npm init -y
```

#### 3.2 Instalar Vite
```bash
npm install -D vite
```

#### 3.3 Instalar herramientas de testing
```bash
npm install -D jest @testing-library/dom @testing-library/jest-dom jest-environment-jsdom
```

#### 3.4 Instalar herramientas de calidad
```bash
npm install -D eslint prettier
```

#### 3.5 Configurar scripts en package.json
Agrega estos scripts en tu `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### 3.6 Crear estructura de carpetas
```bash
mkdir -p src/{components/{auth,ui},services,utils,styles,tests/{auth,utils}}
mkdir public
```

#### 3.7 Configurar Vite
Crea `vite.config.js`:
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  }
});
```

#### 3.8 Configurar Jest
Crea `jest.config.js`:
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
  ]
};
```

#### 3.9 Crear archivo de setup de tests
Crea `src/tests/setup.js`:
```javascript
import '@testing-library/jest-dom';
```

#### 3.10 Actualizar .gitignore
Agrega al `.gitignore`:
```
node_modules/
dist/
coverage/
.env
*.log
```

#### 3.11 Hacer primer commit
```bash
git add .
git commit -m "chore: configurar proyecto con Vite y Jest"
git push -u origin claude/quotes-app-login-phase-1p1n9
```

---

## ✅ Verificación del Setup

Ejecuta estos comandos para verificar que todo está bien:

```bash
# Debe listar los scripts configurados
npm run

# Debe iniciar el servidor de desarrollo
npm run dev

# En otra terminal, debe ejecutar los tests (sin errores por ahora)
npm test
```

---

## 📖 Próximos Pasos

Una vez completado el Sprint 1, continúa con:

1. **Sprint 2**: Sistema de Diseño
   - Ver sección "Paso 2: Sistema de Diseño" en [FASE_1_LOGIN.md](./FASE_1_LOGIN.md)

2. **Sprint 3**: Validaciones
   - Implementar TDD con validators
   - Ver ejemplos completos en FASE_1_LOGIN.md

3. **Sprint 4**: AuthService
   - Servicio de autenticación completo
   - Código incluido en FASE_1_LOGIN.md

4. **Sprint 5**: Formularios
   - LoginForm y RegisterForm
   - Ejemplos completos disponibles

5. **Sprint 6**: Routing
   - Protección de rutas
   - AuthGuard

6. **Sprint 7**: Testing Final
   - Cobertura >80%

7. **Sprint 8**: Despliegue
   - Netlify o Vercel

---

## 🆘 ¿Necesitas Ayuda?

### Recursos de Aprendizaje

#### Git y GitHub
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

#### JavaScript Moderno
- [JavaScript.info](https://javascript.info/)
- [MDN Web Docs](https://developer.mozilla.org/es/docs/Web/JavaScript)

#### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)

#### Vite
- [Vite Guide](https://vitejs.dev/guide/)

### Consejos Importantes

1. **Lee todo antes de codear**: No te saltes la documentación
2. **Sigue el orden**: Los sprints están diseñados secuencialmente
3. **Haz commits frecuentes**: Cada funcionalidad pequeña merece un commit
4. **Escribe tests primero**: TDD te ayudará a escribir mejor código
5. **Pregunta si tienes dudas**: Es mejor preguntar que asumir

---

## 🎓 Aprendizaje por Fase

Cada sprint te enseñará algo nuevo:

- **Sprint 1**: Tooling moderno (Vite, Jest, npm)
- **Sprint 2**: CSS moderno y diseño de componentes
- **Sprint 3**: TDD (Test-Driven Development)
- **Sprint 4**: Arquitectura de servicios
- **Sprint 5**: Formularios y validaciones
- **Sprint 6**: Routing y guards
- **Sprint 7**: Testing avanzado
- **Sprint 8**: CI/CD y despliegue

---

## 📊 Progreso Sugerido

### Semana 1
- ✅ Sprint 1: Setup
- ✅ Sprint 2: Sistema de Diseño
- ✅ Sprint 3: Validaciones

### Semana 2
- ✅ Sprint 4: AuthService
- ✅ Sprint 5: Formularios

### Semana 3
- ✅ Sprint 6: Routing
- ✅ Sprint 7: Testing Final
- ✅ Sprint 8: Despliegue

---

## 🎯 Objetivo Final de Fase 1

Al terminar, tendrás:

- ✅ Sistema de login funcional
- ✅ Formularios validados
- ✅ Sesión persistente
- ✅ Tests al 100% (>80% coverage)
- ✅ Código en producción
- ✅ Experiencia en:
  - Git flow profesional
  - TDD
  - Tooling moderno
  - Despliegue
  - Buenas prácticas

---

**¡Estás listo para comenzar! 🚀**

**Siguiente paso**: Ejecuta el Sprint 1 completo y haz tu primer commit.
