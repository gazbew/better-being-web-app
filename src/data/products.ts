import type { Product, Category } from "@/types/product";

export const categories: Category[] = [
  {
    id: "wellness-essentials",
    name: "Wellness Essentials",
    description: "Core supplements for daily health and vitality",
    icon: "Heart",
    subcategories: [
      {
        id: "multivitamins",
        name: "Multivitamins",
        description: "Complete vitamin and mineral support",
      },
      {
        id: "pain-relief",
        name: "Pain Relief",
        description: "Natural pain management solutions",
      },
      {
        id: "energy-support",
        name: "Energy Support",
        description: "Natural energy and vitality boosters",
      },
      {
        id: "digestive",
        name: "Digestive Health",
        description: "Gut health and digestive support",
      },
      {
        id: "respiratory",
        name: "Respiratory Health",
        description: "Breathing and lung support",
      },
    ],
  },
  {
    id: "natural-skincare",
    name: "Natural Skincare",
    description: "Pure, organic skincare solutions",
    icon: "Sparkles",
    subcategories: [
      {
        id: "skincare",
        name: "Face Care",
        description: "Natural facial care products",
      },
      {
        id: "body-care",
        name: "Body Care",
        description: "Nourishing body care essentials",
      },
    ],
  },
  {
    id: "digital-products",
    name: "Digital Wellness",
    description: "E-books, guides and digital wellness resources",
    icon: "BookOpen",
    subcategories: [
      {
        id: "ebooks",
        name: "Recipe E-Books",
        description: "Digital recipe collections and guides",
      },
      {
        id: "programs",
        name: "Wellness Programs",
        description: "Structured wellness programs",
      },
    ],
  },
];

