#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQHRlc3QuY29tIiwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwiaWF0IjoxNzU1MTA4MDI0LCJleHAiOjE3NTUxMTE2MjR9.3rRA7TZULJbAuOCZfHdjQ4BEN96TMT_AyPsuGXDyxic"

echo "=== Testing Order Management API ==="

echo -e "\n1. Testing GET /api/orders (user order history)..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/orders | jq .

echo -e "\n2. Testing GET /api/orders/stats (user order stats)..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/orders/stats | jq .

echo -e "\n3. Testing POST /api/orders (create order from cart)..."
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @test-order.json \
  http://localhost:3001/api/orders | jq .