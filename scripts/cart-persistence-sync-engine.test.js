const { calculateCartBadgeTotal, saveStoredCart, getStoredCart } = require('./cart-persistence-sync-engine.js');

describe('Cart Persistence Sync Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('calculates total quantity correctly across multiple cart items', () => {
    const items = [
      { id: '1', name: 'Sofa', quantity: 2 },
      { id: '2', name: 'Table', quantity: 1 }
    ];
    expect(calculateCartBadgeTotal(items)).toBe(3);
  });

  test('handles empty cart calculation', () => {
    expect(calculateCartBadgeTotal([])).toBe(0);
    expect(calculateCartBadgeTotal(null)).toBe(0);
  });
});
