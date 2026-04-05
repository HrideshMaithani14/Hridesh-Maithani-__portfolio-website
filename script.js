// ============================================
// Professional Data Scientist Portfolio JS
// ============================================

// ============================================
// Particle System
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.animate();
        this.bindEvents();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
            
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.02;
                particle.vy -= (dy / distance) * force * 0.02;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
}

// ============================================
// Navigation
// ============================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navToggle = document.getElementById('nav-toggle');
        this.mobileMenu = document.querySelector('.nav-links');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
        
        // Active link on scroll
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
        
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.mobileMenu.classList.toggle('active');
            });
        }
    }
    
    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// Scroll Animations
// ============================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        // Reveal animations
        const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        revealElements.forEach(el => revealObserver.observe(el));
        
        // Skill bars animation
        const skillBars = document.querySelectorAll('.skill-bar-fill');
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = `${width}%`;
                    }, 200);
                    skillObserver.unobserve(bar);
                }
            });
        }, this.observerOptions);
        
        skillBars.forEach(bar => skillObserver.observe(bar));
        
        // Counter animation for stats
        const stats = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        stats.forEach(stat => statObserver.observe(stat));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ============================================
// Scroll to Top
// ============================================

class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-top');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });
        
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// Contact Form with EmailJS
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        
        // ============================================
        // EMAILJS SETUP - Follow these steps:
        // ============================================
        // 1. Sign up at https://www.emailjs.com/ (free)
        // 2. Add Email Service: https://dashboard.emailjs.com/admin/integration
        // 3. Create Email Template: https://dashboard.emailjs.com/admin/template
        // 4. Get Public Key: https://dashboard.emailjs.com/admin/account
        // 5. Replace the values below with your IDs
        // ============================================
        
        this.emailjsPublicKey = 'YOUR_EMAILJS_PUBLIC_KEY'; // Replace with your Public Key
        this.serviceID = 'YOUR_SERVICE_ID'; // Replace with your Service ID
        this.templateID = 'YOUR_TEMPLATE_ID'; // Replace with your Template ID
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Initialize EmailJS if available
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailjsPublicKey);
        }
        
        this.form.addEventListener('submit', async (e) => {
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            const formAction = this.form.getAttribute('action');
            
            // Check if Formspree is configured
            if (formAction && formAction.includes('formspree.io') && !formAction.includes('YOUR_FORM_ID')) {
                // Formspree is configured - let it handle submission
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
                // Form will submit normally to Formspree
                return; // Let form submit naturally
            }
            
            // Fallback: Use EmailJS or show mailto option
            e.preventDefault();
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            
            try {
                const formData = new FormData(this.form);
                const data = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    message: formData.get('message')
                };
                
                // Try EmailJS if configured
                if (typeof emailjs !== 'undefined' && this.emailjsPublicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                    await emailjs.send(
                        this.serviceID,
                        this.templateID,
                        {
                            from_name: data.from_name,
                            from_email: data.from_email,
                            message: data.message,
                            to_name: 'Hridesh Maithani',
                            to_email: 'maithanihridesh9012@gmail.com',
                            reply_to: data.from_email
                        }
                    );
                    this.showMessage('Thank you for your message! I will get back to you soon.', 'success');
                    this.form.reset();
                } else {
                    // Fallback: Create mailto link
                    const subject = encodeURIComponent(`Contact from ${data.from_name}`);
                    const body = encodeURIComponent(`Name: ${data.from_name}\nEmail: ${data.from_email}\n\nMessage:\n${data.message}`);
                    const mailtoLink = `mailto:maithanihridesh9012@gmail.com?subject=${subject}&body=${body}`;
                    
                    // Open email client
                    window.location.href = mailtoLink;
                    
                    this.showMessage('Opening your email client... If it doesn\'t open, please email: maithanihridesh9012@gmail.com', 'success');
                    this.form.reset();
                }
            } catch (error) {
                console.error('Error:', error);
                this.showMessage('Please email directly: maithanihridesh9012@gmail.com', 'error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
        
        // Add floating label effect
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }
    
    showMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);
    }
}

// ============================================
// Typewriter Effect
// ============================================

class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.init();
    }
    
    init() {
        if (!this.element) return;
        
        this.element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < this.text.length) {
                this.element.textContent += this.text.charAt(i);
                i++;
                setTimeout(type, this.speed);
            }
        };
        
        // Start typing after a delay
        setTimeout(type, 500);
    }
}

// ============================================
// Parallax Effect
// ============================================

class Parallax {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            const orbs = this.hero.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.5;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
}

// ============================================
// Portfolio Filtering
// ============================================

class PortfolioFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.repoBtns = document.querySelectorAll('.repo-btn');
        this.searchInput = document.getElementById('project-search');
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }
    
    init() {
        if (!this.filterBtns.length || !this.projectCards.length) return;
        
        // Tab Filters
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentFilter = btn.getAttribute('data-filter');
                this.applyFilters();
            });
        });

        // Search Input
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        this.projectCards.forEach(card => {
            const categoryMatched = (this.currentFilter === 'all' || card.getAttribute('data-category') === this.currentFilter);
            
            // Search text matching
            const cardText = card.innerText.toLowerCase();
            const searchMatched = (this.searchQuery === '' || cardText.includes(this.searchQuery));

            if (categoryMatched && searchMatched) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.4s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle repo buttons based on active tab
        if (this.repoBtns.length > 0) {
            this.repoBtns.forEach(rBtn => {
                const targetCategory = rBtn.getAttribute('data-repo-category');
                
                if (this.currentFilter === targetCategory) {
                     rBtn.style.display = 'inline-flex';
                } else if (targetCategory === 'all' && (this.currentFilter !== 'supervised' && this.currentFilter !== 'unsupervised')) {
                     rBtn.style.display = 'inline-flex';
                } else {
                     rBtn.style.display = 'none';
                }
            });
        }
    }
}

// ============================================
// Initialize Everything
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
    
    // Initialize navigation
    new Navigation();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize scroll to top
    new ScrollToTop();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize parallax
    new Parallax();
    
    // Initialize portfolio filter
    new PortfolioFilter();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// Performance Optimization
// ============================================

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
