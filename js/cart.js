// Cart class to manage shopping cart functionality
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.updateCartSummary();
    }

    // Update cart count display
    updateCartCount() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.setAttribute('data-count', this.items.length.toString());
        }
    }

    // Update cart summary display
    updateCartSummary() {
        const cartSummary = document.querySelector('.cart-summary');
        if (!cartSummary) return;

        const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = this.items.length > 0 ? 7 : 0; // 7 DT shipping fee
        const total = subtotal + shipping;

        cartSummary.style.display = this.items.length > 0 ? 'block' : 'none';
        cartSummary.innerHTML = `
            <h3>Cart Summary</h3>
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)} DT</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span>${shipping} DT</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>${total.toFixed(2)} DT</span>
            </div>
            <div class="demo">
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
            </div>
        `;
    }

    // Add item to cart
    addItem(item) {
        console.log('Adding item to cart:', item);
        if (!item) {
            console.error('Invalid item');
            return false;
        }

        // Add unique cart ID if not present
        if (!item.cartId) {
            item.cartId = Date.now();
        }

        // Add quantity if not present
        if (!item.quantity) {
            item.quantity = 1;
        }

        const existingItem = this.items.find(i => i.cartId === item.cartId);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }

        this.saveCart();
        return true;
    }

    // Remove item from cart
    removeItem(cartId) {
        console.log('Removing item:', cartId);
        this.items = this.items.filter(item => item.cartId !== cartId);
        this.saveCart();
    }

    // Update item quantity
    updateQuantity(cartId, quantity) {
        console.log('Updating quantity:', cartId, quantity);
        const item = this.items.find(item => item.cartId === cartId);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity) || 1);
            if (item.quantity === 0) {
                this.removeItem(cartId);
            } else {
                this.saveCart();
            }
        }
    }

    // Calculate cart total
    getTotal() {
        const subtotal = this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        const shipping = this.items.length > 0 ? 7 : 0; // 7 DT shipping fee
        return subtotal + shipping;
    }

    // Render cart items
    renderCart() {
        console.log('Rendering cart items:', this.items);
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            document.querySelector('.cart-summary').style.display = 'none';
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.cartId}">
                <div class="item-image">
                    ${item.customizedDesign ? 
                        `<img src="${item.customizedDesign}" alt="${item.name} (Customized)">` :
                        `<img src="${item.image}" alt="${item.name}">`
                    }
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');

        this.updateCartSummary();

        // Add event listeners
        this.addCartEventListeners();
    }

    // Add event listeners for cart interactions
    addCartEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const cartId = parseInt(cartItem.dataset.id);
                const input = cartItem.querySelector('.quantity-input');
                const currentValue = parseInt(input.value);

                if (e.target.classList.contains('minus')) {
                    if (currentValue > 1) {
                        this.updateQuantity(cartId, currentValue - 1);
                    }
                } else if (e.target.classList.contains('plus')) {
                    this.updateQuantity(cartId, currentValue + 1);
                }

                this.renderCart();
            });
        });

        // Quantity input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const cartId = parseInt(cartItem.dataset.id);
                this.updateQuantity(cartId, e.target.value);
                this.renderCart();
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const cartId = parseInt(cartItem.dataset.id);
                this.removeItem(cartId);
                this.renderCart();
            });
        });

        // Checkout drone button
        const checkoutBtn = document.querySelector('.demo');
        if (checkoutBtn) {
            let processing = false;
            checkoutBtn.addEventListener('click', () => {
                if (processing) return;
                
                // Check if cart is empty
                if (this.items.length === 0) {
                    showNotification('Your cart is empty!');
                    return;
                }

                let reverting = false;
                processing = true;
                
                const $endListener = document.createElement('div');
                $endListener.classList.add('demo-transitionend-listener');
                checkoutBtn.appendChild($endListener);
                
                checkoutBtn.classList.add('s--processing');
                
                $endListener.addEventListener('transitionend', () => {
                    if (reverting) return;
                    reverting = true;
                    checkoutBtn.classList.add('s--reverting');
                });
                
                setTimeout(() => {
                    checkoutBtn.removeChild($endListener);
                    checkoutBtn.classList.remove('s--processing', 's--reverting');
                    processing = false;
                    
                    // Store cart total for checkout page
                    const total = this.getTotal();
                    localStorage.setItem('cartTotal', `$${total.toFixed(2)}`);
                    
                    // Go to checkout page
                    window.location.href = 'checkout.html';
                }, 6000);
            });
        }
    }
}

// Initialize cart
const cart = new Cart();

// Render cart if on cart page
if (document.querySelector('.cart-items')) {
    cart.renderCart();
}
