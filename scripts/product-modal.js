/**
 * Furnix Accessible Product QuickView Modal Engine
 * Dynamically builds product detail overlay modals with focus locks and keyboard controls.
 */

(function(global) {
    'use strict';

    class ProductModal {
        constructor() {
            this.activeModal = null;
            this.previousFocus = null;
            this.init();
        }

        init() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.activeModal) {
                    this.closeModal();
                }
            });
        }

        open(product) {
            if (!product) return;
            this.previousFocus = document.activeElement;

            const backdrop = document.createElement('div');
            backdrop.className = 'furnix-modal-backdrop';
            backdrop.setAttribute('role', 'dialog');
            backdrop.setAttribute('aria-modal', 'true');
            backdrop.setAttribute('aria-labelledby', 'modalProductTitle');

            const content = document.createElement('div');
            content.className = 'furnix-modal-content';

            const formattedPrice = (typeof product.price === 'number') ? `$${product.price.toFixed(2)}` : product.price;
            const category = product.category || 'Furnix Collection';
            const image = product.image || 'images/furniture1.png';

            content.innerHTML = `
                <button class="furnix-modal-close" aria-label="Close product quickview">&times;</button>
                <div class="furnix-modal-body">
                    <div class="furnix-modal-img-col">
                        <img src="${image}" alt="${product.name}" class="furnix-modal-img">
                    </div>
                    <div class="furnix-modal-details-col">
                        <span class="furnix-modal-category">${category}</span>
                        <h3 id="modalProductTitle" class="furnix-modal-title">${product.name}</h3>
                        <p class="furnix-modal-price">${formattedPrice}</p>
                        <p class="furnix-modal-desc">Crafted with precision engineering and sustainable oak, designed to bring elegance and comfort to modern living spaces.</p>
                        <div class="furnix-modal-actions">
                            <div class="furnix-modal-qty">
                                <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
                                <input type="number" class="qty-input" value="1" min="1" max="99" aria-label="Quantity">
                                <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                            </div>
                            <button type="button" class="btn furnix-modal-add-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;

            backdrop.appendChild(content);
            document.body.appendChild(backdrop);
            document.body.style.overflow = 'hidden';
            this.activeModal = backdrop;

            const closeBtn = content.querySelector('.furnix-modal-close');
            const qtyInput = content.querySelector('.qty-input');
            const minusBtn = content.querySelector('.qty-minus');
            const plusBtn = content.querySelector('.qty-plus');
            const addBtn = content.querySelector('.furnix-modal-add-btn');

            closeBtn.focus();
            closeBtn.addEventListener('click', () => this.closeModal());
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeModal();
            });

            minusBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value, 10) || 1;
                if (val > 1) qtyInput.value = val - 1;
            });

            plusBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value, 10) || 1;
                if (val < 99) qtyInput.value = val + 1;
            });

            addBtn.addEventListener('click', () => {
                const qty = parseInt(qtyInput.value, 10) || 1;
                if (global.FurnixCartEngine) {
                    global.FurnixCartEngine.addItem({ ...product, quantity: qty });
                } else if (typeof global.addToCart === 'function') {
                    for (let i = 0; i < qty; i++) global.addToCart(product);
                }
                this.closeModal();
            });
        }

        closeModal() {
            if (!this.activeModal) return;
            this.activeModal.remove();
            this.activeModal = null;
            document.body.style.overflow = '';
            if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
                this.previousFocus.focus();
            }
        }
    }

    global.FurnixProductModal = new ProductModal();
})(typeof window !== 'undefined' ? window : this);
