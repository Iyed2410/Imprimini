// Check login status and update UI
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    const accountLink = document.querySelector('a[href="./account.html"]');
    
    if (isLoggedIn && accountLink) {
        accountLink.textContent = username;
    }
});
