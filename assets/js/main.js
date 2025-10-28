// ==================== PARTICLES BACKGROUND ====================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(231, 106, 141, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(231, 106, 141, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.body.classList.remove('loading');
        // Remove typing animation after it finishes
        setTimeout(() => {
            const nameElement = document.querySelector('#home .name');
            if (nameElement) {
                nameElement.classList.add('typed');
            }
        }, 4000);
    }, 2000);
});


// ==================== SCROLL PROGRESS BAR ====================
const scrollProgress = document.querySelector('.scroll-progress');

function updateScrollProgress() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollCurrent = window.pageYOffset;
    const scrollPercentage = (scrollCurrent / scrollTotal) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
}

// ==================== NAVBAR SCROLL EFFECT ====================
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-item a');
const sectionDots = document.querySelectorAll('.section-dot');

// Auto-hide navbar functionality
let navbarTimer;
let isNavbarHovered = false;
const SCROLL_THRESHOLD = 500; // Chỉ collapse khi scroll xuống hơn 500px

function collapseNavbar() {
    // Chỉ collapse khi: không hover, scroll đủ xa, và không ở đầu trang
    if (!isNavbarHovered && window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('collapsed');
    }
}

function expandNavbar() {
    navbar.classList.remove('collapsed');
    // Chỉ reset timer nếu đã scroll đủ xa
    if (window.scrollY > SCROLL_THRESHOLD) {
        resetNavbarTimer();
    }
}

function resetNavbarTimer() {
    clearTimeout(navbarTimer);
    // Chỉ set timer nếu đã scroll đủ xa
    if (window.scrollY > SCROLL_THRESHOLD) {
        navbarTimer = setTimeout(collapseNavbar, 666); // Collapse after 1.5 seconds of inactivity
    }
}

// Navbar hover events
navbar.addEventListener('mouseenter', () => {
    isNavbarHovered = true;
    expandNavbar();
});

navbar.addEventListener('mouseleave', () => {
    isNavbarHovered = false;
    resetNavbarTimer();
});

// Click to expand when collapsed
navbar.addEventListener('click', () => {
    if (navbar.classList.contains('collapsed')) {
        expandNavbar();
    }
});

window.addEventListener('scroll', () => {
    updateScrollProgress();

    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Nếu ở đầu trang, luôn expand và không collapse
    if (window.scrollY <= SCROLL_THRESHOLD) {
        navbar.classList.remove('collapsed');
        clearTimeout(navbarTimer);
    } else {
        // Expand navbar temporarily on scroll (khi đã scroll đủ xa)
        expandNavbar();
    }

    // Active nav link on scroll
    let current = '';
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Update section dots
    sectionDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === current) {
            dot.classList.add('active');
        }
    });
});

// Start the auto-hide timer on page load
resetNavbarTimer();

// Section dots click handler
sectionDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const targetSection = document.getElementById(dot.getAttribute('data-section'));
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== MOBILE MENU ====================
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navList.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
    });
});

// ==================== SCROLL REVEAL ANIMATIONS ====================
const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
            }, index * 100); // Stagger effect
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach((element) => revealObserver.observe(element));

// ==================== SKILL BARS ANIMATION ====================
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillPercentages = document.querySelectorAll('.percentage');
const skillSection = document.querySelector('#skills');

// Counter animation function
function animateCounter(element, target, duration = 1500) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '%';
    }, 16);
}

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skill bars
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.style.width;
                    bar.style.setProperty('--target-width', width);
                    bar.classList.add('animated');
                }, index * 200);
            });

            // Animate percentage counters
            skillPercentages.forEach((percentage, index) => {
                const target = parseInt(percentage.getAttribute('data-target'));
                setTimeout(() => {
                    animateCounter(percentage, target);
                }, index * 200);
            });

            skillObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});

if (skillSection) {
    skillObserver.observe(skillSection);
}

// ==================== SMOOTH SCROLL ====================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shape');

    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.5;
        el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// ==================== ADD RIPPLE EFFECT TO BUTTONS ====================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ==================== 3D TILT EFFECT FOR IMAGES ====================
const tiltElements = document.querySelectorAll('.profile-img, .university-img, .hobby-img, .contact-img');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ==================== SCROLL TO TOP WITH ANIMATION ====================
const scrollToTopLink = document.querySelector('.footer a[href="#home"]');
if (scrollToTopLink) {
    scrollToTopLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== EASTER EGG: KONAMI CODE ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('🎉 Bạn đã tìm ra Easter Egg! Chúc mừng! 🎉');
        }, 2000);
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
