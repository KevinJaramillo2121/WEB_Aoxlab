class AoxlabContacto extends AoxlabWebsite {
    constructor() {
        super();
        this.initContacto();
    }
    
    initContacto() {
        this.initFormValidation();
        this.initMapaInteractivo();
        this.initAgendarCita();
        this.initSmoothScroll();
        this.initHeaderOffset();
    }
     
    initFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
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
        
        return isValid;
    }
     
    async submitForm() {
        const formData = new FormData(form);
        
        try {
            this.showLoadingState(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.showNotification('Mensaje enviado correctamente', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Error al enviar el mensaje', 'error');
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
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensaje';
                submitBtn.disabled = false;
            }
        }
        
        initMapaInteractivo() {
            const mapa = document.querySelector('.mapa-ubicacion iframe');
            if (mapa) {
                mapa.addEventListener('load', () => {
                    mapa.style.opacity = '1';
                });
            }
        }
        
        initAgendarCita() {
            const botonCita = document.getElementById('agendarCita');
            if (botonCita) {
                botonCita.addEventListener('click', () => {
                    this.mostrarCalendario();
                });
            }
        }
        
        mostrarCalendario() {
            this.showNotification('Función de calendario en desarrollo', 'info');
        }
        initHeaderOffset() {
        const header = document.getElementById('header');
        const main = document.querySelector('.contacto-main');
        
        if (header && main) {
            const headerHeight = header.offsetHeight;
            main.style.paddingTop = `${headerHeight + 20}px`; // +20px de margen extra
            
            // Actualizar en resize
            window.addEventListener('resize', () => {
                const newHeight = header.offsetHeight;
                main.style.paddingTop = `${newHeight + 20}px`;
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AoxlabContacto();
});
