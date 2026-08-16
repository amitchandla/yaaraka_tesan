/* ============================================================
   GOLDEN PIZZA CAFE — MENU DATA
   ============================================================
   Every product/price below is transcribed exactly from the
   uploaded Menu (A), Menu (B) and Menu (C) posters — these are
   treated as the source-of-truth prices per the brief. Nothing
   here is invented.

   Structure:
   - category: one of the fixed category IDs used for filtering
   - sizes: null            → single fixed price (field: price)
            [S/M/L object]  → pizza-style size selector required
   ============================================================ */

const MENU_DATA = [
  /* ---------------- PIZZA — Menu (A) ---------------- */
  { id: "p01", name: "Tomato Pizza", category: "pizza", veg: true,
    description: "Classic single-topping pizza finished with fresh tomato.",
    price: 59, sizes: null, image: "assets/food/pizza.svg", featured: false },
  { id: "p02", name: "Capsicum Pizza", category: "pizza", veg: true,
    description: "Single-topping pizza loaded with crisp capsicum.",
    price: 59, sizes: null, image: "assets/food/pizza.svg" },
  { id: "p03", name: "Onion Pizza", category: "pizza", veg: true,
    description: "Simple, classic single-topping onion pizza.",
    price: 59, sizes: null, image: "assets/food/pizza.svg" },
  { id: "p04", name: "Sweet Corn Pizza", category: "pizza", veg: true,
    description: "Single-topping pizza with sweet corn kernels.",
    price: 59, sizes: null, image: "assets/food/pizza.svg" },

  { id: "p05", name: "Onion + Capsicum Pizza", category: "pizza", veg: true,
    description: "Double-topping pizza — onion and capsicum.",
    sizes: { small: 79, medium: 149, large: 240 }, image: "assets/food/pizza.svg" },
  { id: "p06", name: "Corn + Tomato Pizza", category: "pizza", veg: true,
    description: "Double-topping pizza — sweet corn and tomato.",
    sizes: { small: 79, medium: 149, large: 240 }, image: "assets/food/pizza.svg" },
  { id: "p07", name: "Jalapeno + Corn Pizza", category: "pizza", veg: true,
    description: "Double-topping pizza — spicy jalapeno and sweet corn.",
    sizes: { small: 79, medium: 149, large: 240 }, image: "assets/food/pizza.svg" },
  { id: "p08", name: "Paneer + Corn Pizza", category: "pizza", veg: true,
    description: "Double-topping pizza — paneer cubes and sweet corn.",
    sizes: { small: 99, medium: 179, large: 259 }, image: "assets/food/pizza.svg" },
  { id: "p09", name: "Paneer + Onion Pizza", category: "pizza", veg: true,
    description: "Double-topping pizza — paneer cubes and onion.",
    sizes: { small: 99, medium: 179, large: 259 }, image: "assets/food/pizza.svg" },

  { id: "p10", name: "Cheese Margherita", category: "pizza", veg: true,
    description: "Golden Pizza Cafe's signature loaded-cheese margherita.",
    sizes: { small: 99, medium: 149, large: 249 }, image: "assets/food/pizza.svg", featured: true },
  { id: "p11", name: "Fresh Veggie", category: "pizza", veg: true,
    description: "Onion, capsicum and tomato on a cheesy base.",
    sizes: { small: 120, medium: 179, large: 279 }, image: "assets/food/pizza.svg" },
  { id: "p12", name: "Tandoori Paneer", category: "pizza", veg: true,
    description: "Onion, capsicum, corn, tomato, paneer and black olives with a tandoori kick.",
    sizes: { small: 149, medium: 199, large: 299 }, image: "assets/food/pizza.svg", featured: true },
  { id: "p13", name: "Farm House", category: "pizza", veg: true,
    description: "Onion, capsicum, corn and mushroom — a garden-fresh classic.",
    sizes: { small: 149, medium: 199, large: 349 }, image: "assets/food/pizza.svg" },
  { id: "p14", name: "Peppy Paneer", category: "pizza", veg: true,
    description: "Onion, capsicum, paneer and red paprika for a bold bite.",
    sizes: { small: 149, medium: 199, large: 349 }, image: "assets/food/pizza.svg" },
  { id: "p15", name: "Paneer Makhni", category: "pizza", veg: true,
    description: "Onion, capsicum and paneer over a rich makhni base.",
    sizes: { small: 149, medium: 199, large: 349 }, image: "assets/food/pizza.svg" },
  { id: "p16", name: "Exotica", category: "pizza", veg: true,
    description: "Tomato, corn, jalapeno, black olives and capsicum, loaded.",
    sizes: { small: 149, medium: 220, large: 349 }, image: "assets/food/pizza.svg" },
  { id: "p17", name: "Paneer Chipotle", category: "pizza", veg: true,
    description: "Onion, capsicum and paneer with a smoky chipotle finish.",
    sizes: { small: 149, medium: 199, large: 349 }, image: "assets/food/pizza.svg" },
  { id: "p18", name: "Family Special", category: "pizza", veg: true,
    description: "Onion, capsicum, tomato, jalapeno, black olives and paneer — the full house.",
    sizes: { small: 149, medium: 199, large: 349 }, image: "assets/food/pizza.svg", featured: true },
  { id: "p19", name: "Yam Dum Extra Cheese", category: "pizza", veg: true,
    description: "Onion, capsicum, tomato, corn and jalapeno, piled with extra cheese.",
    sizes: { small: 149, medium: 220, large: 399 }, image: "assets/food/pizza.svg" },
  { id: "p20", name: "Veg Extra Vanzza Extra Topping", category: "pizza", veg: true,
    description: "Onion, capsicum, tomato, jalapeno and black olives, extra-loaded.",
    sizes: { small: 149, medium: 220, large: 399 }, image: "assets/food/pizza.svg" },

  /* ---------------- SANDWICH — Menu (B) ---------------- */
  { id: "s01", name: "Veg Sandwich", category: "sandwich", veg: true,
    description: "Classic grilled vegetable sandwich.", price: 69, sizes: null, image: "assets/food/sandwich.svg" },
  { id: "s02", name: "American Veg Sandwich", category: "sandwich", veg: true,
    description: "Loaded American-style veg sandwich.", price: 79, sizes: null, image: "assets/food/sandwich.svg" },
  { id: "s03", name: "Tandoori Paneer Sandwich", category: "sandwich", veg: true,
    description: "Grilled sandwich with smoky tandoori paneer.", price: 99, sizes: null, image: "assets/food/sandwich.svg" },
  { id: "s04", name: "Paneer Makhni Sandwich", category: "sandwich", veg: true,
    description: "Sandwich filled with rich paneer makhni.", price: 120, sizes: null, image: "assets/food/sandwich.svg" },
  { id: "s05", name: "Paneer Chipotle Sandwich", category: "sandwich", veg: true,
    description: "Smoky chipotle paneer, grilled to order.", price: 120, sizes: null, image: "assets/food/sandwich.svg" },
  { id: "s06", name: "Golden Pizza Special Sandwich", category: "sandwich", veg: true,
    description: "Our house-special loaded sandwich.", price: 130, sizes: null, image: "assets/food/sandwich.svg", featured: true },

  /* ---------------- MOMOS — Menu (B) ---------------- */
  { id: "m01", name: "Steam Momos", category: "momos", veg: true,
    description: "Soft steamed veg momos with dip.", price: 59, sizes: null, image: "assets/food/momos.svg" },
  { id: "m02", name: "Fried Momos", category: "momos", veg: true,
    description: "Golden pan-fried veg momos.", price: 69, sizes: null, image: "assets/food/momos.svg" },
  { id: "m03", name: "Gravy Momos", category: "momos", veg: true,
    description: "Momos tossed in spicy Golden Pizza Cafe gravy.", price: 99, sizes: null, image: "assets/food/momos.svg" },

  /* ---------------- BURGER — Menu (B) ---------------- */
  { id: "b01", name: "Veg Burger", category: "burger", veg: true,
    description: "Simple, classic veg patty burger.", price: 39, sizes: null, image: "assets/food/burger.svg" },
  { id: "b02", name: "Aloo Tikki Burger", category: "burger", veg: true,
    description: "Crisp aloo tikki patty burger.", price: 49, sizes: null, image: "assets/food/burger.svg" },
  { id: "b03", name: "Veg Tikki Burger", category: "burger", veg: true,
    description: "Loaded veg tikki burger.", price: 59, sizes: null, image: "assets/food/burger.svg" },
  { id: "b04", name: "Paneer Burger", category: "burger", veg: true,
    description: "Grilled paneer patty burger.", price: 69, sizes: null, image: "assets/food/burger.svg" },
  { id: "b05", name: "Tandoori Burger", category: "burger", veg: true,
    description: "Smoky tandoori-spiced patty burger.", price: 69, sizes: null, image: "assets/food/burger.svg" },
  { id: "b06", name: "Makhni Burger", category: "burger", veg: true,
    description: "Rich makhni-sauced patty burger.", price: 79, sizes: null, image: "assets/food/burger.svg" },

  /* ---------------- BEVERAGES: MOCKTAIL / MOJITO — Menu (B) ---------------- */
  { id: "v01", name: "Strawberry Mocktail", category: "beverages", veg: true,
    description: "Chilled strawberry mocktail.", price: 49, sizes: null, image: "assets/food/beverages.svg" },
  { id: "v02", name: "Mint Mojito", category: "beverages", veg: true,
    description: "Refreshing mint mojito.", price: 59, sizes: null, image: "assets/food/beverages.svg" },
  { id: "v03", name: "Green Apple Mojito", category: "beverages", veg: true,
    description: "Crisp green-apple mojito.", price: 69, sizes: null, image: "assets/food/beverages.svg" },
  { id: "v04", name: "Lemon Tea", category: "beverages", veg: true,
    description: "Hot, tangy lemon tea.", price: 69, sizes: null, image: "assets/food/beverages.svg" },

  /* ---------------- NOODLES — Menu (B) ---------------- */
  { id: "n01", name: "Chinese Noodle", category: "noodles", veg: true,
    description: "Classic wok-tossed Chinese-style noodles.", price: 59, sizes: null, image: "assets/food/noodles.svg" },
  { id: "n02", name: "Paneer Noodles", category: "noodles", veg: true,
    description: "Noodles tossed with paneer and veggies.", price: 79, sizes: null, image: "assets/food/noodles.svg" },
  { id: "n03", name: "Manchurian", category: "noodles", veg: true,
    description: "Noodles in a tangy Manchurian sauce.", price: 79, sizes: null, image: "assets/food/noodles.svg" },
  { id: "n04", name: "Chilli Potato", category: "noodles", veg: true,
    description: "Crispy chilli potato tossed in spicy sauce.", price: 89, sizes: null, image: "assets/food/noodles.svg" },

  /* ---------------- STARTER — Menu (B) ---------------- */
  { id: "st01", name: "French Fries", category: "starter", veg: true,
    description: "Classic golden, crispy French fries.", price: 69, sizes: null, image: "assets/food/starter.svg" },
  { id: "st02", name: "Piri Piri Fries", category: "starter", veg: true,
    description: "Fries tossed in piri piri seasoning.", price: 79, sizes: null, image: "assets/food/starter.svg" },
  { id: "st03", name: "Cheese Fries", category: "starter", veg: true,
    description: "Fries loaded with melted cheese.", price: 99, sizes: null, image: "assets/food/starter.svg" },

  /* ---------------- PASTA — Menu (C) ---------------- */
  { id: "pa01", name: "White Sauce Pasta", category: "pasta", veg: true,
    description: "Creamy white sauce pasta.", price: 79, sizes: null, image: "assets/food/pasta.svg" },
  { id: "pa02", name: "Red Sauce Pasta", category: "pasta", veg: true,
    description: "Classic tangy red sauce pasta.", price: 89, sizes: null, image: "assets/food/pasta.svg" },
  { id: "pa03", name: "Mix Sauce Pasta", category: "pasta", veg: true,
    description: "Pasta in a blend of red and white sauce.", price: 120, sizes: null, image: "assets/food/pasta.svg" },
  { id: "pa04", name: "Makhni Sauce Pasta", category: "pasta", veg: true,
    description: "Pasta in a rich makhni sauce.", price: 149, sizes: null, image: "assets/food/pasta.svg" },
  { id: "pa05", name: "Tandoori Sauce Pasta", category: "pasta", veg: true,
    description: "Pasta in a smoky tandoori sauce.", price: 149, sizes: null, image: "assets/food/pasta.svg" },

  /* ---------------- MAGGIE — Menu (C) ---------------- */
  { id: "mg01", name: "Plain Maggie", category: "maggie", veg: true,
    description: "Simple, classic plain Maggie.", price: 39, sizes: null, image: "assets/food/maggie.svg" },
  { id: "mg02", name: "Veg Maggie", category: "maggie", veg: true,
    description: "Maggie loaded with fresh vegetables.", price: 49, sizes: null, image: "assets/food/maggie.svg" },
  { id: "mg03", name: "Spice Tadka Maggie", category: "maggie", veg: true,
    description: "Maggie with a spicy tadka twist.", price: 59, sizes: null, image: "assets/food/maggie.svg" },
  { id: "mg04", name: "Maggie Mania", category: "maggie", veg: true,
    description: "Our fully loaded special Maggie.", price: 69, sizes: null, image: "assets/food/maggie.svg" },

  /* ---------------- SHAKE — Menu (C) ---------------- */
  { id: "sh01", name: "Banana Shake", category: "shake", veg: true,
    description: "Thick, creamy banana shake.", price: 49, sizes: null, image: "assets/food/shake.svg" },
  { id: "sh02", name: "Strawberry Shake", category: "shake", veg: true,
    description: "Classic strawberry shake.", price: 59, sizes: null, image: "assets/food/shake.svg" },
  { id: "sh03", name: "Blue Berry Shake", category: "shake", veg: true,
    description: "Rich blueberry shake.", price: 69, sizes: null, image: "assets/food/shake.svg" },
  { id: "sh04", name: "Butter Scotch Shake", category: "shake", veg: true,
    description: "Creamy butterscotch shake.", price: 69, sizes: null, image: "assets/food/shake.svg" },
  { id: "sh05", name: "Oreo Shake", category: "shake", veg: true,
    description: "Loaded Oreo cookie shake.", price: 79, sizes: null, image: "assets/food/shake.svg", featured: true },

  /* ---------------- COFFEE — Menu (C) ---------------- */
  { id: "c01", name: "Hot Coffee", category: "coffee", veg: true,
    description: "Freshly brewed hot coffee.", price: 39, sizes: null, image: "assets/food/coffee.svg" },
  { id: "c02", name: "Cold Coffee", category: "coffee", veg: true,
    description: "Chilled, frothy cold coffee.", price: 59, sizes: null, image: "assets/food/coffee.svg" },
  { id: "c03", name: "Cold Coffee + Ice Cream", category: "coffee", veg: true,
    description: "Cold coffee topped with a scoop of ice cream.", price: 79, sizes: null, image: "assets/food/coffee.svg" },
];

