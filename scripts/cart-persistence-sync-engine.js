/**
 * Cart Persistence & Cross-Tab Sync Engine for Furnix
 * Handles cart item state validation, LocalStorage serialization,
 * cross-tab window storage synchronization, and badge counter calculation.
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'furnix_cart';

  const getStoredCart = () => {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage:', e);
      return [];
    }
  };

  const saveStoredCart = (cartItems) => {
    try {
      if (!Array.isArray(cartItems)) return false;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      return true;
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
      return false;
    }
  };

  const calculateCartBadgeTotal = (cartItems) => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => total + (parseInt(item.quantity, 10) || 1), 0);
  };

  const updateCartBadgeUI = () => {
    const cart = getStoredCart();
    const totalCount = calculateCartBadgeTotal(cart);
    const badgeElements = document.querySelectorAll('.cart-badge, .cart-count, [data-cart-count]');

    badgeElements.forEach((badge) => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });
  };

  const initCartSync = () => {
    updateCartBadgeUI();

    window.addEventListener('storage', (event) => {
      if (event.key === CART_STORAGE_KEY) {
        updateCartBadgeUI();
        document.dispatchEvent(new CustomEvent('furnix:cart-updated', { detail: getStoredCart() }));
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartSync);
  } else {
    initCartSync();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getStoredCart, saveStoredCart, calculateCartBadgeTotal, updateCartBadgeUI };
  }
})();
