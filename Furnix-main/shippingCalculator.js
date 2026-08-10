/**
 * Furnix Shipping Calculation Engine
 * Safely calculates shipping costs, enforcing LTL freight rates for oversized items.
 */

const STANDARD_SHIPPING_RATE = 15.00;
const FREE_SHIPPING_THRESHOLD = 100.00; 
const BASE_FREIGHT_RATE = 150.00;

/**
 * Calculates the final shipping cost based on cart contents and total value.
 * 
 * @param {Array} cartItems - Array of product objects currently in the cart
 * @param {number} cartSubtotal - The total monetary value of the cart
 * @returns {number} The calculated shipping cost
 */
export const calculateShippingCost = (cartItems, cartSubtotal) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return 0;
    }

    // 1. STRICT ALGORITHMIC GUARD CLAUSE
    // Detect any item flagged for LTL freight based on SKU parameters
    const requiresFreight = cartItems.some(item => 
        item.is_freight === true || 
        item.freight_class === 'LTL' ||
        (item.dim_weight && item.dim_weight > 150) // Fallback check for heavy items
    );

    // 2. OVERRIDE: Apply Freight Rules
    if (requiresFreight) {
        // Here you could eventually wire up a real-time LTL API.
        // For now, we inject the static heavy-freight tier to stop margin bleeding.
        return BASE_FREIGHT_RATE;
    }

    // 3. STANDARD PARCEL LOGIC
    if (cartSubtotal >= FREE_SHIPPING_THRESHOLD) {
        return 0; // Free shipping promo applies
    }

    return STANDARD_SHIPPING_RATE;
};
