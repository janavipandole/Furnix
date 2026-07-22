const menuBtn = document.getElementById("menu");
const navList = document.getElementById("list");
const navClose = document.getElementById("navClose");

if (menuBtn && navList) {
  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navList.classList.add("navList-active");
    navList.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
    setTimeout(() => {
      if (navClose) navClose.focus();
    }, 100);
  });
}

if (navClose && navList) {
  navClose.addEventListener("click", () => {
    navList.classList.remove("navList-active");
    navList.setAttribute("aria-hidden", "true");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (menuBtn) menuBtn.focus();
  });
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    navList &&
    navList.classList.contains("navList-active")
  ) {
    navList.classList.remove("navList-active");
    navList.setAttribute("aria-hidden", "true");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (menuBtn) menuBtn.focus();
  }
});

if (navList) {
  navList.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusableElements = navList.querySelectorAll("a, button");
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

const CART_KEY = "furnix_shopping_cart";
const WISHLIST_KEY = "furnix_wishlist";

const memoryStore = {};

function getStorageData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("LocalStorage blocked, falling back to memory store:", e);
    return memoryStore[key] || [];
  }
}

function setStorageData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("LocalStorage blocked, falling back to memory store:", e);
    memoryStore[key] = data;
  }
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
  const index = cart.findIndex((item) => item.id === product.id);
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
  let cart = getCart().filter((item) => String(item.id) !== String(productId));
  saveCart(cart);
  updateCartBadge();
}

function toggleWishlist(product) {
  let wishlist = getWishlist();
  const index = wishlist.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(product);
  }
  saveWishlist(wishlist);
  updateWishlistBadge();
}

// ✅ FIXED: badge shows/hides dynamically
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.innerText = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
  }
}

// ✅ FIXED: wishlist badge shows/hides dynamically
function updateWishlistBadge() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  const badge = document.getElementById("wishlist-badge");
  if (badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? "inline-block" : "none";
  }
}

/* ---- COMBINED CART & CHECKOUT PAGE ---- */

