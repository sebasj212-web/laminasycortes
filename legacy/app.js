// Láminas y Cortes - JavaScript Principal
console.log('🚀 Bienvenido a Láminas y Cortes');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado correctamente');

    // Inicializar funcionalidades
    inicializarNavegacion();
    agregarAnimaciones();
    mostrarMensajeBienvenida();
});

/**
 * Navegación suave entre secciones
 */
function inicializarNavegacion() {
    const enlaces = document.querySelectorAll('nav a');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();

            const destino = this.getAttribute('href');
            const elemento = document.querySelector(destino);

            if (elemento) {
                elemento.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Resaltar enlace activo
                enlaces.forEach(link => link.style.color = 'white');
                this.style.color = '#3498db';

                console.log(`📍 Navegando a: ${destino}`);
            }
        });
    });

    console.log('🔗 Navegación suave activada');
}

/**
 * Agregar animaciones al hacer scroll
 */
function agregarAnimaciones() {
    const secciones = document.querySelectorAll('section');

    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    secciones.forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(20px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(seccion);
    });

    console.log('✨ Animaciones configuradas');
}

/**
 * Mostrar mensaje de bienvenida
 */
function mostrarMensajeBienvenida() {
    const ahora = new Date();
    const hora = ahora.getHours();
    let saludo;

    if (hora >= 5 && hora < 12) {
        saludo = 'Buenos días';
    } else if (hora >= 12 && hora < 19) {
        saludo = 'Buenas tardes';
    } else {
        saludo = 'Buenas noches';
    }

    console.log(`👋 ${saludo}! Gracias por visitar nuestro sitio.`);
    console.log(`🕐 Hora actual: ${ahora.toLocaleTimeString('es-ES')}`);
}

/**
 * Utilidad: Obtener año actual para el footer
 */
function obtenerAñoActual() {
    return new Date().getFullYear();
}

// Actualizar año en el footer si existe
const footer = document.querySelector('footer p');
if (footer) {
    const añoActual = obtenerAñoActual();
    footer.innerHTML = `&copy; ${añoActual} Láminas y Cortes. Todos los derechos reservados.`;
}

console.log('🎯 JavaScript cargado completamente');
