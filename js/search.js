let searchTimeout;
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

async function handleSearch(event) {
    event.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) {
        hideSearchResults();
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/products/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const products = await response.json();
        displaySearchResults(products);
    } catch (error) {
        console.error('Search error:', error);
        displaySearchResults([]); // Show empty results on error
    }
}

function displaySearchResults(products) {
    searchResults.innerHTML = '';
    
    if (products.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <p>No products found</p>
            </div>
        `;
    } else {
        products.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.onclick = () => window.location.href = `product-details.html?id=${product.id}`;
            
            resultItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="search-result-info">
                    <h4>${product.name}</h4>
                    <p>${product.description || ''}</p>
                </div>
                <div class="search-result-price">${product.price} DT</div>
            `;
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.classList.add('active');
}

function hideSearchResults() {
    searchResults.classList.remove('active');
}

// Add input event listener with debouncing
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const form = document.querySelector('.search-form');
        form.dispatchEvent(new Event('submit'));
    }, 300);
});

// Hide search results when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
        hideSearchResults();
    }
});

// Clear search results when pressing Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        hideSearchResults();
        searchInput.blur();
    }
});
