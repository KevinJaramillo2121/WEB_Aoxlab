// JavaScript específico para el Portal de Clientes AOXLAB
// Extiende funcionalidades de AoxlabWebsite manteniendo cohesión

class AoxlabPortalClientes extends AoxlabWebsite {
    constructor() {
        super();
        this.initPortalFeatures();
    }
    
    initPortalFeatures() {
        this.initLoginForm();
        this.initPasswordToggle();
        this.initFormValidation();
        this.initPortalAnimations();
        this.updateChatbotForPortal();
    }
    
    // === FORMULARIO DE LOGIN ===
    initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Auto-focus en el primer campo
        const usernameField = document.getElementById('username');
        if (usernameField) {
            setTimeout(() => usernameField.focus(), 500);
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const remember = document.getElementById('remember').checked;
        
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        
        // Mostrar loading
        this.showLoginLoading(true);
        
        try {
            // Simular autenticación (reemplazar con API real)
            await this.authenticateUser(username, password);
            
            // Guardar sesión si es necesario
            if (remember) {
                localStorage.setItem('aoxlab_remember_user', username);
            }
            
            // Redirigir al dashboard
            this.showNotification('¡Bienvenido al Portal AOXLAB!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard-clientes.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification('Credenciales incorrectas. Verifica tus datos.', 'error');
            console.error('Error de autenticación:', error);
        } finally {
            this.showLoginLoading(false);
        }
    }
    
    validateLoginForm(username, password) {
        let isValid = true;
        
        // Validar usuario
        if (!username) {
            this.showFieldError('username', 'El usuario es requerido');
            isValid = false;
        } else if (username.length < 3) {
            this.showFieldError('username', 'El usuario debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            this.clearFieldError('username');
        }
        
        // Validar contraseña
        if (!password) {
            this.showFieldError('password', 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else {
            this.clearFieldError('password');
        }
        
        return isValid;
    }
    
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        
        // Remover error previo
        this.clearFieldError(fieldId);
        
        // Agregar clase de error
        field.style.borderColor = '#dc3545';
        
        // Crear mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        inputGroup.appendChild(errorDiv);
    }
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        const existingError = inputGroup.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = '';
    }
    
    showLoginLoading(show) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Verificando...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    }
    
    async authenticateUser(username, password) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simular validación (reemplazar con API real)
        if (username === 'demo' && password === 'demo123') {
            return { success: true, token: 'demo_token_123' };
        } else {
            throw new Error('Credenciales inválidas');
        }
    }
    
