// JavaScript principal para AOXLAB
// Es importante recorar que todos los apartados deben llevar su debida documentacion y comentarios con el fin de hacer más facil la legibilidad de cada uno de los apartados y la actualización de todo
class AoxlabWebsite {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isScrolling = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initCarousel();
        this.initScrollEffects();
        this.initCounters();
        this.initChatbot();
        this.initThemeToggle();
        this.initLanguageSelector();
        this.initMobileMenu();
        this.initFloatingButtons();
    }
    
    setupEventListeners() {
        // Event listeners principales
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
        
        // Prevenir comportamiento por defecto en ciertos elementos
        document.addEventListener('DOMContentLoaded', () => {
            this.preloadImages();
        });
    }
    
    // === CARRUSEL DE IMÁGENES ===
    initCarousel() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        
        this.totalSlides = this.slides.length;
        
        if (this.totalSlides === 0) return;
        
        // Event listeners del carrusel
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play del carrusel
        this.startAutoplay();
        
        // Pausar en hover
        carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        carousel.addEventListener('mouseleave', () => this.startAutoplay());
        
        // Soporte para touch/swipe en móviles
        this.initTouchControls(carousel);
    }
     // Nueva función:
            restartAutoplay() {
                this.pauseAutoplay();
                this.startAutoplay();
                }
    
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Actualizar slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
        
        // Animar contenido del slide
        this.animateSlideContent();
    }
    
    animateSlideContent() {
        const activeSlide = this.slides[this.currentSlide];
        const content = activeSlide.querySelector('.slide-content');
        
        if (content) {
            // Reset animations
            content.style.animation = 'none';
            content.offsetHeight; // Trigger reflow
            content.style.animation = 'fadeInUp 1s ease';
        }
    }
    
        // Mejorar la función startAutoplay
    startAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
        
        this.autoplayInterval = setInterval(() => {
            if (!this.autoplayPaused && !this.manuallyPaused) {
                this.nextSlide();
            }
        }, 5000);
    }
    // Mejorar pauseAutoplay
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
    
    initTouchControls(carousel) {
        let startX = 0;
        let currentX = 0;
        let isMoving = false;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isMoving = true;
            this.pauseAutoplay();
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isMoving) return;
            currentX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', () => {
            if (!isMoving) return;
            
            const diffX = startX - currentX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isMoving = false;
            this.startAutoplay();
        });
    }
    
    // === EFECTOS DE SCROLL ===
    initScrollEffects() {
        // Header scroll effect
        this.initHeaderScroll();
        
        // Scroll to top button
        this.initScrollToTop();
        
        // Smooth scrolling para enlaces ancla
        this.initSmoothScrolling();
        
        // Intersection Observer para animaciones
        this.initScrollAnimations();
    }
    
    initHeaderScroll() {
        const header = document.querySelector('.main-header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    initScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                    entry.target.style.opacity = '1';
                }
            });
        }, observerOptions);
        
        // Observar elementos con data-aos
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
    
    // === CONTADORES ANIMADOS ===
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const start = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease out)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // === CHATBOT ===
    initChatbot() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotModal = document.getElementById('chatbot-modal');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const chatBody = document.getElementById('chatbot-body');
        
        // Toggle chatbot
        chatbotToggle?.addEventListener('click', () => this.toggleChatbot());
        chatbotClose?.addEventListener('click', () => this.closeChatbot());
        
        // Enviar mensaje
        sendButton?.addEventListener('click', () => this.sendChatMessage());
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        // Botones de acción rápida
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
        
        // Cerrar con escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chatbotOpen) {
                this.closeChatbot();
            }
        });
    }
    
    toggleChatbot() {
        const chatbotModal = document.getElementById('chatbot-modal');
        this.chatbotOpen = !this.chatbotOpen;
        
        if (this.chatbotOpen) {
            chatbotModal.classList.add('active');
            document.getElementById('chat-input')?.focus();
            
            // Ocultar notificación
            const notificationDot = document.querySelector('.notification-dot');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }
        } else {
            chatbotModal.classList.remove('active');
        }
    }
    
    closeChatbot() {
        this.chatbotOpen = false;
        document.getElementById('chatbot-modal').classList.remove('active');
    }
    
    sendChatMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (message) {
            this.addChatMessage(message, 'user');
            chatInput.value = '';
            
            // Simular respuesta del bot después de un delay
            setTimeout(() => {
                this.generateBotResponse(message);
            }, 1000);
        }
    }
    
    addChatMessage(message, sender) {
        const chatBody = document.getElementById('chatbot-body');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content user-content">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        }
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    generateBotResponse(userMessage) {
        const responses = {
            'servicios': '¡Excelente! Ofrecemos análisis microbiológicos, metales pesados, cannabinoides, certificaciones ISO y mucho más. ¿Qué tipo de análisis necesitas?',
            'cotizacion': 'Con gusto te ayudo con una cotización. Puedes contactarnos al (+57) 604 7454 o enviar un WhatsApp. ¿Qué producto necesitas analizar?',
            'resultados': 'Puedes consultar tus resultados en nuestro Portal Clientes. Si necesitas ayuda, comparte tu número de orden.',
            'precio': 'Los precios varían según el tipo de análisis. Te recomiendo contactar directamente para una cotización personalizada.',
            'tiempo': 'Los tiempos de entrega dependen del análisis. Generalmente entre 3-7 días hábiles. ¿Qué análisis necesitas?',
            'default': 'Gracias por tu mensaje. Un asesor te contactará pronto. Mientras tanto, puedes explorar nuestros servicios o contactarnos por WhatsApp.'
        };
        
        let response = responses.default;
        
        // Análisis simple del mensaje
        const message = userMessage.toLowerCase();
        if (message.includes('servicio') || message.includes('análisis')) {
            response = responses.servicios;
        } else if (message.includes('cotiz') || message.includes('precio') || message.includes('costo')) {
            response = responses.cotizacion;
        } else if (message.includes('resultado') || message.includes('informe')) {
            response = responses.resultados;
        } else if (message.includes('tiempo') || message.includes('demora')) {
            response = responses.tiempo;
        }
        
        this.addChatMessage(response, 'bot');
    }
    
    handleQuickAction(action) {
        const actions = {
            'servicios': () => {
                this.addChatMessage('Quiero conocer los servicios disponibles', 'user');
                setTimeout(() => this.generateBotResponse('servicios'), 500);
            },
            'cotizacion': () => {
                this.addChatMessage('Necesito una cotización', 'user');
                setTimeout(() => this.generateBotResponse('cotizacion'), 500);
            },
            'resultados': () => {
                this.addChatMessage('Quiero consultar mis resultados', 'user');
                setTimeout(() => this.generateBotResponse('resultados'), 500);
            }
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    // === TEMA OSCURO/CLARO ===
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Aplicar tema guardado
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        function updateLogo(theme) {
        if (logo) {
            if (theme === 'dark') {
                logo.src = logo.getAttribute('data-logo-dark');
            } else {
                logo.src = logo.getAttribute('data-logo-light');
            }
        }
    }
    // Aplicar tema guardado y logo correcto al cargar
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        updateLogo('dark');
    } else {
        updateLogo('light');
    }
        
        themeToggle?.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                updateLogo('dark');
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                updateLogo('light');
            }
        });
    }
    
    // === SELECTOR DE IDIOMA ===
    initLanguageSelector() {
        const languageBtn = document.getElementById('language-btn');
        const languageOptions = document.querySelector('.language-options');
        
        document.querySelectorAll('[data-lang]').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }
    
    changeLanguage(lang) {
        // Implementación básica del cambio de idioma
        const langBtn = document.getElementById('language-btn');
        
        if (lang === 'en') {
            langBtn.innerHTML = '<span class="flag-icon">🇺🇸</span> EN <i class="fas fa-chevron-down"></i>';
            // Aquí se implementaría la traducción completa
            this.showNotification('Language changed to English');
        } else {
            langBtn.innerHTML = '<span class="flag-icon">🇪🇸</span> ES <i class="fas fa-chevron-down"></i>';
            this.showNotification('Idioma cambiado a Español');
        }
        
        localStorage.setItem('language', lang);
    }
    
    // === MENÚ MÓVIL ===
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        mobileToggle?.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navList.classList.toggle('mobile-open');
            
            // Animar hamburguesa
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        });
        
        // Cerrar menú al hacer clic en enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navList.classList.remove('mobile-open');
            });
        });
    }
    
    // === BOTONES FLOTANTES ===
    initFloatingButtons() {
        const whatsappBtn = document.querySelector('.whatsapp-float');
        const chatbotBtn = document.querySelector('.chatbot-float');
        
        // Efectos de hover mejorados
        [whatsappBtn, chatbotBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.1)';
                });
                
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            }
        });
        
        // Tracking de clics para analytics
        whatsappBtn?.addEventListener('click', () => {
            this.trackEvent('whatsapp_click', 'floating_button');
        });
    }
    
    // === UTILIDADES ===
    onPageLoad() {
        // Ocultar loader si existe
        const loader = document.querySelector('.page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
        
        // Inicializar AOS (Animate On Scroll) si está disponible
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    }
    
    onScroll() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        requestAnimationFrame(() => {
            // Efectos de parallax sutiles
            this.updateParallax();
            this.isScrolling = false;
        });
    }
    
    onResize() {
        // Recalcular dimensiones del carrusel
        if (this.slides.length > 0) {
            this.updateCarousel();
        }
        
        // Ajustar chatbot en móviles
        const chatbotModal = document.getElementById('chatbot-modal');
        if (window.innerWidth <= 768 && chatbotModal) {
            chatbotModal.style.width = 'calc(100vw - 20px)';
            chatbotModal.style.height = '70vh';
        }
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const speed = scrolled * 0.5;
            heroSection.style.transform = `translateY(${speed}px)`;
        }
    }
    
    preloadImages() {
        const images = [
            'img/hero-lab-equipment.jpg',
            'img/hero-certification.jpg',
            'img/hero-team.jpg',
            'img/aoxlab-logo.png'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    trackEvent(eventName, category) {
        // Implementación de tracking para analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: category,
                event_label: 'AOXLAB Website'
            });
        }
        
        console.log(`Event tracked: ${eventName} - ${category}`);
    }

    // Método mejorado para inicializar el chatbot
initChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotModal = document.getElementById('chatbot-modal');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const chatBody = document.getElementById('chatbot-body');
    
    this.chatbotOpen = false;
    this.isTyping = false;
    
    // Toggle chatbot
    chatbotToggle?.addEventListener('click', () => this.toggleChatbot());
    chatbotClose?.addEventListener('click', () => this.closeChatbot());
    
    // Enviar mensaje
    sendButton?.addEventListener('click', () => this.sendChatMessage());
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isTyping) {
            this.sendChatMessage();
        }
    });
    
    // Habilitar/deshabilitar botón de envío
    chatInput?.addEventListener('input', (e) => {
        const sendBtn = document.getElementById('send-message');
        sendBtn.disabled = e.target.value.trim().length === 0;
    });
    
    // Botones de acción rápida
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-btn')) {
            const action = e.target.getAttribute('data-action');
            this.handleQuickAction(action);
        }
    });
    
    // Cerrar con escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.chatbotOpen) {
            this.closeChatbot();
        }
    });
}

toggleChatbot() {
    const chatbotModal = document.getElementById('chatbot-modal');
    this.chatbotOpen = !this.chatbotOpen;
    
    if (this.chatbotOpen) {
        chatbotModal.classList.add('active');
        document.getElementById('chat-input')?.focus();
        
        // Ocultar notificación
        const notificationDot = document.getElementById('chatbot-notification');
        if (notificationDot) {
            notificationDot.style.display = 'none';
        }
    } else {
        chatbotModal.classList.remove('active');
    }
}

