/**
 * AOXLAB Website - Sistema Completo de Interacciones
 * Versión: 2.0
 * Descripción: Código JavaScript principal para el sitio web de AOXLAB
 * Incluye: Carrusel, servicios expandibles, chatbot, efectos de scroll, tema oscuro
 * Autor: Equipo AOXLAB
 * Fecha: 2025
 */

// ====================================================================
// CONFIGURACIONES GLOBALES
// ====================================================================

/**
 * Configuración del chatbot con OpenAI
 */
const OPENAI_CONFIG = {
    apiKey: '', // Configurar con tu API key de OpenAI
    model: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7
};

/**
 * Prompt del sistema para el chatbot de AOXLAB
 */
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

// ====================================================================
// CLASE PRINCIPAL DEL SITIO WEB
// ====================================================================

/**
 * Clase principal que maneja todas las funcionalidades del sitio web de AOXLAB
 */
class AoxlabWebsite {
    /**
     * Constructor - Inicializa las propiedades del sitio web
     */
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isScrolling = false;
        this.autoplayInterval = null;
        this.autoplayPaused = false;
        this.manuallyPaused = false;
        this.chatbotOpen = false;
        this.isTyping = false;
        this.slideViewStartTime = Date.now();
        
        this.init();
    }
    
    /**
     * Inicializa todas las funcionalidades del sitio
     */
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
    this.initExpandableServices(); // Mantener solo esta línea
    this.initKeyboardNavigation();
    this.initAnalyticsTracking();
    this.preloadCarouselImages();
    }
    
    /**
     * Configura los event listeners principales del sitio
     */
    setupEventListeners() {
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
        
        document.addEventListener('DOMContentLoaded', () => {
            this.preloadImages();
        });
    }

    // ====================================================================
    // SISTEMA DE CARRUSEL DE IMÁGENES
    // ====================================================================

    /**
     * Inicializa el carrusel de imágenes del hero section
    /**
 * Inicializa el carrusel de imágenes del hero section
 */
    initCarousel() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) {
            console.warn('Carrusel no encontrado');
            return;
        }
        
        // Reinicializar propiedades
        this.currentSlide = 0;
        this.autoplayPaused = false;
        this.manuallyPaused = false;
        
        // Seleccionar elementos del carrusel
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        
        this.totalSlides = this.slides.length;
        
        console.log(`Carrusel inicializado con ${this.totalSlides} slides`);
        
        if (this.totalSlides === 0) {
            console.warn('No se encontraron slides');
            return;
        }
        
        // Asegurar que el primer slide esté activo
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === 0);
        });
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === 0);
        });
        
        // Configurar tooltips para indicadores
        this.setupIndicatorTooltips();
        
        // Event listeners del carrusel - Con verificación
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
            console.log('Event listener agregado al botón anterior');
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
            console.log('Event listener agregado al botón siguiente');
        }
        
        // Indicadores con navegación directa
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Clic en indicador ${index}`);
                this.goToSlide(index);
            });
            
            // Hacer que los indicadores sean más accesibles
            indicator.setAttribute('tabindex', '0');
            indicator.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
        
        // Event listeners para los CTAs de todos los slides
        this.slides.forEach((slide, slideIndex) => {
            const ctaBtns = slide.querySelectorAll('.cta-btn');
            ctaBtns.forEach((btn, btnIndex) => {
                btn.addEventListener('click', (e) => {
                    // No prevenir default aquí ya que queremos que los enlaces funcionen
                    console.log(`CTA ${btnIndex} clickeado en slide ${slideIndex}`);
                    this.trackSlideInteraction(`slide_${slideIndex}`, `cta_${btnIndex}_click`);
                });
            });
        });
        
        // Auto-play del carrusel
        this.startAutoplay();
        
        // Pausar/reanudar en hover
        carousel.addEventListener('mouseenter', () => {
            console.log('Mouse enter - pausando autoplay');
            this.pauseAutoplay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            console.log('Mouse leave - reanudando autoplay');
            if (!this.manuallyPaused) {
                this.resumeAutoplay();
            }
        });
        
        // Soporte para touch/swipe en móviles
        this.initTouchControls(carousel);
        
        // Verificar que todo esté funcionando
        console.log('Carrusel completamente inicializado');
        console.log('Slides:', this.slides.length);
        console.log('Indicadores:', this.indicators.length);
        console.log('Botón anterior:', !!this.prevBtn);
        console.log('Botón siguiente:', !!this.nextBtn);
    }

    

    /**
     * Configura tooltips informativos para los indicadores del carrusel
     */
    setupIndicatorTooltips() {
        this.indicators.forEach((indicator, index) => {
            const slideData = this.slides[index]?.getAttribute('data-slide');
            const tooltips = {
                'vida-util': 'Vida Útil',
                'microbiologia-anual': 'Microbiología',
                'biodegradabilidad': 'Biodegradabilidad'
            };
            indicator.setAttribute('data-tooltip', tooltips[slideData] || `Slide ${index + 1}`);
        });
    }

    /**
     * Navega al slide anterior
     */
    prevSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.updateCarousel();
        this.trackSlideInteraction('manual_navigation', 'previous');
    }
    
    /**
     * Navega al siguiente slide
     */
    nextSlide() {
        this.currentSlide = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.updateCarousel();
        this.trackSlideInteraction('manual_navigation', 'next');
    }
    
    /**
     * Navega directamente a un slide específico
     * @param {number} index - Índice del slide
     */
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.trackSlideInteraction('indicator_click', index);
    }
    
    /**
     * Actualiza la visualización del carrusel
     */
    /**
 * Actualiza la visualización del carrusel con mejor validación
 */
    updateCarousel() {
        console.log(`Actualizando carrusel - slide actual: ${this.currentSlide}`);
        
        // Validar índice actual
        if (this.currentSlide < 0) {
            this.currentSlide = this.totalSlides - 1;
        } else if (this.currentSlide >= this.totalSlides) {
            this.currentSlide = 0;
        }
        
        // Actualizar slides
        this.slides.forEach((slide, index) => {
            const isActive = index === this.currentSlide;
            slide.classList.toggle('active', isActive);
            
            // Mejorar accesibilidad
            slide.setAttribute('aria-hidden', !isActive);
            if (isActive) {
                slide.setAttribute('aria-live', 'polite');
            } else {
                slide.removeAttribute('aria-live');
            }
        });
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentSlide;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-pressed', isActive);
        });
        
        // Animar contenido del slide
        this.animateSlideContent();
        
        // Tracking de visualización
        const currentSlideData = this.slides[this.currentSlide]?.getAttribute('data-slide');
        if (currentSlideData) {
            this.trackSlideViewTime(currentSlideData);
        }
        
        console.log(`Slide ${this.currentSlide} ahora activo`);
    }

    
    /**
     * Anima el contenido del slide activo
     */
    animateSlideContent() {
        const activeSlide = this.slides[this.currentSlide];
        const content = activeSlide.querySelector('.slide-content');
        
        if (content) {
            // Pausar animaciones en slides no activos
            this.slides.forEach((slide, index) => {
                if (index !== this.currentSlide) {
                    const slideContent = slide.querySelector('.slide-content');
                    if (slideContent) {
                        slideContent.style.animationPlayState = 'paused';
                    }
                }
            });
            
            // Activar animación del slide actual
            content.style.animation = 'none';
            content.offsetHeight; // Trigger reflow
            content.style.animation = 'fadeInUp 1s ease';
            content.style.animationPlayState = 'running';
        }
    }
    
    /**
     * Inicia la reproducción automática del carrusel
     */
    /**
 * Inicia la reproducción automática del carrusel con mejor control
 */
    startAutoplay() {
        // Limpiar cualquier interval existente
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
        
        // Solo iniciar si no está pausado manualmente
        if (!this.manuallyPaused) {
            console.log('Iniciando autoplay del carrusel');
            this.autoplayInterval = setInterval(() => {
                if (!this.autoplayPaused && !this.manuallyPaused) {
                    this.nextSlide();
                }
            }, 20000); // 5 segundos entre slides
            
            this.autoplayPaused = false;
        }
    }

    /**
     * Pausa la reproducción automática del carrusel
     */
    pauseAutoplay() {
        this.autoplayPaused = true;
        console.log('Autoplay pausado');
    }

    /**
     * Reanuda la reproducción automática del carrusel
     */
    resumeAutoplay() {
        if (!this.manuallyPaused) {
            this.autoplayPaused = false;
            this.startAutoplay();
            console.log('Autoplay reanudado');
        }
    }

    /**
     * Pausa manualmente el autoplay (para controles de usuario)
     */
    toggleManualPause() {
        this.manuallyPaused = !this.manuallyPaused;
        if (this.manuallyPaused) {
            this.pauseAutoplay();
            console.log('Autoplay pausado manualmente');
        } else {
            this.resumeAutoplay();
            console.log('Autoplay reanudado manualmente');
        }
    }

    
    /**
     * Pausa la reproducción automática del carrusel
     */
    pauseAutoplay() {
        this.autoplayPaused = true;
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    /**
     * Reanuda la reproducción automática del carrusel
     */
    resumeAutoplay() {
        this.autoplayPaused = false;
        this.startAutoplay();
    }
    
    /**
     * Reinicia completamente el autoplay del carrusel
     */
    restartAutoplay() {
        this.pauseAutoplay();
        setTimeout(() => {
            this.autoplayPaused = false;
            this.startAutoplay();
        }, 100);
    }

    /**
     * Inicializa controles táctiles para dispositivos móviles
     * @param {Element} carousel - Elemento del carrusel
     */
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
            this.resumeAutoplay();
        });
    }

    // ====================================================================
    // SERVICIOS EXPANDIBLES
    // ====================================================================

    /**
     * Inicializa los servicios expandibles
     */
    initExpandableServices() {
    // Eliminar el método duplicado y usar solo esta versión
    setTimeout(() => {
        new ExpandableServices();
    }, 100); // Pequeño delay para asegurar que el DOM esté listo
}
    // ====================================================================
    // EFECTOS DE SCROLL
    // ====================================================================

    /**
     * Inicializa todos los efectos relacionados con el scroll
     */
    initScrollEffects() {
        this.initHeaderScroll();
        this.initScrollToTop();
        this.initSmoothScrolling();
        this.initScrollAnimations();
    }
    initExpandableServices() {
    new ExpandableServices(); // Esta función debe existir
    }
    /**
     * Maneja el efecto del header al hacer scroll
     */
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
            
            // Ocultar/mostrar header en scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    /**
     * Inicializa el botón de scroll hacia arriba
     */
    initScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn?.classList.add('visible');
            } else {
                scrollTopBtn?.classList.remove('visible');
            }
        });
        
        scrollTopBtn?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /**
     * Configura el scroll suave para enlaces ancla
     */
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
    
    /**
     * Inicializa las animaciones activadas por scroll
     */
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

    // ====================================================================
    // CONTADORES ANIMADOS
    // ====================================================================

    /**
     * Inicializa los contadores animados de estadísticas
     */
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
    
    /**
     * Anima un contador específico
     * @param {Element} element - Elemento del contador
     */
animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 segundos
    const start = performance.now();
    const startValue = 0;
    const format = element.getAttribute('data-format');

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        let currentValue = Math.floor(startValue + (target - startValue) * easeProgress);

        if (format === 'millones') {
            // Mostrar como "2M"
            let millionValue = Math.floor(currentValue / 1000000);
            if (millionValue < 1) millionValue = 1; // Para que no muestre 0M al inicio
            element.textContent = millionValue + 'M';
        } else {
            element.textContent = currentValue.toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            if (format === 'millones') {
                element.textContent = Math.floor(target / 1000000) + 'M';
            } else {
                element.textContent = target.toLocaleString();
            }
        }
    };

    requestAnimationFrame(updateCounter);
}


    // ====================================================================
    // SISTEMA DE CHATBOT
    // ====================================================================

    /**
     * Inicializa el sistema de chatbot
     */
    initChatbot() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotModal = document.getElementById('chatbot-modal');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        
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
            if (sendBtn) {
                sendBtn.disabled = e.target.value.trim().length === 0;
            }
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
    
    /**
     * Alterna la visibilidad del chatbot
     */
    toggleChatbot() {
        const chatbotModal = document.getElementById('chatbot-modal');
        this.chatbotOpen = !this.chatbotOpen;
        
        if (this.chatbotOpen) {
            chatbotModal?.classList.add('active');
            document.getElementById('chat-input')?.focus();
            
            // Ocultar notificación
            const notificationDot = document.getElementById('chatbot-notification');
            if (notificationDot) {
                notificationDot.style.display = 'none';
            }
        } else {
            chatbotModal?.classList.remove('active');
        }
    }
    
    /**
     * Cierra el chatbot
     */
    closeChatbot() {
        this.chatbotOpen = false;
        const chatbotModal = document.getElementById('chatbot-modal');
        chatbotModal?.classList.remove('active');
    }
    
    /**
     * Envía un mensaje del chat
     */
    async sendChatMessage() {
        if (this.isTyping) return;
        
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value.trim();
        
        if (message) {
            // Agregar mensaje del usuario
            this.addChatMessage(message, 'user');
            chatInput.value = '';
            
            const sendBtn = document.getElementById('send-message');
            if (sendBtn) sendBtn.disabled = true;
            
            // Mostrar indicador de escritura
            this.showTypingIndicator();
            
            try {
                // Llamar a la API de OpenAI (si está configurada)
                let response;
                if (OPENAI_CONFIG.apiKey) {
                    response = await this.callOpenAI(message);
                } else {
                    response = this.generateBotResponse(message);
                }
                
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
    
    /**
     * Llama a la API de OpenAI para generar respuestas
     * @param {string} userMessage - Mensaje del usuario
     * @returns {Promise<string>} - Respuesta del bot
     */
    async callOpenAI(userMessage) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    
    /**
     * Genera respuestas automáticas del bot (fallback)
     * @param {string} userMessage - Mensaje del usuario
     * @returns {string} - Respuesta del bot
     */
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
        
        return response;
    }
    
    /**
     * Agrega un mensaje al chat
     * @param {string} message - Contenido del mensaje
     * @param {string} sender - Tipo de remitente ('user' o 'bot')
     */
    addChatMessage(message, sender) {
        const chatBody = document.getElementById('chatbot-body');
        if (!chatBody) return;
        
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
    
    /**
     * Muestra el indicador de escritura
     */
    showTypingIndicator() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }
    }
    
    /**
     * Oculta el indicador de escritura
     */
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }
    
    /**
     * Maneja las acciones rápidas del chatbot
     * @param {string} action - Acción a ejecutar
     */
    handleQuickAction(action) {
        const actions = {
            'servicios': 'Quiero conocer más sobre los servicios de análisis que ofrecen',
            'cotizacion': 'Necesito solicitar una cotización para análisis de laboratorio',
            'resultados': 'Quiero consultar los resultados de mis análisis'
        };
        
        if (actions[action]) {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = actions[action];
                this.sendChatMessage();
            }
        }
    }
    
    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string} - Texto escapado
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ====================================================================
    // TEMA OSCURO/CLARO
    // ====================================================================

    /**
     * Inicializa el sistema de tema oscuro/claro
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        const logo = document.querySelector('.logo img');
        
        /**
         * Actualiza el logo según el tema
         * @param {string} theme - Tema actual ('dark' o 'light')
         */
        const updateLogo = (theme) => {
            if (logo) {
                if (theme === 'dark') {
                    logo.src = logo.getAttribute('data-logo-dark') || logo.src;
                } else {
                    logo.src = logo.getAttribute('data-logo-light') || logo.src;
                }
            }
        };
        
        // Aplicar tema guardado al cargar
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            updateLogo('dark');
        } else {
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
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

    // ====================================================================
    // SELECTOR DE IDIOMA
    // ====================================================================

    /**
     * Inicializa el selector de idioma
     */
    initLanguageSelector() {
        document.querySelectorAll('[data-lang]').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }
    
    /**
     * Cambia el idioma del sitio
     * @param {string} lang - Código del idioma ('es' o 'en')
     */
    changeLanguage(lang) {
        const langBtn = document.getElementById('language-btn');
        
        if (lang === 'en') {
            if (langBtn) langBtn.innerHTML = '<span class="flag-icon">🇺🇸</span> EN <i class="fas fa-chevron-down"></i>';
            this.showNotification('Language changed to English');
        } else {
            if (langBtn) langBtn.innerHTML = '<span class="flag-icon">🇪🇸</span> ES <i class="fas fa-chevron-down"></i>';
            this.showNotification('Idioma cambiado a Español');
        }
        
        localStorage.setItem('language', lang);
    }

    // ====================================================================
    // MENÚ MÓVIL
    // ====================================================================

    /**
     * Inicializa el menú móvil
     */
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navList = document.querySelector('.nav-list');
        
        mobileToggle?.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navList?.classList.toggle('mobile-open');
            
            // Animar hamburguesa
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                if (spans[0]) spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (spans[1]) spans[1].style.opacity = '0';
                if (spans[2]) spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
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
                mobileToggle?.classList.remove('active');
                navList?.classList.remove('mobile-open');
            });
        });
    }

    // ====================================================================
    // BOTONES FLOTANTES
    // ====================================================================

    /**
     * Inicializa los botones flotantes (WhatsApp, etc.)
     */
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


        // Scroll suave al hacer clic en el enlace de portafolios
document.addEventListener('DOMContentLoaded', function() {
    const portfolioLink = document.querySelector('.download-portfolio-btn');
    
    if (portfolioLink) {
        portfolioLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = document.querySelector('#portafolios');
            if (targetSection) {
                // Scroll suave con offset para header fijo
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

    }

    // ====================================================================
    // NAVEGACIÓN POR TECLADO
    // ====================================================================

    /**
     * Inicializa la navegación por teclado
     */
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.chatbotOpen) return; // No interferir con el chatbot
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ': // Barra espaciadora
                    e.preventDefault();
                    this.toggleAutoplay();
                    break;
            }
        });
    }
    
    /**
     * Alterna el autoplay del carrusel
     */
    toggleAutoplay() {
        if (this.autoplayPaused) {
            this.resumeAutoplay();
        } else {
            this.pauseAutoplay();
        }
    }

    // ====================================================================
    // ANALYTICS Y TRACKING
    // ====================================================================

    /**
     * Inicializa el tracking de analytics
     */
    initAnalyticsTracking() {
        // Tracking de clics en CTAs del carrusel
        document.querySelectorAll('.carousel-slide .cta-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slide = e.target.closest('.carousel-slide');
                const slideData = slide?.getAttribute('data-slide');
                const buttonType = e.target.classList.contains('primary') ? 'primary' : 'secondary';
                
                this.trackEvent(`CTA_${buttonType}_${slideData}`, 'hero_interactions');
            });
        });
        
        // Inicializar tiempo de visualización
        this.slideViewStartTime = Date.now();
    }
    
    /**
     * Rastrea interacciones con slides
     * @param {string} slideData - Datos del slide
     * @param {string} action - Acción realizada
     */
    trackSlideInteraction(slideData, action) {
        const trackingData = {
            'vida-util': 'Estudios_Vida_Util',
            'microbiologia-anual': 'Cronograma_Microbiologia',
            'biodegradabilidad': 'Biodegradabilidad_Acreditada'
        };
        
        this.trackEvent(`${trackingData[slideData]}_${action}`, 'hero_carousel');
    }
    
    /**
     * Rastrea tiempo de visualización de slides
     * @param {string} slideData - Datos del slide
     */
    trackSlideViewTime(slideData) {
        const viewTime = Date.now() - this.slideViewStartTime;
        this.trackEvent(`slide_view_time_${slideData}`, 'engagement', viewTime);
        this.slideViewStartTime = Date.now();
    }
    
    /**
     * Función genérica para tracking de eventos
     * @param {string} eventName - Nombre del evento
     * @param {string} category - Categoría del evento
     * @param {number} value - Valor opcional del evento
     */
    trackEvent(eventName, category, value = null) {
        // Implementación con Google Analytics
        if (typeof gtag !== 'undefined') {
            const eventData = {
                event_category: category,
                event_label: 'AOXLAB Website'
            };
            
            if (value !== null) {
                eventData.value = value;
            }
            
            gtag('event', eventName, eventData);
        }
        
        console.log(`Event tracked: ${eventName} - ${category}`, value ? `Value: ${value}` : '');
    }

    // ====================================================================
    // PRELOADER Y OPTIMIZACIÓN
    // ====================================================================

    /**
     * Precarga las imágenes del carrusel
     */
    preloadCarouselImages() {
        const imageUrls = [
            'img/hero-vida-util.jpg',
            'img/hero-microbiologia-anual.jpg',
            'img/hero-biodegradabilidad.jpg'
        ];
        
        imageUrls.forEach((url, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Imagen ${index + 1} precargada: ${url}`);
            };
            img.onerror = () => {
                console.warn(`Error al precargar imagen: ${url}`);
            };
            img.src = url;
        });
    }
    
    /**
     * Precarga imágenes generales del sitio
     */
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

    // ====================================================================
    // EVENTOS DE SISTEMA
    // ====================================================================

    /**
     * Maneja el evento de carga de página
     */
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
    
    /**
     * Maneja el evento de scroll
     */
    onScroll() {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        requestAnimationFrame(() => {
            this.updateParallax();
            this.isScrolling = false;
        });
    }
    
    /**
     * Maneja el evento de redimensión de ventana
     */
    onResize() {
        // Recalcular dimensiones del carrusel
        if (this.slides && this.slides.length > 0) {
            this.updateCarousel();
        }
        
        // Ajustar chatbot en móviles
        const chatbotModal = document.getElementById('chatbot-modal');
        if (window.innerWidth <= 768 && chatbotModal) {
            chatbotModal.style.width = 'calc(100vw - 20px)';
            chatbotModal.style.height = '70vh';
        }
    }
    
    /**
     * Actualiza efectos de parallax
     */
    updateParallax() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const speed = scrolled * 0.2; // Reducido para efecto más sutil
            heroSection.style.transform = `translateY(${speed}px)`;
        }
    }

    // ====================================================================
    // UTILIDADES
    // ====================================================================

    /**
     * Muestra una notificación temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación ('info', 'success', 'error')
     */
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
}

