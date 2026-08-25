const CarbonOffsetEcoEngine = require('./carbon-offset-eco-engine');

console.log('🧪 Running CarbonOffsetEcoEngine Test Suite...');

// Test 1: Single item seating impact
const eco1 = CarbonOffsetEcoEngine.calculateEcoImpact(500, 'seating');
if (eco1.estimatedCo2Kg > 0 && eco1.treesPlantedCount >= 1 && eco1.fscCertified === true) {
  console.log(`  ✔ Test 1 passed: Seating category eco-impact computed (${eco1.estimatedCo2Kg} kg CO2, ${eco1.treesPlantedCount} trees planted).`);
} else {
  console.error('  ❌ Test 1 failed:', eco1);
  process.exit(1);
}

// Test 2: Minimum offset contribution floor ($0.99)
const eco2 = CarbonOffsetEcoEngine.calculateEcoImpact(10, 'accessories');
if (eco2.offsetContribution === 0.99) {
  console.log('  ✔ Test 2 passed: Minimum offset fee floor ($0.99) enforced for small purchases.');
} else {
  console.error('  ❌ Test 2 failed:', eco2);
  process.exit(1);
}

// Test 3: Multi-item cart evaluation
const cartItems = [
  { price: 600, quantity: 1, category: 'tables' },
  { price: 150, quantity: 2, category: 'seating' }
];
const cartEco = CarbonOffsetEcoEngine.evaluateCartEcoSummary(cartItems);
if (cartEco.orderAmount === 900 && cartEco.estimatedCo2Kg > 0 && cartEco.treesPlantedCount > 0) {
  console.log(`  ✔ Test 3 passed: Cart total eco footprint aggregated (${cartEco.estimatedCo2Kg} kg CO2, ${cartEco.treesPlantedCount} trees).`);
} else {
  console.error('  ❌ Test 3 failed:', cartEco);
  process.exit(1);
}

console.log('🎉 All CarbonOffsetEcoEngine tests passed successfully!\n');
