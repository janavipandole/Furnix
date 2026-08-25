const FinancingCalculatorEngine = require('./financing-calculator-engine');

console.log('🧪 Running FinancingCalculatorEngine Test Suite...');

// Test 1: 3-month zero interest plan
const plan3 = FinancingCalculatorEngine.calculateInstallment(600, 0, 3);
if (plan3.monthlyPayment === 200 && plan3.totalInterest === 0 && plan3.isZeroInterest === true) {
  console.log('  ✔ Test 1 passed: 3-Month zero interest calculation accurate ($200.00/mo).');
} else {
  console.error('  ❌ Test 1 failed:', plan3);
  process.exit(1);
}

// Test 2: 12-month standard financing with down payment
const plan12 = FinancingCalculatorEngine.calculateInstallment(1200, 200, 12);
// Principal financed = 1000, 12 months @ 4.99%
if (plan12.principalFinanced === 1000 && plan12.monthlyPayment > 0 && plan12.totalPayable > 1200) {
  console.log(`  ✔ Test 2 passed: 12-Month plan with $200 down payment ($${plan12.monthlyPayment}/mo, total: $${plan12.totalPayable}).`);
} else {
  console.error('  ❌ Test 2 failed:', plan12);
  process.exit(1);
}

// Test 3: List all available plans
const allPlans = FinancingCalculatorEngine.getAvailablePlans(1500, 300);
if (Array.isArray(allPlans) && allPlans.length === 5) {
  console.log('  ✔ Test 3 passed: Retrieved 5 available installment options successfully.');
} else {
  console.error('  ❌ Test 3 failed:', allPlans);
  process.exit(1);
}

// Test 4: Edge case of 0 price
const zeroPlan = FinancingCalculatorEngine.calculateInstallment(0, 0, 6);
if (zeroPlan.monthlyPayment === 0 && zeroPlan.totalPayable === 0) {
  console.log('  ✔ Test 4 passed: Zero-price edge case handled smoothly.');
} else {
  console.error('  ❌ Test 4 failed:', zeroPlan);
  process.exit(1);
}

console.log('🎉 All FinancingCalculatorEngine tests passed successfully!\n');
