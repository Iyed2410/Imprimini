// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // First include HTML content
    await includeHTML();

    // Check login state and update UI
    if (typeof updateAccountDisplay === 'function') {
        updateAccountDisplay();
    }

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');

    if (mobileMenuBtn && navbar && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenuOverlay.addEventListener('click', function() {
            navbar.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when clicking a link
        const navLinks = navbar.querySelectorAll('a:not(.account-link)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbar.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Account dropdown functionality
    const accountLink = document.querySelector('.account-link');
    const accountDropdown = document.querySelector('.account-dropdown');

    if (accountLink && accountDropdown) {
        accountLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            accountDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!accountDropdown.contains(e.target) && !accountLink.contains(e.target)) {
                accountDropdown.classList.remove('active');
            }
        });
    }

    // Logout functionality
    function handleLogout() {
        // Add your logout logic here
        console.log('Logging out...');
        // For example:
        // localStorage.removeItem('user');
        // window.location.href = 'login.html';
    }

    // Smooth scrolling for anchor links (excluding account-related links)
    const links = document.querySelectorAll("a[href^='#']:not(.account-link):not([onclick])");
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Image Lazy Loading
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Theme toggle functionality
    function setTheme(isDark) {
        try {
            document.body.classList.toggle('dark-mode', isDark);
            localStorage.setItem('darkMode', isDark);
            
            // Force header background update
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
            }
            
            // Update icon
            const icon = document.querySelector('.theme-toggle i');
            if (icon) {
                icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        } catch (error) {
            console.warn('Theme toggle error:', error);
        }
    }

    // Initialize theme
    function initTheme() {
        try {
            const savedTheme = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            setTheme(savedTheme === 'true' || (savedTheme === null && prefersDark));
        } catch (error) {
            console.warn('Theme initialization error:', error);
        }
    }

    // Theme toggle button event listener
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            setTheme(!isDark);
        });
    }

    // Initialize theme after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Handle scroll events
    window.addEventListener('scroll', () => {
        try {
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
            }
        } catch (error) {
            console.warn('Scroll handler error:', error);
        }
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Show notification
            showNotification(`${productName} added to cart!`);
        });
    });

    // Enhanced Cart Notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);

        // Animate notification
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });

    // Product filtering
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const productsGrid = document.querySelector('.products-grid');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }

    function filterProducts() {
        const category = categoryFilter.value;
        const sortBy = sortFilter.value;
        const products = Array.from(productsGrid.children);
        
        products.forEach(product => {
            const productCategory = product.dataset.category;
            if (category === 'all' || category === productCategory) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        // Sort products
        const sortedProducts = products.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent.replace('DT', ''));
            const priceB = parseFloat(b.querySelector('.price').textContent.replace('DT', ''));
            
            if (sortBy === 'price-low') {
                return priceA - priceB;
            } else if (sortBy === 'price-high') {
                return priceB - priceA;
            }
            return 0;
        });
        
        productsGrid.innerHTML = '';
        sortedProducts.forEach(product => productsGrid.appendChild(product));
    }

    // Tab Switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Include HTML functionality
async function includeHTML() {
    const elements = document.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const file = element.getAttribute("include-html");
        if (file) {
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const content = await response.text();
                element.innerHTML = content;
                element.removeAttribute("include-html");
                
                // Re-run scripts in the included content
                const scripts = element.getElementsByTagName("script");
                for (let j = 0; j < scripts.length; j++) {
                    const oldScript = scripts[j];
                    const newScript = document.createElement("script");
                    newScript.text = oldScript.text;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                }
            } catch (error) {
                console.error('Error including HTML:', error);
                element.innerHTML = 'Error loading content';
            }
        }
    }
}

// Hero Image Navigation
let currentHeroImage = 1;
const totalHeroImages = 2;

function changeHeroImage(direction) {
    currentHeroImage = ((currentHeroImage + direction - 1 + totalHeroImages) % totalHeroImages) + 1;
    const heroSection = document.querySelector('.hero-section');
    const newImage = `url('../img/hero/hero-${currentHeroImage}.jpg')`;
    heroSection.style.setProperty('--current-hero', newImage);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.setProperty('--current-hero', "url('../img/hero/hero-1.jpg')");
    }
});

// Show notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    // Add show class for animation
    notification.classList.add('show');
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true
    });
});
