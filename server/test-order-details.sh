#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQHRlc3QuY29tIiwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwiaWF0IjoxNzU1MTA4MDI0LCJleHAiOjE3NTUxMTE2MjR9.3rRA7TZULJbAuOCZfHdjQ4BEN96TMT_AyPsuGXDyxic"

echo "=== Testing Order Details & Management ==="

echo -e "\n1. Testing GET /api/orders (after order creation)..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/orders | jq .

echo -e "\n2. Testing GET /api/orders/1 (order details)..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/orders/1 | jq .

echo -e "\n3. Testing GET /api/orders/stats (updated stats)..."
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/orders/stats | jq .

echo -e "\n4. Testing PATCH /api/orders/1/status (update status)..."
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed", "notes": "Payment verified"}' \
  http://localhost:3001/api/orders/1/status | jq .

echo -e "\n5. Testing PATCH /api/orders/1/payment (update payment)..."
curl -s -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"paymentStatus": "paid", "paymentReference": "PAY123456"}' \
  http://localhost:3001/api/orders/1/payment | jq .