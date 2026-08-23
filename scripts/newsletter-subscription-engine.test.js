const { validateEmail } = require('./newsletter-subscription-engine.js');

describe('Newsletter Subscription Engine', () => {
  test('validates correct email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('john.doe@furnix.co.uk')).toBe(true);
  });

  test('rejects invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail(null)).toBe(false);
  });
});