/* ---------------- OFFERS — from the uploaded offer poster ---------------- */
const OFFERS_DATA = [
  {
    id: "off01",
    title: "Free Cold Coffee With Ice Cream",
    description: "On every order of ₹200 or more, get a Cold Coffee With Ice Cream absolutely free.",
    tag: "On orders ₹200+"
  },
  {
    id: "off02",
    title: "Combo ₹199",
    description: "1 Pizza + 1 Sandwich + 1 Burger + 1 Cold Coffee With Ice Cream.",
    tag: "₹199"
  },
  {
    id: "off03",
    title: "Combo ₹399",
    description: "1 Medium Pizza + 2 Sandwiches + 2 Burgers + 2 Cold Coffee With Ice Cream.",
    tag: "₹399"
  },
  {
    id: "off04",
    title: "Combo ₹499",
    description: "1 Large Pizza + 2 Burgers + 2 Sandwiches + 2 Cold Coffee With Ice Cream.",
    tag: "₹499"
  },
  {
    id: "off05",
    title: "Birthday & Anniversary Cakes",
    description: "Custom celebration cakes available to order — ask in-store or on WhatsApp.",
    tag: "Ask us"
  }
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "pizza", label: "Pizza" },
  { id: "burger", label: "Burger" },
  { id: "sandwich", label: "Sandwich" },
  { id: "momos", label: "Momos" },
  { id: "pasta", label: "Pasta" },
  { id: "noodles", label: "Noodles" },
  { id: "maggie", label: "Maggie" },
  { id: "starter", label: "Starter" },
  { id: "shake", label: "Shake" },
  { id: "coffee", label: "Coffee" },
  { id: "beverages", label: "Mocktail / Mojito" },
  { id: "offers", label: "Offers" }
];

window.MENU_DATA = MENU_DATA;
window.OFFERS_DATA = OFFERS_DATA;
window.CATEGORIES = CATEGORIES;
