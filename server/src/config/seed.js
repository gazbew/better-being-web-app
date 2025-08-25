import pool from './database.js';

// Categories data
const categories = [
  {
    id: 'wellness-essentials',
    name: 'Wellness Essentials',
    slug: 'wellness-essentials',
    description: 'Core supplements for daily health and vitality',
    icon: 'Heart'
  },
  {
    id: 'herbal-remedies',
    name: 'Herbal Remedies',
    slug: 'herbal-remedies',
    description: 'Traditional herbs and botanical solutions',
    icon: 'Leaf'
  },
  {
    id: 'womens-health',
    name: "Women's Health",
    slug: 'womens-health',
    description: 'Specialized formulations for women',
    icon: 'Heart'
  },
  {
    id: 'mens-health',
    name: "Men's Health",
    slug: 'mens-health',
    description: 'Targeted nutrition for men',
    icon: 'Shield'
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    slug: 'digestive-health',
    description: 'Complete gut health solutions',
    icon: 'Zap'
  },
  {
    id: 'immune-support',
    name: 'Immune Support',
    slug: 'immune-support',
    description: 'Strengthen your body\'s defenses',
    icon: 'Shield'
  },
  {
    id: 'brain-cognitive',
    name: 'Brain & Cognitive',
    slug: 'brain-cognitive',
    description: 'Mental clarity and brain health',
    icon: 'Brain'
  },
  {
    id: 'sleep-relaxation',
    name: 'Sleep & Relaxation',
    slug: 'sleep-relaxation',
    description: 'Natural sleep and stress solutions',
    icon: 'Moon'
  },
  {
    id: 'energy-performance',
    name: 'Energy & Performance',
    slug: 'energy-performance',
    description: 'Natural energy and athletic support',
    icon: 'Zap'
  },
  {
    id: 'detox-cleanse',
    name: 'Detox & Cleanse',
    slug: 'detox-cleanse',
    description: 'Body purification and renewal',
    icon: 'Sparkles'
  }
];

// Subcategories data
const subcategories = [
  { id: 'vitamins', name: 'Vitamins', slug: 'vitamins', description: 'Essential vitamins for optimal health', category_id: 'wellness-essentials' },
  { id: 'minerals', name: 'Minerals', slug: 'minerals', description: 'Key minerals for body functions', category_id: 'wellness-essentials' },
  { id: 'multivitamins', name: 'Multivitamins', slug: 'multivitamins', description: 'Complete daily nutrition', category_id: 'wellness-essentials' },
  { id: 'adaptogens', name: 'Adaptogens', slug: 'adaptogens', description: 'Stress-fighting herbs', category_id: 'herbal-remedies' },
  { id: 'immune-herbs', name: 'Immune Herbs', slug: 'immune-herbs', description: 'Natural immune boosters', category_id: 'herbal-remedies' },
  { id: 'digestive-herbs', name: 'Digestive Herbs', slug: 'digestive-herbs', description: 'Herbs for gut health', category_id: 'herbal-remedies' }
];

