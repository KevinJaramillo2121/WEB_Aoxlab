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
    
    // Inicializar funcionalidades
    initializeFilters();
    initializeCostCalculator();
    initializePrerregistroForm();
    enhanceCertBadges();
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

// Formulario de prerregistro
function initializePrerregistroForm() {
    const form = document.getElementById('prerregistro-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitPrerregistro(this);
            }
        });
    }
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
