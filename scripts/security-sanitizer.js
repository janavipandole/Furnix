/**
 * Furnix Security & Input Sanitizer Utility
 * Sanitizes user inputs, prevents cross-site scripting (XSS), and provides security validation rules.
 */

(function(global) {
    'use strict';

    const SecuritySanitizer = {
        /**
         * Escapes special HTML characters in a string to prevent XSS injection.
         * @param {string} str 
         * @returns {string}
         */
        escapeHTML(str) {
            if (typeof str !== 'string') return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        /**
         * Sanitizes email inputs by stripping invalid control characters and whitespace.
         * @param {string} email 
         * @returns {string}
         */
        sanitizeEmail(email) {
            if (typeof email !== 'string') return '';
            return email.trim().toLowerCase().replace(/[^\w.@+-]/g, '');
        },

        /**
         * Evaluates password strength and returns a score (0 to 4) with feedback message.
         * @param {string} password 
         * @returns {{score: number, label: string, color: string}}
         */
        evaluatePasswordStrength(password) {
            if (!password || typeof password !== 'string') {
                return { score: 0, label: 'Empty', color: '#e0e0e0' };
            }

            let score = 0;
            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;

            const levels = [
                { score: 0, label: 'Very Weak', color: '#d32f2f' },
                { score: 1, label: 'Weak', color: '#f57c00' },
                { score: 2, label: 'Fair', color: '#fbc02d' },
                { score: 3, label: 'Good', color: '#388e3c' },
                { score: 4, label: 'Strong', color: '#2e7d32' }
            ];

            return levels[score] || levels[0];
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SecuritySanitizer;
    } else {
        global.SecuritySanitizer = SecuritySanitizer;
    }
})(typeof window !== 'undefined' ? window : this);
