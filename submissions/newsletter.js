/**
 * Submissions Newsletter controller script with live inline error messaging
 */
document.addEventListener("DOMContentLoaded", () => {
    const validator = new window.SubmissionsNewsletterValidator();
    const feedback = new window.SubmissionsNewsletterSuccess();
    const analytics = new window.SubmissionsNewsletterAnalytics ? new window.SubmissionsNewsletterAnalytics() : null;
    const container = document.getElementById("newsletter-form-container");

    function renderForm() {
        if (!container) return;
        container.innerHTML = `
            <div id="newsletter-form-inner" class="newsletter-form-group">
                <label for="news-email-field" class="sr-only">Email Address</label>
                <div class="input-wrapper">
                    <input type="email" id="news-email-field" class="newsletter-input" placeholder="Enter your email address" aria-describedby="news-error-msg">
                    <button id="news-subscribe-btn" class="newsletter-submit-btn">Subscribe</button>
                </div>
                <div id="news-error-msg" class="newsletter-error-msg" aria-live="assertive"></div>
            </div>
        `;

        const inputField = document.getElementById("news-email-field");
        const submitBtn = document.getElementById("news-subscribe-btn");
        const errorMsg = document.getElementById("news-error-msg");

        const handleSubscribe = () => {
            const val = inputField.value;
            const res = validator.validate(val);
            if (res.valid) {
                errorMsg.textContent = "";
                inputField.classList.remove("invalid");
                if (analytics) analytics.recordSubscription(val.trim());
                const count = analytics ? analytics.getSubscriptionCount() : 1;
                feedback.showSuccess(container, val.trim(), count);
                const resetBtn = document.getElementById("newsletter-reset-btn");
                if (resetBtn) resetBtn.addEventListener("click", renderForm);
            } else {
                errorMsg.textContent = res.reason;
                inputField.classList.add("invalid");
                inputField.focus();
            }
        };

        submitBtn.addEventListener("click", handleSubscribe);
        inputField.addEventListener("keydown", (e) => {
            if (e.key === "Enter") handleSubscribe();
        });
        inputField.addEventListener("input", () => {
            if (inputField.classList.contains("invalid")) {
                errorMsg.textContent = "";
                inputField.classList.remove("invalid");
            }
        });
    }

    renderForm();
});
