document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if not already initialized
    if (typeof window.cart === 'undefined') {
        console.log('Initializing cart...');
        window.cart = new Cart();
    }

    // Get DOM elements
    const summaryItemsContainer = document.querySelector('.summary-items');
    const subtotalAmount = document.querySelector('.subtotal .amount');
    const shippingAmount = document.querySelector('.shipping .amount');
    const totalAmount = document.querySelector('.total .amount');
    const amountInput = document.getElementById('amount');

    // Format price based on currency
    function formatPrice(price, currency = 'TND') {
        const formatter = new Intl.NumberFormat('fr-TN', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(price);
    }

    function updateOrderSummary() {
        const items = window.cart.items;
        
        if (!items || items.length === 0) {
            // Redirect to cart if no items
            window.location.href = 'cart.html';
            return;
        }

        // Clear existing items
        summaryItemsContainer.innerHTML = '';

        // Add each item to the order summary
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.price * item.quantity;
            const itemHTML = `
                <div class="summary-item">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">${formatPrice(item.price)} × ${item.quantity}</p>
                    </div>
                    <div class="item-total">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            `;
            summaryItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Calculate totals
        const shipping = 7.00; // Fixed 7 DT shipping
        const total = subtotal + shipping;

        // Update summary amounts
        subtotalAmount.textContent = formatPrice(subtotal);
        shippingAmount.textContent = formatPrice(shipping);
        totalAmount.textContent = formatPrice(total);

        // Update hidden amount input for payment processing
        if (amountInput) {
            amountInput.value = Math.round(total * 100); // Convert to cents for Stripe
        }
    }

    // Initialize notification function if not already defined
    if (typeof window.showNotification === 'undefined') {
        window.showNotification = function(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        };
    }

    // Update order summary when page loads
    updateOrderSummary();

    new Vue({
      el: "#app",
      data() {
        return {
          currentCardBackground: Math.floor(Math.random()* 25 + 1),
          cardName: "",
          cardNumber: "",
          cardMonth: "",
          cardYear: "",
          cardCvv: "",
          minCardYear: new Date().getFullYear(),
          amexCardMask: "#### ###### #####",
          otherCardMask: "#### #### #### ####",
          cardNumberTemp: "",
          isCardFlipped: false,
          focusElementStyle: null,
          isInputFocused: false
        };
      },
      mounted() {
        this.cardNumberTemp = this.otherCardMask;
        document.getElementById("cardNumber").focus();
      },
      computed: {
        getCardType () {
          let number = this.cardNumber;
          let re = new RegExp("^4");
          if (number.match(re) != null) return "visa";

          re = new RegExp("^(34|37)");
          if (number.match(re) != null) return "amex";

          re = new RegExp("^5[1-5]");
          if (number.match(re) != null) return "mastercard";

          re = new RegExp("^6011");
          if (number.match(re) != null) return "discover";
          
          re = new RegExp('^9792')
          if (number.match(re) != null) return 'troy'

          return "visa"; // default type
        },
        generateCardNumberMask () {
          return this.getCardType === "amex" ? this.amexCardMask : this.otherCardMask;
        },
        minCardMonth () {
          if (this.cardYear === this.minCardYear) return new Date().getMonth() + 1;
          return 1;
        }
      },
      watch: {
        cardYear () {
          if (this.cardMonth < this.minCardMonth) {
            this.cardMonth = "";
          }
        }
      },
      methods: {
        flipCard (status) {
          this.isCardFlipped = status;
        },
        focusInput (e) {
          this.isInputFocused = true;
          let targetRef = e.target.dataset.ref;
          let target = this.$refs[targetRef];
          this.focusElementStyle = {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
            transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
          }
        },
        blurInput() {
          let vm = this;
          setTimeout(() => {
            if (!vm.isInputFocused) {
              vm.focusElementStyle = null;
            }
          }, 300);
          vm.isInputFocused = false;
        },
        submitPayment() {
          // Add validation
          if (!this.cardNumber || !this.cardName || !this.cardMonth || !this.cardYear || !this.cardCvv) {
            alert('Please fill in all card details');
            return;
          }
          
          // Here you would normally process the payment with your payment provider
          // For now, we'll simulate a successful payment
          
          // Store order amount for confirmation page
          const cartTotal = localStorage.getItem('cartTotal');
          localStorage.setItem('orderAmount', cartTotal);
          
          // Clear cart
          localStorage.removeItem('cart');
          
          // Redirect to confirmation page
          window.location.href = 'order-confirmation.html';
        }
      }
    });
});
