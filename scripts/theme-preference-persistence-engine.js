/**
 * Theme Preference Persistence & Auto System Detection Engine for Furnix
 * Manages light/dark theme switching, OS media query sync, button aria-labels,
 * and flash-of-unstyled-content (FOUC) prevention.
 */

(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'furnix_theme';

  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || getSystemTheme();
    } catch (e) {
      return getSystemTheme();
    }
  };

  const applyTheme = (theme) => {
    const validTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', validTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch (e) {
      console.warn('Unable to save theme preference:', e);
    }

    updateThemeToggleUI(validTheme);
  };

  const updateThemeToggleUI = (theme) => {
    const toggleBtns = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
    toggleBtns.forEach((btn) => {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
    });
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };

  const initThemeEngine = () => {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle, [data-theme-toggle]');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeEngine);
  } else {
    initThemeEngine();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getSystemTheme, getSavedTheme, applyTheme, toggleTheme };
  }
})();
