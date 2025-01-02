document.addEventListener('DOMContentLoaded', function() {
    console.log('Customizer initializing...');

    // Wait for cart to be available
    if (typeof window.cart === 'undefined') {
        console.error('Cart not initialized. Creating new cart instance...');
        window.cart = new Cart();
    }

    // Initialize notification function if not already defined
    if (typeof showNotification === 'undefined') {
        window.showNotification = function(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        };
    }

    // Check if Fabric.js is loaded
    if (typeof fabric === 'undefined') {
        console.error('Fabric.js is not loaded!');
        showNotification('Error: Required libraries not loaded. Please refresh the page.');
        return;
    }

    // Initialize canvas with proper dimensions
    const canvas = new fabric.Canvas('design-preview', {
        width: 500,
        height: 500,
        backgroundColor: '#ffffff'
    });
    console.log('Canvas initialized:', canvas);

    // Get product from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('product'));
    console.log('Product ID from URL:', productId);

    if (!productId) {
        console.error('No product ID in URL');
        showNotification('Error: No product selected');
        return;
    }
    
    // Check if products array exists
    if (typeof products === 'undefined' || !Array.isArray(products)) {
        console.error('Products array is not properly loaded');
        showNotification('Error: Product data not loaded. Please refresh the page.');
        return;
    }

    // Find the current product
    const currentProduct = products.find(p => p.id === productId);
    console.log('Current product:', currentProduct);
    
    if (!currentProduct) {
        console.error('Product not found for ID:', productId);
        showNotification('Error: Product not found');
        return;
    }

    // Update product info
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-description').textContent = currentProduct.description;
    document.getElementById('product-price').textContent = currentProduct.price.toFixed(2);

    // Load product image
    console.log('Loading product image:', currentProduct.image);
    fabric.Image.fromURL(currentProduct.image, function(img) {
        if (!img) {
            console.error('Failed to load product image');
            showNotification('Error: Failed to load product image');
            return;
        }

        // Scale image to fit entire canvas
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        img.scale(scale);
        img.set({
            left: 0,
            top: 0,
            selectable: false,
            evented: false,
            name: 'productImage'
        });

        canvas.add(img);
        canvas.renderAll();
        console.log('Product image added to canvas');
    });

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
                left: canvas.width / 2,
                top: canvas.height / 2,
                fontFamily: fontFamily.value || 'Arial',
                fontSize: parseInt(fontSize.value) || 20,
                fill: textColor.value || '#000000',
                originX: 'center',
                originY: 'center'
            });

            canvas.add(textObject);
            canvas.setActiveObject(textObject);
            textInput.value = '';
            canvas.renderAll();
            console.log('Text added:', textObject);
        });
    }

    // Update text properties
    function updateActiveText() {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            console.log('Updating text properties');
            activeObject.set({
                fontFamily: fontFamily.value,
                fontSize: parseInt(fontSize.value),
                fill: textColor.value
            });
            canvas.renderAll();
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
                        left: canvas.width / 2,
                        top: canvas.height / 2,
                        originX: 'center',
                        originY: 'center'
                    });

                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.renderAll();
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
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.name !== 'productImage') {
                console.log('Deleting object:', activeObject);
                canvas.remove(activeObject);
                canvas.renderAll();
                showNotification('Object deleted');
            }
        });
    }

    // Add to Cart functionality
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function() {
            try {
                // Disable the button during processing
                addToCartBtn.disabled = true;
                addToCartBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                // Make sure cart is initialized
                if (!window.cart) {
                    console.error('Cart not initialized');
                    throw new Error('Cart not available');
                }

                // Get the canvas data URL with lower quality for storage
                const customizedDesign = canvas.toDataURL({
                    format: 'jpeg',
                    quality: 0.5,
                    multiplier: 0.8
                });

                // Create cart item from current product
                const cartItem = {
                    id: currentProduct.id,
                    name: currentProduct.name,
                    description: currentProduct.description,
                    price: currentProduct.price,
                    image: currentProduct.image,
                    cartId: Date.now(),
                    quantity: 1,
                    customizedDesign: customizedDesign,
                    isCustomized: true
                };

                console.log('Adding customized item to cart:', {
                    id: cartItem.id,
                    name: cartItem.name,
                    price: cartItem.price,
                    isCustomized: cartItem.isCustomized
                });

                // Add to cart
                const added = window.cart.addItem(cartItem);
                if (!added) {
                    throw new Error('Failed to add item to cart');
                }

                showNotification('Customized product added to cart!');
                
                // Redirect to cart page after a short delay
                setTimeout(() => {
                    window.location.href = 'cart.html';
                }, 1500);

            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart. Please try again.');
            } finally {
                // Re-enable the button
                addToCartBtn.disabled = false;
                addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
            }
        });
    }

    // Make canvas responsive
    window.addEventListener('resize', function() {
        const container = canvas.wrapperEl.parentNode;
        const ratio = canvas.width / canvas.height;
        const containerWidth = container.clientWidth;
        const scale = containerWidth / canvas.width;
        const zoom = Math.min(1, scale);
        canvas.setZoom(zoom);
        canvas.setDimensions({
            width: containerWidth,
            height: containerWidth / ratio
        });
    });

    // Initialize canvas size
    window.dispatchEvent(new Event('resize'));
});
