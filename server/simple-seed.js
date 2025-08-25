import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function simpleSeed() {
  console.log('🌱 Starting simple database seeding...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');
    
    // Insert categories with conflict handling
    console.log('📂 Inserting categories...');
    const categoryResults = await pool.query(`
      INSERT INTO categories (name, slug, description, icon) VALUES 
      ('Wellness Essentials', 'wellness-essentials', 'Core supplements for daily health and vitality', 'Heart'),
      ('Herbal Remedies', 'herbal-remedies', 'Traditional herbs and botanical solutions', 'Leaf'),
      ('Digestive Health', 'digestive-health', 'Complete gut health solutions', 'Zap'),
      ('Immune Support', 'immune-support', 'Strengthen your body defenses', 'Shield')
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug
    `);
    
    // Get category IDs for reference
    const allCategories = await pool.query('SELECT id, slug FROM categories');
    const categoryMap = {};
    allCategories.rows.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    // Insert subcategories
    console.log('📁 Inserting subcategories...');
    await pool.query(`
      INSERT INTO subcategories (name, slug, description, category_id) VALUES 
      ('Vitamins', 'vitamins', 'Essential vitamins for optimal health', $1),
      ('Minerals', 'minerals', 'Key minerals for body functions', $1),
      ('Multivitamins', 'multivitamins', 'Complete daily nutrition', $1),
      ('Adaptogens', 'adaptogens', 'Stress-fighting herbs', $2),
      ('Immune Herbs', 'immune-herbs', 'Natural immune boosters', $2),
      ('Probiotics', 'probiotics', 'Beneficial bacteria', $3)
      ON CONFLICT (slug) DO NOTHING
    `, [
      categoryMap['wellness-essentials'],
      categoryMap['herbal-remedies'], 
      categoryMap['digestive-health']
    ]);
    
    // Get subcategory IDs for reference
    const allSubcategories = await pool.query('SELECT id, slug FROM subcategories');
    const subcategoryMap = {};
    allSubcategories.rows.forEach(sub => {
      subcategoryMap[sub.slug] = sub.id;
    });
    
    // Check if products exist
    const existingProducts = await pool.query('SELECT COUNT(*) FROM products WHERE sku LIKE \'SEED-%\'');
    const seedProductCount = parseInt(existingProducts.rows[0].count);
    
    if (seedProductCount > 0) {
      console.log(`📦 Found ${seedProductCount} seed products already exist. Skipping product insertion.`);
    } else {
      // Insert products with unique SKUs
      console.log('🛍️ Inserting products...');
      
      // Get next available ID
      const maxId = await pool.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM products');
      let nextId = parseInt(maxId.rows[0].next_id);
      
      const productInserts = [
        {
          id: nextId++,
          sku: 'SEED-VIT-001',
          name: 'Vitality Boost Complex',
          slug: 'vitality-boost-complex',
          description: 'Premium herbal blend for natural energy and mental clarity',
          long_description: 'Our flagship Vitality Boost Complex combines 12 powerful adaptogenic herbs with essential vitamins and minerals.',
          price: 1299.00,
          original_price: 1899.00,
          rating: 4.9,
          reviews_count: 2847,
          usage_instructions: 'Take 2 capsules daily with breakfast.',
          warnings: null,
          category_id: categoryMap['wellness-essentials'],
          subcategory_id: subcategoryMap['multivitamins'],
          image_url: '/all_prouct_shots-1.webp',
          is_popular: true,
          is_featured: true,
          in_stock: true,
          stock_count: 156
        },
        {
          id: nextId++,
          sku: 'SEED-MIN-001',
          name: 'Magnesium Complex Plus',
          slug: 'magnesium-complex-plus',
          description: 'High-absorption magnesium blend for muscle and nerve function',
          long_description: 'Our Magnesium Complex Plus features three highly bioavailable forms of magnesium.',
          price: 449.00,
          original_price: 649.00,
          rating: 4.9,
          reviews_count: 3892,
          usage_instructions: 'Take 2 capsules before bed.',
          warnings: null,
          category_id: categoryMap['wellness-essentials'],
          subcategory_id: subcategoryMap['minerals'],
          image_url: '/bronchial_relief-600x600.webp',
          is_popular: true,
          is_featured: false,
          in_stock: true,
          stock_count: 234
        },
        {
          id: nextId++,
          sku: 'SEED-VIT-002',
          name: 'Vitamin D3 + K2',
          slug: 'vitamin-d3-k2',
          description: 'Synergistic vitamin combo for bone and immune health',
          long_description: 'Our Vitamin D3 + K2 formula combines 5000 IU of vitamin D3 with 200mcg of vitamin K2.',
          price: 399.00,
          original_price: 549.00,
          rating: 4.8,
          reviews_count: 1567,
          usage_instructions: 'Take 1 softgel daily with a meal.',
          warnings: null,
          category_id: categoryMap['wellness-essentials'],
          subcategory_id: subcategoryMap['vitamins'],
          image_url: '/vegan_probiotic-600x600.webp',
          is_popular: false,
          is_featured: false,
          in_stock: true,
          stock_count: 189
        },
        {
          id: nextId++,
          sku: 'SEED-ADA-001',
          name: 'Pure Wellness Elixir',
          slug: 'pure-wellness-elixir',
          description: 'Ancient botanical formula for overall health optimization',
          long_description: 'This powerful elixir combines 15 time-tested herbs from traditional medicine systems.',
          price: 1849.00,
          original_price: 2699.00,
          rating: 4.8,
          reviews_count: 1923,
          usage_instructions: 'Mix 1 tablespoon in warm water twice daily.',
          warnings: null,
          category_id: categoryMap['herbal-remedies'],
          subcategory_id: subcategoryMap['adaptogens'],
          image_url: '/vegan_probiotic-600x600.webp',
          is_popular: false,
          is_featured: true,
          in_stock: true,
          stock_count: 78
        },
        {
          id: nextId++,
          sku: 'SEED-IMM-001',
          name: 'Immune Shield Pro',
          slug: 'immune-shield-pro',
          description: 'Powerful herbal immune system support',
          long_description: 'Immune Shield Pro combines echinacea, elderberry, and medicinal mushrooms.',
          price: 699.00,
          original_price: 999.00,
          rating: 4.9,
          reviews_count: 2134,
          usage_instructions: 'Take 2 capsules daily for maintenance.',
          warnings: null,
          category_id: categoryMap['herbal-remedies'],
          subcategory_id: subcategoryMap['immune-herbs'],
          image_url: '/all_prouct_shots-1.webp',
          is_popular: true,
          is_featured: false,
          in_stock: true,
          stock_count: 267
        }
      ];
      
      for (const product of productInserts) {
        await pool.query(`
          INSERT INTO products (
            id, sku, name, slug, description, long_description, price, original_price, 
            rating, reviews_count, usage_instructions, warnings, category_id, 
            subcategory_id, image_url, is_popular, is_featured, in_stock, stock_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        `, [
          product.id, product.sku, product.name, product.slug, product.description, 
          product.long_description, product.price, product.original_price, product.rating, 
          product.reviews_count, product.usage_instructions, product.warnings, 
          product.category_id, product.subcategory_id, product.image_url, 
          product.is_popular, product.is_featured, product.in_stock, product.stock_count
        ]);
      }
      
      // Insert some benefits for the first product
      const firstProductId = productInserts[0][0];
      await pool.query(`
        INSERT INTO product_benefits (product_id, benefit) VALUES 
        ($1, 'Increased Energy'),
        ($1, 'Mental Clarity'),
        ($1, 'Stress Relief'),
        ($1, 'Immune Support')
        ON CONFLICT DO NOTHING
      `, [firstProductId]);
      
      // Insert some ingredients for the first product
      await pool.query(`
        INSERT INTO product_ingredients (product_id, ingredient) VALUES 
        ($1, 'Ashwagandha Root'),
        ($1, 'Rhodiola Extract'),
        ($1, 'Ginseng'),
        ($1, 'B-Vitamin Complex')
        ON CONFLICT DO NOTHING
      `, [firstProductId]);
      
      // Insert some tags for the first product
      await pool.query(`
        INSERT INTO product_tags (product_id, tag) VALUES 
        ($1, 'energy'),
        ($1, 'mental-clarity'),
        ($1, 'adaptogen'),
        ($1, 'daily-use')
        ON CONFLICT DO NOTHING
      `, [firstProductId]);
    }
    
    // Show final summary
    const finalCounts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM subcategories) as subcategories,
        (SELECT COUNT(*) FROM products) as products
    `);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Categories: ${finalCounts.rows[0].categories}`);
    console.log(`   Subcategories: ${finalCounts.rows[0].subcategories}`);
    console.log(`   Products: ${finalCounts.rows[0].products}`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

simpleSeed()
  .then(() => {
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });