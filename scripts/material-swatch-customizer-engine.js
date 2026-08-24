/**
 * Material & Finish Swatch Customizer Engine for Furnix
 * Handles dynamic product material textures (Velvet, Full-Grain Italian Leather, Bouclé, Solid Walnut, Brass),
 * custom finish price surcharges, swatch previews, and SKU customization variant generation.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MaterialSwatchCustomizerEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MATERIAL_CATEGORIES = {
    fabrics: [
      { id: 'mat-velvet-navy', name: 'Royal Navy Plush Velvet', hex: '#1e293b', surcharge: 0, durabilityScore: '40k Rubs (High)', texture: 'Soft Plush', inStock: true },
      { id: 'mat-velvet-emerald', name: 'Emerald Forest Velvet', hex: '#064e3b', surcharge: 25.00, durabilityScore: '40k Rubs (High)', texture: 'Soft Plush', inStock: true },
      { id: 'mat-boucle-cream', name: 'Scandinavian Bouclé Cream', hex: '#f5f5f4', surcharge: 45.00, durabilityScore: '35k Rubs (Medium-High)', texture: 'Tactile Loop', inStock: true },
      { id: 'mat-linen-oatmeal', name: 'Natural Oatmeal Pure Linen', hex: '#e7e5e4', surcharge: 15.00, durabilityScore: '30k Rubs (Medium)', texture: 'Breathable Weave', inStock: true }
    ],
    leathers: [
      { id: 'mat-leather-cognac', name: 'Full-Grain Italian Cognac Leather', hex: '#78350f', surcharge: 180.00, durabilityScore: '100k Rubs (Commercial)', texture: 'Supple Semi-Aniline', inStock: true },
      { id: 'mat-leather-charcoal', name: 'Aged Charcoal Top-Grain Leather', hex: '#262626', surcharge: 160.00, durabilityScore: '90k Rubs (Commercial)', texture: 'Distressed Matte', inStock: true }
    ],
    woods: [
      { id: 'mat-wood-walnut', name: 'American Black Walnut', hex: '#451a03', surcharge: 0, durabilityScore: 'Solid Hardwood', texture: 'Natural Satin Oil', inStock: true },
      { id: 'mat-wood-oak', name: 'White Oak Natural', hex: '#d6d3d1', surcharge: 20.00, durabilityScore: 'Solid Hardwood', texture: 'Wire-brushed Matte', inStock: true },
      { id: 'mat-wood-ebony', name: 'Smoked Ebony Stained Ash', hex: '#171717', surcharge: 35.00, durabilityScore: 'Solid Hardwood', texture: 'Deep Grain Lacquer', inStock: true }
    ]
  };

  /**
   * Resolves a material finish item by material ID.
   *
   * @param {string} materialId - Unique material ID
   * @returns {Object|null} Matching material swatch object
   */
  function getMaterialById(materialId) {
    if (!materialId) return null;
    const allMaterials = [
      ...MATERIAL_CATEGORIES.fabrics,
      ...MATERIAL_CATEGORIES.leathers,
      ...MATERIAL_CATEGORIES.woods
    ];
    return allMaterials.find(m => m.id === materialId) || null;
  }

  /**
   * Calculates custom customized price and generates bespoke SKU code.
   *
   * @param {number} basePrice - Product base retail price ($)
   * @param {string} materialId - Selected material ID
   * @param {string} [baseSku='FNX-PROD'] - Base product catalog SKU
   * @returns {Object} Customization pricing and variant breakdown
   */
  function customizeProductVariant(basePrice, materialId, baseSku = 'FNX-PROD') {
    const rawPrice = typeof basePrice === 'number' && !isNaN(basePrice) ? Math.max(0, basePrice) : 0;
    const material = getMaterialById(materialId) || MATERIAL_CATEGORIES.fabrics[0];

    const surcharge = material.surcharge || 0;
    const finalPrice = rawPrice + surcharge;
    const variantSuffix = material.id.replace('mat-', '').toUpperCase();
    const customSku = `${baseSku}-${variantSuffix}`;

    return {
      basePrice: Number(rawPrice.toFixed(2)),
      materialId: material.id,
      materialName: material.name,
      materialHex: material.hex,
      texture: material.texture,
      durabilityScore: material.durabilityScore,
      surcharge: Number(surcharge.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
      customSku,
      hasSurcharge: surcharge > 0,
      inStock: material.inStock
    };
  }

  /**
   * Returns all available swatch options filtered by category.
   *
   * @param {string} [category='all'] - 'all' | 'fabrics' | 'leathers' | 'woods'
   * @returns {Array<Object>} List of material options
   */
  function getAvailableSwatches(category = 'all') {
    if (category === 'fabrics') return MATERIAL_CATEGORIES.fabrics;
    if (category === 'leathers') return MATERIAL_CATEGORIES.leathers;
    if (category === 'woods') return MATERIAL_CATEGORIES.woods;
    return [
      ...MATERIAL_CATEGORIES.fabrics,
      ...MATERIAL_CATEGORIES.leathers,
      ...MATERIAL_CATEGORIES.woods
    ];
  }

  return {
    getMaterialById,
    customizeProductVariant,
    getAvailableSwatches,
    MATERIAL_CATEGORIES
  };
});
