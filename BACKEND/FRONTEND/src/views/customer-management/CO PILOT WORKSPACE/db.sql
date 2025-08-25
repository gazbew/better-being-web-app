-- Customer table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  industry TEXT,
  joined DATE,
  avatar_url TEXT,
  account_number TEXT,
  loyalty_points INTEGER
);

-- Billing info
CREATE TABLE IF NOT EXISTS customer_billing (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  name TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT,
  phone TEXT
);

-- Shipping info
CREATE TABLE IF NOT EXISTS customer_shipping (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  name TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT,
  phone TEXT
);

-- Orders
CREATE TABLE IF NOT EXISTS customer_orders (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  order_id TEXT,
  date DATE,
  total NUMERIC,
  status TEXT
);

-- Meta data
CREATE TABLE IF NOT EXISTS customer_meta (
  id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  key TEXT,
  value TEXT
);
