# Security Policy

## Supported Versions

Furnix is a static furniture showcase website with a small Node.js/Express server (`server.js`) and Firebase integration on the client side. Security fixes are applied to the latest version of the `main` branch only.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |

Older commits, tags, or forks are not supported — please update to the latest `main` before reporting an issue that may already be fixed.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately using one of these channels:

1. **GitHub Private Vulnerability Reporting (preferred)**  
   Use the [private vulnerability reporting](https://github.com/janavipandole/Furnix/security/advisories/new) feature on this repository. This keeps the report confidential until a fix is ready.

2. **Email**  
   Send details to **janavipandole@gmail.com** with the subject line starting with `[Furnix Security]`.

When reporting, please include as much of the following as you can:

- A description of the vulnerability and its potential impact
- Step-by-step instructions or a proof-of-concept to reproduce it
- Affected files, endpoints, or pages
- Any relevant logs, screenshots, or error messages
- Your assessment of severity (optional)

## Responsible Disclosure Process

1. You submit a report through one of the channels above.
2. We acknowledge your report within **72 hours**.
3. We investigate and assess the issue, keeping you updated on our progress.
4. Once a fix is prepared, we coordinate a disclosure date with you — we ask that you keep the issue confidential until then.
5. After the fix ships to `main`, we publicly credit you for the finding (unless you prefer to remain anonymous).

## Response Timelines

| Stage                  | Target            |
| ---------------------- | ----------------- |
| Acknowledgement        | Within 72 hours   |
| Initial assessment     | Within 7 days     |
| Fix / mitigation       | Within 30 days for high-severity issues; best-effort otherwise |

## Scope

The following are in scope:

- The static site files (HTML/CSS/JS) served from this repository
- `server.js` and anything it serves or proxies
- Client-side authentication flows (`auth.js`, `firebase-config.js`)
- Docker/Vercel deployment configuration

Out of scope:

- Vulnerabilities in third-party dependencies — please report those upstream, though you're welcome to open a non-security issue pointing them out
- Social engineering, phishing, or physical attacks
- Automated scanner output without a demonstrated, reproducible impact

## Safe Harbor

We consider security research conducted in good faith and in accordance with this policy to be authorized. We will not pursue legal action against anyone who:

- Reports vulnerabilities responsibly through the channels above
- Avoids accessing, modifying, or destroying data that isn't theirs
- Avoids service degradation, denial of service, or spam
- Gives us reasonable time to fix the issue before public disclosure

Thank you for helping keep Furnix and its users safe! 🛡️