function goToStep(step) {
  const cartStep = document.getElementById("cartStep");
  const checkoutStep = document.getElementById("checkoutStep");
  const step1 = document.getElementById("step1Indicator");
  const step2 = document.getElementById("step2Indicator");
  const stepLine = document.querySelector(".step-line");

  if (!cartStep || !checkoutStep) return;

  if (step === 1) {
    cartStep.classList.remove("step-hidden");
    checkoutStep.classList.add("step-hidden");
    step1.classList.add("active");
    step2.classList.remove("active");
    if (stepLine) stepLine.classList.remove("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    cartStep.classList.add("step-hidden");
    checkoutStep.classList.remove("step-hidden");
    step1.classList.remove("active");
    step2.classList.add("active");
    if (stepLine) stepLine.classList.add("active");
    renderCheckoutSummary();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderCartPage() {
  const listEl = document.getElementById("cartItemsList");
  if (!listEl) return;

  const cart = getCart();
  const emptyState = document.getElementById("cartEmptyState");
  const cartLayout = document.getElementById("cartLayout");

  if (cart.length === 0) {
    emptyState.style.display = "block";
    cartLayout.style.display = "none";
    updateCartBadge(); // ✅ update badge when cart becomes empty
    return;
  }

  emptyState.style.display = "none";
  cartLayout.style.display = "flex";
  listEl.innerHTML = "";

  cart.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("cart-item-card");
    card.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" width="100" height="100" loading="lazy">
            </div>
            <div class="cart-item-details">
                <p class="cart-item-category">${item.category || "Furniture"}</p>
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                <div class="cart-quantity-controls">
                    <button class="qty-btn" data-id="${item.id}" data-action="decrease" aria-label="Decrease ${item.name} quantity">-</button>
                    <span class="qty-value">${item.quantity || 1}</span>
                    <button class="qty-btn" data-id="${item.id}" data-action="increase" aria-label="Increase ${item.name} quantity">+</button>
                </div>
            </div>
            <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
        `;
    listEl.appendChild(card);
  });

  listEl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      let cart = getCart();
      const index = cart.findIndex((i) => String(i.id) === String(id));
      if (index === -1) return;
      if (action === "increase") {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
      } else {
        cart[index].quantity = (cart[index].quantity || 1) - 1;
        if (cart[index].quantity <= 0) cart.splice(index, 1);
      }
      saveCart(cart);
      updateCartBadge(); // ✅ update badge on qty change
      renderCartPage();
    });
  });

  listEl.querySelectorAll(".cart-remove-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const removed = getCart().find((i) => String(i.id) === String(btn.dataset.id));
    let cart = getCart().filter((i) => String(i.id) !== String(btn.dataset.id));
    saveCart(cart);
    updateCartBadge(); // ✅ update badge on remove

    if (removed) showToast(`${removed.name} removed from cart`, "info");

    renderCartPage();
  });
});

  updateCartSummary();
  updateCartBadge(); // ✅ always sync badge after render
}

function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const shipping = subtotal >= 150 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const s = document.getElementById("summarySubtotal");
  const sh = document.getElementById("summaryShipping");
  const t = document.getElementById("summaryTax");
  const tot = document.getElementById("summaryTotal");

  if (s) s.innerText = "$" + subtotal.toFixed(2);
  if (sh) sh.innerText = shipping === 0 ? "Free" : "$" + shipping.toFixed(2);
  if (t) t.innerText = "$" + tax.toFixed(2);
  if (tot) tot.innerText = "$" + total.toFixed(2);
}

function renderCheckoutSummary() {
  const cart = getCart();
  const listEl = document.getElementById("checkoutItemsList");
  if (!listEl) return;

  listEl.innerHTML = "";
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("checkout-order-item");
    row.innerHTML = `
            <div class="checkout-order-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <span class="checkout-order-item-name">${item.name} x${item.quantity || 1}</span>
            <span class="checkout-order-item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        `;
    listEl.appendChild(row);
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );
  const shipping = subtotal >= 150 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const s = document.getElementById("coSubtotal");
  const sh = document.getElementById("coShipping");
  const t = document.getElementById("coTax");
  const tot = document.getElementById("coTotal");

  if (s) s.innerText = "$" + subtotal.toFixed(2);
  if (sh) sh.innerText = shipping === 0 ? "Free" : "$" + shipping.toFixed(2);
  if (t) t.innerText = "$" + tax.toFixed(2);
  if (tot) tot.innerText = "$" + total.toFixed(2);
}

const proceedBtn = document.getElementById("proceedToCheckoutBtn");
if (proceedBtn) {
  proceedBtn.addEventListener("click", () => {
    if (getCart().length === 0) {
      showToast("Your cart is empty!", "warning");
      return;
    }
    goToStep(2);
  });
}

const backToCartBtn = document.getElementById("backToCartBtn");
if (backToCartBtn) {
  backToCartBtn.addEventListener("click", () => {
    goToStep(1);
  });
}

document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const cardFields = document.getElementById("cardFields");
    const upiFields = document.getElementById("upiFields");
    if (cardFields) cardFields.classList.remove("visible");
    if (upiFields) upiFields.classList.remove("visible");
    if (radio.value === "card" && cardFields)
      cardFields.classList.add("visible");
    if (radio.value === "upi" && upiFields) upiFields.classList.add("visible");
  });
});

const cardNumberInput = document.getElementById("cardNumber");
if (cardNumberInput) {
  cardNumberInput.addEventListener("input", function (e) {
    let position = this.selectionEnd;
    let length = this.value.length;
    this.value = this.value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    let newLength = this.value.length;
    position = position + (newLength - length);
    this.setSelectionRange(position, position);
  });
}

const cardExpiryInput = document.getElementById("cardExpiry");
if (cardExpiryInput) {
  cardExpiryInput.addEventListener("input", function (e) {
    let position = this.selectionEnd;
    let length = this.value.length;
    this.value = this.value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1 / $2");
    let newLength = this.value.length;
    position = position + (newLength - length);
    this.setSelectionRange(position, position);
  });
}

