/* ============================================================
   GOLDEN PIZZA CAFE — MENU PAGE LOGIC
   Renders category pills + product grid from MENU_DATA, wires
   up the search box and category filter (working together),
   pizza size selection, add-to-cart, and per-product WhatsApp
   ordering.
   ============================================================ */

let activeCategory = "all";
let searchTerm = "";
const sizeSelections = {}; // productId -> selected size key

function productMatchesSearch(p, term) {
  if (!term) return true;
  const hay = `${p.name} ${p.category} ${p.description}`.toLowerCase();
  return hay.includes(term.toLowerCase());
}

function getFilteredProducts() {
  return MENU_DATA.filter((p) => {
    const catOk = activeCategory === "all" || p.category === activeCategory;
    return catOk && productMatchesSearch(p, searchTerm);
  });
}

function renderCategoryPills() {
  const bar = document.querySelector("[data-category-bar]");
  if (!bar) return;
  bar.innerHTML = CATEGORIES.map(
    (c) => `<button class="pill ${c.id === activeCategory ? "active" : ""}" data-cat="${c.id}">${c.label}</button>`
  ).join("");
  bar.querySelectorAll(".pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.getAttribute("data-cat");
      renderCategoryPills();
      renderProducts();
      document.getElementById("menu-grid-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function sizeRowHtml(product) {
  if (!product.sizes) return "";
  const sel = sizeSelections[product.id] || "medium";
  return `<div class="size-row" data-size-row="${product.id}">
    ${["small", "medium", "large"]
      .map(
        (s) => `<button type="button" class="size-opt ${s === sel ? "active" : ""}" data-size="${s}" data-pid="${product.id}">
          <span class="lbl">${s}</span>${formatRupee(product.sizes[s])}
        </button>`
      )
      .join("")}
  </div>`;
}

function productCardHtml(p) {
  const sel = p.sizes ? sizeSelections[p.id] || "medium" : null;
  const displayPrice = p.sizes ? p.sizes[sel] : p.price;
  return `
  <div class="product-card" data-product-card="${p.id}">
    <div class="product-media">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
      <span class="veg-dot" title="Vegetarian"></span>
      ${p.featured ? `<span class="featured-tag">Chef's Pick</span>` : ""}
    </div>
    <div class="product-body">
      <div class="product-top">
        <div class="product-name">${escapeHtml(p.name)}</div>
      </div>
      <div class="product-cat">${CATEGORIES.find((c) => c.id === p.category)?.label || p.category}</div>
      <p class="product-desc">${escapeHtml(p.description)}</p>
      <hr class="ticket-divider">
      ${sizeRowHtml(p)}
      <div class="product-bottom">
        <div class="price-tag" data-price-display="${p.id}">${formatRupee(displayPrice)} ${p.sizes ? "<small>selected size</small>" : ""}</div>
        <div class="product-actions">
          <button class="icon-btn" title="Order on WhatsApp" onclick="whatsappOrderSingle('${p.id}')">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.35 4.95L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06a8.15 8.15 0 0 1-4.15-1.14l-.3-.18-3.14.82.84-3.06-.19-.32a8.13 8.13 0 0 1-1.25-4.27c0-4.5 3.66-8.16 8.17-8.16a8.1 8.1 0 0 1 5.78 2.4 8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.14-8.15 8.14zm4.47-6.1c-.24-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.8-.78.96-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.15.16-.24.24-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.65.3-.22.24-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.51.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z"/></svg>
          </button>
          <button class="add-btn" onclick="handleAddToCart('${p.id}')">Add</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderProducts() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  const items = getFilteredProducts();
  if (!items.length) {
    grid.innerHTML = `<div class="no-results">No dishes match your search — try a different word or category.</div>`;
    return;
  }
  grid.innerHTML = items.map(productCardHtml).join("");

  // Wire size selectors
  grid.querySelectorAll("[data-size-row] .size-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pid = btn.getAttribute("data-pid");
      const size = btn.getAttribute("data-size");
      sizeSelections[pid] = size;
      const product = MENU_DATA.find((p) => p.id === pid);
      btn.parentElement.querySelectorAll(".size-opt").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const priceEl = grid.querySelector(`[data-price-display="${pid}"]`);
      if (priceEl) priceEl.innerHTML = `${formatRupee(product.sizes[size])} <small>selected size</small>`;
    });
  });
}

function handleAddToCart(productId) {
  const product = MENU_DATA.find((p) => p.id === productId);
  if (!product) return;
  const size = product.sizes ? sizeSelections[productId] || "medium" : null;
  addToCart(product, size, 1);
}
window.handleAddToCart = handleAddToCart;

function whatsappOrderSingle(productId) {
  const product = MENU_DATA.find((p) => p.id === productId);
  if (!product) return;
  const size = product.sizes ? sizeSelections[productId] || "medium" : null;
  const price = size ? product.sizes[size] : product.price;
  const lines = [
    "GOLDEN PIZZA CAFE ORDER",
    "",
    `Item: ${product.name}${size ? " (" + size.charAt(0).toUpperCase() + size.slice(1) + ")" : ""}`,
    `Price: ${formatRupee(price)}`,
    "",
    "Please confirm my order."
  ];
  const url = `https://wa.me/${CONFIG.RESTAURANT.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");
}
window.whatsappOrderSingle = whatsappOrderSingle;

/* ---------------- Search wiring ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCategoryPills();
  renderProducts();

  const params = new URLSearchParams(location.search);
  if (params.get("category")) {
    activeCategory = params.get("category");
    renderCategoryPills();
    renderProducts();
  }

  document.querySelectorAll("[data-menu-search]").forEach((input) => {
    input.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderProducts();
    });
  });

  // Offers grid (static render from OFFERS_DATA, if present on page)
  const offerGrid = document.querySelector("[data-offer-grid]");
  if (offerGrid) {
    offerGrid.innerHTML = OFFERS_DATA.map(
      (o) => `<div class="offer-card">
        <span class="offer-tag">${o.tag}</span>
        <h3>${escapeHtml(o.title)}</h3>
        <p>${escapeHtml(o.description)}</p>
      </div>`
    ).join("");
  }
});
