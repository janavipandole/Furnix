# 📚 Furnix Client JavaScript API Reference

This document provides developer documentation for all global JavaScript modules and utility classes available within the Furnix storefront repository.

---

## 🛒 1. CartCalculator (`scripts/cart-calculator.js`)

Pure calculation utility for order totals and promotional discount logic.

### Methods

#### `validatePromoCode(code: string): Object | null`
Validates input promo code string against available discount codes (`FURNIX10`, `NEON20`, `ECSOC2026`).

#### `calculateSummary(items: Array, promoCode?: string): Object`
Returns order summary breakdown including `subtotal`, `discountAmount`, `shippingFee`, `estimatedTax`, `grandTotal`, and `isFreeShipping`.

#### `formatCurrency(amount: number): string`
Formats a numeric value into standard USD currency string (`$1,500.00`).

---

## 🛍️ 2. FurnixCartEngine (`scripts/cart-engine.js`)

Stateful cart manager handling item persistence, quantity limits, and event notifications.

### Methods

#### `getCartItems(): Array`
Retrieves array of active cart items from `localStorage`.

#### `addItem(product: Object): void`
Adds or increments a product item in the shopping cart.

#### `updateQuantity(productId: string, delta: number): void`
Adjusts product item quantity within safe bounds (1-99).

#### `removeItem(productId: string): void`
Removes product item from cart and fires toast alert.

#### `applyPromo(code: string): Object`
Applies promo code to active session summary.

---

## 🔒 3. SecuritySanitizer (`scripts/security-sanitizer.js`)

Security utility providing input sanitization and password evaluation.

### Methods

#### `escapeHTML(str: string): string`
Escapes HTML special characters (`<`, `>`, `&`, `"`, `'`) to prevent XSS.

#### `sanitizeEmail(email: string): string`
Strips unsafe control characters and whitespace from email address strings.

#### `evaluatePasswordStrength(password: string): Object`
Evaluates password strength score (0-4) and returns color + label metadata.

---

## 🔍 4. FurnixSearchEngine (`scripts/search-engine.js`)

Client-side catalog indexer and search query matcher.

### Methods

#### `buildIndex(products: Array): void`
Indexes catalog product items for text matching.

#### `search(query: string): Array`
Performs term matching query and returns score-ranked result array.

#### `highlight(text: string, query: string): string`
Wraps matching keyword substrings in `<mark class="search-highlight">` tags.
