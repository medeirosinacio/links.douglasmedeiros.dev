document.addEventListener("DOMContentLoaded", function () {
    AOS.init({
        duration: 400,
        easing: 'ease-in-out',
    });
});

// Critical JavaScript - Load immediately
(function() {
    'use strict';

    // Intersection Observer para animações com performance otimizada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Unobserve element after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observa elementos para animação quando DOM estiver pronto
    function initAnimations() {
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // Gerenciamento do botão de colapso com melhor UX
    function initCollapseEvents() {
        const collapseElement = document.getElementById('allEvents');
        const toggleButton = document.querySelector('[data-bs-toggle="collapse"]');

        if (collapseElement && toggleButton) {
            collapseElement.addEventListener('shown.bs.collapse', () => {
                toggleButton.textContent = 'Mostrar menos';
                toggleButton.setAttribute('aria-expanded', 'true');

                // Scroll suave com offset para header
                setTimeout(() => {
                    const headerOffset = 20;
                    const elementPosition = collapseElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            });

            collapseElement.addEventListener('hidden.bs.collapse', () => {
                toggleButton.textContent = 'Ver todos os eventos';
                toggleButton.setAttribute('aria-expanded', 'false');
            });
        }
    }

    // Otimização de performance com requestAnimationFrame
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        document.body.style.transform = `translate3d(0, ${rate * 0.02}px, 0)`;
        ticking = false;
    }

    function requestTick() {
        if (!ticking && 'requestAnimationFrame' in window) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Event listeners otimizados
    function initEventListeners() {
        // Parallax effect apenas em desktop
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', requestTick, { passive: true });
        }

        // Preload hover effects
        if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
            const linkCards = document.querySelectorAll('.link-card');
            linkCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-4px)';
                }, { passive: true });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = '';
                }, { passive: true });
            });
        }
    }

    // Inicialização quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAnimations();
            initCollapseEvents();
            initEventListeners();
        });
    } else {
        initAnimations();
        initCollapseEvents();
        initEventListeners();
    }

})();

// Schema.org Event tracking
function trackEventClick(eventName) {
    // Implementar tracking de eventos específicos
    if (typeof gtag !== 'undefined') {
        gtag('event', 'event_click', {
            event_category: 'Events',
            event_label: eventName
        });
    }
}

// Link click tracking
document.addEventListener('click', (e) => {
    if (e.target.closest('.link-card')) {
        const linkTitle = e.target.closest('.link-card').querySelector('.link-title')?.textContent;
        if (typeof gtag !== 'undefined' && linkTitle) {
            gtag('event', 'link_click', {
                event_category: 'External Links',
                event_label: linkTitle
            });
        }
    }
});

function loadHighResImage(elem, highResUrl) {
    let image = new Image();
    image.addEventListener('load', () => elem.setAttribute('style', 'background-image: url("' + highResUrl + '") !important'));
    image.src = highResUrl;
}

loadHighResImage(document.getElementById('bg-home-gif'), '/assets/gifs/bg-home.gif');
