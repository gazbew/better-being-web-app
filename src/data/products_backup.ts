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
      { id: "vitamins", name: "Vitamins", description: "Essential vitamins for optimal health" },
      { id: "minerals", name: "Minerals", description: "Key minerals for body functions" },
      { id: "multivitamins", name: "Multivitamins", description: "Complete daily nutrition" }
    ]
  },
  {
    id: "herbal-remedies",
    name: "Herbal Remedies",
    description: "Traditional herbs and botanical solutions",
    icon: "Leaf",
    subcategories: [
      { id: "adaptogens", name: "Adaptogens", description: "Stress-fighting herbs" },
      { id: "immune-herbs", name: "Immune Herbs", description: "Natural immune boosters" },
      { id: "digestive-herbs", name: "Digestive Herbs", description: "Herbs for gut health" }
    ]
  },
  {
    id: "womens-health",
    name: "Women's Health",
    description: "Specialized formulations for women",
    icon: "Heart",
    subcategories: [
      { id: "hormonal-balance", name: "Hormonal Balance", description: "Support hormonal harmony" },
      { id: "prenatal", name: "Prenatal", description: "Pregnancy and fertility support" },
      { id: "menopause", name: "Menopause", description: "Natural menopause relief" }
    ]
  },
  {
    id: "mens-health",
    name: "Men's Health",
    description: "Targeted nutrition for men",
    icon: "Shield",
    subcategories: [
      { id: "testosterone", name: "Testosterone Support", description: "Natural T-boosters" },
      { id: "prostate", name: "Prostate Health", description: "Prostate protection" },
      { id: "performance", name: "Performance", description: "Energy and stamina" }
    ]
  },
  {
    id: "digestive-health",
    name: "Digestive Health",
    description: "Complete gut health solutions",
    icon: "Zap",
    subcategories: [
      { id: "probiotics", name: "Probiotics", description: "Beneficial bacteria" },
      { id: "enzymes", name: "Enzymes", description: "Digestive enzymes" },
      { id: "gut-repair", name: "Gut Repair", description: "Intestinal healing" }
    ]
  },
  {
    id: "immune-support",
    name: "Immune Support",
    description: "Strengthen your body's defenses",
    icon: "Shield",
    subcategories: [
      { id: "daily-immune", name: "Daily Immune", description: "Everyday protection" },
      { id: "seasonal", name: "Seasonal Support", description: "Cold & flu season" },
      { id: "antioxidants", name: "Antioxidants", description: "Cell protection" }
    ]
  },
  {
    id: "brain-cognitive",
    name: "Brain & Cognitive",
    description: "Mental clarity and brain health",
    icon: "Brain",
    subcategories: [
      { id: "memory", name: "Memory Support", description: "Enhance recall" },
      { id: "focus", name: "Focus & Concentration", description: "Mental clarity" },
      { id: "mood", name: "Mood Support", description: "Emotional balance" }
    ]
  },
  {
    id: "sleep-relaxation",
    name: "Sleep & Relaxation",
    description: "Natural sleep and stress solutions",
    icon: "Moon",
    subcategories: [
      { id: "sleep-aids", name: "Sleep Aids", description: "Better sleep naturally" },
      { id: "stress-relief", name: "Stress Relief", description: "Calm and relaxation" },
      { id: "anxiety", name: "Anxiety Support", description: "Natural anxiety relief" }
    ]
  },
  {
    id: "energy-performance",
    name: "Energy & Performance",
    description: "Natural energy and athletic support",
    icon: "Zap",
    subcategories: [
      { id: "energy-boost", name: "Energy Boosters", description: "Natural energy" },
      { id: "pre-workout", name: "Pre-Workout", description: "Exercise support" },
      { id: "recovery", name: "Recovery", description: "Post-workout healing" }
    ]
  },
  {
    id: "detox-cleanse",
    name: "Detox & Cleanse",
    description: "Body purification and renewal",
    icon: "Sparkles",
    subcategories: [
      { id: "liver-detox", name: "Liver Detox", description: "Liver cleansing" },
      { id: "colon-cleanse", name: "Colon Cleanse", description: "Digestive cleansing" },
      { id: "full-body", name: "Full Body Detox", description: "Complete detox" }
    ]
  }
];

