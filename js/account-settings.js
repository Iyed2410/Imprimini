document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in and update username
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && userData.isLoggedIn) {
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = userData.name;
            });
        } else {
            window.location.href = 'account.html'; // Redirect to login if not logged in
        }
    } catch (error) {
        window.location.href = 'account.html'; // Redirect to login if there's an error
    }

    // Tab switching functionality
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.settings-section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');
        });
    });

    // Form submission handlers
    const forms = document.querySelectorAll('.settings-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showNotification('Changes saved successfully!', 'success');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    });

    // Avatar change functionality
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const avatarImg = document.getElementById('user-avatar');
    
    changeAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarImg.src = e.target.result;
                showNotification('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Password validation
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;

            if (newPass !== confirmPass) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            // Simulate password update
            showNotification('Password updated successfully!', 'success');
            securityForm.reset();
        });
    }

    // Dark mode toggle sync
    const darkModeToggle = document.getElementById('dark-mode');
    if (darkModeToggle) {
        // Set initial state
        darkModeToggle.checked = document.body.classList.contains('dark-mode');
        
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', darkModeToggle.checked);
        });
    }

    // Notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);

        // Animate notification
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});
