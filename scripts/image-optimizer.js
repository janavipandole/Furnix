/**
 * Submissions Image Optimization & Low Quality Image Placeholder (LQIP) Observer
 */
class SubmissionsImageOptimizer {
    constructor() {
        this.svgPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23222222'/%3E%3C/svg%3E";
    }

    init() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (!img.getAttribute("src") || img.getAttribute("src") === "") {
                img.setAttribute("src", this.svgPlaceholder);
            }

            img.addEventListener("error", () => {
                img.src = this.svgPlaceholder;
                img.alt = (img.alt || "Image") + " (Failed to load)";
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const optimizer = new SubmissionsImageOptimizer();
    optimizer.init();
});
