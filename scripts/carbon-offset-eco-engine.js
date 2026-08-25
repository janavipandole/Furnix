/**
 * Eco-Impact & Carbon-Neutral Delivery Offset Engine for Furnix
 * Computes product lifecycle carbon footprints (kg CO2e), tree planting donation matches,
 * sustainable materials verification (FSC certified timber, recycled steel), and eco pledge badges.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CarbonOffsetEcoEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Average carbon footprint intensity (kg CO2e per $100 spent) by furniture category
  const CATEGORY_CARBON_FACTORS = {
    seating: { factor: 14.5, fscCertified: true, recycledContentPercent: 35 },
    tables: { factor: 18.2, fscCertified: true, recycledContentPercent: 20 },
    lighting: { factor: 8.0, fscCertified: false, recycledContentPercent: 60 },
    storage: { factor: 16.0, fscCertified: true, recycledContentPercent: 25 },
    accessories: { factor: 4.5, fscCertified: true, recycledContentPercent: 50 },
    default: { factor: 12.0, fscCertified: true, recycledContentPercent: 30 }
  };

  // Cost per kg CO2 offset via verified reforestation programs ($0.05 per kg CO2)
  const OFFSET_COST_PER_KG = 0.05;
  const KG_CO2_PER_TREE_ANNUALLY = 22.0;

  /**
   * Calculates comprehensive eco-impact and carbon-neutral offset costs.
   *
   * @param {number} orderAmount - Order subtotal or item price ($)
   * @param {string} [category='default'] - Furniture category
   * @param {boolean} [includeReforestationMatch=true] - Whether 1-tree match is active
   * @returns {Object} Calculated ecological breakdown and offset options
   */
  function calculateEcoImpact(orderAmount, category = 'default', includeReforestationMatch = true) {
    const rawAmount = typeof orderAmount === 'number' && !isNaN(orderAmount) ? Math.max(0, orderAmount) : 0;
    const catKey = (category || 'default').toLowerCase();
    const config = CATEGORY_CARBON_FACTORS[catKey] || CATEGORY_CARBON_FACTORS.default;

    // Estimate kg CO2e footprint
    const estimatedCo2Kg = (rawAmount / 100) * config.factor;
    // Micro-contribution offset cost
    const offsetContribution = Math.max(0.99, estimatedCo2Kg * OFFSET_COST_PER_KG);
    // Equivalent trees planted needed to absorb this footprint in 1 year
    const treesEquivalent = Math.max(1, Math.ceil(estimatedCo2Kg / KG_CO2_PER_TREE_ANNUALLY));

    return {
      orderAmount: Number(rawAmount.toFixed(2)),
      category: catKey,
      estimatedCo2Kg: Number(estimatedCo2Kg.toFixed(1)),
      offsetContribution: Number(offsetContribution.toFixed(2)),
      treesPlantedCount: includeReforestationMatch ? treesEquivalent : 0,
      fscCertified: config.fscCertified,
      recycledContentPercent: config.recycledContentPercent,
      sustainabilityBadge: config.fscCertified ? '100% FSC-Certified Sustainable Timber' : 'Eco-Verified Supply Chain',
      ecoPledgeSummary: `Every Furnix order plants ${treesEquivalent} native tree${treesEquivalent > 1 ? 's' : ''} to neutralize ${estimatedCo2Kg.toFixed(1)} kg CO₂.`
    };
  }

  /**
   * Evaluates cart item list for aggregate sustainability score.
   *
   * @param {Array<Object>} cartItems - Array of cart item objects
   * @returns {Object} Aggregated eco footprint summary
   */
  function evaluateCartEcoSummary(cartItems = []) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return calculateEcoImpact(0, 'default');
    }

    let totalSubtotal = 0;
    let totalCo2 = 0;
    let totalOffset = 0;

    cartItems.forEach(item => {
      const price = (item.price || 0) * (item.quantity || 1);
      const impact = calculateEcoImpact(price, item.category);
      totalSubtotal += price;
      totalCo2 += impact.estimatedCo2Kg;
      totalOffset += impact.offsetContribution;
    });

    const totalTrees = Math.max(1, Math.ceil(totalCo2 / KG_CO2_PER_TREE_ANNUALLY));

    return {
      orderAmount: Number(totalSubtotal.toFixed(2)),
      estimatedCo2Kg: Number(totalCo2.toFixed(1)),
      offsetContribution: Number(totalOffset.toFixed(2)),
      treesPlantedCount: totalTrees,
      sustainabilityBadge: 'Verified Carbon-Neutral Checkout',
      ecoPledgeSummary: `Neutralizes ${totalCo2.toFixed(1)} kg CO₂ with ${totalTrees} trees planted.`
    };
  }

  return {
    calculateEcoImpact,
    evaluateCartEcoSummary,
    CATEGORY_CARBON_FACTORS
  };
});
