// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your actual Stripe publishable key
const elements = stripe.elements();

// Create card element
const card = elements.create('card', {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
});

// Mount the card element
document.addEventListener('DOMContentLoaded', function() {
    const cardElement = document.getElementById('card-element');
    if (cardElement) {
        card.mount('#card-element');
    }
});

// Handle form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const submitButton = document.querySelector('#submit-payment');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span id="button-text">Processing...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            // Simulate successful payment (remove this in production)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart
            if (window.cart) {
                window.cart.items = [];
                window.cart.saveCart();
            }

            // Show success message
            showNotification('Payment successful! Thank you for your purchase.');

            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 1500);

        } catch (error) {
            console.error('Payment error:', error);
            showNotification(error.message || 'Payment failed. Please try again.', 'error');
            
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = '<span id="button-text">Pay Now</span> <i class="fas fa-lock"></i>';
        }
    });
}

// Handle real-time validation errors
card.addEventListener('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});
