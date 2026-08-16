-- ============================================================
-- GOLDEN PIZZA CAFE — SEED DATA
-- ============================================================
-- Run AFTER schema.sql. Populates the products / product_sizes
-- tables with every item transcribed from the uploaded Menu (A),
-- Menu (B) and Menu (C) posters — same data as js/menu-data.js,
-- so the site behaves identically whether Supabase is connected
-- or running in offline/local mode.
-- ============================================================

-- ---------------- PIZZA (single price) ----------------
insert into products (id, name, category, description, price, image, veg, featured) values
('p01','Tomato Pizza','pizza','Classic single-topping pizza finished with fresh tomato.',59,'assets/food/pizza.svg',true,false),
('p02','Capsicum Pizza','pizza','Single-topping pizza loaded with crisp capsicum.',59,'assets/food/pizza.svg',true,false),
('p03','Onion Pizza','pizza','Simple, classic single-topping onion pizza.',59,'assets/food/pizza.svg',true,false),
('p04','Sweet Corn Pizza','pizza','Single-topping pizza with sweet corn kernels.',59,'assets/food/pizza.svg',true,false)
on conflict (id) do nothing;

-- ---------------- PIZZA (sized) ----------------
insert into products (id, name, category, description, price, image, veg, featured) values
('p05','Onion + Capsicum Pizza','pizza','Double-topping pizza — onion and capsicum.',null,'assets/food/pizza.svg',true,false),
('p06','Corn + Tomato Pizza','pizza','Double-topping pizza — sweet corn and tomato.',null,'assets/food/pizza.svg',true,false),
('p07','Jalapeno + Corn Pizza','pizza','Double-topping pizza — spicy jalapeno and sweet corn.',null,'assets/food/pizza.svg',true,false),
('p08','Paneer + Corn Pizza','pizza','Double-topping pizza — paneer cubes and sweet corn.',null,'assets/food/pizza.svg',true,false),
('p09','Paneer + Onion Pizza','pizza','Double-topping pizza — paneer cubes and onion.',null,'assets/food/pizza.svg',true,false),
('p10','Cheese Margherita','pizza','Golden Pizza Cafe''s signature loaded-cheese margherita.',null,'assets/food/pizza.svg',true,true),
('p11','Fresh Veggie','pizza','Onion, capsicum and tomato on a cheesy base.',null,'assets/food/pizza.svg',true,false),
('p12','Tandoori Paneer','pizza','Onion, capsicum, corn, tomato, paneer and black olives with a tandoori kick.',null,'assets/food/pizza.svg',true,true),
('p13','Farm House','pizza','Onion, capsicum, corn and mushroom — a garden-fresh classic.',null,'assets/food/pizza.svg',true,false),
('p14','Peppy Paneer','pizza','Onion, capsicum, paneer and red paprika for a bold bite.',null,'assets/food/pizza.svg',true,false),
('p15','Paneer Makhni','pizza','Onion, capsicum and paneer over a rich makhni base.',null,'assets/food/pizza.svg',true,false),
('p16','Exotica','pizza','Tomato, corn, jalapeno, black olives and capsicum, loaded.',null,'assets/food/pizza.svg',true,false),
('p17','Paneer Chipotle','pizza','Onion, capsicum and paneer with a smoky chipotle finish.',null,'assets/food/pizza.svg',true,false),
('p18','Family Special','pizza','Onion, capsicum, tomato, jalapeno, black olives and paneer — the full house.',null,'assets/food/pizza.svg',true,true),
('p19','Yam Dum Extra Cheese','pizza','Onion, capsicum, tomato, corn and jalapeno, piled with extra cheese.',null,'assets/food/pizza.svg',true,false),
('p20','Veg Extra Vanzza Extra Topping','pizza','Onion, capsicum, tomato, jalapeno and black olives, extra-loaded.',null,'assets/food/pizza.svg',true,false)
on conflict (id) do nothing;

