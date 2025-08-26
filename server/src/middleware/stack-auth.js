import jwt from 'jsonwebtoken';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import pool from '../config/database.js';

// JWKS setup with caching
let jwks;
function getJwks() {
  if (!jwks) {
    const url = process.env.STACK_JWKS_URL;
    if (!url) throw new Error('STACK_JWKS_URL is not configured');
    jwks = createRemoteJWKSet(new URL(url));
  }
  return jwks;
}

async function verifyWithStackAuth(token) {
  const { payload } = await jwtVerify(token, getJwks(), {
    algorithms: ['RS256', 'ES256', 'PS256'],
  });
  return payload;
}

function verifyWithLocalSecret(token) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
  return jwt.verify(token, process.env.JWT_SECRET);
}

async function getOrCreateUserFromClaims(claims) {
  // Prefer internal id from our tokens
  if (claims.id) {
    const result = await pool.query('SELECT id, email, first_name, last_name, email_verified FROM users WHERE id = $1', [claims.id]);
    if (result.rows.length > 0) return result.rows[0];
  }

  // Fall back to email from provider
  const email = (claims.email || '').toLowerCase();
  if (!email) return null;

  const found = await pool.query('SELECT id, email, first_name, last_name, email_verified FROM users WHERE email = $1', [email]);
  if (found.rows.length > 0) return found.rows[0];

  // Create a minimal user record
  const emailVerified = !!claims.email_verified;
  const first = claims.given_name || claims.name || '';
  const last = claims.family_name || '';
  const insert = await pool.query(
    `INSERT INTO users (email, password, first_name, last_name, email_verified)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name, last_name, email_verified`,
    [email, '$external$' /* sentinel hash */, first, last, emailVerified]
  );
  return insert.rows[0];
}

export async function verifyAnyToken(token) {
  // Try local JWT first
  try {
    const payload = verifyWithLocalSecret(token);
    return { source: 'local', payload };
  } catch (_) {}

  // Try Stack Auth JWKS
  const payload = await verifyWithStackAuth(token);
  return { source: 'stack', payload };
}

export async function authenticateHybrid(req, res, next) {
  try {
    let token = req.cookies?.auth_token;
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'Access token required', code: 'MISSING_TOKEN' });

    const { source, payload } = await verifyAnyToken(token);

    // Resolve user from DB
    const user = await getOrCreateUserFromClaims(payload);
    if (!user) return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ message: 'Account temporarily locked', code: 'ACCOUNT_LOCKED' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: user.email_verified,
      tokenSource: source,
    };

    // Update last activity
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
  }
}

export async function optionalHybrid(req, _res, next) {
  try {
    let token = req.cookies?.auth_token;
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }
    if (!token) return next();

    const { source, payload } = await verifyAnyToken(token);
    const user = await getOrCreateUserFromClaims(payload);
    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        emailVerified: user.email_verified,
        tokenSource: source,
      };
    }
  } catch (_) {
    // ignore
  }
  next();
}

