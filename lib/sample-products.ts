export type Product = {
  id:            string
  slug:          string
  name:          string
  category:      string
  categorySlug:  string
  price:         number
  originalPrice?: number
  images:        string[]
  stock:         number
  rating:        number
  reviews:       number
  description:   string
  specs:         Record<string, string>
  care:          string
  isNew?:        boolean
}

export const PRODUCTS: Product[] = [
  // ── Cookware ─────────────────────────────────────────────────────────────
  {
    id: '1', slug: 'cast-iron-skillet-10',
    name: 'Cast Iron Skillet 10"', category: 'Cookware', categorySlug: 'cookware',
    price: 6500, originalPrice: 8500,
    images: ['/products/cast-iron-skillet.svg'],
    stock: 8, rating: 4.8, reviews: 124,
    description: 'A kitchen staple built to last generations. Our 10" cast iron skillet delivers even heat distribution and develops a natural non-stick surface with use. Perfect for searing, frying, baking, and more — on the stovetop or in the oven.',
    specs: { 'Material': 'Pre-seasoned cast iron', 'Diameter': '25.4 cm (10")', 'Weight': '2.3 kg', 'Oven safe': 'Up to 260 °C', 'Stovetops': 'All incl. induction' },
    care: 'Hand wash only. Dry immediately and rub with a thin layer of oil after each use. Do not soak.',
  },
  {
    id: '2', slug: 'ceramic-stockpot-5l',
    name: 'Ceramic Stockpot 5L', category: 'Cookware', categorySlug: 'cookware',
    price: 8200, originalPrice: 10200,
    images: ['/products/ceramic-stockpot.svg'],
    stock: 3, rating: 4.6, reviews: 87,
    description: 'Ideal for soups, stews, pasta, and batch cooking. The ceramic coating is free from PFAS, PFOA, lead, and cadmium. Heats evenly and wipes clean.',
    specs: { 'Material': 'Aluminium core + ceramic coating', 'Capacity': '5 litres', 'Diameter': '22 cm', 'Oven safe': 'Up to 180 °C', 'Stovetops': 'Gas, electric, ceramic' },
    care: 'Dishwasher safe. Avoid metal utensils to preserve the coating.',
  },
  {
    id: '7', slug: 'stainless-saute-pan-28',
    name: 'Stainless Sauté Pan 28cm', category: 'Cookware', categorySlug: 'cookware',
    price: 5400,
    images: ['/products/ceramic-stockpot.svg'],
    stock: 15, rating: 4.5, reviews: 56, isNew: true,
    description: 'Tri-ply stainless steel sauté pan with a wide flat base for excellent browning and a high straight side for saucing. Non-reactive — ideal for acidic sauces.',
    specs: { 'Material': 'Tri-ply stainless steel 18/10', 'Diameter': '28 cm', 'Capacity': '3.5 litres', 'Oven safe': 'Up to 260 °C', 'Stovetops': 'All incl. induction' },
    care: 'Dishwasher safe. Use Bar Keepers Friend to maintain the polish.',
  },
  {
    id: '8', slug: 'nonstick-fry-pan-24',
    name: 'Non-Stick Fry Pan 24cm', category: 'Cookware', categorySlug: 'cookware',
    price: 3800, originalPrice: 4600,
    images: ['/products/cast-iron-skillet.svg'],
    stock: 22, rating: 4.3, reviews: 203,
    description: 'Everyday fry pan with a durable granite non-stick coating. Eggs slide right off, oil consumption is minimal, and clean-up is effortless.',
    specs: { 'Material': 'Hard-anodised aluminium', 'Diameter': '24 cm', 'Coating': 'Granite non-stick (PFOA-free)', 'Oven safe': 'Up to 200 °C', 'Stovetops': 'Gas, electric, ceramic' },
    care: 'Hand wash recommended. Use silicone or wooden utensils only.',
  },
  // ── Bakeware ──────────────────────────────────────────────────────────────
  {
    id: '5', slug: 'ceramic-mixing-bowls',
    name: 'Ceramic Mixing Bowl Set', category: 'Bakeware', categorySlug: 'bakeware',
    price: 5200, originalPrice: 7000,
    images: ['/products/mixing-bowls.svg'],
    stock: 7, rating: 4.9, reviews: 61,
    description: 'Three nested stoneware bowls in our signature sage glaze — 1.5 L, 2.5 L, and 4 L. Each has a non-slip base, pour spout, and ergonomic handle.',
    specs: { 'Material': 'Stoneware ceramic', 'Set': '1.5 L + 2.5 L + 4 L', 'Microwave safe': 'Yes', 'Dishwasher safe': 'Yes' },
    care: 'Dishwasher safe. Avoid sudden temperature changes.',
  },
  {
    id: '6', slug: 'non-stick-loaf-pan',
    name: 'Non-Stick Loaf Pan', category: 'Bakeware', categorySlug: 'bakeware',
    price: 2200, originalPrice: 3000,
    images: ['/products/loaf-pan.svg'],
    stock: 18, rating: 4.4, reviews: 39, isNew: true,
    description: 'Heavy-gauge carbon steel loaf pan with a premium non-stick coating. Reinforced rim prevents warping; the dark finish promotes even browning.',
    specs: { 'Material': 'Carbon steel + non-stick coating', 'Size': '23 × 13 × 7 cm', 'Oven safe': 'Up to 230 °C', 'Dishwasher safe': 'No' },
    care: 'Hand wash with warm soapy water. Dry immediately. No metal utensils.',
  },
  {
    id: '9', slug: 'muffin-tray-12-cup',
    name: '12-Cup Muffin Tray', category: 'Bakeware', categorySlug: 'bakeware',
    price: 2800,
    images: ['/products/loaf-pan.svg'],
    stock: 25, rating: 4.6, reviews: 44,
    description: 'Heavy-gauge steel muffin tray with 12 deep cups and a non-stick coating. The wide flanged rim makes it easy to grip with oven gloves.',
    specs: { 'Material': 'Carbon steel + non-stick', 'Cups': '12 standard', 'Cup depth': '3.2 cm', 'Oven safe': 'Up to 230 °C' },
    care: 'Hand wash only. Dry immediately to prevent rust.',
  },
  // ── Cutlery ───────────────────────────────────────────────────────────────
  {
    id: '4', slug: 'chefs-knife-8',
    name: "Chef's Knife 8\"", category: 'Cutlery', categorySlug: 'cutlery',
    price: 4800, originalPrice: 6200,
    images: ['/products/chefs-knife.svg'],
    stock: 25, rating: 4.9, reviews: 178,
    description: "Our most popular knife. The 8\" chef's knife handles 90 % of kitchen tasks — chopping, slicing, dicing, mincing. German high-carbon steel holds an edge exceptionally well, and the full-tang handle gives perfect balance.",
    specs: { 'Blade': 'High-carbon stainless (X50CrMoV15)', 'Length': '20 cm (8")', 'Hardness': '58 HRC', 'Handle': 'Triple-riveted pakkawood', 'Balance': 'At the bolster' },
    care: 'Hand wash only. Dry immediately. Hone before each use; sharpen every 3–6 months.',
  },
  {
    id: '10', slug: 'paring-knife-3-5',
    name: 'Paring Knife 3.5"', category: 'Cutlery', categorySlug: 'cutlery',
    price: 2400,
    images: ['/products/chefs-knife.svg'],
    stock: 30, rating: 4.7, reviews: 92, isNew: true,
    description: 'The perfect small knife for peeling, trimming, and detail work. Same high-carbon steel as our chef\'s knife in a compact blade that gives total control.',
    specs: { 'Blade': 'High-carbon stainless (X50CrMoV15)', 'Length': '9 cm (3.5")', 'Hardness': '58 HRC', 'Handle': 'Triple-riveted pakkawood' },
    care: 'Hand wash only. Dry immediately. Sharpen as needed.',
  },
  // ── Utensils ──────────────────────────────────────────────────────────────
  {
    id: '3', slug: 'acacia-cutting-board',
    name: 'Acacia Cutting Board', category: 'Utensils', categorySlug: 'utensils',
    price: 3100, originalPrice: 4200,
    images: ['/products/cutting-board.svg'],
    stock: 14, rating: 4.8, reviews: 214,
    description: 'Large acacia end-grain cutting board with a deep juice groove around the perimeter. The end-grain construction is gentle on knife edges and self-healing over time.',
    specs: { 'Material': 'Sustainably sourced acacia', 'Size': '45 × 30 × 2.5 cm', 'Juice groove': '0.8 cm deep', 'Hanging hole': 'Yes' },
    care: 'Hand wash only. Dry upright. Oil monthly with food-grade mineral oil.',
  },
  {
    id: '11', slug: 'silicone-utensil-set',
    name: 'Silicone Utensil Set — 6 pcs', category: 'Utensils', categorySlug: 'utensils',
    price: 3600, originalPrice: 4800,
    images: ['/products/utensil-set.svg'],
    stock: 19, rating: 4.5, reviews: 67, isNew: true,
    description: 'Six essential silicone-tipped tools: spatula, ladle, slotted spoon, pasta spoon, whisk, and tongs. Heat-resistant to 260 °C and safe on all cookware surfaces.',
    specs: { 'Pieces': '6 (spatula, ladle, slotted spoon, pasta spoon, whisk, tongs)', 'Heat resistant': '260 °C', 'Handle': 'Stainless steel', 'Dishwasher safe': 'Yes' },
    care: 'Dishwasher safe. Avoid direct flame contact.',
  },
  // ── Small Appliances ──────────────────────────────────────────────────────
  {
    id: '12', slug: 'electric-kettle-1-7l',
    name: 'Electric Kettle 1.7L', category: 'Small Appliances', categorySlug: 'appliances',
    price: 4200, originalPrice: 5500,
    images: ['/products/ceramic-stockpot.svg'],
    stock: 12, rating: 4.7, reviews: 98,
    description: 'Rapid-boil 1.7L electric kettle with 5 temperature presets for green tea, white tea, oolong, coffee, and boiling. Keeps warm for 30 minutes. Stainless steel interior.',
    specs: { 'Capacity': '1.7 litres', 'Power': '2400 W', 'Presets': '5 temperature settings', 'Keep warm': '30 minutes', 'Cord': '360° swivel base' },
    care: 'Descale monthly with a citric acid solution. Wipe exterior with a damp cloth.',
  },
  {
    id: '13', slug: 'hand-blender-700w',
    name: 'Hand Blender 700W', category: 'Small Appliances', categorySlug: 'appliances',
    price: 5800, originalPrice: 7200,
    images: ['/products/utensil-set.svg'],
    stock: 8, rating: 4.6, reviews: 74, isNew: true,
    description: 'Powerful 700W immersion blender for soups, smoothies, sauces, and baby food. Variable speed dial, stainless steel blending shaft, and a 600 ml beaker included.',
    specs: { 'Power': '700 W', 'Speeds': 'Variable dial + turbo', 'Shaft': 'Stainless steel, detachable', 'Included': '600 ml beaker, whisk attachment' },
    care: 'Detach shaft and rinse under running water immediately after use. Wipe handle with a damp cloth.',
  },
  // ── Storage & Org ─────────────────────────────────────────────────────────
  {
    id: '14', slug: 'glass-canister-set',
    name: 'Glass Canister Set — 4 pcs', category: 'Storage & Org', categorySlug: 'storage',
    price: 3800, originalPrice: 5000,
    images: ['/products/mixing-bowls.svg'],
    stock: 16, rating: 4.8, reviews: 52,
    description: 'Four airtight glass canisters in graduated sizes — perfect for flour, sugar, coffee, and pasta. Bamboo lids with silicone seals lock in freshness. Stackable design saves counter space.',
    specs: { 'Sizes': '0.5 L, 1 L, 1.5 L, 2 L', 'Material': 'Borosilicate glass + bamboo lid', 'Airtight': 'Yes — silicone seal', 'Dishwasher safe': 'Glass only' },
    care: 'Hand wash lids only. Glass is dishwasher safe. Dry thoroughly before storing dry goods.',
  },
  {
    id: '15', slug: 'drawer-organiser-set',
    name: 'Bamboo Drawer Organiser', category: 'Storage & Org', categorySlug: 'storage',
    price: 2400,
    images: ['/products/cutting-board.svg'],
    stock: 20, rating: 4.5, reviews: 33, isNew: true,
    description: 'Expandable bamboo drawer organiser with 5 adjustable compartments. Fits most standard kitchen drawers. Keeps utensils, cutlery, and gadgets neatly sorted.',
    specs: { 'Material': 'Sustainable bamboo', 'Expandable': '33–53 cm width', 'Compartments': '5 adjustable', 'Height': '6 cm' },
    care: 'Wipe clean with a damp cloth. Oil occasionally to maintain the finish.',
  },
  // ── Dinnerware ────────────────────────────────────────────────────────────
  {
    id: '16', slug: 'stoneware-dinner-set-12pc',
    name: 'Stoneware Dinner Set 12 pc', category: 'Dinnerware', categorySlug: 'dinnerware',
    price: 12500, originalPrice: 16000,
    images: ['/products/mixing-bowls.svg'],
    stock: 6, rating: 4.9, reviews: 41,
    description: 'A 12-piece stoneware set — 4 dinner plates, 4 side plates, and 4 bowls — in a classic sage glaze. Chip-resistant glaze, microwave and dishwasher safe. Each piece is slightly unique from the hand-dipping process.',
    specs: { 'Pieces': '4 dinner plates (28 cm), 4 side plates (20 cm), 4 bowls (16 cm)', 'Material': 'Stoneware', 'Microwave': 'Yes', 'Dishwasher': 'Yes' },
    care: 'Dishwasher safe. Avoid stacking more than 8 plates high.',
  },
  {
    id: '17', slug: 'salad-serving-bowl-large',
    name: 'Salad Serving Bowl — Large', category: 'Dinnerware', categorySlug: 'dinnerware',
    price: 3200, originalPrice: 4200,
    images: ['/products/mixing-bowls.svg'],
    stock: 11, rating: 4.7, reviews: 29, isNew: true,
    description: 'A wide, shallow stoneware serving bowl — ideal for salads, pasta, and sharing dishes. The reactive glaze produces a one-of-a-kind finish on every piece.',
    specs: { 'Diameter': '32 cm', 'Depth': '9 cm', 'Material': 'Stoneware', 'Microwave': 'Yes', 'Dishwasher': 'Yes' },
    care: 'Dishwasher safe. Hand wash recommended to preserve the reactive glaze over time.',
  },
  // ── Coffee & Tea ──────────────────────────────────────────────────────────
  {
    id: '18', slug: 'pour-over-coffee-set',
    name: 'Pour-Over Coffee Set', category: 'Coffee & Tea', categorySlug: 'coffee-tea',
    price: 4800, originalPrice: 6200,
    images: ['/products/ceramic-stockpot.svg'],
    stock: 9, rating: 4.8, reviews: 63,
    description: 'A complete pour-over set: borosilicate glass dripper, stainless steel filter (reusable), and a 600 ml carafe. Brews 1–2 cups with full control over extraction.',
    specs: { 'Carafe': '600 ml borosilicate glass', 'Filter': 'Stainless steel, reusable', 'Dripper': 'Glass with silicone grip', 'Cups': '1–2' },
    care: 'Dishwasher safe. Rinse the stainless filter after every use.',
  },
  {
    id: '19', slug: 'ceramic-teapot-900ml',
    name: 'Ceramic Teapot 900ml', category: 'Coffee & Tea', categorySlug: 'coffee-tea',
    price: 3400,
    images: ['/products/ceramic-stockpot.svg'],
    stock: 14, rating: 4.6, reviews: 47, isNew: true,
    description: 'A hand-glazed 900ml ceramic teapot with a built-in stainless steel infuser basket. Brews loose-leaf tea with room to fully expand the leaves.',
    specs: { 'Capacity': '900 ml (approx. 4 cups)', 'Material': 'Stoneware + stainless infuser', 'Microwave': 'Yes (without lid)', 'Dishwasher': 'Yes' },
    care: 'Remove the infuser before placing in the dishwasher. Do not microwave with the stainless infuser inserted.',
  },
  // ── Outdoor & BBQ ─────────────────────────────────────────────────────────
  {
    id: '20', slug: 'cast-iron-grill-pan',
    name: 'Cast Iron Grill Pan 28cm', category: 'Outdoor & BBQ', categorySlug: 'outdoor',
    price: 5200, originalPrice: 6800,
    images: ['/products/cast-iron-skillet.svg'],
    stock: 7, rating: 4.7, reviews: 55,
    description: 'Ridged cast iron grill pan for authentic char marks indoors or over a flame. Pre-seasoned and ready to use. Works on all heat sources including open fire and induction.',
    specs: { 'Material': 'Pre-seasoned cast iron', 'Size': '28 × 28 cm', 'Ridges': '5 mm raised', 'Oven safe': 'Up to 260 °C', 'Stovetops': 'All incl. induction & open flame' },
    care: 'Hand wash only. Dry immediately and apply a thin layer of oil after each use.',
  },
  {
    id: '21', slug: 'bbq-tool-set-5pc',
    name: 'BBQ Tool Set — 5 pcs', category: 'Outdoor & BBQ', categorySlug: 'outdoor',
    price: 4400, originalPrice: 5800,
    images: ['/products/utensil-set.svg'],
    stock: 13, rating: 4.5, reviews: 38, isNew: true,
    description: 'Five stainless steel BBQ tools — spatula, tongs, fork, basting brush, and skewers — in a carry case. Extra-long handles keep hands away from the heat.',
    specs: { 'Pieces': '5 + carry case', 'Handle length': '45 cm', 'Material': 'Stainless steel + rosewood handle', 'Case': 'Canvas zip carry bag' },
    care: 'Hand wash after each use. Dry thoroughly before storing to prevent rust.',
  },
  // ── Cleaning & Care ───────────────────────────────────────────────────────
  {
    id: '22', slug: 'dish-brush-set',
    name: 'Dish Brush Set — 3 pcs', category: 'Cleaning & Care', categorySlug: 'cleaning',
    price: 1800, originalPrice: 2400,
    images: ['/products/utensil-set.svg'],
    stock: 30, rating: 4.6, reviews: 88,
    description: 'Three plant-fibre dish brushes in graduated sizes: large pot brush, bottle brush, and detail brush. Stiff enough to scrub stuck-on food, gentle enough for ceramic coatings.',
    specs: { 'Pieces': '3', 'Bristles': 'Plant fibre (agave)', 'Handle': 'FSC-certified beechwood', 'Dishwasher safe': 'No' },
    care: 'Rinse after use and store upright to dry. Replace when bristles splay.',
  },
  {
    id: '23', slug: 'cast-iron-care-kit',
    name: 'Cast Iron Care Kit', category: 'Cleaning & Care', categorySlug: 'cleaning',
    price: 2200,
    images: ['/products/cutting-board.svg'],
    stock: 22, rating: 4.8, reviews: 61, isNew: true,
    description: 'Everything you need to maintain cast iron: a chainmail scrubber, a pan scraper, a tin of food-grade flaxseed oil, and a lint-free seasoning cloth.',
    specs: { 'Includes': 'Chainmail scrubber, pan scraper, 100ml seasoning oil, cloth', 'Scrubber': 'Stainless steel chainmail', 'Oil': 'Food-grade flaxseed' },
    care: 'Rinse the chainmail scrubber and dry after use. Store the oil in a cool, dark place.',
  },
]

export const CATEGORIES = [
  { slug: 'cookware',   label: 'Cookware'         },
  { slug: 'bakeware',   label: 'Bakeware'         },
  { slug: 'cutlery',    label: 'Cutlery'          },
  { slug: 'utensils',   label: 'Utensils'         },
  { slug: 'appliances', label: 'Small Appliances' },
  { slug: 'storage',    label: 'Storage & Org'    },
  { slug: 'dinnerware', label: 'Dinnerware'       },
  { slug: 'coffee-tea', label: 'Coffee & Tea'     },
  { slug: 'outdoor',    label: 'Outdoor & BBQ'    },
  { slug: 'cleaning',   label: 'Cleaning & Care'  },
  { slug: 'new',        label: 'New Arrivals'     },
  { slug: 'sale',       label: 'Sale'             },
]

export function getProductBySlug(slug: string) {
  return PRODUCTS.find(p => p.slug === slug) ?? null
}

export function getRelatedProducts(product: Product, limit = 4) {
  return PRODUCTS
    .filter(p => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit)
}
