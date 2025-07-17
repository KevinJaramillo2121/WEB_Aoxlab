// certificaciones.js - Funcionalidades específicas para la página de certificaciones

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // --- LÓGICA DEL FORMULARIO DE PRERREGISTRO ---
    initializePrerregistroForm();

    // --- OTRAS FUNCIONALIDADES DE LA PÁGINA ---
    initializeFilters();
    enhanceCertBadges();
    initializeTabs('.politicas-tabs .tab-btn', '.politicas-tabs .tabs-content .tab-pane');
    initializeTabs('.reglas-tabs .tab-btn', '.reglas-tabs-content .tab-content');
    // Si tienes otras inicializaciones, pueden ir aquí.
});


document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad de pestañas mejorada
    const tabBtns = document.querySelectorAll('.reglas-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.reglas-tabs-content .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            tabBtns.forEach(b => b.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente con animación
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.opacity = '0';
                content.style.transform = 'translateY(20px)';
            });
            
            setTimeout(() => {
                const activeContent = document.getElementById(`${tabId}-tab`);
                activeContent.classList.add('active');
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
            }, 150);
        });
    });
    
    // Efecto 3D mejorado para tarjetas de acuerdos
    const acuerdoCards = document.querySelectorAll('.acuerdo-card-3d');
    
    acuerdoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Efecto de paralaje suave
        card.addEventListener('mousemove', function(e) {
            if (!this.classList.contains('flipped')) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleX = (y - centerY) / 15;
                const angleY = (centerX - x) / 15;
                
                this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
    
    // Animación de timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                
                // Animar marcador
                const marker = entry.target.querySelector('.timeline-marker');
                marker.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    marker.style.transform = 'scale(1)';
                }, 300);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease';
        item.style.transitionDelay = `${index * 0.2}s`;
        
        timelineObserver.observe(item);
    });
    
    // Efecto hover para responsabilidades
    const respItems = document.querySelectorAll('.resp-item');
    
    respItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.resp-icon');
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            icon.style.transition = 'transform 0.5s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.resp-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    }); 
    
    // Animación de consecuencias
    const consecuenciaItems = document.querySelectorAll('.consecuencia-item');
    
    consecuenciaItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            
            const icon = this.querySelector('i');
            icon.style.transform = 'rotateY(360deg)';
            icon.style.transition = 'transform 0.6s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const icon = this.querySelector('i');
            icon.style.transform = 'rotateY(0deg)';
        });
    });
    
    // Funcionalidad de descarga múltiple
    const downloadAllBtn = document.querySelector('.quick-action-btn.primary');
    
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Simular descarga múltiple
            const files = [
                'Contrato_Certificacion_AOXLAB.pdf',
                'Reglas_Servicio_AOXLAB.pdf',
                'Terminos_Condiciones_AOXLAB.pdf',
                'Manual_Uso_Marcas_AOXLAB.pdf',
                'Declaracion_Origen_Fondos.pdf'
            ];
            
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Preparando descarga...</span>';
            
            setTimeout(() => {
                files.forEach((file, index) => {
                    setTimeout(() => {
                        // Aquí iría la lógica real de descarga
                        console.log(`Descargando: ${file}`);
                    }, index * 500);
                });
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i><span>Descarga Completa</span>';
                    
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-download"></i><span>Descargar Todo</span>';
                    }, 2000);
                }, files.length * 500);
            }, 1000);
        });
    }
    
    // Efecto de reveal para declaraciones
    const declaracionCards = document.querySelectorAll('.declaracion-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.2 });
    
    declaracionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        cardObserver.observe(card);
    });
    
    // Tooltip para botones de ayuda
    const helpBtns = document.querySelectorAll('.btn-form-help');
    
    helpBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Crear tooltip temporal
            const tooltip = document.createElement('div');
            tooltip.textContent = '¿Necesitas ayuda? Contacta a nuestro equipo de soporte';
            tooltip.style.cssText = `
                position: fixed;
                top: ${e.clientY - 40}px;
                left: ${e.clientX - 100}px;
                background: var(--primary-color);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                z-index: 10000;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 300);
            }, 3000);
        });
    });
});

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Inicializar efectos de paralaje para el fondo
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const reglasSection = document.querySelector('.reglas-section');
    
    if (reglasSection) {
        const rate = scrolled * 0.5;
        reglasSection.style.backgroundPosition = `center ${rate}px`;
    }
});
// JavaScript simplificado para el carrusel horizontal con CSS Scroll Snap
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const carousel = document.querySelector('.proceso-carousel-snap');
    const cards = document.querySelectorAll('.proceso-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.indicator');
    
    // Variables de control
    let currentIndex = 0;
    
    // Función para navegar al siguiente elemento
    function navigateToNext() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            scrollToCard(currentIndex);
        }
    }
    
    // Función para navegar al elemento anterior
    function navigateToPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToCard(currentIndex);
        }
    }
    
    // Función para desplazarse a una tarjeta específica
    function scrollToCard(index) {
        cards[index].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
        
        // Actualizar indicadores
        updateIndicators(index);
    }
    
    // Función para actualizar los indicadores
    function updateIndicators(index) {
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Event listeners para los botones
    prevBtn.addEventListener('click', navigateToPrev);
    nextBtn.addEventListener('click', navigateToNext);
    
    // Event listeners para los indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
            e.preventDefault();
            currentIndex = index;
            scrollToCard(index);
        });
    });
    
    // Detectar cuando el carrusel termina de desplazarse para actualizar el índice actual
    let isScrolling;
    carousel.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        
        isScrolling = setTimeout(function() {
            // Encontrar qué tarjeta está más centrada en la vista
            const centerX = carousel.offsetLeft + carousel.offsetWidth / 2;
            
            let closestCard = null;
            let closestDistance = Infinity;
            
            cards.forEach((card, index) => {
                const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
                const distance = Math.abs(cardCenterX - centerX);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestCard = card;
                    currentIndex = index;
                }
            });
            
            // Actualizar indicadores
            updateIndicators(currentIndex);
        }, 100);
    });
});

// Funcionalidad para las tabs de políticas
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Ocultar todos los paneles
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Mostrar el panel correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Sistema de filtros para directorio
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const companies = document.querySelectorAll('.cert-company');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterCompanies(filter, companies);
        });
    });
}

function filterCompanies(filter, companies) {
    companies.forEach((company, index) => {
        const category = company.getAttribute('data-category');
        
        setTimeout(() => {
            if (filter === 'all' || category === filter) {
                company.style.display = 'block';
                company.style.opacity = '0';
                company.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    company.style.opacity = '1';
                    company.style.transform = 'translateY(0)';
                }, 50);
            } else {
                company.style.opacity = '0';
                company.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    company.style.display = 'none';
                }, 300);
            }
        }, index * 50);
    });
}

// Calculadora de costos
function initializeCostCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const placeholder = document.getElementById('calc-placeholder');
    
    calculateBtn.addEventListener('click', function() {
        const certType = document.getElementById('cert-type');
        const companySize = document.getElementById('company-size');
        const complexity = document.getElementById('complexity');
        const sites = document.getElementById('sites');
        
        if (!certType.value || !companySize.value || !complexity.value) {
            showNotification('Por favor completa todos los campos obligatorios', 'warning');
            return;
        }
        
        const calculation = calculateCosts(certType, companySize, complexity, sites.value);
        displayResults(calculation);
        
        // Mostrar resultados
        placeholder.style.display = 'none';
        resultDisplay.style.display = 'block';
        resultDisplay.classList.add('active');
    });
}

function calculateCosts(certType, companySize, complexity, sites) {
    const basePrice = parseInt(certType.selectedOptions[0].getAttribute('data-base'));
    const sizeMultiplier = parseFloat(companySize.selectedOptions[0].getAttribute('data-multiplier'));
    const complexityMultiplier = parseFloat(complexity.selectedOptions[0].getAttribute('data-multiplier'));
    const sitesCount = parseInt(sites);
    
    const baseCost = basePrice * sizeMultiplier * complexityMultiplier;
    const sitesCost = sitesCount > 1 ? baseCost * 0.3 * (sitesCount - 1) : 0;
    
    const evalCost = baseCost * 0.15;
    const auditCost = baseCost * 0.6 + sitesCost;
    const certCost = baseCost * 0.25;
    const survCost = baseCost * 0.2;
    
    return {
        evaluation: evalCost,
        audit: auditCost,
        certificate: certCost,
        surveillance: survCost,
        total: evalCost + auditCost + certCost + survCost
    };
}

function displayResults(costs) {
    document.getElementById('eval-cost').textContent = formatCurrency(costs.evaluation);
    document.getElementById('audit-cost').textContent = formatCurrency(costs.audit);
    document.getElementById('cert-cost').textContent = formatCurrency(costs.certificate);
    document.getElementById('surv-cost').textContent = formatCurrency(costs.surveillance);
    document.getElementById('total-cost').textContent = formatCurrency(costs.total);
    
    // Animar números
    animateNumbers();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function animateNumbers() {
    const numbers = document.querySelectorAll('.cost-value, .total-value');
    
    numbers.forEach(number => {
        const finalText = number.textContent;
        const finalNumber = parseInt(finalText.replace(/[^\d]/g, ''));
        let currentNumber = 0;
        const increment = finalNumber / 30;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            
            number.textContent = formatCurrency(currentNumber);
        }, 50);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // --- LÓGICA DEL FORMULARIO DE PRERREGISTRO ---
    initializePrerregistroForm();

    // --- OTRAS FUNCIONALIDADES DE LA PÁGINA ---
    initializeFilters();
    enhanceCertBadges();
    initializeTabs('.politicas-tabs .tab-btn', '.politicas-tabs .tabs-content .tab-pane');
    initializeTabs('.reglas-tabs .tab-btn', '.reglas-tabs-content .tab-content');
});


/**
 * Inicializa la lógica para el formulario de prerregistro de certificación.
 */
function initializePrerregistroForm() {
    const form = document.getElementById('prerregistro-form');
    if (!form) return;

    const btn = document.getElementById('submit-btn');
    const msgArea = document.getElementById('form-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgArea.textContent = '';
        msgArea.className = '';

        if (!validatePrerregistroForm(form)) {
            msgArea.textContent = 'Por favor, corrige los errores antes de enviar.';
            msgArea.className = 'error';
            return;
        }

        toggleBtn(btn, true);

        try {
            // Añadir datos ocultos para validación del servidor
            addHiddenDataToCertForm(form);

            const formData = new FormData(form);
            const response = await fetch(form.action, { method: 'POST', body: formData });
            
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            const json = await response.json();

            if (json.success) {
                msgArea.textContent = '✅ ¡Prerregistro enviado con éxito! Nos pondremos en contacto contigo pronto.';
                msgArea.className = 'ok';
                form.reset();
            } else {
                throw new Error(json.message || 'El servidor indicó un error en el envío.');
            }
        } catch (err) {
            console.error(err);
            msgArea.textContent = `❌ Hubo un problema con el envío. Por favor, intenta de nuevo más tarde o contáctanos directamente.`;
            msgArea.className = 'error';
        } finally {
            toggleBtn(btn, false);
        }
    });
}

/**
 * Añade campos ocultos al formulario antes de enviarlo.
 * @param {HTMLFormElement} form - El formulario.
 */
function addHiddenDataToCertForm(form) {
    const empresa = form.querySelector('#empresa')?.value || 'N/A';
    const certificacion = form.querySelector('#certificacion option:checked')?.text || 'N/A';

    addHiddenField(form, 'Fecha_Prerregistro', new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
    addHiddenField(form, 'Navegador_Usuario', getBrowserInfo());
    addHiddenField(form, 'Pagina_Origen', window.location.href);
    addHiddenField(form, 'Asunto_Sugerido', `Prerregistro Certificación - ${empresa} - ${certificacion}`);
}

/**
 * Crea o actualiza un campo oculto en un formulario.
 * @param {HTMLFormElement} form - El formulario.
 * @param {string} name - El nombre del campo.
 * @param {string} value - El valor del campo.
 */
function addHiddenField(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
    }
    input.value = value;
}

/**
 * Obtiene información básica del navegador del usuario.
 * @returns {string} - El nombre del navegador.
 */
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Microsoft Edge';
    return 'Otro navegador';
}


/**
 * Valida los campos del formulario de prerregistro.
 * @param {HTMLFormElement} form - El formulario a validar.
 * @returns {boolean} - True si el formulario es válido, false en caso contrario.
 */
function validatePrerregistroForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        const parent = field.closest('.field');
        const errorMsg = parent.querySelector('.field-error');
        if(errorMsg) errorMsg.remove();
        field.style.borderColor = '';

        let hasError = false;
        if (field.type === 'checkbox') {
            if (!field.checked) {
                hasError = true;
            }
        } else {
            if (!field.value.trim()) {
                hasError = true;
            }
        }
        
        if (hasError) {
            isValid = false;
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = '#e74c3c';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '4px';
            errorDiv.textContent = 'Este campo es obligatorio.';
            parent.appendChild(errorDiv);
            field.style.borderColor = '#e74c3c';
        }
    });

    return isValid;
}

/**
 * Activa/desactiva el estado de carga de un botón.
 * @param {HTMLButtonElement} btn - El botón a modificar.
 * @param {boolean} loading - True para estado de carga, false para estado normal.
 */
function toggleBtn(btn, loading) {
    btn.disabled = loading;
    const span = btn.querySelector('span');
    if (span) {
       span.textContent = loading ? 'Enviando…' : 'Enviar prerregistro';
    }
    if(loading) {
        btn.classList.add('loading');
    } else {
        btn.classList.remove('loading');
    }
}


/**
 * Inicializa un sistema de pestañas (tabs).
 * @param {string} btnSelector - Selector para los botones de las pestañas.
 * @param {string} contentSelector - Selector para los paneles de contenido.
 */
function initializeTabs(btnSelector, contentSelector) {
    const tabBtns = document.querySelectorAll(btnSelector);
    const tabContents = document.querySelectorAll(contentSelector);
    
    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}` || content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Inicializa los filtros del directorio de empresas.
 */
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const companies = document.querySelectorAll('.cert-company');
    
    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            companies.forEach(company => {
                const category = company.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    company.style.display = 'block';
                } else {
                    company.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Mejora visual de las insignias de certificación.
 */
function enhanceCertBadges() {
    const badges = document.querySelectorAll('.cert-badge-floating');
    badges.forEach((badge) => {
        badge.addEventListener('click', function() {
            const alcancesSection = document.getElementById('alcances');
            if (alcancesSection) {
                alcancesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validar email
    const email = document.getElementById('email');
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Por favor ingresa un email válido');
        isValid = false;
    }
    
    // Validar términos
    const terms = document.getElementById('accept-terms');
    if (!terms.checked) {
        showNotification('Debes aceptar los términos y condiciones', 'error');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color, #e74c3c)';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error-color, #e74c3c)';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitPrerregistro(form) {
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Mostrar loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (aquí integrarías con tu backend)
    setTimeout(() => {
        showNotification('¡Prerregistro completado exitosamente! Te contactaremos pronto.', 'success');
        form.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}
/* js/prerregistro.js */
    document.addEventListener('DOMContentLoaded', () => {
    const form       = document.getElementById('prerregistro-form');
    const btn        = document.getElementById('submit-btn');
    const msgArea    = document.getElementById('form-msg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg('');

        if (!form.checkValidity()) {
        form.reportValidity();
        return;
        }

        // Estado de envío
        toggleBtn(true);

        try {
        const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
        const json = await res.json();

        if (json.success) {
            msg('✅ Prerregistro enviado. Te contactaremos pronto.', 'ok');
            form.reset();
        } else {
            throw new Error(json.message || 'Error desconocido');
        }
        } catch (err) {
        console.error(err);
        msg('❌ No se pudo enviar el formulario. Intenta más tarde.', 'error');
        } finally {
        toggleBtn(false);
        }
    });

    // Helpers
    function toggleBtn(loading) {
        btn.disabled = loading;
        btn.firstElementChild.textContent = loading ? 'Enviando…' : 'Enviar prerregistro';
        btn.classList.toggle('loading', loading);
    }

    function msg(text = '', type = '') {
        msgArea.textContent = text;
        msgArea.className   = type;
    }
    });

// Mejorar badges de certificación flotantes
function enhanceCertBadges() {
    const badges = document.querySelectorAll('.cert-badge-floating');
    
    badges.forEach((badge, index) => {
        badge.addEventListener('mouseenter', function() {
            // Pausar animación y hacer hover effect
            this.style.animationPlayState = 'paused';
            this.style.transform = 'scale(1.2) translateY(-15px)';
            this.style.zIndex = '100';
        });
        
        badge.addEventListener('mouseleave', function() {
            // Reanudar animación
            this.style.animationPlayState = 'running';
            this.style.transform = '';
            this.style.zIndex = '';
        });
        
        // Efecto de click
        badge.addEventListener('click', function() {
            const type = this.querySelector('span').textContent.toLowerCase();
            scrollToAlcance(type);
        });
    });
}

function scrollToAlcance(type) {
    const alcancesSection = document.getElementById('alcances');
    if (alcancesSection) {
        alcancesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Destacar el alcance correspondiente
        setTimeout(() => {
            const cards = document.querySelectorAll('.alcance-card');
            cards.forEach(card => {
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.7';
            });
            
            // Buscar y destacar la tarjeta correcta
            const targetCard = findCardByType(type);
            if (targetCard) {
                setTimeout(() => {
                    targetCard.style.transform = 'scale(1.05)';
                    targetCard.style.opacity = '1';
                    targetCard.style.borderColor = 'var(--accent-color)';
                    
                    setTimeout(() => {
                        cards.forEach(card => {
                            card.style.transform = '';
                            card.style.opacity = '';
                            card.style.borderColor = '';
                        });
                    }, 2000);
                }, 200);
            }
        }, 500);
    }
}

function findCardByType(type) {
    const cards = document.querySelectorAll('.alcance-card');
    
    for (let card of cards) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(type) || 
            (type === 'ecológicos' && title.includes('ecológicos')) ||
            (type === 'agroindustriales' && title.includes('agroindustriales')) ||
            (type === 'cannabis' && title.includes('cannabis')) ||
            (type === 'cosméticos' && title.includes('cosméticos')) ||
            (type === 'biodegradables' && title.includes('biodegradables'))) {
            return card;
        }
    }
    return null;
}

// Funciones auxiliares
function showNotification(message, type = 'info') {
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.className = `notification toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos
    Object.assign(toast.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: getColorForType(type),
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px'
    });
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getColorForType(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || '#3498db';
}

// Funcionalidad del chatbot específica para certificaciones
document.addEventListener('DOMContentLoaded', function() {
    const quickButtons = document.querySelectorAll('.quick-btn[data-action]');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleCertificationQuestion(action);
        });
    });
});

function handleCertificationQuestion(action) {
    const responses = {
        'ecologicos': 'Las certificaciones de productos ecológicos validan que tus productos cumplan con estándares de producción sostenible y orgánica. Incluye producción primaria, procesamiento y etiquetado.',
        'cannabis': 'Nuestras certificaciones para cannabis medicinal cubren desde el cultivo hasta el producto final, asegurando cumplimiento normativo y calidad farmacéutica.',
        'costos': 'Los costos de certificación varían según el tipo de producto, tamaño de empresa y complejidad. Puedes usar nuestra calculadora en esta página para una estimación.'
    };
    
    const chatBody = document.getElementById('chatbot-body');
    const response = responses[action] || 'Te ayudo con información sobre certificaciones ISO 17065. ¿Qué te gustaría saber específicamente?';
    
    // Añadir respuesta del bot
    const botMessage = document.createElement('div');
    botMessage.className = 'chat-message bot-message';
    botMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${response}</p>
            <div class="quick-actions">
                <button class="quick-btn" onclick="scrollToSection('prerregistro')">
                    Prerregistrarme
                </button>
                <button class="quick-btn" onclick="scrollToSection('calculadora-section')">
                    Calcular costos
                </button>
            </div>
        </div>
    `;
    
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mejoras de UX adicionales
document.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const badges = document.querySelectorAll('.cert-badge-floating');
    
    badges.forEach((badge, index) => {
        const speed = 0.5 + (index * 0.1);
        badge.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
    });
});
