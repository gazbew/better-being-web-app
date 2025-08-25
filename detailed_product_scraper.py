#!/usr/bin/env python3
"""
Detailed Product Scraper for Our Grounds
Scrapes individual product pages for complete information
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin
import os

class DetailedProductScraper:
    def __init__(self):
        self.base_url = "https://our-grounds.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.detailed_products = []
    
    def get_page(self, url):
        """Fetch a page with error handling"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_product_details(self, url):
        """Extract detailed information from a product page"""
        print(f"Scraping product: {url}")
        response = self.get_page(url)
        if not response:
            return None
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        product = {
            'url': url,
            'name': '',
            'price': '',
            'description': '',
            'short_description': '',
            'images': [],
            'ingredients': '',
            'benefits': '',
            'usage': '',
            'category': '',
            'tags': [],
            'in_stock': True,
            'sku': '',
            'weight': '',
            'dimensions': '',
            'additional_info': {}
        }
        
        # Product name
        name_selectors = [
            'h1.product_title',
            'h1.entry-title',
            '.product-title h1',
            'h1'
        ]
        for selector in name_selectors:
            name_elem = soup.select_one(selector)
            if name_elem:
                product['name'] = name_elem.get_text(strip=True)
                break
        
        # Product price
        price_selectors = [
            '.price .woocommerce-Price-amount',
            '.price',
            '.product-price',
            '[class*="price"]'
        ]
        for selector in price_selectors:
            price_elem = soup.select_one(selector)
            if price_elem:
                product['price'] = price_elem.get_text(strip=True)
                break
        
        # Product description
        desc_selectors = [
            '.woocommerce-product-details__short-description',
            '.product-short-description',
            '.entry-summary p',
            '.product-description'
        ]
        for selector in desc_selectors:
            desc_elem = soup.select_one(selector)
            if desc_elem:
                product['short_description'] = desc_elem.get_text(strip=True)
                break
        
        # Full description from tabs
        desc_tab = soup.find('div', {'id': 'tab-description'})
        if desc_tab:
            product['description'] = desc_tab.get_text(strip=True)
        
        # Additional information tab
        additional_tab = soup.find('div', {'id': 'tab-additional_information'})
        if additional_tab:
            # Extract table data
            table = additional_tab.find('table')
            if table:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) == 2:
                        key = cells[0].get_text(strip=True)
                        value = cells[1].get_text(strip=True)
                        product['additional_info'][key] = value
        
        # Product images
        image_selectors = [
            '.woocommerce-product-gallery img',
            '.product-images img',
            '.product-gallery img',
            'img[src*="wp-content/uploads"]'
        ]
        for selector in image_selectors:
            images = soup.select(selector)
            for img in images:
                src = img.get('src') or img.get('data-src')
                if src and src not in product['images']:
                    product['images'].append(urljoin(self.base_url, src))
        
        # Category
        breadcrumb = soup.find('nav', class_=re.compile(r'breadcrumb', re.I))
        if breadcrumb:
            links = breadcrumb.find_all('a')
            if len(links) > 1:
                product['category'] = links[-2].get_text(strip=True)
        
        # Tags
        tag_elements = soup.find_all('a', {'rel': 'tag'})
        for tag in tag_elements:
            product['tags'].append(tag.get_text(strip=True))
        
        # Stock status
        stock_elem = soup.find(class_=re.compile(r'stock|availability', re.I))
        if stock_elem:
            stock_text = stock_elem.get_text(strip=True).lower()
            product['in_stock'] = 'out of stock' not in stock_text
        
        # SKU
        sku_elem = soup.find(class_='sku')
        if sku_elem:
            product['sku'] = sku_elem.get_text(strip=True)
        
        # Extract structured data (JSON-LD)
        json_ld_scripts = soup.find_all('script', type='application/ld+json')
        for script in json_ld_scripts:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and data.get('@type') == 'Product':
                    if 'offers' in data:
                        offer = data['offers']
                        if isinstance(offer, dict):
                            product['price'] = offer.get('price', product['price'])
                            product['in_stock'] = offer.get('availability', '').endswith('InStock')
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and item.get('@type') == 'Product':
                            if 'offers' in item:
                                offer = item['offers']
                                if isinstance(offer, dict):
                                    product['price'] = offer.get('price', product['price'])
            except json.JSONDecodeError:
                continue
        
        return product
    
    def scrape_all_products(self):
        """Load existing data and scrape all product URLs"""
        # Load the basic scraped data
        try:
            with open('our_grounds_scraped_data.json', 'r', encoding='utf-8') as f:
                basic_data = json.load(f)
        except FileNotFoundError:
            print("Please run the basic scraper first!")
            return
        
        # Get unique product URLs
        product_urls = set()
        for product in basic_data.get('products', []):
            url = product.get('url', '')
            if url and '/product/' in url:
                product_urls.add(url)
        
        print(f"Found {len(product_urls)} unique product URLs to scrape")
        
        # Scrape each product
        for i, url in enumerate(product_urls, 1):
            print(f"Progress: {i}/{len(product_urls)}")
            product_details = self.extract_product_details(url)
            if product_details:
                self.detailed_products.append(product_details)
            time.sleep(2)  # Be respectful
        
        # Save detailed product data
        output_data = {
            'company_info': basic_data.get('company_info', {}),
            'detailed_products': self.detailed_products,
            'total_products': len(self.detailed_products),
            'scrape_timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        with open('our_grounds_detailed_products.json', 'w', encoding='utf-8') as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        
        print(f"Detailed product data saved! Scraped {len(self.detailed_products)} products")

if __name__ == "__main__":
    scraper = DetailedProductScraper()
    scraper.scrape_all_products()