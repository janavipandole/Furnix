# Furnix Architecture & Developer Operations Guide

Welcome to the comprehensive architecture and developer guide for **Furnix**, a modern e-commerce storefront for furniture and interior design.

## 🏗 System Architecture

Furnix is designed as a high-performance, modular web storefront leveraging standard browser technologies alongside Node.js microservices.

```
Furnix Architecture Overview
┌────────────────────────────────────────────────────────┐
│                   Frontend Storefront                  │
│  (HTML5, CSS3 Custom Properties, Modular Vanilla JS)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Node.js Express Server               │
│  - Endpoint: /api/contact (Contact Form Submission)   │
│  - Endpoint: /api/subscribe (Newsletter Engine)       │
│  - Rate Limiting: 5 requests / 15 mins                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Client State Persistence               │
│  - Cart & Wishlist Storage (LocalStorage API)          │
│  - Cross-Tab Event Synchronization                     │
│  - Theme Mode State Management                         │
└────────────────────────────────────────────────────────┘
```

## 🚀 Key Modules & Services

### 1. Newsletter Subscription Engine (`scripts/newsletter-subscription-engine.js`)
- Performs real-time RFC 5322 client email validation.
- Submits payloads to `/api/subscribe`.
- Provides accessible `aria-live="polite"` user status notifications.

### 2. Catalog Filtering & Sorting (`scripts/catalog-product-filter-engine.js`)
- Dynamically filters items by category and price thresholds.
- Supports sorting by price (ascending/descending) and alphabetical order.
- Renders empty-state placeholders when filter queries yield zero matches.

### 3. Cart Cross-Tab Persistence (`scripts/cart-persistence-sync-engine.js`)
- Synchronizes cart items across multiple active browser windows via the `storage` event.
- Updates total item badge counts in navigation elements.

### 4. Theme System Engine (`scripts/theme-preference-persistence-engine.js`)
- Manages light/dark theme preference state.
- Listens to `(prefers-color-scheme)` media query changes.

## 💻 Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Babin123456/Furnix.git
   cd Furnix
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

## 🧪 Testing Guidelines

Execute module unit tests:
```bash
npm test
```

## 🛡 Security Practices

- Input sanitization on all client-side inputs.
- Strict rate limiting configured via `express-rate-limit`.
- Cross-Origin Resource Sharing (CORS) header configuration for secure multi-domain requests.
