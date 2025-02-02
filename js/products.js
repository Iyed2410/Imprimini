// Load products from backend API
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const data = await response.json();
        console.log('Received data:', data); // Debug log
        
        if (Array.isArray(data)) {
            products = data;
            renderProducts(products); // Render products after loading
        } else {
            throw new Error('Invalid response format');
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

        // Create color swatches HTML if colors exist
        const colorSwatchesHtml = product.colors && product.colors.length > 0 ? `
            <div class="color-swatches">
                ${product.colors.map((color, index) => `
                    <div class="color-swatch ${index === 0 ? 'active' : ''}" 
                         data-image="${color.image}"
                         data-color-name="${color.name}"
                         style="background-image: url('${color.image}');"
                         title="${color.name}">
                    </div>
                `).join('')}
            </div>
        ` : '';

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
            ${colorSwatchesHtml}
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${formatPrice(product.price)}</p>
            </div>
        `;

        productsContainer.appendChild(productCard);

        // Add color swatch functionality
        const colorSwatches = productCard.querySelectorAll('.color-swatch');
        const productImage = productCard.querySelector('.product-image img');
        
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', function() {
                // Update active state
                colorSwatches.forEach(s => s.classList.remove('active'));
                this.classList.add('active');
                
                // Update product image
                productImage.src = this.dataset.image;
            });
        });

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

                // Get selected color
                const activeColorSwatch = productCard.querySelector('.color-swatch.active');
                const selectedColor = activeColorSwatch ? activeColorSwatch.dataset.colorName : null;
                const selectedImage = activeColorSwatch ? activeColorSwatch.dataset.image : product.image;

                const cartItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: selectedImage,
                    color: selectedColor,
                    quantity: 1
                };

                const success = await window.cart.addItem(cartItem);
                
                if (success) {
                    // Find the item in cart to get its current quantity
                    const cartItems = window.cart.items;
                    const addedItem = cartItems.find(item => 
                        item.id === product.id && 
                        item.color === selectedColor && 
                        !item.customImage
                    );
                    const quantity = addedItem ? addedItem.quantity : 1;
                    
                    // Show success message with quantity and color if selected
                    const message = selectedColor 
                        ? `Added ${selectedColor} ${product.name} to cart (Quantity: ${quantity})`
                        : `Added ${product.name} to cart (Quantity: ${quantity})`;
                    showNotification(message, 'success');
                    
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
