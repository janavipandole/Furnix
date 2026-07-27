/**
 * Submissions Newsletter success message builder with dismissible UI & subscriber count
 */
class SubmissionsNewsletterSuccess {
    showSuccess(container, email, totalSubscribers = 1) {
        container.innerHTML = `
            <div class="newsletter-success-feedback" role="alert" aria-live="polite">
                <span class="success-icon">✓</span>
                <h4>Subscription Confirmed!</h4>
                <p>Welcome to ECSoC_2026. Subscribed: <strong>${email}</strong></p>
                <small class="sub-count">Joined ${totalSubscribers} existing subscriber(s).</small>
                <button id="newsletter-reset-btn" class="newsletter-reset-btn">Subscribe Another</button>
            </div>
        `;
    }
}
window.SubmissionsNewsletterSuccess = SubmissionsNewsletterSuccess;