export const products: Product[] = [
  // Wellness Essentials
  {
    id: 1,
    sku: "WE-VIT-001",
    name: "Vitality Boost Complex",
    description: "Premium herbal blend for natural energy and mental clarity",
    longDescription: "Our flagship Vitality Boost Complex combines 12 powerful adaptogenic herbs with essential vitamins and minerals to provide sustained energy throughout the day. This formula has been refined over 15 years to deliver optimal results without the crash associated with synthetic energy supplements.",
    price: "R1,299",
    originalPrice: "R1,899",
    rating: 4.9,
    reviews: 2847,
    benefits: ["Increased Energy", "Mental Clarity", "Stress Relief", "Immune Support"],
    ingredients: ["Ashwagandha Root", "Rhodiola Extract", "Ginseng", "B-Vitamin Complex", "Magnesium", "Zinc", "Green Tea Extract", "L-Theanine"],
    usage: "Take 2 capsules daily with breakfast. For best results, use consistently for at least 30 days.",
    warnings: "Not suitable for pregnant or nursing women. Consult your healthcare provider before use.",
    categoryId: "wellness-essentials",
    subcategoryId: "multivitamins",
    image: "/all_prouct_shots-1.webp",
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 156,
    tags: ["energy", "mental-clarity", "adaptogen", "daily-use"]
  },
  {
    id: 2,
    sku: "WE-MIN-001",
    name: "Magnesium Complex Plus",
    description: "High-absorption magnesium blend for muscle and nerve function",
    longDescription: "Our Magnesium Complex Plus features three highly bioavailable forms of magnesium combined with vitamin D3 and K2 for optimal absorption. This formula supports over 300 enzymatic processes in the body.",
    price: "R449",
    originalPrice: "R649",
    rating: 4.9,
    reviews: 3892,
    benefits: ["Muscle Recovery", "Better Sleep", "Stress Relief", "Bone Health"],
    ingredients: ["Magnesium Glycinate", "Magnesium Citrate", "Magnesium Malate", "Vitamin D3", "Vitamin K2", "Zinc"],
    usage: "Take 2 capsules before bed or as directed by your healthcare provider.",
    categoryId: "wellness-essentials",
    subcategoryId: "minerals",
    image: "/bronchial_relief-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 234,
    tags: ["sleep", "recovery", "minerals", "stress"]
  },
  {
    id: 3,
    sku: "WE-VIT-002",
    name: "Vitamin D3 + K2",
    description: "Synergistic vitamin combo for bone and immune health",
    longDescription: "Our Vitamin D3 + K2 formula combines 5000 IU of vitamin D3 with 200mcg of vitamin K2 (MK-7) for optimal calcium absorption and bone health support.",
    price: "R399",
    originalPrice: "R549",
    rating: 4.8,
    reviews: 1567,
    benefits: ["Bone Health", "Immune Support", "Heart Health", "Calcium Absorption"],
    ingredients: ["Vitamin D3 (Cholecalciferol)", "Vitamin K2 (MK-7)", "MCT Oil", "Olive Oil"],
    usage: "Take 1 softgel daily with a meal containing fat for best absorption.",
    categoryId: "wellness-essentials",
    subcategoryId: "vitamins",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 189,
    tags: ["bone-health", "immune", "vitamins"]
  },

  // Herbal Remedies
  {
    id: 4,
    sku: "HR-ADA-001",
    name: "Pure Wellness Elixir",
    description: "Ancient botanical formula for overall health optimization",
    longDescription: "This powerful elixir combines 15 time-tested herbs from traditional medicine systems around the world. Each batch is carefully crafted using a proprietary extraction method that preserves the full spectrum of beneficial compounds.",
    price: "R1,849",
    originalPrice: "R2,699",
    rating: 4.8,
    reviews: 1923,
    benefits: ["Immune Support", "Anti-Aging", "Detox", "Energy Balance"],
    ingredients: ["Reishi Mushroom", "Astragalus", "Schisandra Berry", "Goji Berry", "Turmeric", "Ginger", "Holy Basil", "Licorice Root"],
    usage: "Mix 1 tablespoon in warm water or juice twice daily, morning and evening.",
    categoryId: "herbal-remedies",
    subcategoryId: "adaptogens",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 78,
    sizes: [
      { size: "250ml", price: "R1,849", originalPrice: "R2,699" },
      { size: "500ml", price: "R3,299", originalPrice: "R4,599" }
    ],
    tags: ["elixir", "adaptogen", "immune", "traditional"]
  },
  {
    id: 5,
    sku: "HR-IMM-001",
    name: "Immune Shield Pro",
    description: "Powerful herbal immune system support",
    longDescription: "Immune Shield Pro combines echinacea, elderberry, and medicinal mushrooms to provide comprehensive immune support during challenging times.",
    price: "R699",
    originalPrice: "R999",
    rating: 4.9,
    reviews: 2134,
    benefits: ["Immune Boost", "Antiviral Properties", "Respiratory Health", "Antioxidant"],
    ingredients: ["Echinacea Purpurea", "Elderberry Extract", "Reishi Mushroom", "Turkey Tail", "Vitamin C", "Zinc", "Selenium"],
    usage: "Take 2 capsules daily for maintenance, increase to 3-4 during immune challenges.",
    categoryId: "herbal-remedies",
    subcategoryId: "immune-herbs",
    image: "/all_prouct_shots-1.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 267,
    tags: ["immune", "antiviral", "mushrooms", "seasonal"]
  },

  // Women's Health
  {
    id: 6,
    sku: "WH-HOR-001",
    name: "Woman's Algorithm",
    description: "Specially formulated for women's hormonal balance and wellness",
    longDescription: "Woman's Algorithm is our premier women's health formula, designed to support hormonal balance throughout all life stages. This comprehensive blend addresses PMS, fertility, and menopausal transitions.",
    price: "R1,599",
    originalPrice: "R2,199",
    rating: 4.8,
    reviews: 1567,
    benefits: ["Hormonal Balance", "Mood Support", "Energy Boost", "Skin Health"],
    ingredients: ["Vitex Berry", "Dong Quai", "Black Cohosh", "Maca Root", "Evening Primrose Oil", "B6", "Folate", "Iron"],
    usage: "Take 2 capsules daily with food, preferably in the morning.",
    warnings: "Not for use during pregnancy unless directed by healthcare provider.",
    categoryId: "womens-health",
    subcategoryId: "hormonal-balance",
    image: "/all_prouct_shots-1.webp",
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 145,
    tags: ["hormones", "pms", "fertility", "women"]
  },
  {
    id: 7,
    sku: "WH-PRE-001",
    name: "Prenatal Complete",
    description: "Comprehensive prenatal nutrition for mother and baby",
    longDescription: "Our Prenatal Complete provides all essential nutrients needed during pregnancy and breastfeeding, featuring methylated folate and gentle, non-constipating iron.",
    price: "R799",
    originalPrice: "R1,099",
    rating: 4.9,
    reviews: 892,
    benefits: ["Fetal Development", "Energy Support", "Morning Sickness Relief", "Postpartum Recovery"],
    ingredients: ["Methylfolate", "Iron Bisglycinate", "DHA", "Choline", "Vitamin D3", "B-Complex", "Calcium", "Iodine"],
    usage: "Take 2 capsules daily with meals or as directed by your healthcare provider.",
    categoryId: "womens-health",
    subcategoryId: "prenatal",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 98,
    tags: ["pregnancy", "prenatal", "fertility", "breastfeeding"]
  },

  // Men's Health
  {
    id: 8,
    sku: "MH-TES-001",
    name: "TestoBoost Natural",
    description: "Natural testosterone support for vitality and performance",
    longDescription: "TestoBoost Natural uses clinically studied ingredients to support healthy testosterone levels, muscle mass, and male vitality without synthetic hormones.",
    price: "R1,299",
    originalPrice: "R1,799",
    rating: 4.7,
    reviews: 1432,
    benefits: ["Testosterone Support", "Muscle Growth", "Energy", "Libido"],
    ingredients: ["D-Aspartic Acid", "Fenugreek Extract", "Tribulus Terrestris", "Zinc", "Vitamin D3", "Ashwagandha", "Boron"],
    usage: "Take 3 capsules daily with breakfast for optimal results.",
    warnings: "For adult men only. Not intended for women or children.",
    categoryId: "mens-health",
    subcategoryId: "testosterone",
    image: "/bronchial_relief-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 178,
    tags: ["testosterone", "muscle", "performance", "men"]
  },

  // Digestive Health
  {
    id: 9,
    sku: "DH-PRO-001",
    name: "Probiotic Ultra 50B",
    description: "50 billion CFU multi-strain probiotic for gut health",
    longDescription: "Our most potent probiotic formula features 15 clinically studied strains in an acid-resistant capsule to ensure maximum survival and colonization in the gut.",
    price: "R799",
    originalPrice: "R1,149",
    rating: 4.9,
    reviews: 2156,
    benefits: ["Gut Health", "Immune System", "Nutrient Absorption", "Mood Support"],
    ingredients: ["Lactobacillus Acidophilus", "Bifidobacterium Lactis", "L. Plantarum", "L. Rhamnosus", "Prebiotic Fiber"],
    usage: "Take 1 capsule daily on an empty stomach or as directed.",
    categoryId: "digestive-health",
    subcategoryId: "probiotics",
    image: "/vegan_probiotic-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 234,
    tags: ["probiotics", "gut-health", "immune", "digestion"]
  },
  {
    id: 10,
    sku: "DH-ENZ-001",
    name: "Digestive Enzymes Plus",
    description: "Complete enzyme formula for optimal digestion",
    longDescription: "This comprehensive enzyme blend helps break down proteins, fats, and carbohydrates while reducing bloating and digestive discomfort.",
    price: "R549",
    originalPrice: "R749",
    rating: 4.8,
    reviews: 1234,
    benefits: ["Better Digestion", "Reduced Bloating", "Nutrient Absorption", "IBS Relief"],
    ingredients: ["Protease", "Lipase", "Amylase", "Lactase", "Bromelain", "Papain", "Ginger Extract"],
    usage: "Take 1-2 capsules with each meal.",
    categoryId: "digestive-health",
    subcategoryId: "enzymes",
    image: "/all_prouct_shots-1.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 167,
    tags: ["enzymes", "digestion", "bloating", "ibs"]
  },
  {
    id: 11,
    sku: "DH-PH-001",
    name: "Acidosis pH Control",
    description: "Advanced alkaline formula for optimal body pH balance",
    longDescription: "Acidosis pH Control helps neutralize excess acidity in the body using a blend of alkalizing minerals and green superfoods.",
    price: "R899",
    originalPrice: "R1,299",
    rating: 4.7,
    reviews: 892,
    benefits: ["pH Balance", "Digestive Health", "Detoxification", "Energy"],
    ingredients: ["Calcium Carbonate", "Magnesium Oxide", "Potassium Citrate", "Spirulina", "Chlorella", "Barley Grass"],
    usage: "Mix 1 scoop in water twice daily between meals.",
    categoryId: "digestive-health",
    subcategoryId: "gut-repair",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 89,
    tags: ["ph-balance", "alkaline", "detox", "greens"]
  },

  // Immune Support
  {
    id: 12,
    sku: "IS-VIT-001",
    name: "Vitamin C Complex 1000",
    description: "High-potency vitamin C with bioflavonoids",
    longDescription: "Our Vitamin C Complex combines ascorbic acid with citrus bioflavonoids and rose hips for enhanced absorption and antioxidant protection.",
    price: "R349",
    originalPrice: "R499",
    rating: 4.8,
    reviews: 2341,
    benefits: ["Immune Support", "Antioxidant", "Collagen Production", "Iron Absorption"],
    ingredients: ["Vitamin C (Ascorbic Acid)", "Citrus Bioflavonoids", "Rose Hips", "Acerola Cherry", "Rutin"],
    usage: "Take 1-2 tablets daily with meals.",
    categoryId: "immune-support",
    subcategoryId: "daily-immune",
    image: "/bronchial_relief-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 456,
    tags: ["vitamin-c", "immune", "antioxidant", "daily"]
  },
  {
    id: 13,
    sku: "IS-BRO-001",
    name: "Bronchial Relief Pro",
    description: "Natural respiratory support with organic herbs",
    longDescription: "Bronchial Relief Pro combines traditional respiratory herbs with modern nutrients to support clear breathing and lung health.",
    price: "R549",
    originalPrice: "R799",
    rating: 4.8,
    reviews: 1234,
    benefits: ["Respiratory Health", "Clear Airways", "Immune Support", "Mucus Relief"],
    ingredients: ["Thyme Extract", "Eucalyptus", "Mullein Leaf", "N-Acetyl Cysteine", "Quercetin", "Bromelain"],
    usage: "Take 2 capsules twice daily between meals.",
    categoryId: "immune-support",
    subcategoryId: "seasonal",
    image: "/bronchial_relief-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 123,
    tags: ["respiratory", "bronchial", "lungs", "seasonal"]
  },

  // Brain & Cognitive
  {
    id: 14,
    sku: "BC-MEM-001",
    name: "Memory Matrix Advanced",
    description: "Comprehensive brain support for memory and focus",
    longDescription: "Memory Matrix Advanced features clinically studied nootropics and brain nutrients to enhance memory, focus, and cognitive processing speed.",
    price: "R1,099",
    originalPrice: "R1,599",
    rating: 4.8,
    reviews: 1678,
    benefits: ["Memory Enhancement", "Mental Clarity", "Focus", "Neuroprotection"],
    ingredients: ["Lion's Mane Mushroom", "Bacopa Monnieri", "Ginkgo Biloba", "Phosphatidylserine", "Alpha-GPC", "Huperzine A"],
    usage: "Take 2 capsules in the morning with breakfast.",
    categoryId: "brain-cognitive",
    subcategoryId: "memory",
    image: "/all_prouct_shots-1.webp",
    popular: true,
    featured: true,
    inStock: true,
    stockCount: 134,
    tags: ["nootropic", "memory", "focus", "brain"]
  },
  {
    id: 15,
    sku: "BC-OME-001",
    name: "Omega-3 Premium DHA/EPA",
    description: "Pure fish oil for heart and brain health",
    longDescription: "Our Omega-3 Premium provides 2000mg of purified fish oil with high concentrations of DHA and EPA, molecularly distilled for purity.",
    price: "R649",
    originalPrice: "R899",
    rating: 4.7,
    reviews: 1789,
    benefits: ["Heart Health", "Brain Function", "Joint Support", "Eye Health"],
    ingredients: ["Fish Oil Concentrate", "EPA (750mg)", "DHA (500mg)", "Vitamin E", "Lemon Oil"],
    usage: "Take 2 softgels daily with meals.",
    categoryId: "brain-cognitive",
    subcategoryId: "focus",
    image: "/all_prouct_shots-1.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 278,
    tags: ["omega-3", "fish-oil", "heart", "brain"]
  },

  // Sleep & Relaxation
  {
    id: 16,
    sku: "SR-SLE-001",
    name: "Harmony Sleep Formula",
    description: "Natural sleep enhancement with premium herbs",
    longDescription: "Harmony Sleep Formula combines traditional sleep herbs with modern compounds like L-theanine and melatonin to promote deep, restorative sleep.",
    price: "R999",
    originalPrice: "R1,349",
    rating: 4.9,
    reviews: 3241,
    benefits: ["Deep Sleep", "Recovery", "Calm Mind", "No Morning Grogginess"],
    ingredients: ["Melatonin", "L-Theanine", "Valerian Root", "Passionflower", "Chamomile", "Magnesium Glycinate", "5-HTP"],
    usage: "Take 1-2 capsules 30-60 minutes before bedtime.",
    warnings: "May cause drowsiness. Do not drive or operate machinery after use.",
    categoryId: "sleep-relaxation",
    subcategoryId: "sleep-aids",
    image: "/bronchial_relief-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 345,
    tags: ["sleep", "melatonin", "relaxation", "insomnia"]
  },
  {
    id: 17,
    sku: "SR-STR-001",
    name: "Stress Shield Ultra",
    description: "Advanced stress and anxiety support formula",
    longDescription: "Stress Shield Ultra uses clinically studied adaptogens and calming nutrients to help your body manage stress and maintain emotional balance.",
    price: "R899",
    originalPrice: "R1,249",
    rating: 4.8,
    reviews: 2156,
    benefits: ["Stress Relief", "Anxiety Support", "Cortisol Balance", "Mental Calm"],
    ingredients: ["Ashwagandha KSM-66", "Rhodiola", "L-Theanine", "Holy Basil", "GABA", "B-Complex", "Magnesium"],
    usage: "Take 2 capsules daily, morning and evening.",
    categoryId: "sleep-relaxation",
    subcategoryId: "stress-relief",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 189,
    tags: ["stress", "anxiety", "adaptogen", "cortisol"]
  },

  // Energy & Performance
  {
    id: 18,
    sku: "EP-ENE-001",
    name: "Natural Energy Surge",
    description: "Clean energy without jitters or crash",
    longDescription: "Natural Energy Surge provides sustained energy using green tea extract, B-vitamins, and adaptogenic herbs without the crash of synthetic stimulants.",
    price: "R649",
    originalPrice: "R899",
    rating: 4.8,
    reviews: 1923,
    benefits: ["Sustained Energy", "Mental Focus", "No Jitters", "Metabolism Support"],
    ingredients: ["Green Tea Extract", "Guarana", "B12", "Rhodiola", "CoQ10", "Alpha Lipoic Acid", "Chromium"],
    usage: "Take 2 capsules in the morning or before physical activity.",
    warnings: "Contains caffeine. Not recommended for evening use.",
    categoryId: "energy-performance",
    subcategoryId: "energy-boost",
    image: "/all_prouct_shots-1.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 267,
    tags: ["energy", "caffeine", "metabolism", "focus"]
  },
  {
    id: 19,
    sku: "EP-PRE-001",
    name: "Pre-Workout Fusion",
    description: "Natural pre-workout for enhanced performance",
    longDescription: "Pre-Workout Fusion combines amino acids, natural caffeine, and performance herbs to maximize your workout potential.",
    price: "R799",
    originalPrice: "R1,099",
    rating: 4.7,
    reviews: 1432,
    benefits: ["Energy Boost", "Muscle Pump", "Endurance", "Focus"],
    ingredients: ["L-Citrulline", "Beta-Alanine", "Caffeine", "L-Tyrosine", "Beetroot Extract", "B-Vitamins", "Electrolytes"],
    usage: "Mix 1 scoop with water 20-30 minutes before workout.",
    categoryId: "energy-performance",
    subcategoryId: "pre-workout",
    image: "/bronchial_relief-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 145,
    tags: ["pre-workout", "exercise", "performance", "energy"]
  },

  // Detox & Cleanse
  {
    id: 20,
    sku: "DC-LIV-001",
    name: "Liver Detox Supreme",
    description: "Comprehensive liver support and detoxification",
    longDescription: "Liver Detox Supreme supports your body's primary detox organ with milk thistle, NAC, and other liver-protective compounds.",
    price: "R899",
    originalPrice: "R1,299",
    rating: 4.8,
    reviews: 1567,
    benefits: ["Liver Health", "Detoxification", "Antioxidant", "Metabolism"],
    ingredients: ["Milk Thistle", "N-Acetyl Cysteine", "Alpha Lipoic Acid", "Dandelion Root", "Artichoke Extract", "Turmeric"],
    usage: "Take 2 capsules daily with meals for 30 days.",
    categoryId: "detox-cleanse",
    subcategoryId: "liver-detox",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 112,
    tags: ["liver", "detox", "cleanse", "milk-thistle"]
  },
  {
    id: 21,
    sku: "DC-FUL-001",
    name: "Total Body Cleanse",
    description: "21-day full body detoxification system",
    longDescription: "Our Total Body Cleanse is a comprehensive 21-day program designed to support all major detox pathways including liver, kidneys, lymph, and colon.",
    price: "R1,999",
    originalPrice: "R2,799",
    rating: 4.7,
    reviews: 892,
    benefits: ["Full Body Detox", "Weight Loss", "Energy Boost", "Clear Skin"],
    ingredients: ["Psyllium Husk", "Bentonite Clay", "Chlorella", "Milk Thistle", "Cascara Sagrada", "Probiotics", "Digestive Enzymes"],
    usage: "Follow the 21-day protocol included with detailed instructions.",
    warnings: "Drink plenty of water. May cause temporary detox symptoms.",
    categoryId: "detox-cleanse",
    subcategoryId: "full-body",
    image: "/all_prouct_shots-1.webp",
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 67,
    tags: ["detox", "cleanse", "weight-loss", "21-day"]
  },
  
  // Additional products for variety
  {
    id: 22,
    sku: "WE-COL-001",
    name: "Collagen Beauty Blend",
    description: "Marine collagen for skin, hair, and nails",
    longDescription: "Our Collagen Beauty Blend features hydrolyzed marine collagen peptides enhanced with vitamin C, biotin, and hyaluronic acid for comprehensive beauty support.",
    price: "R899",
    originalPrice: "R1,299",
    rating: 4.8,
    reviews: 2134,
    benefits: ["Skin Elasticity", "Hair Growth", "Nail Strength", "Joint Support"],
    ingredients: ["Marine Collagen Peptides", "Vitamin C", "Biotin", "Hyaluronic Acid", "Silica", "Zinc"],
    usage: "Mix 1 scoop in water or smoothie daily.",
    categoryId: "wellness-essentials",
    subcategoryId: "vitamins",
    image: "/vegan_probiotic-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 178,
    sizes: [
      { size: "300g", price: "R899", originalPrice: "R1,299" },
      { size: "600g", price: "R1,599", originalPrice: "R2,299" }
    ],
    tags: ["collagen", "beauty", "skin", "anti-aging"]
  },
  {
    id: 23,
    sku: "HR-TUR-001",
    name: "Turmeric Gold Plus",
    description: "High-potency turmeric with black pepper for inflammation",
    longDescription: "Turmeric Gold Plus delivers 1500mg of curcumin extract with BioPerine black pepper for 2000% better absorption, providing powerful anti-inflammatory support.",
    price: "R599",
    originalPrice: "R849",
    rating: 4.9,
    reviews: 3456,
    benefits: ["Anti-Inflammatory", "Joint Health", "Brain Health", "Antioxidant"],
    ingredients: ["Turmeric Extract (95% Curcuminoids)", "Black Pepper Extract (BioPerine)", "Ginger Root", "Boswellia"],
    usage: "Take 1-2 capsules daily with meals.",
    categoryId: "herbal-remedies",
    subcategoryId: "immune-herbs",
    image: "/bronchial_relief-600x600.webp",
    popular: true,
    featured: false,
    inStock: true,
    stockCount: 345,
    tags: ["turmeric", "inflammation", "joints", "curcumin"]
  },
  {
    id: 24,
    sku: "BC-CBD-001",
    name: "CBD Calm 1000mg",
    description: "Premium CBD oil for stress and pain relief",
    longDescription: "Our CBD Calm features 1000mg of full-spectrum CBD oil extracted from organic hemp, providing natural relief for stress, anxiety, and chronic pain.",
    price: "R1,299",
    originalPrice: "R1,799",
    rating: 4.8,
    reviews: 1234,
    benefits: ["Stress Relief", "Pain Management", "Better Sleep", "Anti-Inflammatory"],
    ingredients: ["Full Spectrum CBD Oil", "MCT Oil", "Natural Terpenes"],
    usage: "Place 0.5-1ml under tongue, hold for 60 seconds before swallowing.",
    warnings: "May interact with certain medications. Consult healthcare provider.",
    categoryId: "brain-cognitive",
    subcategoryId: "mood",
    image: "/all_prouct_shots-1.webp",
    popular: false,
    featured: true,
    inStock: true,
    stockCount: 89,
    sizes: [
      { size: "30ml", price: "R1,299", originalPrice: "R1,799" },
      { size: "60ml", price: "R2,399", originalPrice: "R3,299" }
    ],
    tags: ["cbd", "anxiety", "pain", "stress"]
  },
  {
    id: 25,
    sku: "MH-PRO-001",
    name: "Prostate Guardian",
    description: "Complete prostate health support for men over 40",
    longDescription: "Prostate Guardian combines saw palmetto, beta-sitosterol, and other proven ingredients to support prostate health and urinary function.",
    price: "R799",
    originalPrice: "R1,099",
    rating: 4.7,
    reviews: 987,
    benefits: ["Prostate Health", "Urinary Function", "DHT Balance", "Anti-Inflammatory"],
    ingredients: ["Saw Palmetto", "Beta-Sitosterol", "Pygeum Africanum", "Stinging Nettle", "Zinc", "Selenium", "Lycopene"],
    usage: "Take 2 capsules daily with meals.",
    categoryId: "mens-health",
    subcategoryId: "prostate",
    image: "/vegan_probiotic-600x600.webp",
    popular: false,
    featured: false,
    inStock: true,
    stockCount: 123,
    tags: ["prostate", "mens-health", "urinary", "over-40"]
  }
];

