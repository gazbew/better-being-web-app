require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


const Joi = require('joi');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Customer schema for validation
const customerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  status: Joi.string().valid('Active', 'Inactive').required(),
  type: Joi.string().valid('Individual', 'Business').required(),
  industry: Joi.string().allow(''),
  joined: Joi.date().iso(),
  avatar_url: Joi.string().uri().allow(''),
  account_number: Joi.string().allow(''),
  loyalty_points: Joi.number().integer().allow(null),
});

// GET /api/customers - list all customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY joined DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - get customer by id
app.get('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers - create customer
app.post('/api/customers', async (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const { name, email, status, type, industry, joined, avatar_url, account_number, loyalty_points } = value;
    const result = await pool.query(
      `INSERT INTO customers (name, email, status, type, industry, joined, avatar_url, account_number, loyalty_points)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, email, status, type, industry, joined, avatar_url, account_number, loyalty_points]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id - update customer
app.put('/api/customers/:id', async (req, res) => {
  const { error, value } = customerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const { id } = req.params;
    const { name, email, status, type, industry, joined, avatar_url, account_number, loyalty_points } = value;
    const result = await pool.query(
      `UPDATE customers SET name=$1, email=$2, status=$3, type=$4, industry=$5, joined=$6, avatar_url=$7, account_number=$8, loyalty_points=$9 WHERE id=$10 RETURNING *`,
      [name, email, status, type, industry, joined, avatar_url, account_number, loyalty_points, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id - delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
