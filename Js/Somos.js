// somos.js - Funcionalidades específicas para la página Somos
// Este es el apartado de somos
// Es importante recordar que en este y en todos los apartados se debe comentar todo con el fin de que su posterior actualización sea más sencilla además que la legibilidad de dichos apartados también se simplifica

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Animación de números en estadísticas del hero
    animateNumbers();
    
    // Observador para la línea de tiempo
    observeTimelineItems();
    
    // Efectos adicionales para las tarjetas del equipo
    enhanceTeamCards();
    
    // Inicializar funcionalidad expandible de timeline
    initializeExpandableTimeline();
    
    // Nueva funcionalidad para valores con expansión horizontal - MODIFICADA
    initializeDynamicValores();
    
    // Observador para valores dinámicos
    observeDynamicValores();
    
    // Animaciones de certificaciones
    animateCertifications();
    
    // Añadir indicadores visuales para mejor UX
    addVisualCues();
});

/**
 * Animación de números en estadísticas del hero
 */
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.somos-hero .stat-number');
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            }
        });
    });

    statNumbers.forEach(number => observer.observe(number));
}

/**
 * Inicializa la funcionalidad de timeline expandible
 * Maneja clicks en headers y botones de control
 */
function initializeExpandableTimeline() {
    const timelineHeaders = document.querySelectorAll('.timeline-header');
    const expandAllBtn = document.querySelector('[data-action="expand-all"]');
    const collapseAllBtn = document.querySelector('[data-action="collapse-all"]');
    
    // Añadir event listeners a cada header
    timelineHeaders.forEach(header => {
        header.addEventListener('click', handleTimelineToggle);
        header.addEventListener('keydown', handleKeyboardNavigation);
    });
    
    // Botones de control global
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => toggleAllTimelineItems(true));
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => toggleAllTimelineItems(false));
    }
}

/**
 * Maneja el toggle de items individuales de timeline
 * @param {Event} event - Evento de click
 */
