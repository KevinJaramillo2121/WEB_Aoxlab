// Capacitacion.js - Funcionalidades específicas para la página de Capacitación Empresarial

class AoxlabCapacitacion extends AoxlabWebsite {
    constructor() {
        super();
        this.initCapacitacion();
    }
    
    initCapacitacion() {
        this.initExpandableTrainings();
        this.initScrollAnimations();
        this.initParallaxEffects();
        this.initStatCounters();
        this.initTimelineAnimations();
        console.log('🎓 AOXLAB Capacitación Empresarial - Sistema cargado exitosamente');
    }
    
    /**
     * Inicializa la funcionalidad de capacitaciones expandibles
     */
    initExpandableTrainings() {
        const expandableCards = document.querySelectorAll('.capacitacion-card.expandable');
        
        expandableCards.forEach(card => {
            const expandBtn = card.querySelector('.expand-btn');
            const content = card.querySelector('.capacitacion-content');
            
            if (expandBtn && content) {
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTrainingExpansion(card, content, expandBtn);
                });
                
                // Navegación por teclado
                expandBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleTrainingExpansion(card, content, expandBtn);
                    }
                });
            }
        });
    }
    
    /**
     * Maneja la expansión/colapso de capacitaciones
     */
    toggleTrainingExpansion(card, content, button) {
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            this.collapseTraining(card, content, button);
        } else {
            // Colapsar otras capacitaciones expandidas
            this.collapseAllTrainings();
            this.expandTraining(card, content, button);
        }
    }
    
    /**
     * Expande una capacitación específica
     */
    expandTraining(card, content, button) {
        card.classList.add('expanding');
        
        setTimeout(() => {
            card.classList.add('expanded');
            content.classList.add('expanded');
            card.classList.remove('expanding');
            
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-label', 'Colapsar información');
            
            // Tracking de interacción
            this.trackTrainingInteraction('expand', card.querySelector('h3')?.textContent || 'Unknown');
            
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
     * Colapsa una capacitación específica
     */
    collapseTraining(card, content, button) {
        card.classList.remove('expanded');
        content.classList.remove('expanded');
        
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Expandir información');
        
        // Tracking de interacción
        this.trackTrainingInteraction('collapse', card.querySelector('h3')?.textContent || 'Unknown');
    }
    
    /**
     * Colapsa todas las capacitaciones expandidas
     */
    collapseAllTrainings() {
        const expandedCards = document.querySelectorAll('.capacitacion-card.expanded');
        
        expandedCards.forEach(card => {
            const content = card.querySelector('.capacitacion-content');
            const button = card.querySelector('.expand-btn');
            
            this.collapseTraining(card, content, button);
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
                    if (entry.target.classList.contains('modalidad-icon')) {
                        this.animateModalidadIcon(entry.target);
                    }
                    
                    if (entry.target.classList.contains('beneficio-card')) {
                        this.animateBeneficioCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos específicos
        const elementsToObserve = document.querySelectorAll(
            '.capacitacion-card, .modalidad-card, .beneficio-card, .timeline-item'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    /**
     * Anima iconos de modalidades
     */
    animateModalidadIcon(iconContainer) {
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
     * Anima tarjetas de beneficios
     */
    animateBeneficioCard(card) {
        const icon = card.querySelector('.beneficio-icon');
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
     * Inicializa animaciones del timeline
     */
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const icon = entry.target.querySelector('.timeline-icon');
                    if (icon) {
                        setTimeout(() => {
                            icon.style.transform = 'translateX(-50%) scale(1.1)';
                            setTimeout(() => {
                                icon.style.transform = 'translateX(-50%) scale(1)';
                            }, 300);
                        }, 200);
                    }
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }
    
    /**
     * Tracking de interacciones de capacitación
     */
    trackTrainingInteraction(action, trainingName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'Capacitacion',
                event_label: trainingName,
                page_path: window.location.pathname
            });
        }
        console.log(`📊 Track Capacitación: ${action} - ${trainingName}`);
    }
    
    /**
     * Maneja el redimensionamiento de la ventana
     */
    handleResize() {
        super.handleResize();
        
        // Colapsar capacitaciones en móviles si están expandidas
        if (window.innerWidth <= 768) {
            this.collapseAllTrainings();
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
    
    /**
     * Inicializa formularios de interés en capacitaciones
     */
    initInterestForms() {
        const modalidadCards = document.querySelectorAll('.modalidad-card');
        
        modalidadCards.forEach(card => {
            card.addEventListener('click', () => {
                const modalidadName = card.querySelector('h3')?.textContent;
                this.showInterestModal(modalidadName);
            });
        });
    }
    
    /**
     * Muestra modal de interés en capacitación
     */
    showInterestModal(modalidadName) {
        // Implementación del modal de interés
        CapacitacionUtils.showInterestNotification(modalidadName);
        this.trackTrainingInteraction('interest', modalidadName);
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AoxlabCapacitacion();
});

// Manejo de errores específicos para Capacitación
window.addEventListener('error', (e) => {
    console.error('Error en AOXLAB Capacitación:', e.error);
});

// Funciones de utilidad para Capacitación
const CapacitacionUtils = {
    /**
     * Muestra notificación de interés en capacitaciones
     */
    showInterestNotification(trainingName) {
        const notification = document.createElement('div');
        notification.className = 'capacitacion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-graduation-cap"></i>
                <span>Interés registrado en ${trainingName}</span>
                <button class="notification-close" aria-label="Cerrar notificación">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--capacitacion-primary), var(--capacitacion-secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            max-width: 350px;
        `;
        
        document.body.appendChild(notification);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-cerrar después de 4 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 4000);
    },
    
    /**
     * Valida formularios de capacitación
     */
    validateTrainingForm(formData) {
        const errors = [];
        
        if (!formData.empresa || formData.empresa.trim().length < 2) {
            errors.push('El nombre de la empresa es requerido');
        }
        
        if (!formData.email || !this.isValidEmail(formData.email)) {
            errors.push('El email debe ser válido');
        }
        
        if (!formData.capacitacion) {
            errors.push('Debe seleccionar una capacitación');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Genera reporte de interés en capacitaciones
     */
    generateInterestReport() {
        const interestData = JSON.parse(localStorage.getItem('capacitacion_interests') || '[]');
        
        const report = {
            totalInterests: interestData.length,
            topTrainings: this.getTopTrainings(interestData),
            modalityPreferences: this.getModalityStats(interestData),
            generatedAt: new Date().toISOString()
        };
        
        return report;
    },
    
    /**
     * Obtiene las capacitaciones más solicitadas
     */
    getTopTrainings(data) {
        const counts = {};
        data.forEach(item => {
            counts[item.training] = (counts[item.training] || 0) + 1;
        });
        
        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([training, count]) => ({ training, count }));
    },
    
    /**
     * Obtiene estadísticas de modalidades preferidas
     */
    getModalityStats(data) {
        const modalityCounts = {};
        data.forEach(item => {
            if (item.modality) {
                modalityCounts[item.modality] = (modalityCounts[item.modality] || 0) + 1;
            }
        });
        
        return modalityCounts;
    }
};

// Estilos CSS adicionales para notificaciones y efectos
const capacitacionStyles = document.createElement('style');
capacitacionStyles.textContent = `
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
    
    .capacitacion-notification {
        font-family: var(--font-primary);
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i:first-child {
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .notification-close i {
        font-size: 0.9rem;
    }
`;

document.head.appendChild(capacitacionStyles);
