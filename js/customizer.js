document.addEventListener('DOMContentLoaded', function() {
    console.log('Customizer initializing...');

    // Initialize canvas
    const canvas = document.getElementById('customization-canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        showNotification('Error: Canvas not found', 'error');
        return;
    }

    // Initialize Fabric canvas
    const fabricCanvas = new fabric.Canvas('customization-canvas', {
        preserveObjectStacking: true,
        selection: true,
        allowTouchScrolling: true
    });

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('product'));
    console.log('Product ID from URL:', productId);

    if (!productId) {
        console.error('No product ID specified');
        showNotification('Error: No product selected', 'error');
        window.location.href = 'products.html';
        return;
    }

    // Find the current product
    const currentProduct = products.find(p => p.id === productId);
    console.log('Current product:', currentProduct);

    if (!currentProduct) {
        console.error('Product not found');
        showNotification('Error: Product not found', 'error');
        window.location.href = 'products.html';
        return;
    }

    // Update product info
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');

    if (productName) productName.textContent = currentProduct.name;
    if (productPrice) productPrice.textContent = `${currentProduct.price} DT`;
    if (productDescription) productDescription.textContent = currentProduct.description;

    // Initialize color swatches
    const colorSwatches = document.querySelector('.color-swatches');
    if (colorSwatches) {
        // Clear existing swatches
        colorSwatches.innerHTML = '';
        
        // Add color swatches if product has colors
        if (currentProduct.colors && currentProduct.colors.length > 0) {
            currentProduct.colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.innerHTML = `
                    <img src="${color.image}" alt="${color.name}" title="${color.name}">
                    <span class="color-name">${color.name}</span>
                `;
                swatch.setAttribute('data-color', color.name.toLowerCase());
                
                swatch.addEventListener('click', function() {
                    // Remove active class from all swatches
                    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                    // Add active class to clicked swatch
                    swatch.classList.add('active');
                    // Change product image
                    changeProductImage(color.image);
                });
                
                colorSwatches.appendChild(swatch);
            });

            // Set first color as active
            const firstSwatch = colorSwatches.querySelector('.color-swatch');
            if (firstSwatch) {
                firstSwatch.classList.add('active');
            }
        } else {
            // If no colors available, hide the color selection section
            const colorSection = document.querySelector('.color-section');
            if (colorSection) {
                colorSection.style.display = 'none';
            }
        }
    }

    // Function to change product image
    function changeProductImage(imageSrc) {
        fabric.Image.fromURL(imageSrc, function(img) {
            // Scale image to fit canvas
            const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            
            img.set({
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false
            });

            // Set canvas size
            fabricCanvas.setWidth(img.width * scale);
            fabricCanvas.setHeight(img.height * scale);
            
            // Add image to canvas
            fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
            
            // Resize canvas
            resizeCanvas();
        });
    }

    // Load the initial product image
    const productImage = new Image();
    productImage.crossOrigin = 'Anonymous';
    productImage.src = currentProduct.image;
    console.log('Loading product image:', currentProduct.image);

    // Function to resize canvas
    function resizeCanvas() {
        const container = document.querySelector('.canvas-container');
        if (!container) return;

        const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
        const scale = Math.min(maxSize / productImage.width, maxSize / productImage.height);
        
        const width = productImage.width * scale;
        const height = productImage.height * scale;
        
        fabricCanvas.setWidth(width);
        fabricCanvas.setHeight(height);
        fabricCanvas.calcOffset();
        fabricCanvas.renderAll();
    }

    productImage.onload = function() {
        console.log('Product image loaded successfully');
        
        // Create fabric image
        fabric.Image.fromURL(productImage.src, function(img) {
            // Scale image to fit canvas
            const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8);
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            
            img.set({
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false
            });

            // Set canvas size
            fabricCanvas.setWidth(img.width * scale);
            fabricCanvas.setHeight(img.height * scale);
            
            // Add image to canvas
            fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
            
            // Initial resize
            resizeCanvas();
        });
    };

    productImage.onerror = function(error) {
        console.error('Error loading product image:', error);
        showNotification('Error loading product image. Please try again.', 'error');
    };

    window.addEventListener('resize', resizeCanvas);

    // Wait for cart to be available
    if (typeof window.cart === 'undefined') {
        console.error('Cart not initialized. Creating new cart instance...');
        window.cart = new Cart();
    }

    // Initialize notification function if not already defined
    if (typeof showNotification === 'undefined') {
        window.showNotification = function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
                ${message}
                <button onclick="this.parentElement.remove()">×</button>
            `;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        };
    }

    // Check if Fabric.js is loaded
    if (typeof fabric === 'undefined') {
        console.error('Fabric.js is not loaded!');
        showNotification('Error: Required libraries not loaded. Please refresh the page.');
        return;
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function() {
            try {
                // Disable button while processing
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding to cart...';

                // Initialize cart if not already initialized
                if (typeof window.cart === 'undefined') {
                    window.cart = new Cart();
                }

                // Get customized image data URL with lower quality for storage
                const customizedImageURL = fabricCanvas.toDataURL({
                    format: 'jpeg',
                    quality: 0.8
                });

                // Create cart item
                const cartItem = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    quantity: 1,
                    customImage: customizedImageURL
                };

                // Add to cart
                const success = window.cart.addItem(cartItem);
                
                if (success) {
                    // Show success message
                    showNotification('Product added to cart successfully!');
                    
                    // Update cart count
                    const cartCount = document.querySelector('.cart-icon');
                    if (cartCount) {
                        cartCount.setAttribute('data-count', window.cart.getItemCount());
                    }

                    // Redirect to cart after a short delay
                    setTimeout(() => {
                        window.location.href = 'cart.html';
                    }, 1500);
                } else {
                    throw new Error('Failed to add item to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart. Please try again.');
            } finally {
                // Re-enable button
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }
        });
    }

    // Text controls
    const addTextBtn = document.getElementById('add-text');
    const textInput = document.getElementById('text-input');
    const fontFamily = document.getElementById('font-family');
    const fontSize = document.getElementById('font-size');
    const textColor = document.getElementById('text-color');

    if (addTextBtn && textInput) {
        addTextBtn.addEventListener('click', function() {
            const text = textInput.value.trim();
            if (!text) {
                showNotification('Please enter some text first');
                return;
            }

            console.log('Adding text:', text);
            const textObject = new fabric.Text(text, {
                left: fabricCanvas.width / 2,
                top: fabricCanvas.height / 2,
                fontFamily: fontFamily.value || 'Arial',
                fontSize: parseInt(fontSize.value) || 20,
                fill: textColor.value || '#000000',
                originX: 'center',
                originY: 'center'
            });

            fabricCanvas.add(textObject);
            fabricCanvas.setActiveObject(textObject);
            textInput.value = '';
            fabricCanvas.renderAll();
            console.log('Text added:', textObject);
        });
    }

    // Update text properties
    function updateActiveText() {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            console.log('Updating text properties');
            activeObject.set({
                fontFamily: fontFamily.value,
                fontSize: parseInt(fontSize.value),
                fill: textColor.value
            });
            fabricCanvas.renderAll();
        }
    }

    // Add event listeners for text controls
    [fontFamily, fontSize, textColor].forEach(control => {
        if (control) {
            control.addEventListener('change', updateActiveText);
        }
    });

    // Image upload
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                showNotification('Error: Image size should be less than 5MB');
                return;
            }

            console.log('Loading uploaded image:', file.name);
            const reader = new FileReader();
            reader.onload = function(event) {
                fabric.Image.fromURL(event.target.result, function(img) {
                    if (!img) {
                        showNotification('Error: Failed to load uploaded image');
                        return;
                    }

                    // Scale uploaded image
                    const scale = Math.min(
                        200 / img.width,
                        200 / img.height
                    );

                    img.scale(scale);
                    img.set({
                        left: fabricCanvas.width / 2,
                        top: fabricCanvas.height / 2,
                        originX: 'center',
                        originY: 'center'
                    });

                    fabricCanvas.add(img);
                    fabricCanvas.setActiveObject(img);
                    fabricCanvas.renderAll();
                    console.log('Image added to canvas');
                });
            };
            reader.readAsDataURL(file);
        });
    }

    // Delete selected object
    const deleteBtn = document.getElementById('delete-selected');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject && activeObject.name !== 'productImage') {
                console.log('Deleting object:', activeObject);
                fabricCanvas.remove(activeObject);
                fabricCanvas.renderAll();
                showNotification('Object deleted');
            }
        });
    }
});