// ====================================================================
// CLASE DE SERVICIOS EXPANDIBLES
// ====================================================================

/**
 * Clase para manejar los servicios expandibles
 */
class ExpandableServices {
    constructor() {
        this.expandedCards = new Set(); // Para trackear cuáles están expandidas
        this.init();
    }

    /**
     * Inicializa los servicios expandibles
     */
    init() {
        // Esperar un momento para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            this.bindEvents();
            this.setupAccessibility();
            console.log('ExpandableServices initialized'); // Para debug
        }, 100);
    }

    /**
     * Vincula los eventos de los servicios expandibles
     */
    bindEvents() {
        // Event listeners para las tarjetas completas
        const serviceCards = document.querySelectorAll('.service-card.expandable');
        console.log(`Found ${serviceCards.length} expandable service cards`); // Para debug
        
        serviceCards.forEach((card, index) => {
            // Hacer toda la tarjeta clickeable
            card.addEventListener('click', (e) => {
                // Prevenir el comportamiento por defecto
                e.preventDefault();
                
                // Ignorar clics en enlaces o botones específicos dentro de la tarjeta
                if (e.target.closest('a') || e.target.closest('button:not(.expand-btn)')) {
                    return;
                }
                
                this.toggleService(e, index);
            });

            // Soporte para navegación por teclado
            card.addEventListener('keydown', (e) => this.handleKeydown(e, index));
            
            // Mejorar la experiencia visual al pasar el mouse
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('expanded')) {
                    card.style.cursor = 'pointer';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.cursor = 'default';
            });
        });

        // Event listeners específicos para el botón de expandir (para mejor UX)
        const expandButtons = document.querySelectorAll('.expand-btn');
        console.log(`Found ${expandButtons.length} expand buttons`); // Para debug
        
        expandButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se dispare dos veces
                e.preventDefault();
                this.toggleService(e, index);
            });
        });
    }

    /**
     * Configura la accesibilidad para los servicios expandibles
     */
    setupAccessibility() {
        const serviceCards = document.querySelectorAll('.service-card.expandable');
        
        serviceCards.forEach((card, index) => {
            const details = card.querySelector('.service-details');
            const expandBtn = card.querySelector('.expand-btn');
            
            // Configurar la tarjeta como elemento interactivo
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-controls', `service-details-${index + 1}`);
            card.setAttribute('aria-expanded', 'false');
            card.setAttribute('aria-label', 'Expandir información del servicio');
            
            if (details) {
                details.id = `service-details-${index + 1}`;
                details.setAttribute('aria-labelledby', `service-card-${index + 1}`);
            }
            
            if (expandBtn) {
                expandBtn.setAttribute('aria-label', 'Alternar detalles del servicio');
                // Hacer que el botón no sea tabulable ya que la tarjeta completa lo es
                expandBtn.setAttribute('tabindex', '-1');
            }
        });
    }

    /**
     * Alterna el estado expandido de un servicio
     * @param {Event} e - Evento del click
     * @param {number} index - Índice del servicio
     */
    toggleService(e, index) {
        const serviceCards = document.querySelectorAll('.service-card.expandable');
        const card = serviceCards[index];
        
        if (!card) {
            console.warn(`Service card at index ${index} not found`);
            return;
        }
        
        const expandBtn = card.querySelector('.expand-btn');
        const details = card.querySelector('.service-details');
        const isExpanded = card.classList.contains('expanded');
        
        console.log(`Toggling service ${index}, currently expanded: ${isExpanded}`); // Para debug
        
        // Toggle expanded state con animación suave
        if (isExpanded) {
            card.classList.remove('expanded');
            this.expandedCards.delete(index);
            
            // Animar el cierre
            if (details) {
                details.style.maxHeight = details.scrollHeight + 'px';
                details.offsetHeight; // Force reflow
                details.style.maxHeight = '0px';
            }
        } else {
            card.classList.add('expanded');
            this.expandedCards.add(index);
            
            // Animar la apertura
            if (details) {
                details.style.maxHeight = '0px';
                details.offsetHeight; // Force reflow
                details.style.maxHeight = details.scrollHeight + 'px';
                
                // Limpiar el estilo después de la animación
                setTimeout(() => {
                    if (card.classList.contains('expanded')) {
                        details.style.maxHeight = 'none';
                    }
                }, 300);
            }
        }
        
        const newExpandedState = !isExpanded;
        
        // Update ARIA attributes
        card.setAttribute('aria-expanded', newExpandedState.toString());
        
        if (expandBtn) {
            expandBtn.setAttribute('aria-expanded', newExpandedState.toString());
            
            // Update button text and icon
            const buttonText = expandBtn.querySelector('span');
            const buttonIcon = expandBtn.querySelector('i');
            
            if (buttonText) {
                buttonText.textContent = newExpandedState ? 'Ver menos detalles' : 'Ver más detalles';
            }
            
            if (buttonIcon) {
                buttonIcon.className = newExpandedState ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
            }
        }
        
        // Scroll to card if expanding
        if (newExpandedState) {
            setTimeout(() => {
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const elementPosition = card.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }, 150); // Reducido el tiempo para mejor UX
        }
        
        // Track analytics
        this.trackServiceInteraction(index, newExpandedState ? 'expand' : 'collapse');
    }

    /**
     * Maneja la navegación por teclado
     * @param {KeyboardEvent} e - Evento del teclado
     * @param {number} index - Índice del servicio
     */
    handleKeydown(e, index) {
        // Support for Enter and Space keys
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleService(e, index);
        }
        
        // Soporte para navegación con flechas
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const serviceCards = document.querySelectorAll('.service-card.expandable');
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = index < serviceCards.length - 1 ? index + 1 : 0;
            } else {
                nextIndex = index > 0 ? index - 1 : serviceCards.length - 1;
            }
            
            serviceCards[nextIndex]?.focus();
        }
    }

    /**
     * Rastrea interacciones con los servicios
     * @param {number} index - Índice del servicio
     * @param {string} action - Acción realizada
     */
    trackServiceInteraction(index, action) {
        const serviceNames = [
            'Cronograma_Microbiologia',
            'Estudios_Vida_Util',
            'Biodegradabilidad_Acreditados'
        ];
        
        if (typeof gtag !== 'undefined') {
            gtag('event', `service_${action}`, {
                event_category: 'expandable_services',
                event_label: serviceNames[index] || `Service_${index}`,
                value: index + 1
            });
        }
        
        console.log(`Service ${action}: ${serviceNames[index] || `Service_${index}`}`);
    }
}

