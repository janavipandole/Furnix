/**
 * Unit Test Suite for Recently Viewed Persistence Engine
 * Run with: node scripts/recently-viewed-persistence-engine.test.js
 */

const assert = require('assert');
const RecentlyViewedPersistenceEngine = require('./recently-viewed-persistence-engine');

console.log('🧪 Running RecentlyViewedPersistenceEngine Tests...');

// Test 1: Empty history initialization
const initial = RecentlyViewedPersistenceEngine.getHistory();
assert.ok(Array.isArray(initial));
console.log('  ✔ Test 1 passed: History initial array returned safely.');

// Test 2: Adding items to history
const item1 = { id: 101, title: 'Nordic Chair', price: 120 };
const history1 = RecentlyViewedPersistenceEngine.recordProductView(item1, 5);
assert.strictEqual(history1.length, 1);
assert.strictEqual(history1[0].id, 101);
console.log('  ✔ Test 2 passed: First product view recorded successfully.');

// Test 3: Deduplication and order shifting
const item2 = { id: 102, title: 'Walnut Table', price: 350 };
RecentlyViewedPersistenceEngine.recordProductView(item2, 5);
// View item 101 again
const updatedHistory = RecentlyViewedPersistenceEngine.recordProductView(item1, 5);
assert.strictEqual(updatedHistory.length, 2);
assert.strictEqual(updatedHistory[0].id, 101); // 101 shifted to front
assert.strictEqual(updatedHistory[1].id, 102);
console.log('  ✔ Test 3 passed: Deduplication shifted active view to front.');

// Test 4: Capacity limit enforcement
const item3 = { id: 103, title: 'Lamp', price: 80 };
const item4 = { id: 104, title: 'Mirror', price: 95 };
RecentlyViewedPersistenceEngine.recordProductView(item3, 3);
const capped = RecentlyViewedPersistenceEngine.recordProductView(item4, 3);
assert.strictEqual(capped.length, 3);
assert.strictEqual(capped[0].id, 104);
console.log('  ✔ Test 4 passed: Capacity limit capped history array size.');

// Test 5: Removing item and clearing history
const removed = RecentlyViewedPersistenceEngine.removeFromHistory(104);
assert.strictEqual(removed.some(i => i.id === 104), false);

const cleared = RecentlyViewedPersistenceEngine.clearHistory();
assert.strictEqual(cleared.length, 0);
console.log('  ✔ Test 5 passed: Item removal and history clearing executed cleanly.');

console.log('🎉 All RecentlyViewedPersistenceEngine tests passed successfully!\n');
