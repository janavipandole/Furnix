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

---

## 💱 5. CurrencyConverter (`scripts/currency-converter.js`)

Multi-currency exchange rate calculation and DOM price updater.

### Methods

#### `convertPrice(baseUsdAmount: number, targetCurrency: string): number`
Converts USD base price to target currency (USD, EUR, GBP, INR, JPY).

#### `formatPrice(baseUsdAmount: number, targetCurrency: string): string`
Formats converted price with matching currency symbol (`$100.00`, `€92.00`, `₹8350.00`).

---

## ⭐ 6. ProductReviewEngine (`scripts/review-engine.js`)

Manages customer star ratings, comments, and review statistics.

### Methods

#### `getAverageRating(productId: string): Object`
Returns `{ average: number, count: number }` for specified product ID.

#### `addProductReview(productId: string, author: string, rating: number, comment: string): Object|false`
Submits validated review entry and persists state in `localStorage`.

---

## 🚚 7. OrderTrackerEngine (`scripts/order-tracker.js`)

Manages purchase histories and shipment progress timelines.

### Methods

#### `recordNewOrder(orderData: Object): Object|false`
Saves new purchase order to customer history with tracking number.

#### `findOrderById(query: string): Object|null`
Searches order history by Order ID or tracking number string.

---

## 🎟️ 8. CouponEngine (`scripts/coupon-engine.js`)

Validates promo discount codes and minimum spend rules.

### Methods

#### `validateCoupon(code: string, subtotal: number): Object`
Verifies voucher code eligibility against minimum order spend requirements.

#### `calculateDiscount(code: string, subtotal: number): number`
Calculates exact dollar discount savings for active coupon.

---

## 🛡️ 9. WarrantyProtectionPlanEngine (`scripts/warranty-protection-plan-engine.js`)

Calculates tiered extended warranties and care protection plans with accidental damage coverage and category risk multipliers.

### Methods

#### `calculatePlanCost(itemPrice?: number, category?: string, planId?: string): Object`
Calculates specific warranty plan cost, accidental damage terms, and aggregate product total.

#### `getAvailablePlans(itemPrice?: number, category?: string): Array<Object>`
Returns all supported plan options (1-Year, 2-Year, 3-Year, 5-Year) for a given catalog item.

---

## 📦 10. BulkTierDiscountEngine (`scripts/bulk-tier-discount-engine.js`)

Dynamically computes quantity tier volume discounts, wholesale savings, and trade partner bonuses for interior designers, architects, and corporate bulk buyers.

### Methods

#### `calculateBulkPricing(unitPrice: number, quantity: number, accountType?: string): Object`
Calculates volume tiered discount percentage, discounted unit price, total savings, and upsell metrics for the next volume tier.

#### `getTierForQuantity(quantity: number): Object`
Returns active quantity bracket tier configuration (Studio Pack, Designer Suite, Commercial Project, Enterprise Wholesale).

#### `getTierTable(unitPrice: number): Array<Object>`
Generates structured pricing tier table for catalog product pages with per-unit savings.

