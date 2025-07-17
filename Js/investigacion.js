class AoxlabIDI extends AoxlabWebsite {
    constructor() {
        super();
        this.initIDI();
    }
    initIDI() {
        this.initExpandableServices();
        this.initScrollAnimations();
        this.initParallaxEffects();
        this.initStatCounters();
        this.initSmoothScroll(); // Agregado aquí para asegurar inicialización
        console.log('🧪 AOXLAB I+D+i - Sistema cargado exitosamente');
    }
    /**
     * Inicializa la funcionalidad de servicios expandibles
     */
    initExpandableServices() {
        const expandableCards = document.querySelectorAll('.servicio-card.expandable');
        
        expandableCards.forEach(card => {
            const expandBtn = card.querySelector('.expand-btn');
            const content = card.querySelector('.servicio-content');
            
            if (expandBtn && content) {
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleServiceExpansion(card, content, expandBtn);
                });
                
                // Navegación por teclado
                expandBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleServiceExpansion(card, content, expandBtn);
                    }
                });
            }
        });
    }
    
    /**
     * Maneja la expansión/colapso de servicios
     */
    toggleServiceExpansion(card, content, button) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            this.collapseService(card, content, button);
        } else {
            // Colapsar otros servicios expandidos
            this.collapseAllServices();
            this.expandService(card, content, button);
        }
    }
    
    /**
     * Expande un servicio específico
     */
    expandService(card, content, button) {
        card.classList.add('expanding');
        
        setTimeout(() => {
            card.classList.add('expanded');
            content.classList.add('expanded');
            card.classList.remove('expanding');
            
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-label', 'Colapsar información');
            
            // Scroll suave al contenido expandido
            setTimeout(() => {
                card.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
            
        }, 50);
    }
    
    /**
     * Colapsa un servicio específico
     */
    collapseService(card, content, button) {
        card.classList.remove('expanded');
        content.classList.remove('expanded');
        
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Expandir información');
    }
    
    /**
     * Colapsa todos los servicios expandidos
     */
    collapseAllServices() {
        const expandedCards = document.querySelectorAll('.servicio-card.expanded');
        
        expandedCards.forEach(card => {
            const content = card.querySelector('.servicio-content');
            const button = card.querySelector('.expand-btn');
            
            this.collapseService(card, content, button);
        });
    }
    
    /**
     * Inicializa animaciones de scroll
     */
    initScrollAnimations() {
        // Configurar AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
        
        // Observador para animaciones personalizadas
        this.initIntersectionObserver();
    }
    
    /**
     * Configurar intersection observer para animaciones
     */
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Animaciones específicas por tipo de elemento
                    if (entry.target.classList.contains('sector-icon')) {
                        this.animateSectorIcon(entry.target);
                    }
                    
                    if (entry.target.classList.contains('resultado-card')) {
                        this.animateResultCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos específicos
        const elementsToObserve = document.querySelectorAll(
            '.sector-card, .actividad-card, .alianza-card, .resultado-card'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    /**
     * Anima iconos de sectores
     */
    animateSectorIcon(iconContainer) {
        const icon = iconContainer.querySelector('i');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'rotateY(360deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 600);
            }, 200);
        }
    }
    
    /**
     * Anima tarjetas de resultados
     */
    animateResultCard(card) {
        const icon = card.querySelector('.resultado-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1) rotateZ(360deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 600);
            }, 300);
        }
    }
    
    /**
     * Inicializa efectos parallax
     */
    initParallaxEffects() {
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                
                if (scrolled < window.innerHeight) {
                    heroBackground.style.transform = `translateY(${rate}px)`;
                }
            });
        }
    }
    
    /**
     * Inicializa contadores de estadísticas
     */
    initStatCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
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
    
    /**
     * Anima contadores numéricos
     */
    animateCounter(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 60; // 60 frames para ~1 segundo
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
    
    /**
     * Maneja el redimensionamiento de la ventana
     */
    handleResize() {
        super.handleResize();
        
        // Colapsar servicios en móviles si están expandidos
        if (window.innerWidth <= 768) {
            this.collapseAllServices();
        }
    }
    
    /**
     * Smooth scroll mejorado para anchors
     */
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== CLASE METODOLOGÍA CARRUSEL MEJORADA =====
class MetodologiaCarousel {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 5;
        this.autoPlayInterval = null;
        this.isPaused = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }
    
    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCarousel();
            });
        } else {
            this.setupCarousel();
        }
    }
    
    setupCarousel() {
        // Verificar si los elementos del carrusel existen en la página
        const carouselElement = document.querySelector('.metodologia-carousel');
        if (!carouselElement) {
            console.log('📋 Metodología Carousel: Elementos no encontrados en esta página');
            return;
        }
        
        this.setupEventListeners();
        this.updateProgressBar();
        this.updateNavigation();
        this.updateCarousel();
        this.startAutoPlay();
        
        console.log('🎠 Metodología Carousel: Inicializado correctamente');
    }
    
    setupEventListeners() {
        // Botones de navegación superior
        document.querySelectorAll('.step-nav-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.goToStep(index);
                IDIUtils.trackInteraction('step_navigation', 'metodologia');
            });
        });
        
        // Botones de control del carrusel
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousStep();
                IDIUtils.trackInteraction('prev_step', 'metodologia');
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextStep();
                IDIUtils.trackInteraction('next_step', 'metodologia');
            });
        }
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            const carouselElement = document.querySelector('.metodologia-carousel');
            if (!carouselElement) return;
            
            // Solo activar si el carrusel está visible
            const rect = carouselElement.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousStep();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextStep();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleAutoPlay();
                }
            }
        });
        
        // Soporte para eventos táctiles
        this.setupTouchEvents();
        
        // Pausar auto-play cuando el cursor está sobre el carrusel
        const carousel = document.querySelector('.metodologia-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            carousel.addEventListener('mouseleave', () => {
                if (!this.isPaused) {
                    this.startAutoPlay();
                }
            });
        }
        
        // Controlar auto-play basado en visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (!this.isPaused) {
                this.startAutoPlay();
            }
        });
    }
    
    goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.totalSteps || stepIndex === this.currentStep) {
            return;
        }
        
        this.currentStep = stepIndex;
        this.updateCarousel();
        this.updateNavigation();
        this.updateProgressBar();
        this.resetAutoPlay();
        
        // Mostrar notificación del paso actual
        const stepTitle = this.getCurrentStepTitle();
        if (stepTitle) {
            this.showStepNotification(stepTitle);
        }
    }
    
    nextStep() {
        const nextIndex = (this.currentStep + 1) % this.totalSteps;
        this.goToStep(nextIndex);
    }
    
    previousStep() {
        const prevIndex = (this.currentStep - 1 + this.totalSteps) % this.totalSteps;
        this.goToStep(prevIndex);
    }
    
    updateCarousel() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.step-slide');
        
        if (track) {
            track.style.transform = `translateX(-${this.currentStep * 100}%)`;
        }
        
        slides.forEach((slide, index) => {
            const isActive = index === this.currentStep;
            slide.classList.toggle('active', isActive);
            
            // Mejorar accesibilidad
            slide.setAttribute('aria-hidden', !isActive);
            if (isActive) {
                slide.setAttribute('tabindex', '0');
            } else {
                slide.removeAttribute('tabindex');
            }
        });
    }
    
    updateNavigation() {
        document.querySelectorAll('.step-nav-btn').forEach((btn, index) => {
            const isActive = index === this.currentStep;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });
        
        // Actualizar controles de navegación
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && nextBtn) {
            // Siempre habilitados debido al comportamiento circular
            prevBtn.disabled = false;
            nextBtn.disabled = false;
            
            // Actualizar aria-labels
            prevBtn.setAttribute('aria-label', `Ir al paso ${this.currentStep === 0 ? this.totalSteps : this.currentStep}`);
            nextBtn.setAttribute('aria-label', `Ir al paso ${this.currentStep === this.totalSteps - 1 ? 1 : this.currentStep + 2}`);
        }
    }
    
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progressPercent = ((this.currentStep + 1) / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercent}%`;
            progressFill.setAttribute('aria-valuenow', this.currentStep + 1);
            progressFill.setAttribute('aria-valuemax', this.totalSteps);
        }
    }
    
    setupTouchEvents() {
        const carousel = document.querySelector('.metodologia-carousel');
        if (!carousel) return;
        
        carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.pauseAutoPlay();
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            
            // Reiniciar auto-play después del swipe
            setTimeout(() => {
                if (!this.isPaused) {
                    this.startAutoPlay();
                }
            }, 1000);
        }, { passive: true });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe izquierda - siguiente paso
                this.nextStep();
            } else {
                // Swipe derecha - paso anterior
                this.previousStep();
            }
            
            IDIUtils.trackInteraction('swipe_navigation', 'metodologia');
        }
    }
    
    startAutoPlay() {
        this.pauseAutoPlay(); // Limpiar cualquier intervalo existente
        
        this.autoPlayInterval = setInterval(() => {
            this.nextStep();
        }, 8000); // 8 segundos por paso
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        if (!this.isPaused) {
            this.pauseAutoPlay();
            // Pequeño delay antes de reiniciar para permitir interacciones del usuario
            setTimeout(() => {
                this.startAutoPlay();
            }, 2000);
        }
    }
    
    toggleAutoPlay() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseAutoPlay();
            IDIUtils.showInterestNotification('Auto-play pausado');
        } else {
            this.startAutoPlay();
            IDIUtils.showInterestNotification('Auto-play reanudado');
        }
        
        IDIUtils.trackInteraction('toggle_autoplay', 'metodologia');
    }
    
    getCurrentStepTitle() {
        const currentSlide = document.querySelector(`.step-slide[data-step="${this.currentStep}"]`);
        if (currentSlide) {
            const titleElement = currentSlide.querySelector('h3');
            return titleElement ? titleElement.textContent : null;
        }
        return null;
    }
    
    showStepNotification(stepTitle) {
        // Usar la función de notificación existente de IDIUtils
        IDIUtils.showInterestNotification(`Paso actual: ${stepTitle}`);
    }
    
    // Método público para controlar el carrusel externamente
    goToStepByName(stepName) {
        const stepMap = {
            'solicitar': 0,
            'aprobar': 1,
            'diligenciar': 2,
            'enviar': 3,
            'consultar': 4
        };
        
        const stepIndex = stepMap[stepName.toLowerCase()];
        if (stepIndex !== undefined) {
            this.goToStep(stepIndex);
        }
    }
    
    // Método para obtener información del estado actual
    getCarouselState() {
        return {
            currentStep: this.currentStep,
            totalSteps: this.totalSteps,
            isAutoPlaying: this.autoPlayInterval !== null,
            isPaused: this.isPaused,
            currentStepTitle: this.getCurrentStepTitle()
        };
    }
}

// ===== INICIALIZACIÓN DE COMPONENTES =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componente principal I+D+i
    new AoxlabIDI();
    
    // Inicializar carrusel de metodología
    new MetodologiaCarousel();
    
    console.log('🚀 AOXLAB I+D+i: Todos los componentes inicializados correctamente');
});

// ===== MANEJO DE ERRORES ESPECÍFICOS =====
window.addEventListener('error', (e) => {
    console.error('❌ Error en AOXLAB I+D+i:', e.error);
    
    // Notificar error si es crítico
    if (e.error && e.error.message.includes('AOXLAB')) {
        IDIUtils.showInterestNotification('Error del sistema detectado', 'error');
    }
});

// Manejo de errores de promesas no capturadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promise rechazada en AOXLAB I+D+i:', e.reason);
});

// ===== FUNCIONES DE UTILIDAD PARA I+D+i (MANTENIDAS COMO ESTABAN) =====
const IDIUtils = {
    /**
     * Muestra notificación de interés en servicios
     */
    showInterestNotification(serviceName, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `idi-notification ${type}`;
        
        const icon = type === 'error' ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="${icon}"></i>
                <span>${serviceName}</span>
            </div>
        `;
        
        const backgroundColor = type === 'error' 
            ? 'linear-gradient(135deg, #dc3545, #c82333)' 
            : 'linear-gradient(135deg, var(--idi-primary), var(--idi-secondary))';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    },
    
    /**
     * Tracking de interacciones para analytics
     */
    trackInteraction(action, category = 'IDI') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: window.location.pathname,
                value: 1
            });
        }
        
        console.log(`📊 Track: ${category} - ${action}`);
        
        // También enviar a dataLayer si existe (Google Tag Manager)
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: 'custom_interaction',
                interaction_category: category,
                interaction_action: action,
                page_location: window.location.href
            });
        }
    }
};

// ===== ESTILOS CSS ADICIONALES PARA NOTIFICACIONES (MANTENIDOS) =====
const idiStyles = document.createElement('style');
idiStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .idi-notification {
        font-family: var(--font-primary);
        font-weight: 500;
    }
    
    .idi-notification.error {
        background: linear-gradient(135deg, #dc3545, #c82333) !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
        flex-shrink: 0;
    }
`;

// Solo agregar estilos si no existen
if (!document.querySelector('#idi-styles')) {
    idiStyles.id = 'idi-styles';
    document.head.appendChild(idiStyles);
}

// ===== FUNCIONES GLOBALES PARA COMPATIBILIDAD =====

// Función para expansión de detalles de pasos (mantenida para compatibilidad)
function toggleStepDetails(button) {
    console.log('🔄 Toggle step details solicitado:', button);
    IDIUtils.trackInteraction('toggle_step_details', 'metodologia');
    
    // Funcionalidad adicional si se necesita expansión de detalles
    // Esta función puede ser expandida según necesidades futuras
}

// Exponer funciones útiles globalmente para debugging
window.AoxlabDebug = {
    getCarouselState: () => {
        const carousel = window.metodologiaCarousel;
        return carousel ? carousel.getCarouselState() : null;
    },
    goToStep: (step) => {
        const carousel = window.metodologiaCarousel;
        if (carousel) carousel.goToStep(step);
    },
    toggleAutoPlay: () => {
        const carousel = window.metodologiaCarousel;
        if (carousel) carousel.toggleAutoPlay();
    }
};