function handleTimelineToggle(event) {
    event.preventDefault();
    
    const header = event.currentTarget;
    const body = header.nextElementSibling;
    const expandBtn = header.querySelector('.expand-btn i');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    // Añadir clase de animación
    const timelineItem = header.closest('.timeline-item');
    timelineItem.classList.add('animating');
    
    if (isExpanded) {
        // Colapsar
        collapseTimelineItem(header, body, expandBtn);
    } else {
        // Expandir
        expandTimelineItem(header, body, expandBtn);
    }
    
    // Remover clase de animación después de la transición
    setTimeout(() => {
        timelineItem.classList.remove('animating');
    }, 600);
    
    // Smooth scroll al item si está expandiendo
    if (!isExpanded) {
        setTimeout(() => {
            header.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
}

/**
 * Expande un item de timeline
 * @param {Element} header - Header del item
 * @param {Element} body - Cuerpo del item
 * @param {Element} expandBtn - Botón de expansión
 */
function expandTimelineItem(header, body, expandBtn) {
    header.setAttribute('aria-expanded', 'true');
    body.setAttribute('aria-hidden', 'false');
    body.classList.add('expanded');
    
    // Calcular altura real del contenido
    const scrollHeight = body.scrollHeight;
    body.style.maxHeight = scrollHeight + 'px';
    
    // Animar el icono
    if (expandBtn) {
        expandBtn.style.transform = 'rotate(180deg)';
    }
    
    // Añadir efecto de highlight temporal
    const card = header.closest('.timeline-card');
    card.style.boxShadow = '0 20px 60px rgba(43, 161, 212, 0.2)';
    
    setTimeout(() => {
        card.style.boxShadow = '';
    }, 1000);
}

/**
 * Colapsa un item de timeline
 * @param {Element} header - Header del item
 * @param {Element} body - Cuerpo del item
 * @param {Element} expandBtn - Botón de expansión
 */
function collapseTimelineItem(header, body, expandBtn) {
    header.setAttribute('aria-expanded', 'false');
    body.setAttribute('aria-hidden', 'true');
    body.classList.remove('expanded');
    body.style.maxHeight = '0px';
    
    // Animar el icono
    if (expandBtn) {
        expandBtn.style.transform = 'rotate(0deg)';
    }
}

/**
 * Expande o colapsa todos los items
 * @param {boolean} expand - true para expandir, false para colapsar
 */
function toggleAllTimelineItems(expand) {
    const timelineHeaders = document.querySelectorAll('.timeline-header');
    
    timelineHeaders.forEach((header, index) => {
        const body = header.nextElementSibling;
        const expandBtn = header.querySelector('.expand-btn i');
        const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';
        
        // Solo procesar si el estado actual es diferente al deseado
        if (expand && !isCurrentlyExpanded) {
            setTimeout(() => {
                expandTimelineItem(header, body, expandBtn);
            }, index * 100); // Stagger animation
        } else if (!expand && isCurrentlyExpanded) {
            setTimeout(() => {
                collapseTimelineItem(header, body, expandBtn);
            }, index * 50); // Faster collapse
        }
    });
    
    // Mostrar feedback visual en los botones
    const activeBtn = expand ? 
        document.querySelector('[data-action="expand-all"]') : 
        document.querySelector('[data-action="collapse-all"]');
        
    if (activeBtn) {
        activeBtn.style.background = 'var(--success-color)';
        setTimeout(() => {
            activeBtn.style.background = '';
        }, 1000);
    }
}

/**
 * Maneja navegación por teclado para accesibilidad
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyboardNavigation(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTimelineToggle(event);
    }
}

/**
 * Observador mejorado para items de timeline
 * Incluye lógica para items expandibles
 */
function observeTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item.expandable');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const marker = entry.target.querySelector('.timeline-marker');
                const card = entry.target.querySelector('.timeline-card');
                
                // Animación del marcador
                setTimeout(() => {
                    if (marker) {
                        marker.style.transform = 'translateX(-50%) scale(1.1)';
                        setTimeout(() => {
                            marker.style.transform = 'translateX(-50%) scale(1)';
                        }, 200);
                    }
                }, 300);
                
                // Efecto de entrada en la card
                if (card) {
                    card.style.transform = 'translateY(0)';
                    card.style.opacity = '1';
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });
    
    timelineItems.forEach(item => {
        // Preparar estado inicial para animación
        const card = item.querySelector('.timeline-card');
        if (card) {
            card.style.transform = 'translateY(30px)';
            card.style.opacity = '0';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        observer.observe(item);
    });
}

/**
 * Sistema avanzado de valores con expansión horizontal y agrupamiento
 * MODIFICADO: Incluye cierre automático y cierre por clic
 */
function initializeDynamicValores() {
    const valoresContainer = document.getElementById('valores-container');
    const valorCards = document.querySelectorAll('.valor-card-dynamic');
    const resetBtn = document.querySelector('[data-action="reset-all-values"]');
    const tourBtn = document.querySelector('[data-action="tour-values"]');
    
    let currentExpanded = null;
    let isAnimating = false;
    let tourInterval = null;
    
    // Configurar event listeners para cada tarjeta - MODIFICADO
    valorCards.forEach(card => {
        const expandBtn = card.querySelector('.expand-valor-btn');
        const closeBtn = card.querySelector('.close-valor-btn');
        const compactView = card.querySelector('.valor-compact-view');
        const expandedView = card.querySelector('.valor-expanded-view'); // NUEVO
        
        // Click en botón expandir o en la vista compacta
        [expandBtn, compactView].forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isAnimating) {
                    expandValor(card);
                }
            });
        });
        
        // Click en botón cerrar
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isAnimating) {
                collapseValor(card);
            }
        });
        
        // NUEVO: Click en cualquier parte de la vista expandida para cerrar
        expandedView.addEventListener('click', (e) => {
            // Solo cerrar si el click es directamente en la vista expandida
            // o en elementos que no sean interactivos
            const clickedElement = e.target;
            const isInteractiveElement = clickedElement.closest('button') || 
                                       clickedElement.closest('a') || 
                                       clickedElement.closest('.close-valor-btn');
            
            if (!isInteractiveElement && card.classList.contains('expanded') && !isAnimating) {
                e.stopPropagation();
                collapseValor(card);
            }
        });
        
        // NUEVO: Event listener adicional para cerrar con clic en el contenido expandido
        const expandedContent = card.querySelector('.expanded-content');
        if (expandedContent) {
            expandedContent.addEventListener('click', (e) => {
                // Verificar que no sea un click en elementos interactivos
                const clickedElement = e.target;
                const isScrollbar = e.offsetX > expandedContent.clientWidth;
                
                if (!isScrollbar && 
                    !clickedElement.closest('button') && 
                    !clickedElement.closest('a') && 
                    card.classList.contains('expanded') && 
                    !isAnimating) {
                    e.stopPropagation();
                    collapseValor(card);
                }
            });
        }
        
        // Navegación por teclado (sin cambios)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!card.classList.contains('expanded') && !isAnimating) {
                    expandValor(card);
                }
            }
            if (e.key === 'Escape' && card.classList.contains('expanded')) {
                e.preventDefault();
                collapseValor(card);
            }
        });
        
        // Hacer las tarjetas focusables
        card.setAttribute('tabindex', '0');
    });
    
    // Botones de control
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllValores);
    }
    
    if (tourBtn) {
        tourBtn.addEventListener('click', startValoresTour);
    }
    
    /**
     * Expande un valor específico - MODIFICADO
     */
    function expandValor(targetCard) {
        if (isAnimating || targetCard.classList.contains('expanded')) return;
        
        isAnimating = true;
        
        // NUEVO: Cerrar todas las demás tarjetas expandidas automáticamente
        valorCards.forEach(card => {
            if (card !== targetCard && card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                card.classList.remove('minimized'); // También removemos el estado minimizado
            }
        });
        
        // Si hay otra tarjeta expandida, colapsarla primero
        if (currentExpanded && currentExpanded !== targetCard) {
            collapseValor(currentExpanded, false);
        }
        
        // Añadir clase de animación
        targetCard.classList.add('expanding');
        
        // Minimizar todas las demás tarjetas
        valorCards.forEach(card => {
            if (card !== targetCard) {
                card.classList.add('minimized', 'minimizing');
            }
        });
        
        // Cambiar el layout del grid
        valoresContainer.classList.add('has-expanded');
        
        setTimeout(() => {
            // Expandir la tarjeta objetivo
            targetCard.classList.add('expanded');
            targetCard.classList.remove('expanding');
            
            // Remover clases de animación
            valorCards.forEach(card => {
                card.classList.remove('minimizing');
            });
            
            currentExpanded = targetCard;
            isAnimating = false;
            
            // Scroll suave a la tarjeta expandida
            setTimeout(() => {
                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 200);
            
            // Animar elementos internos
            animateExpandedContent(targetCard);
            
        }, 300);
    }
    
    /**
     * Colapsa un valor específico - MEJORADO
     */
    function collapseValor(targetCard, resetLayout = true) {
        if (isAnimating || !targetCard.classList.contains('expanded')) return;
        
        isAnimating = true;
        
        // Colapsar la tarjeta
        targetCard.classList.remove('expanded');
        
        if (resetLayout) {
            // Restaurar todas las tarjetas gradualmente
            valorCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.remove('minimized');
                }, index * 50); // Animación escalonada
            });
            
            // Restaurar el layout del grid
            setTimeout(() => {
                valoresContainer.classList.remove('has-expanded');
            }, 200);
            
            currentExpanded = null;
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    /**
     * Resetea todas las tarjetas al estado normal
     */
    function resetAllValores() {
        if (isAnimating) return;
        
        stopValoresTour(); // Detener tour si está activo
        
        valorCards.forEach(card => {
            card.classList.remove('expanded', 'minimized');
        });
        
        valoresContainer.classList.remove('has-expanded');
        currentExpanded = null;
        
        // Feedback visual
        resetBtn.style.background = 'var(--success-color)';
        resetBtn.innerHTML = '<i class="fas fa-check"></i> Vista Normal';
        
        setTimeout(() => {
            resetBtn.style.background = '';
            resetBtn.innerHTML = '<i class="fas fa-refresh"></i> Vista Normal';
        }, 1500);
    }
    
    /**
     * Inicia un tour automático por todos los valores
     */
    function startValoresTour() {
        if (isAnimating) return;
        
        stopValoresTour(); // Detener tour anterior si existe
        
        let currentIndex = 0;
        const tourCards = Array.from(valorCards);
        
        // Cambiar apariencia del botón
        tourBtn.style.background = 'var(--accent-color)';
        tourBtn.innerHTML = '<i class="fas fa-stop"></i> Detener Tour';
        tourBtn.setAttribute('data-action', 'stop-tour');
        
        function showNextValor() {
            if (currentIndex < tourCards.length) {
                expandValor(tourCards[currentIndex]);
                currentIndex++;
                
                // Programar el siguiente valor
                tourInterval = setTimeout(() => {
                    if (currentIndex < tourCards.length) {
                        showNextValor();
                    } else {
                        // Tour completado
                        setTimeout(() => {
                            resetAllValores();
                            stopValoresTour();
                        }, 3000);
                    }
                }, 4000); // Mostrar cada valor por 4 segundos
            }
        }
        
        showNextValor();
        
        // Cambiar el event listener del botón
        tourBtn.removeEventListener('click', startValoresTour);
        tourBtn.addEventListener('click', stopValoresTour);
    }
    
    /**
     * Detiene el tour automático
     */
    function stopValoresTour() {
        if (tourInterval) {
            clearTimeout(tourInterval);
            tourInterval = null;
        }
        
        // Restaurar apariencia del botón
        tourBtn.style.background = '';
        tourBtn.innerHTML = '<i class="fas fa-play"></i> Tour Automático';
        tourBtn.setAttribute('data-action', 'tour-values');
        
        // Restaurar event listener
        tourBtn.removeEventListener('click', stopValoresTour);
        tourBtn.addEventListener('click', startValoresTour);
    }
    
    /**
     * Anima el contenido interno cuando se expande
     */
    function animateExpandedContent(card) {
        const sections = card.querySelectorAll('.valor-section');
        const aplicacionItems = card.querySelectorAll('.aplicacion-item');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.4s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        aplicacionItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 800 + (index * 100));
        });
    }
    
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth <= 768 && currentExpanded) {
            // En móvil, restaurar vista normal para mejor UX
            resetAllValores();
        }
    }, 250));
    
    // Función utilitaria de debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/**
 * Añade indicadores visuales para mejorar la UX - NUEVA FUNCIÓN
 */