closeChatbot() {
    this.chatbotOpen = false;
    document.getElementById('chatbot-modal').classList.remove('active');
}

async sendChatMessage() {
    if (this.isTyping) return;
    
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (message) {
        // Agregar mensaje del usuario
        this.addChatMessage(message, 'user');
        chatInput.value = '';
        document.getElementById('send-message').disabled = true;
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        try {
            // Llamar a la API de OpenAI
            const response = await this.callOpenAI(message);
            
            // Ocultar indicador y mostrar respuesta
            this.hideTypingIndicator();
            this.addChatMessage(response, 'bot');
            
        } catch (error) {
            console.error('Error al comunicarse con la IA:', error);
            this.hideTypingIndicator();
            this.addChatMessage(
                'Disculpa, tengo dificultades técnicas. Por favor contacta directamente a comercial@aoxlab.com o llama al (+57) 604 7454.',
                'bot'
            );
        }
    }
}


async callOpenAI(userMessage) {
    const response = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: OPENAI_CONFIG.model,
            messages: [
                { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
                { role: 'user', content: userMessage }
            ],
            max_tokens: OPENAI_CONFIG.maxTokens,
            temperature: OPENAI_CONFIG.temperature
        })
    });
    
    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

addChatMessage(message, sender) {
    const chatBody = document.getElementById('chatbot-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }
    
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

showTypingIndicator() {
    this.isTyping = true;
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'flex';
}

hideTypingIndicator() {
    this.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';
}

handleQuickAction(action) {
    const actions = {
        'servicios': 'Quiero conocer más sobre los servicios de análisis que ofrecen',
        'cotizacion': 'Necesito solicitar una cotización para análisis de laboratorio',
        'resultados': 'Quiero consultar los resultados de mis análisis'
    };
    
    if (actions[action]) {
        document.getElementById('chat-input').value = actions[action];
        this.sendChatMessage();
    }
}

escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar después de asegurar que el DOM está listo
    setTimeout(() => {
        const website = new AoxlabWebsite();
    }, 100);
});

