/**
 * Unit Test Suite for Inventory Stock Status Engine
 * Run with: node scripts/inventory-stock-status-engine.test.js
 */

const assert = require('assert');
const InventoryStockStatusEngine = require('./inventory-stock-status-engine');

console.log('🧪 Running InventoryStockStatusEngine Tests...');

// Test 1: In stock item evaluation
const inStock = InventoryStockStatusEngine.getStockStatus('prod-chair-01');
assert.strictEqual(inStock.status, 'IN_STOCK');
assert.strictEqual(inStock.stock, 12);
assert.strictEqual(inStock.isPurchasable, true);
console.log('  ✔ Test 1 passed: In-stock status evaluated correctly.');

// Test 2: Low stock warning
const lowStock = InventoryStockStatusEngine.getStockStatus('prod-table-02');
assert.strictEqual(lowStock.status, 'LOW_STOCK');
assert.strictEqual(lowStock.stock, 3);
assert.strictEqual(lowStock.badgeClass, 'badge-low-stock');
console.log('  ✔ Test 2 passed: Low-stock status evaluated correctly.');

// Test 3: Critical stock warning
const criticalStock = InventoryStockStatusEngine.getStockStatus('prod-sofa-04');
assert.strictEqual(criticalStock.status, 'CRITICAL_STOCK');
assert.strictEqual(criticalStock.stock, 1);
assert.strictEqual(criticalStock.label, 'Only 1 left!');
console.log('  ✔ Test 3 passed: Critical-stock threshold detected accurately.');

// Test 4: Backorder item evaluation
const backorder = InventoryStockStatusEngine.getStockStatus('prod-lamp-03');
assert.strictEqual(backorder.status, 'BACKORDER');
assert.strictEqual(backorder.isPurchasable, true);
assert.strictEqual(backorder.backorderAllowed, true);
assert.ok(backorder.label.includes('Backorder'));
console.log('  ✔ Test 4 passed: Backorder item identified and purchasable.');

// Test 5: Out of stock item evaluation
const outOfStock = InventoryStockStatusEngine.getStockStatus('prod-rug-06');
assert.strictEqual(outOfStock.status, 'OUT_OF_STOCK');
assert.strictEqual(outOfStock.isPurchasable, false);
assert.strictEqual(outOfStock.badgeClass, 'badge-out-of-stock');
console.log('  ✔ Test 5 passed: Out-of-stock unpurchasable item detected accurately.');

// Test 6: Reservation & Restock logic
const reserved = InventoryStockStatusEngine.reserveStock('prod-chair-01', 2);
assert.strictEqual(reserved, true);
const updatedStock = InventoryStockStatusEngine.getStockStatus('prod-chair-01');
assert.strictEqual(updatedStock.stock, 10);

InventoryStockStatusEngine.restockProduct('prod-chair-01', 5);
const restocked = InventoryStockStatusEngine.getStockStatus('prod-chair-01');
assert.strictEqual(restocked.stock, 15);
console.log('  ✔ Test 6 passed: Stock reservation and restocking operations functioned safely.');

console.log('🎉 All InventoryStockStatusEngine tests passed successfully!\n');
