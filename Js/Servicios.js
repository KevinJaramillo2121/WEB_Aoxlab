// ===== SERVICIOS.JS - FUNCIONALIDADES ESPECÍFICAS PARA LA PÁGINA DE SERVICIOS =====
// 
// DOCUMENTACIÓN DEL ARCHIVO JAVASCRIPT
// Este archivo maneja todas las funcionalidades interactivas de la página de servicios de AOXLAB
// 
// FUNCIONALIDADES PRINCIPALES:
// 1. Sistema de filtros por categoría de servicio
// 2. Búsqueda en tiempo real de servicios
// 3. Animaciones y efectos visuales de tarjetas
// 4. Sistema de expansión de detalles (SOLO para microbiológicos)
// 5. Funcionalidades del chatbot especializado
// 6. Integración con WhatsApp para contacto directo
//
// AUTOR: Equipo de desarrollo AOXLAB
// FECHA: Junio 2025
// VERSIÓN: 2.1 - Corrección de visualización de contenido expandido

// ===== FUNCIONES GLOBALES PARA EXPANSIÓN (ACCESIBLES DESDE HTML) =====

/**
 * Alterna el estado de expansión de una tarjeta de servicio
 * FUNCIÓN PRINCIPAL del sistema de expansión - DEBE SER GLOBAL
 * VERSIÓN CORREGIDA para mostrar contenido completo
 * 
 * @param {HTMLElement} button - El botón que activó la expansión
 */
function toggleServiceDetails(button) {
    console.log('toggleServiceDetails llamada correctamente - Versión 2.1'); // Debug
    
    // Encontrar la tarjeta contenedora del botón
    const card = button.closest('.service-card-v2');
    if (!card) {
        console.error('No se pudo encontrar la tarjeta contenedora');
        return;
    }
    
    // Verificar que es la tarjeta microbiológica (seguridad adicional)
    if (card.getAttribute('data-category') !== 'microbiologicos') {
        console.warn('Expansión solo disponible para servicios microbiológicos');
        return;
    }
    
    const expandedContent = card.querySelector('.service-expanded-content');
    if (!expandedContent) {
        console.error('Contenido expandido no encontrado');
        // Si no existe, lo creamos dinámicamente
        createExpandedContent(card);
        return;
    }
    
    const isExpanded = expandedContent.classList.contains('expanded');
    
    // Siempre cerrar otras tarjetas expandidas primero
    closeAllExpandedCards();
    
    // Si no estaba expandida, expandirla ahora
    if (!isExpanded) {
        expandServiceCard(card, expandedContent, button);
    }
}



/**
 * NUEVA FUNCIÓN: Crea dinámicamente el contenido expandido si no existe
 * Esta función soluciona el problema de contenido faltante
 * 
 * @param {HTMLElement} card - La tarjeta donde crear el contenido
 */
