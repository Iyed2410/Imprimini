document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in and update username
    let userData;
    try {
        userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && userData.isLoggedIn) {
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = userData.name;
            });

            // Load user settings from the database
            const response = await fetch(`http://localhost:3000/api/users/${userData.id}/settings`, {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load user settings');
            }

            const settings = await response.json();
            
            // Populate form fields with settings
            document.getElementById('full-name').value = settings.full_name || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('phone').value = settings.phone || '';
            document.getElementById('bio').value = settings.bio || '';
            document.querySelector('.user-name').textContent = settings.full_name || userData.name;
            document.querySelector('.user-email').textContent = userData.email;
            
            // Set avatar if exists
            if (settings.avatar_url) {
                document.getElementById('user-avatar').src = settings.avatar_url;
            }

            // Set preferences
            document.getElementById('dark-mode').checked = settings.dark_mode === 1;
            document.getElementById('language').value = settings.language || 'en';
            document.getElementById('timezone').value = settings.timezone || 'GMT+1';
            
            // Set notification preferences
            document.getElementById('email-notifications').checked = settings.email_notifications === 1;
            document.getElementById('order-updates').checked = settings.order_updates === 1;
            document.getElementById('promotional-emails').checked = settings.promotional_emails === 1;
            document.getElementById('newsletter').checked = settings.newsletter === 1;

        } else {
            window.location.href = 'account.html'; // Redirect to login if not logged in
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showNotification('Error loading settings', 'error');
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
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            try {
                // Collect all form data
                const formData = {
                    full_name: document.getElementById('full-name').value,
                    phone: document.getElementById('phone').value,
                    bio: document.getElementById('bio').value,
                    dark_mode: document.getElementById('dark-mode').checked ? 1 : 0,
                    language: document.getElementById('language').value,
                    timezone: document.getElementById('timezone').value,
                    email_notifications: document.getElementById('email-notifications').checked ? 1 : 0,
                    order_updates: document.getElementById('order-updates').checked ? 1 : 0,
                    promotional_emails: document.getElementById('promotional-emails').checked ? 1 : 0,
                    newsletter: document.getElementById('newsletter').checked ? 1 : 0
                };

                // Save settings to database
                const response = await fetch(`http://localhost:3000/api/users/${userData.id}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Failed to save settings');
                }

                // Update UI
                const settings = await response.json();
                document.querySelector('.user-name').textContent = settings.full_name || userData.name;
                
                // Update dark mode
                if (settings.dark_mode === 1) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }

                showNotification('Settings saved successfully!', 'success');
            } catch (error) {
                console.error('Error saving settings:', error);
                showNotification('Error saving settings', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
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

    // Function to compress image
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions (max 800px width/height)
                    const MAX_SIZE = 800;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG
                    
                    resolve(compressedDataUrl);
                };
                
                img.onerror = (error) => {
                    reject(error);
                };
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                showNotification('Please select a valid image file (JPEG, PNG, or GIF)', 'error');
                return;
            }

            // Validate file size (max 2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB in bytes
            if (file.size > maxSize) {
                showNotification('Image size should be less than 2MB', 'error');
                return;
            }

            try {
                // Show loading state
                changeAvatarBtn.disabled = true;
                const originalIcon = changeAvatarBtn.innerHTML;
                changeAvatarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                // Compress image
                const compressedDataUrl = await compressImage(file);
                
                try {
                    // Save avatar URL to database
                    const response = await fetch(`http://localhost:3000/api/users/${userData.id}/settings`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userData.token}`
                        },
                        body: JSON.stringify({ avatar_url: compressedDataUrl })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to save avatar');
                    }

                    const result = await response.json();
                    
                    // Update avatar image with the processed URL from server
                    avatarImg.src = result.avatar_url;
                    showNotification('Profile picture updated!', 'success');
                } catch (error) {
                    console.error('Error updating avatar:', error);
                    showNotification('Error updating profile picture', 'error');
                } finally {
                    // Restore button state
                    changeAvatarBtn.disabled = false;
                    changeAvatarBtn.innerHTML = originalIcon;
                }
            } catch (error) {
                console.error('Error handling avatar upload:', error);
                showNotification('Error processing image', 'error');
                changeAvatarBtn.disabled = false;
                changeAvatarBtn.innerHTML = originalIcon;
            }
        }
    });

    // Password validation and update
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-password').value;

            if (newPass !== confirmPass) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    },
                    body: JSON.stringify({
                        currentPassword: currentPass,
                        newPassword: newPass
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to update password');
                }

                showNotification('Password updated successfully!', 'success');
                securityForm.reset();
            } catch (error) {
                showNotification(error.message, 'error');
            }
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

    // Add delete account functionality
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
            
            if (confirmed) {
                try {
                    const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${userData.token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to delete account');
                    }

                    // Clear all user data from localStorage
                    localStorage.clear();
                    
                    // Show success message
                    showNotification('Account deleted successfully', 'success');
                    
                    // Redirect to home page after a short delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } catch (error) {
                    showNotification(error.message, 'error');
                }
            }
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