// Registrar Service Worker para PWA (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Añadir estilos CSS para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
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
    
    .notification {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-family: var(--font-primary);
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

//Aqui estara el apartado completo del chatbot



// Prompt inicial para el chatbot de AOXLAB
const CHATBOT_SYSTEM_PROMPT = `Eres un asistente virtual especializado de AOXLAB, un laboratorio de análisis y certificación en Medellín, Colombia. 

INFORMACIÓN SOBRE AOXLAB:
- Laboratorio especializado en análisis microbiológicos, metales pesados y cannabinoides
- Certificaciones ISO/IEC 17025:2017 y próximamente ISO 17065
- 13 años de experiencia, más de 300 equipos, 2500+ clientes satisfechos
- Ubicación: Calle 32F #74B-122, Laureles, Medellín
- Teléfono: (+57) 604 7454
- Email: comercial@aoxlab.com

SERVICIOS PRINCIPALES:
1. Análisis Microbiológicos (recuento de aerobios, detección de patógenos, análisis de agua)
2. Metales Pesados (plomo, mercurio, cadmio por ICP-MS)
3. Perfil de Cannabinoides (CBD, THC, CBG, CBN, terpenos)
4. Certificación ISO 17065 (productos ecológicos, agroindustriales, cosméticos)

INSTRUCCIONES:
- Responde de manera profesional, amigable y concisa
- Enfócate en los servicios y capacidades de AOXLAB
- Si no tienes información específica, dirige al cliente a contactar directamente
- Usa un tono técnico pero accesible
- Máximo 100 palabras por respuesta`;
