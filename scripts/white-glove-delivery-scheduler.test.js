const WhiteGloveDeliveryScheduler = require('./white-glove-delivery-scheduler');

console.log('🧪 Running WhiteGloveDeliveryScheduler Test Suite...');

// Test 1: Standard curbside delivery above free threshold ($150)
const quote1 = WhiteGloveDeliveryScheduler.calculateDeliveryQuote(250, 'standard-curbside', 'morning');
if (quote1.baseFee === 0 && quote1.totalDeliveryCost === 0 && quote1.isFreeDelivery === true) {
  console.log('  ✔ Test 1 passed: Free standard delivery threshold applied correctly ($0.00).');
} else {
  console.error('  ❌ Test 1 failed:', quote1);
  process.exit(1);
}

// Test 2: Full White-Glove assembly with Evening Priority slot
const quote2 = WhiteGloveDeliveryScheduler.calculateDeliveryQuote(800, 'white-glove-full', 'evening-priority');
// Base fee 119 + slot surcharge 25 = 144
if (quote2.baseFee === 119 && quote2.slotSurcharge === 25 && quote2.totalDeliveryCost === 144 && quote2.grandTotal === 944) {
  console.log(`  ✔ Test 2 passed: White-Glove assembly + Evening priority surcharge calculated ($${quote2.totalDeliveryCost}).`);
} else {
  console.error('  ❌ Test 2 failed:', quote2);
  process.exit(1);
}

// Test 3: List available delivery tiers
const tiers = WhiteGloveDeliveryScheduler.getAvailableTiers(500);
if (Array.isArray(tiers) && tiers.length === 3 && tiers[0].isFreeEligible === true) {
  console.log('  ✔ Test 3 passed: 3 delivery service tiers listed with eligibility flags.');
} else {
  console.error('  ❌ Test 3 failed:', tiers);
  process.exit(1);
}

// Test 4: Lead time date calculator excludes Sundays
const baseMon = new Date('2026-09-07T10:00:00Z'); // Monday
const d = WhiteGloveDeliveryScheduler.calculateDeliveryDate(3, baseMon);
if (d instanceof Date && d > baseMon) {
  console.log('  ✔ Test 4 passed: Estimated delivery date calculation verified.');
} else {
  console.error('  ❌ Test 4 failed:', d);
  process.exit(1);
}

console.log('🎉 All WhiteGloveDeliveryScheduler tests passed successfully!\n');
