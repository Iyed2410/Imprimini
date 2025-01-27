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
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const work = document.getElementById('signupWork').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate name
    if (!name) {
        showNotification('Name is required', 'error');
        return;
    }

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

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                work: work || null // Send null if work is empty
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        showNotification('Account created successfully! Please log in.');
        
        // Switch to login form after successful registration
        setTimeout(() => {
            toggleForm('login');
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message, 'error');
    }
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate email format
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Validate password is not empty
    if (!password) {
        showNotification('Password is required', 'error');
        return;
    }

    console.log('Login attempt:', { email, rememberMe }); // Debug log

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('Login response:', data); // Debug log
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store user data
        const userData = {
            isLoggedIn: true,
            token: data.token,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            rememberMe: rememberMe
        };

        console.log('Storing user data:', userData); // Debug log
        localStorage.setItem('userData', JSON.stringify(userData));
        
        showNotification('Login successful');
        
        // Add a small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (data.user.role === 'admin') {
            console.log('Admin user detected, redirecting to admin page'); // Debug log
            window.location.href = './admin.html';
        } else {
            window.location.href = './index.html';
        }
    } catch (error) {
        console.error('Login error:', error); // Debug log
        showNotification(error.message, 'error');
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('userData');
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