function createExpandedContent(card) {
    console.log('Creando contenido expandido dinámicamente');
    
    // Buscar el contenedor donde insertar el contenido expandido
    const serviceContent = card.querySelector('.service-content-v2');
    if (!serviceContent) {
        console.error('No se encontró el contenedor de contenido');
        return;
    }
    
    // Crear el HTML del contenido expandido
    const expandedHTML = `
        <div class="service-expanded-content" style="display: block; max-height: 0; overflow: hidden;">
            <div class="expanded-section">
                <h4><i class="fas fa-info-circle"></i> Descripción Técnica Detallada</h4>
                <p>Los análisis microbiológicos constituyen el conjunto de pruebas diseñadas para detectar, 
                identificar, enumerar y caracterizar microorganismos presentes en alimentos, agua, superficies 
                y otros materiales biológicos. AOXLAB garantiza la seguridad microbiológica en diversas matrices 
                con tecnología de vanguardia.</p>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-industry"></i> Importancia para la Industria</h4>
                <p>La industria alimentaria, farmacéutica y cosmética depende fundamentalmente de los análisis 
                microbiológicos para garantizar la seguridad de sus productos. En Colombia, estos análisis son 
                críticos para prevenir brotes de enfermedades transmitidas por alimentos (ETA).</p>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-flask"></i> Matrices Analizables</h4>
                <div class="matrices-grid">
                    <span class="matrix-tag">Alimentos crudos y procesados</span>
                    <span class="matrix-tag">Productos cárnicos</span>
                    <span class="matrix-tag">Lácteos</span>
                    <span class="matrix-tag">Cereales</span>
                    <span class="matrix-tag">Agua potable</span>
                    <span class="matrix-tag">Superficies de contacto</span>
                    <span class="matrix-tag">Productos farmacéuticos</span>
                    <span class="matrix-tag">Cosméticos</span>
                </div>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-microscope"></i> Técnicas Analíticas</h4>
                <ul class="techniques-list">
                    <li>Métodos tradicionales de cultivo en medios selectivos</li>
                    <li>Técnicas de biología molecular como PCR en tiempo real</li>
                    <li>Métodos rápidos basados en inmunoensayos ELISA</li>
                    <li>Incubadoras con control preciso de temperatura</li>
                    <li>Cabinas de bioseguridad nivel II</li>
                    <li>Sistemas automatizados de identificación bioquímica</li>
                </ul>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-certificate"></i> Normativas y Estándares</h4>
                <div class="normatives-grid">
                    <div class="normative-item">
                        <strong>Resolución 1407 de 2022</strong>
                        <span>Criterios microbiológicos para alimentos</span>
                    </div>
                    <div class="normative-item">
                        <strong>ISO 11290</strong>
                        <span>Listeria monocytogenes</span>
                    </div>
                    <div class="normative-item">
                        <strong>ISO 6579</strong>
                        <span>Salmonella spp.</span>
                    </div>
                    <div class="normative-item">
                        <strong>AOAC</strong>
                        <span>Métodos oficiales de análisis</span>
                    </div>
                </div>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-award"></i> Valor Diferencial AOXLAB</h4>
                <div class="value-propositions">
                    <div class="value-item">
                        <i class="fas fa-clock"></i>
                        <div>
                            <strong>Tiempos Optimizados</strong>
                            <span>Resultados en 3-7 días hábiles con capacidad de urgencias en 24-48 horas</span>
                        </div>
                    </div>
                    <div class="value-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Trazabilidad Digital</strong>
                            <span>Sistema LIMS para seguimiento completo de muestras desde recepción hasta entrega</span>
                        </div>
                    </div>
                    <div class="value-item">
                        <i class="fas fa-users"></i>
                        <div>
                            <strong>Soporte Técnico Continuo</strong>
                            <span>Consultoría especializada y capacitaciones HACCP para su equipo</span>
                        </div>
                    </div>
                    <div class="value-item">
                        <i class="fas fa-certificate"></i>
                        <div>
                            <strong>Acreditación ISO 17025</strong>
                            <span>Garantía de calidad internacional y reconocimiento oficial</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="expanded-section">
                <h4><i class="fas fa-chart-bar"></i> Parámetros Analizados</h4>
                <div class="parameters-grid">
                    <div class="parameter-category">
                        <h5>Patógenos Críticos</h5>
                        <ul>
                            <li>Salmonella spp. (25g)</li>
                            <li>Listeria monocytogenes (25g)</li>
                            <li>E. coli O157:H7</li>
                            <li>Campylobacter spp.</li>
                        </ul>
                    </div>
                    <div class="parameter-category">
                        <h5>Indicadores de Higiene</h5>
                        <ul>
                            <li>Aerobios mesófilos (UFC/g)</li>
                            <li>Coliformes totales (UFC/g)</li>
                            <li>E. coli (UFC/g)</li>
                            <li>Enterobacterias (UFC/g)</li>
                        </ul>
                    </div>
                    <div class="parameter-category">
                        <h5>Deterioro y Calidad</h5>
                        <ul>
                            <li>Mohos y levaduras (UFC/g)</li>
                            <li>Staphylococcus aureus (UFC/g)</li>
                            <li>Clostridium perfringens</li>
                            <li>Pseudomonas spp.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insertar el contenido expandido
    serviceContent.insertAdjacentHTML('beforeend', expandedHTML);
    
    // Ahora expandir el contenido
    const newExpandedContent = card.querySelector('.service-expanded-content');
    const button = card.querySelector('.btn-expand-details');
    if (newExpandedContent && button) {
        expandServiceCard(card, newExpandedContent, button);
    }
}
/**
 * Alterna el estado de expansión de una tarjeta de servicio
 * VERSIÓN ACTUALIZADA para manejar múltiples servicios expandibles
 * 
 * @param {HTMLElement} button - El botón que activó la expansión
 */
function toggleServiceDetails(button) {
    console.log('toggleServiceDetails llamada - Versión Multi-Servicio');
    
    // Encontrar la tarjeta contenedora del botón
    const card = button.closest('.service-card-v2');
    if (!card) {
        console.error('No se pudo encontrar la tarjeta contenedora');
        return;
    }
    
    // Verificar que es una tarjeta con funcionalidad expandible
    const category = card.getAttribute('data-category');
    const expandibleServices = ['microbiologicos', 'metales', 'cannabinoides', 'fisicoquimicos','contaminantes'];
    
    if (!expandibleServices.includes(category)) {
        console.warn(`Expansión no disponible para ${category}`);
        return;
    }
    
    const expandedContent = card.querySelector('.service-expanded-content');
    if (!expandedContent) {
        console.error('Contenido expandido no encontrado');
        // Si no existe, lo creamos dinámicamente según el servicio
        createExpandedContentForService(card, category);
        return;
    }
    
    const isExpanded = expandedContent.classList.contains('expanded');
    
    // Siempre cerrar otras tarjetas expandidas primero
    closeAllExpandedCards();
    
    // Si no estaba expandida, expandirla ahora
    if (!isExpanded) {
        expandServiceCard(card, expandedContent, button);
    }
}

/**
 * NUEVA FUNCIÓN: Crea contenido expandido específico según el tipo de servicio
 * 
 * @param {HTMLElement} card - La tarjeta donde crear el contenido
 * @param {string} serviceType - Tipo de servicio
 */
function createExpandedContentForService(card, serviceType) {
    console.log(`Creando contenido expandido para: ${serviceType}`);
    
    const serviceContent = card.querySelector('.service-content-v2');
    if (!serviceContent) {
        console.error('No se encontró el contenedor de contenido');
        return;
    }
    
    // El contenido ya está en el HTML, solo expandir
    const newExpandedContent = card.querySelector('.service-expanded-content');
    const button = card.querySelector('.btn-expand-details');
    if (newExpandedContent && button) {
        expandServiceCard(card, newExpandedContent, button);
    }
}

/**
 * Inicializa el sistema de expansión para TODOS los servicios expandibles
 */
function initializeExpandableCards() {
    console.log('Inicializando tarjetas expandibles - Versión Multi-Servicio');
    
    // Buscar todas las tarjetas que tienen botón de expansión
    const expandableCards = document.querySelectorAll('.service-card-v2');
    let expandableCount = 0;
    
    expandableCards.forEach(card => {
        const expandButton = card.querySelector('.btn-expand-details');
        if (expandButton) {
            expandableCount++;
            console.log(`Tarjeta expandible encontrada: ${card.getAttribute('data-category')}`);
        }
    });
    
    console.log(`${expandableCount} tarjetas expandibles inicializadas correctamente`);
    
    // Event listeners globales para cerrar tarjetas expandidas
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.service-card-v2')) {
            closeAllExpandedCards();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllExpandedCards();
        }
    });
}

/**
 * Función de contacto específico actualizada para todos los servicios
 */
function contactSpecificService(serviceType) {
    const serviceMessages = {
        'microbiologicos': 'Estoy interesado en análisis microbiológicos especializados con acreditación ISO 17025. Me gustaría recibir información sobre sus capacidades de detección de patógenos y tiempos de entrega.',
        'fisicoquimicos': 'Necesito información sobre análisis físico-químicos y nutricionales completos. ¿Podrían proporcionarme detalles sobre sus más de 1500 servicios disponibles?',
        'metales': 'Requiero análisis de metales pesados por ICP-MS con límites de detección ultra-bajos. Me interesa conocer su capacidad multielemental de más de 60 elementos.',
        'cannabinoides': 'Busco servicios especializados de análisis de cannabinoides y terpenos para cannabis medicinal. He visto que son líderes en Colombia con más de 25,000 análisis realizados.',
        'contaminantes': 'Necesito análisis de contaminantes: micotoxinas, alérgenos y pesticidas. ¿Qué metodologías utilizan para detección de estos contaminantes y cuáles son sus límites de detección?'
    };
    
    const message = serviceMessages[serviceType] || 
        'Solicito información sobre sus servicios especializados de análisis. Me gustaría conocer más detalles.';
    
    const whatsappNumber = '573128743291';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    console.log(`Contacto iniciado para servicio: ${serviceType}`);
}

/**
 * Expande una tarjeta de servicio específica con animaciones suaves
 * VERSIÓN MEJORADA con mejor manejo de contenido
 * 
 * @param {HTMLElement} card - La tarjeta a expandir
 * @param {HTMLElement} expandedContent - El contenido expandible
 * @param {HTMLElement} button - El botón de expansión
 */
function expandServiceCard(card, expandedContent, button) {
    console.log('Expandiendo tarjeta de servicio microbiológico - Versión 2.1');
    
    // Forzar la visualización del contenido expandido
    expandedContent.style.display = 'block';
    expandedContent.style.opacity = '0';
    expandedContent.style.maxHeight = '0';
    
    // Aplicar clases CSS para la expansión
    card.classList.add('expanded');
    expandedContent.classList.add('expanded');
    button.classList.add('expanded');
    
    // Cambiar el texto y estado del botón
    updateExpandButton(button, true);
    
    // Animación suave de expansión
    setTimeout(() => {
        expandedContent.style.maxHeight = '3000px'; // Altura suficiente para todo el contenido
        expandedContent.style.opacity = '1';
        expandedContent.style.transition = 'max-height 0.8s ease, opacity 0.5s ease 0.2s';
    }, 50);
    
    // Scroll suave hacia la tarjeta expandida después de un breve delay
    setTimeout(() => {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
        const targetPosition = card.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }, 500); // Esperar a que inicie la animación de expansión
    
    // Animar las secciones internas del contenido expandido
    setTimeout(() => {
        animateExpandedSections(expandedContent);
    }, 300);
}

/**
 * Actualiza el estado visual del botón de expansión
 * VERSIÓN MEJORADA con mejor manejo de texto
 * 
 * @param {HTMLElement} button - Botón a actualizar
 * @param {boolean} isExpanded - Estado de expansión
 */
function updateExpandButton(button, isExpanded) {
    const icon = button.querySelector('i');
    
    // Buscar el nodo de texto más seguro
    let textContent = '';
    button.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            textContent = node.textContent.trim();
        }
    });
    
    if (isExpanded) {
        // Estado expandido: cambiar texto y rotar icono
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar Detalles';
        button.classList.add('expanded');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
        }
    } else {
        // Estado colapsado: restaurar texto original
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Ver Más Detalles';
        button.classList.remove('expanded');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

/**
 * Anima las secciones individuales dentro del contenido expandido
 * VERSIÓN MEJORADA con mejor timing y efectos
 * 
 * @param {HTMLElement} expandedContent - Contenedor del contenido expandido
 */
function animateExpandedSections(expandedContent) {
    // Obtener todas las secciones expandidas
    const sections = expandedContent.querySelectorAll('.expanded-section');
    
    // Aplicar animación escalonada a cada sección
    sections.forEach((section, index) => {
        // Estado inicial: invisible y desplazada hacia abajo
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        setTimeout(() => {
            // Animar hacia estado visible
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 150); // 150ms de delay entre cada sección para efecto más dramático
    });
    
    // Animar elementos específicos dentro de las secciones
    setTimeout(() => {
        animateMatrixTags(expandedContent);
        animateValueItems(expandedContent);
    }, sections.length * 150 + 200);
}

/**
 * NUEVA FUNCIÓN: Anima los tags de matrices
 * 
 * @param {HTMLElement} expandedContent - Contenedor expandido
 */
function animateMatrixTags(expandedContent) {
    const matrixTags = expandedContent.querySelectorAll('.matrix-tag');
    matrixTags.forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
        }, index * 50);
    });
}

/**
 * NUEVA FUNCIÓN: Anima los elementos de valor proposición
 * 
 * @param {HTMLElement} expandedContent - Contenedor expandido
 */
function animateValueItems(expandedContent) {
    const valueItems = expandedContent.querySelectorAll('.value-item');
    valueItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

/**
 * Cierra todas las tarjetas expandidas
 * VERSIÓN MEJORADA con mejor cleanup
 */
function closeAllExpandedCards() {
    // Buscar todas las tarjetas que están actualmente expandidas
    const expandedCards = document.querySelectorAll('.service-card-v2.expanded');
    
    expandedCards.forEach(card => {
        const expandedContent = card.querySelector('.service-expanded-content');
        const button = card.querySelector('.btn-expand-details');
        
        if (expandedContent && button) {
            // Animación de cierre suave
            expandedContent.style.maxHeight = '0';
            expandedContent.style.opacity = '0';
            expandedContent.style.transition = 'max-height 0.5s ease, opacity 0.3s ease';
            
            // Remover clases de expansión después de la animación
            setTimeout(() => {
                card.classList.remove('expanded');
                expandedContent.classList.remove('expanded');
                button.classList.remove('expanded');
                expandedContent.style.display = 'none';
            }, 500);
            
            // Restaurar botón al estado original
            updateExpandButton(button, false);
        }
    });
}

/**
 * Maneja el contacto específico por tipo de servicio vía WhatsApp
 * Genera mensajes personalizados según el servicio seleccionado
 * FUNCIÓN GLOBAL para uso desde HTML
 * 
 * @param {string} serviceType - Tipo de servicio (microbiologicos, metales, etc.)
 */
function contactSpecificService(serviceType) {
    // Mensajes predefinidos para cada tipo de servicio
    const serviceMessages = {
        'microbiologicos': 'Estoy interesado en análisis microbiológicos especializados con acreditación ISO 17025. Me gustaría recibir información sobre sus capacidades de detección de patógenos y tiempos de entrega.',
        'fisicoquimicos': 'Necesito información sobre análisis físico-químicos y nutricionales completos. ¿Podrían proporcionarme detalles sobre sus más de 1500 servicios disponibles?',
        'metales': 'Requiero análisis de metales pesados por ICP-MS con límites de detección ultra-bajos. Me interesa conocer su capacidad multielemental.',
        'cannabinoides': 'Busco servicios especializados de análisis de cannabinoides y terpenos para cannabis medicinal. He visto que son líderes en Colombia.',
        'contaminantes': 'Necesito análisis de contaminantes: micotoxinas, alérgenos y pesticidas. ¿Qué metodologías utilizan?'
    };
    
    // Obtener mensaje específico o usar mensaje genérico
    const message = serviceMessages[serviceType] || 
        'Solicito información sobre sus servicios especializados de análisis. Me gustaría conocer más detalles.';
    
    // Número de WhatsApp de AOXLAB (debe actualizarse con el número real)
    const whatsappNumber = '573128743291';
    
    // Construir URL de WhatsApp con mensaje preformateado
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp en nueva ventana
    window.open(whatsappUrl, '_blank');
    
    // Log para seguimiento analítico
    console.log(`Contacto iniciado para servicio: ${serviceType}`);
}

// ===== INICIALIZACIÓN PRINCIPAL DEL DOCUMENTO =====
/**
 * Se ejecuta cuando el DOM está completamente cargado
 * Inicializa todas las funcionalidades de la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Inicializando servicios.js v2.1'); // Debug
    
    // Inicializar AOS (Animate On Scroll) si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Inicialización secuencial de todas las funcionalidades
    initializeFilters();
    initializeSearch();
    initializeServiceCards();
    initializeExpandableCards();
    animateFloatingIcons();
    initializeChatbot();
    
    // NUEVA FUNCIONALIDAD: Verificar estructura de contenido expandido
    verifyExpandedContentStructure();
});

/**
 * NUEVA FUNCIÓN: Verifica y corrige la estructura del contenido expandido
 */
function verifyExpandedContentStructure() {
    const microCard = document.querySelector('.service-card-v2[data-category="microbiologicos"]');
    if (microCard) {
        const expandedContent = microCard.querySelector('.service-expanded-content');
        if (!expandedContent) {
            console.log('Contenido expandido no encontrado, será creado dinámicamente cuando se necesite');
        } else {
            console.log('Contenido expandido encontrado correctamente');
        }
    }
}

// [RESTO DEL CÓDIGO JAVASCRIPT PERMANECE IGUAL...]
// Mantengo todas las demás funciones sin cambios para no afectar el funcionamiento existente

/**
 * Inicializa el sistema de expansión de detalles ÚNICAMENTE para el servicio microbiológico
 */
function initializeExpandableCards() {
    console.log('Inicializando tarjetas expandibles v2.1');
    
    const microbiologicalCard = document.querySelector('.service-card-v2[data-category="microbiologicos"]');
    
    if (!microbiologicalCard) {
        console.warn('Tarjeta de servicio microbiológico no encontrada');
        return;
    }
    
    const expandButton = microbiologicalCard.querySelector('.btn-expand-details');
    
    if (!expandButton) {
        console.warn('Botón de expansión no encontrado en la tarjeta microbiológica');
        return;
    }
    
    console.log('Sistema de expansión inicializado correctamente');
    
    // Event listeners globales para cerrar tarjetas expandidas
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.service-card-v2')) {
            closeAllExpandedCards();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllExpandedCards();
        }
    });
}

// [Resto de funciones existentes permanecen igual...]

/**
 * Inicializa el sistema de filtros por categoría de servicios
 */
function initializeFilters() {
    const hash = window.location.hash.substring(1);
    const validCategories = ['microbiologicos', 'fisicoquimicos', 'metales', 'cannabinoides', 'contaminantes'];

    if(validCategories.includes(hash)) {
        filterServices(hash, serviceCards, noResults);
        
        // Nueva función para manejar la expansión
        setTimeout(() => {
            const targetCard = document.getElementById(hash);
            if(targetCard) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetCard.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Expansión directa del servicio
                const expandButton = targetCard.querySelector('.btn-expand-details');
                if(expandButton) {
                    expandButton.click();
                }
            }
        }, 500);
    
    }
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card, .service-card-v2');
    const noResults = document.getElementById('no-results');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllExpandedCards();
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterServices(filter, serviceCards, noResults);
        });
    });
}

function filterServices(filter, cards, noResults) {
    let visibleCards = 0;
    
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
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
            
            // Actualizar URL con hash
            if(filter !== 'all') {
                window.history.replaceState(null, null, `#${filter}`);
            }
        }, index * 50);
    });
}


