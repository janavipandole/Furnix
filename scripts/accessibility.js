// Accessibility helper script for navigation, modals, keyboard traps, and dynamic ARIA attributes
document.addEventListener("DOMContentLoaded", () => {
    // Skip link handling
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
        skipLink.addEventListener("click", (e) => {
            const targetId = skipLink.getAttribute("href").replace("#", "");
            const targetEl = document.getElementById(targetId) || document.querySelector("main");
            if (targetEl) {
                targetEl.tabIndex = -1;
                targetEl.focus();
            }
        });
    }

    // Modal trap focus helper
    window.trapFocusInModal = function(modalElement) {
        if (!modalElement) return;
        const focusableSelectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
        const focusableEls = modalElement.querySelectorAll(focusableSelectors);
        if (focusableEls.length === 0) return;

        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];

        firstFocusableEl.focus();

        modalElement.addEventListener("keydown", function(e) {
            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    };
});
