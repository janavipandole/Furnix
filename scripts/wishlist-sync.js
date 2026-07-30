/**
 * Furnix Wishlist Synchronization Controller
 * Synchronizes wishlist state across pages, manages favorite button toggles, and fires custom events.
 */

(function(global) {
    'use strict';

    const WISHLIST_KEY = 'furnix_wishlist';

    class WishlistSync {
        constructor() {
            this.init();
        }

        init() {
            window.addEventListener('storage', (e) => {
                if (e.key === WISHLIST_KEY) {
                    this.updateBadges();
                    this.syncCardButtons();
                }
            });
        }

        getItems() {
            try {
                const data = localStorage.getItem(WISHLIST_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                return [];
            }
        }

        saveItems(items) {
            try {
                localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
                this.updateBadges();
                this.syncCardButtons();
                window.dispatchEvent(new CustomEvent('furnix:wishlist-updated', { detail: { items } }));
            } catch (e) {
                console.error('WishlistSync: Error saving items:', e);
            }
        }

        toggle(product) {
            if (!product || !product.id) return false;
            const items = this.getItems();
            const index = items.findIndex(i => String(i.id) === String(product.id));

            if (index > -1) {
                items.splice(index, 1);
                this.saveItems(items);
                if (global.showToast) global.showToast(`${product.name} removed from wishlist`, 'info');
                return false;
            } else {
                items.push(product);
                this.saveItems(items);
                if (global.showToast) global.showToast(`${product.name} added to wishlist!`, 'success');
                return true;
            }
        }

        isWishlisted(productId) {
            const items = this.getItems();
            return items.some(i => String(i.id) === String(productId));
        }

        updateBadges() {
            const count = this.getItems().length;
            const badges = document.querySelectorAll('#wishlist-badge, .wishlist-badge');
            badges.forEach(b => {
                b.textContent = count;
                b.style.display = count > 0 ? 'inline-flex' : 'none';
            });
        }

        syncCardButtons() {
            const buttons = document.querySelectorAll('[data-wishlist-btn], .favorite-icon');
            buttons.forEach(btn => {
                const card = btn.closest('.product-card');
                if (!card) return;
                const title = card.querySelector('h6')?.innerText || '';
                const id = 'prod_' + title.replace(/\s+/g, '-').toLowerCase();
                const active = this.isWishlisted(id);
                if (active) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-label', 'Remove from wishlist');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-label', 'Add to wishlist');
                }
            });
        }
    }

    const instance = new WishlistSync();
    global.FurnixWishlistSync = instance;

    document.addEventListener('DOMContentLoaded', () => {
        instance.updateBadges();
        instance.syncCardButtons();
    });
})(typeof window !== 'undefined' ? window : this);
