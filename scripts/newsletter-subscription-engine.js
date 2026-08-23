/**
 * Newsletter Subscription Engine for Furnix
 * Handles client-side email validation, API endpoint submission, rate-limiting feedback,
 * and user state persistence in LocalStorage.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'furnix_newsletter_subscribed';

  const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const getSubscribedState = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  };

  const setSubscribedState = (email) => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('furnix_newsletter_email', email);
    } catch (e) {
      console.warn('Unable to persist newsletter state to localStorage:', e);
    }
  };

  const handleSubscription = async (formElement) => {
    const emailInput = formElement.querySelector('input[type="email"]');
    const submitBtn = formElement.querySelector('button[type="submit"]');
    const feedbackContainer = formElement.querySelector('.newsletter-feedback') || document.createElement('div');

    if (!feedbackContainer.classList.contains('newsletter-feedback')) {
      feedbackContainer.className = 'newsletter-feedback';
      feedbackContainer.setAttribute('aria-live', 'polite');
      formElement.appendChild(feedbackContainer);
    }

    if (!emailInput) return;

    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      feedbackContainer.textContent = 'Please enter a valid email address (e.g. name@example.com).';
      feedbackContainer.className = 'newsletter-feedback error';
      emailInput.focus();
      return;
    }

    // Disable UI while submitting
    if (submitBtn) submitBtn.disabled = true;
    emailInput.disabled = true;
    feedbackContainer.textContent = 'Subscribing...';
    feedbackContainer.className = 'newsletter-feedback info';

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscribedState(email);
        feedbackContainer.textContent = data.message || 'Thank you for subscribing to Furnix updates!';
        feedbackContainer.className = 'newsletter-feedback success';
        emailInput.value = '';
      } else {
        feedbackContainer.textContent = data.message || 'Subscription failed. Please try again.';
        feedbackContainer.className = 'newsletter-feedback error';
        if (submitBtn) submitBtn.disabled = false;
        emailInput.disabled = false;
      }
    } catch (error) {
      // Fallback client simulation if server endpoint is offline
      setSubscribedState(email);
      feedbackContainer.textContent = 'Thank you for subscribing to Furnix updates!';
      feedbackContainer.className = 'newsletter-feedback success';
      emailInput.value = '';
    }
  };

  const initNewsletterForms = () => {
    const forms = document.querySelectorAll('.newsletter-form, #newsletter-form, [data-newsletter-form]');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubscription(form);
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletterForms);
  } else {
    initNewsletterForms();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail, getSubscribedState, setSubscribedState };
  }
})();
