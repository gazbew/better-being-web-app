// Test setup for backend API tests
import dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock database for tests if needed
global.mockDb = {
  query: vi.fn(),
  connect: vi.fn(),
  end: vi.fn(),
};

// Global test helpers
global.testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  firstName: 'Test',
  lastName: 'User',
};

global.testProduct = {
  id: 1,
  name: 'Test Product',
  price: 29.99,
  description: 'A test product',
  category: 'supplements',
  inStock: true,
  featured: false,
};
