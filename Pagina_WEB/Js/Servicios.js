// servicios.js - Funcionalidades específicas para la página de servicios
// Es importante recordar que todos y cada uno de los apartados deben estar comentados con el fin de que su posterior lectura y actualizacion sea más sencilla
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
    initializeSearch();
    initializeServiceCards();
    animateFloatingIcons();
});

// Sistema de filtros
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const noResults = document.getElementById('no-results');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterServices(filter, serviceCards, noResults);
        });
    });
}

// Función para filtrar servicios
function filterServices(filter, cards, noResults) {
    let visibleCards = 0;
    
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        // Añadir delay escalonado para animación
        setTimeout(() => {
            if (filter === 'all' || category === filter) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                card.style.display = 'block';
                visibleCards++;
            } else {
                card.classList.remove('filtered-in');
                card.classList.add('filtered-out');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }, index * 50);
    });
    
    // Mostrar mensaje si no hay resultados
    setTimeout(() => {
        noResults.style.display = visibleCards === 0 ? 'block' : 'none';
    }, cards.length * 50 + 300);
}

// Sistema de búsqueda
function initializeSearch() {
    const searchInput = document.getElementById('service-search');
    const serviceCards = document.querySelectorAll('.service-card');
    const noResults = document.getElementById('no-results');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        searchServices(searchTerm, serviceCards, noResults);
    });
}

// Función de búsqueda
function searchServices(searchTerm, cards, noResults) {
    let visibleCards = 0;
    
    cards.forEach((card, index) => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.service-features li'))
            .map(li => li.textContent.toLowerCase()).join(' ');
        
        const content = `${title} ${description} ${features}`;
        
        setTimeout(() => {
            if (searchTerm === '' || content.includes(searchTerm)) {
                card.classList.remove('filtered-out');
                card.classList.add('filtered-in');
                card.style.display = 'block';
                visibleCards++;
            } else {
                card.classList.remove('filtered-in');
                card.classList.add('filtered-out');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }, index * 30);
    });
    
    setTimeout(() => {
        noResults.style.display = visibleCards === 0 ? 'block' : 'none';
    }, cards.length * 30 + 300);
}

// Efectos para las tarjetas de servicio
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Efecto hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Animación de iconos al hacer hover
        const icon = card.querySelector('.service-icon');
        card.addEventListener('mouseenter', function() {
            icon.style.transform = 'scale(1.1) rotateY(360deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            icon.style.transform = 'scale(1) rotateY(0deg)';
        });
        
        // Efecto en botones
        const buttons = card.querySelectorAll('.btn-detail, .btn-quote');
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

// Animación de iconos flotantes
function animateFloatingIcons() {
    const iconItems = document.querySelectorAll('.icon-item');
    
    iconItems.forEach((item, index) => {
        // Animación de flotación personalizada
        item.style.animationDelay = `${index * 1.5}s`;
        
        // Efecto hover mejorado
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.1) rotate(5deg)';
            this.style.boxShadow = '0 20px 60px rgba(43, 161, 212, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            this.style.boxShadow = '0 10px 40px var(--shadow-light)';
        });
    });
}

// Función para cotización rápida
function quickQuote(serviceName) {
    // Simular cotización rápida
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="quick-quote-modal">
            <div class="modal-content">
                <h3>Cotización Rápida</h3>
                <p>Servicio: <strong>${serviceName}</strong></p>
                <p>¿Te gustaría recibir una cotización personalizada?</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="window.location.href='contacto.html'">
                        Sí, contactar
                    </button>
                    <button class="btn-secondary" onclick="this.closest('.quick-quote-modal').remove()">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Funcionalidad del chatbot específica para servicios
document.addEventListener('DOMContentLoaded', function() {
    const quickButtons = document.querySelectorAll('.quick-btn[data-action]');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleServiceQuestion(action);
        });
    });
});

function handleServiceQuestion(service) {
    const responses = {
        'microbiologicos': 'Los análisis microbiológicos incluyen detección de patógenos como Salmonella, E. coli, Listeria y recuentos microbianos. Tiempo de entrega: 3-5 días laborables.',
        'metales': 'Ofrecemos análisis de metales pesados (Pb, Cd, As, Hg, Cr) mediante ICP-MS con límites de detección ultra-bajos. Ideal para alimentos, agua y productos industriales.',
        'cannabinoides': 'Análisis completo de cannabinoides (THC, CBD, CBG, CBN) y terpenos para productos de cannabis medicinal. Cumplimos con todas las normativas vigentes.'
    };
    
    const chatBody = document.getElementById('chatbot-body');
    const response = responses[service] || 'Te ayudo con información sobre ese servicio. ¿Qué te gustaría saber específicamente?';
    
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
                <button class="quick-btn" onclick="window.location.href='contacto.html'">
                    Solicitar cotización
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
