/**
 * Furnix Multi-Criteria Filter Controller
 * Manages product sorting, price filtering, category selection, and URL param synchronization.
 */

(function(global) {
    'use strict';

    class FilterController {
        constructor() {
            this.activeFilters = {
                category: '',
                maxPrice: Infinity,
                minPrice: 0,
                sort: 'featured',
                search: ''
            };
        }

        applyFilters(items = []) {
            if (!Array.isArray(items)) return [];

            return items.filter(item => {
                const categoryMatch = !this.activeFilters.category || 
                    item.category.toLowerCase() === this.activeFilters.category.toLowerCase();
                const priceMatch = item.price >= this.activeFilters.minPrice && 
                    item.price <= this.activeFilters.maxPrice;
                const searchMatch = !this.activeFilters.search || 
                    (item.name + ' ' + item.category).toLowerCase().includes(this.activeFilters.search.toLowerCase());

                return categoryMatch && priceMatch && searchMatch;
            }).sort((a, b) => {
                switch (this.activeFilters.sort) {
                    case 'price-asc': return a.price - b.price;
                    case 'price-desc': return b.price - a.price;
                    case 'name-asc': return a.name.localeCompare(b.name);
                    case 'name-desc': return b.name.localeCompare(a.name);
                    default: return 0;
                }
            });
        }

        setFilter(key, value) {
            this.activeFilters[key] = value;
            this.syncURL();
        }

        syncURL() {
            if (typeof window === 'undefined' || !window.history) return;
            const params = new URLSearchParams(window.location.search);

            if (this.activeFilters.category) params.set('category', this.activeFilters.category);
            else params.delete('category');

            if (this.activeFilters.sort) params.set('sort', this.activeFilters.sort);
            else params.delete('sort');

            if (this.activeFilters.search) params.set('search', this.activeFilters.search);
            else params.delete('search');

            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        }
    }

    global.FurnixFilterController = new FilterController();
})(typeof window !== 'undefined' ? window : this);
