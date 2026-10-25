const nav = document.querySelector('.nav-bar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        document.getElementById('nav').classList.remove('transparent');
    } else {
        document.getElementById('nav').classList.add('transparent');
    }
});

if (window.scrollY <= 100) {
    nav.classList.add('transparent');
}

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

document.addEventListener('click', (e) => {
    if (!document.getElementById('nav').contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.querySelectorAll('a[href^="/#"], a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefAttr = this.getAttribute('href');
        const href = hrefAttr.startsWith('/') ? hrefAttr.substring(1) : hrefAttr;
        
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();

            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.card-1, section > .container');
elementsToAnimate.forEach(el => observer.observe(el));

const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="/#${sectionId}"]`) || document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.fontWeight = '600';
                navLink.style.color = 'var(--color-primary)';
            } else {
                navLink.style.fontWeight = '400';
                navLink.style.color = '';
            }
        }
    });
};

window.addEventListener('scroll', highlightNav);

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

const createScrollToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Retour en haut');
    
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 999;
        box-shadow: 0 4px 16px rgba(139, 115, 85, 0.3);
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 8px 24px rgba(139, 115, 85, 0.4)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 16px rgba(139, 115, 85, 0.3)';
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(button);
};

createScrollToTop();

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

const style = document.createElement('style');
style.textContent = `
    body.keyboard-nav *:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
    }
    
    body:not(.keyboard-nav) *:focus {
        outline: none;
    }
`;
document.head.appendChild(style);

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

console.log('%c🧠 Psychologue.pro', 'font-size: 20px; font-weight: bold; color: #8B7355;');
console.log('%cSite développé avec soin et attention aux détails', 'font-size: 12px; color: #625B56;');

const trackEvent = (category, action, label) => {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
};

document.querySelectorAll('.btn-rdv, .btn-primary').forEach(button => {
    button.addEventListener('click', (e) => {
        const label = e.target.textContent.trim();
        trackEvent('Button', 'Click', label);
    });
});

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const url = e.target.href;
        trackEvent('External Link', 'Click', url);
    });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
