// API Base URL
const API_URL = 'http://localhost:3000/api';

// Get token from localStorage
function getToken() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    console.log('User Data:', userData); // Debug log
    return userData?.token;
}

// API calls with authentication
async function apiCall(endpoint, options = {}) {
    const token = getToken();
    console.log('Token:', token); // Debug log
    
    if (!token) {
        console.log('No token found'); // Debug log
        showNotification('Authentication required', 'error');
        window.location.href = 'index.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    console.log('Request Headers:', headers); // Debug log

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        console.log('Response:', response); // Debug log

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Something went wrong');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error); // Debug log
        showNotification(error.message, 'error');
        if (error.message.includes('token')) {
            window.location.href = 'index.html';
        }
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    
    // Check if user is admin
    checkAdminAccess();

    // Initialize tab switching
    initializeTabs();

    // Load initial data
    loadDashboardData();
});

// Check if user has admin access
async function checkAdminAccess() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log('Checking admin access, userData:', userData); // Debug log
        
        if (!userData || !userData.token || userData.role !== 'admin') {
            console.log('Access denied: Missing or invalid credentials'); // Debug log
            showNotification('Access denied. Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Admin access check error:', error); // Debug log
        window.location.href = 'index.html';
        return false;
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
async function loadDashboardData() {
    try {
        const [users, orders, products] = await Promise.all([
            apiCall('/users'),
            apiCall('/orders'),
            apiCall('/products')
        ]);

        updateStats({
            users: users.length,
            orders: orders.length,
            products: products.length,
            revenue: orders.reduce((sum, order) => sum + Number(order.total), 0)
        });
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
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
async function loadUsers() {
    try {
        const users = await apiCall('/users');
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load orders data
async function loadOrders() {
    try {
        const orders = await apiCall('/orders');
        const tbody = document.getElementById('orders-table-body');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer_name}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>${order.status}</td>
                <td>$${Number(order.total).toLocaleString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editOrder(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Format price based on currency
function formatPrice(price, currency = 'TND') {
    const formatter = new Intl.NumberFormat('fr-TN', {
        style: 'currency',
        currency: currency
    });
    return formatter.format(price);
}

// Function to load products
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        
        const tableBody = document.getElementById('products-table-body');
        tableBody.innerHTML = ''; // Clear existing rows
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <div class="product-cell">
                        <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-description">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.stock || 'N/A'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="openEditModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        // Update products count in overview
        const productsCount = document.querySelector('#overview-section .stat-card:nth-child(3) .stat-number');
        if (productsCount) {
            productsCount.textContent = products.length;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products', 'error');
    }
}

// CRUD Operations
async function editUser(id) {
    // Implement user editing functionality
    console.log('Editing user:', id);
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await apiCall(`/users/${id}`, { method: 'DELETE' });
            showNotification('User deleted successfully');
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
}

async function editOrder(id) {
    // Implement order editing functionality
    console.log('Editing order:', id);
}

async function deleteOrder(id) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            await apiCall(`/orders/${id}`, { method: 'DELETE' });
            showNotification('Order deleted successfully');
            loadOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }
}

function openEditModal(product) {
    const modal = document.getElementById('editProductModal');
    const form = document.getElementById('editProductForm');
    
    // Set form values
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock || 0;
    document.getElementById('editProductDescription').value = product.description;
    
    modal.style.display = "block";

    // Close modal when clicking the close button
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Handle form submission
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const updatedProduct = {
            name: document.getElementById('editProductName').value,
            price: parseFloat(document.getElementById('editProductPrice').value),
            stock: parseInt(document.getElementById('editProductStock').value),
            description: document.getElementById('editProductDescription').value
        };

        try {
            const response = await fetch(`http://localhost:3000/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update product');
            }

            const result = await response.json();
            console.log('Product updated:', result);
            showNotification('Product updated successfully', 'success');
            modal.style.display = "none";
            loadProducts(); // Reload the products table
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification(error.message || 'Failed to update product', 'error');
        }
    };
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await apiCall(`/products/${id}`, { method: 'DELETE' });
            showNotification('Product deleted successfully');
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

// Settings form submission
document.getElementById('admin-settings-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        siteName: document.getElementById('siteName').value,
        contactEmail: document.getElementById('contactEmail').value,
        currency: document.getElementById('currency').value
    };

    try {
        await apiCall('/settings', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        showNotification('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
    }
});

// Show notification function (if not already defined)
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    notification.className = `notification ${type}`;
    notificationMessage.textContent = message;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}
