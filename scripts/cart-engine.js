/**
 * Furnix Interactive Shopping Cart Engine
 * Manages client-side cart interactions, event propagation, state synchronization, and DOM updates.
 */

(function(global) {
    'use strict';

    const CART_STORAGE_KEY = 'furnix_shopping_cart';
    const PROMO_STORAGE_KEY = 'furnix_applied_promo';

    class CartEngine {
        constructor() {
            this.calculator = global.CartCalculator || null;
            this.listeners = [];
            this.activePromo = this.loadPromo();
        }

        getCartItems() {
            try {
                const raw = localStorage.getItem(CART_STORAGE_KEY);
                return raw ? JSON.parse(raw) : [];
            } catch (e) {
                console.warn('CartEngine: Error reading localStorage cart:', e);
                return [];
            }
        }

        saveCartItems(items) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
                this.notify();
            } catch (e) {
                console.error('CartEngine: Error saving localStorage cart:', e);
            }
        }

        loadPromo() {
            try {
                return localStorage.getItem(PROMO_STORAGE_KEY) || '';
            } catch (e) {
                return '';
            }
        }

        savePromo(code) {
            try {
                if (code) {
                    localStorage.setItem(PROMO_STORAGE_KEY, code);
                } else {
                    localStorage.removeItem(PROMO_STORAGE_KEY);
                }
                this.activePromo = code;
                this.notify();
            } catch (e) {
                console.error('CartEngine: Error saving promo code:', e);
            }
        }

        addItem(product) {
            if (!product || !product.id) return;
            const items = this.getCartItems();
            const existingIndex = items.findIndex(item => item.id === product.id);

            if (existingIndex > -1) {
                items[existingIndex].quantity = (items[existingIndex].quantity || 1) + (product.quantity || 1);
            } else {
                items.push({
                    id: product.id,
                    name: product.name || 'Furniture Item',
                    price: parseFloat(product.price) || 0,
                    image: product.image || 'images/furniture1.png',
                    category: product.category || 'Home',
                    quantity: parseInt(product.quantity, 10) || 1
                });
            }

            this.saveCartItems(items);
            if (global.showToast) {
                global.showToast(`${product.name || 'Item'} added to cart!`, 'success');
            }
        }

        updateQuantity(productId, delta) {
            const items = this.getCartItems();
            const item = items.find(i => i.id === productId);
            if (!item) return;

            const newQty = (item.quantity || 1) + delta;
            if (newQty <= 0) {
                this.removeItem(productId);
            } else if (newQty <= 99) {
                item.quantity = newQty;
                this.saveCartItems(items);
            }
        }

        setQuantity(productId, quantity) {
            const items = this.getCartItems();
            const item = items.find(i => i.id === productId);
            if (!item) return;

            const parsed = parseInt(quantity, 10);
            if (parsed > 0 && parsed <= 99) {
                item.quantity = parsed;
                this.saveCartItems(items);
            } else if (parsed <= 0) {
                this.removeItem(productId);
            }
        }

        removeItem(productId) {
            const items = this.getCartItems().filter(i => i.id !== productId);
            this.saveCartItems(items);
            if (global.showToast) {
                global.showToast('Item removed from cart', 'info');
            }
        }

        clearCart() {
            this.saveCartItems([]);
            this.savePromo('');
        }

        getSummary() {
            const items = this.getCartItems();
            if (this.calculator) {
                return this.calculator.calculateSummary(items, this.activePromo);
            }
            // Fallback basic calculation
            const subtotal = items.reduce((acc, i) => acc + (parseFloat(i.price) * (i.quantity || 1)), 0);
            return { subtotal, grandTotal: subtotal, itemCount: items.length };
        }

        applyPromo(code) {
            if (!this.calculator) return { success: false, message: 'Calculator missing' };
            const promo = this.calculator.validatePromoCode(code);
            if (promo) {
                this.savePromo(promo.code);
                return { success: true, promo, message: `Promo code ${promo.code} applied!` };
            }
            return { success: false, message: 'Invalid promo code. Try FURNIX10 or ECSOC2026' };
        }

        removePromo() {
            this.savePromo('');
        }

        subscribe(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        }

        notify() {
            const summary = this.getSummary();
            const items = this.getCartItems();
            
            // Dispatch global DOM custom event
            const event = new CustomEvent('furnix:cart-updated', {
                detail: { items, summary }
            });
            window.dispatchEvent(event);

            this.listeners.forEach(cb => cb(items, summary));
            this.updateBadges(summary.itemCount);
        }

        updateBadges(count) {
            const badges = document.querySelectorAll('#cart-badge, .cart-badge');
            badges.forEach(b => {
                b.textContent = count;
                b.style.display = count > 0 ? 'inline-flex' : 'none';
            });
        }
    }

    const instance = new CartEngine();
    global.FurnixCartEngine = instance;

    document.addEventListener('DOMContentLoaded', () => {
        instance.notify();
    });

})(typeof window !== 'undefined' ? window : this);
