/**
 * Unit Test Suite for Checkout Order Summary Engine
 * Run with: node scripts/checkout-order-summary-calculator.test.js
 */

const assert = require('assert');
const CheckoutOrderSummaryEngine = require('./checkout-order-summary-calculator');

console.log('🧪 Running CheckoutOrderSummaryEngine Tests...');

// Test 1: Empty cart returns zeros
const emptySummary = CheckoutOrderSummaryEngine.calculateOrderSummary([]);
assert.strictEqual(emptySummary.subtotal, 0);
assert.strictEqual(emptySummary.itemCount, 0);
assert.strictEqual(emptySummary.grandTotal, 35); // standard shipping on 0 spend
console.log('  ✔ Test 1 passed: Empty items summary calculated safely.');

// Test 2: Standard cart calculation
const sampleItems = [
    { id: 101, title: 'Nordic Oak Dining Chair', price: 149.99, quantity: 2 },
    { id: 102, title: 'Minimalist Ceramic Vase', price: 45.00, quantity: 1 }
];
const standardSummary = CheckoutOrderSummaryEngine.calculateOrderSummary(sampleItems, {
    shippingMethod: 'standard'
});
assert.strictEqual(standardSummary.subtotal, 344.98);
assert.strictEqual(standardSummary.itemCount, 3);
assert.strictEqual(standardSummary.shippingFee, 35.00);
assert.strictEqual(standardSummary.estimatedTax, 27.60); // 344.98 * 0.08 = 27.5984 -> 27.60
assert.strictEqual(standardSummary.grandTotal, 407.58);
console.log('  ✔ Test 2 passed: Standard cart subtotal, shipping and tax calculated correctly.');

// Test 3: Free shipping on orders >= $500
const largeOrder = [
    { id: 201, title: 'Velvet Lounge Sofa', price: 799.00, quantity: 1 }
];
const freeShipSummary = CheckoutOrderSummaryEngine.calculateOrderSummary(largeOrder, {
    shippingMethod: 'standard'
});
assert.strictEqual(freeShipSummary.qualifiesForFreeShipping, true);
assert.strictEqual(freeShipSummary.shippingFee, 0);
console.log('  ✔ Test 3 passed: Free shipping applied on qualifying order amount.');

// Test 4: Percentage promo discount
const promoSummary = CheckoutOrderSummaryEngine.calculateOrderSummary(sampleItems, {
    promoCode: 'FURNIX10'
});
assert.strictEqual(promoSummary.discount, 34.50);
assert.strictEqual(promoSummary.promoApplied.code, 'FURNIX10');
console.log('  ✔ Test 4 passed: Promo percentage discount applied accurately.');

// Test 5: Packaging fees
const packagingSummary = CheckoutOrderSummaryEngine.calculateOrderSummary(sampleItems, {
    giftWrap: true,
    ecoPackaging: true
});
assert.strictEqual(packagingSummary.packagingFee, 17.50);
console.log('  ✔ Test 5 passed: Gift wrap and eco-packaging add-ons calculated correctly.');

console.log('🎉 All CheckoutOrderSummaryEngine tests passed successfully!\n');
