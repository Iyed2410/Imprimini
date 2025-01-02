// Sample order data - in a real app, this would come from a backend
const orders = [
    {
        id: '12345',
        status: 'printing',
        progress: 60,
        estimatedCompletion: '2 hours',
        items: ['Custom Phone Case', '3D Printed Figurine'],
        steps: ['order_placed', 'processing', 'printing', 'quality_check', 'shipping']
    },
    {
        id: '12344',
        status: 'delivered',
        completedDate: 'December 28, 2023',
        items: ['Custom Keychains (x3)']
    }
];

// Update progress bars periodically
function updateProgress() {
    const activeOrders = document.querySelectorAll('.order-card:not(.completed)');
    activeOrders.forEach(order => {
        const progressBar = order.querySelector('.progress');
        if (progressBar) {
            let currentWidth = parseInt(progressBar.style.width) || 0;
            if (currentWidth < 100) {
                currentWidth += Math.random() * 5;
                if (currentWidth > 100) currentWidth = 100;
                progressBar.style.width = `${currentWidth}%`;
                
                // Update estimated time
                const timeElement = order.querySelector('[data-estimated-time]');
                if (timeElement) {
                    const remainingTime = Math.ceil((100 - currentWidth) / 10);
                    timeElement.textContent = `${remainingTime} hours`;
                }
            }
        }
    });
}

// Search functionality
function searchOrder() {
    const searchInput = document.getElementById('orderSearch');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    const orderCards = document.querySelectorAll('.order-card');
    orderCards.forEach(card => {
        const orderId = card.querySelector('h3').textContent.toLowerCase();
        if (orderId.includes(searchTerm)) {
            card.style.display = 'block';
            // Add highlight animation
            card.style.animation = 'highlight 1s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add real-time notifications
function addNotification(orderId, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <div class="notification-text">
                <strong>Order #${orderId}</strong>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Start progress updates
    setInterval(updateProgress, 5000);
    
    // Add event listeners for buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('.order-card').querySelector('h3').textContent.split('#')[1];
            // In a real app, this would open a modal with order details
            addNotification(orderId, 'Viewing order details...');
        });
    });
    
    document.querySelectorAll('.reorder-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('.order-card').querySelector('h3').textContent.split('#')[1];
            addNotification(orderId, 'Adding items to cart...');
        });
    });
    
    document.querySelectorAll('.review-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('.order-card').querySelector('h3').textContent.split('#')[1];
            addNotification(orderId, 'Opening review form...');
        });
    });
    
    // Demo: Add a random notification every 30 seconds
    setInterval(() => {
        const messages = [
            'Print job started',
            'Quality check completed',
            'Package ready for shipping',
            'Delivery in progress'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        addNotification('12345', randomMessage);
    }, 30000);
});