insert into product_sizes (product_id, size, price) values
('p05','small',79),('p05','medium',149),('p05','large',240),
('p06','small',79),('p06','medium',149),('p06','large',240),
('p07','small',79),('p07','medium',149),('p07','large',240),
('p08','small',99),('p08','medium',179),('p08','large',259),
('p09','small',99),('p09','medium',179),('p09','large',259),
('p10','small',99),('p10','medium',149),('p10','large',249),
('p11','small',120),('p11','medium',179),('p11','large',279),
('p12','small',149),('p12','medium',199),('p12','large',299),
('p13','small',149),('p13','medium',199),('p13','large',349),
('p14','small',149),('p14','medium',199),('p14','large',349),
('p15','small',149),('p15','medium',199),('p15','large',349),
('p16','small',149),('p16','medium',220),('p16','large',349),
('p17','small',149),('p17','medium',199),('p17','large',349),
('p18','small',149),('p18','medium',199),('p18','large',349),
('p19','small',149),('p19','medium',220),('p19','large',399),
('p20','small',149),('p20','medium',220),('p20','large',399)
on conflict (product_id, size) do nothing;

-- ---------------- SANDWICH ----------------
insert into products (id, name, category, description, price, image, veg, featured) values
('s01','Veg Sandwich','sandwich','Classic grilled vegetable sandwich.',69,'assets/food/sandwich.svg',true,false),
('s02','American Veg Sandwich','sandwich','Loaded American-style veg sandwich.',79,'assets/food/sandwich.svg',true,false),
('s03','Tandoori Paneer Sandwich','sandwich','Grilled sandwich with smoky tandoori paneer.',99,'assets/food/sandwich.svg',true,false),
('s04','Paneer Makhni Sandwich','sandwich','Sandwich filled with rich paneer makhni.',120,'assets/food/sandwich.svg',true,false),
('s05','Paneer Chipotle Sandwich','sandwich','Smoky chipotle paneer, grilled to order.',120,'assets/food/sandwich.svg',true,false),
('s06','Golden Pizza Special Sandwich','sandwich','Our house-special loaded sandwich.',130,'assets/food/sandwich.svg',true,true)
on conflict (id) do nothing;

-- ---------------- MOMOS ----------------
insert into products (id, name, category, description, price, image, veg) values
('m01','Steam Momos','momos','Soft steamed veg momos with dip.',59,'assets/food/momos.svg',true),
('m02','Fried Momos','momos','Golden pan-fried veg momos.',69,'assets/food/momos.svg',true),
('m03','Gravy Momos','momos','Momos tossed in spicy Golden Pizza Cafe gravy.',99,'assets/food/momos.svg',true)
on conflict (id) do nothing;

-- ---------------- BURGER ----------------
insert into products (id, name, category, description, price, image, veg) values
('b01','Veg Burger','burger','Simple, classic veg patty burger.',39,'assets/food/burger.svg',true),
('b02','Aloo Tikki Burger','burger','Crisp aloo tikki patty burger.',49,'assets/food/burger.svg',true),
('b03','Veg Tikki Burger','burger','Loaded veg tikki burger.',59,'assets/food/burger.svg',true),
('b04','Paneer Burger','burger','Grilled paneer patty burger.',69,'assets/food/burger.svg',true),
('b05','Tandoori Burger','burger','Smoky tandoori-spiced patty burger.',69,'assets/food/burger.svg',true),
('b06','Makhni Burger','burger','Rich makhni-sauced patty burger.',79,'assets/food/burger.svg',true)
on conflict (id) do nothing;

-- ---------------- BEVERAGES: MOCKTAIL / MOJITO ----------------
insert into products (id, name, category, description, price, image, veg) values
('v01','Strawberry Mocktail','beverages','Chilled strawberry mocktail.',49,'assets/food/beverages.svg',true),
('v02','Mint Mojito','beverages','Refreshing mint mojito.',59,'assets/food/beverages.svg',true),
('v03','Green Apple Mojito','beverages','Crisp green-apple mojito.',69,'assets/food/beverages.svg',true),
('v04','Lemon Tea','beverages','Hot, tangy lemon tea.',69,'assets/food/beverages.svg',true)
on conflict (id) do nothing;

-- ---------------- NOODLES ----------------
insert into products (id, name, category, description, price, image, veg) values
('n01','Chinese Noodle','noodles','Classic wok-tossed Chinese-style noodles.',59,'assets/food/noodles.svg',true),
('n02','Paneer Noodles','noodles','Noodles tossed with paneer and veggies.',79,'assets/food/noodles.svg',true),
('n03','Manchurian','noodles','Noodles in a tangy Manchurian sauce.',79,'assets/food/noodles.svg',true),
('n04','Chilli Potato','noodles','Crispy chilli potato tossed in spicy sauce.',89,'assets/food/noodles.svg',true)
on conflict (id) do nothing;

