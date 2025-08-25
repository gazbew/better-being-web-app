# Customer Management Backend

This is a Node.js + Express backend for customer management, using PostgreSQL (Neon) and Stack Auth for admin authentication.

## Features
- REST API for customer CRUD and analytics
- PostgreSQL database (Neon-ready)
- Stack Auth integration (admin-only)
- CORS, dotenv, error handling
- Ready for frontend integration

## Setup
1. Copy `.env` and fill in your database and Stack Auth credentials.
2. Run `npm install` to install dependencies.
3. Start the server: `node index.js`

## Endpoints
- `GET /api/health` — Health check
- (Customer endpoints coming next)

## Development
- All config in `.env`
- Extend with new routes in `index.js` or modularize as needed
