/**
 * Furnix Financing Micro-Calculator
 * Dynamically calculates and displays BNPL (Buy Now, Pay Later) installment pricing to reduce sticker shock.
 */

(function(global) {
    'use strict';

    class FinancingMicroCalculator {
        /**
         * @param {string} priceSelector - CSS selector for the main product price element
         * @param {string} containerSelector - CSS selector for where to inject the badge
         */
        constructor(priceSelector, containerSelector) {
            this.priceElement = document.querySelector(priceSelector);
            this.container = document.querySelector(containerSelector);
            
            // Financing Terms Configuration
            this.installments = 4;
            this.provider = 'Klarna';

            if (this.priceElement && this.container) {
                this.init();
            }
        }

        init() {
            // Create the badge container
            this.badge = document.createElement('div');
            this.badge.className = 'financing-micro-calculator mt-2 text-muted small';
            this.container.appendChild(this.badge);

            // Initial render
            this.updateBadge();

            // Observe the price element for variant changes
            const observer = new MutationObserver(() => this.updateBadge());
            observer.observe(this.priceElement, { 
                childList: true, 
                characterData: true, 
                subtree: true 
            });
        }

        parsePrice(text) {
            // Strip out currency symbols and commas to get the raw float
            const cleaned = text.replace(/[^0-9.]/g, '');
            return parseFloat(cleaned);
        }

        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(value);
        }

        updateBadge() {
            if (!this.priceElement) return;

            const rawText = this.priceElement.innerText || this.priceElement.textContent;
            const rawPrice = this.parsePrice(rawText);

            if (isNaN(rawPrice) || rawPrice <= 0) {
                this.badge.style.display = 'none';
                return;
            }

            const installmentAmount = rawPrice / this.installments;
            
            const formattedTotal = this.formatCurrency(rawPrice);
            const formattedInstallment = this.formatCurrency(installmentAmount);

            this.badge.style.display = 'block';
            this.badge.innerHTML = `
                <div class="d-inline-flex align-items-center bg-light border rounded px-3 py-2 mt-1">
                    <span class="me-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-dark"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    </span>
                    <span>
                        <strong>${formattedTotal}</strong> or ${this.installments} easy payments of <strong>${formattedInstallment}</strong> with <strong>${this.provider}</strong>.
                    </span>
                </div>
            `;
        }
    }

    global.FurnixFinancingCalculator = FinancingMicroCalculator;

    // Auto-initialize on product detail pages (assuming standard class names are present)
    document.addEventListener('DOMContentLoaded', () => {
        // Adjust selectors to match the PDP HTML structure
        new FinancingMicroCalculator('.product-price', '.price-container');
    });

})(typeof window !== 'undefined' ? window : this);
