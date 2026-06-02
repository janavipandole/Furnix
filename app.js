const menuBtn = document.getElementById('menu');
const navList = document.getElementById('list');
const navClose = document.getElementById('navClose');

if (menuBtn && navList) {
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        navList.classList.add('navList-active');
    });
}

if (navClose && navList) {
    navClose.addEventListener('click', () => {
        navList.classList.remove('navList-active');
    });
}

const CART_KEY = 'furnix_shopping_cart';
const WISHLIST_KEY = 'furnix_wishlist';

function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function setStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getCart() {
    return getStorageData(CART_KEY);
}

function saveCart(cart) {
    setStorageData(CART_KEY, cart);
}

function getWishlist() {
    return getStorageData(WISHLIST_KEY);
}

function saveWishlist(wishlist) {
    setStorageData(WISHLIST_KEY, wishlist);
}

function addToCart(product) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === product.id);
    if (index !== -1) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    saveCart(cart);
    updateCartBadge();
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
}

function toggleWishlist(product) {
    let wishlist = getWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index !== -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(product);
    }
    saveWishlist(wishlist);
    updateWishlistBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = total;
}

function updateWishlistBadge() {
    const wishlist = getWishlist();
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.innerText = wishlist.length;
}

/* ---- COMBINED CART & CHECKOUT PAGE ---- */

function goToStep(step) {
    const cartStep = document.getElementById('cartStep');
    const checkoutStep = document.getElementById('checkoutStep');
    const step1 = document.getElementById('step1Indicator');
    const step2 = document.getElementById('step2Indicator');
    const stepLine = document.querySelector('.step-line');

    if (!cartStep || !checkoutStep) return;

    if (step === 1) {
        cartStep.classList.remove('step-hidden');
        checkoutStep.classList.add('step-hidden');
        step1.classList.add('active');
        step2.classList.remove('active');
        if (stepLine) stepLine.classList.remove('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        cartStep.classList.add('step-hidden');
        checkoutStep.classList.remove('step-hidden');
        step1.classList.remove('active');
        step2.classList.add('active');
        if (stepLine) stepLine.classList.add('active');
        renderCheckoutSummary();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function renderCartPage() {
    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    const cart = getCart();
    const emptyState = document.getElementById('cartEmptyState');
    const cartLayout = document.getElementById('cartLayout');

    if (cart.length === 0) {
        emptyState.style.display = 'block';
        cartLayout.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    cartLayout.style.display = 'flex';
    listEl.innerHTML = '';

    cart.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('cart-item-card');
        card.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <p class="cart-item-category">${item.category || 'Furniture'}</p>
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                <div class="cart-quantity-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="qty-value">${item.quantity || 1}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
            </div>
            <button class="cart-remove-btn" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        listEl.appendChild(card);
    });

    listEl.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const action = btn.dataset.action;
            let cart = getCart();
            const index = cart.findIndex(i => i.id === id);
            if (index === -1) return;
            if (action === 'increase') {
                cart[index].quantity = (cart[index].quantity || 1) + 1;
            } else {
                cart[index].quantity = (cart[index].quantity || 1) - 1;
                if (cart[index].quantity <= 0) cart.splice(index, 1);
            }
            saveCart(cart);
            renderCartPage();
            updateCartBadge();
        });
    });

    listEl.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let cart = getCart().filter(i => i.id !== btn.dataset.id);
            saveCart(cart);
            renderCartPage();
            updateCartBadge();
        });
    });

    updateCartSummary();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal >= 150 ? 0 : 15;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const s = document.getElementById('summarySubtotal');
    const sh = document.getElementById('summaryShipping');
    const t = document.getElementById('summaryTax');
    const tot = document.getElementById('summaryTotal');

    if (s) s.innerText = '$' + subtotal.toFixed(2);
    if (sh) sh.innerText = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    if (t) t.innerText = '$' + tax.toFixed(2);
    if (tot) tot.innerText = '$' + total.toFixed(2);
}

function renderCheckoutSummary() {
    const cart = getCart();
    const listEl = document.getElementById('checkoutItemsList');
    if (!listEl) return;

    listEl.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div');
        row.classList.add('checkout-order-item');
        row.innerHTML = `
            <div class="checkout-order-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <span class="checkout-order-item-name">${item.name} x${item.quantity || 1}</span>
            <span class="checkout-order-item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        `;
        listEl.appendChild(row);
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal >= 150 ? 0 : 15;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    const s = document.getElementById('coSubtotal');
    const sh = document.getElementById('coShipping');
    const t = document.getElementById('coTax');
    const tot = document.getElementById('coTotal');

    if (s) s.innerText = '$' + subtotal.toFixed(2);
    if (sh) sh.innerText = shipping === 0 ? 'Free' : '$' + shipping.toFixed(2);
    if (t) t.innerText = '$' + tax.toFixed(2);
    if (tot) tot.innerText = '$' + total.toFixed(2);
}

