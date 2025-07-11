// Capacitacion.js - VERSIÓN CORREGIDA
class AoxlabCapacitacion {
    constructor() {
        // Asegurar que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        console.log('🎓 Iniciando AOXLAB Capacitación...');
        
        // Dar tiempo para que el CSS se cargue completamente
        setTimeout(() => {
            this.initExpandableTrainings();
            this.initScrollAnimations();
            this.initStatCounters();
            console.log('✅ Sistema de capacitación cargado exitosamente');
        }, 100);
    }
    
    /**
     * FUNCIÓN PRINCIPAL: Inicializa las tarjetas expandibles
     */
    initExpandableTrainings() {
        // Buscar TODAS las tarjetas expandibles
        const expandableCards = document.querySelectorAll('.capacitacion-card.expandable');
        console.log(`📋 Encontradas ${expandableCards.length} tarjetas expandibles`);
        
        if (expandableCards.length === 0) {
            console.warn('⚠️ No se encontraron tarjetas expandibles');
            return;
        }
        
        expandableCards.forEach((card, index) => {
            console.log(`🔧 Configurando tarjeta ${index + 1}`);
            this.setupExpandableCard(card, index);
        });
    }
    
    /**
     * Configurar una tarjeta expandible individual
     */
    setupExpandableCard(card, index) {
        const expandBtn = card.querySelector('.expand-btn');
        const content = card.querySelector('.capacitacion-content');
        const title = card.querySelector('h3')?.textContent || `Tarjeta ${index + 1}`;
        
        // Verificar que todos los elementos existen
        if (!expandBtn) {
            console.error(`❌ No se encontró botón expand en tarjeta: ${title}`);
            return;
        }
        
        if (!content) {
            console.error(`❌ No se encontró contenido expandible en tarjeta: ${title}`);
            return;
        }
        
        console.log(`✅ Elementos encontrados para: ${title}`);
        
        // Configurar estado inicial
        this.initializeCardState(card, content, expandBtn);
        
        // Agregar event listeners
        this.addCardEventListeners(card, expandBtn, content, title);
    }
    
    /**
     * Inicializar estado de la tarjeta
     */
    initializeCardState(card, content, expandBtn) {
        // Asegurar que la tarjeta empiece colapsada
        card.classList.remove('expanded');
        content.classList.remove('expanded');
        content.style.maxHeight = '0px';
        content.style.overflow = 'hidden';
        
        // Configurar botón
        expandBtn.setAttribute('aria-expanded', 'false');
        expandBtn.setAttribute('aria-label', 'Expandir información');
        
        console.log('🔄 Estado inicial configurado');
    }
    
    /**
     * Agregar event listeners a la tarjeta
     */
    addCardEventListeners(card, expandBtn, content, title) {
        // Click en el botón
        expandBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ Click en botón expand: ${title}`);
            this.toggleCardExpansion(card, content, expandBtn, title);
        });
        
        // Navegación por teclado
        expandBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log(`⌨️ Tecla presionada: ${title}`);
                this.toggleCardExpansion(card, content, expandBtn, title);
            }
        });
        
        // Agregar tabindex para accesibilidad
        expandBtn.setAttribute('tabindex', '0');
        
        console.log(`🎯 Event listeners agregados para: ${title}`);
    }
    
    /**
     * Alternar expansión/colapso de tarjeta
     */
    toggleCardExpansion(card, content, button, title) {
        const isExpanded = card.classList.contains('expanded');
        
        console.log(`🔄 Toggling ${title}: ${isExpanded ? 'Colapsar' : 'Expandir'}`);
        
        if (isExpanded) {
            this.collapseCard(card, content, button, title);
        } else {
            // Primero colapsar todas las otras tarjetas
            this.collapseAllCards();
            // Luego expandir esta tarjeta
            this.expandCard(card, content, button, title);
        }
    }
    
    /**
     * Expandir tarjeta específica
     */
    expandCard(card, content, button, title) {
        console.log(`📈 Expandiendo: ${title}`);
        
        // Marcar como expandiendo
        card.classList.add('expanding');
        
        // Calcular altura real del contenido
        content.style.maxHeight = 'none';
        const realHeight = content.scrollHeight;
        content.style.maxHeight = '0px';
        
        console.log(`📏 Altura calculada: ${realHeight}px`);
        
        // Forzar reflow
        content.offsetHeight;
        
        // Aplicar cambios
        setTimeout(() => {
            card.classList.add('expanded');
            content.classList.add('expanded');
            content.style.maxHeight = `${realHeight}px`;
            
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-label', 'Colapsar información');
            
            // Remover clase de expansión después de la animación
            setTimeout(() => {
                card.classList.remove('expanding');
                console.log(`✅ Expansión completada: ${title}`);
                
                // Scroll suave al elemento
                setTimeout(() => {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }, 600);
            
        }, 50);
    }
    
    /**
     * Colapsar tarjeta específica
     */
    collapseCard(card, content, button, title) {
        console.log(`📉 Colapsando: ${title}`);
        
        card.classList.remove('expanded');
        content.classList.remove('expanded');
        content.style.maxHeight = '0px';
        
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Expandir información');
        
        console.log(`✅ Colapso completado: ${title}`);
    }
    
    /**
     * Colapsar todas las tarjetas
     */
    collapseAllCards() {
        const expandedCards = document.querySelectorAll('.capacitacion-card.expanded');
        
        expandedCards.forEach(card => {
            const content = card.querySelector('.capacitacion-content');
            const button = card.querySelector('.expand-btn');
            const title = card.querySelector('h3')?.textContent || 'Tarjeta';
            
            if (content && button) {
                this.collapseCard(card, content, button, title);
            }
        });
        
        console.log(`🔄 ${expandedCards.length} tarjetas colapsadas`);
    }
    
    /**
     * Inicializar animaciones de scroll
     */
    initScrollAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
            console.log('🎬 AOS inicializado');
        }
    }
    
    /**
     * Inicializar contadores de estadísticas
     */
    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length > 0) {
            console.log(`📊 Inicializando ${statNumbers.length} contadores`);
            
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statNumbers.forEach(stat => {
                counterObserver.observe(stat);
            });
        }
    }
    
    /**
     * Animar contadores numéricos
     */
    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60;
        const duration = 1500;
        const stepTime = duration / 60;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= number) {
                element.textContent = number + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }
}

// INICIALIZACIÓN SEGURA
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Cargado - Iniciando Capacitación');
    new AoxlabCapacitacion();
});

// Respaldo para inicialización
if (document.readyState === 'complete') {
    console.log('🚀 DOM ya completo - Iniciando Capacitación');
    new AoxlabCapacitacion();
}

// Manejo de errores
window.addEventListener('error', (e) => {
    console.error('❌ Error en AOXLAB Capacitación:', e.error);
});
