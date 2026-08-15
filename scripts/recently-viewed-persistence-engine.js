/**
 * Furnix Recently Viewed Products Persistence Engine
 * Tracks customer browsing history, enforces capacity limits, prevents duplicates, and provides clean state management.
 */

(function (global) {
    'use strict';

    // In-memory fallback cache for non-browser or SSR / test environments
    let memoryStorage = {};

    const RecentlyViewedPersistenceEngine = {
        STORAGE_KEY: 'furnix_recently_viewed_history',
        DEFAULT_LIMIT: 8,

        /**
         * Loads browsing history list from storage.
         * @returns {Array<Object>}
         */
        getHistory() {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const raw = localStorage.getItem(this.STORAGE_KEY);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        return Array.isArray(parsed) ? parsed : [];
                    }
                } else if (memoryStorage[this.STORAGE_KEY]) {
                    return [...memoryStorage[this.STORAGE_KEY]];
                }
            } catch (e) {
                console.warn('Failed reading browsing history:', e);
            }
            return [];
        },

        /**
         * Records product view and shifts item to front of history list.
         * @param {Object} product Must contain id, title, price, and optional image/category
         * @param {number} maxCapacity Maximum number of history items to retain
         * @returns {Array<Object>} Updated history array
         */
        recordProductView(product, maxCapacity = this.DEFAULT_LIMIT) {
            if (!product || !product.id) return this.getHistory();

            let history = this.getHistory();
            
            // Remove existing duplicate occurrence
            history = history.filter(item => String(item.id) !== String(product.id));

            // Prepend new view with timestamp
            const entry = {
                id: product.id,
                title: product.title || 'Furnix Product',
                price: parseFloat(product.price) || 0,
                image: product.image || 'images/placeholder.jpg',
                category: product.category || 'Furniture',
                viewedAt: Date.now()
            };

            history.unshift(entry);

            // Cap list at maximum capacity
            const limit = Math.max(1, parseInt(maxCapacity, 10) || this.DEFAULT_LIMIT);
            if (history.length > limit) {
                history = history.slice(0, limit);
            }

            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
                } else {
                    memoryStorage[this.STORAGE_KEY] = [...history];
                }
            } catch (e) {
                console.warn('Failed saving browsing history:', e);
            }

            return history;
        },

        /**
         * Removes a single product from browsing history.
         * @param {string|number} productId 
         * @returns {Array<Object>}
         */
        removeFromHistory(productId) {
            let history = this.getHistory();
            history = history.filter(item => String(item.id) !== String(productId));
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
                } else {
                    memoryStorage[this.STORAGE_KEY] = [...history];
                }
            } catch (e) {
                console.warn('Failed saving browsing history:', e);
            }
            return history;
        },

        /**
         * Clears all recorded browsing history.
         */
        clearHistory() {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.removeItem(this.STORAGE_KEY);
                } else {
                    delete memoryStorage[this.STORAGE_KEY];
                }
            } catch (e) {
                console.warn('Failed clearing browsing history:', e);
            }
            return [];
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = RecentlyViewedPersistenceEngine;
    } else {
        global.RecentlyViewedPersistenceEngine = RecentlyViewedPersistenceEngine;
    }
})(typeof window !== 'undefined' ? window : this);
