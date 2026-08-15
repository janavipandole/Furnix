/**
 * Furnix Checkout Order Summary Engine
 * Robust, production-grade calculation module for subtotal, taxes, tiered shipping, discount coupons, and packaging fees.
 */

(function (global) {
    'use strict';

    const CheckoutOrderSummaryEngine = {
        DEFAULT_CONFIG: {
            taxRate: 0.08, // 8% standard sales tax
            freeShippingThreshold: 500.00,
            standardShippingFee: 35.00,
            expressShippingFee: 75.00,
            whiteGloveShippingFee: 150.00,
            giftWrapFee: 12.50,
            ecoPackagingFee: 5.00
        },

        VALID_PROMOS: {
            'FURNIX10': { type: 'percent', value: 10, minSpend: 0 },
            'FURNIX20': { type: 'percent', value: 20, minSpend: 250 },
            'SAVE50': { type: 'fixed', value: 50, minSpend: 400 },
            'FREESHIP': { type: 'shipping', value: 100, minSpend: 150 }
        },

        /**
         * Validates and computes complete order breakdown.
         * @param {Array<{id: string|number, price: number, quantity: number, title?: string}>} items 
         * @param {Object} options Options including shippingMethod, promoCode, packaging, customTaxRate
         * @returns {Object} Calculated summary object
         */
        calculateOrderSummary(items = [], options = {}) {
            const config = Object.assign({}, this.DEFAULT_CONFIG, options.customConfig || {});
            
            // 1. Calculate items subtotal
            let subtotal = 0;
            let totalItemCount = 0;
            const normalizedItems = [];

            if (Array.isArray(items)) {
                items.forEach((item, index) => {
                    const price = parseFloat(item && item.price) || 0;
                    const qty = parseInt(item && item.quantity, 10) || 0;
                    if (price > 0 && qty > 0) {
                        const lineTotal = price * qty;
                        subtotal += lineTotal;
                        totalItemCount += qty;
                        normalizedItems.push({
                            id: item.id || `item-${index}`,
                            title: item.title || 'Furnix Product',
                            price: price,
                            quantity: qty,
                            lineTotal: Math.round(lineTotal * 100) / 100
                        });
                    }
                });
            }

            subtotal = Math.round(subtotal * 100) / 100;

            // 2. Shipping calculation
            const shippingMethod = (options.shippingMethod || 'standard').toLowerCase();
            let baseShipping = config.standardShippingFee;
            if (shippingMethod === 'express') {
                baseShipping = config.expressShippingFee;
            } else if (shippingMethod === 'white-glove') {
                baseShipping = config.whiteGloveShippingFee;
            } else if (shippingMethod === 'free' || subtotal >= config.freeShippingThreshold) {
                baseShipping = 0;
            }

            // 3. Packaging & Add-on Fees
            let packagingFee = 0;
            if (options.giftWrap) packagingFee += config.giftWrapFee;
            if (options.ecoPackaging) packagingFee += config.ecoPackagingFee;

            // 4. Promo code application
            const rawPromo = (options.promoCode || '').trim().toUpperCase();
            let discountAmount = 0;
            let promoApplied = null;
            let promoError = null;

            if (rawPromo) {
                const promoRule = this.VALID_PROMOS[rawPromo];
                if (!promoRule) {
                    promoError = 'Invalid promo code';
                } else if (subtotal < promoRule.minSpend) {
                    promoError = `Code requires a minimum spend of $${promoRule.minSpend.toFixed(2)}`;
                } else {
                    promoApplied = { code: rawPromo, type: promoRule.type, value: promoRule.value };
                    if (promoRule.type === 'percent') {
                        discountAmount = Math.round((subtotal * (promoRule.value / 100)) * 100) / 100;
                    } else if (promoRule.type === 'fixed') {
                        discountAmount = Math.min(subtotal, promoRule.value);
                    } else if (promoRule.type === 'shipping') {
                        baseShipping = 0;
                        discountAmount = 0;
                    }
                }
            }

            const taxableSubtotal = Math.max(0, subtotal - discountAmount);
            const taxRate = typeof options.customTaxRate === 'number' ? options.customTaxRate : config.taxRate;
            const estimatedTax = Math.round((taxableSubtotal * taxRate) * 100) / 100;
            const finalTotal = Math.round((taxableSubtotal + baseShipping + packagingFee + estimatedTax) * 100) / 100;

            return {
                itemCount: totalItemCount,
                items: normalizedItems,
                subtotal: subtotal,
                discount: discountAmount,
                promoApplied: promoApplied,
                promoError: promoError,
                shippingMethod: shippingMethod,
                shippingFee: baseShipping,
                packagingFee: packagingFee,
                taxRate: taxRate,
                estimatedTax: estimatedTax,
                grandTotal: finalTotal,
                qualifiesForFreeShipping: subtotal >= config.freeShippingThreshold
            };
        },

        /**
         * Formats currency amounts as human-readable string.
         * @param {number} amount 
         * @param {string} currency 
         * @returns {string}
         */
        formatCurrency(amount, currency = 'USD') {
            const validAmount = Number.isFinite(amount) ? amount : 0;
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
            }).format(validAmount);
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CheckoutOrderSummaryEngine;
    } else {
        global.CheckoutOrderSummaryEngine = CheckoutOrderSummaryEngine;
    }
})(typeof window !== 'undefined' ? window : this);
