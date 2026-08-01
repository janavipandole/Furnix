const products = [
    { id: "modern-chair", name: "Modern Chair", category: "Seating", price: 100, image: "images/modern chair.webp" },
    { id: "embrace-lounge-chair", name: "Embrace Lounge Chair", category: "Seating", price: 200, image: "images/lounge chair.webp" },
    { id: "side-table", name: "Side Table", category: "Tables", price: 150, image: "images/side table.webp" },
    { id: "aura-pendant-lamp", name: "Aura Pendant Lamp", category: "Lighting", price: 30, image: "images/hanging lamp.webp" },
    { id: "flower-vase", name: "Flower Vase Decor", category: "Accessories", price: 20, image: "images/flower-vase.webp" },
    { id: "modern-bed", name: "Modern Scandinavian Bed", category: "Bedroom", price: 1500, image: "images/bed.webp" },
    { id: "luxury-sofa", name: "Luxury Sectional Sofa", category: "Seating", price: 1200, image: "images/sofa.webp" }
];

function getWishlist() {
    try {
        const data = localStorage.getItem('furnix_wishlist');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.warn('LocalStorage blocked:', e);
        return [];
    }
}

function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === productId);
}

function attachProductEvents(card, product) {
    const cartBtn = card.querySelector('.btn.brown-bg');
    const favBtn = card.querySelector('.favorite-icon');

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof addToCart === 'function') {
                addToCart({ ...product });
                if (typeof showToast === 'function') showToast(product.name + ' added to cart!', 'success');
            } else {
                console.error('addToCart not defined');
            }
        });
    }

    if (favBtn) {
        favBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof toggleWishlist === 'function') {
                toggleWishlist({ ...product });
                const icon = favBtn.querySelector('i');
                if (isInWishlist(product.id)) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                    icon.style.color = '#ff0055';
                    if (typeof showToast === 'function') showToast(product.name + ' added to wishlist!', 'success');
                } else {
                    icon.classList.remove('fa-solid');
                    icon.classList.add('fa-regular');
                    icon.style.color = '';
                    if (typeof showToast === 'function') showToast(product.name + ' removed from wishlist.', 'info');
                }
                if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
            } else {
                console.error('toggleWishlist not defined');
            }
        });
    }
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();

    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchStats = document.getElementById('searchStats');
    const searchLoading = document.getElementById('searchLoading');
    const clearBtn = document.getElementById('clearSearchBtn');
    const resultsDiv = document.getElementById('searchResults');

    const category = categoryFilter ? categoryFilter.value : 'all';
    const price = priceFilter ? priceFilter.value : 'all';

    if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
    }

    if (searchLoading) searchLoading.style.display = 'block';
    resultsDiv.innerHTML = '';
    if (searchStats) searchStats.textContent = '';
    if (clearBtn) clearBtn.style.display = 'none';

    setTimeout(function () {
        let matched = products;
        if (query) {
            matched = matched.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }

        if (category !== 'all') {
            matched = matched.filter(p => p.category === category);
        }

        if (price !== 'all') {
            const [min, max] = price.split('-').map(Number);
            matched = matched.filter(p => p.price >= min && p.price <= max);
        }

        if (searchLoading) searchLoading.style.display = 'none';

        if (!query && category === 'all' && price === 'all') {
            resultsDiv.innerHTML = '<p class="detail-info-platform" style="text-align:center;"> Type a keyword or use the filters to find products.</p>';
            if (searchStats) searchStats.textContent = '';
            if (clearBtn) clearBtn.style.display = 'none';
            return;
        }

        if (query || category !== 'all' || price !== 'all') {
            if (clearBtn) clearBtn.style.display = 'inline-block';
        }

        if (matched.length === 0) {
            resultsDiv.innerHTML = '<p class="detail-info-platform" style="text-align:center;"> No products found. Try adjusting your search or filters.</p>';
            if (searchStats) searchStats.textContent = '0 results';
            return;
        }

        if (searchStats) searchStats.textContent = matched.length + ' result' + (matched.length !== 1 ? 's' : '');

        resultsDiv.innerHTML = matched.map(p => {
            const inWish = isInWishlist(p.id);
            const heartClass = inWish ? 'fa-solid' : 'fa-regular';
            const heartColor = inWish ? 'style="color:#ff0055;"' : '';
            return `
                <div class="product-card" data-product-id="${p.id}">
                    <div class="product-image">
                        <img src="${p.image}" alt="${p.name}" width="300" height="300" loading="lazy">
                        <a href="#" class="favorite-icon" aria-label="Add to wishlist">
                            <i class="${heartClass} fa-heart" ${heartColor}></i>
                        </a>
                        <a href="#" class="btn brown-bg">Add to cart</a>
                    </div>
                    <div>
                        <small>${p.category}</small>
                        <h6>${p.name}</h6>
                        <p class="price">$${p.price}.00</p>
                    </div>
                </div>
            `;
        }).join('');

        matched.forEach(p => {
            const card = resultsDiv.querySelector(`.product-card[data-product-id="${p.id}"]`);
            if (card) attachProductEvents(card, p);
        });
    }, 300);
}

let debounceTimer = null;

function debouncedSearch() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchProducts, 300);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('clearSearchBtn').style.display = 'none';
    document.getElementById('searchStats').textContent = '';
    document.getElementById('searchResults').innerHTML = '<p class="detail-info-platform" style="text-align:center;"> Type a keyword to search products.</p>';
    document.getElementById('searchLoading').style.display = 'none';
    document.getElementById('searchInput').focus();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchButton').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('input', debouncedSearch);
    document.getElementById('searchInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (debounceTimer) clearTimeout(debounceTimer);
            searchProducts();
        }
    });
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    if (categoryFilter)
        categoryFilter.addEventListener('change', debouncedSearch);

    if (priceFilter)
        priceFilter.addEventListener('change', debouncedSearch);

    if (clearSearchBtn)
        clearSearchBtn.addEventListener('click', clearSearch);

    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        if (!e.ctrlKey && !e.metaKey && e.key === '/' && document.activeElement !== document.getElementById('searchInput') && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
});
