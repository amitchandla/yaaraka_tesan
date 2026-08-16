/* ============================================================
   GOLDEN PIZZA CAFE — CHECKOUT
   ============================================================ */

let checkoutState = {
  coords: null, // { lat, lng } once permission granted
  distance: null,
  delivery: 0,
  free: true,
  locationConfirmed: false,
  paymentMethod: null,
  settings: null
};

const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function initCheckout() {
  const cart = getCart();
  const emptyMsg = document.querySelector("[data-checkout-empty]");
  const form = document.querySelector("[data-checkout-form]");
  if (!cart.length) {
    if (emptyMsg) emptyMsg.style.display = "block";
    if (form) form.style.display = "none";
    return;
  }

  checkoutState.settings = await DB.getSettings();
  renderOrderSummary();

  document.querySelector("[data-use-location]")?.addEventListener("click", handleUseLocation);
  document.querySelector("[data-checkout-submit]")?.addEventListener("click", handleSubmitOrder);

  document.querySelectorAll("[data-payment-opt]").forEach((opt) => {
    opt.addEventListener("click", () => {
      document.querySelectorAll("[data-payment-opt]").forEach((o) => o.classList.remove("active"));
      opt.classList.add("active");
      checkoutState.paymentMethod = opt.getAttribute("data-payment-opt");
      const upiBox = document.querySelector("[data-upi-box]");
      if (upiBox) upiBox.classList.toggle("show", checkoutState.paymentMethod === "upi");
      renderOrderSummary();
    });
  });

  document.querySelector("[data-copy-upi]")?.addEventListener("click", () => {
    navigator.clipboard.writeText(CONFIG.RESTAURANT.upiId).then(() => showToast("UPI ID copied"));
  });
}

async function handleUseLocation() {
  const statusEl = document.querySelector("[data-location-status]");
  const btn = document.querySelector("[data-use-location]");
  btn.setAttribute("disabled", "disabled");
  btn.textContent = "Detecting…";
  try {
    const coords = await requestCurrentLocation();
    checkoutState.coords = coords;
    const restLat = checkoutState.settings.restaurant_lat ?? CONFIG.RESTAURANT_LOCATION.lat;
    const restLng = checkoutState.settings.restaurant_lng ?? CONFIG.RESTAURANT_LOCATION.lng;
    const distKm = haversineDistanceKm(restLat, restLng, coords.lat, coords.lng);
    const result = calculateDelivery(distKm, checkoutState.settings);
    checkoutState.distance = result.distance;
    checkoutState.delivery = result.charge;
    checkoutState.free = result.free;
    checkoutState.locationConfirmed = true;

    const box = document.querySelector("[data-distance-box]");
    if (box) {
      box.style.display = "flex";
      box.querySelector("[data-distance-val]").textContent = `${result.distance} KM`;
      const chargeVal = box.querySelector("[data-delivery-val]");
      chargeVal.innerHTML = result.free
        ? `<span class="badge badge-free">FREE</span>`
        : formatRupee(result.charge);
    }
    if (statusEl) {
      statusEl.innerHTML = `<span class="badge badge-free">Location detected</span>`;
    }
    showToast("Location detected — delivery charge calculated");
  } catch (msg) {
    checkoutState.locationConfirmed = false;
    if (statusEl) {
      statusEl.innerHTML = `<span class="badge badge-pending">Permission not granted</span>`;
    }
    showToast(typeof msg === "string" ? msg : "Could not access location");
    document.querySelector("[data-manual-note]")?.classList.remove("hidden-note");
  } finally {
    btn.removeAttribute("disabled");
    btn.textContent = "Use My Current Location";
    renderOrderSummary();
  }
}

function renderOrderSummary() {
  const subtotal = cartSubtotal();
  const sub = document.querySelector("[data-summary-subtotal]");
  if (sub) sub.textContent = formatRupee(subtotal);

  const delEl = document.querySelector("[data-summary-delivery]");
  if (delEl) {
    if (!checkoutState.locationConfirmed) {
      delEl.innerHTML = `<span class="badge badge-pending">To be confirmed</span>`;
    } else if (checkoutState.free) {
      delEl.innerHTML = `<span class="badge badge-free">FREE</span>`;
    } else {
      delEl.textContent = formatRupee(checkoutState.delivery);
    }
  }

  const grand = subtotal + (checkoutState.locationConfirmed ? checkoutState.delivery : 0);
  const grandEl = document.querySelector("[data-summary-grand]");
  if (grandEl) grandEl.textContent = formatRupee(grand);

  const upiAmountEls = document.querySelectorAll("[data-upi-amount]");
  upiAmountEls.forEach((el) => (el.textContent = formatRupee(grand)));
}

