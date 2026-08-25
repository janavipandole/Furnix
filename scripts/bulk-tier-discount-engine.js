/**
 * Bulk & Commercial B2B Tiered Volume Pricing Engine for Furnix
 * Dynamically computes quantity tier volume discounts, wholesale savings,
 * and bulk tax exemptions for interior designers, architects, and corporate clients.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BulkTierDiscountEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VOLUME_TIERS = [
    { minQty: 1, maxQty: 2, discountPercent: 0, tierName: 'Standard Retail', badgeText: null },
    { minQty: 3, maxQty: 5, discountPercent: 5, tierName: 'Studio Pack', badgeText: 'Save 5%' },
    { minQty: 6, maxQty: 11, discountPercent: 10, tierName: 'Designer Suite', badgeText: 'Save 10%' },
    { minQty: 12, maxQty: 24, discountPercent: 15, tierName: 'Commercial Project', badgeText: 'Save 15%' },
    { minQty: 25, maxQty: Infinity, discountPercent: 22, tierName: 'Enterprise Wholesale', badgeText: 'Save 22%' }
  ];

  /**
   * Identifies the matching quantity discount tier for an order quantity.
   *
   * @param {number} quantity - Number of units requested
   * @returns {Object} Matching volume discount tier structure
   */
  function getTierForQuantity(quantity) {
    const qty = typeof quantity === 'number' && !isNaN(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    return (
      VOLUME_TIERS.find(t => qty >= t.minQty && qty <= t.maxQty) ||
      VOLUME_TIERS[0]
    );
  }

  /**
   * Computes bulk volume pricing for a given unit price and item quantity.
   *
   * @param {number} unitPrice - Standard retail price per unit ($)
   * @param {number} quantity - Quantity of units
   * @param {string} [accountType='standard'] - 'standard' | 'trade_pro' | 'wholesale'
   * @returns {Object} Tier pricing calculations breakdown
   */
  function calculateBulkPricing(unitPrice, quantity, accountType = 'standard') {
    const rawPrice = typeof unitPrice === 'number' && !isNaN(unitPrice) ? Math.max(0, unitPrice) : 0;
    const rawQty = typeof quantity === 'number' && !isNaN(quantity) ? Math.max(1, Math.floor(quantity)) : 1;

    const baseTier = getTierForQuantity(rawQty);
    let effectiveDiscount = baseTier.discountPercent;

    // Additional commercial trade partner bonus (+3% discount for verified designers)
    if (accountType === 'trade_pro') {
      effectiveDiscount = Math.min(30, effectiveDiscount + 3);
    } else if (accountType === 'wholesale') {
      effectiveDiscount = Math.min(35, Math.max(effectiveDiscount, 20));
    }

    const retailSubtotal = rawPrice * rawQty;
    const discountFactor = effectiveDiscount / 100;
    const totalSavings = retailSubtotal * discountFactor;
    const discountedSubtotal = retailSubtotal - totalSavings;
    const effectiveUnitPrice = rawQty > 0 ? discountedSubtotal / rawQty : rawPrice;

    // Next tier incentive calculation
    const currentTierIndex = VOLUME_TIERS.findIndex(t => t.tierName === baseTier.tierName);
    const nextTier = currentTierIndex < VOLUME_TIERS.length - 1 ? VOLUME_TIERS[currentTierIndex + 1] : null;
    const unitsToNextTier = nextTier ? Math.max(0, nextTier.minQty - rawQty) : 0;

    return {
      unitPrice: Number(rawPrice.toFixed(2)),
      quantity: rawQty,
      accountType,
      tierName: baseTier.tierName,
      discountPercent: effectiveDiscount,
      effectiveUnitPrice: Number(effectiveUnitPrice.toFixed(2)),
      retailSubtotal: Number(retailSubtotal.toFixed(2)),
      totalSavings: Number(totalSavings.toFixed(2)),
      discountedSubtotal: Number(discountedSubtotal.toFixed(2)),
      hasBulkDiscount: effectiveDiscount > 0,
      nextTier: nextTier
        ? {
            tierName: nextTier.tierName,
            targetQty: nextTier.minQty,
            unitsNeeded: unitsToNextTier,
            nextDiscountPercent: nextTier.discountPercent
          }
        : null
    };
  }

  /**
   * Retrieves all volume discount tier steps with calculated prices for catalog UI display.
   *
   * @param {number} unitPrice - Standard retail item price
   * @returns {Array<Object>} List of tiers with computed unit costs
   */
  function getTierTable(unitPrice) {
    const rawPrice = typeof unitPrice === 'number' && !isNaN(unitPrice) ? Math.max(0, unitPrice) : 0;

    return VOLUME_TIERS.map(tier => {
      const discountAmount = rawPrice * (tier.discountPercent / 100);
      const tierUnitPrice = rawPrice - discountAmount;
      return {
        ...tier,
        unitPrice: Number(tierUnitPrice.toFixed(2)),
        savingsPerUnit: Number(discountAmount.toFixed(2)),
        rangeLabel: tier.maxQty === Infinity ? `${tier.minQty}+ units` : `${tier.minQty} - ${tier.maxQty} units`
      };
    });
  }

  return {
    calculateBulkPricing,
    getTierForQuantity,
    getTierTable,
    VOLUME_TIERS
  };
});
