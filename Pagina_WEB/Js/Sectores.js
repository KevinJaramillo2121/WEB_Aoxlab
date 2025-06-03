// sectores.js - Funcionalidades específicas para la página de sectores
// Es importante recordar que este apartado debe llevar manual para la idea es comentar la mayoria de la funciones para que pueda ser mas facil la legibilidad y actualizacacion de este codigo
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
    initializeSectorFilters();
    initializeCasosSlider();
    animateStats();
    enhanceSectorCards();
    initializeSectorIcons();
});

// Sistema de filtros para sectores
function initializeSectorFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sectorCards = document.querySelectorAll('.sector-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterSectors(filter, sectorCards);
        });
    });
}

function filterSectors(filter, cards) {
    const categoryMapping = {
        'primarios': ['agro', 'nutricion'],
        'transformacion': ['alimentos', 'quimica'],
        'consumo': ['cosmeticos'],
        'especializados': ['cannabis', 'plasticos', 'ambiente']
    };
    
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        setTimeout(() => {
            if (filter === 'all' || category === filter || 
                (categoryMapping[filter] && categoryMapping[filter].includes(getSectorType(card)))) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                card.style.display = 'flex';
            } else {
                card.classList.remove('filtered-in');
                card.classList.add('filtered-out');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }, index * 50);
    });
}

function getSectorType(card) {
    const title = card.querySelector('h3').textContent.toLowerCase();
    
    if (title.includes('agro')) return 'agro';
    if (title.includes('alimentos')) return 'alimentos';
    if (title.includes('cannabis')) return 'cannabis';
    if (title.includes('cosméticos')) return 'cosmeticos';
    if (title.includes('nutrición')) return 'nutricion';
    if (title.includes('química')) return 'quimica';
    if (title.includes('plásticos')) return 'plasticos';
    if (title.includes('agua')) return 'ambiente';
    
    return 'general';
}

// Slider de casos de éxito
function initializeCasosSlider() {
    const casosItems = document.querySelectorAll('.caso-item');
    const indicators = document.querySelectorAll('.casos-indicators .indicator');
    const prevBtn = document.querySelector('.caso-nav.prev');
    const nextBtn = document.querySelector('.caso-nav.next');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Ocultar todos los casos
        casosItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Remover active de indicadores
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Mostrar caso actual
        if (casosItems[index]) {
            casosItems[index].classList.add('active');
        }
        
        // Activar indicador
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % casosItems.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = currentSlide === 0 ? casosItems.length - 1 : currentSlide - 1;
        showSlide(prevIndex);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-play (opcional)
    setInterval(nextSlide, 8000);
}

// Animación de estadísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number, .mini-number, .numero');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + (element.textContent.includes('+') ? '+' : '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/[^\d]/g, ''));
                if (target && target > 0) {
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            }
        });
    });
    
    statNumbers.forEach(number => {
        if (number.getAttribute('data-count')) {
            observer.observe(number);
        }
    });
}

// Mejorar tarjetas de sector
function enhanceSectorCards() {
    const sectorCards = document.querySelectorAll('.sector-card');
    
    sectorCards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Animación de iconos al hacer hover
        const icon = card.querySelector('.sector-icon');
        if (icon) {
            card.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        }
        
        // Efecto en botones
        const buttons = card.querySelectorAll('.sector-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });
}

// Funcionalidad de iconos flotantes en hero
function initializeSectorIcons() {
    const sectorIcons = document.querySelectorAll('.sector-icon.floating');
    
    sectorIcons.forEach((icon, index) => {
        // Animación de flotación personalizada
        icon.style.animationDelay = `${index * 1.5}s`;
        
        // Efecto hover mejorado
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.2) rotate(10deg)';
            this.style.boxShadow = '0 25px 60px rgba(43, 161, 212, 0.3)';
            this.style.zIndex = '100';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            this.style.boxShadow = '0 10px 30px var(--shadow-light)';
            this.style.zIndex = '';
        });
        
        // Click para scroll a sector específico
        icon.addEventListener('click', function() {
            const sectorName = this.querySelector('span').textContent.toLowerCase();
            scrollToSector(sectorName);
        });
    });
}

function scrollToSector(sectorName) {
    const sectorsGrid = document.getElementById('sectores-grid');
    if (sectorsGrid) {
        sectorsGrid.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Destacar el sector correspondiente
        setTimeout(() => {
            const cards = document.querySelectorAll('.sector-card');
            cards.forEach(card => {
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.7';
            });
            
            // Buscar y destacar la tarjeta correcta
            const targetCard = findCardBySector(sectorName);
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
                    }, 3000);
                }, 200);
            }
        }, 500);
    }
}

function findCardBySector(sectorName) {
    const cards = document.querySelectorAll('.sector-card');
    
    for (let card of cards) {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(sectorName) || 
            (sectorName === 'agro' && title.includes('agro')) ||
            (sectorName === 'alimentos' && title.includes('alimentos')) ||
            (sectorName === 'cannabis' && title.includes('cannabis')) ||
            (sectorName === 'cosméticos' && title.includes('cosméticos'))) {
            return card;
        }
    }
    return null;
}

// Funcionalidad del chatbot específica para sectores
document.addEventListener('DOMContentLoaded', function() {
    const quickButtons = document.querySelectorAll('.quick-btn[data-action]');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleSectorQuestion(action);
        });
    });
});

function handleSectorQuestion(sector) {
    const responses = {
        'agro': 'El sector agro es uno de nuestros pilares. Ofrecemos análisis de suelos, residuos de plaguicidas, certificación ecológica y control nutricional. ¿Te interesa algún análisis específico?',
        'alimentos': 'Para alimentos y bebidas brindamos análisis microbiológicos, nutricionales, vida útil y detección de alérgenos. Garantizamos la seguridad alimentaria de tus productos.',
        'cannabis': 'Somos pioneros en análisis de cannabis medicinal. Realizamos perfiles completos de cannabinoides, terpenos, metales pesados y cumplimiento regulatorio.'
    };
    
    const chatBody = document.getElementById('chatbot-body');
    const response = responses[sector] || 'Te ayudo con información sobre ese sector. ¿Qué análisis específico necesitas?';
    
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
                <button class="quick-btn" onclick="window.location.href='contacto.html?sector=${sector}'">
                    Solicitar cotización
                </button>
                <button class="quick-btn" onclick="window.location.href='servicios.html'">
                    Ver servicios
                </button>
            </div>
        </div>
    `;
    
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Scroll suave para anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto parallax suave para el hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const sectorIcons = document.querySelectorAll('.sector-icon.floating');
    
    sectorIcons.forEach((icon, index) => {
        const speed = 0.5 + (index * 0.1);
        if (scrolled < window.innerHeight) {
            icon.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        }
    });
});
