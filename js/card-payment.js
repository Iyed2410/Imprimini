document.addEventListener('DOMContentLoaded', function() {
    const cardItem = document.querySelector('.card-item');
    const cardNumber = document.getElementById('cardNumber');
    const cardName = document.getElementById('cardName');
    const cardMonth = document.getElementById('cardMonth');
    const cardYear = document.getElementById('cardYear');
    const cardCvv = document.getElementById('cardCvv');
    const form = document.querySelector('.card-form__inner');

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

    cardName.addEventListener('input', (e) => {
        document.querySelector('.card-item__name').textContent = e.target.value || 'FULL NAME';
    });

    cardMonth.addEventListener('change', updateExpiry);
    cardYear.addEventListener('change', updateExpiry);

    cardCvv.addEventListener('focus', () => flipCard(true));
    cardCvv.addEventListener('blur', () => flipCard(false));

    cardCvv.addEventListener('input', (e) => {
        document.querySelector('.card-item__cvvBand').textContent = e.target.value || '***';
    });

    // Initialize card display
    updateCardNumber('');
    document.querySelector('.card-item__name').textContent = 'FULL NAME';
    document.querySelector('.card-item__dateContent:first-child').textContent = 'MM';
    document.querySelector('.card-item__dateContent:last-child').textContent = 'YY';
    document.querySelector('.card-item__cvvBand').textContent = '***';

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!cardNumber.value || cardNumber.value.replace(/\D/g, '').length < 16) {
            alert('Please enter a valid card number');
            return;
        }
        
        if (!cardName.value) {
            alert('Please enter card holder name');
            return;
        }
        
        if (!cardMonth.value || !cardYear.value) {
            alert('Please select expiry date');
            return;
        }
        
        if (!cardCvv.value || cardCvv.value.length < 3) {
            alert('Please enter a valid CVV');
            return;
        }

        console.log('Payment processed successfully!');
        alert('Payment processed successfully!');
    });
});
