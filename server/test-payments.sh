#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huQHRlc3QuY29tIiwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwiaWF0IjoxNzU1MTA4MDI0LCJleHAiOjE3NTUxMTE2MjR9.3rRA7TZULJbAuOCZfHdjQ4BEN96TMT_AyPsuGXDyxic"

echo "=== Testing Paystack Payment Integration ==="

echo -e "\n1. Testing GET /api/payments/config (payment configuration)..."
curl -s http://localhost:3001/api/payments/config | jq .

echo -e "\n2. Testing POST /api/payments/initialize/1 (initialize payment for order 1)..."
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/payments/initialize/1 | jq .

# Get the reference from the response for further testing
echo -e "\n3. Testing GET /api/payments/order/1 (get order transactions)..."
curl -s \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/payments/order/1 | jq .

echo -e "\n4. Testing webhook endpoint (simulated)..."
echo "Webhook endpoint: POST /api/payments/webhook"
echo "This would be called by Paystack with payment updates"

echo -e "\n5. Testing payment callback (simulated)..."
echo "Callback endpoint: GET /api/payments/callback?reference=test-reference"
echo "This would redirect users after payment"