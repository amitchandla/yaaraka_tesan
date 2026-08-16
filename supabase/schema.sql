-- ============================================================
-- GOLDEN PIZZA CAFE — SUPABASE SCHEMA
-- ============================================================
-- Run this once in Supabase Dashboard → SQL Editor on a fresh
-- project. It creates every table used by the site plus Row
-- Level Security policies so customers can only manage their
-- own data while admins can manage everything.
--
-- After running this:
--   1. Create the storage buckets: logos, menu-graphics, products, gallery
--      (Dashboard → Storage → New bucket → make each "Public")
--   2. Copy Project URL + anon public key into js/config.js
--   3. Promote your own account to admin (see bottom of this file)
-- ============================================================

-- ---------------- Extensions ----------------
create extension if not exists "pgcrypto";

-- ---------------- profiles ----------------
-- One row per authenticated user (mirrors auth.users).
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------- categories ----------------
create table if not exists categories (
  id text primary key,           -- e.g. 'pizza', 'burger'
  label text not null,
  sort_order int not null default 0
);

insert into categories (id, label, sort_order) values
  ('pizza','Pizza',1), ('burger','Burger',2), ('sandwich','Sandwich',3),
  ('momos','Momos',4), ('pasta','Pasta',5), ('noodles','Noodles',6),
  ('maggie','Maggie',7), ('starter','Starter',8), ('shake','Shake',9),
  ('coffee','Coffee',10), ('beverages','Mocktail / Mojito',11)
on conflict (id) do nothing;

-- ---------------- products ----------------
create table if not exists products (
  id text primary key,           -- e.g. 'p10' (kept text to match menu-data.js IDs)
  name text not null,
  category text not null references categories(id),
  description text,
  price numeric,                 -- null when the product uses sizes instead
  image text,
  veg boolean not null default true,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------- product_sizes ----------------
-- One row per size for pizza-style products (small/medium/large).
create table if not exists product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references products(id) on delete cascade,
  size text not null check (size in ('small','medium','large')),
  price numeric not null,
  unique (product_id, size)
);

-- ---------------- menu_graphics ----------------
-- Menu A / B / C poster images (and any future pages).
create table if not exists menu_graphics (
  id uuid primary key default gen_random_uuid(),
  label text not null,           -- 'Menu A', 'Menu B', 'Menu C'
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------- gallery ----------------
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------- offers ----------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tag text,
  sort_order int not null default 0,
  active boolean not null default true
);

-- ---------------- restaurant_settings ----------------
-- Single-row table (id = 1) holding editable business rules.
create table if not exists restaurant_settings (
  id int primary key default 1,
  free_delivery_km numeric not null default 5,
  extra_charge_per_km numeric not null default 10,
  restaurant_lat numeric not null default 28.7935,
  restaurant_lng numeric not null default 76.1322,
  upi_id text not null default 'vamit3421-3@okaxis',
  updated_at timestamptz not null default now()
);
insert into restaurant_settings (id) values (1) on conflict (id) do nothing;

-- ---------------- orders ----------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,         -- e.g. GPC-20260815-001
  user_id uuid references auth.users(id),
  items jsonb not null,                  -- snapshot of cart lines at order time
  food_total numeric not null,
  distance_km numeric,
  delivery_charge numeric not null default 0,
  delivery_free boolean,
  grand_total numeric not null,
  payment_method text not null check (payment_method in ('upi','cod')),
  payment_status text not null default 'Pending',
  status text not null default 'Received',
  address jsonb not null,                -- {name, phone, house, street, city, landmark, instructions}
  created_at timestamptz not null default now()
);

-- ---------------- order_items ----------------
-- Optional normalized line items (orders.items already stores a
-- full JSON snapshot; this table makes reporting/joins easier).
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null,
  size text,
  quantity int not null,
  price numeric not null,
  line_total numeric not null
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_sizes enable row level security;
alter table menu_graphics enable row level security;
alter table gallery enable row level security;
alter table offers enable row level security;
alter table restaurant_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql stable security definer;

-- profiles: users manage their own row; admins manage all
create policy "profiles_select_own_or_admin" on profiles for select using (auth.uid() = id or is_admin());
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all using (is_admin());

-- categories/products/product_sizes/menu_graphics/gallery/offers:
-- public read of available items, admin-only writes
create policy "public_read_categories" on categories for select using (true);
create policy "admin_write_categories" on categories for all using (is_admin());

create policy "public_read_products" on products for select using (available = true or is_admin());
create policy "admin_write_products" on products for all using (is_admin());

create policy "public_read_product_sizes" on product_sizes for select using (true);
create policy "admin_write_product_sizes" on product_sizes for all using (is_admin());

create policy "public_read_menu_graphics" on menu_graphics for select using (true);
create policy "admin_write_menu_graphics" on menu_graphics for all using (is_admin());

create policy "public_read_gallery" on gallery for select using (true);
create policy "admin_write_gallery" on gallery for all using (is_admin());

create policy "public_read_offers" on offers for select using (active = true or is_admin());
create policy "admin_write_offers" on offers for all using (is_admin());

create policy "public_read_settings" on restaurant_settings for select using (true);
create policy "admin_write_settings" on restaurant_settings for all using (is_admin());

-- orders: customers see/create only their own; admins see/manage all
create policy "orders_select_own_or_admin" on orders for select using (auth.uid() = user_id or is_admin());
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders_update_admin_only" on orders for update using (is_admin());

create policy "order_items_select_own_or_admin" on order_items for select using (
  exists (select 1 from orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or is_admin()))
);
create policy "order_items_insert_own" on order_items for insert with check (
  exists (select 1 from orders o where o.id = order_items.order_id and (o.user_id = auth.uid() or is_admin()))
);
create policy "order_items_admin_all" on order_items for all using (is_admin());

-- ============================================================
-- MAKE YOURSELF ADMIN
-- ============================================================
-- After signing up on the live site with your own email, run:
--   update profiles set is_admin = true where email = 'goldenpizzamgmt@gmail.com';
-- ============================================================