const proceedBtn = document.getElementById('proceedToCheckoutBtn');
if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
        if (getCart().length === 0) {
            alert('Your cart is empty!');
            return;
        }
        goToStep(2);
    });
}

const backToCartBtn = document.getElementById('backToCartBtn');
if (backToCartBtn) {
    backToCartBtn.addEventListener('click', () => {
        goToStep(1);
    });
}

document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const cardFields = document.getElementById('cardFields');
        const upiFields = document.getElementById('upiFields');
        if (cardFields) cardFields.classList.remove('visible');
        if (upiFields) upiFields.classList.remove('visible');
        if (radio.value === 'card' && cardFields) cardFields.classList.add('visible');
        if (radio.value === 'upi' && upiFields) upiFields.classList.add('visible');
    });
});

const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
}

const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1 / $2');
    });
}

const placeOrderBtn = document.getElementById('placeOrderBtn');
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        const firstName = document.getElementById('firstName').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const address = document.getElementById('address').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked').value;

        if (!firstName || !email || !address) {
            alert('Please fill in all required shipping details.');
            return;
        }
        if (payment === 'card') {
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const expiry = document.getElementById('cardExpiry').value.trim();
            const cvv = document.getElementById('cardCvv').value.trim();
            if (!cardNumber || !expiry || !cvv) {
                alert('Please fill in your card details.');
                return;
            }
        }
        if (payment === 'upi') {
            const upiId = document.getElementById('upiId').value.trim();
            if (!upiId || !upiId.includes('@')) {
                alert('Please enter a valid UPI ID.');
                return;
            }
        }

        localStorage.removeItem(CART_KEY);
        updateCartBadge();

        const overlay = document.getElementById('successOverlay');
        if (overlay) overlay.classList.add('visible');
    });
}

/* ---- WISHLIST PAGE ---- */
function renderWishlistPage() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) return;

    const wishlist = getWishlist();
    const emptyState = document.getElementById('wishlistEmptyState');

    grid.innerHTML = '';
    grid.appendChild(emptyState);

    if (wishlist.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    wishlist.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div>
                <small>${item.category || 'Furniture'}</small>
                <h6>${item.name}</h6>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button class="wishlist-add-cart-btn btn brown-bg" data-id="${item.id}">Move to Cart</button>
                <button class="wishlist-remove-btn" data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    grid.querySelectorAll('.wishlist-add-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = getWishlist().find(i => i.id === btn.dataset.id);
            if (!item) return;
            addToCart({...item});
            alert(`${item.name} moved to cart!`);
            updateCartBadge();
        });
    });

    grid.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            let wishlist = getWishlist().filter(i => i.id !== btn.dataset.id);
            saveWishlist(wishlist);
            renderWishlistPage();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateWishlistBadge();
    setupProductCards();
    renderCartPage();
    renderWishlistPage();
});

function setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        const titleElement = card.querySelector('h6');
        const priceElement = card.querySelector('.price');
        const imgElement = card.querySelector('img');
        const categoryElement = card.querySelector('small');
        const cartBtn = card.querySelector('.btn');
        const favBtn = card.querySelector('.favorite-icon');

        if (!titleElement || !priceElement) return;

        const product = {
            id: 'prod_' + titleElement.innerText.replace(/\s+/g, '-').toLowerCase(),
            name: titleElement.innerText,
            price: parseFloat(priceElement.innerText.replace(/[^0-9.]/g, '')),
            image: imgElement ? imgElement.src : '',
            category: categoryElement ? categoryElement.innerText : ''
        };

        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addToCart(product);
                alert(`${product.name} added to cart!`);
            });
        }

        if (favBtn) {
            favBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWishlist(product);
                const icon = favBtn.querySelector('i');
                if (icon) {
                    if (icon.classList.contains('fa-regular')) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                        icon.style.color = '#ff0055';
                        alert(`${product.name} added to wishlist!`);
                    } else {
                        icon.classList.remove('fa-solid');
                        icon.classList.add('fa-regular');
                        icon.style.color = '';
                        alert(`${product.name} removed from wishlist!`);
                    }
                }
            });

            const isInWishlist = getWishlist().some(item => item.id === product.id);
            if (isInWishlist) {
                const icon = favBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-regular');
                    icon.classList.add('fa-solid');
                    icon.style.color = '#ff0055';
                }
            }
        }
    });
}

