// Initialize Stripe
const stripe = Stripe('your_publishable_key'); // Replace with your actual Stripe publishable key
const elements = stripe.elements();

document.addEventListener('DOMContentLoaded', function() {
    const cardItem = document.querySelector('.card-item');
    const cardNumber = document.getElementById('cardNumber');
    const cardName = document.getElementById('cardName');
    const cardMonth = document.getElementById('cardMonth');
    const cardYear = document.getElementById('cardYear');
    const cardCvv = document.getElementById('cardCvv');
    const form = document.querySelector('.card-form__inner');

    // Create Stripe card element
    const stripeCard = elements.create('card', {
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

    // Mount Stripe card if element exists
    const stripeCardElement = document.getElementById('card-element');
    if (stripeCardElement) {
        stripeCard.mount('#card-element');
    }

    // Set random background
    const randomBg = Math.floor(Math.random() * 25 + 1);
    document.querySelector('.card-item__bg').src = `https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${randomBg}.jpeg`;

    // Initialize month select
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i < 10 ? `0${i}` : i;
        option.textContent = i < 10 ? `0${i}` : i;
        cardMonth.appendChild(option);
    }

    // Initialize year select
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i <= currentYear + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        cardYear.appendChild(option);
    }

    // Card type detection
    function getCardType(number) {
        let re = new RegExp("^4");
        if (number.match(re) != null) return "visa";

        re = new RegExp("^(34|37)");
        if (number.match(re) != null) return "amex";

        re = new RegExp("^5[1-5]");
        if (number.match(re) != null) return "mastercard";

        re = new RegExp("^6011");
        if (number.match(re) != null) return "discover";
        
        re = new RegExp('^9792');
        if (number.match(re) != null) return 'troy';

        return "visa"; // default type
    }

    // Format card number with mask
    function formatCardNumber(value) {
        const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
        const onlyNumbers = value.replace(/[^\d]/g, '');

        return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
            [$1, $2, $3, $4].filter(group => !!group).join(' ')
        );
    }

    // Update card number display
    function updateCardNumber(value) {
        const numbers = value.replace(/\D/g, '');
        const cardDigits = numbers.padEnd(16, '#');
        
        const cardNumberItems = document.querySelectorAll('.card-item__numberItem');
        cardNumberItems.forEach((item, index) => {
            item.textContent = cardDigits[index];
            item.classList.toggle('-active', cardDigits[index] !== '#');
        });
    }

    // Update card name display
    function updateCardName() {
        const name = cardName.value.toUpperCase();
        document.querySelector('.card-item__name').textContent = name || 'FULL NAME';
    }

    // Update expiry date
    function updateExpiry() {
        const month = cardMonth.value || 'MM';
        const year = cardYear.value ? String(cardYear.value).slice(-2) : 'YY';
        
        const monthContent = document.querySelector('.card-item__dateContent:first-child');
        const yearContent = document.querySelector('.card-item__dateContent:last-child');
        
        monthContent.textContent = month;
        yearContent.textContent = year;
    }

    // Card flip
    function flipCard(isBack) {
        cardItem.classList.toggle('-active', isBack);
    }

    // Event listeners
    cardNumber.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.value = formatCardNumber(value);
        updateCardNumber(value);
    });

    cardName.addEventListener('input', updateCardName);
    cardMonth.addEventListener('change', updateExpiry);
    cardYear.addEventListener('change', updateExpiry);
    cardCvv.addEventListener('focus', () => flipCard(true));
    cardCvv.addEventListener('blur', () => flipCard(false));

    cardCvv.addEventListener('input', (e) => {
        document.querySelector('.card-item__cvvBand').textContent = e.target.value || '***';
    });

    // Initialize card display
    updateCardNumber('');
    updateCardName();
    updateExpiry();
    document.querySelector('.card-item__cvvBand').textContent = '***';

    // Enhanced form submission with Stripe integration
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span>Processing...</span> <i class="fas fa-spinner fa-spin"></i>';
            }

            // Basic validation
            if (!cardNumber.value || cardNumber.value.replace(/\D/g, '').length < 16) {
                showError('Please enter a valid card number');
                return;
            }
            
            if (!cardName.value) {
                showError('Please enter card holder name');
                return;
            }
            
            if (!cardMonth.value || !cardYear.value) {
                showError('Please select expiry date');
                return;
            }
            
            if (!cardCvv.value || cardCvv.value.length < 3) {
                showError('Please enter a valid CVV');
                return;
            }

            try {
                // Process payment with Stripe
                const result = await stripe.createToken(stripeCard);
                if (result.error) {
                    throw new Error(result.error.message);
                }

                // Clear cart after successful payment
                if (window.cart) {
                    window.cart.items = [];
                    window.cart.saveCart();
                }

                // Show success and redirect
                showNotification('Payment successful! Thank you for your purchase.');
                setTimeout(() => {
                    window.location.href = 'order-confirmation.html';
                }, 1500);

            } catch (error) {
                console.error('Payment error:', error);
                showError(error.message || 'Payment failed. Please try again.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<span>Pay Now</span> <i class="fas fa-lock"></i>';
                }
            }
        });
    }

    // Handle Stripe card validation
    if (stripeCard) {
        stripeCard.addEventListener('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (displayError) {
                displayError.textContent = event.error ? event.error.message : '';
            }
        });
    }

    // Helper functions
    function showError(message) {
        const errorElement = document.getElementById('card-errors');
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            alert(message);
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