// Products data (sample from your existing data)
const products = [
  {
    id: 1,
    sku: 'WE-VIT-001',
    name: 'Vitality Boost Complex',
    description: 'Premium herbal blend for natural energy and mental clarity',
    long_description: 'Our flagship Vitality Boost Complex combines 12 powerful adaptogenic herbs with essential vitamins and minerals to provide sustained energy throughout the day. This formula has been refined over 15 years to deliver optimal results without the crash associated with synthetic energy supplements.',
    price: 1299.00,
    original_price: 1899.00,
    rating: 4.9,
    reviews_count: 2847,
    usage_instructions: 'Take 2 capsules daily with breakfast. For best results, use consistently for at least 30 days.',
    warnings: 'Not suitable for pregnant or nursing women. Consult your healthcare provider before use.',
    category_id: 'wellness-essentials',
    subcategory_id: 'multivitamins',
    image_url: '/all_prouct_shots-1.webp',
    is_popular: true,
    is_featured: true,
    in_stock: true,
    stock_count: 156
  },
  {
    id: 2,
    sku: 'WE-MIN-001',
    name: 'Magnesium Complex Plus',
    description: 'High-absorption magnesium blend for muscle and nerve function',
    long_description: 'Our Magnesium Complex Plus features three highly bioavailable forms of magnesium combined with vitamin D3 and K2 for optimal absorption. This formula supports over 300 enzymatic processes in the body.',
    price: 449.00,
    original_price: 649.00,
    rating: 4.9,
    reviews_count: 3892,
    usage_instructions: 'Take 2 capsules before bed or as directed by your healthcare provider.',
    category_id: 'wellness-essentials',
    subcategory_id: 'minerals',
    image_url: '/bronchial_relief-600x600.webp',
    is_popular: true,
    is_featured: false,
    in_stock: true,
    stock_count: 234
  },
  {
    id: 3,
    sku: 'WE-VIT-002',
    name: 'Vitamin D3 + K2',
    description: 'Synergistic vitamin combo for bone and immune health',
    long_description: 'Our Vitamin D3 + K2 formula combines 5000 IU of vitamin D3 with 200mcg of vitamin K2 (MK-7) for optimal calcium absorption and bone health support.',
    price: 399.00,
    original_price: 549.00,
    rating: 4.8,
    reviews_count: 1567,
    usage_instructions: 'Take 1 softgel daily with a meal containing fat for best absorption.',
    category_id: 'wellness-essentials',
    subcategory_id: 'vitamins',
    image_url: '/vegan_probiotic-600x600.webp',
    is_popular: false,
    is_featured: false,
    in_stock: true,
    stock_count: 189
  },
  {
    id: 4,
    sku: 'HR-ADA-001',
    name: 'Pure Wellness Elixir',
    description: 'Ancient botanical formula for overall health optimization',
    long_description: 'This powerful elixir combines 15 time-tested herbs from traditional medicine systems around the world. Each batch is carefully crafted using a proprietary extraction method that preserves the full spectrum of beneficial compounds.',
    price: 1849.00,
    original_price: 2699.00,
    rating: 4.8,
    reviews_count: 1923,
    usage_instructions: 'Mix 1 tablespoon in warm water or juice twice daily, morning and evening.',
    category_id: 'herbal-remedies',
    subcategory_id: 'adaptogens',
    image_url: '/vegan_probiotic-600x600.webp',
    is_popular: false,
    is_featured: true,
    in_stock: true,
    stock_count: 78
  },
  {
    id: 5,
    sku: 'HR-IMM-001',
    name: 'Immune Shield Pro',
    description: 'Powerful herbal immune system support',
    long_description: 'Immune Shield Pro combines echinacea, elderberry, and medicinal mushrooms to provide comprehensive immune support during challenging times.',
    price: 699.00,
    original_price: 999.00,
    rating: 4.9,
    reviews_count: 2134,
    usage_instructions: 'Take 2 capsules daily for maintenance, increase to 3-4 during immune challenges.',
    category_id: 'herbal-remedies',
    subcategory_id: 'immune-herbs',
    image_url: '/all_prouct_shots-1.webp',
    is_popular: true,
    is_featured: false,
    in_stock: true,
    stock_count: 267
  }
];

// Benefits, ingredients, and tags data
const productBenefits = [
  { product_id: 1, benefit: 'Increased Energy' },
  { product_id: 1, benefit: 'Mental Clarity' },
  { product_id: 1, benefit: 'Stress Relief' },
  { product_id: 1, benefit: 'Immune Support' },
  { product_id: 2, benefit: 'Muscle Recovery' },
  { product_id: 2, benefit: 'Better Sleep' },
  { product_id: 2, benefit: 'Stress Relief' },
  { product_id: 2, benefit: 'Bone Health' },
  { product_id: 3, benefit: 'Bone Health' },
  { product_id: 3, benefit: 'Immune Support' },
  { product_id: 3, benefit: 'Heart Health' },
  { product_id: 3, benefit: 'Calcium Absorption' },
  { product_id: 4, benefit: 'Immune Support' },
  { product_id: 4, benefit: 'Anti-Aging' },
  { product_id: 4, benefit: 'Detox' },
  { product_id: 4, benefit: 'Energy Balance' },
  { product_id: 5, benefit: 'Immune Boost' },
  { product_id: 5, benefit: 'Antiviral Properties' },
  { product_id: 5, benefit: 'Respiratory Health' },
  { product_id: 5, benefit: 'Antioxidant' }
];

