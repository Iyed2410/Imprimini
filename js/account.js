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
            accountLink.innerHTML = `<i class="fas fa-user"></i> ${userData.name}`;
            accountLink.href = '#';
            userName.textContent = userData.name;
            loggedOutContent.style.display = 'none';
            loggedInContent.style.display = 'block';
        } else {
            accountLink.innerHTML = `<i class="fas fa-user"></i> Account`;
            accountLink.href = 'account.html';
            userName.textContent = 'Not logged in';
            loggedOutContent.style.display = 'block';
            loggedInContent.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating account display:', error);
        accountLink.innerHTML = `<i class="fas fa-user"></i> Account`;
        accountLink.href = 'account.html';
        userName.textContent = 'Not logged in';
        loggedOutContent.style.display = 'block';
        loggedInContent.style.display = 'none';
    }
}

// Form toggle functionality
function toggleForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const ring = document.querySelector('.ring');
    
    if (!loginForm || !signupForm || !ring) return;
    
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
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get name from email (everything before @)
    const name = email.split('@')[0];
    const work = "Developer"; // Replace with actual user data from backend

    // Store user data in localStorage
    const userData = {
        email,
        name,
        work,
        isLoggedIn: true
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update UI
    updateAccountDisplay();
    
    // Show success message if function exists
    if (typeof showNotification === 'function') {
        showNotification('Login successful!', 'success');
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;
    const work = document.getElementById('signupWork').value;

    // Store user data in localStorage
    const userData = {
        email,
        name,
        work,
        isLoggedIn: true
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update UI
    updateAccountDisplay();
    
    // Show success message if function exists
    if (typeof showNotification === 'function') {
        showNotification('Account created successfully!', 'success');
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
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

// Initialize forms and check login status
document.addEventListener('DOMContentLoaded', function() {
    // Always check and update login status
    updateAccountDisplay();
    
    // Only setup forms if we're on the account page
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        signupForm.classList.add('hide');
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle logout button if present
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});