const PROFILE_KEY = 'furnix_user_profile';

function getUserProfile() {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : {
        firstName: 'user',
        lastName: 'name',
        email: 'user@example.com',
        phone: '+91 98765XXXXX',
        address: '123 Main delhi',
        city: 'New Delhi',
        pincode: '10001'
    };
}

function saveUserProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function renderProfilePage() {
    const viewName = document.getElementById('viewName');
    if (!viewName) return; 

    const profile = getUserProfile();

    document.getElementById('viewName').innerText = profile.firstName + ' ' + profile.lastName;
    document.getElementById('viewEmail').innerText = profile.email;
    document.getElementById('viewPhone').innerText = profile.phone;
    document.getElementById('viewAddress').innerText = profile.address;
    document.getElementById('viewCity').innerText = profile.city;
    document.getElementById('viewPincode').innerText = profile.pincode;

    document.getElementById('editFirstName').value = profile.firstName;
    document.getElementById('editLastName').value = profile.lastName;
    document.getElementById('editEmail').value = profile.email;
    document.getElementById('editPhone').value = profile.phone;
    document.getElementById('editAddress').value = profile.address;
    document.getElementById('editCity').value = profile.city;
    document.getElementById('editPincode').value = profile.pincode;
}

function autoFillCheckout() {
    const checkoutFirstName = document.getElementById('firstName');
    if (!checkoutFirstName) return;

    const profile = getUserProfile();
    if(profile) {
        if(document.getElementById('firstName')) document.getElementById('firstName').value = profile.firstName || '';
        if(document.getElementById('lastName')) document.getElementById('lastName').value = profile.lastName || '';
        if(document.getElementById('checkoutEmail')) document.getElementById('checkoutEmail').value = profile.email || '';
        if(document.getElementById('phone')) document.getElementById('phone').value = profile.phone || '';
        if(document.getElementById('address')) document.getElementById('address').value = profile.address || '';
        if(document.getElementById('city')) document.getElementById('city').value = profile.city || '';
        if(document.getElementById('pincode')) document.getElementById('pincode').value = profile.pincode || '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProfilePage();
    autoFillCheckout();

    const editBtn = document.getElementById('editProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const editForm = document.getElementById('profileEditMode');
    const viewMode = document.getElementById('profileViewMode');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            viewMode.style.display = 'none';
            editForm.style.display = 'block';
            editBtn.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            viewMode.style.display = 'block';
            editForm.style.display = 'none';
            editBtn.style.display = 'inline-block';
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedProfile = {
                firstName: document.getElementById('editFirstName').value,
                lastName: document.getElementById('editLastName').value,
                email: document.getElementById('editEmail').value,
                phone: document.getElementById('editPhone').value,
                address: document.getElementById('editAddress').value,
                city: document.getElementById('editCity').value,
                pincode: document.getElementById('editPincode').value,
            };
            
            saveUserProfile(updatedProfile); 
            renderProfilePage();

            viewMode.style.display = 'block';
            editForm.style.display = 'none';
            editBtn.style.display = 'inline-block';
            
            alert('Profile details updated successfully!');
        });
    }
});

const searchIconLinks = document.querySelectorAll('a i.fa-magnifying-glass');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const executeSearch = document.getElementById('executeSearch');

searchIconLinks.forEach(icon => {
    icon.parentElement.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            searchInput.focus();
        }
    });
});

if (closeSearch && searchOverlay) {
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });
}

if (executeSearch && searchInput) {
    executeSearch.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (query) {
            window.location.href = `furniture.html?search=${encodeURIComponent(query)}`;
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeSearch.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const products = document.querySelectorAll('.product-card');
        let found = false;
        
        products.forEach(product => {
            const productText = product.innerText.toLowerCase();
            
            if (productText.includes(searchQuery.toLowerCase())) {
                product.style.display = 'block';
                found = true;
            } else {
                product.style.display = 'none';
            }
        });

        const heading = document.querySelector('main .h2-heading, main .page-header-container h2');
        if (heading) {
            heading.innerHTML = `Search Results for: <span>"${searchQuery}"</span>`;
        }
        
        if (!found && heading) {
            heading.insertAdjacentHTML('afterend', '<p class="detail-info-platform center mt-3" style="font-size:1.2rem;">Oops! No products found matching that search.</p>');
        }
    }
});