/**
 * fix-nav-aria-hidden.js
 * 
 * WCAG 2.1 Accessibility Fix:
 * Resolves the issue where main navigation was permanently hidden from screen readers
 * due to a hardcoded `aria-hidden="true"` on the navList (#list).
 * 
 * Features:
 * - Dynamically manages aria-hidden based on viewport size and mobile menu state.
 * - Ensures aria-hidden="false" on desktop.
 * - Toggles aria-expanded on the hamburger menu button.
 * - Adds role="navigation" to the parent nav element if missing.
 * - Handles resize events to maintain correct state across breakpoints.
 */

document.addEventListener('DOMContentLoaded', () => {
    const navList = document.getElementById('list');
    const menuBtn = document.getElementById('menu');
    const closeBtn = document.getElementById('navClose');
    const navElement = document.querySelector('nav');
    
    // Desktop breakpoint (>= 992px)
    const desktopBreakpoint = 992;
    let isMenuOpen = false;
    
    if (!navList) {
        console.warn('Navigation list (#list) not found. Accessibility fix aborted.');
        return;
    }

    // 1. Add proper role to parent nav if missing
    if (navElement && !navElement.hasAttribute('role')) {
        navElement.setAttribute('role', 'navigation');
        navElement.setAttribute('aria-label', 'Main navigation');
    }

    // 2. Ensure buttons have accessible names if they don't
    if (menuBtn && !menuBtn.hasAttribute('aria-label')) {
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
    }
    if (closeBtn && !closeBtn.hasAttribute('aria-label')) {
        closeBtn.setAttribute('aria-label', 'Close navigation menu');
    }

    // 3. Centralized state updater
    const updateAriaStates = () => {
        const isDesktop = window.innerWidth >= desktopBreakpoint;
        
        if (isDesktop) {
            // Desktop: Navigation is always visible
            navList.setAttribute('aria-hidden', 'false');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
                // Optional: menuBtn.setAttribute('aria-hidden', 'true'); // Hide hamburger from SR on desktop
            }
        } else {
            // Mobile: Navigation visibility depends on menu state
            navList.setAttribute('aria-hidden', isMenuOpen ? 'false' : 'true');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
            }
        }
    };

    // 4. Remove the hardcoded aria-hidden completely, then apply correct initial state
    navList.removeAttribute('aria-hidden');
    updateAriaStates();

    // 5. Handle Menu Open (Hamburger Click)
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isDesktop = window.innerWidth >= desktopBreakpoint;
            if (!isDesktop) {
                isMenuOpen = true;
                updateAriaStates();
            }
        });
    }

    // 6. Handle Menu Close (Close Button Click)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const isDesktop = window.innerWidth >= desktopBreakpoint;
            if (!isDesktop) {
                isMenuOpen = false;
                updateAriaStates();
            }
        });
    }

    // 7. Handle Window Resize (Debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // If resizing to desktop, reset mobile menu state to closed
            if (window.innerWidth >= desktopBreakpoint) {
                isMenuOpen = false;
            }
            updateAriaStates();
        }, 100);
    });
});