/** Strips a leading +91 / 91 / 0 country/trunk prefix so users can type
 *  either "9812345670" or "+91 9812345670" and both validate correctly. */
function normalizePhone(raw) {
  return raw.trim().replace(/[\s-]/g, "").replace(/^(\+?91)/, "").replace(/^0/, "");
}

function validateForm() {
  let valid = true;
  const required = ["name", "phone", "email", "house", "street", "city"];
  required.forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    const errEl = document.querySelector(`[data-error="${field}"]`);
    if (!input) return;
    const ok = input.value.trim().length > 0;
    if (errEl) errEl.classList.toggle("show", !ok);
    if (!ok) valid = false;
  });

  const nameInput = document.querySelector('[name="name"]');
  const nameErr = document.querySelector('[data-error="name"]');
  if (nameInput && nameInput.value.trim()) {
    const nameVal = nameInput.value.trim();
    const nameOk = nameVal.length >= 2 && !/^\d+$/.test(nameVal);
    if (nameErr) {
      nameErr.textContent = nameOk ? "Name is required" : "Enter a valid name (not just numbers)";
      nameErr.classList.toggle("show", !nameOk);
    }
    if (!nameOk) valid = false;
  }

  const phoneInput = document.querySelector('[name="phone"]');
  const phoneErr = document.querySelector('[data-error="phone-format"]');
  if (phoneInput && phoneInput.value.trim()) {
    const phoneOk = PHONE_REGEX.test(normalizePhone(phoneInput.value));
    if (phoneErr) phoneErr.classList.toggle("show", !phoneOk);
    if (!phoneOk) valid = false;
  }

  const emailInput = document.querySelector('[name="email"]');
  const emailErr = document.querySelector('[data-error="email-format"]');
  if (emailInput && emailInput.value.trim()) {
    const emailOk = EMAIL_REGEX.test(emailInput.value.trim());
    if (emailErr) emailErr.classList.toggle("show", !emailOk);
    if (!emailOk) valid = false;
  }

  if (!checkoutState.paymentMethod) {
    document.querySelector('[data-error="payment"]')?.classList.add("show");
    valid = false;
  } else {
    document.querySelector('[data-error="payment"]')?.classList.remove("show");
  }

  return valid;
}

async function handleSubmitOrder() {
  if (!validateForm()) {
    showToast("Please complete all required fields");
    return;
  }
  const btn = document.querySelector("[data-checkout-submit]");
  btn.setAttribute("disabled", "disabled");
  btn.textContent = "Placing order…";

  const cart = getCart();
  const subtotal = cartSubtotal();
  const deliveryCharge = checkoutState.locationConfirmed ? checkoutState.delivery : 0;
  const grandTotal = subtotal + deliveryCharge;

  const getVal = (n) => document.querySelector(`[name="${n}"]`)?.value.trim() || "";
  const address = {
    name: getVal("name"),
    phone: getVal("phone"),
    email: getVal("email"),
    house: getVal("house"),
    street: getVal("street"),
    city: getVal("city"),
    landmark: getVal("landmark"),
    instructions: getVal("instructions")
  };

  const order = {
    items: cart,
    food_total: subtotal,
    distance_km: checkoutState.distance,
    delivery_charge: deliveryCharge,
    delivery_free: checkoutState.locationConfirmed ? checkoutState.free : null,
    grand_total: grandTotal,
    payment_method: checkoutState.paymentMethod, // "upi" | "cod"
    payment_status: checkoutState.paymentMethod === "cod" ? "Pending" : "Pending Verification",
    address,
    status: "Received",
    created_at: new Date().toISOString()
  };

  const saved = await DB.createOrder(order);
  sessionStorage.setItem("gpc_last_order", JSON.stringify(saved));
  clearCart();

  if (checkoutState.paymentMethod === "upi") {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(CONFIG.RESTAURANT.upiId)}&pn=${encodeURIComponent(
      "Golden Pizza Cafe"
    )}&am=${Math.round(grandTotal)}&cu=INR`;
    window.location.href = upiUrl;
    setTimeout(() => {
      window.location.href = `order-confirmation.html?id=${encodeURIComponent(saved.order_id)}`;
    }, 900);
  } else {
    window.location.href = `order-confirmation.html?id=${encodeURIComponent(saved.order_id)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector("[data-checkout-form]")) initCheckout();
});