function isValidLuhn(digitsOnly) {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

const placeOrderBtn = document.getElementById("placeOrderBtn");
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    const firstName = document.getElementById("firstName").value.trim();
    const email = document.getElementById("checkoutEmail").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.querySelector(
      'input[name="payment"]:checked',
    ).value;

    if (!firstName || !email || !address) {
      showToast("Please fill in all required shipping details.", "error");
      return;
    }
    if (payment === "card") {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const expiry = document.getElementById("cardExpiry").value.trim();
      const cvv = document.getElementById("cardCvv").value.trim();

      if (!cardNumber || !expiry || !cvv) {
        showToast("Please fill in your card details.", "error");
        return;
      }

      const digitsOnly = cardNumber.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(digitsOnly) || !isValidLuhn(digitsOnly)) {
        showToast("Please enter a valid card number.", "error");
        return;
      }

      const expiryMatch = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
      if (!expiryMatch) {
        showToast("Please enter a valid expiry date (MM / YY).", "error");
        return;
      }
      const expMonth = parseInt(expiryMatch[1], 10);
      const expYear = 2000 + parseInt(expiryMatch[2], 10);
      if (expMonth < 1 || expMonth > 12) {
        showToast("Please enter a valid expiry month (01-12).", "error");
        return;
      }
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      const expiryEnd = new Date(expYear, expMonth, 0, 23, 59, 59); // last day of expiry month
      if (
        expiryEnd < now ||
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        showToast("This card has expired. Please use a valid card.", "error");
        return;
      }
      // Reject unreasonably far-future dates (basic sanity check, e.g. typo like 99)
      if (expYear > currentYear + 20) {
        showToast("Please enter a valid expiry date.", "error");
        return;
      }

      if (!/^\d{3,4}$/.test(cvv)) {
        showToast("Please enter a valid CVV (3-4 digits).", "error");
        return;
      }
    }
    if (payment === "upi") {
      const upiId = document.getElementById("upiId").value.trim();
      if (!upiId || !upiId.includes("@")) {
        showToast("Please enter a valid UPI ID.", "error");
        return;
      }
    }

    const orderRef =
      "FNX-" +
      Math.floor(100000 + Math.random() * 900000) +
      "-" +
      Math.random().toString(36).substr(2, 4).toUpperCase();
    const deliveryOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const deliveryStr = deliveryDate.toLocaleDateString(
      "en-US",
      deliveryOptions,
    );

    const refEl = document.getElementById("successOrderRef");
    const delEl = document.getElementById("deliveryDate");
    if (refEl) refEl.innerText = orderRef;
    if (delEl) delEl.innerText = deliveryStr;

    localStorage.removeItem(CART_KEY);
    updateCartBadge();

    const overlay = document.getElementById("successOverlay");
    if (overlay) overlay.classList.add("visible");
  });
}

/* ---- WISHLIST PAGE ---- */
function renderWishlistPage() {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;

  const wishlist = getWishlist();
  const emptyState = document.getElementById("wishlistEmptyState");

  grid.innerHTML = "";
  grid.appendChild(emptyState);

  if (wishlist.length === 0) {
    emptyState.style.display = "block";
    updateWishlistBadge(); // ✅ update badge when wishlist becomes empty
    return;
  }

  emptyState.style.display = "none";

  wishlist.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
            <div class="product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div>
                <small>${item.category || "Furniture"}</small>
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

  grid.querySelectorAll(".wishlist-add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = getWishlist().find((i) => i.id === btn.dataset.id);
      if (!item) return;
      addToCart({ ...item });
      showToast(`${item.name} moved to cart!`, "success");
      updateCartBadge(); // ✅ update cart badge
    });
  });

  grid.querySelectorAll(".wishlist-remove-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const removed = getWishlist().find((i) => String(i.id) === String(btn.dataset.id));
    let wishlist = getWishlist().filter((i) => String(i.id) !== String(btn.dataset.id));
    saveWishlist(wishlist);
    updateWishlistBadge(); // ✅ update wishlist badge on remove

    if (removed) showToast(`${removed.name} removed from wishlist`, "info");

    renderWishlistPage();
  });
});

  updateWishlistBadge(); // ✅ always sync badge after render
}

/* ============================================
   SKELETON LOADING + CARD REVEAL
   ============================================ */

function dismissSkeletons() {
  document.querySelectorAll(".skeleton-card").forEach((el) => {
    el.classList.add("skeleton-hidden");
    el.setAttribute("aria-hidden", "true");
  });
  document.querySelectorAll(".product-card--hidden").forEach((el) => {
    el.classList.remove("product-card--hidden");
  });
  setupProductCards();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  updateWishlistBadge();

  if (!document.querySelector(".skeleton-card")) {
    setupProductCards();
  }

  renderCartPage();
  renderWishlistPage();
  initProductSortAndFilter();
});

