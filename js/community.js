// Handle Upload Modal
const uploadBtn = document.querySelector('.upload-project-btn');
const uploadModal = document.getElementById('uploadModal');
const cancelBtn = document.querySelector('.cancel-btn');
const uploadForm = document.getElementById('uploadForm');

uploadBtn.addEventListener('click', () => {
    uploadModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

cancelBtn.addEventListener('click', () => {
    uploadModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
uploadModal.addEventListener('click', (e) => {
    if (e.target === uploadModal) {
        uploadModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle file upload area
const uploadArea = document.querySelector('.upload-area');
const fileInput = uploadArea.querySelector('input[type="file"]');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border-color)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-color)';
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

function handleFiles(files) {
    // Preview logic would go here
    console.log('Files selected:', files);
}

// Handle feed filters
const filterButtons = document.querySelectorAll('.feed-filters button');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterFeed(button.textContent.toLowerCase());
    });
});

function filterFeed(filter) {
    // Filter logic would go here
    console.log('Filtering by:', filter);
}

// Handle likes
const likeButtons = document.querySelectorAll('.feed-actions button:first-child');

likeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const icon = button.querySelector('i');
        const count = button.textContent.trim().split(' ')[1];
        const newCount = parseInt(count) + (icon.classList.contains('liked') ? -1 : 1);
        
        icon.classList.toggle('liked');
        button.innerHTML = `<i class="fas fa-heart${icon.classList.contains('liked') ? ' liked' : ''}"></i> ${newCount}`;
    });
});

// Update challenge timer
function updateTimer() {
    const timerElement = document.querySelector('.challenge-timer');
    if (!timerElement) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 days from now

    setInterval(() => {
        const now = new Date();
        const distance = endDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        timerElement.textContent = `${days}d ${hours}h left`;
    }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTimer();

    // Add smooth scrolling for feed
    const feedGrid = document.querySelector('.feed-grid');
    let isLoading = false;

    window.addEventListener('scroll', () => {
        if (isLoading) return;

        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMorePosts();
        }
    });

    function loadMorePosts() {
        isLoading = true;
        // Simulate loading more posts
        setTimeout(() => {
            // Add more posts logic would go here
            isLoading = false;
        }, 1000);
    }
});
