
<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Customer Management Backend

## Project Architecture
- **Node.js + Express** backend for customer management
- **PostgreSQL (Neon)** as the database (see `db.sql` for schema)
- **Stack Auth** for admin authentication (see `.env` for keys)
- RESTful API endpoints for all customer CRUD and analytics
- Modular, maintainable code with robust error handling and input validation (Joi)

## Key Files & Structure
- `index.js`: Main Express app, all routes and middleware start here
- `db.sql`: Full schema for customers, billing, shipping, orders, and meta tables
- `.env`: All config (DB URL, port, Stack Auth keys)
- `.vscode/tasks.json`: VS Code task for starting the backend
- `README.md`: Setup, features, and usage

## Patterns & Conventions
- Use **async/await** for all DB and API logic
- Validate all input with Joi before DB operations
- Use `pool` from `pg` for all database queries
- All API endpoints are under `/api/` (e.g., `/api/customers`)
- Error responses are always JSON with an `error` key
- Use CORS and JSON middleware globally
- Extend with new routes by modularizing from `index.js` as needed

## Developer Workflows
- Install dependencies: `npm install`
- Start server: `node index.js` or use VS Code task "Start Backend Server"
- Configure environment: edit `.env` (never commit secrets)
- Run DB migrations: apply `db.sql` to your Neon/Postgres instance
- Add new endpoints: follow RESTful patterns and validate input

## Integration Points
- **Frontend**: Connects via REST API (CORS enabled)
- **Stack Auth**: Integrate for admin-only access (see `.env` for keys)
- **Database**: All data flows through Postgres (see `db.sql` for relations)

## Example: Add a New Customer Endpoint
```js
app.post('/api/customers', async (req, res) => {
	const { error, value } = customerSchema.validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	// ...insert into DB
});
```

## Special Notes
- All customer-related logic is in this workspace; admin/auth logic is separate
- Use the provided schema and patterns for all new features
- Keep code modular and document new endpoints in `README.md`