function addVisualCues() {
    const valorCards = document.querySelectorAll('.valor-card-dynamic');
    
    valorCards.forEach(card => {
        const expandedView = card.querySelector('.valor-expanded-view');
        
        // Mostrar tooltip informativo la primera vez
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('expanded') && !this.hasAttribute('data-tooltip-shown')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'close-tooltip';
                tooltip.textContent = 'Haz clic en cualquier lugar para cerrar';
                tooltip.style.cssText = `
                    position: absolute;
                    top: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                `;
                
                expandedView.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 100);
                
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 300);
                }, 2000);
                
                this.setAttribute('data-tooltip-shown', 'true');
            }
        });
    });
}

/**
 * Observador mejorado para valores dinámicos
 */
function observeDynamicValores() {
    const valorCards = document.querySelectorAll('.valor-card-dynamic');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const icon = entry.target.querySelector('.valor-icon');
                if (icon) {
                    setTimeout(() => {
                        icon.style.transform = 'scale(1.1) rotateY(360deg)';
                        setTimeout(() => {
                            icon.style.transform = 'scale(1)';
                        }, 600);
                    }, index * 100);
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-30px'
    });
    
    valorCards.forEach(card => {
        observer.observe(card);
    });
}

/**
 * Efectos adicionales para las tarjetas del equipo
 */
function enhanceTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const socialLinks = this.querySelectorAll('.team-social a');
            socialLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateY(0) scale(1.1)';
                    setTimeout(() => {
                        link.style.transform = 'translateY(0) scale(1)';
                    }, 150);
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const socialLinks = this.querySelectorAll('.team-social a');
            socialLinks.forEach(link => {
                link.style.transform = 'translateY(20px) scale(1)';
            });
        });
    });
}

/**
 * Animación de entrada para certificaciones
 */
function animateCertifications() {
    const certCards = document.querySelectorAll('.cert-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) rotateX(0)';
                    entry.target.style.opacity = '1';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    certCards.forEach(card => {
        card.style.transform = 'translateY(50px) rotateX(15deg)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

/**
 * Verifica si hay items expandidos y actualiza el estado de los botones
 */
function updateControlButtons() {
    const headers = document.querySelectorAll('.timeline-header');
    const expandedCount = Array.from(headers).filter(h => 
        h.getAttribute('aria-expanded') === 'true'
    ).length;
    
    const expandAllBtn = document.querySelector('[data-action="expand-all"]');
    const collapseAllBtn = document.querySelector('[data-action="collapse-all"]');
    
    if (expandAllBtn && collapseAllBtn) {
        expandAllBtn.disabled = expandedCount === headers.length;
        collapseAllBtn.disabled = expandedCount === 0;
    }
}

/**
 * Auto-scroll mejorado para items expandidos
 */
function smoothScrollToExpanded() {
    const expandedItems = document.querySelectorAll('.timeline-header[aria-expanded="true"]');
    if (expandedItems.length > 0) {
        const lastExpanded = expandedItems[expandedItems.length - 1];
        lastExpanded.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.somos-hero .hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
/**
 * Inicializar sistema de certificaciones mejorado
 */
function initializeCertificationsSystem() {
    initializeFilters();
    initializeViewToggle();
    initializeCertModal();
    observeCertifications();
}

/**
 * Sistema de filtros para certificaciones
 */
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card-enhanced');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar certificaciones con animación
            certCards.forEach((card, index) => {
                setTimeout(() => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('filtered-out');
                    } else {
                        card.classList.add('filtered-out');
                    }
                }, index * 50);
            });
            
            // Feedback visual
            btn.style.transform = 'scale(1.1)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        });
    });
}

/**
 * Toggle entre vista grid y lista
 */
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const certContainer = document.getElementById('cert-container');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            
            // Actualizar botones activos
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Cambiar vista
            if (view === 'list') {
                certContainer.classList.add('list-view');
            } else {
                certContainer.classList.remove('list-view');
            }
            
            // Animación de transición
            certContainer.style.opacity = '0.7';
            setTimeout(() => {
                certContainer.style.opacity = '1';
            }, 300);
        });
    });
}

