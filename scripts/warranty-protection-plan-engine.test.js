/**
 * Unit Test Suite for Extended Warranty & Protection Plan Engine
 * Run with: node scripts/warranty-protection-plan-engine.test.js
 */

const assert = require('assert');
const WarrantyProtectionPlanEngine = require('./warranty-protection-plan-engine');

console.log('🧪 Running WarrantyProtectionPlanEngine Tests...');

// Test 1: Standard 'none' option gives $0 cost
const nonePlan = WarrantyProtectionPlanEngine.calculatePlanCost(500, 'Tables', 'none');
assert.strictEqual(nonePlan.planCost, 0);
assert.strictEqual(nonePlan.coverageYears, 1);
assert.strictEqual(nonePlan.totalWithWarranty, 500);
console.log('  ✔ Test 1 passed: Standard baseline manufacturer warranty handled accurately.');

// Test 2: 3-Year plan for standard Table ($500 * 0.16 * 1.0 = $80.00)
const tablePlan = WarrantyProtectionPlanEngine.calculatePlanCost(500, 'Tables', 'care-3yr');
assert.strictEqual(tablePlan.planCost, 80.00);
assert.strictEqual(tablePlan.coverageYears, 3);
assert.strictEqual(tablePlan.includesAccidental, true);
assert.strictEqual(tablePlan.totalWithWarranty, 580.00);
console.log('  ✔ Test 2 passed: 3-Year Table protection plan cost computed accurately.');

// Test 3: Category multiplier for Seating ($600 * 0.16 * 1.15 = 110.40)
const sofaPlan = WarrantyProtectionPlanEngine.calculatePlanCost(600, 'Seating', 'care-3yr');
assert.strictEqual(sofaPlan.planCost, 110.40);
assert.strictEqual(sofaPlan.categoryMultiplier, 1.15);
console.log('  ✔ Test 3 passed: Seating category risk multiplier applied correctly.');

// Test 4: Minimum plan fee enforcement ($50 item on 2yr plan min fee $29)
const minFeePlan = WarrantyProtectionPlanEngine.calculatePlanCost(50, 'Lighting', 'care-2yr');
assert.strictEqual(minFeePlan.planCost, 29.00);
console.log('  ✔ Test 4 passed: Minimum plan floor fee enforced for low-cost items.');

// Test 5: List all available plan tiers
const allPlans = WarrantyProtectionPlanEngine.getAvailablePlans(400, 'Tables');
assert.strictEqual(allPlans.length, 4);
assert.strictEqual(allPlans[0].planId, 'none');
assert.strictEqual(allPlans[1].planId, 'care-2yr');
console.log('  ✔ Test 5 passed: All tier options queried correctly.');

console.log('🎉 All WarrantyProtectionPlanEngine tests passed successfully!\n');
