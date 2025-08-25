export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  warnings?: string;
  categoryId: string;
  subcategoryId?: string;
  image: string;
  additionalImages?: string[];
  popular: boolean;
  featured: boolean;
  inStock: boolean;
  stockCount?: number;
  sizes?: {
    size: string;
    price: string;
    originalPrice: string;
  }[];
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: {
    id: string;
    name: string;
    description: string;
  }[];
}

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
    sku: "OG-GOGOPAININ-001",
    name: "Go Go Pain – Intense Pain Reliever",
    description:
      "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inf...",
    longDescription:
      "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxing power of 15 herbal oils to offer relief from the most stubborn aches and pains.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.6,
    reviews: 73,
    benefits: ["Pain Relief", "Anti-Inflammatory"],
    ingredients: ["MSM", "Magnesium", "Herbal Extract Blend", "Essential Oils"],
    usage: "Apply topically to affected area 2-3 times daily or as needed.",
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
    sku: "OG-NIGHTCARE-002",
    name: "Night Care",
    description:
      "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin d...",
    longDescription:
      "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent evening routine. Replenish the moisture barrier, by gently and mindfully massaging in Night Care, allowing the essential oils and herbal nutrients to rejuvenate heal your skin.",
    price: "R200",
    originalPrice: "R260",
    rating: 4.7,
    reviews: 96,
    benefits: ["Skin Health"],
    ingredients: ["Herbal Extract Blend", "Essential Oils"],
    usage: "Apply to clean skin and massage gently until absorbed.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/night_care.webp",
    additionalImages: [
      "/products/night_care_4.webp",
      "/products/night_care_6.webp",
      "/products/night_care_7.webp",
      "/products/night_care_8.webp",
    ],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 84,
    tags: ["products-under-r250", "skin-and-beauty"],
  },
  {
    id: 3,
    sku: "OG-HYDRATIONR-003",
    name: "Hydration Recipe Pack",
    description:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R30",
    originalPrice: "R39",
    rating: 4.8,
    reviews: 119,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/hydration_recipe_pack.webp",
    additionalImages: [
      "/products/hydration_recipe_pack_4.webp",
      "/products/hydration_recipe_pack_7.webp",
    ],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 101,
    tags: [],
  },
  {
    id: 4,
    sku: "OG-BESPOKEVIP-004",
    name: "Bespoke VIP Wellness nutrition plan with Dr Mel",
    description:
      "R1500 per month (for 3 months minimum) This bespoke VIP nutrition plan is crafted by Dr Mel, taking...",
    longDescription:
      "R1500 per month (for 3 months minimum) This bespoke VIP nutrition plan is crafted by Dr Mel, taking into account your personal health needs, lifestyle and goals. Start your journey towards optimal wellness with expert guidance tailored just for you.",
    price: "R1500",
    originalPrice: "R1950",
    rating: 4.9,
    reviews: 142,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
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
    stockCount: 118,
    tags: [],
  },
  {
    id: 5,
    sku: "OG-BRONCHIALR-005",
    name: "Bronchial Relief",
    description:
      "Bronchial Relief is designed to open airways and support respiratory function. This natural remedy c...",
    longDescription:
      "Bronchial Relief is designed to open airways and support respiratory function. This natural remedy combines powerful herbs to help you breathe easier and support lung health naturally.",
    price: "R185",
    originalPrice: "R240",
    rating: 5.0,
    reviews: 165,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/bronchial_relief.webp",
    additionalImages: [
      "/products/bronchial_relief_4.jpeg",
      "/products/bronchial_relief_6.webp",
      "/products/bronchial_relief_8.webp",
    ],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 135,
    tags: ["respiratory-health"],
  },
  {
    id: 6,
    sku: "OG-PLANTINSPI-006",
    name: "Plant-Inspired Recipe Pack – Something for Breakfast",
    description:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription:
      "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R30",
    originalPrice: "R39",
    rating: 4.6,
    reviews: 188,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image:
      "/products/plant-inspired_recipe_pack_–_something_for_breakfast_4.webp",
    additionalImages: [
      "/products/plant-inspired_recipe_pack_–_something_for_breakfast_6.webp",
    ],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 152,
    tags: ["recipes"],
  },
  {
    id: 7,
    sku: "OG-ANTIVIRALB-007",
    name: "Anti-Viral & Bacterial",
    description:
      "Our Anti-Viral & Bacterial formula is a powerful blend of natural ingredients designed to support y...",
    longDescription:
      "Our Anti-Viral & Bacterial formula is a powerful blend of natural ingredients designed to support your immune system and help your body defend against viral and bacterial threats naturally.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.7,
    reviews: 211,
    benefits: ["Immune Support"],
    ingredients: ["Herbal Extract Blend"],
    usage:
      "Take 1-2 capsules daily with meals or as directed by healthcare provider.",
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
    stockCount: 169,
    tags: [],
  },
  {
    id: 8,
    sku: "OG-RAWPROBIOT-008",
    name: "Raw Pro-Biotic Gut Repair",
    description:
      "Our Raw Pro-Biotic Gut Repair formula contains beneficial bacteria strains to restore gut health an...",
    longDescription:
      "Our Raw Pro-Biotic Gut Repair formula contains beneficial bacteria strains to restore gut health and support digestive wellness. This powerful probiotic blend helps maintain optimal gut microbiome balance.",
    price: "R225",
    originalPrice: "R292",
    rating: 4.8,
    reviews: 234,
    benefits: ["Gut Health", "Digestive Health"],
    ingredients: ["Probiotic Strains"],
    usage:
      "Take 1-2 capsules daily with meals or as directed by healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/raw_pro-biotic_gut_repair.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 186,
    tags: [],
  },
  {
    id: 9,
    sku: "OG-HUFFPUFF-009",
    name: "Huff & Puff",
    description:
      "Huff & Puff is specially formulated to support respiratory health and help you breathe easier natur...",
    longDescription:
      "Huff & Puff is specially formulated to support respiratory health and help you breathe easier naturally. This gentle yet effective blend supports clear airways and comfortable breathing.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.9,
    reviews: 257,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/huff_&_puff.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 53,
    tags: [],
  },
  {
    id: 10,
    sku: "OG-GUTFIX7DAY-010",
    name: "Gut Fix 7 Day Program",
    description:
      "Our comprehensive 7-day gut healing program designed to reset and restore your digestive health nat...",
    longDescription:
      "Our comprehensive 7-day gut healing program designed to reset and restore your digestive health naturally. This structured program includes everything you need for a complete gut health transformation.",
    price: "R450",
    originalPrice: "R585",
    rating: 5.0,
    reviews: 280,
    benefits: ["Digestive Health"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "digital-products",
    subcategoryId: "programs",
    image: "/products/gut_fix_7_day_program_5.webp",
    additionalImages: ["/products/gut_fix_7_day_program_7.webp"],
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 70,
    tags: [],
  },
  {
    id: 11,
    sku: "OG-8WEEKJOUR-011",
    name: "8 Week Journey back to Wellness",
    description:
      "Embark on a transformative 8-week wellness journey designed to restore your health and vitality nat...",
    longDescription:
      "Embark on a transformative 8-week wellness journey designed to restore your health and vitality naturally. This comprehensive program guides you step-by-step towards optimal wellness.",
    price: "R850",
    originalPrice: "R1105",
    rating: 4.6,
    reviews: 303,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "digital-products",
    subcategoryId: "programs",
    image: "/products/gut_fix_7_day_program_5.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 87,
    tags: [],
  },
  {
    id: 12,
    sku: "OG-GUTFIXSEMO-012",
    name: "Gut Fix Semosis™",
    description:
      "Our innovative Gut Fix Semosis™ approach combines cutting-edge wellness science with natural heali...",
    longDescription:
      "Our innovative Gut Fix Semosis™ approach combines cutting-edge wellness science with natural healing principles to provide comprehensive gut health support and restoration.",
    price: "R320",
    originalPrice: "R416",
    rating: 4.7,
    reviews: 326,
    benefits: ["Digestive Health"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/gut_fix_semosis™.jpeg",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 104,
    tags: [],
  },
  {
    id: 13,
    sku: "OG-KEEPGROWIN-013",
    name: "Keep Growing",
    description:
      "Keep Growing is our motivational wellness support designed to help you maintain momentum on your he...",
    longDescription:
      "Keep Growing is our motivational wellness support designed to help you maintain momentum on your health journey. This comprehensive approach supports continued growth and wellness development.",
    price: "R150",
    originalPrice: "R195",
    rating: 4.8,
    reviews: 349,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/keep_growing.png",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 121,
    tags: [],
  },
  {
    id: 14,
    sku: "OG-PLANTBASED-014",
    name: "Plant-Based Milk Recipe Pack",
    description:
      "Discover delicious and nutritious plant-based milk recipes with our comprehensive digital guide. Pe...",
    longDescription:
      "Discover delicious and nutritious plant-based milk recipes with our comprehensive digital guide. Perfect for those seeking dairy-free alternatives and plant-based nutrition options.",
    price: "R30",
    originalPrice: "R39",
    rating: 4.9,
    reviews: 372,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/plant-based_milk_recipe_pack.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 138,
    tags: [],
  },
  {
    id: 15,
    sku: "OG-FLUCOMBO-015",
    name: "Flu Combo",
    description:
      "Our powerful Flu Combo formula combines natural immune-supporting ingredients to help your body fig...",
    longDescription:
      "Our powerful Flu Combo formula combines natural immune-supporting ingredients to help your body fight off seasonal challenges and maintain optimal health during cold and flu season.",
    price: "R225",
    originalPrice: "R292",
    rating: 5.0,
    reviews: 395,
    benefits: ["Immune Support"],
    ingredients: ["Herbal Extract Blend"],
    usage:
      "Take 1-2 capsules daily with meals or as directed by healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/flu_combo.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 155,
    tags: [],
  },
  {
    id: 16,
    sku: "OG-JUSTCOLLAG-016",
    name: "Just Collagen",
    description:
      "Just Collagen provides pure, high-quality collagen peptides to support skin, joint, and overall we...",
    longDescription:
      "Just Collagen provides pure, high-quality collagen peptides to support skin, joint, and overall wellness. This premium supplement helps maintain healthy skin elasticity and joint function.",
    price: "R420",
    originalPrice: "R546",
    rating: 4.6,
    reviews: 418,
    benefits: ["Anti-Aging", "Skin Health"],
    ingredients: ["Collagen Peptides"],
    usage:
      "Take 1-2 capsules daily with meals or as directed by healthcare provider.",
    warnings:
      "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/just_collagen_4.webp",
    additionalImages: ["/products/just_collagen_5.webp"],
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 172,
    tags: [],
  },
  {
    id: 17,
    sku: "OG-PLANTINSPI-017",
    name: "Plant-Inspired Recipe Pack – Something for Lunch or Dinner",
    description:
      "Explore delicious plant-based lunch and dinner options with our comprehensive recipe collection. Pe...",
    longDescription:
      "Explore delicious plant-based lunch and dinner options with our comprehensive recipe collection. Perfect for creating nutritious, satisfying meals that support your wellness journey.",
    price: "R30",
    originalPrice: "R39",
    rating: 4.7,
    reviews: 441,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/plant-based_milk_recipe_pack.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 189,
    tags: ["recipes"],
  },
  {
    id: 18,
    sku: "OG-BELLYBUGS-018",
    name: "Belly Bugs",
    description:
      "Belly Bugs is a gentle, natural formula designed to support digestive comfort and gut health for t...",
    longDescription:
      "Belly Bugs is a gentle, natural formula designed to support digestive comfort and gut health for the whole family. This carefully crafted blend helps maintain digestive balance naturally.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.8,
    reviews: 464,
    benefits: ["Digestive Health"],
    ingredients: ["Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "digestive",
    image: "/products/belly_bugs.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 56,
    tags: [],
  },
  {
    id: 19,
    sku: "OG-PLANTINSPI-019",
    name: "Plant-Inspired Recipe Pack – Something for Dessert",
    description:
      "Indulge in healthy, plant-based dessert recipes that satisfy your sweet tooth while supporting you...",
    longDescription:
      "Indulge in healthy, plant-based dessert recipes that satisfy your sweet tooth while supporting your wellness goals. Our dessert recipe pack proves that healthy can be delicious.",
    price: "R30",
    originalPrice: "R39",
    rating: 4.9,
    reviews: 487,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/hydration_recipe_pack.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 73,
    tags: ["recipes"],
  },
  {
    id: 20,
    sku: "OG-EYEREPAIR-020",
    name: "Eye Repair",
    description:
      "Eye Repair is specially formulated to support eye health and vision wellness naturally. This gentl...",
    longDescription:
      "Eye Repair is specially formulated to support eye health and vision wellness naturally. This gentle yet effective formula helps maintain healthy vision and supports overall eye comfort.",
    price: "R240",
    originalPrice: "R312",
    rating: 5.0,
    reviews: 510,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/eye_repair_5.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 90,
    tags: [],
  },
];

// Utility functions
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
  return products.filter((product) => product.tags.includes(tag));
};

export const getRelatedProducts = (
  productId: number,
  limit: number = 4,
): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const related = products.filter(
    (p) =>
      p.id !== productId &&
      (p.categoryId === product.categoryId ||
        p.tags.some((tag) => product.tags.includes(tag))),
  );

  return related.slice(0, limit);
};
