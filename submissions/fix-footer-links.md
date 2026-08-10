# PR #3: Fix Footer Link Inconsistencies + URL Case Bug

## Problem Description
The footer `Collections` section is inconsistent across the site.
- Correct pages: `seating.html`, `Lighting.html`, `tables.html`, `accessories.html` link correctly to category pages.
- Incorrect pages: Most pages (e.g., `index.html`, `about.html`, `faq.html`, `contact.html`, `cart.html`, etc.) incorrectly link all collection items to `furniture.html`.
- Bug: `trends.html` has a case-sensitivity issue where it links to `lighting.html` instead of the correctly cased `Lighting.html`, causing a 404 error on case-sensitive hosting environments.

## Affected Pages
The following files need to be updated with the standardized footer HTML:
- `index.html`
- `about.html`
- `contact.html`
- `faq.html`
- `journal.html`
- `trends.html` (has the case sensitivity bug)
- `cart.html`
- `wishlist.html`
- `checkout.html`
- `product-details.html`

## Corrections

### Current (Broken) Links on Most Pages
```html
<ul>
    <li><a href="furniture.html">Seating</a></li>
    <li><a href="furniture.html">Lighting</a></li>
    <li><a href="furniture.html">Tables</a></li>
    <li><a href="furniture.html">Accessories</a></li>
</ul>
```

### Current (Broken) Links on `trends.html`
```html
<ul>
    <li><a href="seating.html">Seating</a></li>
    <li><a href="lighting.html">Lighting</a></li> <!-- 404 bug here -->
    <li><a href="tables.html">Tables</a></li>
    <li><a href="accessories.html">Accessories</a></li>
</ul>
```

### Corrected Standard Links (To Apply Everywhere)
```html
<ul>
    <li><a href="seating.html">Seating</a></li>
    <li><a href="Lighting.html">Lighting</a></li> <!-- Note capital L -->
    <li><a href="tables.html">Tables</a></li>
    <li><a href="accessories.html">Accessories</a></li>
</ul>
```

## Solution Provided
Included in this PR is `fix-footer-links-template.html`, which contains the fully standardized HTML structure for the Furnix footer. Copy the inner HTML of the `<footer>` element to replace the broken footers on all affected pages.
