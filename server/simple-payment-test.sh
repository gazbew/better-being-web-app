#!/bin/bash

echo "=== Testing Payment System Basic Endpoints ==="

echo -e "\n1. Testing Health Check..."
curl -s http://localhost:3001/health | jq .

echo -e "\n2. Testing Payment Configuration..."
curl -s http://localhost:3001/api/payments/config | jq .

echo -e "\n3. Testing Payment Config Response Structure..."
CONFIG=$(curl -s http://localhost:3001/api/payments/config)
echo "Success: $(echo $CONFIG | jq -r '.success')"
echo "Public Key: $(echo $CONFIG | jq -r '.config.publicKey')"  
echo "Test Mode: $(echo $CONFIG | jq -r '.config.testMode')"
echo "Supported Currencies: $(echo $CONFIG | jq -r '.config.supportedCurrencies[]' | tr '\n' ', ')"