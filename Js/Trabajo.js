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
}

document.addEventListener('DOMContentLoaded', () => {
    new AoxlabTrabajo();
});
