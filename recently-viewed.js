function getRecentlyViewed() {

    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];

    const container = document.getElementById("recentlyViewedContainer");

    if (!container) return;

    if (recent.length === 0) {

        container.innerHTML = "<p>No recently viewed products.</p>";

        return;
    }

    container.innerHTML = "";

    recent.reverse().forEach(product => {

        container.innerHTML += `
<div class="product-card">

    <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="product-info">

        <small>${product.category || "Furniture"}</small>

        <h6>${product.name}</h6>

        <p class="price">$${product.price}</p>

    </div>

</div>
`;

    });

}

document.addEventListener("DOMContentLoaded", getRecentlyViewed);