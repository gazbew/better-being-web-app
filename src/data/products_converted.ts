import { Product, Category } from '@/types/product';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  warnings?: string;
  categoryId: string;
  subcategoryId: string;
  image: string;
  additionalImages: string[];
  popular: boolean;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

export const categories: Category[] = [
  {
    "id": "wellness-essentials",
    "name": "Wellness Essentials",
    "description": "Core supplements for daily health and vitality",
    "icon": "Heart",
    "subcategories": [
      {
        "id": "multivitamins",
        "name": "Multivitamins",
        "description": "Complete vitamin and mineral support"
      },
      {
        "id": "pain-relief",
        "name": "Pain Relief",
        "description": "Natural pain management solutions"
      },
      {
        "id": "energy-support",
        "name": "Energy Support",
        "description": "Natural energy and vitality boosters"
      },
      {
        "id": "digestive",
        "name": "Digestive Health",
        "description": "Gut health and digestive support"
      },
      {
        "id": "respiratory",
        "name": "Respiratory Health",
        "description": "Breathing and lung support"
      }
    ]
  },
  {
    "id": "natural-skincare",
    "name": "Natural Skincare",
    "description": "Pure, organic skincare solutions",
    "icon": "Sparkles",
    "subcategories": [
      {
        "id": "skincare",
        "name": "Face Care",
        "description": "Natural facial care products"
      },
      {
        "id": "body-care",
        "name": "Body Care",
        "description": "Nourishing body care essentials"
      }
    ]
  },
  {
    "id": "digital-products",
    "name": "Digital Wellness",
    "description": "E-books, guides and digital wellness resources",
    "icon": "BookOpen",
    "subcategories": [
      {
        "id": "ebooks",
        "name": "Recipe E-Books",
        "description": "Digital recipe collections and guides"
      },
      {
        "id": "programs",
        "name": "Wellness Programs",
        "description": "Structured wellness programs"
      }
    ]
  }
];

