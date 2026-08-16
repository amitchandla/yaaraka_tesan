/* ============================================================
   GOLDEN PIZZA CAFE — ADMIN PANEL
   Works two ways:
   - Supabase configured → reads/writes real tables + Storage
     buckets (products, logos, menu-graphics, gallery).
   - Not configured yet  → runs in local demo mode against
     localStorage, so the whole admin UI is clickable and
     testable before a Supabase project is connected.
   ============================================================ */

const LOCAL_PRODUCTS_KEY = "gpc_admin_products";
const LOCAL_SETTINGS_KEY = "gpc_admin_settings";

function getLocalProducts() {
  const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(MENU_DATA));
  return MENU_DATA.slice();
}
function saveLocalProducts(list) {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
}

function getLocalSettings() {
  const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
  if (raw) return JSON.parse(raw);
  return {
    free_delivery_km: CONFIG.DELIVERY.freeDeliveryKm,
    extra_charge_per_km: CONFIG.DELIVERY.extraChargePerKm,
    restaurant_lat: CONFIG.RESTAURANT_LOCATION.lat,
    restaurant_lng: CONFIG.RESTAURANT_LOCATION.lng,
    upi_id: CONFIG.RESTAURANT.upiId
  };
}
function saveLocalSettings(s) {
  localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(s));
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------------- Tabs ---------------- */
function switchAdminPanel(panelId) {
  document.querySelectorAll(".admin-panel").forEach((p) => p.classList.remove("active"));
  document.querySelector(`[data-panel="${panelId}"]`)?.classList.add("active");
  document.querySelectorAll(".admin-nav a, .admin-tabs button").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("data-target") === panelId);
  });
}
window.switchAdminPanel = switchAdminPanel;

/* ---------------- Products ---------------- */
async function renderAdminProducts() {
  const tbody = document.querySelector("[data-admin-product-rows]");
  if (!tbody) return;
  const sb = getSupabase();
  const list = sb ? await DB.getProducts() : getLocalProducts();
  tbody.innerHTML = list
    .map(
      (p) => `<tr>
      <td><img src="${p.image}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;"></td>
      <td>${escapeHtml(p.name)}</td>
      <td>${p.category}</td>
      <td>${p.sizes ? `S ${p.sizes.small} / M ${p.sizes.medium} / L ${p.sizes.large}` : formatRupee(p.price)}</td>
      <td>${p.veg !== false ? "Veg" : "Non-Veg"}</td>
      <td>${p.available === false ? "Hidden" : "Available"}</td>
      <td style="white-space:nowrap;">
        <button class="btn btn-outline btn-sm" onclick="editAdminProduct('${p.id}')">Edit</button>
        <button class="btn btn-dark btn-sm" onclick="deleteAdminProduct('${p.id}')">Delete</button>
      </td>
    </tr>`
    )
    .join("");
}

function editAdminProduct(id) {
  const list = getLocalProducts();
  const p = list.find((x) => x.id === id);
  if (!p) return;
  const form = document.querySelector("[data-product-form]");
  form.id.value = p.id;
  form.name.value = p.name;
  form.category.value = p.category;
  form.description.value = p.description;
  form.regularPrice.value = p.price || "";
  form.smallPrice.value = p.sizes?.small || "";
  form.mediumPrice.value = p.sizes?.medium || "";
  form.largePrice.value = p.sizes?.large || "";
  form.veg.checked = p.veg !== false;
  form.available.checked = p.available !== false;
  form.featured.checked = !!p.featured;
  toggleSizeFields();
  document.querySelector("[data-product-form-title]").textContent = "Edit Menu Item";
  switchAdminPanel("products");
}
window.editAdminProduct = editAdminProduct;

function deleteAdminProduct(id) {
  if (!confirm("Delete this product?")) return;
  const list = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(list);
  renderAdminProducts();
  showToast("Product deleted");
}
window.deleteAdminProduct = deleteAdminProduct;

function toggleSizeFields() {
  const cat = document.querySelector('[data-product-form] [name="category"]')?.value;
  const sizeBlock = document.querySelector("[data-size-fields]");
  const regularBlock = document.querySelector("[data-regular-field]");
  const needsSizes = cat === "pizza";
  if (sizeBlock) sizeBlock.style.display = needsSizes ? "grid" : "none";
  if (regularBlock) regularBlock.style.display = needsSizes ? "none" : "block";
}
window.toggleSizeFields = toggleSizeFields;

