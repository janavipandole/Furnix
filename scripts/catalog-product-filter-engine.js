/**
 * Advanced Catalog Product Filter & Sorting Engine for Furnix
 * Handles category filtering, price range evaluation, dynamic sorting,
 * result counts, and zero-result UI states across product catalog pages.
 */

(function () {
  'use strict';

  const filterProducts = (products, criteria) => {
    if (!Array.isArray(products)) return [];
    const { category = 'all', maxPrice = Infinity, minPrice = 0, sortBy = 'default' } = criteria || {};

    let filtered = products.filter((item) => {
      const matchCategory = category === 'all' || (item.category && item.category.toLowerCase() === category.toLowerCase());
      const price = parseFloat(item.price) || 0;
      const matchPrice = price >= minPrice && price <= maxPrice;
      return matchCategory && matchPrice;
    });

    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return filtered;
  };

  const updateResultCountUI = (count) => {
    const countElement = document.querySelector('.catalog-result-count');
    if (countElement) {
      countElement.textContent = `Showing ${count} product${count === 1 ? '' : 's'}`;
    }
  };

  const toggleEmptyStateUI = (container, isEmpty) => {
    if (!container) return;
    let emptyEl = container.querySelector('.catalog-empty-state');
    if (isEmpty) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'catalog-empty-state';
        emptyEl.innerHTML = `
          <div class="empty-state-content text-center py-5">
            <i class="fa-solid fa-couch fa-3x mb-3 text-muted"></i>
            <h4>No products match your filters</h4>
            <p>Try adjusting your price range or category selections.</p>
            <button type="button" class="btn btn-outline-dark btn-reset-filters">Reset Filters</button>
          </div>
        `;
        container.appendChild(emptyEl);
      }
      emptyEl.style.display = 'block';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  };

  const initCatalogFilters = () => {
    const filterForm = document.querySelector('.catalog-filter-form, [data-catalog-filter]');
    const productGrid = document.querySelector('.product-grid, .furniture-grid');

    if (!filterForm || !productGrid) return;

    const applyFilters = () => {
      const category = filterForm.querySelector('[name="category"]')?.value || 'all';
      const maxPrice = parseFloat(filterForm.querySelector('[name="maxPrice"]')?.value) || Infinity;
      const sortBy = filterForm.querySelector('[name="sortBy"]')?.value || 'default';

      const productCards = Array.from(productGrid.querySelectorAll('.product-card, .pro-card'));
      let visibleCount = 0;

      productCards.forEach((card) => {
        const itemCategory = card.getAttribute('data-category') || 'all';
        const itemPrice = parseFloat(card.getAttribute('data-price') || card.querySelector('.price')?.textContent.replace(/[^0-9.]/g, '') || 0);

        const matchCat = category === 'all' || itemCategory.toLowerCase() === category.toLowerCase();
        const matchPrice = itemPrice <= maxPrice;

        if (matchCat && matchPrice) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      updateResultCountUI(visibleCount);
      toggleEmptyStateUI(productGrid, visibleCount === 0);
    };

    filterForm.addEventListener('change', applyFilters);
    filterForm.addEventListener('reset', () => setTimeout(applyFilters, 50));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogFilters);
  } else {
    initCatalogFilters();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { filterProducts, updateResultCountUI, toggleEmptyStateUI };
  }
})();
