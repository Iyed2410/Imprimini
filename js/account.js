// Form toggle functionality
function toggleForm(formType) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const ring = document.querySelector('.ring');
  
  if (formType === 'signup') {
    loginForm.classList.add('hide');
    ring.classList.add('expand');
    signupForm.style.display = 'flex';
    setTimeout(() => {
      signupForm.classList.remove('hide');
    }, 10);
  } else {
    signupForm.classList.add('hide');
    ring.classList.remove('expand');
    setTimeout(() => {
      signupForm.style.display = 'none';
      loginForm.style.display = 'flex';
      setTimeout(() => {
        loginForm.classList.remove('hide');
      }, 10);
    }, 300);
  }
}

// Initialize forms
document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  signupForm.classList.add('hide');
});