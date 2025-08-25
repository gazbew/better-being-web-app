import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// SECURITY: Never hardcode secrets - use environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('CRITICAL ERROR: JWT_SECRET environment variable not set');
  console.error('Please create a .env file with JWT_SECRET configured');
  process.exit(1);
}

// Create a test token for user ID 1 (john@test.com)
const payload = {
  id: 1,
  email: 'john@test.com',
  firstName: 'John',
  lastName: 'Doe'
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

console.log('Test JWT Token:');
console.log(token);
console.log('\nTo use this token, include it in the Authorization header:');
console.log(`Authorization: Bearer ${token}`);