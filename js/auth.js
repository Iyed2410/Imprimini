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

// Function to validate password strength
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase || !hasLowerCase) {
        return 'Password must contain both uppercase and lowercase letters';
    }
    if (!hasNumbers) {
        return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
        return 'Password must contain at least one special character';
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

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Here you would typically validate against a backend
    // For demo purposes, we'll just check if fields are not empty
    if (username && password) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showNotification('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = './index.html';
        }, 1500);
    } else {
        showNotification('Please fill in all fields', 'error');
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
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // If user is logged in and tries to access account page, redirect to index
    if (isLoggedIn === 'true' && window.location.pathname.includes('account.html')) {
        window.location.href = './index.html';
        return;
    }

    // Update account link with username if logged in
    const accountListItem = document.querySelector('.navbar ul li:last-child');
    const username = localStorage.getItem('username');
    
    if (isLoggedIn === 'true' && accountListItem) {
        accountListItem.innerHTML = `
            <div class="user-dropdown">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <span>${username}</span>
                </div>
                <div class="dropdown-content">
                    <a href="./orders.html"><i class="fas fa-box"></i> My Orders</a>
                    <a href="./account-settings.html"><i class="fas fa-cog"></i> Settings</a>
                    <div class="divider"></div>
                    <a href="#" onclick="handleLogout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>`;
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
