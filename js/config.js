/* ============================================================
   GOLDEN PIZZA CAFE — CONFIGURATION
   ============================================================
   Fill in your own Supabase project values below.
   Where to find them: Supabase Dashboard → Project Settings → API

   SUPABASE_URL         → "Project URL"
   SUPABASE_ANON_KEY     → "anon / public" key (NOT the service_role key)

   NEVER put your service_role key in this file or anywhere in the
   frontend — it must only ever be used from a secure server context.
   ============================================================ */

const CONFIG = {
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL", // e.g. https://xxxxxxxx.supabase.co
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_PUBLIC_KEY",

  RESTAURANT: {
    name: "Golden Pizza Cafe",
    owner: "Nissu",
    phone: "7027218194",
    whatsapp: "917027218194", // country code + number, no +/spaces (wa.me format)
    email: "goldenpizzamgmt@gmail.com",
    address: "Behal Pilani Road, Nearby Parshuram Dharmashala, Behal, Bhiwani, Haryana",
    instagram: "https://www.instagram.com/golden_pizza_bahal/",
    instagramHandle: "@golden_pizza_bahal",
    googleMaps: "https://maps.app.goo.gl/ERCTTxdRbNbBHWL27",
    openTime: "9:00 AM",
    closeTime: "9:00 PM",
    openDays: "Every Day",
    upiId: "vamit3421-3@okaxis"
  },

  DELIVERY: {
    // Defaults — overridable from Admin → Delivery Settings (stored in
    // restaurant_settings table once Supabase is connected; falls back
    // to these values otherwise).
    freeDeliveryKm: 5,
    extraChargePerKm: 10
  },

  // Default restaurant coordinates — set the real ones from
  // Admin Panel → Restaurant Location → "Use My Location".
  // Placeholder below is approximately Bhiwani, Haryana; replace it.
  RESTAURANT_LOCATION: {
    lat: 28.7935,
    lng: 76.1322
  }
};

// Expose read-only-ish globally
window.CONFIG = CONFIG;
