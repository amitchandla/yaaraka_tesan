# Golden Pizza Cafe — Online Ordering Website

A complete, mobile-first food-ordering website for **Golden Pizza Cafe** (Behal, Bhiwani), built with plain HTML/CSS/JS on the front end and **Supabase** (Auth, Database, Storage) on the back end. GitHub-ready, no build step required.

The site works fully **out of the box** in "local/offline" demo mode (cart, checkout, distance-based delivery pricing, order placement all work using your browser's storage) — and automatically switches to real Supabase Auth, database and file storage the moment you add your project keys to `js/config.js`. Nothing needs to be rewritten to go from demo → live.

---

## 1. What's included

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, categories, offers, party hall, about preview |
| Menu | `menu.html` | Live search + category filter over real product data, pizza size selector, Menu A/B/C poster lightbox |
| About | `about.html` | Restaurant story |
| Gallery | `gallery.html` | Photo gallery with fullscreen lightbox |
| Contact | `contact.html` | Address, phone, WhatsApp, email, map, contact form |
| Login / Sign Up | `login.html`, `signup.html` | Supabase Auth (email + password) |
| Checkout | `checkout.html` | Address form, geolocation distance pricing, UPI / COD |
| Order Confirmation | `order-confirmation.html` | Receipt + "send on WhatsApp" |
| My Orders | `orders.html` | Customer order history |
| Admin Panel | `admin.html` | Products, orders, settings, logo/menu/gallery uploads |

All restaurant-specific data (phone, WhatsApp, UPI ID, address, hours) lives in one place: **`js/config.js`**.

## 2. Menu data

Every product name and price in `js/menu-data.js` was transcribed directly from your uploaded **Menu (A)**, **Menu (B)** and **Menu (C)** posters — nothing was invented. `supabase/seed.sql` contains the same data for the database. If a price ever needs correcting, do it in **one place**:
- Quick/offline: edit `js/menu-data.js`
- Live on Supabase: edit it from **Admin Panel → Products**, or re-run `seed.sql`

## 3. Running it locally (no setup needed)

This is a static site — no build tools, no npm install. Just open `index.html` in a browser, or serve the folder:

```bash
# any static server works, e.g.
npx serve .
# or
python3 -m http.server 8080
```

Cart, checkout, order placement, login/signup and the admin panel all work immediately in **demo mode**, storing data in your browser's `localStorage`. This is great for testing the full customer journey before connecting Supabase.

## 4. Connecting Supabase (to go live)

### Step 1 — Create a project
Go to [supabase.com](https://supabase.com), create a new project.

### Step 2 — Run the database schema
Dashboard → **SQL Editor** → paste and run `supabase/schema.sql`, then `supabase/seed.sql`.

This creates every table (`profiles`, `categories`, `products`, `product_sizes`, `menu_graphics`, `gallery`, `orders`, `order_items`, `restaurant_settings`, `offers`) with Row Level Security already configured:
- Customers can read available products/menu content, create their own orders, read/update only their own data.
- Admins (flagged via `profiles.is_admin`) can manage everything.

### Step 3 — Create storage buckets
Dashboard → **Storage** → New bucket → create these four, set each **Public**:
- `logos`
- `menu-graphics`
- `products`
- `gallery`

### Step 4 — Add your keys
Open `js/config.js` and replace the two placeholders:

```js
SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",       // → your Project URL
SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_PUBLIC_KEY", // → your anon/public key
```

Both are found in **Dashboard → Project Settings → API**. Only use the **anon / public** key here.

> ⚠️ **Never** put your `service_role` key in this file or anywhere in the frontend — it must only ever be used from a secure server, never a browser.

### Step 5 — Make yourself admin
Sign up on the live site with your own email, then in the SQL Editor run:

```sql
update profiles set is_admin = true where email = 'goldenpizzamgmt@gmail.com';
```

Now `admin.html` reads and writes real data instead of demo data.

### Step 6 — Set the real restaurant location
Admin Panel → **Delivery & Restaurant** → stand at the cafe → tap **Use My Location** → **Save Settings**. This becomes the fixed point every delivery distance is measured from.

## 5. Delivery pricing rule

```
free_delivery_km      = 5    // 0–5 KM → FREE
extra_charge_per_km    = ₹10  // every KM beyond 5, rounded up
```

Both numbers are editable from **Admin Panel → Delivery & Restaurant Settings** (stored in `restaurant_settings`, falling back to `js/config.js` defaults if Supabase isn't connected yet). Distance is computed client-side with the Haversine formula in `js/location.js` — see `calculateDelivery()`.

## 6. UPI payments

- UPI ID: `vamit3421-3@okaxis`
- A `upi://pay?...` deep link is generated dynamically at checkout with the exact order total.
- Opening the UPI app is **never** treated as payment confirmation — orders paid via UPI are saved with `payment_status: "Pending Verification"` until you confirm receipt manually from the Admin Panel.

## 7. Project structure

```
golden-pizza-cafe/
  index.html, menu.html, about.html, gallery.html, contact.html
  login.html, signup.html, checkout.html, order-confirmation.html
  orders.html, admin.html
  css/
    style.css        — main design system (colors, type, components)
    admin.css         — admin panel layout
    responsive.css     — mobile breakpoints
  js/
    config.js         — restaurant info + Supabase keys (EDIT THIS)
    supabase.js        — Supabase client + data-access layer (DB.*)
    menu-data.js       — product catalog (offline fallback + source of truth for prices)
    location.js        — Haversine distance + delivery pricing
    app.js             — shared UI: nav, toasts, lightbox, footer wiring
    cart.js             — cart state (localStorage) + slide-out drawer
    menu.js             — menu page: search, filters, size selector, add-to-cart
    checkout.js         — address form, geolocation, payment, order submission
    auth.js             — Supabase Auth sign up / log in / log out
    orders.js           — order confirmation + "My Orders" + WhatsApp message builder
    admin.js             — admin CRUD for products, orders, settings, uploads
  assets/
    logo/    — official Golden Pizza Cafe logo
    menu/    — Menu A/B/C posters + promotional posters
    food/    — category icons used on product cards
    gallery/ — restaurant interior + promotional photos
  supabase/
    schema.sql — tables + Row Level Security policies
    seed.sql   — full menu data + offers + menu graphics
```

## 8. Deploying to GitHub Pages / any static host

1. Push this folder to a GitHub repo.
2. GitHub Pages: **Settings → Pages → Deploy from branch → `main` / root.**
3. Any other static host (Netlify, Vercel, Cloudflare Pages) works the same way — no build command needed, just point it at the repo root.

## 9. What's demo-mode vs. Supabase-backed

| Feature | Without Supabase configured | With Supabase configured |
|---|---|---|
| Browse menu, search, filter, cart | ✅ Fully works | ✅ Fully works |
| Checkout, distance pricing, UPI/COD | ✅ Fully works | ✅ Fully works |
| Order saved | Saved to browser `localStorage` | Saved to `orders` table |
| Login / Signup | Local demo session | Real Supabase Auth accounts |
| My Orders | Reads from `localStorage` | Reads the logged-in user's real orders |
| Admin product/settings edits | Saved to browser `localStorage` | Saved to Supabase tables |
| Logo / Menu / Gallery upload | Shows a toast (not persisted) | Uploaded to Supabase Storage |

This means the site is demoable and fully clickable the moment you open it, and becomes a real multi-user, persistent ordering system the moment Supabase is connected — no code changes required, only the two keys in `js/config.js`.
