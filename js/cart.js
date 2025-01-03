// Cart class to manage shopping cart functionality
class Cart {
    constructor() {
        try {
            const savedCart = localStorage.getItem('cart');
            console.log('Saved cart data:', savedCart);
            this.items = savedCart ? JSON.parse(savedCart) : [];
            console.log('Loaded cart items:', this.items);
            
            // Initialize cart when constructed
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeCart());
            } else {
                this.initializeCart();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    }

    initializeCart() {
        this.renderCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-icon');
        if (cartCount) {
            cartCount.setAttribute('data-count', this.items.length.toString());
        }
    }

    updateCartSummary() {
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-amount');
        const cartSummary = document.querySelector('.cart-summary');

        if (subtotalElement && totalElement) {
            const subtotal = this.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
            const shipping = 7.00; // Fixed shipping cost
            const total = subtotal + shipping;

            subtotalElement.textContent = subtotal.toFixed(2) + ' DT';
            totalElement.textContent = total.toFixed(2) + ' DT';
            
            if (cartSummary) {
                cartSummary.style.display = this.items.length > 0 ? 'block' : 'none';
                
                // Create buttons container if it doesn't exist
                let buttonsContainer = cartSummary.querySelector('.cart-buttons-container');
                if (!buttonsContainer) {
                    buttonsContainer = document.createElement('div');
                    buttonsContainer.className = 'cart-buttons-container';
                    cartSummary.appendChild(buttonsContainer);
                }

                // Add continue shopping button if it doesn't exist
                let continueButton = buttonsContainer.querySelector('.continue-shopping');
                if (!continueButton) {
                    continueButton = document.createElement('button');
                    continueButton.className = 'continue-shopping';
                    continueButton.onclick = () => window.location.href = 'products.html';
                    continueButton.innerHTML = `
                        Continue Shopping
                        <i class="fas fa-shopping-bag"></i>
                    `;
                    buttonsContainer.appendChild(continueButton);
                }
                
                // Add drone button if it doesn't exist
                let droneButton = buttonsContainer.querySelector('.demo');
                if (!droneButton && this.items.length > 0) {
                    droneButton = document.createElement('div');
                    droneButton.className = 'demo';
                    droneButton.innerHTML = `
                        <div class="demo__drone-cont demo__drone-cont--takeoff">
                            <div class="demo__drone-cont demo__drone-cont--shift-x">
                                <div class="demo__drone-cont demo__drone-cont--landing">
                                    <svg viewBox="0 0 136 112" class="demo__drone">
                                        <g class="demo__drone-leaving">
                                            <path class="demo__drone-arm" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                                            <path class="demo__drone-arm demo__drone-arm--2" d="M52,46 c0,0 -15,5 -15,20 l15,10" />
                                            <path class="demo__drone-yellow" d="M28,36 l20,0 a20,9 0,0,1 40,0 l20,0 l0,8 l-10,0 c-10,0 -15,0 -23,10 l-14,0 c-10,-10 -15,-10 -23,-10 l-10,0z" />
                                            <path class="demo__drone-green" d="M16,12 a10,10 0,0,1 20,0 l-10,50z" />
                                            <path class="demo__drone-green" d="M100,12 a10,10 0,0,1 20,0 l-10,50z" />
                                            <path class="demo__drone-yellow" d="M9,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
                                            <path class="demo__drone-yellow" d="M93,8 l34,0 a8,8 0,0,1 0,16 l-34,0 a8,8 0,0,1 0,-16z" />
                                        </g>
                                        <path class="demo__drone-package demo__drone-green" d="M50,70 l36,0 l-4,45 l-28,0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="demo__circle">
                            <div class="demo__circle-inner">
                                <svg viewBox="0 0 16 20" class="demo__circle-package">
                                    <path d="M0,0 16,0 13,20 3,20z" />
                                </svg>
                                <div class="demo__circle-grabbers"></div>
                            </div>
                            <svg viewBox="0 0 40 40" class="demo__circle-progress">
                                <path class="demo__circle-progress-line" d="M20,0 a20,20 0 0,1 0,40 a20,20 0 0,1 0,-40" />
                                <path class="demo__circle-progress-checkmark" d="M14,19 19,24 29,14" />
                            </svg>
                        </div>
                        <div class="demo__text-fields">
                            <div class="demo__text demo__text--step-0">Checkout</div>
                            <div class="demo__text demo__text--step-1">Processing<span class="demo__text-dots"><span>.</span></span></div>
                            <div class="demo__text demo__text--step-2">Delivering<span class="demo__text-dots"><span>.</span></span></div>
                            <div class="demo__text demo__text--step-3">It's on the way</div>
                            <div class="demo__text demo__text--step-4">Delivered</div>
                        </div>
                        <div class="demo__revert-line"></div>
                    `;
                    buttonsContainer.appendChild(droneButton);
                    this.initDroneButton(droneButton);
                }
            }
        }
    }

