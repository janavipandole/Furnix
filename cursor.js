(function () {
  // Skip entirely on touch devices or when the user prefers reduced motion
  var isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';

    var cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.classList.add('has-custom-cursor');

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smoothly animate the outer ring so it "catches up" to the dot
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Add a "hover" state on interactive elements
    var hoverTargets = 'a, button, input, textarea, select, .btn, .icon, .product-card, .category-card, img, .theme-toggle';

    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('custom-cursor-ring--hover');
        cursorDot.classList.add('custom-cursor-dot--hover');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('custom-cursor-ring--hover');
        cursorDot.classList.remove('custom-cursor-dot--hover');
      });
    });

    // Hide the cursor when it leaves the window, show it again when it re-enters
    document.addEventListener('mouseleave', function () {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  });
})();