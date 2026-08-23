/**
 * Furnix Extended Warranty & Care Protection Plan Engine
 * Calculates tiered protection plans (1-year, 3-year, 5-year) based on product category, replacement price, and accidental damage coverage.
 */

(function (global) {
    'use strict';

    const WarrantyProtectionPlanEngine = {
        // Plan tier definitions with baseline coverage percentage
        PLAN_TIERS: {
            'none': { id: 'none', name: 'Standard 1-Year Manufacturer Warranty', years: 1, rate: 0.00, minFee: 0, includesAccidental: false },
            'care-2yr': { id: 'care-2yr', name: '2-Year Extended Care Protection', years: 2, rate: 0.10, minFee: 29.00, includesAccidental: true },
            'care-3yr': { id: 'care-3yr', name: '3-Year Premium Complete Protection', years: 3, rate: 0.16, minFee: 49.00, includesAccidental: true },
            'care-5yr': { id: 'care-5yr', name: '5-Year Ultimate Heirloom Shield', years: 5, rate: 0.22, minFee: 89.00, includesAccidental: true }
        },

        // Category risk multiplier
        CATEGORY_MULTIPLIERS: {
            'Seating': 1.15,     // Sofas/chairs have higher fabric wear risk
            'Tables': 1.00,      // Baseline
            'Lighting': 0.90,    // Lower mechanical wear
            'Accessories': 0.85, // Simple decor
            'Storage': 1.00
        },

        /**
         * Computes warranty plan cost and coverage details for an item.
         * @param {number} itemPrice Product price in USD
         * @param {string} category Product category
         * @param {string} planId Selected plan tier key ('none', 'care-2yr', 'care-3yr', 'care-5yr')
         * @returns {Object} Calculated plan details
         */
        calculatePlanCost(itemPrice = 0, category = 'Tables', planId = 'care-3yr') {
            const price = Math.max(0, parseFloat(itemPrice) || 0);
            const plan = this.PLAN_TIERS[planId] || this.PLAN_TIERS['none'];
            const multiplier = this.CATEGORY_MULTIPLIERS[category] || 1.00;

            if (plan.id === 'none' || price === 0) {
                return {
                    planId: plan.id,
                    planName: plan.name,
                    coverageYears: plan.years,
                    planCost: 0,
                    includesAccidental: false,
                    totalWithWarranty: price,
                    features: ['Manufacturer structural defects covered (1 year)']
                };
            }

            const rawCost = (price * plan.rate) * multiplier;
            const finalCost = Math.round(Math.max(plan.minFee, rawCost) * 100) / 100;
            const totalWithWarranty = Math.round((price + finalCost) * 100) / 100;

            const features = [
                `Full ${plan.years}-Year structural & mechanical coverage`,
                'Accidental stain, scratch & rip protection',
                'Zero deductible with in-home repair or replacement',
                '24/7 Priority support concierge'
            ];

            return {
                planId: plan.id,
                planName: plan.name,
                coverageYears: plan.years,
                planCost: finalCost,
                includesAccidental: plan.includesAccidental,
                categoryMultiplier: multiplier,
                totalWithWarranty: totalWithWarranty,
                features: features
            };
        },

        /**
         * Returns all available protection plan options for product configuration.
         * @param {number} itemPrice 
         * @param {string} category 
         * @returns {Array<Object>}
         */
        getAvailablePlans(itemPrice = 0, category = 'Tables') {
            return Object.keys(this.PLAN_TIERS).map(planKey => {
                return this.calculatePlanCost(itemPrice, category, planKey);
            });
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WarrantyProtectionPlanEngine;
    } else {
        global.WarrantyProtectionPlanEngine = WarrantyProtectionPlanEngine;
    }
})(typeof window !== 'undefined' ? window : this);
