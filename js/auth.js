// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    messageElement.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Function to validate username
function validateUsername(username) {
    if (!username) {
        return 'Username is required';
    }
    if (username.length < 3 || username.length > 20) {
        return 'Username must be between 3 and 20 characters';
    }
    return '';
}

// Function to validate password strength
function validatePassword(password) {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    const hasNumbers = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasNumbers) {
        return 'Password must contain at least one number';
    }
    if (!hasSymbol) {
        return 'Password must contain at least one symbol';
    }
    return '';
}

// Function to validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to handle form toggle between login and signup
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const ring = document.querySelector('.ring');
    
    ring.classList.toggle('expand', formType === 'signup');
    
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Function to toggle password visibility
function togglePasswordVisibility(input, icon) {
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Function to handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate email format
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
        showNotification(passwordError, 'error');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Store user data (in real app, this would be sent to a backend)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);

    showNotification('Account created successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberMe');
    
    showNotification('Logged out successfully');
    setTimeout(() => {
        window.location.href = './index.html';
    }, 1500);
}

// Function to check login status and update UI
function checkLoginStatus() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const isAdmin = userData && userData.role === 'admin';
        
        // Update account link with username if logged in
        const accountListItem = document.querySelector('.navbar ul li:last-child');
        
        if (userData && userData.isLoggedIn && accountListItem) {
            accountListItem.innerHTML = `
                <div class="user-dropdown">
                    <div class="user-info">
                        <i class="fas fa-user"></i>
                        <span>${userData.name}</span>
                    </div>
                    <div class="dropdown-content">
                        <a href="./orders.html"><i class="fas fa-box"></i> My Orders</a>
                        <a href="./account-settings.html"><i class="fas fa-cog"></i> Settings</a>
                        ${isAdmin ? '<a href="./admin.html"><i class="fas fa-user-shield"></i> Admin Dashboard</a>' : ''}
                        <div class="divider"></div>
                        <a href="#" onclick="handleLogout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>`;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
    }
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Add password toggle functionality
    document.querySelectorAll('.password-input').forEach(container => {
        const input = container.querySelector('input[type="password"]');
        const toggleIcon = container.querySelector('.toggle-password');
        
        if (toggleIcon) {
            toggleIcon.addEventListener('click', () => togglePasswordVisibility(input, toggleIcon));
        }
    });

    // Remember me functionality
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        const rememberMeCheckbox = document.getElementById('rememberMe');
        if (rememberMeCheckbox) {
            rememberMeCheckbox.checked = true;
        }
    }
});