const productIngredients = [
  { product_id: 1, ingredient: 'Ashwagandha Root' },
  { product_id: 1, ingredient: 'Rhodiola Extract' },
  { product_id: 1, ingredient: 'Ginseng' },
  { product_id: 1, ingredient: 'B-Vitamin Complex' },
  { product_id: 1, ingredient: 'Magnesium' },
  { product_id: 1, ingredient: 'Zinc' },
  { product_id: 1, ingredient: 'Green Tea Extract' },
  { product_id: 1, ingredient: 'L-Theanine' },
  { product_id: 2, ingredient: 'Magnesium Glycinate' },
  { product_id: 2, ingredient: 'Magnesium Citrate' },
  { product_id: 2, ingredient: 'Magnesium Malate' },
  { product_id: 2, ingredient: 'Vitamin D3' },
  { product_id: 2, ingredient: 'Vitamin K2' },
  { product_id: 2, ingredient: 'Zinc' },
  { product_id: 3, ingredient: 'Vitamin D3 (Cholecalciferol)' },
  { product_id: 3, ingredient: 'Vitamin K2 (MK-7)' },
  { product_id: 3, ingredient: 'MCT Oil' },
  { product_id: 3, ingredient: 'Olive Oil' },
  { product_id: 4, ingredient: 'Reishi Mushroom' },
  { product_id: 4, ingredient: 'Astragalus' },
  { product_id: 4, ingredient: 'Schisandra Berry' },
  { product_id: 4, ingredient: 'Goji Berry' },
  { product_id: 4, ingredient: 'Turmeric' },
  { product_id: 4, ingredient: 'Ginger' },
  { product_id: 4, ingredient: 'Holy Basil' },
  { product_id: 4, ingredient: 'Licorice Root' },
  { product_id: 5, ingredient: 'Echinacea Purpurea' },
  { product_id: 5, ingredient: 'Elderberry Extract' },
  { product_id: 5, ingredient: 'Reishi Mushroom' },
  { product_id: 5, ingredient: 'Turkey Tail' },
  { product_id: 5, ingredient: 'Vitamin C' },
  { product_id: 5, ingredient: 'Zinc' },
  { product_id: 5, ingredient: 'Selenium' }
];

const productTags = [
  { product_id: 1, tag: 'energy' },
  { product_id: 1, tag: 'mental-clarity' },
  { product_id: 1, tag: 'adaptogen' },
  { product_id: 1, tag: 'daily-use' },
  { product_id: 2, tag: 'sleep' },
  { product_id: 2, tag: 'recovery' },
  { product_id: 2, tag: 'minerals' },
  { product_id: 2, tag: 'stress' },
  { product_id: 3, tag: 'bone-health' },
  { product_id: 3, tag: 'immune' },
  { product_id: 3, tag: 'vitamins' },
  { product_id: 4, tag: 'elixir' },
  { product_id: 4, tag: 'adaptogen' },
  { product_id: 4, tag: 'immune' },
  { product_id: 4, tag: 'traditional' },
  { product_id: 5, tag: 'immune' },
  { product_id: 5, tag: 'antiviral' },
  { product_id: 5, tag: 'mushrooms' },
  { product_id: 5, tag: 'seasonal' }
];

