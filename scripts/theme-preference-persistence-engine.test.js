const { getSavedTheme, getSystemTheme } = require('./theme-preference-persistence-engine.js');

describe('Theme Preference Persistence Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('fallback to system theme if localStorage is empty', () => {
    expect(getSavedTheme()).toBe('light');
  });

  test('retrieves stored theme from localStorage', () => {
    localStorage.setItem('furnix_theme', 'dark');
    expect(getSavedTheme()).toBe('dark');
  });
});
