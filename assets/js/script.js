// Custom JavaScript for Usama Razzaq Portfolio

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .smooth-scroll');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const navbarToggler = document.querySelector('.navbar-toggler');
                        navbarToggler.click();
                    }
                }
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(0, 51, 102, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#003366';
            navbar.style.backdropFilter = 'none';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveNavLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveNavLink);
    
    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .skill-badge, .contact-info, .contact-form');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Skill badges animation on scroll
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        const skillBadges = skillsContainer.querySelectorAll('.skill-badge');
        
        const skillsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBadges.forEach((badge, index) => {
                        setTimeout(() => {
                            badge.style.opacity = '1';
                            badge.style.transform = 'translateY(0) scale(1)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        skillBadges.forEach(badge => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px) scale(0.8)';
            badge.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        skillsObserver.observe(skillsContainer);
    }
    
    // Advanced typing animation for hero title
    const heroTitle = document.querySelector('.hero-content h1 .text-gradient');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #00d4ff';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 150);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 1000);
    }
    
    // Animate skill level bars
    const skillCards = document.querySelectorAll('.skill-card');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const levelFill = entry.target.querySelector('.level-fill');
                const level = levelFill.getAttribute('data-level');
                if (levelFill) {
                    setTimeout(() => {
                        levelFill.style.width = level + '%';
                    }, 500);
                }
            }
        });
    }, { threshold: 0.5 });
    
    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
    
    // Animate counter numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                const duration = 2000;
                const increment = count / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < count) {
                        target.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = count;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => {
        counterObserver.observe(number);
    });
    
    // Code window typing animation
    const codeLines = document.querySelectorAll('.code-line');
    let lineIndex = 0;
    
    const typeCodeLine = () => {
        if (lineIndex < codeLines.length) {
            const line = codeLines[lineIndex];
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.5s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
                lineIndex++;
                setTimeout(typeCodeLine, 300);
            }, 100);
        }
    };
    
    // Start code typing animation after hero section loads
    setTimeout(typeCodeLine, 2000);
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const floatingShapes = document.querySelectorAll('.floating-shapes .shape');
        const floatingIcons = document.querySelectorAll('.floating-icon');
        
        if (heroSection) {
            // Parallax background
            const rate = scrolled * -0.3;
            heroSection.style.backgroundPosition = `center ${50 + rate}px, center`;
            
            // Parallax floating shapes
            floatingShapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = scrolled * speed * -0.2;
                shape.style.transform = `translateY(${yPos}px)`;
            });
            
            // Parallax floating icons
            floatingIcons.forEach((icon, index) => {
                const speed = 0.3 + (index * 0.05);
                const yPos = scrolled * speed * -0.1;
                icon.style.transform = `translateY(${yPos}px)`;
            });
        }
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Fade in the entire page
        const style = document.createElement('style');
        style.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            body.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    });
    
    // Mobile menu enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            setTimeout(() => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.style.animation = 'slideDown 0.3s ease';
                } else {
                    navbarCollapse.style.animation = 'slideUp 0.3s ease';
                }
            }, 10);
        });
    }
    
    // Add CSS animations for mobile menu
    const mobileMenuStyle = document.createElement('style');
    mobileMenuStyle.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
        
        .nav-link.active {
            color: #fff !important;
            font-weight: 600;
        }
        
        .nav-link.active::after {
            width: 100% !important;
        }
    `;
    document.head.appendChild(mobileMenuStyle);
    
    // Console message
    console.log('%c👋 Hello! Thanks for checking out my portfolio!', 'color: #003366; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with ❤️ by Usama Razzaq', 'color: #666; font-size: 12px;');
});
