const { filterProducts } = require('./catalog-product-filter-engine.js');

describe('Catalog Product Filter Engine', () => {
  const sampleProducts = [
    { title: 'Modern Velvet Sofa', category: 'furniture', price: 299 },
    { title: 'Oak Dining Table', category: 'tables', price: 450 },
    { title: 'Minimalist Lamp', category: 'lighting', price: 85 }
  ];

  test('filters by category correctly', () => {
    const result = filterProducts(sampleProducts, { category: 'tables' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Oak Dining Table');
  });

  test('filters by maximum price correctly', () => {
    const result = filterProducts(sampleProducts, { maxPrice: 300 });
    expect(result).toHaveLength(2);
  });

  test('sorts products by price low to high', () => {
    const result = filterProducts(sampleProducts, { sortBy: 'price-low-high' });
    expect(result[0].price).toBe(85);
    expect(result[2].price).toBe(450);
  });
});