// ====================================================================
// FUNCIONES UTILITARIAS GLOBALES
// ====================================================================

/**
 * Muestra notificación de descarga de certificados
 * @param {string} certificateName - Nombre del certificado
 */
function showDownloadNotification(certificateName) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>¡Descargando certificado de ${certificateName}!</p>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInUp 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ====================================================================
// INICIALIZACIÓN Y ESTILOS
// ====================================================================

/**
 * Inicialización principal del sitio web
 */
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un momento para asegurar que todo el DOM esté listo
    setTimeout(() => {
        new AoxlabWebsite();
    }, 100);
    
    // Agregar event listeners para certificados
    const certificateButtons = document.querySelectorAll('.certificate-btn');
    certificateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const certificateName = this.querySelector('h3')?.textContent || 'Certificado';
            showDownloadNotification(certificateName);
        });
    });
});

/**
 * Registro de Service Worker para PWA (opcional)
 */
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

/**
 * Estilos CSS adicionales para notificaciones
 */
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
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
    }
    
    .notification {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-family: var(--font-primary);
        font-weight: 500;
    }
    
    .download-notification {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .download-notification i {
        font-size: 1.2rem;
    }
`;

document.head.appendChild(notificationStyles);

/**
 * Manejo de errores globales
 */
window.addEventListener('error', (e) => {
    console.error('Error en AOXLAB Website:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rechazada en AOXLAB Website:', e.reason);
});

console.log('🧪 AOXLAB Website - Sistema cargado exitosamente v2.0');
