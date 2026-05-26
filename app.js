// --- SSoC Feature Code: Add to Cart Counter ---
let cartCount = 0;

// 1. Grab our new badge element from the DOM
const cartBadge = document.getElementById("cart-badge");

// 2. Select all of the click triggers (buttons/anchors)
const checkoutButtons = document.querySelectorAll('.btn, [class*="btn"], .hero-content a');

checkoutButtons.forEach((element) => {
    element.addEventListener('click', (event) => {
        event.preventDefault(); // Stop the page from reloading/jumping
        
        cartCount++; // Bump the product counter
        
        // 3. Update the visual badge number instantly!
        if (cartBadge) {
            cartBadge.innerText = cartCount;
        }
        
        console.log(`Successfully updated layout! Items in cart: ${cartCount}`);
    });
});
// Select hamburger button and navigation menu
const menuBtn = document.getElementById("menu");
const navList = document.getElementById("list");

if (menuBtn && navList) {
    // Toggle menu visibility and icon state on click
    menuBtn.addEventListener("click", (e) => {
        e.preventDefault();

        // Show/Hide navigation menu
        navList.classList.toggle("navList-active");

        // Switch between hamburger and close icon
        const icon = menuBtn.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
    });
}