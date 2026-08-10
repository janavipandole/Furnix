/**
 * @file back-to-top.js
 * @description Accessible back-to-top button using Intersection Observer for performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create the sentinel element to observe when user has scrolled down
  const sentinel = document.createElement('div');
  sentinel.id = 'furnix-top-sentinel';
  sentinel.style.position = 'absolute';
  sentinel.style.top = '500px'; // Appear after scrolling 500px
  sentinel.style.width = '1px';
  sentinel.style.height = '1px';
  sentinel.style.visibility = 'hidden';
  document.body.appendChild(sentinel);

  // Create the button
  const bttBtn = document.createElement('button');
  bttBtn.id = 'furnix-btt-btn';
  bttBtn.className = 'furnix-btt-btn';
  bttBtn.setAttribute('aria-label', 'Scroll to top');
  bttBtn.setAttribute('role', 'button');
  
  // Create SVG icon for better self-containment/performance over font-awesome if needed, 
  // but keeping class for FA just in case, or using a simple inline SVG.
  bttBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" aria-hidden="true" focusable="false">
      <!-- Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2023 Fonticons, Inc. -->
      <path fill="currentColor" d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
    </svg>
  `;
  document.body.appendChild(bttBtn);

  // Scroll to top on click or keyboard activation
  const scrollToTop = (e) => {
    e.preventDefault();
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  bttBtn.addEventListener('click', scrollToTop);
  
  // Setup Intersection Observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      // If sentinel is intersecting (visible), we are at top, hide button
      // If sentinel is NOT intersecting (scrolled past), show button
      if (!entries[0].isIntersecting && window.scrollY > 100) {
        bttBtn.classList.add('visible');
      } else {
        bttBtn.classList.remove('visible');
      }
    });
    
    observer.observe(sentinel);
  } else {
    // Fallback for older browsers
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        bttBtn.classList.add('visible');
      } else {
        bttBtn.classList.remove('visible');
      }
    }, { passive: true });
  }
});
