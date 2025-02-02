// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    if (notification && messageElement) {
        messageElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'flex';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Function to show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
}

// Function to clear field errors
function clearFieldErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.style.display = 'none';
        element.textContent = '';
    });
}

// Function to validate email
function validateEmail(email) {
    if (!email) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

// Function to validate password
function validatePassword(password) {
    if (!password) {
        return 'Password is required';
    }

    const errors = [];
    if (password.length < 8) {
        errors.push('at least 8 characters');
    }
    if (!/\d/.test(password)) {
        errors.push('a number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('a symbol (!@#$%^&*(),.?":{}|<>)');
    }

    if (errors.length > 0) {
        return `Password must contain ${errors.join(', ')}`;
    }
    return '';
}

// Function to validate name
function validateName(name) {
    if (!name) {
        return 'Name is required';
    }
    if (name.length < 2) {
        return 'Name must be at least 2 characters long';
    }
    return '';
}

// Function to validate work/profession
function validateWork(work) {
    if (!work) {
        return 'Work/Profession is required';
    }
    if (work.length < 2) {
        return 'Work/Profession must be at least 2 characters long';
    }
    return '';
}

// Update account display in navbar
function updateAccountDisplay() {
    const accountLink = document.querySelector('.account-link');
    const userName = document.querySelector('.user-name');
    const loggedOutContent = document.querySelector('.logged-out-content');
    const loggedInContent = document.querySelector('.logged-in-content');
    
    if (!accountLink || !userName || !loggedOutContent || !loggedInContent) return;
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData.isLoggedIn) {
            // Update account link and name
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${userData.username}`;
            accountLink.href = '#';
            userName.textContent = userData.username;
            loggedOutContent.style.display = 'none';
            loggedInContent.style.display = 'block';

            // Check if we're on the admin page
            const isAdminPage = window.location.pathname.endsWith('admin.html');

            // Update dropdown content with admin link if user is admin
            const adminLinkHtml = userData.role === 'admin' 
                ? `<a href="admin.html" class="admin-link ${isAdminPage ? 'active' : ''}">
                    <i class="fas fa-shield-alt"></i> Admin Dashboard
                   </a>`
                : '';

            loggedInContent.innerHTML = `
                ${adminLinkHtml}
                <a href="account-settings.html"><i class="fas fa-cog"></i> Settings</a>
                <a href="orders.html"><i class="fas fa-shopping-bag"></i> Orders</a>
                <a href="#" onclick="handleLogout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
            `;

            // If not admin and on admin page, redirect to home
            if (!userData.role === 'admin' && isAdminPage) {
                window.location.href = 'index.html';
            }
        } else {
            // Reset to default state
            accountLink.innerHTML = `<i class="fas fa-user"></i> Account`;
            accountLink.href = 'account.html';
            userName.textContent = 'Not logged in';
            loggedOutContent.style.display = 'block';
            loggedInContent.style.display = 'none';

            // If on admin page, redirect to login
            if (window.location.pathname.endsWith('admin.html')) {
                window.location.href = 'account.html';
            }
        }
    } catch (error) {
        console.error('Error updating account display:', error);
    }
}

// Form toggle functionality
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const ring = document.querySelector('.ring');
    
    if (!loginForm || !signupForm || !ring) return;
    
    clearFieldErrors(); // Clear any existing errors when switching forms
    
    if (formType === 'signup') {
        loginForm.classList.add('hide');
        ring.classList.add('expand');
        setTimeout(() => {
            signupForm.style.display = 'block';
            setTimeout(() => {
                signupForm.classList.add('show');
            }, 50);
        }, 300);
    } else {
        signupForm.classList.remove('show');
        ring.classList.remove('expand');
        setTimeout(() => {
            signupForm.style.display = 'none';
            loginForm.classList.remove('hide');
        }, 300);
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear any existing errors
    clearFieldErrors();
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        // Store user data in localStorage
        const userData = {
            isLoggedIn: true,
            token: data.token,
            id: data.user.id,
            name: data.user.username,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI
        updateAccountDisplay();
        
        // Show success message
        showNotification('Login successful!', 'success');
        
        // Redirect based on role
        setTimeout(() => {
            window.location.href = userData.role === 'admin' ? 'admin.html' : 'index.html';
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    
    // Get the form and submit button
    const form = document.getElementById('signupFormElement');
    const submitBtn = form.querySelector('input[type="submit"]');
    
    // Prevent double submission
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;

    try {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        
        // Clear any existing errors
        clearFieldErrors();
        
        // Validate all fields
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        // Check for validation errors and show them under the fields
        let hasError = false;
        if (nameError) {
            showFieldError('name', nameError);
            hasError = true;
        }
        if (emailError) {
            showFieldError('signupEmail', emailError);
            hasError = true;
        }
        if (passwordError) {
            showFieldError('signupPassword', passwordError);
            hasError = true;
        }

        if (hasError) {
            submitBtn.disabled = false;
            return;
        }

        console.log('Sending registration request...', { name, email });

        // Send registration request to backend
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        console.log('Registration successful:', data);

        // Store user data and token in localStorage
        const userData = {
            isLoggedIn: true,
            token: data.token,
            id: data.user.id,
            name: data.user.username,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI
        updateAccountDisplay();
        
        // Show success message
        showNotification('Account created successfully!', 'success');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Registration error:', error);
        showNotification(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('userData');
    updateAccountDisplay();
    
    // Show success message if function exists
    if (typeof showNotification === 'function') {
        showNotification('Logged out successfully!', 'success');
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Function to toggle password visibility
function togglePasswordVisibility(eyeIcon) {
    const passwordInput = eyeIcon.previousElementSibling.previousElementSibling; // Get the password input
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// Initialize forms and check login status
document.addEventListener('DOMContentLoaded', function() {
    // Always check and update login status
    updateAccountDisplay();
    
    // Only setup forms if we're on the account page
    const signupFormElement = document.getElementById('signupFormElement');
    const loginFormElement = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupForm');
    
    if (signupFormElement) {
        signupForm.classList.add('hide');
        signupFormElement.addEventListener('submit', handleSignup);
        console.log('Signup form initialized');
    }
    
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
        console.log('Login form initialized');
    }
    
    // Handle logout button if present
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Set up real-time validation for login form
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    if (loginEmail) {
        loginEmail.addEventListener('input', function() {
            const error = validateEmail(this.value.trim());
            showFieldError('email', error);
        });
    }

    if (loginPassword) {
        loginPassword.addEventListener('input', function() {
            const error = validatePassword(this.value);
            showFieldError('password', error);
        });
    }

    // Set up real-time validation for signup form
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');

    if (signupName) {
        signupName.addEventListener('input', function() {
            const error = validateName(this.value.trim());
            showFieldError('name', error);
        });
    }

    if (signupEmail) {
        signupEmail.addEventListener('input', function() {
            const error = validateEmail(this.value.trim());
            showFieldError('signupEmail', error);
        });
    }

    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            const error = validatePassword(this.value);
            showFieldError('signupPassword', error);
        });
    }

    // Set up password visibility toggles
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            togglePasswordVisibility(this);
        });
    });
});