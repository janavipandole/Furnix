/**
 * Furnix Image Zoom Portal Component
 * Handles high-resolution product image inspection with viewport boundary collision detection.
 */

(function(global) {
    'use strict';

    class ImageZoomPortal {
        constructor(containerSelector, portalSelector) {
            this.container = document.querySelector(containerSelector);
            this.portal = document.querySelector(portalSelector);
            this.initListeners();
        }

        initListeners() {
            if (!this.container || !this.portal) return;

            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                const portalRect = this.portal.getBoundingClientRect();

                // Raw calculated coordinates relative to viewport or container
                let targetLeft = e.clientX + 20; // offset from cursor
                let targetTop = e.clientY - (portalRect.height / 2);

                // Viewport boundary limits with padding
                const padding = 20;
                const maxAllowedLeft = window.innerWidth - portalRect.width - padding;
                const minAllowedLeft = padding;

                const maxAllowedTop = window.innerHeight - portalRect.height - padding;
                const minAllowedTop = padding;

                // Clamp coordinates to prevent off-screen rendering on ultra-wide monitors
                targetLeft = Math.max(minAllowedLeft, Math.min(targetLeft, maxAllowedLeft));
                targetTop = Math.max(minAllowedTop, Math.min(targetTop, maxAllowedTop));

                // Apply positioned styles
                this.portal.style.left = `${targetLeft}px`;
                this.portal.style.top = `${targetTop}px`;
                this.portal.style.display = 'block';
            });

            this.container.addEventListener('mouseleave', () => {
                this.portal.style.display = 'none';
            });
        }
    }

    global.FurnixImageZoomPortal = ImageZoomPortal;
})(typeof window !== 'undefined' ? window : this);
