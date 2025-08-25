import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Mock the database module first (hoisted)
vi.mock('../../config/database.js', () => ({
  default: {
    query: vi.fn(),
  }
}));

// Import after mocking
import productsRouter from '../products.js';
import pool from '../../config/database.js';

// Get reference to the mocked pool
const mockPool = pool;

// Create test app
const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/products', productsRouter);
  return app;
};

describe('/api/products', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return all products', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Product 1',
          price: 29.99,
          description: 'Test product 1',
          category_name: 'Supplements',
          subcategory_name: 'Vitamins',
          benefits: ['Health'],
          ingredients: ['Vitamin C'],
          tags: ['organic'],
          sizes: [{ size: '100ml', price: 29.99, original_price: null }],
        },
        {
          id: 2,
          name: 'Product 2',
          price: 39.99,
          description: 'Test product 2',
          category_name: 'Skincare',
          subcategory_name: 'Face Care',
          benefits: ['Anti-aging'],
          ingredients: ['Retinol'],
          tags: ['premium'],
          sizes: [{ size: '50ml', price: 39.99, original_price: null }],
        }
      ];

      // Mock the main products query
      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });
      
      // Mock the count query
      mockPool.query.mockResolvedValueOnce({ rows: [{ total: '2' }] });

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(2);
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body).toHaveProperty('limit', 20);
      expect(response.body).toHaveProperty('offset', 0);
      
      expect(response.body.products[0]).toMatchObject({
        id: 1,
        name: 'Product 1',
        price: 29.99,
      });
    });

    it('should filter products by category', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Supplement Product',
          price: 29.99,
          category_name: 'Supplements',
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });
      mockPool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });

      const response = await request(app)
        .get('/api/products?category=supplements')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('c.slug = $'),
        expect.arrayContaining(['supplements'])
      );
    });

    it('should search products by name', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Vitamin C Supplement',
          price: 29.99,
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });
      mockPool.query.mockResolvedValueOnce({ rows: [{ total: '1' }] });

      const response = await request(app)
        .get('/api/products?search=vitamin')
        .expect(200);

      expect(response.body.products).toHaveLength(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.arrayContaining(['%vitamin%'])
      );
    });

    it('should sort products by price', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 19.99 },
        { id: 2, name: 'Product 2', price: 29.99 },
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });
      mockPool.query.mockResolvedValueOnce({ rows: [{ total: '2' }] });

      const response = await request(app)
        .get('/api/products?sort=price-low')
        .expect(200);

      expect(response.body.products).toHaveLength(2);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY p.price ASC'),
        expect.any(Array)
      );
    });

    it('should handle pagination correctly', async () => {
      const mockProducts = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 29.99,
      }));

      mockPool.query.mockResolvedValueOnce({ rows: mockProducts });
      mockPool.query.mockResolvedValueOnce({ rows: [{ total: '50' }] });

      const response = await request(app)
        .get('/api/products?limit=5&offset=10')
        .expect(200);

      expect(response.body.products).toHaveLength(5);
      expect(response.body.total).toBe(50);
      expect(response.body.limit).toBe(5);
      expect(response.body.offset).toBe(10);
    });

    it('should handle database errors gracefully', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch products');
    });
  });

  describe('GET /:id', () => {
    it('should return a single product by id', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Product',
        price: 29.99,
        description: 'A test product',
        category_name: 'Supplements',
        subcategory_name: 'Vitamins',
        benefits: ['Health'],
        ingredients: ['Vitamin C'],
        tags: ['organic'],
        sizes: [{ size: '100ml', price: 29.99, original_price: null }],
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockProduct] });

      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toMatchObject({
        id: 1,
        name: 'Test Product',
        price: 29.99,
      });
    });

    it('should return 404 for non-existent product', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Product not found');
    });

    it('should handle database errors for single product', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/1')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch product');
    });
  });

  describe('GET /categories/all', () => {
    it('should return all categories with subcategories', async () => {
      const mockCategories = [
        {
          id: 1,
          name: 'Supplements',
          slug: 'supplements',
          description: 'Health supplements',
          subcategories: [
            {
              id: 1,
              name: 'Vitamins',
              slug: 'vitamins',
              description: 'Vitamin supplements'
            },
            {
              id: 2,
              name: 'Minerals',
              slug: 'minerals',
              description: 'Mineral supplements'
            }
          ]
        },
        {
          id: 2,
          name: 'Skincare',
          slug: 'skincare',
          description: 'Skincare products',
          subcategories: [
            {
              id: 3,
              name: 'Face Care',
              slug: 'face-care',
              description: 'Face care products'
            }
          ]
        }
      ];

      mockPool.query.mockResolvedValueOnce({ rows: mockCategories });

      const response = await request(app)
        .get('/api/products/categories/all')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('name', 'Supplements');
      expect(response.body[0]).toHaveProperty('subcategories');
      expect(response.body[0].subcategories).toHaveLength(2);
    });

    it('should handle database errors for categories', async () => {
      mockPool.query.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/products/categories/all')
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch categories');
    });
  });
});
