// IDI.js - Funcionalidades específicas para la página I+D+i

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

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AoxlabIDI();
});

// Manejo de errores específicos para I+D+i
window.addEventListener('error', (e) => {
    console.error('Error en AOXLAB I+D+i:', e.error);
});

// Funciones de utilidad para I+D+i
const IDIUtils = {
    /**
     * Muestra notificación de interés en servicios
     */
    showInterestNotification(serviceName) {
        const notification = document.createElement('div');
        notification.className = 'idi-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Interés registrado en ${serviceName}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--idi-primary), var(--idi-secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
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
                event_label: window.location.pathname
            });
        }
        console.log(`📊 Track: ${category} - ${action}`);
    }
};

// Estilos CSS adicionales para notificaciones
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;

document.head.appendChild(idiStyles);