-- ---------------- STARTER ----------------
insert into products (id, name, category, description, price, image, veg) values
('st01','French Fries','starter','Classic golden, crispy French fries.',69,'assets/food/starter.svg',true),
('st02','Piri Piri Fries','starter','Fries tossed in piri piri seasoning.',79,'assets/food/starter.svg',true),
('st03','Cheese Fries','starter','Fries loaded with melted cheese.',99,'assets/food/starter.svg',true)
on conflict (id) do nothing;

-- ---------------- PASTA ----------------
insert into products (id, name, category, description, price, image, veg) values
('pa01','White Sauce Pasta','pasta','Creamy white sauce pasta.',79,'assets/food/pasta.svg',true),
('pa02','Red Sauce Pasta','pasta','Classic tangy red sauce pasta.',89,'assets/food/pasta.svg',true),
('pa03','Mix Sauce Pasta','pasta','Pasta in a blend of red and white sauce.',120,'assets/food/pasta.svg',true),
('pa04','Makhni Sauce Pasta','pasta','Pasta in a rich makhni sauce.',149,'assets/food/pasta.svg',true),
('pa05','Tandoori Sauce Pasta','pasta','Pasta in a smoky tandoori sauce.',149,'assets/food/pasta.svg',true)
on conflict (id) do nothing;

-- ---------------- MAGGIE ----------------
insert into products (id, name, category, description, price, image, veg) values
('mg01','Plain Maggie','maggie','Simple, classic plain Maggie.',39,'assets/food/maggie.svg',true),
('mg02','Veg Maggie','maggie','Maggie loaded with fresh vegetables.',49,'assets/food/maggie.svg',true),
('mg03','Spice Tadka Maggie','maggie','Maggie with a spicy tadka twist.',59,'assets/food/maggie.svg',true),
('mg04','Maggie Mania','maggie','Our fully loaded special Maggie.',69,'assets/food/maggie.svg',true)
on conflict (id) do nothing;

-- ---------------- SHAKE ----------------
insert into products (id, name, category, description, price, image, veg, featured) values
('sh01','Banana Shake','shake','Thick, creamy banana shake.',49,'assets/food/shake.svg',true,false),
('sh02','Strawberry Shake','shake','Classic strawberry shake.',59,'assets/food/shake.svg',true,false),
('sh03','Blue Berry Shake','shake','Rich blueberry shake.',69,'assets/food/shake.svg',true,false),
('sh04','Butter Scotch Shake','shake','Creamy butterscotch shake.',69,'assets/food/shake.svg',true,false),
('sh05','Oreo Shake','shake','Loaded Oreo cookie shake.',79,'assets/food/shake.svg',true,true)
on conflict (id) do nothing;

-- ---------------- COFFEE ----------------
insert into products (id, name, category, description, price, image, veg) values
('c01','Hot Coffee','coffee','Freshly brewed hot coffee.',39,'assets/food/coffee.svg',true),
('c02','Cold Coffee','coffee','Chilled, frothy cold coffee.',59,'assets/food/coffee.svg',true),
('c03','Cold Coffee + Ice Cream','coffee','Cold coffee topped with a scoop of ice cream.',79,'assets/food/coffee.svg',true)
on conflict (id) do nothing;

-- ---------------- OFFERS ----------------
insert into offers (title, description, tag, sort_order) values
('Free Cold Coffee With Ice Cream','On every order of ₹200 or more, get a Cold Coffee With Ice Cream absolutely free.','On orders ₹200+',1),
('Combo ₹199','1 Pizza + 1 Sandwich + 1 Burger + 1 Cold Coffee With Ice Cream.','₹199',2),
('Combo ₹399','1 Medium Pizza + 2 Sandwiches + 2 Burgers + 2 Cold Coffee With Ice Cream.','₹399',3),
('Combo ₹499','1 Large Pizza + 2 Burgers + 2 Sandwiches + 2 Cold Coffee With Ice Cream.','₹499',4),
('Birthday & Anniversary Cakes','Custom celebration cakes available to order — ask in-store or on WhatsApp.','Ask us',5);

-- ---------------- MENU GRAPHICS ----------------
insert into menu_graphics (label, image_url, sort_order) values
('Menu A','assets/menu/menu-a.png',1),
('Menu B','assets/menu/menu-b.png',2),
('Menu C','assets/menu/menu-c.png',3);
