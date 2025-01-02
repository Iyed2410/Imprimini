// Product data
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        description: "Premium cotton t-shirt perfect for custom designs",
        price: 20,
        image: "./img/product/product-1.jpg",
        category: "Clothing",
        colors: ["White", "Black", "Gray", "Navy"]
    },
    {
        id: 2,
        name: "Black Hoodie",
        description: "Comfortable hoodie for all seasons",
        price: 40,
        image: "./img/product/product-2.jpg",
        category: "Clothing",
        colors: ["Black", "Gray", "Navy"]
    },
    {
        id: 3,
        name: "Ceramic Coffee Mug",
        description: "High-quality ceramic mug for your morning coffee",
        price: 15,
        image: "./img/product/product-3.jpg",
        category: "Accessories",
        colors: ["White", "Black"]
    },
    {
        id: 4,
        name: "Color Changing Mug",
        description: "Magic mug that reveals design when hot",
        price: 20,
        image: "./img/product/product-4.jpg",
        category: "Accessories",
        colors: ["White", "Black"]
    },
    {
        id: 5,
        name: "Premium Canvas Print",
        description: "High-quality canvas perfect for photos and artwork",
        price: 40,
        image: "./img/product/product-5.jpg",
        category: "Home Decor",
        colors: ["White"]
    },
    {
        id: 6,
        name: "Colored T-Shirt",
        description: "Vibrant colored t-shirt for bold designs",
        price: 25,
        image: "./img/product/product-6.jpg",
        category: "Clothing",
        colors: ["Red", "Blue", "Green", "Yellow"]
    },
    {
        id: 7,
        name: "Zip-Up Hoodie",
        description: "Classic zip-up hoodie with premium feel",
        price: 45,
        image: "./img/product/product-7.jpg",
        category: "Clothing",
        colors: ["Black", "Gray", "Navy"]
    },
    {
        id: 8,
        name: "Canvas Wall Art",
        description: "Gallery-quality canvas print for your walls",
        price: 50,
        image: "./img/product/product-8.jpg",
        category: "Home Decor",
        colors: ["White"]
    }
];

// Function to render products
function renderProducts(productsToRender = products) {
    console.log('Rendering products:', productsToRender);
    const productsContainer = document.querySelector('.products-grid');
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }

    productsContainer.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-aos="fade-up" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='./img/product/product-1.jpg'">
                <div class="product-overlay">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <a href="customize.html?product=${product.id}" class="customize-btn">Customize</a>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${product.price} DT</p>
                <div class="product-colors">
                    ${product.colors.map(color => `
                        <span class="color-option" style="background-color: ${color.toLowerCase()}"></span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Initialize cart if not already initialized
    if (typeof window.cart === 'undefined') {
        console.log('Initializing cart...');
        window.cart = new Cart();
    }

    // Add event listeners for Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            try {
                // Disable the button temporarily
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                const productId = parseInt(button.dataset.productId);
                const product = products.find(p => p.id === productId);
                
                if (!product) {
                    throw new Error('Product not found');
                }

                const cartItem = {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    image: product.image,
                    cartId: Date.now(),
                    quantity: 1,
                    isCustomized: false
                };

                console.log('Adding product to cart:', {
                    id: cartItem.id,
                    name: cartItem.name,
                    price: cartItem.price
                });

                const added = window.cart.addItem(cartItem);
                if (!added) {
                    throw new Error('Failed to add item to cart');
                }

                showNotification('Product added to cart!');
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart. Please try again.');
            } finally {
                // Re-enable the button
                button.disabled = false;
                button.innerHTML = 'Add to Cart <i class="fas fa-shopping-cart"></i>';
            }
        });
    });
}

// Function to filter products by category
function filterProducts(category) {
    console.log('Filtering products by category:', category);
    if (category === 'All') {
        renderProducts();
    } else {
        const filtered = products.filter(product => product.category === category);
        renderProducts(filtered);
    }
}

// Function to sort products
function sortProducts(criteria) {
    console.log('Sorting products by:', criteria);
    let sorted = [...products];
    
    switch (criteria) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }
    
    renderProducts(sorted);
}

// Call renderProducts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
