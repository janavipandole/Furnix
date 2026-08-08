(function() {
    window.FurnixCookieConsent = {
        version: "1.0",
        storageKey: "furnix_cookie_consent",
        categories: {
            necessary: { title: "Strictly Necessary", required: true, description: "Essential cookies for the site to function properly." },
            analytics: { title: "Analytics", required: false, description: "Help us improve by tracking anonymous usage data." },
            marketing: { title: "Marketing", required: false, description: "Used for targeted advertising and promotions." }
        },
        defaultConsent: { necessary: true, analytics: false, marketing: false },
        
        init() {
            this.state = this.getStoredConsent();
            if (!this.state || this.state.version !== this.version) {
                this.showBanner();
            }
        },
        
        getStoredConsent() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                return stored ? JSON.parse(stored) : null;
            } catch (e) {
                return null;
            }
        },
        
        saveConsent(consent) {
            consent.version = this.version;
            consent.timestamp = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(consent));
            this.state = consent;
            this.hideBanner();
        },
        
        getConsent(category) {
            return this.state ? !!this.state[category] : false;
        },
        
        showBanner() {
            this.banner = document.createElement('div');
            this.banner.className = 'cookie-consent-banner';
            this.banner.innerHTML = `
                <div class="cookie-consent-content">
                    <h3>We use cookies</h3>
                    <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                </div>
                <div class="cookie-consent-actions">
                    <button id="cookie-accept-all" class="btn cookie-btn primary">Accept All</button>
                    <button id="cookie-reject-all" class="btn cookie-btn secondary">Reject All</button>
                    <button id="cookie-customize" class="btn cookie-btn outline">Customize</button>
                </div>
            `;
            document.body.appendChild(this.banner);
            
            document.getElementById('cookie-accept-all').addEventListener('click', () => {
                this.saveConsent({ necessary: true, analytics: true, marketing: true });
            });
            document.getElementById('cookie-reject-all').addEventListener('click', () => {
                this.saveConsent({ necessary: true, analytics: false, marketing: false });
            });
            document.getElementById('cookie-customize').addEventListener('click', () => {
                this.showPreferences();
            });
        },
        
        hideBanner() {
            if (this.banner) {
                this.banner.classList.add('hiding');
                setTimeout(() => this.banner.remove(), 300);
            }
        },
        
        showPreferences() {
            if (this.banner) this.banner.style.display = 'none';
            
            this.prefModal = document.createElement('div');
            this.prefModal.className = 'cookie-pref-modal';
            
            let html = `
                <div class="cookie-pref-content">
                    <h2>Cookie Preferences</h2>
                    <p>Manage your cookie preferences below.</p>
                    <div class="cookie-categories">
            `;
            
            for (const [key, details] of Object.entries(this.categories)) {
                const isChecked = this.state ? this.state[key] : (details.required || false);
                html += `
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>${details.title}</h4>
                                <label class="cookie-toggle ${details.required ? 'disabled' : ''}">
                                    <input type="checkbox" id="cookie-toggle-${key}" ${isChecked ? 'checked' : ''} ${details.required ? 'disabled' : ''}>
                                    <span class="cookie-slider"></span>
                                </label>
                            </div>
                            <p>${details.description}</p>
                        </div>
                `;
            }
            
            html += `
                    </div>
                    <div class="cookie-pref-actions">
                        <button id="cookie-save-prefs" class="btn cookie-btn primary">Save Preferences</button>
                    </div>
                </div>
            `;
            
            this.prefModal.innerHTML = html;
            document.body.appendChild(this.prefModal);
            
            document.getElementById('cookie-save-prefs').addEventListener('click', () => {
                const analytics = document.getElementById('cookie-toggle-analytics').checked;
                const marketing = document.getElementById('cookie-toggle-marketing').checked;
                this.saveConsent({ necessary: true, analytics, marketing });
                this.prefModal.remove();
            });
        }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        window.FurnixCookieConsent.init();
    });
})();
