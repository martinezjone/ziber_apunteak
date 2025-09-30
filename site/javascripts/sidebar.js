// Función para inicializar el comportamiento del menú lateral
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los títulos de menú colapsables
    const menuTitles = document.querySelectorAll('.md-nav--primary .md-nav__item--nested > .md-nav > .md-nav__title');
    
    // Función para alternar la visibilidad de un menú
    function toggleMenu(menuTitle) {
        const parentNav = menuTitle.parentElement;
        const isExpanded = parentNav.getAttribute('data-md-toggle') === 'true';
        parentNav.setAttribute('data-md-toggle', !isExpanded);
        
        // Si el menú se está cerrando, cerrar también los submenús
        if (isExpanded) {
            const subMenus = parentNav.querySelectorAll('.md-nav[data-md-toggle="true"]');
            subMenus.forEach(subMenu => {
                subMenu.setAttribute('data-md-toggle', 'false');
            });
        }
    }
    
    // Agregar manejador de eventos a cada título
    menuTitles.forEach(title => {
        // Verificar si el título tiene un enlace que no sea solo '#'
        const link = title.querySelector('a');
        
        // Si el enlace es '#' o no hay enlace, hacer que el título sea clickeable
        if (!link || link.getAttribute('href') === '#') {
            title.style.cursor = 'pointer';
            
            // Agregar manejador de clic
            title.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(this);
            });
        } else {
            // Si hay un enlace válido, agregar un manejador al icono de flecha
            const arrow = document.createElement('span');
            arrow.className = 'nav-arrow';
            arrow.innerHTML = '▶';
            arrow.style.cssText = 'float: right; margin-left: 0.5em; transition: transform 0.2s;';
            title.appendChild(arrow);
            
            // Manejador para el clic en la flecha
            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(title);
            });
        }
    });
    
    // Función para expandir el menú activo y sus padres
    function expandActiveMenu() {
        const activeMenu = document.querySelector('.md-nav--primary .md-nav__item--active');
        if (activeMenu) {
            // Encontrar y expandir todos los padres del menú activo
            let parent = activeMenu.closest('.md-nav__item--nested');
            while (parent) {
                const nav = parent.querySelector('> .md-nav');
                if (nav) {
                    nav.setAttribute('data-md-toggle', 'true');
                }
                parent = parent.parentElement.closest('.md-nav__item--nested');
            }
        }
    }
    
    // Expandir el menú activo después de un pequeño retraso para asegurar que el DOM esté listo
    setTimeout(expandActiveMenu, 100);
});