export const products: Product[] = [
  {
    "id": 1,
    "sku": "OG-GOGOPAI-001",
    "name": "Go Go Pain \u2013 Intense Pain Reliever",
    "description": "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxi...",
    "longDescription": "Go Go Pain is an intense pain reliever enhanced with MSM and magnesium oil and combines the anti-inflammatory and relaxing power of 15 herbal oils to offer relief from the most stubborn aches and pains.",
    "price": "R18500",
    "originalPrice": null,
    "rating": 5.0,
    "reviews": 83,
    "benefits": [
      "Pain Relief",
      "Energy Support",
      "Nutritional Support",
      "Nutritional Support",
      "Skin Health",
      "Respiratory Support",
      "Pain Relief",
      "Energy Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/go_go_pain_intense_pain_reliever.webp",
    "additionalImages": [
      "/products/go_go_pain_intense_pain_reliever_5.webp",
      "/products/go_go_pain_intense_pain_reliever_5.webp",
      "/products/go_go_pain_intense_pain_reliever_5.webp",
      "/products/go_go_pain_intense_pain_reliever_2.webp"
    ],
    "popular": false,
    "featured": true,
    "inStock": true,
    "stockCount": 121,
    "tags": [
      "bone-joint-and-muscle",
      "energy-and-fitness",
      "products-under-r250",
      "nutrition-and-supplements",
      "recipes",
      "skin-and-beauty",
      "respiratory-health"
    ]
  },
  {
    "id": 2,
    "sku": "OG-NIGCAR-002",
    "name": "Night Care",
    "description": "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent...",
    "longDescription": "50mlJust like climbing into a made bed feels like a reward for the hard work of the day, your skin deserves an indulgent evening routine. Replenish the moisture barrier, by gently and mindfully massaging in Night Care, allowing the essential oils and herbal nutrients to rejuvenate heal your skin.",
    "price": "R20000",
    "originalPrice": null,
    "rating": 5.0,
    "reviews": 44,
    "benefits": [
      "Skin Health",
      "Skin Health",
      "Nutritional Support",
      "Skin Health",
      "Nutritional Support",
      "Skin Health"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/night_care.webp",
    "additionalImages": [
      "/products/night_care_2.webp",
      "/products/night_care_2.webp",
      "/products/night_care_3.webp",
      "/products/night_care_5.webp"
    ],
    "popular": false,
    "featured": true,
    "inStock": true,
    "stockCount": 54,
    "tags": [
      "products-under-r250",
      "skin-and-beauty",
      "nutrition-and-supplements",
      "recipes"
    ]
  },
  {
    "id": 3,
    "sku": "OG-HYDRECPAC-003",
    "name": "Hydration Recipe Pack",
    "description": "Downloadable E-Book \u2013 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    "longDescription": "Downloadable E-Book \u2013 14 Page Recipe Pack focused on a plant based (vegan) diet.",
    "price": "R3000",
    "originalPrice": null,
    "rating": 4.5,
    "reviews": 58,
    "benefits": [
      "Nutritional Support",
      "Respiratory Support",
      "Skin Health",
      "Nutritional Support",
      "Nutritional Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/hydration_recipe_pack.webp",
    "additionalImages": [
      "/products/hydration_recipe_pack_3.webp",
      "/products/hydration_recipe_pack_3.webp",
      "/products/hydration_recipe_pack_4.webp",
      "/products/hydration_recipe_pack_3.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 145,
    "tags": [
      "nutrition-and-supplements",
      "products-under-r250",
      "recipes",
      "womens-health",
      "respiratory-health",
      "skin-and-beauty"
    ]
  },
  {
    "id": 4,
    "sku": "OG-BESVIPWEL-004",
    "name": "Bespoke VIP Wellness nutrition plan with Dr Mel",
    "description": "",
    "longDescription": "",
    "price": "R1000000",
    "originalPrice": null,
    "rating": 4.1,
    "reviews": 55,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel.webp",
    "additionalImages": [
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_4.webp",
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_4.webp",
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_5.webp",
      "/products/bespoke_vip_wellness_nutrition_plan_with_dr_mel_5.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 37,
    "tags": [
      "services",
      "gut-health"
    ]
  },
  {
    "id": 5,
    "sku": "OG-BROREL-005",
    "name": "Bronchial Relief",
    "description": "Bronchial Relief is based on the principals of ancient Ayurvedic medicine. The various herbs are carefully blended, extr...",
    "longDescription": "Bronchial Relief is based on the principals of ancient Ayurvedic medicine. The various herbs are carefully blended, extracted and preserved with lemon juice and raw honey creating a gentle fermentation process.",
    "price": "R19500",
    "originalPrice": "R19523",
    "rating": 4.1,
    "reviews": 16,
    "benefits": [
      "Respiratory Support",
      "Skin Health",
      "Skin Health",
      "Respiratory Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/bronchial_relief.webp",
    "additionalImages": [
      "/products/bronchial_relief_5.webp",
      "/products/bronchial_relief_2.webp",
      "/products/bronchial_relief_4.webp",
      "/products/bronchial_relief_4.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 46,
    "tags": [
      "products-under-r250",
      "respiratory-health",
      "gut-health",
      "skin-and-beauty",
      "detox",
      "mens-health"
    ]
  },
  {
    "id": 6,
    "sku": "OG-PLARECPAC-006",
    "name": "Plant-Inspired Recipe Pack \u2013 Something for Breakfast",
    "description": "Downloadable E-Book \u2013 45 Page Recipe Pack focused on a plant based (vegan) diet.",
    "longDescription": "Downloadable E-Book \u2013 45 Page Recipe Pack focused on a plant based (vegan) diet.",
    "price": "R8000",
    "originalPrice": "R8047",
    "rating": 4.5,
    "reviews": 62,
    "benefits": [
      "Nutritional Support",
      "Nutritional Support",
      "Skin Health"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/plant-inspired_recipe_pack_something_for_breakfast.webp",
    "additionalImages": [
      "/products/plant-inspired_recipe_pack_something_for_breakfast_2.webp",
      "/products/plant-inspired_recipe_pack_something_for_breakfast_5.webp",
      "/products/plant-inspired_recipe_pack_something_for_breakfast_4.webp",
      "/products/plant-inspired_recipe_pack_something_for_breakfast_3.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 71,
    "tags": [
      "nutrition-and-supplements",
      "products-under-r250",
      "recipes",
      "mens-health",
      "gut-health",
      "immunity",
      "womens-health",
      "skin-and-beauty"
    ]
  },
  {
    "id": 7,
    "sku": "OG-ANT&BAC-007",
    "name": "Anti-Viral & Bacterial",
    "description": "Anti-Viral & Bacterial to assist the immune system in fighting the \u2018bad guys\u2019 to be used along side the Acidosis to assi...",
    "longDescription": "Anti-Viral & Bacterial to assist the immune system in fighting the \u2018bad guys\u2019 to be used along side the Acidosis to assist in getting rid of the die off of that bacteria or virus in the body helping you avoid the typical detox symptoms and stiffness & body aches.",
    "price": "R21500",
    "originalPrice": null,
    "rating": 4.7,
    "reviews": 126,
    "benefits": [
      "Skin Health",
      "Skin Health",
      "Nutritional Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/anti-viral_bacterial.webp",
    "additionalImages": [
      "/products/anti-viral_bacterial_3.webp",
      "/products/anti-viral_bacterial_5.webp",
      "/products/anti-viral_bacterial_5.webp",
      "/products/anti-viral_bacterial_4.webp"
    ],
    "popular": true,
    "featured": true,
    "inStock": true,
    "stockCount": 25,
    "tags": [
      "immunity",
      "products-under-r250",
      "skin-and-beauty",
      "nutrition-and-supplements",
      "recipes"
    ]
  },
  {
    "id": 8,
    "sku": "OG-RAWPROGUT-008",
    "name": "Raw Pro-Biotic Gut Repair",
    "description": "Raw Pro-biotic Gut Repair is a vegan probiotic that contains multiple strains and classes of beneficial live bacteria.",
    "longDescription": "Raw Pro-biotic Gut Repair is a vegan probiotic that contains multiple strains and classes of beneficial live bacteria.",
    "price": "R22500",
    "originalPrice": "R22540",
    "rating": 4.9,
    "reviews": 77,
    "benefits": [
      "Pain Relief",
      "Energy Support",
      "Nutritional Support",
      "Nutritional Support",
      "Skin Health"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/raw_pro-biotic_gut_repair.webp",
    "additionalImages": [
      "/products/raw_pro-biotic_gut_repair_2.webp",
      "/products/raw_pro-biotic_gut_repair_2.webp",
      "/products/raw_pro-biotic_gut_repair_3.webp",
      "/products/raw_pro-biotic_gut_repair_2.webp"
    ],
    "popular": false,
    "featured": true,
    "inStock": true,
    "stockCount": 127,
    "tags": [
      "gut-health",
      "immunity",
      "products-under-r250",
      "bone-joint-and-muscle",
      "energy-and-fitness",
      "nutrition-and-supplements",
      "recipes",
      "skin-and-beauty"
    ]
  },
  {
    "id": 9,
    "sku": "OG-HUF&PUF-009",
    "name": "Huff & Puff",
    "description": "Everything our Bronchial Relief Herbal Remedy for adults offers optimised for the young bodies of our OG Kids.Aids in: B...",
    "longDescription": "Everything our Bronchial Relief Herbal Remedy for adults offers optimised for the young bodies of our OG Kids.Aids in: Bronchitis, cough, sore throat, anti-viral, anti-bacterial, weak lungs, chest cold, flu, immunity.\u2013 200ml",
    "price": "R15000",
    "originalPrice": null,
    "rating": 4.5,
    "reviews": 78,
    "benefits": [
      "Respiratory Support",
      "Respiratory Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "respiratory",
    "image": "/products/huff_puff.webp",
    "additionalImages": [
      "/products/huff_puff_3.webp",
      "/products/huff_puff_5.webp",
      "/products/huff_puff_2.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 40,
    "tags": [
      "respiratory-health",
      "products-under-r250"
    ]
  },
  {
    "id": 10,
    "sku": "OG-GUTFIX7-010",
    "name": "Gut Fix 7 Day Program",
    "description": "Accelerate your healing with this scientific and nutritional way of restoring your gut.You will receive:7 days of delici...",
    "longDescription": "Accelerate your healing with this scientific and nutritional way of restoring your gut.You will receive:7 days of delicious gut healing recipes using food as medicineA guided sequence using gut fix & our raw probiotic to optimize your gut health and microbiome",
    "price": "R45000",
    "originalPrice": null,
    "rating": 4.5,
    "reviews": 49,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/gut_fix_7_day_program.webp",
    "additionalImages": [
      "/products/gut_fix_7_day_program_2.webp",
      "/products/gut_fix_7_day_program_4.webp",
      "/products/gut_fix_7_day_program_4.webp",
      "/products/gut_fix_7_day_program_3.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 116,
    "tags": [
      "gut-health",
      "services",
      "products-under-r250"
    ]
  },
  {
    "id": 11,
    "sku": "OG-8WEEJOU-011",
    "name": "8 Week Journey back to Wellness",
    "description": "The journey to wellness is an 8-week programme designed to balance your hormones and to switch on the genes that create ...",
    "longDescription": "The journey to wellness is an 8-week programme designed to balance your hormones and to switch on the genes that create health.Your body changes as you age, and fluctuations in your hormones can affect your metabolism and digestion.Read More about this programme here \u2013Read More",
    "price": "R400000",
    "originalPrice": null,
    "rating": 4.6,
    "reviews": 51,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/8_week_journey_back_to_wellness.webp",
    "additionalImages": [
      "/products/8_week_journey_back_to_wellness_2.webp",
      "/products/8_week_journey_back_to_wellness_3.webp",
      "/products/8_week_journey_back_to_wellness_3.webp",
      "/products/8_week_journey_back_to_wellness_4.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 71,
    "tags": [
      "services",
      "gut-health"
    ]
  },
  {
    "id": 12,
    "sku": "OG-GUTFIXSEM-012",
    "name": "Gut Fix Semosis\u2122",
    "description": "Gut Fix Semosis\u2122 is a herbal health drink that offers rapid and effective improvement of most digestive issues and conta...",
    "longDescription": "Gut Fix Semosis\u2122 is a herbal health drink that offers rapid and effective improvement of most digestive issues and contains probiotic enzymes, the power of 11 herbs and aloe.",
    "price": "R18500",
    "originalPrice": null,
    "rating": 4.5,
    "reviews": 150,
    "benefits": [
      "Nutritional Support",
      "Pain Relief",
      "Energy Support",
      "Skin Health",
      "Nutritional Support",
      "Nutritional Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/gut_fix_semosis.webp",
    "additionalImages": [
      "/products/gut_fix_semosis_4.webp",
      "/products/gut_fix_semosis_2.webp",
      "/products/gut_fix_semosis_5.webp",
      "/products/gut_fix_semosis_4.webp"
    ],
    "popular": true,
    "featured": false,
    "inStock": true,
    "stockCount": 149,
    "tags": [
      "gut-health",
      "products-under-r250",
      "nutrition-and-supplements",
      "recipes",
      "bone-joint-and-muscle",
      "energy-and-fitness",
      "skin-and-beauty"
    ]
  },
  {
    "id": 13,
    "sku": "OG-KEEGRO-013",
    "name": "Keep Growing",
    "description": "Keep Growing is a universal probiotic that improves soil health, promotes greener grass, enhances pest control, and supp...",
    "longDescription": "Keep Growing is a universal probiotic that improves soil health, promotes greener grass, enhances pest control, and supports better growth for fruits, vegetables, and flowers. It also helps restore soil nutrients and covers a 50-square-metre garden.",
    "price": "R13500",
    "originalPrice": "R13541",
    "rating": 4.5,
    "reviews": 118,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/keep_growing.webp",
    "additionalImages": [
      "/products/keep_growing_4.webp",
      "/products/keep_growing_4.webp"
    ],
    "popular": true,
    "featured": false,
    "inStock": true,
    "stockCount": 33,
    "tags": [
      "farming"
    ]
  },
  {
    "id": 14,
    "sku": "OG-PLAMILREC-014",
    "name": "Plant-Based Milk Recipe Pack",
    "description": "",
    "longDescription": "",
    "price": "R5000",
    "originalPrice": null,
    "rating": 4.4,
    "reviews": 77,
    "benefits": [
      "Nutritional Support",
      "Pain Relief",
      "Energy Support",
      "Skin Health",
      "Nutritional Support",
      "Skin Health"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/plant-based_milk_recipe_pack.webp",
    "additionalImages": [
      "/products/plant-based_milk_recipe_pack_4.webp",
      "/products/plant-based_milk_recipe_pack_2.webp",
      "/products/plant-based_milk_recipe_pack_4.webp",
      "/products/plant-based_milk_recipe_pack_3.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 139,
    "tags": [
      "nutrition-and-supplements",
      "products-under-r250",
      "recipes",
      "gut-health",
      "bone-joint-and-muscle",
      "energy-and-fitness",
      "skin-and-beauty"
    ]
  },
  {
    "id": 15,
    "sku": "OG-FLUCOM-015",
    "name": "Flu Combo",
    "description": "This Powerful Flu Combo works together in harmony to correct, support and nourish your immune system to fight off viral ...",
    "longDescription": "This Powerful Flu Combo works together in harmony to correct, support and nourish your immune system to fight off viral and bacterial infections such as the common flu. A combination of our Bronchial Probiotic for lung support and ease of breath; Anti-Viral & Bacterial to assist the immune system in fighting the \u2018bad guys\u2019 and the Acidosis to assist in getting rid of the die off of that bacteria or virus in the body helping you avoid the typical detox symptoms and stiffness & body aches.",
    "price": "R58000",
    "originalPrice": "R58037",
    "rating": 4.9,
    "reviews": 66,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/flu_combo.webp",
    "additionalImages": [
      "/products/flu_combo_5.webp",
      "/products/flu_combo_3.webp",
      "/products/flu_combo_4.webp",
      "/products/flu_combo_3.webp"
    ],
    "popular": false,
    "featured": true,
    "inStock": true,
    "stockCount": 28,
    "tags": [
      "immunity",
      "gut-health",
      "products-under-r250"
    ]
  },
  {
    "id": 16,
    "sku": "OG-JUSCOL-016",
    "name": "Just Collagen",
    "description": "Ethically sourced \u2013 Pure Hydrolysed Collagen Peptides Type 1 & 3",
    "longDescription": "Ethically sourced \u2013 Pure Hydrolysed Collagen Peptides Type 1 & 3",
    "price": "R42000",
    "originalPrice": null,
    "rating": 4.3,
    "reviews": 49,
    "benefits": [
      "Nutritional Support",
      "Nutritional Support",
      "Skin Health",
      "Nutritional Support",
      "Nutritional Support",
      "Nutritional Support",
      "Nutritional Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/just_collagen.webp",
    "additionalImages": [
      "/products/just_collagen_4.webp",
      "/products/just_collagen_5.webp",
      "/products/just_collagen_3.webp",
      "/products/just_collagen_3.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": false,
    "stockCount": 147,
    "tags": [
      "nutrition-and-supplements",
      "skin-and-beauty",
      "products-under-r250",
      "recipes"
    ]
  },
  {
    "id": 17,
    "sku": "OG-PLARECPAC-017",
    "name": "Plant-Inspired Recipe Pack \u2013 Something for Lunch or Dinner",
    "description": "Downloadable E-Book \u2013 56 Page Recipe Pack focused on a plant based (vegan) diet.",
    "longDescription": "Downloadable E-Book \u2013 56 Page Recipe Pack focused on a plant based (vegan) diet.",
    "price": "R8000",
    "originalPrice": "R8046",
    "rating": 4.7,
    "reviews": 110,
    "benefits": [
      "Nutritional Support",
      "Nutritional Support",
      "Nutritional Support",
      "Nutritional Support",
      "Pain Relief",
      "Energy Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "digital-products",
    "subcategoryId": "ebooks",
    "image": "/products/plant-inspired_recipe_pack_something_for_lunch_or_dinner.webp",
    "additionalImages": [
      "/products/plant-inspired_recipe_pack_something_for_lunch_or_dinner_3.webp",
      "/products/plant-inspired_recipe_pack_something_for_lunch_or_dinner_4.webp",
      "/products/plant-inspired_recipe_pack_something_for_lunch_or_dinner_4.webp",
      "/products/plant-inspired_recipe_pack_something_for_lunch_or_dinner_3.webp"
    ],
    "popular": true,
    "featured": true,
    "inStock": true,
    "stockCount": 132,
    "tags": [
      "nutrition-and-supplements",
      "products-under-r250",
      "recipes",
      "gut-health",
      "immunity",
      "bone-joint-and-muscle",
      "energy-and-fitness"
    ]
  },
  {
    "id": 18,
    "sku": "OG-BELBUG-018",
    "name": "Belly Bugs",
    "description": "See this one as the best of both worlds, where \u2018Gut Fix\u2019 meets our Raw Vegan Probiotic- Gut Repair, but with a much nice...",
    "longDescription": "See this one as the best of both worlds, where \u2018Gut Fix\u2019 meets our Raw Vegan Probiotic- Gut Repair, but with a much nicer taste so that the OG Kids can enjoy it too! Contains herbal extracts, beneficial digestive enzymes and live probiotics, to treat the causes of digestive issues and restore a healthy balance in gastro-intestinal tract.\u2013 200ml",
    "price": "R15000",
    "originalPrice": null,
    "rating": 4.6,
    "reviews": 108,
    "benefits": [
      "General Wellness"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    "categoryId": "wellness-essentials",
    "subcategoryId": "multivitamins",
    "image": "/products/belly_bugs.webp",
    "additionalImages": [
      "/products/belly_bugs_3.webp",
      "/products/belly_bugs_3.webp",
      "/products/belly_bugs_4.webp",
      "/products/belly_bugs_5.webp"
    ],
    "popular": true,
    "featured": false,
    "inStock": true,
    "stockCount": 127,
    "tags": [
      "gut-health",
      "products-under-r250",
      "services",
      "immunity"
    ]
  },
  {
    "id": 19,
    "sku": "OG-PLARECPAC-019",
    "name": "Plant-Inspired Recipe Pack \u2013 Something for Dessert",
    "description": "Downloadable E-Book \u2013 27 Page Recipe Pack focused on a plant based (vegan) diet.",
    "longDescription": "Downloadable E-Book \u2013 27 Page Recipe Pack focused on a plant based (vegan) diet.",
    "price": "R7000",
    "originalPrice": "R7039",
    "rating": 4.5,
    "reviews": 90,
    "benefits": [
      "Nutritional Support",
      "Nutritional Support",
      "Nutritional Support",
      "Skin Health",
      "Nutritional Support"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/plant-inspired_recipe_pack_something_for_dessert.webp",
    "additionalImages": [
      "/products/plant-inspired_recipe_pack_something_for_dessert_3.webp",
      "/products/plant-inspired_recipe_pack_something_for_dessert_3.webp",
      "/products/plant-inspired_recipe_pack_something_for_dessert_3.webp",
      "/products/plant-inspired_recipe_pack_something_for_dessert_2.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 95,
    "tags": [
      "nutrition-and-supplements",
      "products-under-r250",
      "recipes",
      "mens-health",
      "skin-and-beauty"
    ]
  },
  {
    "id": 20,
    "sku": "OG-EYEREP-020",
    "name": "Eye Repair",
    "description": "50mlRestore your eyes with intelligence of helichrysum oil while reducing the appearance of wrinkles and age spots with ...",
    "longDescription": "50mlRestore your eyes with intelligence of helichrysum oil while reducing the appearance of wrinkles and age spots with frankincense oil.",
    "price": "R31000",
    "originalPrice": "R31046",
    "rating": 4.3,
    "reviews": 81,
    "benefits": [
      "Skin Health",
      "Skin Health",
      "Skin Health",
      "Skin Health",
      "Skin Health",
      "Skin Health"
    ],
    "ingredients": [
      "Natural ingredients"
    ],
    "usage": "Follow package instructions or consult healthcare provider.",
    "warnings": "",
    "categoryId": "natural-skincare",
    "subcategoryId": "skincare",
    "image": "/products/eye_repair.webp",
    "additionalImages": [
      "/products/eye_repair_4.webp",
      "/products/eye_repair_4.webp",
      "/products/eye_repair_4.webp",
      "/products/eye_repair_4.webp"
    ],
    "popular": false,
    "featured": false,
    "inStock": true,
    "stockCount": 72,
    "tags": [
      "skin-and-beauty",
      "products-under-r250"
    ]
  }
];


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
