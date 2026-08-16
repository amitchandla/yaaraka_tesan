/* ============================================================
   GOLDEN PIZZA CAFE — CART
   Cart is stored in localStorage so it survives across pages
   and reloads without needing a login. Each line item key is
   "<productId>::<size|regular>" so the same pizza in two sizes
   becomes two separate lines.
   ============================================================ */

const CART_KEY = "gpc_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartBadge();
  renderCartDrawer();
  renderStickyCartBar();
}

function addToCart(product, size, qty = 1) {
  const cart = getCart();
  const unitPrice = size ? product.sizes[size] : product.price;
  const sizeLabel = size ? size.charAt(0).toUpperCase() + size.slice(1) : null;
  const lineKey = `${product.id}::${size || "regular"}`;
  const existing = cart.find((l) => l.lineKey === lineKey);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      lineKey,
      productId: product.id,
      name: product.name,
      image: product.image,
      size: sizeLabel,
      price: unitPrice,
      qty
    });
  }
  saveCart(cart);
  showToast(`${product.name}${sizeLabel ? " (" + sizeLabel + ")" : ""} added to cart`);
}
window.addToCart = addToCart;

function removeFromCart(lineKey) {
  saveCart(getCart().filter((l) => l.lineKey !== lineKey));
}

function changeQty(lineKey, delta) {
  const cart = getCart();
  const line = cart.find((l) => l.lineKey === lineKey);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    removeFromCart(lineKey);
    return;
  }
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, l) => sum + l.qty * l.price, 0);
}
window.cartSubtotal = cartSubtotal;
window.getCart = getCart;
window.clearCart = () => saveCart([]);

/* ---------------- Rendering ---------------- */
function renderCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const count = cartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "grid" : "none";
  });
}

/* ---------------- Sticky bottom cart bar ----------------
   Appears site-wide (except checkout/confirmation, where the
   full bill is already on screen) whenever the cart has items.
   Tapping it opens the same cart drawer used by the nav icon. */
const STICKY_BAR_EXCLUDED_PAGES = ["checkout.html", "order-confirmation.html"];

function ensureStickyCartBar() {
  const page = location.pathname.split("/").pop() || "index.html";
  if (STICKY_BAR_EXCLUDED_PAGES.includes(page)) return null;
  let bar = document.querySelector("[data-sticky-cart]");
  if (bar) return bar;
  bar = document.createElement("button");
  bar.type = "button";
  bar.className = "sticky-cart-bar";
  bar.setAttribute("data-sticky-cart", "");
  bar.innerHTML = `
    <span class="sticky-cart-count"><span data-sticky-items>0</span> ITEM(S)</span>
    <span class="sticky-cart-total" data-sticky-total>₹0</span>
    <span class="sticky-cart-cta">VIEW CART →</span>
  `;
  bar.addEventListener("click", openCart);
  document.body.appendChild(bar);
  return bar;
}

function renderStickyCartBar() {
  const bar = ensureStickyCartBar();
  if (!bar) return;
  const count = cartCount();
  bar.querySelector("[data-sticky-items]").textContent = count;
  bar.querySelector("[data-sticky-total]").textContent = formatRupee(cartSubtotal());
  bar.classList.toggle("show", count > 0);
}

function renderCartDrawer() {
  const list = document.querySelector("[data-cart-items]");
  if (!list) return; // drawer not present on this page
  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = `<div class="cart-empty">
        <div style="font-size:32px;margin-bottom:10px;">🛒</div>
        Your cart is empty.<br>Browse the menu to add something delicious.
      </div>`;
  } else {
    list.innerHTML = cart
      .map(
        (l) => `
      <div class="cart-line">
        <img src="${l.image}" alt="${escapeHtml(l.name)}">
        <div>
          <div class="nm">${escapeHtml(l.name)}</div>
          <div class="meta">${l.size ? l.size + " · " : ""}${formatRupee(l.price)} each</div>
          <div class="qty-ctrl">
            <button onclick="changeQty('${l.lineKey}', -1)" aria-label="Decrease quantity">−</button>
            <span>${l.qty}</span>
            <button onclick="changeQty('${l.lineKey}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div>
          <div class="cart-price">${formatRupee(l.price * l.qty)}</div>
          <a class="remove-line" onclick="removeFromCart('${l.lineKey}')">Remove</a>
        </div>
      </div>`
      )
      .join("");
  }

  const subtotal = cartSubtotal();
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  if (subtotalEl) subtotalEl.textContent = formatRupee(subtotal);

  const checkoutBtn = document.querySelector("[data-cart-checkout]");
  if (checkoutBtn) {
    if (!cart.length) checkoutBtn.setAttribute("disabled", "disabled");
    else checkoutBtn.removeAttribute("disabled");
  }
}
window.renderCartDrawer = renderCartDrawer;

function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("open");
  document.querySelector("[data-overlay]")?.classList.add("open");
}
function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("open");
  document.querySelector("[data-overlay]")?.classList.remove("open");
}
window.openCart = openCart;
window.closeCart = closeCart;

document.addEventListener("DOMContentLoaded", () => {
  renderCartBadge();
  renderCartDrawer();
  renderStickyCartBar();
  document.querySelectorAll("[data-cart-open]").forEach((btn) =>
    btn.addEventListener("click", openCart)
  );
  document.querySelectorAll("[data-cart-close], [data-overlay]").forEach((btn) =>
    btn.addEventListener("click", closeCart)
  );
});
