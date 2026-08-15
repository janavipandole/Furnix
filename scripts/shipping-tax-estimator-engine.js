/**
 * Furnix Shipping Zone & Regional Tax Estimator Engine
 * Calculates localized sales taxes, postal code validation, delivery transit days, and regional freight surcharges.
 */

(function (global) {
    'use strict';

    const ShippingTaxEstimatorEngine = {
        // Regional tax rates table
        REGIONAL_TAX_RATES: {
            'CA': { state: 'California', rate: 0.0925, baseTransitDays: 2 },
            'NY': { state: 'New York', rate: 0.08875, baseTransitDays: 3 },
            'TX': { state: 'Texas', rate: 0.0825, baseTransitDays: 3 },
            'FL': { state: 'Florida', rate: 0.0700, baseTransitDays: 4 },
            'WA': { state: 'Washington', rate: 0.0650, baseTransitDays: 2 },
            'IL': { state: 'Illinois', rate: 0.0875, baseTransitDays: 3 },
            'DEFAULT': { state: 'Other US States', rate: 0.0600, baseTransitDays: 5 }
        },

        // Freight surcharge rules for heavy/oversized furniture items
        SURCHARGES: {
            STANDARD_GROUND: 0,
            HEAVY_FREIGHT_SURCHARGE: 45.00, // Applied when weight exceeds threshold
            REMOTE_AREA_SURCHARGE: 25.00
        },

        WEIGHT_THRESHOLD_LBS: 50,

        /**
         * Validates standard US 5-digit zip code.
         * @param {string} zipCode 
         * @returns {boolean}
         */
        isValidZip(zipCode) {
            if (typeof zipCode !== 'string' && typeof zipCode !== 'number') return false;
            return /^\d{5}(-\d{4})?$/.test(String(zipCode).trim());
        },

        /**
         * Estimates shipping delivery speed, carrier freight, and state taxes based on zip code and items.
         * @param {string} stateCode 2-letter state abbreviation
         * @param {string} zipCode 5-digit postal zip
         * @param {number} orderAmount Subtotal in USD
         * @param {number} totalWeightLbs Total shipment weight in pounds
         * @returns {Object} Comprehensive calculation result
         */
        estimateRates(stateCode = 'CA', zipCode = '90210', orderAmount = 0, totalWeightLbs = 0) {
            const normalizedState = (stateCode || 'DEFAULT').trim().toUpperCase();
            const region = this.REGIONAL_TAX_RATES[normalizedState] || this.REGIONAL_TAX_RATES.DEFAULT;

            const validZip = this.isValidZip(zipCode);
            const subtotal = Math.max(0, parseFloat(orderAmount) || 0);
            const weight = Math.max(0, parseFloat(totalWeightLbs) || 0);

            // Base shipping cost logic
            let baseShipping = subtotal >= 500 ? 0 : 35.00;
            let heavyFreightFee = 0;

            if (weight > this.WEIGHT_THRESHOLD_LBS) {
                heavyFreightFee = this.SURCHARGES.HEAVY_FREIGHT_SURCHARGE;
            }

            const totalShipping = baseShipping + heavyFreightFee;
            const estimatedTax = Math.round((subtotal * region.rate) * 100) / 100;
            const estimatedTotal = Math.round((subtotal + totalShipping + estimatedTax) * 100) / 100;

            return {
                validZip: validZip,
                state: region.state,
                stateCode: normalizedState,
                taxRate: region.rate,
                taxPercentage: (region.rate * 100).toFixed(2) + '%',
                estimatedTax: estimatedTax,
                baseShipping: baseShipping,
                heavyFreightFee: heavyFreightFee,
                totalShipping: totalShipping,
                isFreeGroundShipping: baseShipping === 0,
                estimatedTransitDays: region.baseTransitDays,
                deliveryWindow: `${region.baseTransitDays}-${region.baseTransitDays + 2} Business Days`,
                grandTotal: estimatedTotal
            };
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ShippingTaxEstimatorEngine;
    } else {
        global.ShippingTaxEstimatorEngine = ShippingTaxEstimatorEngine;
    }
})(typeof window !== 'undefined' ? window : this);