function initializeSearch() {
    const searchInput = document.getElementById('service-search');
    const serviceCards = document.querySelectorAll('.service-card, .service-card-v2');
    const noResults = document.getElementById('no-results');
    
    if (!searchInput) {
        console.warn('Campo de búsqueda no encontrado');
        return;
    }
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        closeAllExpandedCards();
        searchServices(searchTerm, serviceCards, noResults);
    });
}

function searchServices(searchTerm, cards, noResults) {
    let visibleCards = 0;
    
    cards.forEach((card, index) => {
        let title, description, features;
        
        if (card.classList.contains('service-card-v2')) {
            title = card.querySelector('.service-title-v2')?.textContent.toLowerCase() || '';
            description = card.querySelector('.service-description-v2')?.textContent.toLowerCase() || '';
            
            const featureElements = card.querySelectorAll('.service-features-v2 li');
            features = Array.from(featureElements)
                .map(li => li.textContent.toLowerCase())
                .join(' ');
        } else {
            title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            description = card.querySelector('p')?.textContent.toLowerCase() || '';
            
            const featureElements = card.querySelectorAll('.service-features li');
            features = Array.from(featureElements)
                .map(li => li.textContent.toLowerCase())
                .join(' ');
        }
        
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

function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card, .service-card-v2');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('expanded')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        const icon = card.querySelector('.service-icon, .service-icon-v2');
        if (icon) {
            card.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.1) rotateY(360deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            });
        }
        
        const buttons = card.querySelectorAll('.btn-detail, .btn-quote, .btn-contact-v2');
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

function animateFloatingIcons() {
    const iconItems = document.querySelectorAll('.icon-item');
    
    iconItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 1.5}s`;
        
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

function initializeChatbot() {
    const quickButtons = document.querySelectorAll('.quick-btn[data-action]');
    
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleServiceQuestion(action);
        });
    });
}

function handleServiceQuestion(service) {
    const responses = {
        'microbiologicos': 'Los análisis microbiológicos incluyen detección de patógenos como Salmonella, E. coli, Listeria y recuentos microbianos. Utilizamos metodologías estandarizadas bajo acreditación ISO 17025. Tiempo de entrega: 3-5 días laborables.',
        'metales': 'Ofrecemos análisis de metales pesados (Pb, Cd, As, Hg, Cr) mediante ICP-MS con límites de detección ultra-bajos en partes por trillón (ppt). Podemos analizar más de 60 elementos simultáneamente.',
        'cannabinoides': 'Somos líderes en Colombia y Suramérica en análisis de cannabis medicinal con más de 25,000 análisis realizados. Análisis completo de cannabinoides y terpenos usando HPLC-MS/MS.'
    };
    
    const chatBody = document.getElementById('chatbot-body');
    if (!chatBody) return;
    
    const response = responses[service] || 
        'Te ayudo con información sobre ese servicio. ¿Qué te gustaría saber específicamente?';
    
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
                <button class="quick-btn" onclick="contactSpecificService('${service}')">
                    Contactar por WhatsApp
                </button>
            </div>
        </div>
    `;
    
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

console.log('✅ servicios.js v2.1 cargado correctamente - Expansión microbiológica CORREGIDA');
