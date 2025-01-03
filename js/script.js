// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
        }

        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                localStorage.setItem('theme', '');
            } else {
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark-theme');
            }
        });
    }

    // Mobile Menu Functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const accountLink = document.querySelector('.account-link');
    const accountDropdown = document.querySelector('.account-dropdown');

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

        // Close menu when clicking a link (except account link)
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
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        
        // Force header background update
        const header = document.querySelector('header');
        header.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
        
        // Update icon
        const icon = document.querySelector('.theme-toggle i');
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        setTheme(savedTheme === 'true' || (savedTheme === null && prefersDark));
    }

    initTheme();

    // Handle scroll events
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--background-color');
        }
    });

    // Theme toggle click handler
    document.querySelector('.theme-toggle').addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        setTheme(!isDark);
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
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
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
