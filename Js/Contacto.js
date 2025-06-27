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
// Extensión de la clase AoxlabContacto para incluir funcionalidad PQRSF
class AoxlabContacto extends AoxlabWebsite {
    constructor() {
        super();
        this.initContacto();
        this.initPQRSF(); // Nueva inicialización
        this.currentStep = 1;
        this.totalSteps = 6;
    }
    
    initPQRSF() {
        this.initProcesoModal();
        this.initTimelineInteraction();
        this.initStepperNavigation();
        this.initPDFDownload();
    }
    
    initProcesoModal() {
        const verProcesoBtn = document.getElementById('ver-proceso-btn');
        const procesoModal = document.getElementById('procesoModal');
        const procesoClose = document.getElementById('procesoClose');
        
        if (verProcesoBtn && procesoModal) {
            verProcesoBtn.addEventListener('click', () => {
                procesoModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                this.resetStepper();
            });
        }
        
        if (procesoClose) {
            procesoClose.addEventListener('click', () => {
                this.closeProcesoModal();
            });
        }
        
        // Cerrar modal al hacer clic fuera
        if (procesoModal) {
            procesoModal.addEventListener('click', (e) => {
                if (e.target === procesoModal) {
                    this.closeProcesoModal();
                }
            });
        }
        
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && procesoModal.style.display === 'block') {
                this.closeProcesoModal();
            }
        });
    }
    
    closeProcesoModal() {
        const procesoModal = document.getElementById('procesoModal');
        if (procesoModal) {
            procesoModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    initTimelineInteraction() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Abrir modal y mostrar el paso correspondiente
                const procesoModal = document.getElementById('procesoModal');
                if (procesoModal) {
                    procesoModal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    this.goToStep(index + 1);
                }
            });
            
            // Efecto hover con información adicional
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
            });
        });
    }
    
    initStepperNavigation() {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const stepIndicators = document.querySelectorAll('.step-indicator');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentStep > 1) {
                    this.goToStep(this.currentStep - 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentStep < this.totalSteps) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        }
        
        // Navegación por indicadores
        stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToStep(index + 1);
            });
        });
    }
    
    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;
        
        // Ocultar contenido actual
        const currentContent = document.querySelector('.step-content.active');
        if (currentContent) {
            currentContent.classList.remove('active');
        }
        
        // Mostrar nuevo contenido
        const newContent = document.getElementById(`step-${stepNumber}`);
        if (newContent) {
            newContent.classList.add('active');
        }
        
        // Actualizar indicadores
        this.updateStepIndicators(stepNumber);
        
        // Actualizar botones de navegación
        this.updateNavigationButtons(stepNumber);
        
        this.currentStep = stepNumber;
    }
    
    updateStepIndicators(activeStep) {
        const indicators = document.querySelectorAll('.step-indicator');
        
        indicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (stepNum === activeStep) {
                indicator.classList.add('active');
            } else if (stepNum < activeStep) {
                indicator.classList.add('completed');
            }
        });
    }
    
    updateNavigationButtons(currentStep) {
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        
        if (prevBtn) {
            prevBtn.disabled = currentStep === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentStep === this.totalSteps;
            nextBtn.innerHTML = currentStep === this.totalSteps ? 
                'Finalizar <i class="fas fa-check"></i>' : 
                'Siguiente <i class="fas fa-chevron-right"></i>';
        }
    }
    
    resetStepper() {
        this.goToStep(1);
    }
    
    initPDFDownload() {
        const downloadBtn = document.getElementById('descargar-pdf-btn');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Aquí puedes agregar la lógica para descargar el PDF
                // Por ahora mostramos un mensaje
                this.showNotification('Descargando proceso PQRSF...', 'info');
                
                // Simular descarga (reemplaza con la URL real de tu PDF)
                setTimeout(() => {
                    // Crear enlace temporal para descarga
                    const link = document.createElement('a');
                    link.href = '/path/to/your/pqrsf-process.pdf'; // Cambia por la ruta real
                    link.download = 'Proceso-PQRSF-AOXLAB.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    this.showNotification('PDF descargado correctamente', 'success');
                }, 1500);
            });
        }
    }
    
    // Método adicional para mostrar información del paso
    showStepInfo(stepNumber) {
        const stepData = {
            1: {
                title: "Recepción de PQRSF",
                description: "Recibimos tu solicitud por cualquier canal disponible",
                details: ["Correo electrónico", "Teléfono", "Presencial", "Página web"]
            },
            2: {
                title: "Diligenciamiento",
                description: "Verificamos que la información esté completa",
                details: ["Revisión de datos", "Validación de información", "Completitud del formato"]
            }
            // Puedes agregar más pasos según necesites
        };
        
        return stepData[stepNumber] || null;
    }
}

// Inicialización automática cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AoxlabContacto();
});
