/**
 * Furnix Product Search Engine
 * Client-side search indexing engine supporting fuzzy text matching, query highlighting, and score ranking.
 */

(function(global) {
    'use strict';

    class SearchEngine {
        constructor() {
            this.index = [];
        }

        buildIndex(products) {
            if (!Array.isArray(products)) return;
            this.index = products.map(p => ({
                id: p.id || '',
                name: p.name || '',
                category: p.category || '',
                price: parseFloat(p.price) || 0,
                image: p.image || '',
                description: p.description || '',
                element: p.element || null,
                normalizedText: `${p.name} ${p.category} ${p.description || ''}`.toLowerCase()
            }));
        }

        search(query) {
            if (!query || typeof query !== 'string') return [...this.index];
            const cleanQuery = query.trim().toLowerCase();
            if (!cleanQuery) return [...this.index];

            const terms = cleanQuery.split(/\s+/);
            
            return this.index.filter(item => {
                return terms.every(term => item.normalizedText.includes(term));
            }).map(item => {
                const nameMatch = item.name.toLowerCase().includes(cleanQuery);
                const score = nameMatch ? 2 : 1;
                return { ...item, score };
            }).sort((a, b) => b.score - a.score);
        }

        highlight(text, query) {
            if (!query || !text) return text;
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark class="search-highlight">$1</mark>');
        }
    }

    global.FurnixSearchEngine = new SearchEngine();
})(typeof window !== 'undefined' ? window : this);