    initDroneButton(droneButton) {
        let processing = false;
        droneButton.addEventListener('click', () => {
            if (processing) return;
            
            // Check if cart is empty
            if (this.items.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }

            let reverting = false;
            processing = true;
            
            const $endListener = document.createElement('div');
            $endListener.classList.add('demo-transitionend-listener');
            droneButton.appendChild($endListener);
            
            droneButton.classList.add('s--processing');
            
            $endListener.addEventListener('transitionend', () => {
                if (reverting) return;
                reverting = true;
                droneButton.classList.add('s--reverting');
            });
            
            setTimeout(() => {
                droneButton.removeChild($endListener);
                droneButton.classList.remove('s--processing', 's--reverting');
                processing = false;
                
                // Store cart total for checkout page
                const total = this.getTotalPrice();
                localStorage.setItem('cartTotal', total.toFixed(2));
                
                // Go to checkout page
                window.location.href = 'checkout.html';
            }, 6000);
        });
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    async addItem(item) {
        try {
            if (!item) {
                throw new Error('Invalid item');
            }

            if (item.customImage && item.customImage.length > 5000000) {
                item.customImage = await this.compressImage(item.customImage);
            }

            if (item.customImage) {
                const cartItem = {
                    ...item,
                    cartId: Date.now(),
                    quantity: item.quantity || 1,
                    timestamp: new Date().toISOString()
                };
                this.items.push(cartItem);
            } else {
                const existingItem = this.items.find(i => i.id === item.id && !i.customImage);
                if (existingItem) {
                    existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
                } else {
                    const cartItem = {
                        ...item,
                        cartId: Date.now(),
                        quantity: item.quantity || 1,
                        timestamp: new Date().toISOString()
                    };
                    this.items.push(cartItem);
                }
            }

            this.saveCart();
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        }
    }

    updateQuantity(cartId, newQuantity) {
        const item = this.items.find(item => item.cartId === cartId);
        if (!item) return;

        newQuantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
        if (item.quantity === newQuantity) return;

        item.quantity = newQuantity;
        this.saveCart();
        this.renderCart();
    }

    removeItem(cartId) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.cartId !== cartId);
        
        if (this.items.length !== initialLength) {
            this.saveCart();
            this.renderCart();
            return true;
        }
        return false;
    }

    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            this.updateCartSummary();
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.cartId}">
                <div class="item-image">
                    <img src="${item.customImage || item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${item.customImage ? '<p class="customized-tag">(Customized)</p>' : ''}
                    <div class="quantity-controls">
                        <button onclick="window.cart.updateQuantity(${item.cartId}, ${(item.quantity || 1) - 1})" class="quantity-btn minus">-</button>
                        <input type="number" 
                               class="quantity-input" 
                               value="${item.quantity || 1}" 
                               min="1" 
                               max="99"
                               onchange="window.cart.updateQuantity(${item.cartId}, this.value)">
                        <button onclick="window.cart.updateQuantity(${item.cartId}, ${(item.quantity || 1) + 1})" class="quantity-btn plus">+</button>
                    </div>
                    <p class="item-price">${(item.price * (item.quantity || 1)).toFixed(2)} DT</p>
                </div>
                <button onclick="window.cart.removeItem(${item.cartId})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateCartSummary();
    }

    compressImage(dataUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = dataUrl;
            
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const maxSize = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                } catch (err) {
                    reject(err);
                }
            };
            
            img.onerror = reject;
        });
    }
}

// Initialize cart when the script loads
window.cart = new Cart();

// Render cart if on cart page
if (document.querySelector('.cart-items')) {
    window.cart.renderCart();
}