async function handleProductFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const isPizza = form.category.value === "pizza";

  let imageData = null;
  const fileInput = form.querySelector('[name="imageFile"]');
  if (fileInput && fileInput.files[0]) {
    imageData = await fileToDataUrl(fileInput.files[0]);
  }

  const product = {
    id: form.id.value || "p" + Date.now(),
    name: form.name.value.trim(),
    category: form.category.value,
    description: form.description.value.trim(),
    price: isPizza ? null : Number(form.regularPrice.value) || 0,
    sizes: isPizza
      ? {
          small: Number(form.smallPrice.value) || 0,
          medium: Number(form.mediumPrice.value) || 0,
          large: Number(form.largePrice.value) || 0
        }
      : null,
    veg: form.veg.checked,
    available: form.available.checked,
    featured: form.featured.checked,
    image: imageData || form.dataset.existingImage || "assets/food/" + form.category.value + ".svg"
  };

  const sb = getSupabase();
  if (sb) {
    await sb.from("products").upsert(product);
  }
  const list = getLocalProducts();
  const idx = list.findIndex((p) => p.id === product.id);
  if (idx > -1) list[idx] = { ...list[idx], ...product };
  else list.push(product);
  saveLocalProducts(list);

  form.reset();
  document.querySelector("[data-product-form-title]").textContent = "Add Menu Item";
  toggleSizeFields();
  renderAdminProducts();
  showToast("Product saved");
}

/* ---------------- Settings ---------------- */
async function initSettingsForm() {
  const form = document.querySelector("[data-settings-form]");
  if (!form) return;
  const settings = getLocalSettings();
  form.freeKm.value = settings.free_delivery_km;
  form.perKm.value = settings.extra_charge_per_km;
  form.lat.value = settings.restaurant_lat;
  form.lng.value = settings.restaurant_lng;
  form.upi.value = settings.upi_id;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updated = {
      free_delivery_km: Number(form.freeKm.value),
      extra_charge_per_km: Number(form.perKm.value),
      restaurant_lat: Number(form.lat.value),
      restaurant_lng: Number(form.lng.value),
      upi_id: form.upi.value.trim()
    };
    const sb = getSupabase();
    if (sb) await sb.from("restaurant_settings").upsert({ id: 1, ...updated });
    saveLocalSettings(updated);
    showToast("Settings saved");
  });

  document.querySelector("[data-admin-use-location]")?.addEventListener("click", async () => {
    try {
      const coords = await requestCurrentLocation();
      form.lat.value = coords.lat.toFixed(6);
      form.lng.value = coords.lng.toFixed(6);
      showToast("Location captured — remember to click Save");
    } catch (msg) {
      showToast(typeof msg === "string" ? msg : "Could not get location");
    }
  });
}

/* ---------------- Orders ---------------- */
async function renderAdminOrders() {
  const tbody = document.querySelector("[data-admin-order-rows]");
  if (!tbody) return;
  const orders = await DB.getAllOrders();
  const statCount = document.querySelector("[data-stat-orders]");
  const statRevenue = document.querySelector("[data-stat-revenue]");
  if (statCount) statCount.textContent = orders.length;
  if (statRevenue) statRevenue.textContent = formatRupee(orders.reduce((s, o) => s + (o.grand_total || 0), 0));

  tbody.innerHTML = orders
    .map(
      (o) => `<tr>
      <td>${o.order_id || o.id}</td>
      <td>${o.address?.name || "-"}</td>
      <td>${(o.items || []).length} item(s)</td>
      <td>${formatRupee(o.grand_total)}</td>
      <td>${o.payment_method === "upi" ? "UPI" : "COD"}</td>
      <td>${o.payment_status}</td>
      <td>
        <select class="status-select" onchange="updateAdminOrderStatus('${o.id}', this.value)">
          ${["Received", "Preparing", "Out for Delivery", "Delivered", "Cancelled"]
            .map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`)
            .join("")}
        </select>
      </td>
    </tr>`
    )
    .join("");
}

async function updateAdminOrderStatus(id, status) {
  await DB.updateOrderStatus(id, status);
  showToast("Order status updated");
}
window.updateAdminOrderStatus = updateAdminOrderStatus;

/* ---------------- Logo / Menu Graphics / Gallery uploads ---------------- */
async function handleAssetUpload(inputEl, bucket, labelPrefix) {
  const file = inputEl.files[0];
  if (!file) return;
  const sb = getSupabase();
  if (sb) {
    const path = `${bucket}/${Date.now()}-${file.name}`;
    const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) {
      showToast("Upload failed: " + error.message);
      return;
    }
    showToast(`${labelPrefix} uploaded to Supabase Storage`);
  } else {
    showToast(`${labelPrefix} saved (demo mode — connect Supabase Storage to persist)`);
  }
}
window.handleAssetUpload = handleAssetUpload;

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".admin-shell")) return;

  document.querySelectorAll(".admin-nav a, .admin-tabs button").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      switchAdminPanel(el.getAttribute("data-target"));
    });
  });

  renderAdminProducts();
  renderAdminOrders();
  initSettingsForm();

  document.querySelector("[data-product-form]")?.addEventListener("submit", handleProductFormSubmit);
  document.querySelector('[data-product-form] [name="category"]')?.addEventListener("change", toggleSizeFields);
  toggleSizeFields();
});