export const products: Product[] = [
  {
    id: 1,
    sku: "OG-GOG-001",
    name: "Go Go Pain – Intense Pain Reliever",
    description:
      "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxing power of...",
    longDescription:
      "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxing power of 15 herbal oils to offer relief from the most stubborn aches and pains.",
    price: "R185",
    originalPrice: "R220",
    rating: 4.7,
    reviews: 89,
    benefits: ["Pain Relief", "Energy Support"],
    ingredients: ["MSM", "Magnesium Oil", "15 Herbal Oils"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "pain-relief",
    image: "/products/go_go_pain_–_intense_pain_reliever.webp",
    additionalImages: [
      "/products/go_go_pain_–_intense_pain_reliever_2.webp",
      "/products/go_go_pain_–_intense_pain_reliever_3.webp",
      "/products/go_go_pain_–_intense_pain_reliever_4.webp",
      "/products/go_go_pain_–_intense_pain_reliever_5.webp",
    ],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 67,
    tags: [
      "bone-joint-and-muscle",
      "energy-and-fitness",
      "products-under-r250",
      "nutrition-and-supplements",
    ],
  },
  {
    id: 2,
    sku: "OG-NIG-002",
    name: "Night Care",
    description:
      "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent evening...",
    longDescription:
      "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent evening routine. Replenish the moisture barrier, by gently and mindfully massaging in Night Care, allowing the essential oils and herbal nutrients to rejuvenate heal your skin.",
    price: "R200",
    originalPrice: null,
    rating: 4.6,
    reviews: 73,
    benefits: ["Skin Health"],
    ingredients: ["Essential Oils", "Herbal Nutrients"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings: "",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/night_care.webp",
    additionalImages: [
      "/products/night_care_4.webp",
      "/products/night_care_6.webp",
      "/products/night_care_7.webp",
      "/products/night_care_8.webp",
    ],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 92,
    tags: ["products-under-r250", "skin-and-beauty"],
  },
  {
    id: 3,
    sku: "OG-HYD-003",
    name: "Hydration Recipe Pack",
    description:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R30",
    originalPrice: null,
    rating: 4.4,
    reviews: 45,
    benefits: ["General Wellness"],
    ingredients: ["Natural ingredients"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings: "",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/hydration_recipe_pack.webp",
    additionalImages: [
      "/products/hydration_recipe_pack_4.webp",
      "/products/hydration_recipe_pack_7.webp",
    ],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 128,
    tags: ["recipes", "nutrition-and-supplements", "products-under-r250"],
  },
  {
    id: 4,
    sku: "OG-RAW-004",
    name: "Raw Pro-biotic Gut Repair",
    description:
      "Support your digestive health with our raw probiotic gut repair formula.",
    longDescription:
      "Support your digestive health with our raw probiotic gut repair formula designed to restore and maintain optimal gut function.",
    price: "R350",
    originalPrice: "R385",
    rating: 4.8,
    reviews: 112,
    benefits: ["Nutritional Support"],
    ingredients: ["Raw Probiotics", "Gut Repair Formula"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/raw_pro-biotic_gut_repair.webp",
    additionalImages: [],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 58,
    tags: ["nutrition-and-supplements", "digestive-health"],
  },
  {
    id: 5,
    sku: "OG-BRO-005",
    name: "Bronchial Relief",
    description:
      "Natural bronchial and respiratory support for clear breathing.",
    longDescription:
      "Natural bronchial and respiratory support formula designed to promote clear breathing and respiratory wellness.",
    price: "R165",
    originalPrice: null,
    rating: 4.5,
    reviews: 67,
    benefits: ["Respiratory Support"],
    ingredients: ["Herbal Bronchial Blend"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/bronchial_relief.webp",
    additionalImages: [
      "/products/bronchial_relief_4.jpeg",
      "/products/bronchial_relief_6.webp",
      "/products/bronchial_relief_8.webp",
    ],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 84,
    tags: ["respiratory-health", "bone-joint-and-muscle", "energy-and-fitness"],
  },
  {
    id: 6,
    sku: "OG-JUS-006",
    name: "Just Collagen",
    description: "Pure collagen supplement for skin, hair, and joint health.",
    longDescription:
      "Pure collagen supplement formulated to support healthy skin, strong hair, and flexible joints.",
    price: "R280",
    originalPrice: "R315",
    rating: 4.7,
    reviews: 95,
    benefits: ["Skin Health", "Nutritional Support"],
    ingredients: ["Pure Collagen Peptides"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/just_collagen_4.webp",
    additionalImages: ["/products/just_collagen_5.webp"],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 76,
    tags: ["skin-and-beauty", "nutrition-and-supplements"],
  },
  {
    id: 7,
    sku: "OG-EYE-007",
    name: "Eye Repair",
    description: "Specialized formula for eye health and repair.",
    longDescription:
      "Advanced eye repair formula designed to support healthy vision and eye function.",
    price: "R245",
    originalPrice: null,
    rating: 4.3,
    reviews: 38,
    benefits: ["General Wellness"],
    ingredients: ["Eye Health Complex"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/eye_repair_5.webp",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 43,
    tags: ["nutrition-and-supplements", "products-under-r250"],
  },
  {
    id: 8,
    sku: "OG-FLU-008",
    name: "Flu Combo",
    description: "Comprehensive flu and cold support formula.",
    longDescription:
      "Comprehensive flu and cold support formula to boost immunity and speed recovery.",
    price: "R195",
    originalPrice: "R225",
    rating: 4.6,
    reviews: 81,
    benefits: ["Respiratory Support"],
    ingredients: ["Immune Support Blend"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/flu_combo.webp",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 69,
    tags: ["respiratory-health", "immune-support"],
  },
  {
    id: 9,
    sku: "OG-BEL-009",
    name: "Belly Bugs",
    description: "Natural digestive support for gut health.",
    longDescription:
      "Natural digestive support formula designed to promote healthy gut bacteria and digestive wellness.",
    price: "R180",
    originalPrice: null,
    rating: 4.4,
    reviews: 52,
    benefits: ["Nutritional Support"],
    ingredients: ["Digestive Support Blend"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/belly_bugs.webp",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 91,
    tags: ["nutrition-and-supplements", "digestive-health"],
  },
  {
    id: 10,
    sku: "OG-HUF-010",
    name: "Huff & Puff",
    description: "Respiratory support for clear breathing and lung health.",
    longDescription:
      "Respiratory support formula designed to promote clear breathing and optimal lung function.",
    price: "R175",
    originalPrice: "R210",
    rating: 4.5,
    reviews: 63,
    benefits: ["Respiratory Support"],
    ingredients: ["Lung Support Blend"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/huff_&_puff.webp",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 77,
    tags: ["respiratory-health", "breathing-support"],
  },
  {
    id: 11,
    sku: "OG-GUT-011",
    name: "Gut Fix 7 Day Program",
    description: "Complete 7-day gut health restoration program.",
    longDescription:
      "Comprehensive 7-day program designed to restore and optimize gut health with targeted nutrition and supplements.",
    price: "R450",
    originalPrice: "R495",
    rating: 4.8,
    reviews: 127,
    benefits: ["Nutritional Support"],
    ingredients: ["7-Day Gut Protocol"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/gut_fix_7_day_program_5.webp",
    additionalImages: ["/products/gut_fix_7_day_program_7.webp"],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 34,
    tags: ["nutrition-and-supplements", "digestive-health", "7-day-program"],
  },
  {
    id: 12,
    sku: "OG-GUT-012",
    name: "Gut Fix Semosis™",
    description: "Advanced gut repair technology with Semosis™.",
    longDescription:
      "Advanced gut repair formula featuring proprietary Semosis™ technology for optimal digestive health.",
    price: "R385",
    originalPrice: null,
    rating: 4.7,
    reviews: 89,
    benefits: ["Nutritional Support"],
    ingredients: ["Semosis™ Technology"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/gut_fix_semosis™.jpeg",
    additionalImages: [],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 56,
    tags: ["nutrition-and-supplements", "advanced-formula", "gut-repair"],
  },
  {
    id: 13,
    sku: "OG-KEE-013",
    name: "Keep Growing",
    description: "Growth and development support supplement.",
    longDescription:
      "Comprehensive growth and development support formula for optimal health and vitality.",
    price: "R290",
    originalPrice: "R325",
    rating: 4.4,
    reviews: 71,
    benefits: ["General Wellness"],
    ingredients: ["Growth Support Blend"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/keep_growing.png",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 85,
    tags: ["growth-support", "nutrition-and-supplements"],
  },
  {
    id: 14,
    sku: "OG-PLB-014",
    name: "Plant-Based Milk Recipe Pack",
    description: "Digital recipe pack for homemade plant-based milks.",
    longDescription:
      "Comprehensive digital recipe collection for creating delicious and nutritious plant-based milk alternatives at home.",
    price: "R45",
    originalPrice: null,
    rating: 4.2,
    reviews: 28,
    benefits: ["General Wellness"],
    ingredients: ["Natural ingredients"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings: "",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/plant-based_milk_recipe_pack.webp",
    additionalImages: [],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 150,
    tags: ["recipes", "plant-based", "ebooks"],
  },
  {
    id: 15,
    sku: "OG-PLB-015",
    name: "Plant-Inspired Recipe Pack – Something for Breakfast",
    description: "Breakfast recipe collection with plant-based inspiration.",
    longDescription:
      "Creative breakfast recipe collection featuring plant-inspired dishes to start your day with nutrition and flavor.",
    price: "R55",
    originalPrice: "R75",
    rating: 4.3,
    reviews: 42,
    benefits: ["General Wellness"],
    ingredients: ["Natural ingredients"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings: "",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image:
      "/products/plant-inspired_recipe_pack_–_something_for_breakfast_4.webp",
    additionalImages: [
      "/products/plant-inspired_recipe_pack_–_something_for_breakfast_6.webp",
    ],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 142,
    tags: ["recipes", "breakfast", "plant-inspired"],
  },
  {
    id: 16,
    sku: "OG-ANT-016",
    name: "Anti-Viral & Bacterial",
    description: "Natural immune support against viral and bacterial threats.",
    longDescription:
      "Powerful natural formula designed to support immune system function against viral and bacterial challenges.",
    price: "R225",
    originalPrice: "R260",
    rating: 4.6,
    reviews: 94,
    benefits: ["Respiratory Support"],
    ingredients: ["Immune Support Complex"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/anti-viral_&_bacterial.webp",
    additionalImages: [
      "/products/anti-viral_&_bacterial_5.webp",
      "/products/anti-viral_&_bacterial_6.webp",
      "/products/anti-viral_&_bacterial_7.webp",
      "/products/anti-viral_&_bacterial_8.webp",
    ],
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 68,
    tags: ["immune-support", "antiviral", "antibacterial"],
  },
  {
    id: 17,
    sku: "OG-BES-017",
    name: "Bespoke VIP Wellness Nutrition Plan with Dr Mel",
    description:
      "Personalized wellness consultation and nutrition plan with Dr Mel.",
    longDescription:
      "Exclusive one-on-one wellness consultation with Dr Mel including personalized nutrition planning and ongoing support.",
    price: "R1500",
    originalPrice: null,
    rating: 5.0,
    reviews: 18,
    benefits: ["General Wellness"],
    ingredients: ["Natural ingredients"],
    usage: "Follow package instructions or consult healthcare provider.",
    warnings: "",
    categoryId: "digital-products",
    subcategoryId: "programs",
    image: "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel.webp",
    additionalImages: [
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_4.webp",
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_5.webp",
    ],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 12,
    tags: ["vip-consultation", "nutrition-planning", "dr-mel"],
  },
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter((product) => product.categoryId === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured);
};

export const getPopularProducts = (): Product[] => {
  return products.filter((product) => product.popular);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
};

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByTag = (tag: string): Product[] => {
  return products.filter((product: Product) => product.tags.includes(tag));
};

export const getRelatedProducts = (
  productId: number,
  limit: number = 4,
): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const related = products.filter(
    (p: Product) =>
      p.id !== productId &&
      (p.categoryId === product.categoryId ||
        p.tags.some((tag: string) => product.tags.includes(tag))),
  );

  return related.slice(0, limit);
};
