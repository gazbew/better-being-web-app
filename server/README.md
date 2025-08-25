# Grounds Dimension Shift - Backend Server

## Database Setup

The backend is configured to use PostgreSQL hosted on Neon.

### Connection Details
- Database URL is stored in the `.env` file
- SSL is required for connection
- Connection pooling is enabled

### Initialize Database

To set up the database schema, run:

```bash
npm run db:init
```

This will create all necessary tables including:
- users
- categories & subcategories  
- products (with benefits, ingredients, tags, sizes)
- orders & order_items
- cart & wishlist
- reviews

### Running the Server

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### API Endpoints

#### Health Check
- `GET /api/health` - Check server and database status

#### Products
- `GET /api/products` - Get all products with filtering
  - Query params: category, subcategory, featured, popular, search, sort, limit, offset
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/all` - Get all categories with subcategories

#### Orders (To be implemented)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

#### Users (To be implemented)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Environment Variables

Create a `.env` file in the project root with:
```env
DATABASE_URL="your_postgresql_connection_string"
VITE_API_URL=http://localhost:3001/api
```