// Helper function to get products by category
export const getProductsByCategory = (categoryId: string, subcategoryId?: string): Product[] => {
  return products.filter(product => {
    if (subcategoryId) {
      return product.categoryId === categoryId && product.subcategoryId === subcategoryId;
    }
    return product.categoryId === categoryId;
  });
};

// Helper function to get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

// Helper function to get popular products
export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

// Helper function to search products
export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.includes(lowercaseQuery)) ||
    product.benefits.some(benefit => benefit.toLowerCase().includes(lowercaseQuery))
  );
};

// Helper function to get product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

// Helper function to get products by tag
export const getProductsByTag = (tag: string): Product[] => {
  return products.filter(product => product.tags.includes(tag));
};

// Helper function to get related products
export const getRelatedProducts = (productId: number, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  // Find products in the same category or with similar tags
  const relatedProducts = products.filter(p => 
    p.id !== productId && (
      p.categoryId === product.categoryId ||
      p.tags.some(tag => product.tags.includes(tag))
    )
  );
  
  // Sort by number of matching tags
  relatedProducts.sort((a, b) => {
    const aMatches = a.tags.filter(tag => product.tags.includes(tag)).length;
    const bMatches = b.tags.filter(tag => product.tags.includes(tag)).length;
    return bMatches - aMatches;
  });
  
  return relatedProducts.slice(0, limit);
};