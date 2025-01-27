// Load products from backend API
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        
        if (data.success) {
            products = data.products;
            renderProducts(); // Render products after loading
        } else {
            throw new Error(data.message || 'Failed to load products');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products. Please try again.', 'error');
    }
}

// Function to render products
function renderProducts(productsToRender = products) {
    console.log('Rendering products:', productsToRender);
    const productsContainer = document.getElementById('products-grid');
    
    if (!productsContainer) {
        console.log('Products container not found - might be on a different page');
        return;
    }

    // Clear existing products
    productsContainer.innerHTML = '';

    // Render products
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-aos', 'fade-up');
        productCard.setAttribute('data-product-id', product.id);

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                    onerror="this.src='img/product/default.jpg'">
                <div class="product-overlay">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <a href="customize.html?product=${product.id}" class="customize-btn">
                        Customize Now
                        <i class="fas fa-palette"></i>
                    </a>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
            </div>
        `;

        productsContainer.appendChild(productCard);

        // Add event listener for Add to Cart button
        const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', async function() {
            // Disable button while processing
            addToCartBtn.disabled = true;
            const originalText = addToCartBtn.innerHTML;
            addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

            try {
                // Initialize cart if needed
                if (typeof window.cart === 'undefined') {
                    window.cart = new Cart();
                }

                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                };

                const success = await window.cart.addItem(cartItem);
                
                if (success) {
                    // Find the item in cart to get its current quantity
                    const cartItems = window.cart.items;
                    const addedItem = cartItems.find(item => item.id === product.id && !item.customImage);
                    const quantity = addedItem ? addedItem.quantity : 1;
                    
                    // Show success message with quantity
                    showNotification(`Added to cart (Quantity: ${quantity})`, 'success');
                    
                    // Update cart count
                    const cartCount = document.querySelector('.cart-icon');
                    if (cartCount) {
                        cartCount.setAttribute('data-count', window.cart.items.length.toString());
                    }
                } else {
                    throw new Error('Failed to add item to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart. Please try again.', 'error');
            } finally {
                // Re-enable button and restore original text
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = originalText;
            }
        });
    });

    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Format price based on currency
function formatPrice(price, currency = 'TND') {
    const formatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: currency
    });
    return formatter.format(price);
}

// Add notification function if not exists
if (typeof window.showNotification === 'undefined') {
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            ${message}
            <button onclick="this.parentElement.remove()">×</button>
        `;
        document.body.appendChild(notification);
        
        // Add styles if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 4px;
                    color: white;
                    font-weight: 500;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification.success { background-color: #4CAF50; }
                .notification.error { background-color: #f44336; }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0 5px;
                    margin-left: 10px;
                }
                .notification i { font-size: 18px; }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);