    // === TOGGLE DE CONTRASEÑA ===
    initPasswordToggle() {
        const toggleBtn = document.querySelector('.toggle-password');
        const passwordField = document.getElementById('password');
        
        if (toggleBtn && passwordField) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = passwordField.type === 'password';
                passwordField.type = isPassword ? 'text' : 'password';
                
                const icon = toggleBtn.querySelector('i');
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            });
        }
    }
    
    // === VALIDACIÓN EN TIEMPO REAL ===
    initFormValidation() {
        const inputs = document.querySelectorAll('#loginForm input');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFieldError(input.id);
            });
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        switch (field.id) {
            case 'username':
                if (!value) {
                    this.showFieldError('username', 'El usuario es requerido');
                } else if (value.length < 3) {
                    this.showFieldError('username', 'Mínimo 3 caracteres');
                }
                break;
                
            case 'password':
                if (!value) {
                    this.showFieldError('password', 'La contraseña es requerida');
                } else if (value.length < 6) {
                    this.showFieldError('password', 'Mínimo 6 caracteres');
                }
                break;
        }
    }
    
    // === ANIMACIONES ESPECÍFICAS DEL PORTAL ===
    initPortalAnimations() {
        // Animación de aparición escalonada para beneficios
        this.animatePortalCards();
        
        // Efectos de hover mejorados
        this.enhancePortalInteractions();
        
        // Auto-scroll suave al formulario si viene con parámetro
        this.handleAutoScroll();
    }
    
    animatePortalCards() {
        const cards = document.querySelectorAll('.beneficio-card, .funcionalidad-card');
        
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
        }, { threshold: 0.2 });
        
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
    
    enhancePortalInteractions() {
        // Efecto de float en formulario
        const form = document.querySelector('.acceso-form');
        if (form) {
            form.addEventListener('mouseenter', () => {
                form.style.transform = 'translateY(-2px)';
            });
            
            form.addEventListener('mouseleave', () => {
                form.style.transform = 'translateY(0)';
            });
        }
        
        // Efectos en iconos de beneficios
        const beneficioIcons = document.querySelectorAll('.beneficio-icon');
        beneficioIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    handleAutoScroll() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'login') {
            setTimeout(() => {
                document.getElementById('portal-acceso').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500);
        }
    }
    
    // === CHATBOT PERSONALIZADO PARA PORTAL ===
    updateChatbotForPortal() {
        // Personalizar mensajes del chatbot para el portal
        this.portalChatResponses = {
            'portal': '¡Estás en el portal de clientes! Puedo ayudarte con problemas de acceso, recuperación de contraseña o navegación por el portal.',
            'acceso': 'Si tienes problemas para acceder, verifica tu usuario y contraseña. También puedes usar "Recuperar acceso" o contactarnos.',
            'resultados': 'Una vez logueado, podrás ver todos tus resultados en la sección "Mis Análisis" y descargarlos en formato PDF.',
            'soporte': 'Para soporte técnico con el portal, puedes usar el chat en vivo o llamar al (+57) 604 7454. Nuestro equipo te ayudará.',
            'default': 'Estoy aquí para ayudarte con el portal de clientes. Puedes preguntarme sobre acceso, resultados, o cualquier función del portal.'
        };
    }
    
    // Sobreescribir función de respuesta del chatbot
    generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        let response = this.portalChatResponses.default;
        
        if (message.includes('portal') || message.includes('acceso') || message.includes('login')) {
            response = this.portalChatResponses.portal;
        } else if (message.includes('contraseña') || message.includes('password') || message.includes('olvidé')) {
            response = this.portalChatResponses.acceso;
        } else if (message.includes('resultado') || message.includes('descarga') || message.includes('pdf')) {
            response = this.portalChatResponses.resultados;
        } else if (message.includes('soporte') || message.includes('ayuda') || message.includes('problema')) {
            response = this.portalChatResponses.soporte;
        }
        
        this.addChatMessage(response, 'bot');
    }
    
    // === UTILIDADES ESPECÍFICAS ===
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `portal-notification ${type}`;
        
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        };
        
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'info': '#2BA1D4'
        };
        
        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-family: var(--font-primary);
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
    
    // Cargar usuario recordado
    loadRememberedUser() {
        const rememberedUser = localStorage.getItem('aoxlab_remember_user');
        if (rememberedUser) {
            const usernameField = document.getElementById('username');
            const rememberCheckbox = document.getElementById('remember');
            
            if (usernameField) {
                usernameField.value = rememberedUser;
            }
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
    
    // Override del método onPageLoad
    onPageLoad() {
        super.onPageLoad();
        this.loadRememberedUser();
        
        // Mostrar mensaje de bienvenida si es primera visita
        if (!localStorage.getItem('aoxlab_portal_visited')) {
            setTimeout(() => {
                this.showNotification('¡Bienvenido al Portal de Clientes AOXLAB!', 'info');
                localStorage.setItem('aoxlab_portal_visited', 'true');
            }, 1000);
        }
    }
}

// Inicializar la clase cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const portalClientes = new AoxlabPortalClientes();
        
        // Hacer disponible globalmente para debugging
        window.portalClientes = portalClientes;
    }, 100);
});

// Estilos CSS adicionales para notificaciones
const portalNotificationStyles = document.createElement('style');
portalNotificationStyles.textContent = `
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
    
    .portal-notification {
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .portal-notification i {
        font-size: 1.1rem;
        flex-shrink: 0;
    }
`;
document.head.appendChild(portalNotificationStyles);
