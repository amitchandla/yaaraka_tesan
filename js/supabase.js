/* ============================================================
   GOLDEN PIZZA CAFE — SUPABASE CLIENT
   ============================================================
   Loads the Supabase JS SDK (added via CDN script tag in each HTML
   page) and exposes a small set of helper functions used across
   app.js / menu.js / cart.js / checkout.js / auth.js / orders.js /
   admin.js.

   This file is defensive: if CONFIG.SUPABASE_URL has not been filled
   in yet, the site still runs fully in "local/offline" mode using
   localStorage for the cart and the built-in MENU_DATA (menu-data.js)
   for products — so the front-of-house experience works immediately,
   even before a Supabase project is wired up. Once real keys are
   added, isSupabaseConfigured() flips to true and DB.* functions
   talk to the real project instead.
   ============================================================ */

function isSupabaseConfigured() {
  return (
    window.CONFIG &&
    CONFIG.SUPABASE_URL &&
    !CONFIG.SUPABASE_URL.startsWith("YOUR_") &&
    CONFIG.SUPABASE_ANON_KEY &&
    !CONFIG.SUPABASE_ANON_KEY.startsWith("YOUR_")
  );
}

let supabaseClient = null;

function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (supabaseClient) return supabaseClient;
  if (typeof window.supabase === "undefined") {
    console.warn("Supabase SDK script not loaded on this page.");
    return null;
  }
  supabaseClient = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_ANON_KEY
  );
  return supabaseClient;
}

/* ---------------- Data access layer ----------------
   Every function tries Supabase first (if configured) and falls
   back to local data so the site is always demoable / usable. */
const DB = {
  async getProducts() {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from("products")
        .select("*, product_sizes(*)")
        .eq("available", true);
      if (!error && data && data.length) return data;
    }
    return window.MENU_DATA || [];
  },

  async getSettings() {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from("restaurant_settings")
        .select("*")
        .limit(1)
        .single();
      if (!error && data) return data;
    }
    return {
      free_delivery_km: CONFIG.DELIVERY.freeDeliveryKm,
      extra_charge_per_km: CONFIG.DELIVERY.extraChargePerKm,
      restaurant_lat: CONFIG.RESTAURANT_LOCATION.lat,
      restaurant_lng: CONFIG.RESTAURANT_LOCATION.lng,
      upi_id: CONFIG.RESTAURANT.upiId
    };
  },

  async createOrder(order) {
    const sb = getSupabase();
    const orderId = generateOrderId();
    order.order_id = orderId;
    if (sb) {
      const { data: userData } = await sb.auth.getUser();
      const uid = userData && userData.user ? userData.user.id : null;
      const { data, error } = await sb
        .from("orders")
        .insert([{ ...order, user_id: uid }])
        .select()
        .single();
      if (!error && data) {
        if (order.items && order.items.length) {
          const rows = order.items.map((it) => ({
            order_id: data.id,
            product_name: it.name,
            size: it.size || null,
            quantity: it.qty,
            price: it.price,
            line_total: it.price * it.qty
          }));
          await sb.from("order_items").insert(rows);
        }
        return data;
      }
    }
    // Offline fallback: store in localStorage so "My Orders" still works
    const localOrders = JSON.parse(localStorage.getItem("gpc_orders") || "[]");
    order.id = "local-" + Date.now();
    order.created_at = new Date().toISOString();
    localOrders.unshift(order);
    localStorage.setItem("gpc_orders", JSON.stringify(localOrders));
    return order;
  },

  async getMyOrders() {
    const sb = getSupabase();
    if (sb) {
      const { data: userData } = await sb.auth.getUser();
      const uid = userData && userData.user ? userData.user.id : null;
      if (uid) {
        const { data, error } = await sb
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", uid)
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      }
    }
    return JSON.parse(localStorage.getItem("gpc_orders") || "[]");
  },

  async getAllOrders() {
    const sb = getSupabase();
    if (sb) {
      const { data, error } = await sb
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (!error && data) return data;
    }
    return JSON.parse(localStorage.getItem("gpc_orders") || "[]");
  },

  async updateOrderStatus(id, status) {
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("orders").update({ status }).eq("id", id);
      return !error;
    }
    const localOrders = JSON.parse(localStorage.getItem("gpc_orders") || "[]");
    const idx = localOrders.findIndex((o) => o.id === id);
    if (idx > -1) {
      localOrders[idx].status = status;
      localStorage.setItem("gpc_orders", JSON.stringify(localOrders));
      return true;
    }
    return false;
  }
};

function generateOrderId() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `GPC-${y}${m}${day}-${seq}`;
}

window.DB = DB;
window.getSupabase = getSupabase;
window.isSupabaseConfigured = isSupabaseConfigured;
window.generateOrderId = generateOrderId;
