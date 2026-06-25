export type Recipe = {
  slug: string
  title: string
  tagline: string
  category: 'Main Dish' | 'Side & Bread' | 'Breakfast' | 'Dessert & Snack'
  origin: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Involved'
  image: string
  color: string // Tailwind bg class for placeholder
  accentColor: string // text color
  tools: string[] // Narya products that help
  ingredients: string[]
  instructions: { step: string; detail: string }[]
  tips: string[]
  nutrition?: string
}

export const RECIPES: Recipe[] = [
  {
    slug: 'ugali-sukuma-wiki',
    title: 'Ugali & Sukuma Wiki',
    tagline:
      'The cornerstone of the Kenyan table — firm maize porridge with garlicky braised kale.',
    category: 'Main Dish',
    origin: 'Nationwide staple',
    prepTime: '10 min',
    cookTime: '25 min',
    totalTime: '35 min',
    servings: 4,
    difficulty: 'Easy',
    image: '/recipes/ugali-sukuma.jpg',
    color: 'bg-amber-50',
    accentColor: 'text-amber-800',
    tools: ['Ceramic Stockpot', "Chef's Knife", 'Acacia Cutting Board'],
    ingredients: [
      '4 cups white maize flour (unga wa ugali)',
      '5 cups water',
      '1 tsp salt',
      '— For sukuma wiki —',
      '500 g kale (sukuma wiki), stems removed, leaves thinly sliced',
      '2 large tomatoes, roughly chopped',
      '1 large onion, halved and sliced',
      '3 cloves garlic, minced',
      '2 tbsp vegetable oil',
      'Salt and black pepper to taste',
    ],
    instructions: [
      {
        step: 'Boil the water',
        detail:
          'Bring 5 cups of water to a rolling boil in a heavy-bottomed stockpot. Add the salt.',
      },
      {
        step: 'Start the ugali',
        detail:
          'Reduce heat to medium. Slowly pour in 2 cups of maize flour while stirring constantly with a sturdy wooden spoon to avoid lumps.',
      },
      {
        step: 'Build the body',
        detail:
          'Once smooth, gradually add the remaining flour a little at a time, stirring vigorously after each addition. The ugali should thicken and start pulling away from the pot sides.',
      },
      {
        step: 'Steam and finish',
        detail:
          'Reduce heat to the lowest setting, cover the pot and cook 5 minutes. Stir once more, scraping the bottom, then shape into a dome with the back of the spoon.',
      },
      {
        step: 'Sauté the base',
        detail:
          'While ugali finishes, heat oil in a wide pan over medium-high heat. Fry onion until golden, about 5 minutes. Add garlic and cook 1 minute.',
      },
      {
        step: 'Cook the sukuma',
        detail:
          'Add tomatoes and stir until they break down into a sauce, about 4 minutes. Add the sukuma wiki in batches, turning to coat. Cover and cook 5–7 minutes until wilted but still vibrant green.',
      },
      {
        step: 'Season and serve',
        detail: 'Season sukuma with salt and pepper. Serve immediately alongside the ugali.',
      },
    ],
    tips: [
      "The ugali is done when it holds its shape and doesn't stick to your hands when you test a small piece.",
      'Add the flour slowly — rushing this step is what creates lumps.',
      'Sukuma wiki tastes best slightly underdone; overcooking makes it dull and mushy.',
    ],
  },

  {
    slug: 'nyama-choma',
    title: 'Nyama Choma',
    tagline:
      "Kenya's legendary grilled meat — smoky, juicy, and impossibly simple. The dish every celebration is built around.",
    category: 'Main Dish',
    origin: 'Coast & Central Kenya',
    prepTime: '20 min + 4 hr marinating',
    cookTime: '50 min',
    totalTime: '5 hr (including marinating)',
    servings: 6,
    difficulty: 'Medium',
    image: '/recipes/nyama-choma.webp',
    color: 'bg-red-50',
    accentColor: 'text-red-800',
    tools: ['Cast Iron Skillet', "Chef's Knife", 'Acacia Cutting Board'],
    ingredients: [
      '1.5 kg goat ribs or bone-in beef short ribs',
      '2 tsp coarse sea salt',
      '1 tsp freshly ground black pepper',
      'Juice of 2 lemons',
      '5 cloves garlic, crushed',
      '1 tsp paprika',
      '1 tsp cumin',
      '2 tbsp vegetable oil',
      '— Kachumbari (side salad) —',
      '3 large tomatoes, finely diced',
      '1 red onion, finely diced',
      '1 fresh green chilli, sliced',
      'Juice of 1 lemon',
      'Small bunch fresh dhania (coriander)',
      'Salt to taste',
    ],
    instructions: [
      {
        step: 'Score the meat',
        detail:
          'Using a sharp knife, make deep cuts every 3 cm into the meat to allow the marinade to penetrate all the way to the bone.',
      },
      {
        step: 'Marinate',
        detail:
          'Mix salt, pepper, lemon juice, garlic, paprika, cumin and oil into a paste. Coat the meat thoroughly, massaging into all the cuts. Cover and refrigerate for at least 4 hours, or overnight for best results.',
      },
      {
        step: 'Bring to room temperature',
        detail:
          'Remove the meat from the fridge 1 hour before cooking. Cold meat on a hot grill seizes and toughens.',
      },
      {
        step: 'Build your fire',
        detail:
          'Heat a cast iron grill pan or outdoor charcoal grill until very hot — water should evaporate instantly on contact. Brush the grates or pan lightly with oil.',
      },
      {
        step: 'Grill low and slow',
        detail:
          'Place the meat on the grill. Cook on medium-low heat, turning every 12–15 minutes. Total cook time for goat is about 45–50 minutes. The outside should be deeply charred in spots; the inside cooked through but still moist.',
      },
      {
        step: 'Rest the meat',
        detail:
          'Transfer to a board and rest for 10 minutes before serving. This step is essential — cutting too early loses all the juices.',
      },
      {
        step: 'Make kachumbari',
        detail:
          'Toss all kachumbari ingredients together. Season with salt and lemon juice. Let sit 10 minutes before serving.',
      },
    ],
    tips: [
      'Goat ribs are the classic choice, but beef short ribs or lamb shoulder work beautifully too.',
      'A cast iron pan holds heat far better than a thin pan — the sear you get is incomparable.',
      'Nyama choma is traditionally eaten with hands and is best served with ugali or roasted maize.',
      "Don't skip the rest — it's what separates dry nyama choma from the juicy version.",
    ],
  },

  {
    slug: 'kenyan-pilau',
    title: 'Kenyan Pilau',
    tagline:
      'Aromatic spiced rice slow-cooked with beef and whole spices. The crowning dish of any Kenyan celebration.',
    category: 'Main Dish',
    origin: 'Coastal Kenya & Swahili cuisine',
    prepTime: '30 min',
    cookTime: '1 hr 15 min',
    totalTime: '1 hr 45 min',
    servings: 6,
    difficulty: 'Involved',
    image: '/recipes/kenyan-pilau.webp',
    color: 'bg-yellow-50',
    accentColor: 'text-yellow-800',
    tools: ['Ceramic Stockpot', "Chef's Knife", 'Mixing Bowls'],
    ingredients: [
      '3 cups basmati rice, washed and soaked 30 minutes',
      '600 g beef (chuck or brisket), cut into 4 cm cubes',
      '2 large onions, thinly sliced',
      '4 cloves garlic, minced',
      '2 tsp fresh ginger, grated',
      '4 medium tomatoes, blended smooth',
      '4 cups beef stock or water',
      '4 tbsp vegetable oil or ghee',
      'Salt to taste',
      '— Pilau masala (grind together) —',
      '2 tsp cumin seeds',
      '1 tsp coriander seeds',
      '8 green cardamom pods, lightly crushed',
      '1 tsp black peppercorns',
      '4 cloves',
      '1 cinnamon stick (5 cm)',
      '1 tsp turmeric powder',
    ],
    instructions: [
      {
        step: 'Toast the masala',
        detail:
          'Place cumin, coriander, cardamom, peppercorns, cloves and cinnamon in a dry pan over medium heat. Toast 2–3 minutes until fragrant, shaking the pan constantly. Cool, then grind coarsely. Mix in the turmeric.',
      },
      {
        step: 'Fry the onions',
        detail:
          "Heat oil in a large heavy stockpot over medium heat. Add onions and fry, stirring frequently, until they are deep mahogany brown — about 20–25 minutes. This is the foundation of the dish; don't rush it.",
      },
      {
        step: 'Build the base',
        detail:
          'Add garlic and ginger to the onions, stir 2 minutes. Add the ground masala and stir 1 minute until fragrant.',
      },
      {
        step: 'Brown the meat',
        detail:
          'Add beef pieces and stir to coat in the spice mixture. Brown on all sides, about 8 minutes.',
      },
      {
        step: 'Simmer the meat',
        detail:
          'Add blended tomatoes, stir and cook until the mixture dries out and oil rises to the surface — about 12 minutes. Add the stock/water and salt. Bring to a boil, then cover and simmer on low for 25 minutes until the beef is tender.',
      },
      {
        step: 'Cook the rice',
        detail:
          'Drain the soaked rice and add to the pot. The liquid should just cover the rice; add a little water if needed. Stir very gently once, then bring to a boil.',
      },
      {
        step: 'Steam to finish',
        detail:
          'Once boiling, reduce heat to its lowest setting. Place a clean tea towel under the lid to absorb steam (this prevents soggy rice). Cook undisturbed for 20–22 minutes.',
      },
      {
        step: 'Rest and fluff',
        detail:
          'Remove from heat and rest, lid on, for 10 minutes. Fluff gently with a fork and serve garnished with fried onion rings and fresh dhania.',
      },
    ],
    tips: [
      'The deeply fried onions are non-negotiable — they are what gives pilau its distinctive dark, rich colour.',
      "Soaking the rice ensures even cooking. Don't skip this step.",
      'The tea towel under the lid trick is an old coastal kitchen secret for perfectly separated grains.',
      'Pilau is traditionally served at weddings and celebrations with kachumbari on the side.',
    ],
  },

  {
    slug: 'githeri',
    title: 'Githeri',
    tagline:
      'Humble, hearty, and nutritious — maize and beans slow-simmered with vegetables. A Kikuyu classic loved across Kenya.',
    category: 'Main Dish',
    origin: 'Central Kenya',
    prepTime: '15 min + overnight soaking',
    cookTime: '1 hr 30 min',
    totalTime: '1 hr 45 min + soaking',
    servings: 6,
    difficulty: 'Easy',
    image: '/recipes/githeri.webp',
    color: 'bg-orange-50',
    accentColor: 'text-orange-800',
    tools: ['Ceramic Stockpot', "Chef's Knife", 'Acacia Cutting Board'],
    ingredients: [
      '2 cups dried maize kernels (dry corn)',
      '2 cups dried red kidney beans',
      '1 large onion, diced',
      '3 large tomatoes, diced',
      '2 carrots, diced',
      '1 green bell pepper, diced',
      '3 cloves garlic, minced',
      '2 tbsp vegetable oil',
      '1 tsp ground cumin',
      '1 tsp paprika',
      'Salt and black pepper to taste',
      'Fresh dhania (coriander) to garnish',
    ],
    instructions: [
      {
        step: 'Soak overnight',
        detail:
          'Place maize and beans in separate large bowls. Cover generously with cold water and soak overnight for at least 8 hours. Drain and rinse well before cooking.',
      },
      {
        step: 'Cook the maize',
        detail:
          'Place maize in a large stockpot, cover with 2 litres of fresh water and bring to a boil. Reduce heat and simmer for 45–50 minutes until the maize is soft but still holds its shape.',
      },
      {
        step: 'Add the beans',
        detail:
          'Add the drained beans to the maize pot. Add more water to keep everything submerged. Continue simmering for 30–40 minutes until both are completely tender.',
      },
      {
        step: 'Make the sauce',
        detail:
          'While the maize and beans cook, heat oil in a separate pan. Fry onion until golden, then add garlic, cumin and paprika. Cook 2 minutes. Add tomatoes, carrots and bell pepper. Simmer until soft and saucy, about 10 minutes.',
      },
      {
        step: 'Combine and season',
        detail:
          'Drain most of the cooking water from the maize and beans, leaving about half a cup. Add the vegetable sauce and stir well to combine. Season generously with salt and black pepper.',
      },
      {
        step: 'Simmer together',
        detail:
          'Cook on low heat for 15 minutes so the flavours meld. The githeri should be thick and saucy, not soupy.',
      },
    ],
    tips: [
      'Githeri tastes even better the next day — make a big batch and refrigerate.',
      'If you have a pressure cooker, you can cook the maize and beans together in 30–35 minutes without soaking.',
      'Some people add potatoes or sweet potato for a more substantial meal.',
      'A spoonful of butter stirred in at the end adds richness.',
    ],
  },

  {
    slug: 'mandazi',
    title: 'Mandazi',
    tagline:
      "Soft, cardamom-scented fried dough — Kenya's favourite morning snack alongside a cup of chai.",
    category: 'Breakfast',
    origin: 'East African Coast',
    prepTime: '20 min + 30 min resting',
    cookTime: '25 min',
    totalTime: '1 hr 15 min',
    servings: 6,
    difficulty: 'Easy',
    image: '/recipes/mandazi.webp',
    color: 'bg-amber-50',
    accentColor: 'text-amber-900',
    tools: ['Mixing Bowls', 'Cast Iron Skillet', 'Acacia Cutting Board'],
    ingredients: [
      '3 cups all-purpose flour, plus extra for dusting',
      '2 tsp baking powder',
      '½ tsp ground cardamom',
      '¼ cup sugar',
      '¼ tsp salt',
      '1 egg, beaten',
      '1 cup warm coconut milk',
      '1 tsp vanilla extract',
      'Vegetable oil for deep frying (about 1 litre)',
    ],
    instructions: [
      {
        step: 'Mix dry ingredients',
        detail:
          'Sift flour and baking powder into a large mixing bowl. Add cardamom, sugar and salt and stir to combine.',
      },
      {
        step: 'Form the dough',
        detail:
          'Make a well in the centre. Add the beaten egg, warm coconut milk and vanilla. Mix together until a soft dough forms. Do not overwork — mix just until combined.',
      },
      {
        step: 'Knead and rest',
        detail:
          'Turn onto a lightly floured surface and knead gently for 3–4 minutes until smooth. Place back in the bowl, cover with a damp cloth and rest for 30 minutes. This relaxes the gluten for lighter mandazi.',
      },
      {
        step: 'Roll and cut',
        detail:
          'Divide the dough into 3 equal portions. Roll each out on a lightly floured surface to about 8 mm thickness. Cut into triangles or use a round cutter for circles.',
      },
      {
        step: 'Heat the oil',
        detail:
          'Pour oil into a deep pan to a depth of 6 cm. Heat to 170–175°C. To test without a thermometer: drop a small piece of dough — it should rise to the surface slowly and sizzle gently. Too fast means the oil is too hot.',
      },
      {
        step: 'Fry in batches',
        detail:
          "Fry 4–5 mandazi at a time for 3–4 minutes per side, turning once, until golden brown. Don't crowd the pan — it drops the oil temperature and makes them greasy.",
      },
      {
        step: 'Drain and serve',
        detail:
          'Remove with a slotted spoon and drain on paper towels. Serve warm with Kenyan chai.',
      },
    ],
    tips: [
      "The resting step is what makes mandazi light and airy inside. Don't skip it.",
      'The right oil temperature is crucial. Too hot and they brown before cooking through; too cool and they absorb oil.',
      'Mandazi are best eaten within a few hours of frying. Reheat briefly in a dry pan or oven to revive leftovers.',
      'For coconut-forward flavour, use full-fat coconut milk and skip the vanilla.',
    ],
  },

  {
    slug: 'kenyan-chapati',
    title: 'Kenyan Chapati',
    tagline:
      "Flaky, layered flatbread that's a staple of Kenyan homes and the perfect companion to stews, beans, or just butter.",
    category: 'Side & Bread',
    origin: 'South Asian influence, adopted across Kenya',
    prepTime: '25 min + 30 min resting',
    cookTime: '25 min',
    totalTime: '1 hr 20 min',
    servings: 4,
    difficulty: 'Medium',
    image: '/recipes/kenyan-chapati.jpg',
    color: 'bg-stone-50',
    accentColor: 'text-stone-700',
    tools: ['Cast Iron Skillet', 'Mixing Bowls', 'Acacia Cutting Board'],
    ingredients: [
      '3 cups all-purpose flour',
      '1 tsp salt',
      '1 tsp sugar',
      '3 tbsp vegetable oil, plus extra for layering',
      '¾ to 1 cup warm water (add gradually)',
    ],
    instructions: [
      {
        step: 'Make the dough',
        detail:
          'Combine flour, salt and sugar in a large bowl. Add oil and rub into the flour with your fingertips until crumbly. Gradually pour in warm water while mixing, adding just enough to form a soft, pliable dough. It should not be sticky.',
      },
      {
        step: 'Knead well',
        detail:
          "Knead on a clean surface for 8–10 minutes until smooth and elastic. The longer you knead, the more layers you'll get. The dough is ready when it springs back when poked.",
      },
      {
        step: 'Rest',
        detail:
          'Cover with a damp cloth and rest for 30 minutes at room temperature. This is essential — resting makes the dough easy to roll thin without springing back.',
      },
      {
        step: 'Divide and roll',
        detail:
          'Divide the dough into 8 equal balls. On a lightly floured surface, roll each ball into a very thin circle, about 25 cm wide and 2 mm thick.',
      },
      {
        step: 'Layer for flakiness',
        detail:
          'Brush the surface with a very thin layer of oil. Fold the circle in half, brush again with oil, then fold in half again to form a quarter-circle. You can also roll it into a log and then into a round for spiral layers.',
      },
      {
        step: 'Roll again',
        detail:
          'Roll the folded dough back out into a circle, about 20 cm wide. The layers are now built in.',
      },
      {
        step: 'Cook on a hot pan',
        detail:
          'Heat a flat pan (preferably cast iron) over medium-high heat until very hot. Cook each chapati 2–3 minutes per side until golden spots appear. Press the edges firmly with a folded cloth while cooking — this helps the layers puff.',
      },
    ],
    tips: [
      "A very hot pan is the key to good chapati. If the pan isn't hot enough, the chapati turns hard.",
      'The oil-fold-roll technique is what creates the signature layered, flaky texture.',
      'Kenyan chapati is thicker and softer than Indian chapati — aim for that pillowy texture.',
      'Stack cooked chapati and cover with a cloth to keep them soft and pliable.',
    ],
  },

  {
    slug: 'kenyan-beef-stew',
    title: 'Kenyan Beef Stew',
    tagline:
      'Rich, deeply flavoured beef and potato stew — slow-cooked until the meat is falling-tender. Sunday lunch perfection.',
    category: 'Main Dish',
    origin: 'Kenyan home cooking',
    prepTime: '15 min',
    cookTime: '1 hr 30 min',
    totalTime: '1 hr 45 min',
    servings: 5,
    difficulty: 'Medium',
    image: '/recipes/kenyan-beef-stew.jpg',
    color: 'bg-red-50',
    accentColor: 'text-red-900',
    tools: ['Ceramic Stockpot', "Chef's Knife", 'Acacia Cutting Board'],
    ingredients: [
      '800 g beef chuck or shin, cut into 5 cm cubes',
      '2 large onions, finely chopped',
      '4 large tomatoes, chopped (or 400 ml canned crushed tomatoes)',
      '3 cloves garlic, minced',
      '1 tsp fresh ginger, grated',
      '2 large potatoes, peeled and cubed',
      '2 large carrots, sliced into rounds',
      '1 tbsp tomato paste',
      '2 tbsp vegetable oil',
      '1 tsp ground cumin',
      '1 tsp paprika',
      '½ tsp turmeric',
      '2 cups water or beef stock',
      'Salt and black pepper',
      'Fresh dhania to garnish',
    ],
    instructions: [
      {
        step: 'Season and brown the beef',
        detail:
          "Pat beef cubes dry with paper towels (this is key for a good sear). Season generously with salt and pepper. Heat oil in a heavy pot over high heat and brown the beef in batches — don't crowd. Sear 2–3 minutes per side until deep brown. Remove and set aside.",
      },
      {
        step: 'Build the sauce base',
        detail:
          'In the same pot over medium heat, fry onions until golden and soft, about 8 minutes. Add garlic, ginger, cumin, paprika and turmeric. Stir for 1 minute.',
      },
      {
        step: 'Add tomatoes',
        detail:
          'Add tomato paste, then the fresh tomatoes. Stir and cook until the tomatoes break down completely and the oil begins to separate from the mixture — about 10–12 minutes. This step develops the deep flavour of the stew.',
      },
      {
        step: 'Braise the beef',
        detail:
          'Return the browned beef to the pot. Add water or stock and bring to a boil. Reduce heat to low, cover tightly and simmer for 45 minutes.',
      },
      {
        step: 'Add the vegetables',
        detail:
          'Add the potato and carrot cubes. Stir gently, replace the lid and cook for a further 25 minutes until the vegetables are completely tender and the sauce has thickened.',
      },
      {
        step: 'Adjust and serve',
        detail:
          'Taste and adjust seasoning. If the sauce is too thick, add a splash of water. Garnish with fresh dhania and serve with ugali, rice or chapati.',
      },
    ],
    tips: [
      "Browning the meat properly is the most important step — don't rush it and don't skip it.",
      'Chuck or shin are the best cuts for slow stewing; avoid lean cuts which turn dry.',
      'The stew is better the next day after the flavours have developed overnight in the fridge.',
      'Add a Royco beef cube or a tablespoon of dark soy sauce for deeper colour and umami.',
    ],
  },

  {
    slug: 'maharagwe-ya-nazi',
    title: 'Maharagwe ya Nazi',
    tagline:
      'Coastal Kenyan red kidney beans slow-cooked in spiced coconut milk. Creamy, fragrant and deeply satisfying.',
    category: 'Main Dish',
    origin: 'Kenyan Coast (Swahili)',
    prepTime: '15 min + overnight soaking',
    cookTime: '1 hr 20 min',
    totalTime: '1 hr 35 min + soaking',
    servings: 4,
    difficulty: 'Easy',
    image: '/recipes/maharagwe-ya-nazi.jpg',
    color: 'bg-orange-50',
    accentColor: 'text-orange-900',
    tools: ['Ceramic Stockpot', "Chef's Knife", 'Mixing Bowls'],
    ingredients: [
      '2 cups dried red kidney beans (or 2 × 400 g cans, drained)',
      '400 ml coconut milk (full fat)',
      '1 large onion, finely chopped',
      '3 large tomatoes, blended or finely chopped',
      '4 cloves garlic, minced',
      '1 tsp ground turmeric',
      '1 tsp ground cumin',
      '1 tsp ground coriander',
      '½ tsp paprika',
      '2 tbsp vegetable oil',
      'Salt to taste',
      'Fresh dhania and a wedge of lemon to serve',
    ],
    instructions: [
      {
        step: 'Soak and cook the beans',
        detail:
          'If using dried beans, soak overnight in cold water. Drain, rinse and place in a pot. Cover with fresh water and bring to a boil. Boil vigorously for 10 minutes (important for kidney beans), then reduce heat and simmer for 45–55 minutes until completely tender. Drain and set aside. If using canned beans, simply drain and rinse.',
      },
      {
        step: 'Fry the onions',
        detail:
          'Heat oil in a large pan over medium heat. Fry onion until soft and golden, about 8 minutes.',
      },
      {
        step: 'Add spices',
        detail:
          'Add garlic, turmeric, cumin, coriander and paprika. Stir for 1–2 minutes until fragrant.',
      },
      {
        step: 'Cook the tomatoes',
        detail:
          'Add the tomatoes and cook, stirring occasionally, until the sauce thickens and the oil begins to separate — about 10 minutes.',
      },
      {
        step: 'Add beans and coconut milk',
        detail:
          'Stir in the cooked beans and coat with the tomato masala. Pour in the coconut milk, stir gently and bring to a gentle simmer. Do not boil vigorously or the coconut milk will split.',
      },
      {
        step: 'Simmer until creamy',
        detail:
          'Cook on low heat for 20–25 minutes, stirring occasionally, until the sauce is thick and creamy and clings to the beans. Season well with salt.',
      },
      {
        step: 'Garnish and serve',
        detail:
          'Serve hot, garnished with fresh dhania and a squeeze of lemon, alongside rice or chapati.',
      },
    ],
    tips: [
      'Full-fat coconut milk gives a much richer, creamier result than reduced-fat versions.',
      'Always boil dried kidney beans vigorously for at least 10 minutes to destroy harmful lectins.',
      'Gently crush a few beans against the side of the pot — it thickens the sauce naturally.',
      'Maharagwe is traditionally eaten for breakfast on the coast with mahamri (sweet fried dough).',
    ],
  },

  {
    slug: 'samaki-wa-nazi',
    title: 'Samaki wa Nazi',
    tagline:
      'Tender fish simmered in a fragrant coconut and tomato curry. A masterpiece of the Kenyan coastal kitchen.',
    category: 'Main Dish',
    origin: 'Swahili Coast, Kenya',
    prepTime: '20 min',
    cookTime: '30 min',
    totalTime: '50 min',
    servings: 4,
    difficulty: 'Medium',
    image: '/recipes/samaki-wa-nazi.webp',
    color: 'bg-teal-50',
    accentColor: 'text-teal-800',
    tools: ['Cast Iron Skillet', "Chef's Knife", 'Acacia Cutting Board'],
    ingredients: [
      '800 g firm white fish fillets (tilapia, kingfish, or cod), cut into 6 cm pieces',
      '400 ml coconut milk',
      '3 medium tomatoes, blended',
      '1 large onion, finely sliced',
      '5 cloves garlic, minced',
      '2 tsp fresh ginger, grated',
      '2 green chillies, slit lengthways (or to taste)',
      '1 tsp ground turmeric',
      '1 tsp ground cumin',
      '1 tsp ground coriander',
      '½ tsp paprika',
      'Juice of 1 large lemon',
      '2 tbsp vegetable oil',
      'Salt to taste',
      'Fresh dhania and lemon wedges to serve',
    ],
    instructions: [
      {
        step: 'Marinate the fish',
        detail:
          'Place fish pieces in a bowl. Add ½ tsp turmeric, lemon juice and ½ tsp salt. Toss gently to coat and set aside for 15 minutes. The lemon juice slightly firms the fish and keeps it from falling apart during cooking.',
      },
      {
        step: 'Sear the fish',
        detail:
          'Heat 1 tbsp oil in a wide pan over medium-high heat. Briefly sear the fish for 1.5–2 minutes per side until just golden. It should not be cooked through. Remove carefully and set aside.',
      },
      {
        step: 'Make the masala',
        detail:
          'In the same pan, heat the remaining oil. Fry onion until soft and golden, about 8 minutes. Add garlic, ginger and green chillies — cook 2 minutes. Add all the remaining spices and stir for 1 minute.',
      },
      {
        step: 'Add the tomatoes',
        detail:
          'Pour in the blended tomatoes. Stir and cook until the sauce reduces and the oil separates from the tomato mixture — about 8–10 minutes. Season with salt.',
      },
      {
        step: 'Add coconut milk',
        detail:
          'Pour in the coconut milk and stir well. Bring to a gentle simmer — do not let it boil hard.',
      },
      {
        step: 'Finish the fish',
        detail:
          'Carefully nestle the seared fish pieces into the sauce. Spoon the sauce over the fish. Simmer gently for 8–10 minutes until the fish is cooked through and the sauce has thickened slightly.',
      },
      {
        step: 'Serve',
        detail:
          'Garnish generously with fresh dhania and lemon wedges. Serve with steamed white rice or coconut rice (wali wa nazi).',
      },
    ],
    tips: [
      'Searing the fish first gives it structure — skip this and it will break apart in the curry.',
      'Tilapia is the most widely available fish in Kenya and works beautifully. Ask your fishmonger for the freshest catch.',
      'The sauce should be spooned over the fish as it cooks rather than stirring, which keeps the pieces intact.',
      'Swahili cooks often add a dried chilli (pilipili hoho) for deeper heat.',
    ],
  },

  {
    slug: 'mukimo',
    title: 'Mukimo',
    tagline:
      'Kikuyu mashed potatoes with peas, corn and greens — a colourful, comforting one-pot dish that anchors festive meals.',
    category: 'Side & Bread',
    origin: 'Central Kenya (Kikuyu)',
    prepTime: '15 min',
    cookTime: '35 min',
    totalTime: '50 min',
    servings: 6,
    difficulty: 'Easy',
    image: '/recipes/mukimo.jpg',
    color: 'bg-green-50',
    accentColor: 'text-green-800',
    tools: ['Ceramic Stockpot', 'Mixing Bowls', "Chef's Knife"],
    ingredients: [
      '6 medium potatoes (about 1 kg), peeled and roughly cubed',
      '1½ cups fresh or frozen peas',
      '1½ cups sweet corn (fresh or frozen)',
      '200 g pumpkin leaves (or spinach / kale), washed and chopped',
      '2 tbsp butter',
      '1 tsp salt (more to taste)',
      '3 tbsp milk or cream (optional, for extra creaminess)',
    ],
    instructions: [
      {
        step: 'Cook the potatoes',
        detail:
          'Place potatoes in a large pot, cover with cold salted water and bring to a boil. Cook for 12–15 minutes until almost tender but not yet fully soft.',
      },
      {
        step: 'Add peas and corn',
        detail: 'Add peas and corn to the pot. Stir and continue cooking for 5 more minutes.',
      },
      {
        step: 'Steam the greens',
        detail:
          'Place the pumpkin leaves or spinach on top of the potatoes, peas and corn. Cover the pot tightly and allow the greens to steam for 5 minutes. The greens will wilt and cook in the steam — no extra water needed.',
      },
      {
        step: 'Drain most of the water',
        detail:
          'Drain off most of the cooking water, leaving just a few tablespoons in the pot to help with mashing. Reserve the drained liquid — you may want some back.',
      },
      {
        step: 'Mash together',
        detail:
          'Add butter and begin mashing everything together with a sturdy potato masher. Mukimo should be firm and textured — not smooth like Western mashed potatoes. You want to see distinct pieces of peas, corn and greens through the mash.',
      },
      {
        step: 'Season and adjust',
        detail:
          'Add milk or cream if you prefer a softer texture. Season generously with salt. If too thick, stir in a splash of the reserved cooking water.',
      },
    ],
    tips: [
      'Mukimo is meant to be dense and hold its shape — resist the urge to make it smooth.',
      'Pumpkin leaves (called malenge in Swahili) are the traditional green and have a slightly earthy flavour. Spinach is a fine substitute.',
      'Mukimo is the traditional accompaniment to nyama choma at Kikuyu celebrations and family gatherings.',
      'Leftovers can be sliced and pan-fried in butter the next day for a crispy, delicious breakfast.',
    ],
  },
]

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug)
}

export const RECIPE_CATEGORIES = [
  'All',
  'Main Dish',
  'Side & Bread',
  'Breakfast',
  'Dessert & Snack',
] as const
