const MaterialSwatchCustomizerEngine = require('./material-swatch-customizer-engine');

console.log('🧪 Running MaterialSwatchCustomizerEngine Test Suite...');

// Test 1: Standard fabric with 0 surcharge
const v1 = MaterialSwatchCustomizerEngine.customizeProductVariant(450, 'mat-velvet-navy', 'FNX-CHAIR-01');
if (v1.surcharge === 0 && v1.finalPrice === 450 && v1.customSku === 'FNX-CHAIR-01-VELVET-NAVY') {
  console.log('  ✔ Test 1 passed: Standard velvet finish configured with zero surcharge.');
} else {
  console.error('  ❌ Test 1 failed:', v1);
  process.exit(1);
}

// Test 2: Full-grain leather upgrade with surcharge
const v2 = MaterialSwatchCustomizerEngine.customizeProductVariant(800, 'mat-leather-cognac', 'FNX-SOFA-09');
// Price = 800 + 180 = 980
if (v2.surcharge === 180 && v2.finalPrice === 980 && v2.hasSurcharge === true) {
  console.log(`  ✔ Test 2 passed: Italian Cognac Leather surcharge added ($${v2.finalPrice}).`);
} else {
  console.error('  ❌ Test 2 failed:', v2);
  process.exit(1);
}

// Test 3: Swatch category filtering
const leathers = MaterialSwatchCustomizerEngine.getAvailableSwatches('leathers');
if (Array.isArray(leathers) && leathers.length === 2) {
  console.log('  ✔ Test 3 passed: Leather swatches filtered successfully.');
} else {
  console.error('  ❌ Test 3 failed:', leathers);
  process.exit(1);
}

// Test 4: Retrieve material details by ID
const mat = MaterialSwatchCustomizerEngine.getMaterialById('mat-boucle-cream');
if (mat && mat.texture === 'Tactile Loop') {
  console.log('  ✔ Test 4 passed: Bouclé material metadata retrieved accurately.');
} else {
  console.error('  ❌ Test 4 failed:', mat);
  process.exit(1);
}

console.log('🎉 All MaterialSwatchCustomizerEngine tests passed successfully!\n');
