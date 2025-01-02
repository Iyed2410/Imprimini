// Product data
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        description: "Premium cotton t-shirt perfect for custom designs",
        price: 20,
        image: "./img/product/01_Classic_Organic_Tee-T-shirt-CS1001-Deep_Black.jpg",
        category: "Clothing",
        colors: [
            {
                name: "White",
                image: "./img/product/02_Classic_Organic_Tee-T-shirt-CS1001-Optical_White.jpg"
            },
            {
                name: "Black",
                image: "./img/product/01_Classic_Organic_Tee-T-shirt-CS1001-Deep_Black.jpg"
            }
        ]
    },
    {
        id: 2,
        name: "Hoodie",
        description: "Comfortable hoodie for all seasons",
        price: 40,
        image: "./img/product/04_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Deep_Black.jpg",
        category: "Clothing",
        colors: [
            {
                name: "Deep Black",
                image: "./img/product/04_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Deep_Black.jpg"
            },
            {
                name: "Navy Blue",
                image: "./img/product/07_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Navy_Blue.jpg"
            },
            {
                name: "Heather Grey",
                image: "./img/product/02_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Heather_Grey.jpg"
            },
            {
                name: "Sapphire Blue",
                image: "./img/product/01_CS1015_Female_OrganicOversizedHood-SapphireBlue_1.jpg"
            },
            {
                name: "Raspberry Pink",
                image: "./img/product/05_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Raspberry_Pink.jpg"
            }
        ]
    },
    {
        id: 3,
        name: "Ceramic Coffee Mug",
        description: "High-quality ceramic mug for your morning coffee",
        price: 15,
        image: "./img/product/Ceramic-Coffee-Mug.jpg",
        category: "Mugs",
        colors: [
            {
                name: "White",
                image: "./img/product/Ceramic-Coffee-Mug.jpg"
            },
            {
                name: "Black",
                image: "./img/product/Ceramic-Coffee-Mug-B.jpg"
            }
        ]
    },
    {
        id: 4,
        name: "Color Changing Mug",
        description: "Magic mug that reveals design when hot",
        price: 20,
        image: "./img/product/product-4.jpg",
        category: "Mugs",
        colors: []
    },
    {
        id: 5,
        name: "Oversized Crew",
        description: "Comfortable and stylish oversized crew neck sweatshirt",
        price: 40,
        image: "./img/product/10_Organic_Oversized_Crew-Oversized_Crew-CS1012-Deep_Black.jpg",
        category: "Clothing",
        colors: [
            {
                name: "Deep Black",
                image: "./img/product/10_Organic_Oversized_Crew-Oversized_Crew-CS1012-Deep_Black.jpg"
            },
            {
                name: "Heather Grey",
                image: "./img/product/02_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Heather_Grey.jpg"
            },
            {
                name: "Ivory White",
                image: "./img/product/03_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Ivory_White_0097114e-8002-4bc2-a1f6-223908dbdcf4.jpg"
            },
            {
                name: "Navy Blue",
                image: "./img/product/07_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Navy_Blue.jpg"
            },
            {
                name: "Limestone Grey",
                image: "./img/product/08_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Limestone_Grey.jpg"
            },
            {
                name: "Snow Melange",
                image: "./img/product/12_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Snow_Melange.jpg"
            },
            {
                name: "Raspberry Pink",
                image: "./img/product/05_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Raspberry_Pink.jpg"
            },
            {
                name: "Purple Jade",
                image: "./img/product/06_CS1015-PurpleJade_b6677a3c-def4-4851-a2b2-c14202412472.jpg"
            },
            {
                name: "Sahara Camel",
                image: "./img/product/09_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Sahara_Camel.jpg"
            },
            {
                name: "Faded Black",
                image: "./img/product/11_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Faded_Black_038b5d69-e5f8-4c19-8f3b-612b4492157e.jpg"
            },
            {
                name: "Sandstone Orange",
                image: "./img/product/14_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Sandstone_Orange_b7023bda-926e-4a54-9223-b63c3b24f6d4.jpg"
            },
            {
                name: "Coffee Brown",
                image: "./img/product/15_Organic_Oversized_Hood-Oversized_Hoodie-CS1015-Coffee_Brown_5a07b23c-30a0-48ff-b1d7-613a2c56a08c.jpg"
            },
            {
                name: "Sapphire Blue",
                image: "./img/product/01_CS1015_Female_OrganicOversizedHood-SapphireBlue_1.jpg"
            }
        ]
    },
    {
        id: 6,
        name: "Colored T-Shirt",
        description: "Vibrant colored t-shirt for bold designs",
        price: 25,
        image: "./img/product/03_Classic_Organic_Tee-T-shirt-CS1001-Oxblood_Red_e2cc926c-bd41-4fd8-b99e-fd821648d11f.jpg",
        category: "Clothing",
        colors: [
            {
                name: "Red",
                image: "./img/product/03_Classic_Organic_Tee-T-shirt-CS1001-Oxblood_Red_e2cc926c-bd41-4fd8-b99e-fd821648d11f.jpg"
            },
            {
                name: "Black",
                image: "./img/product/01_Classic_Organic_Tee-T-shirt-CS1001-Deep_Black.jpg"
            },
            {
                name: "White",
                image: "./img/product/15_Classic_Organic_Tee-T-shirt-CS1001-Ivory_White.jpg"
            },
            {
                name: "Navy Blue",
                image: "./img/product/07_Classic_Organic_Tee-T-shirt-CS1001-Navy_Blue_9093a495-e0c6-4a72-9e62-d3ccac6c25a4.jpg"
            },
            {
                name: "Tropical Sea",
                image: "./img/product/05_CS1001_Male_ClassicOrganicTee-TropicalSea_1.jpg"
            },
            {
                name: "Purple Jade",
                image: "./img/product/11_CS1001-PurpleJade.jpg"
            },
            {
                name: "Forest Green",
                image: "./img/product/08_CS1001_Male_ClassicOrganicTee-MidnightForest_1.jpg"
            },
            {
                name: "Heather Grey",
                image: "./img/product/04_Classic_Organic_Tee-T-shirt-CS1001-Heather_Grey_7dcba8c0-49d7-4d02-b083-fd6c2bd98084.jpg"
            },
            {
                name: "Misty Brown",
                image: "./img/product/13_CS1001_Male_ClassicOrganicTee-MistyBrown_1.jpg"
            },
            {
                name: "Burned Yellow",
                image: "./img/product/18_Classic_Organic_Tee-T-shirt-CS1001-Burned_Yellow.jpg"
            }
        ]
    },
    {
        id: 7,
        name: "Wool Hat",
        description: "Premium Merino wool hat for ultimate comfort and style",
        price: 45,
        image: "./img/product/04_Merino_Wool_Hat-Hat-CS5085-Scarlet_Red_01df4d62-f2e6-4fed-b0ae-231ad1fa657d.jpg",
        category: "Clothing",
        colors: [
            {
                name: "Scarlet Red",
                image: "./img/product/04_Merino_Wool_Hat-Hat-CS5085-Scarlet_Red_01df4d62-f2e6-4fed-b0ae-231ad1fa657d.jpg"
            },
            {
                name: "Oxblood Red",
                image: "./img/product/01_Merino_Wool_Hat-Hat-CS5085-Oxblood_Red_ec3487a7-de65-4776-b965-e5b15c507807.jpg"
            },
            {
                name: "Purple Haze",
                image: "./img/product/03_Merino_Wool_Hat-Hat-CS5085-Purple_Haze_9de2786f-8537-4000-86c8-ec842d27e26e.jpg"
            },
            {
                name: "Deep Black",
                image: "./img/product/05_Merino_Wool_Hat-Hat-CS5085-Deep_Black.jpg"
            },
            {
                name: "Dusty Olive",
                image: "./img/product/06_Merino_Wool_Hat-Hat-CS5085-Dusty_Olive_f4ba4429-ec0a-4118-9ca2-3e2030f46471.jpg"
            },
            {
                name: "Pacific Blue",
                image: "./img/product/07_Merino_Wool_Hat-Hat-CS5085-Pacific_Blue_117009f5-5bfc-40a3-8000-aec9ac771a5e.jpg"
            },
            {
                name: "Stone Blue",
                image: "./img/product/08_Merino_Wool_Hat-Hat-CS5085-Stone_Blue_172b3e9f-9a8e-449a-b55c-ea1669f5e7da.jpg"
            },
            {
                name: "Heather Grey",
                image: "./img/product/09_Merino_Wool_Hat-Hat-CS5085-Heather_Grey.jpg"
            },
            {
                name: "Lava Grey",
                image: "./img/product/10_Merino_Wool_Hat-Hat-CS5085-Lava_Grey.jpg"
            },
            {
                name: "Ocean Green",
                image: "./img/product/11_Merino_Wool_Hat-Hat-CS5085-Ocean_Green_c6fe7f57-1b0c-4bbf-a9b1-5a0eb6442a86.jpg"
            },
            {
                name: "Soft Lavender",
                image: "./img/product/12_Merino_Wool_Hat-Hat-CS5085-Soft_Lavender_631a321d-3bd8-4c3a-af85-9b2fad13e702.jpg"
            },
            {
                name: "Limestone Grey",
                image: "./img/product/13_Merino_Wool_Hat-Hat-CS5085-Limestone_Grey_61bcb6c2-1632-42fc-9e2f-b4fa55e874fe.jpg"
            },
            {
                name: "Hunter Green",
                image: "./img/product/14_Merino_Wool_Hat-Hat-CS5085-Hunter_Green_50453e7d-df0a-42dc-90f5-6380895b8906.jpg"
            },
            {
                name: "Warm Taupe",
                image: "./img/product/15_Merino_Wool_Hat-Hat-CS5085-Warm_Taupe.jpg"
            },
            {
                name: "Navy Blue",
                image: "./img/product/16_Merino_Wool_Hat-Hat-CS5085-Navy_Blue.jpg"
            }
        ]
    },
    {
        id: 8,
        name: "Sweatpants",
        description: "Comfortable organic cotton sweatpants with modern fit",
        price: 50,
        image: "./img/product/02_Organic_Sweatpants-Pants-CS1011-Soft_Lavender.jpg",
        category: "Clothing",
        colors: [
            {
                name: "Soft Lavender",
                image: "./img/product/02_Organic_Sweatpants-Pants-CS1011-Soft_Lavender.jpg"
            },
            {
                name: "Oyster Grey",
                image: "./img/product/01_Organic_Sweatpants-Pants-CS1011-Oyster_Grey_6e5b059a-26a1-41b8-a848-fecfbfb9d48f.jpg"
            },
            {
                name: "Teal Blue",
                image: "./img/product/03_Organic_Sweatpants-Pants-CS1011-Teal_Blue.jpg"
            },
            {
                name: "Raspberry Pink",
                image: "./img/product/04_Organic_Sweatpants-Pants-CS1011-Raspberry_Pink_79d3eb82-9181-4cb3-9a35-93757ae45f82.jpg"
            },
            {
                name: "Heather Grey",
                image: "./img/product/05_Organic_Sweatpants-Pants-CS1011-Heather_Grey_25305df8-8a44-4db2-ad54-601f8f43c47a.jpg"
            },
            {
                name: "Neptune Blue",
                image: "./img/product/06_CS1011_Female_OrganicSweatpants-NeptuneBlue_1.jpg"
            },
            {
                name: "Snow Melange",
                image: "./img/product/07_Organic_Sweatpants-Pants-CS1011-Snow_Melange_6505a777-7fb8-43fd-b7c9-43c8df788fee.jpg"
            },
            {
                name: "Warm Taupe",
                image: "./img/product/08_Organic_Sweatpants-Pants-CS1011-Warm_Taupe_3fe1e664-0515-47f0-95c2-47122367cbf4.jpg"
            },
            {
                name: "Deep Black",
                image: "./img/product/09_Organic_Sweatpants-Pants-CS1011-Deep_Black_0e8fddc0-e17d-4780-877c-c1005e600f06.jpg"
            },
            {
                name: "Ivory White",
                image: "./img/product/10_Organic_Sweatpants-Pants-CS1011-Ivory_White_003e9c65-f77d-44a3-bf37-81ad760e9e16.jpg"
            },
            {
                name: "Lava Grey",
                image: "./img/product/11_Organic_Sweatpants-Pants-CS1011-Lava_Grey_9f451e36-86db-4ff2-95cc-d1d0f8bf2511.jpg"
            },
            {
                name: "Navy Blue",
                image: "./img/product/12_Organic_Sweatpants-Pants-CS1011-Navy_Blue_ab4b1a36-2d66-4ac0-b030-f82fd7fde203.jpg"
            },
            {
                name: "Pearly Purple",
                image: "./img/product/13_Organic_Sweatpants-Pants-CS1011-Pearly_Purple.jpg"
            },
            {
                name: "Spring Green",
                image: "./img/product/14_Organic_Sweatpants-Pants-CS1011-Spring_Green.jpg"
            },
            {
                name: "Faded Black",
                image: "./img/product/15_Organic_Sweatpants-Pants-CS1011-Faded_Black_e542a3c6-669b-4737-84ba-429f8a702edb.jpg"
            }
        ]
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
    const filteredProducts = category === 'All' 
        ? products 
        : products.filter(product => product.category === category);
    return filteredProducts;
}

// Function to sort products
function sortProducts(products, criteria) {
    const sortedProducts = [...products];
    switch (criteria) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
    }
    return sortedProducts;
}

// Initialize filtering and sorting
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');
    let currentCategory = 'All';
    let currentSortCriteria = 'name';

    // Function to update product display
    function updateProducts() {
        const filteredProducts = filterProducts(currentCategory);
        const sortedAndFilteredProducts = sortProducts(filteredProducts, currentSortCriteria);
        renderProducts(sortedAndFilteredProducts);

        // Update active filter button
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === currentCategory);
        });
    }

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.dataset.category;
            updateProducts();
        });
    });

    // Sort select change handler
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSortCriteria = sortSelect.value;
            updateProducts();
        });
    }

    // Initial render
    updateProducts();
});
