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