const SKELETON_MIN_MS = 1500;
const skeletonStart = Date.now();

window.addEventListener("load", () => {
  if (!document.querySelector(".skeleton-card")) return;
  const elapsed = Date.now() - skeletonStart;
  const delay = Math.max(0, SKELETON_MIN_MS - elapsed);
  setTimeout(dismissSkeletons, delay);
});

function setupProductCards() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const titleElement = card.querySelector("h6");
    const priceElement = card.querySelector(".price");
    const imgElement = card.querySelector("img");
    const categoryElement = card.querySelector("small");
    const cartBtn =
      card.querySelector("[data-cart-btn]") || card.querySelector(".btn");
    const favBtn =
      card.querySelector("[data-wishlist-btn]") ||
      card.querySelector(".favorite-icon");

    if (!titleElement || !priceElement) return;

    const product = {
      id: "prod_" + titleElement.innerText.replace(/\s+/g, "-").toLowerCase(),
      name: titleElement.innerText,
      price: parseFloat(priceElement.innerText.replace(/[^0-9.]/g, "")),
      image: imgElement ? imgElement.src : "",
      category: categoryElement ? categoryElement.innerText : "",
    };

    if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (cartBtn.classList.contains("btn-loading")) return;
    const origText = cartBtn.innerText;
    cartBtn.classList.add("btn-loading");
    cartBtn.innerText = "Adding...";

    // grab this before addToCart runs, since addToCart mutates the stored cart
    const alreadyInCart = getCart().some((item) => item.id === product.id);

    setTimeout(() => {
      addToCart(product);
      const toastMsg = alreadyInCart
        ? `Added another ${product.name} (now in cart)`
        : `${product.name} added to cart`;
      showToast(toastMsg, "success");

      cartBtn.innerText = "✓ Added!";
      cartBtn.classList.remove("btn-loading");
      setTimeout(() => {
        cartBtn.innerText = origText;
      }, 1000);
    }, 600);
  });
}

    if (favBtn) {
  favBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (favBtn.classList.contains("fav-loading")) return;
    favBtn.classList.add("fav-loading");
    setTimeout(() => {
      favBtn.classList.remove("fav-loading");
      toggleWishlist(product);
      const icon = favBtn.querySelector("i");
      if (icon) {
        // icon still shows the pre-toggle state here, so this tells us
        // which way the wishlist just changed
        const wasAdded = icon.classList.contains("fa-regular");

        if (wasAdded) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style.color = "#ff0055";
        } else {
          icon.classList.remove("fa-solid");
          icon.classList.add("fa-regular");
          icon.style.color = "";
        }

        showToast(
          wasAdded ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`,
          wasAdded ? "success" : "info"
        );
      }
    }, 500);
  });
  

      const isInWishlist = getWishlist().some((item) => item.id === product.id);
      if (isInWishlist) {
        const icon = favBtn.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style.color = "#ff0055";
        }
      }
    }
  });
}
/* ============================================
   PRODUCT SORTING + FILTERING

function initProductSortAndFilter() {
  const grid = document.getElementById("furniture-grid");
  const sortSelect = document.getElementById("sort-products");
  const categoryFilter = document.getElementById("filter-category");
  const priceFilter = document.getElementById("filter-price");
  const availabilityFilter = document.getElementById("filter-availability");
  const searchInput = document.getElementById("search-products");
  const resetBtn = document.getElementById("reset-product-filters");
  const resultsCount = document.getElementById("product-results-count");
  const noResults = document.getElementById("product-no-results");

  if (
    !grid ||
    !sortSelect ||
    !categoryFilter ||
    !priceFilter ||
    !availabilityFilter
  ) {
    return;
  }

  const productCards = Array.from(grid.querySelectorAll(".product-card"));

  productCards.forEach((card, index) => {
    card.dataset.originalIndex = index;
  });

  function getProductPrice(card) {
    const priceText = card.querySelector(".price")?.innerText || "0";
    return parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
  }

  function getProductCategory(card) {
    return (card.querySelector("small")?.innerText || "").trim();
  }

  function populateCategories() {
    const categories = [
      ...new Set(productCards.map(getProductCategory).filter(Boolean)),
    ];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.toLowerCase();
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function matchesPriceRange(price, selectedRange) {
    if (!selectedRange) return true;

    if (selectedRange === "0-100") return price < 100;
    if (selectedRange === "100-500") return price >= 100 && price <= 500;
    if (selectedRange === "500-1000") return price > 500 && price <= 1000;
    if (selectedRange === "1000-above") return price > 1000;

    return true;
  }

  function sortProducts(cards, selectedSort) {
    const sortedCards = [...cards];

    sortedCards.sort((a, b) => {
      const priceA = getProductPrice(a);
      const priceB = getProductPrice(b);

      if (selectedSort === "price-low-high") {
        return priceA - priceB;
      }

      if (selectedSort === "price-high-low") {
        return priceB - priceA;
      }

      if (selectedSort === "newest") {
        const dateA = new Date(a.dataset.created || "1970-01-01").getTime();
        const dateB = new Date(b.dataset.created || "1970-01-01").getTime();
        return dateB - dateA;
      }

      if (selectedSort === "popular") {
        const popularityA = Number(a.dataset.popularity || 0);
        const popularityB = Number(b.dataset.popularity || 0);
        return popularityB - popularityA;
      }

      return Number(a.dataset.originalIndex) - Number(b.dataset.originalIndex);
    });

    return sortedCards;
  }

  function applyProductControls() {
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedAvailability = availabilityFilter.value;
    const selectedSort = sortSelect.value;
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filteredCards = productCards.filter((card) => {
      const category = getProductCategory(card).toLowerCase();
      const price = getProductPrice(card);
      const availability = card.dataset.availability || "in-stock";
      const title = card.querySelector("h6")?.innerText.toLowerCase() || "";
      const desc = card.querySelector(".product-desc")?.innerText.toLowerCase() || "";

      const categoryMatch = !selectedCategory || category === selectedCategory;
      const priceMatch = matchesPriceRange(price, selectedPrice);
      const availabilityMatch =
        !selectedAvailability || availability === selectedAvailability;
      const searchMatch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery);

      return categoryMatch && priceMatch && availabilityMatch && searchMatch;
    });

    productCards.forEach((card) => {
      card.style.display = "none";
    });

    const sortedCards = sortProducts(filteredCards, selectedSort);

    sortedCards.forEach((card) => {
      card.style.display = "";
      grid.appendChild(card);
    });

    if (resultsCount) {
      resultsCount.textContent = `${sortedCards.length} product${sortedCards.length === 1 ? "" : "s"} found`;
    }

    if (noResults) {
      noResults.hidden = sortedCards.length !== 0;
    }
  }

  populateCategories();

  [sortSelect, categoryFilter, priceFilter, availabilityFilter].forEach(
    (control) => {
      control.addEventListener("change", applyProductControls);
    },
  );
  if (searchInput) {
    searchInput.addEventListener("input", applyProductControls);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      sortSelect.value = "";
      categoryFilter.value = "";
      priceFilter.value = "";
      availabilityFilter.value = "";
      if (searchInput) searchInput.value = "";
      applyProductControls();
    });
  }

  applyProductControls();
}


const searchIcon = document.querySelector('.nav-icons a[aria-label="Search"]');
if (searchIcon) {
  searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "search.html";
  });
}

// ✅ Real-time badge sync across all pages without refresh
window.addEventListener("storage", (e) => {
  if (e.key === CART_KEY) {
    updateCartBadge();
    renderCartPage();
    if (typeof renderCheckoutSummary === "function") renderCheckoutSummary();
  }
  if (e.key === WISHLIST_KEY) {
    updateWishlistBadge();
    renderWishlistPage();
  }
});

/* 
   BACK TO TOP BUTTON
  */
function setupBackToTop() {
    if (document.querySelector('.back-to-top')) return;

    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('type', 'button');
    backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTopBtn);

    const SCROLL_THRESHOLD = 400;
    let ticking = false;

    function toggleVisibility() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(toggleVisibility);
            ticking = true;
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleVisibility();
}

document.addEventListener('DOMContentLoaded', setupBackToTop);


/* ---- PRODUCT SOCIAL SHARE SYSTEM ---- */
function shareProduct(title, urlEnding) {
  const fullUrl = window.location.origin + "/" + urlEnding;

  if (navigator.share) {
    navigator
      .share({
        title: title,
        text: `Check out the ${title} on Furnix!`,
        url: fullUrl,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        showToast(`${title} link copied to clipboard!`, "success");
      })
      .catch((err) => console.error("Could not copy link:", err));
  }
}



/* ---- THEME TOGGLE LOGIC ---- */
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
      } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
      }
    }
  }

  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";

      // Rotating icon animation
      if (themeIcon) {
        themeIcon.style.transform = "rotate(180deg) scale(0)";
        themeIcon.style.transition = "transform 0.15s ease-in-out";

        setTimeout(() => {
          applyTheme(next);
          localStorage.setItem("theme", next);

          themeIcon.style.transform = "rotate(360deg) scale(1)";
          setTimeout(() => {
            themeIcon.style.transition = "";
            themeIcon.style.transform = "";
          }, 150);
        }, 150);
      } else {
        applyTheme(next);
        localStorage.setItem("theme", next);
      }
    });
  }
});



// Product Quick View Modal (Issue #186)
document.addEventListener("DOMContentLoaded", () => {
    const productCards = document.querySelectorAll('.product-image, .new-product-img');

    function trapFocus(element) {
        const focusable = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    }

    productCards.forEach(card => {
        if (card.querySelector('.quick-view-btn')) return;

        const qvBtn = document.createElement('button');
        qvBtn.className = 'quick-view-btn';
        qvBtn.innerHTML = '<i class="fa-solid fa-eye" aria-hidden="true"></i>';
        qvBtn.title = "Quick View";
        qvBtn.setAttribute('aria-label', 'Quick view product details');
        qvBtn.style.cssText = 'position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.95); border: none; cursor: pointer; color: #c77b30; font-size: 1.1rem; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); opacity: 0; transform: translateY(-10px); transition: all 0.3s ease; z-index: 10;';

        card.style.position = 'relative';
        card.appendChild(qvBtn);

        card.addEventListener('mouseenter', () => {
            qvBtn.style.opacity = '1';
            qvBtn.style.transform = 'translateY(0)';
        });
        card.addEventListener('mouseleave', () => {
            qvBtn.style.opacity = '0';
            qvBtn.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('focusin', () => {
            qvBtn.style.opacity = '1';
            qvBtn.style.transform = 'translateY(0)';
        });
        card.addEventListener('focusout', (e) => {
            if (!card.contains(e.relatedTarget)) {
                qvBtn.style.opacity = '0';
                qvBtn.style.transform = 'translateY(-10px)';
            }
        });

        qvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const parent = card.closest('.product-card, .new-product, .card');
            const img = card.querySelector('img');
            const titleEl = parent ? parent.querySelector('h5, .new-product-text h5, h6') : null;
            const priceEl = parent ? parent.querySelector('.price, .new-product-text strong') : null;

            const imgSrc = img ? img.src : '';
            const title = titleEl ? titleEl.innerText : 'Premium Furniture Piece';
            const price = priceEl ? priceEl.innerText : '$199.00';

            const modalOverlay = document.createElement('div');
            modalOverlay.setAttribute('role', 'dialog');
            modalOverlay.setAttribute('aria-modal', 'true');
            modalOverlay.setAttribute('aria-label', 'Product quick view');
            modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 999999; opacity: 0; transition: opacity 0.3s ease; backdrop-filter: blur(8px); padding: 20px; box-sizing: border-box;';

            const modalContent = document.createElement('div');
            modalContent.style.cssText = 'background: var(--card, #fff); color: var(--text, #111); width: 100%; max-width: 900px; border-radius: 20px; display: flex; flex-direction: row; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.3); transform: scale(0.95) translateY(20px); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; flex-wrap: wrap;';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
            closeBtn.setAttribute('aria-label', 'Close quick view');
            closeBtn.style.cssText = 'position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.05); width: 40px; height: 40px; border-radius: 50%; border: none; font-size: 1.3rem; cursor: pointer; color: var(--text, #111); z-index: 10; display: flex; justify-content: center; align-items: center; transition: 0.2s;';

            modalContent.innerHTML = `
                <div style="flex: 1; min-width: 300px; background: var(--bg, #f9f9f9); display: flex; justify-content: center; align-items: center; padding: 40px;">
                    <img src="${imgSrc}" alt="${title}" style="max-width: 100%; max-height: 450px; object-fit: contain; mix-blend-mode: multiply; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.15));">
                </div>
                <div style="flex: 1.2; min-width: 300px; padding: 50px 40px; display: flex; flex-direction: column; justify-content: center; font-family: 'Jost', sans-serif;">
                    <span style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 3px; color: #c77b30; font-weight: 600; margin-bottom: 12px; display: inline-block;">Quick Look</span>
                    <h2 id="qv-modal-title" style="font-size: 2.2rem; margin-bottom: 15px; line-height: 1.2; font-weight: 500;">${title}</h2>
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                        <h3 style="font-size: 1.8rem; font-weight: 600; color: #c77b30; margin: 0;">${price}</h3>
                        <div style="color: #f6c15a; font-size: 0.9rem;">
                            <i class="fa-solid fa-star" aria-hidden="true"></i><i class="fa-solid fa-star" aria-hidden="true"></i><i class="fa-solid fa-star" aria-hidden="true"></i><i class="fa-solid fa-star" aria-hidden="true"></i><i class="fa-solid fa-star-half-stroke" aria-hidden="true"></i>
                            <span style="color: var(--text-muted, #888); margin-left: 5px;">(4.8)</span>
                        </div>
                    </div>
                    <p style="font-size: 1.05rem; color: var(--text-muted, #666); line-height: 1.6; margin-bottom: 35px;">
                        Experience premium craftsmanship and modern design. This piece seamlessly blends functionality with aesthetic appeal, making it a perfect addition to any contemporary living space.
                    </p>
                    <ul style="list-style: none; padding: 0; margin: 0 0 35px 0; display: flex; gap: 25px; font-size: 0.95rem; color: var(--text, #333); font-weight: 500;">
                        <li><i class="fa-solid fa-circle-check" style="color: #256029; margin-right: 6px;" aria-hidden="true"></i> In Stock</li>
                        <li><i class="fa-solid fa-truck-fast" style="color: #c77b30; margin-right: 6px;" aria-hidden="true"></i> Fast Delivery</li>
                    </ul>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn brown-bg add-cart-modal-btn" style="flex: 1; padding: 16px; font-size: 1.05rem; border: none; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-radius: 8px; background: linear-gradient(135deg, #f6c15a, #d98b36); color: #111; transition: 0.3s;">Add to Cart</button>
                        <button class="qv-wishlist-btn" style="width: 55px; height: 55px; border-radius: 8px; border: 1px solid var(--border, #ddd); background: transparent; color: var(--text, #333); font-size: 1.2rem; cursor: pointer; transition: 0.3s; display: flex; justify-content: center; align-items: center;"><i class="fa-regular fa-heart" aria-hidden="true"></i></button>
                    </div>
                </div>
            `;

            modalContent.prepend(closeBtn);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            requestAnimationFrame(() => {
                modalOverlay.style.opacity = '1';
                modalContent.style.transform = 'scale(1) translateY(0)';
                closeBtn.focus();
            });

            modalOverlay.setAttribute('aria-labelledby', 'qv-modal-title');
            trapFocus(modalOverlay);

            const close = () => {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'scale(0.95) translateY(20px)';
                setTimeout(() => {
                    modalOverlay.remove();
                    qvBtn.focus();
                }, 300);
            };

            closeBtn.addEventListener('click', close);
            closeBtn.addEventListener('mouseover', () => { closeBtn.style.background = 'rgba(0,0,0,0.1)'; });
            closeBtn.addEventListener('mouseout', () => { closeBtn.style.background = 'rgba(0,0,0,0.05)'; });
            modalOverlay.addEventListener('click', (ev) => { if(ev.target === modalOverlay) close(); });
            modalOverlay.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
        });
    });
});

// Lazy Loading & Skeleton Observer
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  lazyImages.forEach(img => {
    img.classList.add('lazy-image-fade');
    const parent = img.closest('.product-image');
    if (parent) {
      parent.classList.add('skeleton-loader');
    }
    
    if (img.complete) {
      img.classList.add('loaded');
      if (parent) parent.classList.remove('skeleton-loader');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
        if (parent) parent.classList.remove('skeleton-loader');
      });
    }
  });

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.complete) {
             img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});
