/**
 * Unit Test Suite for Shipping Zone & Regional Tax Estimator Engine
 * Run with: node scripts/shipping-tax-estimator-engine.test.js
 */

const assert = require('assert');
const ShippingTaxEstimatorEngine = require('./shipping-tax-estimator-engine');

console.log('🧪 Running ShippingTaxEstimatorEngine Tests...');

// Test 1: Zip validation
assert.strictEqual(ShippingTaxEstimatorEngine.isValidZip('90210'), true);
assert.strictEqual(ShippingTaxEstimatorEngine.isValidZip('10001-1234'), true);
assert.strictEqual(ShippingTaxEstimatorEngine.isValidZip('ABCDE'), false);
assert.strictEqual(ShippingTaxEstimatorEngine.isValidZip(''), false);
console.log('  ✔ Test 1 passed: Postal zip code verification passed.');

// Test 2: California regional calculation
const caEstimate = ShippingTaxEstimatorEngine.estimateRates('CA', '90210', 300, 20);
assert.strictEqual(caEstimate.state, 'California');
assert.strictEqual(caEstimate.taxRate, 0.0925);
assert.strictEqual(caEstimate.estimatedTax, 27.75); // 300 * 0.0925 = 27.75
assert.strictEqual(caEstimate.baseShipping, 35.00);
assert.strictEqual(caEstimate.heavyFreightFee, 0);
assert.strictEqual(caEstimate.grandTotal, 362.75);
console.log('  ✔ Test 2 passed: California regional tax & standard ground shipping estimated accurately.');

// Test 3: Free shipping on orders >= $500
const largeOrder = ShippingTaxEstimatorEngine.estimateRates('NY', '10001', 650, 30);
assert.strictEqual(largeOrder.isFreeGroundShipping, true);
assert.strictEqual(largeOrder.baseShipping, 0);
console.log('  ✔ Test 3 passed: Free shipping applied on qualifying order amount.');

// Test 4: Heavy freight surcharge application
const heavyOrder = ShippingTaxEstimatorEngine.estimateRates('TX', '75001', 600, 85);
assert.strictEqual(heavyOrder.heavyFreightFee, 45.00);
assert.strictEqual(heavyOrder.totalShipping, 45.00); // 0 base + 45 freight
console.log('  ✔ Test 4 passed: Oversized heavy freight surcharge applied accurately.');

// Test 5: Fallback default state handling
const fallbackEstimate = ShippingTaxEstimatorEngine.estimateRates('ZZ', '00000', 100, 10);
assert.strictEqual(fallbackEstimate.taxRate, 0.0600);
assert.strictEqual(fallbackEstimate.estimatedTransitDays, 5);
console.log('  ✔ Test 5 passed: Fallback regional defaults handled safely.');

console.log('🎉 All ShippingTaxEstimatorEngine tests passed successfully!\n');
