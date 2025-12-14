# 🔧 Láminas y Cortes - Sistema de Cotizaciones

Aplicación web completa para **Láminas y Cortes** - Sistema de gestión de cotizaciones, productos y clientes.

## 📋 Descripción

Este proyecto es una aplicación web moderna en desarrollo que incluirá:
- Sistema de autenticación de usuarios
- Gestión de productos y catálogo
- Generación de cotizaciones
- Dashboard de administración
- Reportes y análisis

**Estado actual**: 🚧 En desarrollo - Fase 1: Sistema de Login

## ✨ Características (Planificadas)

### Fase 1: Autenticación ✅ (En Desarrollo)
- 🔐 Login y registro de usuarios
- 🔒 Protección de rutas
- 💾 Persistencia de sesión
- ✅ Validaciones de formularios

### Fase 2: Gestión de Usuarios 📅
- 👤 Perfiles de usuario
- 🔑 Sistema de roles (Admin, Vendedor, Cliente)
- 🔐 Autenticación JWT con backend

### Fase 3: Catálogo de Productos 📅
- 📦 CRUD de productos
- 🏷️ Categorías y filtros
- 🔍 Búsqueda en tiempo real
- 🖼️ Gestión de imágenes

### Fase 4: Sistema de Cotizaciones 📅
- 📝 Crear cotizaciones
- 💰 Cálculos automáticos
- 📄 Generación de PDFs
- 📧 Envío por email

### Fase 5: Dashboard y Reportes 📅
- 📊 Métricas y estadísticas
- 📈 Gráficos interactivos
- 📥 Exportación de datos

## 🚀 Tecnologías

### Frontend (Actual)
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript (ES6+)**: Funcionalidad interactiva

### Stack Planificado - Fase 1
- **Vite**: Build tool moderno
- **Jest**: Testing framework
- **ESLint + Prettier**: Calidad de código
- **LocalStorage**: Persistencia temporal

### Stack Futuro (Fases 2-5)
- **React**: UI framework
- **Node.js + Express**: Backend
- **PostgreSQL/MongoDB**: Base de datos
- **JWT**: Autenticación
- **Cloudinary**: Gestión de imágenes

## 📁 Estructura del Proyecto

### Estructura Actual (Sitio Estático)
```
laminasycortes/
├── index.html           # Página principal (legacy)
├── styles.css           # Estilos CSS (legacy)
├── app.js               # Lógica JavaScript (legacy)
├── README.md            # Este archivo
├── PLAN_DESARROLLO.md   # 📋 Plan completo por fases
└── FASE_1_LOGIN.md      # 📘 Guía detallada Fase 1
```

### Estructura Planificada (Fase 1)
```
laminasycortes/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   ├── styles/          # Estilos CSS
│   └── tests/           # Tests
├── public/
├── dist/                # Build output
├── package.json
├── vite.config.js
└── jest.config.js
```

## 🛠️ Instalación y Uso

### Versión Actual (Sitio Estático)

```bash
# Clonar repositorio
git clone https://github.com/sebasj212-web/laminasycortes.git
cd laminasycortes

# Opción 1: Abrir index.html directamente en el navegador

# Opción 2: Servidor local
python -m http.server 8000
# Abre: http://localhost:8000
```

### Fase 1 (Próximamente)

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Tests
npm test

# Build producción
npm run build
```

## 📚 Documentación del Proyecto

### 🎯 ¿Nuevo en el proyecto? ¡Empieza aquí!
👉 **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Guía paso a paso para comenzar

### 📖 Documentación Completa
- **[PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)**: Plan completo de desarrollo por fases
- **[FASE_1_LOGIN.md](./FASE_1_LOGIN.md)**: Guía detallada de implementación Fase 1

## 🎯 Roadmap

- [x] Sitio web estático inicial
- [x] Secciones básicas (Inicio, Productos, Servicios, Contacto)
- [x] Plan de desarrollo por fases
- [ ] **Fase 1**: Sistema de Login (EN DESARROLLO)
- [ ] Fase 2: Gestión de Usuarios
- [ ] Fase 3: Catálogo de Productos
- [ ] Fase 4: Sistema de Cotizaciones
- [ ] Fase 5: Dashboard y Reportes

## 🤝 Desarrollo

Este proyecto es desarrollado con fines de aprendizaje e implementación profesional:

- **Desarrollador**: @sebasj212-web
- **Metodología**: Desarrollo iterativo por fases
- **Enfoque**: Aprendizaje de buenas prácticas, testing, y despliegue
- **Asistencia técnica**: Claude Code

## 🔄 Flujo de Trabajo Git

Utilizamos **Feature Branch Workflow** con commits convencionales:

```bash
# Crear feature branch
git checkout -b feature/login-form

# Commits semánticos
git commit -m "feat: agregar formulario de login"
git commit -m "test: agregar tests de validación"
git commit -m "fix: corregir validación de email"

# Push
git push -u origin feature/login-form

# Merge a branch principal
git checkout claude/quotes-app-login-phase-1p1n9
git merge feature/login-form
```

### Tipos de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `test:` Agregar o modificar tests
- `refactor:` Refactorización de código
- `docs:` Documentación
- `chore:` Tareas de mantenimiento

## 📝 Commits Principales

- `620011e` - Estructura HTML inicial
- `bc144ea` - Estilos CSS para el sitio
- `4a0c8b7` - Lógica JavaScript para el sitio

## 📄 Licencia

© 2025 Láminas y Cortes. Todos los derechos reservados.

## 📧 Contacto

Para más información, visita nuestro sitio web o contáctanos directamente.

---

**Desarrollado con ❤️ para Láminas y Cortes**
