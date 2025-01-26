document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    checkAdminAccess();

    // Initialize tab switching
    initializeTabs();

    // Load initial data
    loadDashboardData();
});

// Check if user has admin access
function checkAdminAccess() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.isLoggedIn || userData.role !== 'admin') {
            // If not admin, redirect to home page
            showNotification('Access denied. Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } catch (error) {
        window.location.href = 'index.html';
    }
}

// Initialize tab switching functionality
function initializeTabs() {
    const navLinks = document.querySelectorAll('.admin-nav a');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            link.classList.add('active');
            document.getElementById(`${targetSection}-section`).classList.add('active');

            // Load section data
            loadSectionData(targetSection);
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    // For demonstration, using mock data
    updateStats({
        users: 150,
        orders: 75,
        products: 45,
        revenue: 15000
    });
}

// Update dashboard statistics
function updateStats(data) {
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = data.users;
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = data.orders;
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = data.products;
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = `$${data.revenue.toLocaleString()}`;
}

// Load section specific data
function loadSectionData(section) {
    switch(section) {
        case 'users':
            loadUsers();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'products':
            loadProducts();
            break;
    }
}

// Load users data
function loadUsers() {
    // Mock user data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Admin User', email: 'admin@imprimini.com', role: 'admin' }
    ];

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load orders data
function loadOrders() {
    // Mock order data
    const orders = [
        { id: 'ORD001', customer: 'John Doe', date: '2024-01-26', status: 'Pending', total: 150 },
        { id: 'ORD002', customer: 'Jane Smith', date: '2024-01-25', status: 'Completed', total: 250 }
    ];

    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.status}</td>
            <td>$${order.total}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editOrder('${order.id}')"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load products data
function loadProducts() {
    // Mock product data
    const products = [
        { id: 1, name: 'Business Cards', price: 29.99, stock: 1000 },
        { id: 2, name: 'Flyers', price: 49.99, stock: 500 }
    ];

    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// CRUD Operations
function editUser(id) {
    // Implement user editing functionality
    console.log('Editing user:', id);
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        console.log('Deleting user:', id);
        showNotification('User deleted successfully');
    }
}

function editOrder(id) {
    // Implement order editing functionality
    console.log('Editing order:', id);
}

function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        console.log('Deleting order:', id);
        showNotification('Order deleted successfully');
    }
}

function editProduct(id) {
    // Implement product editing functionality
    console.log('Editing product:', id);
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        console.log('Deleting product:', id);
        showNotification('Product deleted successfully');
    }
}

// Settings form submission
document.getElementById('admin-settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        siteName: document.getElementById('siteName').value,
        contactEmail: document.getElementById('contactEmail').value,
        currency: document.getElementById('currency').value
    };

    console.log('Saving settings:', formData);
    showNotification('Settings saved successfully');
});
