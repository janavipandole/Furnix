/**
 * Furnix Auth Session Manager
 * Consolidates user login, registration, session persistence, and security controls into a single module.
 */

(function(global) {
    'use strict';

    const USER_SESSION_KEY = 'furnix_active_user';

    class AuthManager {
        constructor() {
            this.sanitizer = global.SecuritySanitizer || null;
            this.init();
        }

        init() {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindLoginForm();
                this.bindSignupForm();
                this.bindAccountPage();
            });
        }

        getCurrentUser() {
            try {
                const data = localStorage.getItem(USER_SESSION_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        }

        setCurrentUser(user) {
            try {
                if (user) {
                    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
                } else {
                    localStorage.removeItem(USER_SESSION_KEY);
                }
            } catch (e) {
                console.error('AuthManager: Error saving user session:', e);
            }
        }

        logout() {
            this.setCurrentUser(null);
            if (global.showToast) global.showToast('You have been logged out.', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 800);
        }

        bindLoginForm() {
            const form = document.getElementById('loginForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                let email = emailInput ? emailInput.value.trim() : '';
                let password = passwordInput ? passwordInput.value : '';

                if (this.sanitizer) {
                    email = this.sanitizer.sanitizeEmail(email);
                }

                if (!email || !password) {
                    if (global.showToast) global.showToast('Please enter both email and password.', 'error');
                    return;
                }

                const user = { email, name: email.split('@')[0], loggedInAt: new Date().toISOString() };
                this.setCurrentUser(user);

                if (global.showToast) global.showToast('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            });
        }

        bindSignupForm() {
            const form = document.getElementById('signupForm');
            const passwordInput = document.getElementById('signupPassword');
            const strengthBar = document.getElementById('passwordStrengthBar');
            const strengthText = document.getElementById('passwordStrengthText');

            if (passwordInput && strengthBar && this.sanitizer) {
                passwordInput.addEventListener('input', () => {
                    const val = passwordInput.value;
                    const res = this.sanitizer.evaluatePasswordStrength(val);
                    strengthBar.style.width = `${(res.score + 1) * 20}%`;
                    strengthBar.style.backgroundColor = res.color;
                    if (strengthText) strengthText.textContent = `Strength: ${res.label}`;
                });
            }

            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('signupName');
                const emailInput = document.getElementById('signupEmail');
                const passwordVal = passwordInput ? passwordInput.value : '';
                
                let name = nameInput ? nameInput.value.trim() : '';
                let email = emailInput ? emailInput.value.trim() : '';

                if (this.sanitizer) {
                    name = this.sanitizer.escapeHTML(name);
                    email = this.sanitizer.sanitizeEmail(email);
                }

                if (!name || !email || !passwordVal) {
                    if (global.showToast) global.showToast('Please fill out all required fields.', 'error');
                    return;
                }

                const user = { name, email, loggedInAt: new Date().toISOString() };
                this.setCurrentUser(user);

                if (global.showToast) global.showToast('Account created successfully! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1000);
            });
        }

        bindAccountPage() {
            const userNameEl = document.getElementById('accountUserName');
            const userEmailEl = document.getElementById('accountUserEmail');
            const logoutBtn = document.getElementById('accountLogoutBtn');

            const user = this.getCurrentUser();
            if (user) {
                if (userNameEl) userNameEl.textContent = user.name || 'Valued Customer';
                if (userEmailEl) userEmailEl.textContent = user.email || '';
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            }
        }
    }

    global.FurnixAuthManager = new AuthManager();
})(typeof window !== 'undefined' ? window : this);