/**
 * Sistema de modal para detalles de certificaciones
 */
function initializeCertModal() {
    const modal = document.getElementById('cert-modal');
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCertModal();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCertModal();
        }
    });
}

/**
 * Mostrar detalles de certificación en modal
 */
function viewCertDetails(certType) {
    const modal = document.getElementById('cert-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const certDetails = {
        iso17025: {
            title: 'ISO/IEC 17025:2017 - Acreditación ONAC',
            content: `
                <div class="modal-cert-info">
                    <div class="modal-cert-header">
                        <img src="img/Simbolo_Acreditado_ONAC_Horizontal_RGB.jpg" alt="ISO 17025" style="height: 100px; margin-bottom: 20px;">
                        <h4>Competencia de Laboratorios de Ensayo y Calibración</h4>
                    </div>
                    
                    <div class="modal-details">
                        <h5><i class="fas fa-info-circle"></i> Descripción</h5>
                        <p>Esta acreditación certifica que AOXLAB cumple con los requisitos técnicos y de gestión necesarios para demostrar competencia técnica en la realización de ensayos específicos.</p>
                        
                        <h5><i class="fas fa-list"></i> Alcance Acreditado</h5>
                        <ul>
                            <li>Análisis microbiológicos de alimentos y aguas</li>
                            <li>Análisis fisicoquímicos de matrices alimentarias</li>
                            <li>Determinación de parámetros de calidad en cosméticos</li>
                            <li>Análisis de cannabis medicinal</li>
                        </ul>
                        
                        <h5><i class="fas fa-certificate"></i> Información de la Acreditación</h5>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Código:</strong> 20-LAB-011
                            </div>
                            <div class="info-item">
                                <strong>Organismo:</strong> ONAC (Organismo Nacional de Acreditación)
                            </div>
                            <div class="info-item">
                                <strong>Vigencia:</strong> Permanente con renovaciones periódicas
                            </div>
                            <div class="info-item">
                                <strong>Reconocimiento:</strong> Internacional bajo ILAC
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        salud: {
            title: 'Certificación Seccional de Salud',
            content: `
                <div class="modal-cert-info">
                    <div class="modal-cert-header">
                        <h4>Autorización Secretaría Seccional de Salud de Antioquia</h4>
                    </div>
                    
                    <div class="modal-details">
                        <h5><i class="fas fa-info-circle"></i> Descripción</h5>
                        <p>Certificación que autoriza a AOXLAB para operar como laboratorio de análisis clínicos y ambientales en el departamento de Antioquia.</p>
                        
                        <h5><i class="fas fa-list"></i> Servicios Autorizados</h5>
                        <ul>
                            <li>Análisis microbiológicos de aguas</li>
                            <li>Análisis fisicoquímicos ambientales</li>
                            <li>Análisis de alimentos para consumo humano</li>
                            <li>Análisis de cosméticos y productos de aseo</li>
                        </ul>
                        
                        <h5><i class="fas fa-map-marker-alt"></i> Jurisdicción</h5>
                        <p>Departamento de Antioquia, Colombia</p>
                    </div>
                </div>
            `
        },
        resolucion: {
            title: 'Resolución No. 229 de 2024',
            content: `
                <div class="modal-cert-info">
                    <div class="modal-cert-header">
                        <div class="resolution-icon-large">
                            <i class="fas fa-file-contract"></i>
                        </div>
                        <h4>Ministerio de Salud y Protección Social</h4>
                    </div>
                    
                    <div class="modal-details">
                        <h5><i class="fas fa-info-circle"></i> Descripción</h5>
                        <p>Resolución que autoriza a AOXLAB como laboratorio competente para realizar análisis de aguas destinadas al consumo humano.</p>
                        
                        <h5><i class="fas fa-tint"></i> Parámetros Autorizados</h5>
                        <ul>
                            <li>Análisis microbiológicos de agua potable</li>
                            <li>Parámetros fisicoquímicos de calidad</li>
                            <li>Determinación de metales pesados</li>
                            <li>Análisis de desinfectantes residuales</li>
                        </ul>
                        
                        <h5><i class="fas fa-calendar"></i> Vigencia</h5>
                        <p>Válida desde 2024 con renovaciones según normativa vigente</p>
                    </div>
                </div>
            `
        },
        ica: {
            title: 'Certificación ICA',
            content: `
                <div class="modal-cert-info">
                    <div class="modal-cert-header">
                        <img src="img/Ica.png" alt="ICA" style="height: 100px; margin-bottom: 20px;">
                        <h4>Instituto Colombiano Agropecuario</h4>
                    </div>
                    
                    <div class="modal-details">
                        <h5><i class="fas fa-info-circle"></i> Descripción</h5>
                        <p>Autorización del ICA para realizar análisis de alimentos para animales, muestras de origen animal y productos agrícolas.</p>
                        
                        <h5><i class="fas fa-seedling"></i> Sectores Autorizados</h5>
                        <ul>
                            <li>Alimentos para animales (concentrados, forrajes)</li>
                            <li>Productos de origen animal</li>
                            <li>Productos agrícolas y vegetales</li>
                            <li>Materias primas pecuarias</li>
                        </ul>
                        
                        <h5><i class="fas fa-certificate"></i> Registro</h5>
                        <p><strong>Número:</strong> LB0000032025<br>
                        <strong>Fecha:</strong> 14 de abril de 2025</p>
                    </div>
                </div>
            `
        },
        iso17065: {
            title: 'ISO 17065 - Próximamente',
            content: `
                <div class="modal-cert-info">
                    <div class="modal-cert-header">
                        <img src="img/Iso17065.jpg" alt="ISO 17065" style="height: 100px; margin-bottom: 20px;">
                        <h4>Organismos que Certifican Productos, Procesos y Servicios</h4>
                    </div>
                    
                    <div class="modal-details">
                        <h5><i class="fas fa-info-circle"></i> Descripción</h5>
                        <p>AOXLAB está en proceso de obtener la acreditación ISO 17065 para actuar como organismo certificador de productos, procesos y servicios.</p>
                        
                        <h5><i class="fas fa-cogs"></i> Servicios Futuros</h5>
                        <ul>
                            <li>Certificación de productos ecológicos</li>
                            <li>Certificación de procesos agroindustriales</li>
                            <li>Verificación de sistemas de gestión</li>
                            <li>Auditorías de conformidad</li>
                        </ul>
                        
                        <h5><i class="fas fa-calendar-plus"></i> Estado del Proceso</h5>
                        <p>Actualmente en fase de implementación y preparación para la evaluación de acreditación.</p>
                        
                        <div class="progress-indicator">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 75%"></div>
                            </div>
                            <span>75% Completado</span>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    if (certDetails[certType]) {
        modalTitle.textContent = certDetails[certType].title;
        modalBody.innerHTML = certDetails[certType].content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cerrar modal de certificaciones
 */
function closeCertModal() {
    const modal = document.getElementById('cert-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Observador para animaciones de certificaciones
 */
function observeCertifications() {
    const certCards = document.querySelectorAll('.cert-card-enhanced');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    certCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// Añadir al DOMContentLoaded existente
document.addEventListener('DOMContentLoaded', function() {
    // Tu código existente...
    
    // Añadir inicialización de certificaciones
    initializeCertificationsSystem();
    animateCertifications(); // Mantener la función existente también
});
