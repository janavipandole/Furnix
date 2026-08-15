/**
 * Furnix Inventory Stock Status Engine
 * Manages real-time product inventory levels, backorders, restocking countdowns, and stock badges.
 */

(function (global) {
    'use strict';

    const InventoryStockStatusEngine = {
        STORAGE_KEY: 'furnix_inventory_registry',

        // Threshold configurations
        THRESHOLDS: {
            OUT_OF_STOCK: 0,
            LOW_STOCK: 5,
            CRITICAL_STOCK: 2
        },

        // Default catalog initial stock counts
        DEFAULT_CATALOG_INVENTORY: {
            'prod-chair-01': { stock: 12, backorderAllowed: false, nextRestock: null },
            'prod-table-02': { stock: 3, backorderAllowed: true, nextRestock: '2026-09-01' },
            'prod-lamp-03': { stock: 0, backorderAllowed: true, nextRestock: '2026-08-25' },
            'prod-sofa-04': { stock: 1, backorderAllowed: false, nextRestock: '2026-09-15' },
            'prod-shelf-05': { stock: 18, backorderAllowed: false, nextRestock: null },
            'prod-rug-06': { stock: 0, backorderAllowed: false, nextRestock: null }
        },

        /**
         * Loads stock data from localStorage or initializes with defaults.
         * @returns {Object}
         */
        getInventoryState() {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const raw = localStorage.getItem(this.STORAGE_KEY);
                    if (raw) return JSON.parse(raw);
                }
            } catch (e) {
                console.warn('Unable to read inventory state from storage:', e);
            }
            return Object.assign({}, this.DEFAULT_CATALOG_INVENTORY);
        },

        /**
         * Saves active inventory map to localStorage.
         * @param {Object} state 
         */
        saveInventoryState(state) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
                }
            } catch (e) {
                console.warn('Unable to save inventory state to storage:', e);
            }
        },

        /**
         * Evaluates stock status for a given product ID.
         * @param {string} productId 
         * @returns {Object} Stock detail object
         */
        getStockStatus(productId) {
            const state = this.getInventoryState();
            const record = state[productId] || { stock: 10, backorderAllowed: false, nextRestock: null };

            const count = Math.max(0, parseInt(record.stock, 10) || 0);
            let status = 'IN_STOCK';
            let badgeClass = 'badge-in-stock';
            let label = 'In Stock';
            let isPurchasable = true;

            if (count === this.THRESHOLDS.OUT_OF_STOCK) {
                if (record.backorderAllowed) {
                    status = 'BACKORDER';
                    badgeClass = 'badge-backorder';
                    label = record.nextRestock ? `Backorder (Ships ${record.nextRestock})` : 'Available on Backorder';
                    isPurchasable = true;
                } else {
                    status = 'OUT_OF_STOCK';
                    badgeClass = 'badge-out-of-stock';
                    label = 'Out of Stock';
                    isPurchasable = false;
                }
            } else if (count <= this.THRESHOLDS.CRITICAL_STOCK) {
                status = 'CRITICAL_STOCK';
                badgeClass = 'badge-critical-stock';
                label = `Only ${count} left!`;
                isPurchasable = true;
            } else if (count <= this.THRESHOLDS.LOW_STOCK) {
                status = 'LOW_STOCK';
                badgeClass = 'badge-low-stock';
                label = `Low Stock (${count} left)`;
                isPurchasable = true;
            }

            return {
                productId: productId,
                stock: count,
                status: status,
                badgeClass: badgeClass,
                label: label,
                isPurchasable: isPurchasable,
                backorderAllowed: !!record.backorderAllowed,
                nextRestock: record.nextRestock || null
            };
        },

        /**
         * Reserves / decrements stock count safely upon cart addition or checkout.
         * @param {string} productId 
         * @param {number} quantity 
         * @returns {boolean} True if successfully allocated
         */
        reserveStock(productId, quantity = 1) {
            const state = this.getInventoryState();
            const current = state[productId] || { stock: 10, backorderAllowed: false, nextRestock: null };

            if (current.stock >= quantity) {
                current.stock -= quantity;
                state[productId] = current;
                this.saveInventoryState(state);
                return true;
            } else if (current.backorderAllowed) {
                current.stock = Math.max(0, current.stock - quantity);
                state[productId] = current;
                this.saveInventoryState(state);
                return true;
            }
            return false;
        },

        /**
         * Replenishes stock for a product ID.
         * @param {string} productId 
         * @param {number} quantity 
         * @returns {number} New total stock
         */
        restockProduct(productId, quantity = 10) {
            const state = this.getInventoryState();
            const current = state[productId] || { stock: 0, backorderAllowed: false, nextRestock: null };
            current.stock = (parseInt(current.stock, 10) || 0) + quantity;
            state[productId] = current;
            this.saveInventoryState(state);
            return current.stock;
        },

        /**
         * Resets state back to default catalog inventory.
         */
        resetToDefaults() {
            this.saveInventoryState(Object.assign({}, this.DEFAULT_CATALOG_INVENTORY));
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = InventoryStockStatusEngine;
    } else {
        global.InventoryStockStatusEngine = InventoryStockStatusEngine;
    }
})(typeof window !== 'undefined' ? window : this);
