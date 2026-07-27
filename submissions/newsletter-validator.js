/**
 * Submissions Newsletter validation helper with domain blocklist & strict RFC checks
 */
class SubmissionsNewsletterValidator {
    constructor() {
        this.disallowedDomains = ["mailinator.com", "tempmail.com", "10minutemail.com", "trashmail.com"];
    }

    validate(email) {
        if (!email || typeof email !== "string") {
            return { valid: false, reason: "Email address is required." };
        }
        
        const cleanEmail = email.trim();
        const rfcRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        
        if (!rfcRegex.test(cleanEmail)) {
            return { valid: false, reason: "Please enter a valid email address." };
        }

        const domain = cleanEmail.split("@")[1].toLowerCase();
        if (this.disallowedDomains.includes(domain)) {
            return { valid: false, reason: "Disposable email addresses are not permitted." };
        }

        return { valid: true, reason: "" };
    }
}
window.SubmissionsNewsletterValidator = SubmissionsNewsletterValidator;
