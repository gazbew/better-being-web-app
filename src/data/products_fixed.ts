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
      { id: "multivitamins", name: "Multivitamins", description: "Complete vitamin and mineral support" },
      { id: "pain-relief", name: "Pain Relief", description: "Natural pain management solutions" },
      { id: "energy-support", name: "Energy Support", description: "Natural energy and vitality boosters" },
      { id: "digestive", name: "Digestive Health", description: "Gut health and digestive support" },
      { id: "respiratory", name: "Respiratory Health", description: "Breathing and lung support" }
    ]
  },
  {
    id: "natural-skincare",
    name: "Natural Skincare",
    description: "Pure, organic skincare solutions",
    icon: "Sparkles",
    subcategories: [
      { id: "skincare", name: "Face Care", description: "Natural facial care products" },
      { id: "body-care", name: "Body Care", description: "Nourishing body care essentials" }
    ]
  },
  {
    id: "digital-products",
    name: "Digital Wellness",
    description: "E-books, guides and digital wellness resources",
    icon: "BookOpen",
    subcategories: [
      { id: "ebooks", name: "Recipe E-Books", description: "Digital recipe collections and guides" },
      { id: "programs", name: "Wellness Programs", description: "Structured wellness programs" }
    ]
  }
];

export const products: Product[] = [
  {
    id: 1,
    sku: "OG-GOGOPAININ-001",
    name: "Go Go Pain – Intense Pain Reliever",
    description: "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inf...",
    longDescription: "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxing power of 15 herbal oils to offer relief from the most stubborn aches and pains.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.6,
    reviews: 73,
    benefits: ["Pain Relief", "Anti-Inflammatory"],
    ingredients: ["MSM", "Magnesium", "Herbal Extract Blend", "Essential Oils"],
    usage: "Apply topically to affected area 2-3 times daily or as needed.",
    warnings: "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "energy-support",
    image: "/products/go_go_pain_–_intense_pain_reliever.webp",
    additionalImages: ["/products/go_go_pain_–_intense_pain_reliever_2.webp", "/products/go_go_pain_–_intense_pain_reliever_3.webp", "/products/go_go_pain_–_intense_pain_reliever_4.webp", "/products/go_go_pain_–_intense_pain_reliever_5.webp"],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 67,
    tags: ["bone-joint-and-muscle", "energy-and-fitness", "products-under-r250", "nutrition-and-supplements"]
  },  {
    id: 2,
    sku: "OG-NIGHTCARE-002",
    name: "Night Care",
    description: "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin d...",
    longDescription: "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent evening routine. Replenish the moisture barrier, by gently and mindfully massaging in Night Care, allowing the essential oils and herbal nutrients to rejuvenate heal your skin.",
    price: "R200",
    originalPrice: "R260",
    rating: 4.7,
    reviews: 96,
    benefits: ["Skin Health"],
    ingredients: ["Herbal Extract Blend", "Essential Oils"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/night_care.webp",
    additionalImages: ["/products/night_care_4.webp", "/products/night_care_6.webp", "/products/night_care_7.webp", "/products/night_care_8.webp"],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 84,
    tags: ["products-under-r250", "skin-and-beauty", "products-under-r250", "skin-and-beauty"]
  },  {
    id: 3,
    sku: "OG-HYDRATIONR-003",
    name: "Hydration Recipe Pack",
    description: "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription: "Downloadable E-Book – 14 Page Recipe Pack focused on a plant based (vegan) diet.",
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
    additionalImages: ["/products/hydration_recipe_pack_4.webp", "/products/hydration_recipe_pack_7.webp"],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 101,
    tags: ["nutrition-and-supplements", "products-under-r250", "recipes", "products-under-r250"]
  },  {
    id: 4,
    sku: "OG-BESPOKEVIP-004",
    name: "Bespoke VIP Wellness nutrition plan with Dr Mel",
    description: "",
    longDescription: "Premium natural wellness product crafted with care.",
    price: "R10000",
    originalPrice: "R13000",
    rating: 4.9,
    reviews: 142,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel.webp",
    additionalImages: ["/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_4.webp", "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_5.webp"],
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 118,
    tags: ["services", "gut-health", "services", "services"]
  },  {
    id: 5,
    sku: "OG-BRONCHIALR-005",
    name: "Bronchial Relief",
    description: "Bronchial Relief is based on the principals of ancient Ayurvedic medicine. The various herbs are car...",
    longDescription: "Bronchial Relief is based on the principals of ancient Ayurvedic medicine. The various herbs are carefully blended, extracted and preserved with lemon juice and raw honey creating a gentle fermentation process.",
    price: "R195",
    originalPrice: "R253",
    rating: 4.5,
    reviews: 165,
    benefits: ["Pain Relief"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/bronchial_relief.webp",
    additionalImages: ["/products/bronchial_relief_4.jpeg", "/products/bronchial_relief_6.webp", "/products/bronchial_relief_8.webp"],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 135,
    tags: ["products-under-r250", "respiratory-health", "gut-health", "products-under-r250"]
  },  {
    id: 6,
    sku: "OG-PLANTINSPI-006",
    name: "Plant-Inspired Recipe Pack – Something for Breakfast",
    description: "Downloadable E-Book – 45 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription: "Downloadable E-Book – 45 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R80",
    originalPrice: "R104",
    rating: 4.6,
    reviews: 188,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/plant-inspired_recipe_pack_–_something_for_breakfast_4.webp",
    additionalImages: ["/products/plant-inspired_recipe_pack_–_something_for_breakfast_6.webp"],
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 152,
    tags: ["nutrition-and-supplements", "products-under-r250", "recipes", "mens-health"]
  },  {
    id: 7,
    sku: "OG-ANTIVIRALB-007",
    name: "Anti-Viral & Bacterial",
    description: "Anti-Viral & Bacterial to assist the immune system in fighting the ‘bad guys’ to be used along side ...",
    longDescription: "Anti-Viral & Bacterial to assist the immune system in fighting the ‘bad guys’ to be used along side the Acidosis to assist in getting rid of the die off of that bacteria or virus in the body helping you avoid the typical detox symptoms and stiffness & body aches.",
    price: "R215",
    originalPrice: "R279",
    rating: 4.7,
    reviews: 211,
    benefits: ["Immune Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/anti-viral_&_bacterial.webp",
    additionalImages: ["/products/anti-viral_&_bacterial_5.webp", "/products/anti-viral_&_bacterial_6.webp", "/products/anti-viral_&_bacterial_7.webp", "/products/anti-viral_&_bacterial_8.webp"],
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 169,
    tags: ["immunity", "products-under-r250", "products-under-r250", "skin-and-beauty"]
  },  {
    id: 8,
    sku: "OG-RAWPROBIOT-008",
    name: "Raw Pro-Biotic Gut Repair",
    description: "Raw Pro-biotic Gut Repair is a vegan probiotic that contains multiple strains and classes of benefic...",
    longDescription: "Raw Pro-biotic Gut Repair is a vegan probiotic that contains multiple strains and classes of beneficial live bacteria.",
    price: "R225",
    originalPrice: "R292",
    rating: 4.8,
    reviews: 234,
    benefits: ["Digestive Health", "Gut Health"],
    ingredients: ["Probiotic Strains"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/raw_pro-biotic_gut_repair.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 186,
    tags: ["gut-health", "immunity", "products-under-r250", "bone-joint-and-muscle"]
  },  {
    id: 9,
    sku: "OG-HUFFPUFF-009",
    name: "Huff & Puff",
    description: "Everything our Bronchial Relief Herbal Remedy for adults offers optimised for the young bodies of ou...",
    longDescription: "Everything our Bronchial Relief Herbal Remedy for adults offers optimised for the young bodies of our OG Kids.Aids in: Bronchitis, cough, sore throat, anti-viral, anti-bacterial, weak lungs, chest cold, flu, immunity.– 200ml",
    price: "R150",
    originalPrice: "R195",
    rating: 4.9,
    reviews: 257,
    benefits: ["Pain Relief"],
    ingredients: ["Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "respiratory",
    image: "/products/huff_&_puff.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 203,
    tags: ["respiratory-health", "products-under-r250", "respiratory-health"]
  },  {
    id: 10,
    sku: "OG-GUTFIX7DAY-010",
    name: "Gut Fix 7 Day Program",
    description: "Accelerate your healing with this scientific and nutritional way of restoring your gut.You will rece...",
    longDescription: "Accelerate your healing with this scientific and nutritional way of restoring your gut.You will receive:7 days of delicious gut healing recipes using food as medicineA guided sequence using gut fix & our raw probiotic to optimize your gut health and microbiome",
    price: "R450",
    originalPrice: "R585",
    rating: 4.5,
    reviews: 280,
    benefits: ["Digestive Health", "Gut Health"],
    ingredients: ["Probiotic Strains"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/gut_fix_7_day_program_5.webp",
    additionalImages: ["/products/gut_fix_7_day_program_7.webp"],
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 220,
    tags: ["gut-health", "services", "services", "gut-health"]
  },  {
    id: 11,
    sku: "OG-8WEEKJOURN-011",
    name: "8 Week Journey back to Wellness",
    description: "The journey to wellness is an 8-week programme designed to balance your hormones and to switch on th...",
    longDescription: "The journey to wellness is an 8-week programme designed to balance your hormones and to switch on the genes that create health.Your body changes as you age, and fluctuations in your hormones can affect your metabolism and digestion.Read More about this programme here –Read More",
    price: "R4000",
    originalPrice: "R5200",
    rating: 4.6,
    reviews: 303,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/placeholder.svg",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 237,
    tags: ["services", "gut-health", "services", "services"]
  },  {
    id: 12,
    sku: "OG-GUTFIXSEMO-012",
    name: "Gut Fix Semosis™",
    description: "Gut Fix Semosis™ is a herbal health drink that offers rapid and effective improvement of most digest...",
    longDescription: "Gut Fix Semosis™ is a herbal health drink that offers rapid and effective improvement of most digestive issues and contains probiotic enzymes, the power of 11 herbs and aloe.",
    price: "R185",
    originalPrice: "R240",
    rating: 4.7,
    reviews: 326,
    benefits: ["Digestive Health", "Gut Health"],
    ingredients: ["Probiotic Strains", "Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/gut_fix_semosis™.jpeg",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 54,
    tags: ["gut-health", "products-under-r250", "nutrition-and-supplements", "products-under-r250"]
  },  {
    id: 13,
    sku: "OG-KEEPGROWIN-013",
    name: "Keep Growing",
    description: "Keep Growing is a universal probiotic that improves soil health, promotes greener grass, enhances pe...",
    longDescription: "Keep Growing is a universal probiotic that improves soil health, promotes greener grass, enhances pest control, and supports better growth for fruits, vegetables, and flowers. It also helps restore soil nutrients and covers a 50-square-metre garden.",
    price: "R135",
    originalPrice: "R175",
    rating: 4.8,
    reviews: 349,
    benefits: ["Gut Health"],
    ingredients: ["Probiotic Strains", "Essential Oils"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/keep_growing.png",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 71,
    tags: ["farming"]
  },  {
    id: 14,
    sku: "OG-PLANTBASED-014",
    name: "Plant-Based Milk Recipe Pack",
    description: "",
    longDescription: "Premium natural wellness product crafted with care.",
    price: "R50",
    originalPrice: "R65",
    rating: 4.9,
    reviews: 372,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/plant-based_milk_recipe_pack.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 88,
    tags: ["nutrition-and-supplements", "products-under-r250", "recipes", "gut-health"]
  },  {
    id: 15,
    sku: "OG-FLUCOMBO-015",
    name: "Flu Combo",
    description: "This Powerful Flu Combo works together in harmony to correct, support and nourish your immune system...",
    longDescription: "This Powerful Flu Combo works together in harmony to correct, support and nourish your immune system to fight off viral and bacterial infections such as the common flu. A combination of our Bronchial Probiotic for lung support and ease of breath; Anti-Viral & Bacterial to assist the immune system in fighting the ‘bad guys’ and the Acidosis to assist in getting rid of the die off of that bacteria or virus in the body helping you avoid the typical detox symptoms and stiffness & body aches.",
    price: "R580",
    originalPrice: "R754",
    rating: 4.5,
    reviews: 395,
    benefits: ["Gut Health", "Immune Support"],
    ingredients: ["Probiotic Strains"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/flu_combo.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 105,
    tags: ["immunity", "gut-health", "immunity", "products-under-r250"]
  },  {
    id: 16,
    sku: "OG-JUSTCOLLAG-016",
    name: "Just Collagen",
    description: "Ethically sourced – Pure Hydrolysed Collagen Peptides Type 1 & 3",
    longDescription: "Ethically sourced – Pure Hydrolysed Collagen Peptides Type 1 & 3",
    price: "R420",
    originalPrice: "R546",
    rating: 4.6,
    reviews: 418,
    benefits: ["Anti-Aging"],
    ingredients: ["Collagen Peptides"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/products/just_collagen_4.webp",
    additionalImages: ["/products/just_collagen_5.webp"],
    popular: true,
    featured: false,
    inStock: false,
    stockCount: 122,
    tags: ["nutrition-and-supplements", "nutrition-and-supplements", "skin-and-beauty", "nutrition-and-supplements"]
  },  {
    id: 17,
    sku: "OG-PLANTINSPI-017",
    name: "Plant-Inspired Recipe Pack – Something for Lunch or Dinner",
    description: "Downloadable E-Book – 56 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription: "Downloadable E-Book – 56 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R80",
    originalPrice: "R104",
    rating: 4.7,
    reviews: 441,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "wellness-essentials",
    subcategoryId: "energy-support",
    image: "/placeholder.svg",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 139,
    tags: ["nutrition-and-supplements", "products-under-r250", "recipes", "nutrition-and-supplements"]
  },  {
    id: 18,
    sku: "OG-BELLYBUGS-018",
    name: "Belly Bugs",
    description: "See this one as the best of both worlds, where ‘Gut Fix’ meets our Raw Vegan Probiotic- Gut Repair, ...",
    longDescription: "See this one as the best of both worlds, where ‘Gut Fix’ meets our Raw Vegan Probiotic- Gut Repair, but with a much nicer taste so that the OG Kids can enjoy it too! Contains herbal extracts, beneficial digestive enzymes and live probiotics, to treat the causes of digestive issues and restore a healthy balance in gastro-intestinal tract.– 200ml",
    price: "R150",
    originalPrice: "R195",
    rating: 4.8,
    reviews: 464,
    benefits: ["Digestive Health", "Gut Health"],
    ingredients: ["Probiotic Strains", "Herbal Extract Blend"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/products/belly_bugs.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 156,
    tags: ["gut-health", "gut-health", "products-under-r250", "gut-health"]
  },  {
    id: 19,
    sku: "OG-PLANTINSPI-019",
    name: "Plant-Inspired Recipe Pack – Something for Dessert",
    description: "Downloadable E-Book – 27 Page Recipe Pack focused on a plant based (vegan) diet.",
    longDescription: "Downloadable E-Book – 27 Page Recipe Pack focused on a plant based (vegan) diet.",
    price: "R70",
    originalPrice: "R91",
    rating: 4.9,
    reviews: 487,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Natural Ingredients", "Herbal Blend"],
    usage: "Digital download - access instructions included in e-book.",
    categoryId: "digital-products",
    subcategoryId: "ebooks",
    image: "/placeholder.svg",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 173,
    tags: ["nutrition-and-supplements", "products-under-r250", "recipes", "mens-health"]
  },  {
    id: 20,
    sku: "OG-EYEREPAIR-020",
    name: "Eye Repair",
    description: "50mlRestore your eyes with intelligence of helichrysum oil while reducing the appearance of wrinkles...",
    longDescription: "50mlRestore your eyes with intelligence of helichrysum oil while reducing the appearance of wrinkles and age spots with frankincense oil.",
    price: "R310",
    originalPrice: "R403",
    rating: 4.5,
    reviews: 510,
    benefits: ["General Wellness", "Natural Support"],
    ingredients: ["Essential Oils"],
    usage: "Follow package directions or consult with healthcare provider.",
    categoryId: "natural-skincare",
    subcategoryId: "skincare",
    image: "/products/eye_repair_5.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 190,
    tags: ["skin-and-beauty", "products-under-r250", "skin-and-beauty", "skin-and-beauty"]
  }
];

// Utility functions
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByTag = (tag: string): Product[] => {
  return products.filter(product => product.tags.includes(tag));
};

export const getRelatedProducts = (productId: number, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const related = products.filter(p =>
    p.id !== productId &&
    (p.categoryId === product.categoryId ||
     p.tags.some(tag => product.tags.includes(tag)))
  );

  return related.slice(0, limit);
};