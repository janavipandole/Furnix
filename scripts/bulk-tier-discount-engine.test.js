const BulkTierDiscountEngine = require('./bulk-tier-discount-engine');

console.log('🧪 Running BulkTierDiscountEngine Test Suite...');

// Test 1: Single item purchase (Retail)
const t1 = BulkTierDiscountEngine.calculateBulkPricing(200, 1);
if (t1.discountPercent === 0 && t1.discountedSubtotal === 200 && t1.hasBulkDiscount === false) {
  console.log('  ✔ Test 1 passed: Standard retail pricing correctly calculated.');
} else {
  console.error('  ❌ Test 1 failed:', t1);
  process.exit(1);
}

// Test 2: Quantity in Designer Suite tier (6 units @ 10% off)
const t2 = BulkTierDiscountEngine.calculateBulkPricing(100, 6);
if (t2.discountPercent === 10 && t2.totalSavings === 60 && t2.discountedSubtotal === 540) {
  console.log('  ✔ Test 2 passed: Designer Suite tier 10% volume discount computed correctly ($540.00).');
} else {
  console.error('  ❌ Test 2 failed:', t2);
  process.exit(1);
}

// Test 3: Trade Pro designer account bonus (+3%)
const t3 = BulkTierDiscountEngine.calculateBulkPricing(100, 6, 'trade_pro');
if (t3.discountPercent === 13 && t3.totalSavings === 78) {
  console.log('  ✔ Test 3 passed: Trade Pro account bonus (10% + 3% = 13%) verified.');
} else {
  console.error('  ❌ Test 3 failed:', t3);
  process.exit(1);
}

// Test 4: Next tier upsell hint calculation
const t4 = BulkTierDiscountEngine.calculateBulkPricing(150, 4); // in 3-5 tier, next is 6
if (t4.nextTier && t4.nextTier.unitsNeeded === 2 && t4.nextTier.nextDiscountPercent === 10) {
  console.log('  ✔ Test 4 passed: Next tier incentive computed (2 units needed for 10% tier).');
} else {
  console.error('  ❌ Test 4 failed:', t4);
  process.exit(1);
}

// Test 5: Tier table generator for UI rendering
const table = BulkTierDiscountEngine.getTierTable(300);
if (Array.isArray(table) && table.length === 5 && table[4].unitPrice === 234) {
  console.log('  ✔ Test 5 passed: Catalog volume pricing table generated accurately.');
} else {
  console.error('  ❌ Test 5 failed:', table);
  process.exit(1);
}

console.log('🎉 All BulkTierDiscountEngine tests passed successfully!\n');
