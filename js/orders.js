/* ============================================================
   GOLDEN PIZZA CAFE — ORDERS
   Renders order-confirmation.html and orders.html (My Orders).
   ============================================================ */

function buildWhatsAppOrderMessage(order) {
  const lines = [
    "GOLDEN PIZZA CAFE ORDER",
    "",
    `Order ID: ${order.order_id}`,
    `Customer Name: ${order.address?.name || ""}`,
    `Phone: ${order.address?.phone || ""}`,
    `Email: ${order.address?.email || ""}`,
    order.distance_km != null ? `Distance: ${order.distance_km} KM` : "Distance: To be confirmed",
    "",
    "Items:",
    ...(order.items || []).map((it) => `- ${it.name}${it.size ? " (" + it.size + ")" : ""} x${it.qty} = ${formatRupee(it.price * it.qty)}`),
    "",
    `Food Total: ${formatRupee(order.food_total)}`,
    `Delivery Charge: ${order.delivery_free ? "FREE" : formatRupee(order.delivery_charge || 0)}`,
    `Grand Total: ${formatRupee(order.grand_total)}`,
    `Payment Method: ${order.payment_method === "upi" ? "UPI" : "Cash on Delivery"}`,
    "",
    "Delivery Address:",
    `${order.address?.house || ""}, ${order.address?.street || ""}, ${order.address?.city || ""}`,
    order.address?.landmark ? `Landmark: ${order.address.landmark}` : ""
  ].filter(Boolean);
  return lines.join("\n");
}
window.buildWhatsAppOrderMessage = buildWhatsAppOrderMessage;

function renderOrderConfirmation() {
  const wrap = document.querySelector("[data-confirmation]");
  if (!wrap) return;

  let order = null;
  try {
    order = JSON.parse(sessionStorage.getItem("gpc_last_order"));
  } catch {}
  const params = new URLSearchParams(location.search);
  const wantedId = params.get("id");
  if (!order || (wantedId && order.order_id !== wantedId)) {
    wrap.innerHTML = `<div class="empty-state">
      <div class="ic">🧾</div>
      <h3 style="color:var(--cream);font-family:var(--font-display);text-transform:uppercase;margin-bottom:8px;">Order not found</h3>
      <p>We couldn't find that order in this session. Check <a href="orders.html" style="color:var(--gold)">My Orders</a> instead.</p>
    </div>`;
    return;
  }

  document.querySelector("[data-order-id]").textContent = order.order_id;
  const receiptRows = document.querySelector("[data-receipt-rows]");
  receiptRows.innerHTML = `
    ${(order.items || [])
      .map(
        (it) => `<div class="receipt-row"><span>${escapeHtml(it.name)}${it.size ? " (" + it.size + ")" : ""} × ${it.qty}</span><span>${formatRupee(it.price * it.qty)}</span></div>`
      )
      .join("")}
    <div class="receipt-row"><span>Food Total</span><span>${formatRupee(order.food_total)}</span></div>
    <div class="receipt-row"><span>Distance</span><span>${order.distance_km != null ? order.distance_km + " KM" : "To be confirmed"}</span></div>
    <div class="receipt-row"><span>Delivery Charge</span><span>${order.delivery_free ? "FREE" : formatRupee(order.delivery_charge || 0)}</span></div>
    <div class="receipt-row big"><span>Grand Total</span><span>${formatRupee(order.grand_total)}</span></div>
    <div class="receipt-row"><span>Payment Method</span><span>${order.payment_method === "upi" ? "UPI" : "Cash on Delivery"}</span></div>
    <div class="receipt-row"><span>Payment Status</span><span>${order.payment_status}</span></div>
    <div class="receipt-row"><span>Delivery Address</span><span style="text-align:right;max-width:60%;">${escapeHtml(order.address?.house || "")}, ${escapeHtml(order.address?.street || "")}, ${escapeHtml(order.address?.city || "")}</span></div>
  `;

  document.querySelector("[data-order-whatsapp]")?.addEventListener("click", () => {
    const msg = buildWhatsAppOrderMessage(order);
    window.open(`https://wa.me/${CONFIG.RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  });
}

async function renderMyOrders() {
  const list = document.querySelector("[data-orders-list]");
  if (!list) return;
  const orders = await DB.getMyOrders();
  if (!orders.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="ic">🧾</div>
      <h3 style="color:var(--cream);font-family:var(--font-display);text-transform:uppercase;margin-bottom:8px;">No orders yet</h3>
      <p>Once you place an order, it'll show up here.</p>
      <a href="menu.html" class="btn btn-primary" style="margin-top:16px;">Browse Menu</a>
    </div>`;
    return;
  }
  list.innerHTML = orders
    .map(
      (o) => `
    <div class="step-card">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;align-items:center;">
        <div>
          <div style="font-family:var(--font-mono);color:var(--gold);font-size:12px;">${o.order_id || o.id}</div>
          <div style="font-family:var(--font-display);font-size:18px;text-transform:none;margin-top:4px;">${formatRupee(o.grand_total)}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">${new Date(o.created_at).toLocaleString("en-IN")}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge ${o.payment_method === "cod" ? "badge-cod" : "badge-pending"}">${o.payment_method === "upi" ? "UPI" : "COD"}</span>
          <span class="badge badge-pending">${o.status || "Received"}</span>
        </div>
      </div>
      <hr class="ticket-divider" style="margin:14px 0;">
      <div style="font-size:13px;color:var(--text-muted);">
        ${(o.items || []).map((it) => `${escapeHtml(it.name)}${it.size ? " (" + it.size + ")" : ""} × ${it.qty}`).join(" · ")}
      </div>
    </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderConfirmation();
  renderMyOrders();
});
