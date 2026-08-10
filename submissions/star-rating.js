(function() {
    window.FurnixStarRating = {
        render(container, rating, maxStars = 5) {
            if (typeof container === 'string') {
                container = document.querySelector(container);
            }
            if (!container) return;
            
            rating = parseFloat(rating) || 0;
            rating = Math.max(0, Math.min(rating, maxStars));
            
            const fullStars = Math.floor(rating);
            const hasHalfStar = (rating % 1) >= 0.5;
            const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
            
            let html = `<div class="star-rating-wrapper" aria-label="Rated ${rating} out of ${maxStars} stars" title="${rating} / ${maxStars}">`;
            
            // Full stars
            for (let i = 0; i < fullStars; i++) {
                html += `<i class="fa-solid fa-star star-filled"></i>`;
            }
            
            // Half star
            if (hasHalfStar) {
                html += `<i class="fa-solid fa-star-half-stroke star-half"></i>`;
            }
            
            // Empty stars
            for (let i = 0; i < emptyStars; i++) {
                html += `<i class="fa-regular fa-star star-empty"></i>`;
            }
            
            html += `<span class="star-rating-text">${rating.toFixed(1)}</span></div>`;
            
            container.innerHTML = html;
        },
        
        renderAll() {
            const elements = document.querySelectorAll('[data-rating]');
            elements.forEach(el => {
                const rating = el.getAttribute('data-rating');
                const max = el.getAttribute('data-max-stars') || 5;
                this.render(el, rating, max);
            });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        window.FurnixStarRating.renderAll();
    });
})();
