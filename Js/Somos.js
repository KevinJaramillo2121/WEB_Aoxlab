// somos.js - Funcionalidades específicas para la página Somos
// Este es el apartado de somos
// Es importante recordar que en este y en todos los apartados se debe comentar todo con el fin de que su posterior actualización sea más senciila ademas que le legibilidad de dichos apartados tambien se simplifica
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    // Animación de números en estadísticas del hero
    animateNumbers();
    
    // Observador para la línea de tiempo
    observeTimelineItems();
    
    // Efectos adicionales para las tarjetas del equipo
    enhanceTeamCards();
});

function animateNumbers() {
    const statNumbers = document.querySelectorAll('.somos-hero .stat-number');
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = currentValue + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateValue(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            }
        });
    });

    statNumbers.forEach(number => observer.observe(number));
}

function observeTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Añadir retraso progresivo a elementos dentro del item
                const card = entry.target.querySelector('.timeline-card');
                const marker = entry.target.querySelector('.timeline-marker');
                
                setTimeout(() => {
                    marker.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    setTimeout(() => {
                        marker.style.transform = 'translate(-50%, -50%) scale(1)';
                    }, 200);
                }, 300);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px'
    });
    
    timelineItems.forEach(item => observer.observe(item));
}

function enhanceTeamCards() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const socialLinks = this.querySelectorAll('.team-social a');
            socialLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.transform = 'translateY(0) scale(1.1)';
                    setTimeout(() => {
                        link.style.transform = 'translateY(0) scale(1)';
                    }, 150);
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const socialLinks = this.querySelectorAll('.team-social a');
            socialLinks.forEach(link => {
                link.style.transform = 'translateY(20px) scale(1)';
            });
        });
    });
}

// Efecto parallax suave para el hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.somos-hero .hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Animación de entrada para certificaciones
function animateCertifications() {
    const certCards = document.querySelectorAll('.cert-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateY(0) rotateX(0)';
                    entry.target.style.opacity = '1';
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    certCards.forEach(card => {
        card.style.transform = 'translateY(50px) rotateX(15deg)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// Inicializar animaciones de certificaciones
animateCertifications();
