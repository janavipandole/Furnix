(function() {
    window.FurnixRecentlyViewed = {
        storageKey: 'furnix_recently_viewed',
        maxItems: 8,
        expiryDays: 30,
        
        trackView(product) {
            // product: {id, name, price, image, category, url}
            let items = this.getItems();
            
            // Remove if already exists
            items = items.filter(item => item.id !== product.id);
            
            // Add new item at beginning
            product.timestamp = new Date().getTime();
            items.unshift(product);
            
            // Limit to max items
            if (items.length > this.maxItems) {
                items = items.slice(0, this.maxItems);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(items));
            this.render();
        },
        
        getItems() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                if (!stored) return [];
                
                let items = JSON.parse(stored);
                const now = new Date().getTime();
                const expiryMs = this.expiryDays * 24 * 60 * 60 * 1000;
                
                // Filter out expired items
                items = items.filter(item => (now - item.timestamp) < expiryMs);
                return items;
            } catch (e) {
                return [];
            }
        },
        
        clear() {
            localStorage.removeItem(this.storageKey);
            this.render();
        },
        
        render(containerId = 'recently-viewed-container') {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const items = this.getItems();
            if (items.length === 0) {
                container.innerHTML = '';
                return;
            }
            
            let html = `
                <div class="recently-viewed-section">
                    <div class="recently-viewed-header">
                        <h2 class="h2-heading gradient-txt">Recently Viewed</h2>
                    </div>
                    <div class="recently-viewed-scroll-container">
            `;
            
            items.forEach(item => {
                html += `
                        <div class="rv-card">
                            <a href="${item.url || '#'}" class="rv-link">
                                <div class="rv-img-container">
                                    <img src="${item.image}" alt="${item.name}" class="rv-image">
                                </div>
                                <div class="rv-info">
                                    <span class="rv-category">${item.category || 'Furniture'}</span>
                                    <h4 class="rv-name">${item.name}</h4>
                                    <div class="rv-price">$${item.price.toFixed(2)}</div>
                                </div>
                            </a>
                        </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        window.FurnixRecentlyViewed.render();
    });
})();
