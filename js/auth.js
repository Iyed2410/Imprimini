// Function to handle form toggle between login and signup
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (formType === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    
    const loginForm = document.getElementById('loginForm');
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    // Here you would typically validate against a backend
    // For demo purposes, we'll just check if fields are not empty
    if (username && password) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Redirect to index page
        window.location.href = './index.html';
    } else {
        alert('Please fill in all fields');
    }
}

// Function to handle signup
function handleSignup(event) {
    event.preventDefault();
    
    const signupForm = document.getElementById('signupForm');
    const username = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = signupForm.querySelectorAll('input[type="password"]')[1].value;

    // Basic validation
    if (username && email && password && confirmPassword) {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Store user data (in real app, this would be sent to a backend)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);

        // Redirect to index page
        window.location.href = './index.html';
    } else {
        alert('Please fill in all fields');
    }
}

// Function to handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = './index.html';
}

// Function to check login status and update UI
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true' && window.location.pathname.includes('account.html')) {
        // If user is already logged in and tries to access account page, redirect to index
        window.location.href = './index.html';
    }

    // Update account link with username if logged in
    const username = localStorage.getItem('username');
    const accountListItem = document.querySelector('.navbar ul li:last-child');
    
    if (isLoggedIn === 'true' && accountListItem) {
        accountListItem.innerHTML = `
            <div class="user-dropdown">
                <div class="user-info">
                    <i class="fas fa-user"></i>
                    <span>${username}</span>
                </div>
                <div class="dropdown-content">
                    <a href="./orders.html"><i class="fas fa-box"></i> My Orders</a>
                    <div class="divider"></div>
                    <a href="#" onclick="handleLogout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>`;
    } else if (accountListItem) {
        accountListItem.innerHTML = `<a href="./account.html"><i class="fas fa-user"></i> Account</a>`;
    }
}

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.querySelector('input[type="submit"]').addEventListener('click', handleLogin);
    }
    if (signupForm) {
        signupForm.querySelector('input[type="submit"]').addEventListener('click', handleSignup);
    }
});