const productSizes = [
  { product_id: 4, size: '250ml', price: 1849.00, original_price: 2699.00 },
  { product_id: 4, size: '500ml', price: 3299.00, original_price: 4599.00 }
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if products already exist
    const existingProducts = await client.query('SELECT COUNT(*) FROM products');
    const productCount = parseInt(existingProducts.rows[0].count);
    
    if (productCount > 0) {
      console.log(`📦 Found ${productCount} existing products. Adding new products without clearing existing data...`);
      await addNewProducts(client);
    } else {
      console.log('🧹 No existing products found. Starting fresh seeding...');
      await client.query('BEGIN');
      
      try {
        // Temporarily disable foreign key constraints
        await client.query('SET session_replication_role = replica;');
        
        // Clear product-related data
        await client.query('DELETE FROM product_sizes');
        await client.query('DELETE FROM product_tags');
        await client.query('DELETE FROM product_ingredients');
        await client.query('DELETE FROM product_benefits');
        await client.query('DELETE FROM products');
        await client.query('DELETE FROM subcategories');
        await client.query('DELETE FROM categories');
        
        // Re-enable foreign key constraints
        await client.query('SET session_replication_role = DEFAULT;');
        
        console.log('✅ Existing data cleared successfully');
        
        // Insert fresh data
        await insertSeedData(client);
        await client.query('COMMIT');
        
      } catch (error) {
        await client.query('SET session_replication_role = DEFAULT;');
        throw error;
      }
    }
    
    // Show summary
    const finalProductCount = await client.query('SELECT COUNT(*) FROM products');
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    const subcategoryCount = await client.query('SELECT COUNT(*) FROM subcategories');
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Categories: ${categoryCount.rows[0].count}`);
    console.log(`   Subcategories: ${subcategoryCount.rows[0].count}`);
    console.log(`   Products: ${finalProductCount.rows[0].count}`);
    
  } catch (error) {
    try {
      await client.query('ROLLBACK');
      await client.query('SET session_replication_role = DEFAULT;');
    } catch (rollbackError) {
      console.error('Error during rollback:', rollbackError);
    }
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertSeedData(client) {
  // Insert categories
  console.log('📂 Inserting categories...');
  for (const category of categories) {
    await client.query(
      'INSERT INTO categories (id, name, slug, description, icon) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [category.id, category.name, category.slug, category.description, category.icon]
    );
  }
  
  // Insert subcategories
  console.log('📁 Inserting subcategories...');
  for (const subcategory of subcategories) {
    await client.query(
      'INSERT INTO subcategories (id, name, slug, description, category_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [subcategory.id, subcategory.name, subcategory.slug, subcategory.description, subcategory.category_id]
    );
  }
  
  // Insert products
  console.log('🛍️ Inserting products...');
  for (const product of products) {
    await client.query(`
      INSERT INTO products (
        id, sku, name, description, long_description, price, original_price, 
        rating, reviews_count, usage_instructions, warnings, category_id, 
        subcategory_id, image_url, is_popular, is_featured, in_stock, stock_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (id) DO NOTHING
    `, [
      product.id, product.sku, product.name, product.description, product.long_description,
      product.price, product.original_price, product.rating, product.reviews_count,
      product.usage_instructions, product.warnings, product.category_id, product.subcategory_id,
      product.image_url, product.is_popular, product.is_featured, product.in_stock, product.stock_count
    ]);
  }
  
  // Insert product benefits
  console.log('💪 Inserting product benefits...');
  for (const benefit of productBenefits) {
    await client.query(
      'INSERT INTO product_benefits (product_id, benefit) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [benefit.product_id, benefit.benefit]
    );
  }
  
  // Insert product ingredients
  console.log('🧪 Inserting product ingredients...');
  for (const ingredient of productIngredients) {
    await client.query(
      'INSERT INTO product_ingredients (product_id, ingredient) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [ingredient.product_id, ingredient.ingredient]
    );
  }
  
  // Insert product tags
  console.log('🏷️ Inserting product tags...');
  for (const tag of productTags) {
    await client.query(
      'INSERT INTO product_tags (product_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [tag.product_id, tag.tag]
    );
  }
  
  // Insert product sizes
  console.log('📏 Inserting product sizes...');
  for (const size of productSizes) {
    await client.query(
      'INSERT INTO product_sizes (product_id, size, price, original_price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [size.product_id, size.size, size.price, size.original_price]
    );
  }
}

async function addNewProducts(client) {
  console.log('➕ Adding new products to existing database...');
  
  // Get the highest existing product ID
  const maxIdResult = await client.query('SELECT COALESCE(MAX(id), 0) as max_id FROM products');
  const startId = parseInt(maxIdResult.rows[0].max_id) + 1;
  
  // Insert categories (skip if they exist)
  for (const category of categories) {
    await client.query(
      'INSERT INTO categories (id, name, slug, description, icon) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [category.id, category.name, category.slug, category.description, category.icon]
    );
  }
  
  // Insert subcategories (skip if they exist)
  for (const subcategory of subcategories) {
    await client.query(
      'INSERT INTO subcategories (id, name, slug, description, category_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
      [subcategory.id, subcategory.name, subcategory.slug, subcategory.description, subcategory.category_id]
    );
  }
  
  // Insert products with new IDs
  console.log(`🛍️ Inserting products starting from ID ${startId}...`);
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const newId = startId + i;
    
    await client.query(`
      INSERT INTO products (
        id, sku, name, description, long_description, price, original_price, 
        rating, reviews_count, usage_instructions, warnings, category_id, 
        subcategory_id, image_url, is_popular, is_featured, in_stock, stock_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (sku) DO NOTHING
    `, [
      newId, `${product.sku}-NEW`, product.name, product.description, product.long_description,
      product.price, product.original_price, product.rating, product.reviews_count,
      product.usage_instructions, product.warnings, product.category_id, product.subcategory_id,
      product.image_url, product.is_popular, product.is_featured, product.in_stock, product.stock_count
    ]);
    
    // Insert related data with new product ID
    for (const benefit of productBenefits.filter(b => b.product_id === product.id)) {
      await client.query(
        'INSERT INTO product_benefits (product_id, benefit) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [newId, benefit.benefit]
      );
    }
    
    for (const ingredient of productIngredients.filter(i => i.product_id === product.id)) {
      await client.query(
        'INSERT INTO product_ingredients (product_id, ingredient) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [newId, ingredient.ingredient]
      );
    }
    
    for (const tag of productTags.filter(t => t.product_id === product.id)) {
      await client.query(
        'INSERT INTO product_tags (product_id, tag) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [newId, tag.tag]
      );
    }
    
    for (const size of productSizes.filter(s => s.product_id === product.id)) {
      await client.query(
        'INSERT INTO product_sizes (product_id, size, price, original_price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [newId, size.size, size.price, size.original_price]
      );
    }
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;