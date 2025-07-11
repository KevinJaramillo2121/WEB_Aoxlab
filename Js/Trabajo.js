// Trabajo.js
class AoxlabTrabajo extends AoxlabWebsite {
    constructor() {
        super();
        this.initTrabajo();
    }
    
    initTrabajo() {
        this.initAplicacionForm();
        this.initVacanteButtons();
        this.initFileUpload();
        this.initSpaceValidation(); // Nueva función para validación de espacios

    }
    
    initAplicacionForm() {
        const form = document.getElementById('formTrabajo');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitApplication();
            }
        });
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es requerido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        const fileInput = document.getElementById('cv');
        if (fileInput.files[0].size > 5 * 1024 * 1024) {
            this.showFieldError(fileInput, 'El archivo debe ser menor a 5MB');
            isValid = false;
        }
        
        return isValid;
    }
    
    async submitApplication() {
        const formData = new FormData(form);
        
        try {
            this.showLoadingState(true);
            // Simular envío a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.showNotification('Aplicación enviada correctamente', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Error al enviar la aplicación', 'error');
            console.error('Error:', error);
        } finally {
            this.showLoadingState(false);
        }
    }
    
    showLoadingState(show) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Aplicación';
            submitBtn.disabled = false;
        }
    }
    
    initVacanteButtons() {
        document.querySelectorAll('.btn-aplicar').forEach(btn => {
            btn.addEventListener('click', () => {
                const vacante = btn.getAttribute('data-vacante');
                document.getElementById('vacante').value = vacante;
                document.getElementById('formulario').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    initFileUpload() {
        const fileInput = document.getElementById('cv');
        fileInput.addEventListener('change', () => {
            const fileName = fileInput.files[0]?.name || 'Ningún archivo seleccionado';
            fileInput.nextElementSibling.textContent = fileName;
        });
    }
    initSpaceValidation() {
        // Validación en tiempo real para todos los campos de texto
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
        
        textInputs.forEach(input => {
            // Validación durante la escritura
            input.addEventListener('input', (e) => {
                this.validateSpacesRealTime(e.target);
            });
            
            // Validación al perder el foco
            input.addEventListener('blur', (e) => {
                this.validateSpacesOnBlur(e.target);
            });
            
            // Prevenir espacios en campos específicos (si es necesario)
            if (input.dataset.noSpaces === 'true') {
                input.addEventListener('keypress', (e) => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        this.showFieldWarning(input, 'No se permiten espacios en este campo');
                    }
                });
            }
        });
    }
    
    validateSpacesRealTime(field) {
        const value = field.value;
        
        // Verificar si el campo tiene solo espacios
        if (value.length > 0 && value.trim().length === 0) {
            this.showFieldWarning(field, 'Este campo no puede contener solo espacios');
            field.classList.add('field-warning');
        } else {
            this.clearFieldWarning(field);
            field.classList.remove('field-warning');
        }
    }
    
    validateSpacesOnBlur(field) {
        const originalValue = field.value;
        const trimmedValue = originalValue.trim();
        
        // Auto-limpiar espacios al inicio y final
        if (originalValue !== trimmedValue) {
            field.value = trimmedValue;
            
            if (trimmedValue.length > 0) {
                this.showFieldInfo(field, 'Espacios eliminados automáticamente');
                setTimeout(() => this.clearFieldInfo(field), 2000);
            }
        }
        
        // Validar si quedó vacío después del trim
        if (field.hasAttribute('required') && trimmedValue.length === 0) {
            this.showFieldError(field, 'Este campo es requerido');
        } else {
            this.clearFieldError(field);
        }
    }
    
    initWeb3FormsIntegration() {
        const form = document.getElementById('formTrabajo');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateFormComplete()) return;
            
            try {
                this.showLoadingState(true);
                
                // Limpiar y preparar datos antes del envío
                this.cleanFormDataBeforeSubmit();
                this.addHiddenFormData();
                
                const formData = new FormData(form);
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.showSuccessMessage();
                    this.showCVReminder();
                    form.reset();
                    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    throw new Error(data.message || 'Error al enviar');
                }
                
            } catch (error) {
                this.showErrorMessage();
                console.error('Error:', error);
            } finally {
                this.showLoadingState(false);
            }
        });
    }
    
    cleanFormDataBeforeSubmit() {
        const form = document.getElementById('formTrabajo');
        const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
        
        textInputs.forEach(input => {
            // Limpiar espacios al inicio y final
            input.value = input.value.trim();
            
            // Normalizar espacios múltiples internos a uno solo
            if (input.dataset.normalizeSpaces === 'true') {
                input.value = input.value.replace(/\s+/g, ' ');
            }
        });
    }
    
    validateFormComplete() {
        let isValid = true;
        const form = document.getElementById('formTrabajo');
        const requiredFields = form.querySelectorAll('[required]');
        
        // Limpiar errores previos
        this.clearAllErrors();
        
        requiredFields.forEach(field => {
            const trimmedValue = field.value.trim();
            
            // Validar campos vacíos o solo con espacios
            if (trimmedValue.length === 0) {
                this.showFieldError(field, 'Este campo es requerido');
                isValid = false;
            } else {
                // Validaciones específicas por tipo de campo
                if (field.type === 'email') {
                    if (!this.validateEmail(trimmedValue)) {
                        this.showFieldError(field, 'Ingrese un correo electrónico válido');
                        isValid = false;
                    }
                }
                
                if (field.type === 'tel') {
                    if (!this.validatePhone(trimmedValue)) {
                        this.showFieldError(field, 'Ingrese un número de teléfono válido');
                        isValid = false;
                    }
                }
                
                // Validar longitud mínima (opcional)
                if (field.dataset.minLength) {
                    const minLength = parseInt(field.dataset.minLength);
                    if (trimmedValue.length < minLength) {
                        this.showFieldError(field, `Mínimo ${minLength} caracteres requeridos`);
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone) {
        // Permitir números colombianos con o sin código de país
        const phoneRegex = /^(\+57\s?)?[0-9\s-]{7,15}$/;
        return phoneRegex.test(phone);
    }
    
    showFieldWarning(field, message) {
        this.clearFieldWarning(field);
        
        const warningDiv = document.createElement('div');
        warningDiv.className = 'field-warning-message';
        warningDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        field.parentNode.appendChild(warningDiv);
        field.style.borderColor = '#f39c12';
        field.style.backgroundColor = 'rgba(243, 156, 18, 0.1)';
    }
    
    clearFieldWarning(field) {
        const existingWarning = field.parentNode.querySelector('.field-warning-message');
        if (existingWarning) {
            existingWarning.remove();
        }
        if (!field.classList.contains('error')) {
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        }
    }
    
    showFieldInfo(field, message) {
        this.clearFieldInfo(field);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'field-info-message';
        infoDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        
        field.parentNode.appendChild(infoDiv);
    }
    
    clearFieldInfo(field) {
        const existingInfo = field.parentNode.querySelector('.field-info-message');
        if (existingInfo) {
            existingInfo.remove();
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#e74c3c';
        field.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        field.classList.add('error');
    }
    
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        field.classList.remove('error');
    }
    
    clearAllErrors() {
        const form = document.getElementById('formTrabajo');
        const errorMessages = form.querySelectorAll('.field-error, .field-warning-message, .field-info-message');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = form.querySelectorAll('.error, .field-warning');
        errorFields.forEach(field => {
            field.classList.remove('error', 'field-warning');
            field.style.borderColor = '';
            field.style.backgroundColor = '';
        });
    }
    
    addHiddenFormData() {
        const form = document.getElementById('formTrabajo');
        
        // Fecha y hora
        this.addHiddenField(form, 'Fecha_de_Aplicacion', 
            new Date().toLocaleString('es-CO', {
                timeZone: 'America/Bogota',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        );
        
        // Información adicional
        this.addHiddenField(form, 'Navegador_Usuario', this.getBrowserInfo());
        this.addHiddenField(form, 'Pagina_Origen', `${window.location.href} - Portal de Empleo AOXLAB`);
        this.addHiddenField(form, 'Tipo_Formulario', 'Aplicación Laboral');
        
        // Información estructurada
        const nombreCompleto = document.getElementById('nombre').value.trim();
        const vacanteSelect = document.getElementById('vacante');
        const vacanteTexto = vacanteSelect.selectedOptions[0]?.text || 'No especificada';
        
        this.addHiddenField(form, 'Asunto_CV_Sugerido', `CV - ${nombreCompleto} - ${vacanteTexto}`);
    }
    
    addHiddenField(form, name, value) {
        let input = form.querySelector(`input[name="${name}"]`);
        if (!input) {
            input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            form.appendChild(input);
        }
        input.value = value;
    }
    
    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Google Chrome';
        if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Microsoft Edge';
        return 'Otro navegador';
    }
    
    showSuccessMessage() {
        this.showNotification(
            '¡Aplicación enviada correctamente! 🎉 Recuerda enviar tu CV a gerencia@aoxlab.com', 
            'success'
        );
    }
    
    showCVReminder() {
        setTimeout(() => {
            const nombreCompleto = document.getElementById('nombre').value.trim();
            const vacanteSelect = document.getElementById('vacante');
            const vacanteTexto = vacanteSelect.selectedOptions[0]?.text || 'Vacante seleccionada';
            
            const reminderDiv = document.createElement('div');
            reminderDiv.className = 'cv-reminder';
            reminderDiv.innerHTML = `
                <div class="reminder-content">
                    <i class="fas fa-file-pdf"></i>
                    <div>
                        <h4>📧 ¡No olvides enviar tu CV!</h4>
                        <p><strong>Envía tu CV a:</strong> gerencia@aoxlab.com</p>
                        <p><strong>Asunto sugerido:</strong></p>
                        <p style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 4px; font-family: monospace;">
                            CV - ${nombreCompleto} - ${vacanteTexto}
                        </p>
                        <p><small>Formato PDF, máximo 5MB</small></p>
                    </div>
                    <button onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(reminderDiv);
            
            setTimeout(() => {
                if (reminderDiv.parentElement) {
                    reminderDiv.remove();
                }
            }, 15000);
        }, 3000);
    }
    
    showErrorMessage() {
        this.showNotification(
            'Error al enviar la aplicación. Si persiste el problema, escríbenos directamente a gerencia@aoxlab.com', 
            'error'
        );
    }
    
    showLoadingState(show) {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (show) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Aplicación';
            submitBtn.disabled = false;
        }
    }
    
    initVacanteButtons() {
        document.querySelectorAll('.btn-aplicar').forEach(btn => {
            btn.addEventListener('click', () => {
                const vacante = btn.getAttribute('data-vacante');
                const vacanteSelect = document.getElementById('vacante');
                
                for (let option of vacanteSelect.options) {
                    if (option.value === vacante) {
                        option.selected = true;
                        break;
                    }
                }
                
                document.getElementById('formulario').scrollIntoView({
                    behavior: 'smooth'
                });
                
                vacanteSelect.style.background = 'rgba(74, 144, 226, 0.1)';
                setTimeout(() => {
                    vacanteSelect.style.background = '';
                }, 2000);
            });
        });
    }
    
    initFormEnhancements() {
        // Capitalizar nombres automáticamente
        const nombreField = document.getElementById('nombre');
        if (nombreField) {
            nombreField.addEventListener('input', (e) => {
                const words = e.target.value.split(' ');
                const capitalizedWords = words.map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
                e.target.value = capitalizedWords.join(' ');
            });
        }
        
        // Formatear teléfono automáticamente
        const telefonoField = document.getElementById('telefono');
        if (telefonoField) {
            telefonoField.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 10) {
                        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
                    } else {
                        value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
                    }
                }
                e.target.value = value;
            });
        }
    }
    
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            max-width: 400px;
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            transform: translateX(0);
            transition: all 0.3s ease;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}


/**
 * Funcionalidad para scroll suave hacia el formulario al aplicar a vacantes
 * Se ejecuta cuando se hace clic en los botones "Aplicar ahora"
 */

// Función principal para manejar la aplicación a vacantes
function aplicarVacante(vacanteId) {
    // 1. Hacer scroll suave hacia el formulario
    const formularioSection = document.getElementById('formulario');
    
    if (formularioSection) {
        // Mostrar indicador de scroll (opcional)
        mostrarIndicadorScroll();
        
        // Scroll suave con comportamiento nativo del navegador
        formularioSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
        
        // 2. Esperar a que termine el scroll y luego preseleccionar la vacante
        setTimeout(() => {
            preseleccionarVacante(vacanteId);
            resaltarFormulario();
            ocultarIndicadorScroll();
        }, 800); // 800ms para que termine la animación de scroll
        
    } else {
        console.error('No se encontró el formulario con ID "formulario"');
    }
}

// Función para preseleccionar la vacante en el select
function preseleccionarVacante(vacanteId) {
    const selectVacante = document.getElementById('vacante');
    
    if (selectVacante && vacanteId) {
        // Buscar la opción correspondiente y seleccionarla
        const option = selectVacante.querySelector(`option[value="${vacanteId}"]`);
        
        if (option) {
            selectVacante.value = vacanteId;
            
            // Disparar evento change para cualquier listener que pueda existir
            const changeEvent = new Event('change', { bubbles: true });
            selectVacante.dispatchEvent(changeEvent);
            
            // Agregar clase para resaltar temporalmente
            selectVacante.classList.add('highlighted');
            setTimeout(() => {
                selectVacante.classList.remove('highlighted');
            }, 2000);
            
            console.log(`Vacante "${vacanteId}" preseleccionada correctamente`);
        } else {
            console.warn(`No se encontró la opción para la vacante: ${vacanteId}`);
        }
    }
}

// Función para resaltar visualmente el formulario
function resaltarFormulario() {
    const formularioContainer = document.querySelector('.form-container');
    
    if (formularioContainer) {
        // Agregar clase de resaltado
        formularioContainer.classList.add('form-highlighted');
        
        // Remover la clase después de 3 segundos
        setTimeout(() => {
            formularioContainer.classList.remove('form-highlighted');
        }, 3000);
    }
}

// Función para mostrar indicador de scroll
function mostrarIndicadorScroll() {
    let indicator = document.getElementById('scroll-indicator');
    
    if (!indicator) {
        // Crear el indicador si no existe
        indicator = document.createElement('div');
        indicator.id = 'scroll-indicator';
        indicator.className = 'smooth-scroll-indicator';
        indicator.innerHTML = '<i class="fas fa-arrow-down"></i> Dirigiéndote al formulario...';
        document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
}

// Función para ocultar indicador de scroll
function ocultarIndicadorScroll() {
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
        indicator.classList.remove('show');
    }
}

// Función para inicializar los event listeners
function inicializarAplicacionVacantes() {
    // Buscar todos los botones de aplicar
    const botonesAplicar = document.querySelectorAll('.btn-aplicar');
    
    botonesAplicar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento por defecto
            
            // Agregar clase de procesamiento temporalmente
            this.classList.add('processing');
            setTimeout(() => {
                this.classList.remove('processing');
            }, 1000);
            
            // Obtener el ID de la vacante del atributo data-vacante
            const vacanteId = this.getAttribute('data-vacante');
            
            if (vacanteId) {
                aplicarVacante(vacanteId);
                
                // Opcional: Tracking de analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        'event_category': 'vacantes',
                        'event_label': vacanteId,
                        'value': 1
                    });
                }
            } else {
                console.warn('Botón de aplicar sin atributo data-vacante');
            }
        });
    });
    
    console.log(`Inicializados ${botonesAplicar.length} botones de aplicación`);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacionVacantes();
});

// También inicializar si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacionVacantes);
} else {
    inicializarAplicacionVacantes();
}

document.addEventListener('DOMContentLoaded', () => {
    new AoxlabTrabajo();
});


document.addEventListener('DOMContentLoaded', () => {
    new AoxlabTrabajo();
});
