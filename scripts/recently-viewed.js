/**
 * Furnix Recently Viewed Products Controller
 * Tracks product clicks, saves details to localStorage, and renders the dynamic section on the Collections page.
 */

(function(global) {
    'use strict';

    const RECENT_KEY = 'furnix_recently_viewed';
    const MAX_ITEMS = 6;

    class RecentlyViewedManager {
        constructor() {
            this.initTracker();
            this.initRenderer();
        }

        // 1. Track product clicks from any listing page
        initTracker() {
            document.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                if (!card) return;

                const linkEl = card.querySelector('a[href]') || card.querySelector('h6 a') || card.closest('a');
                const imgEl = card.querySelector('img');
                const nameEl = card.querySelector('h6, .product-title, h5');
                const priceEl = card.querySelector('.price, .product-price');

                const name = nameEl ? nameEl.innerText.trim() : 'Furnix Product';
                const price = priceEl ? priceEl.innerText.trim() : '';
                const image = imgEl ? imgEl.src : '';
                const url = linkEl ? linkEl.href : window.location.href;
                const id = 'prod_' + name.replace(/\s+/g, '-').toLowerCase();

                if (id) {
                    this.addProduct({ id, name, price, image, url });
                }
            });
        }

        addProduct(product) {
            try {
                let items = this.getItems();
                // Remove duplicate if already exists
                items = items.filter(item => String(item.id) !== String(product.id));
                // Add to the front (most recent first)
                items.unshift(product);
                // Limit to max items (6-8)
                if (items.length > MAX_ITEMS) {
                    items = items.slice(0, MAX_ITEMS);
                }
                localStorage.setItem(RECENT_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('RecentlyViewed: Error saving product:', e);
            }
        }

        getItems() {
            try {
                const data = localStorage.getItem(RECENT_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                return [];
            }
        }

        // 2. Render recently viewed section on Collections page
        initRenderer() {
            document.addEventListener('DOMContentLoaded', () => {
                const items = this.getItems();
                const collectionsContainer = document.querySelector('.collections-container, main, .container');

                // Check if we are on the collections page or if container exists
                if (!collectionsContainer) return;

                // Remove existing container if any
                let section = document.getElementById('recently-viewed-section');
                if (section) section.remove();

                if (items.length === 0) {
                    return; // Hide section when no viewing history
                }

                section = document.createElement('section');
                section.id = 'recently-viewed-section';
                section.className = 'container my-5 py-4 border-top';

                section.innerHTML = `
                    <div class="row mb-4">
                        <div class="col-12">
                            <h3 class="fw-bold mb-1">Recently Viewed Products</h3>
                            <p class="text-muted small">Pick up right where you left off</p>
                        </div>
                    </div>
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-4">
                        ${items.map(item => `
                            <div class="col">
                                <div class="product-card card h-100 border-0 shadow-sm">
                                    <a href="${item.url}" class="text-decoration-none text-dark">
                                        <div class="bg-light ratio ratio-1x1 overflow-hidden">
                                            <img src="${item.image}" alt="${item.name}" class="object-fit-cover w-100 h-100" loading="lazy">
                                        </div>
                                        <div class="card-body p-3 d-flex flex-column">
                                            <h6 class="card-title text-truncate mb-1" title="${item.name}">${item.name}</h6>
                                            <p class="card-text text-primary fw-bold mb-0">${item.price}</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Append near the bottom of the collections page content
                collectionsContainer.appendChild(section);
            });
        }
    }

    global.FurnixRecentlyViewed = new RecentlyViewedManager();
})(typeof window !== 'undefined' ? window : this);
