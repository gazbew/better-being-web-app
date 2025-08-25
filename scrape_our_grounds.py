#!/usr/bin/env python3
"""
Our Grounds Website Scraper
Comprehensive scraping of https://our-grounds.com/ for all products and company information
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
import os

class OurGroundsScraper:
    def __init__(self):
        self.base_url = "https://our-grounds.com"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.scraped_data = {
            'company_info': {},
            'products': [],
            'pages': {},
            'navigation': [],
            'contact_info': {},
            'social_media': [],
            'images': [],
            'blog_posts': []
        }
    
    def get_page(self, url):
        """Fetch a page with error handling"""
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_text_content(self, soup):
        """Extract clean text content from soup"""
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        return soup.get_text(strip=True, separator=' ')
    
    def scrape_homepage(self):
        """Scrape homepage for company info and navigation"""
        print("Scraping homepage...")
        response = self.get_page(self.base_url)
        if not response:
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract company info from meta tags
        self.scraped_data['company_info']['name'] = soup.find('meta', property='og:site_name')
        if self.scraped_data['company_info']['name']:
            self.scraped_data['company_info']['name'] = self.scraped_data['company_info']['name'].get('content', '')
        
        description = soup.find('meta', property='og:description')
        if description:
            self.scraped_data['company_info']['description'] = description.get('content', '')
        
        # Extract navigation
        nav_elements = soup.find_all(['nav', 'ul'], class_=re.compile(r'menu|nav', re.I))
        for nav in nav_elements:
            links = nav.find_all('a')
            for link in links:
                href = link.get('href', '')
                text = link.get_text(strip=True)
                if href and text and href not in [item.get('url', '') for item in self.scraped_data['navigation']]:
                    self.scraped_data['navigation'].append({
                        'text': text,
                        'url': urljoin(self.base_url, href)
                    })
        
        # Store homepage content
        self.scraped_data['pages']['homepage'] = {
            'url': self.base_url,
            'title': soup.title.string if soup.title else '',
            'content': self.extract_text_content(soup)
        }
    
    def scrape_about_page(self):
        """Scrape about us page"""
        print("Scraping about page...")
        about_url = f"{self.base_url}/about-us/"
        response = self.get_page(about_url)
        if not response:
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        self.scraped_data['pages']['about'] = {
            'url': about_url,
            'title': soup.title.string if soup.title else '',
            'content': self.extract_text_content(soup)
        }
    
    def scrape_contact_page(self):
        """Scrape contact page"""
        print("Scraping contact page...")
        contact_url = f"{self.base_url}/contact-us/"
        response = self.get_page(contact_url)
        if not response:
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract contact information
        contact_info = {}
        
        # Look for email addresses
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', soup.get_text())
        if emails:
            contact_info['emails'] = list(set(emails))
        
        # Look for phone numbers
        phones = re.findall(r'[\+]?[1-9]?[0-9]{7,15}', soup.get_text())
        if phones:
            contact_info['phones'] = list(set(phones))
        
        # Look for addresses
        address_keywords = ['address', 'location', 'office']
        for keyword in address_keywords:
            elements = soup.find_all(text=re.compile(keyword, re.I))
            for element in elements:
                parent = element.parent
                if parent:
                    text = parent.get_text(strip=True)
                    if len(text) > 20 and len(text) < 200:
                        contact_info.setdefault('addresses', []).append(text)
        
        self.scraped_data['contact_info'] = contact_info
        self.scraped_data['pages']['contact'] = {
            'url': contact_url,
            'title': soup.title.string if soup.title else '',
            'content': self.extract_text_content(soup)
        }
    
    def scrape_shop_page(self):
        """Scrape shop/products page"""
        print("Scraping shop page...")
        shop_url = f"{self.base_url}/shop/"
        response = self.get_page(shop_url)
        if not response:
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract product information
        products = soup.find_all(['div', 'article'], class_=re.compile(r'product|item', re.I))
        
        for product in products:
            product_data = {}
            
            # Product name
            name_elem = product.find(['h1', 'h2', 'h3', 'h4'], class_=re.compile(r'title|name', re.I))
            if not name_elem:
                name_elem = product.find(['h1', 'h2', 'h3', 'h4'])
            if name_elem:
                product_data['name'] = name_elem.get_text(strip=True)
            
            # Product price
            price_elem = product.find(class_=re.compile(r'price|cost|amount', re.I))
            if price_elem:
                product_data['price'] = price_elem.get_text(strip=True)
            
            # Product link
            link_elem = product.find('a')
            if link_elem:
                product_data['url'] = urljoin(self.base_url, link_elem.get('href', ''))
            
            # Product image
            img_elem = product.find('img')
            if img_elem:
                product_data['image'] = urljoin(self.base_url, img_elem.get('src', ''))
            
            # Product description
            desc_elem = product.find(class_=re.compile(r'description|excerpt|summary', re.I))
            if desc_elem:
                product_data['description'] = desc_elem.get_text(strip=True)
            
            if product_data.get('name'):
                self.scraped_data['products'].append(product_data)
        
        self.scraped_data['pages']['shop'] = {
            'url': shop_url,
            'title': soup.title.string if soup.title else '',
            'content': self.extract_text_content(soup)
        }
    
    def scrape_blog(self):
        """Scrape blog posts"""
        print("Scraping blog...")
        blog_url = f"{self.base_url}/blog/"
        response = self.get_page(blog_url)
        if not response:
            return
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract blog posts
        posts = soup.find_all(['article', 'div'], class_=re.compile(r'post|article|entry', re.I))
        
        for post in posts:
            post_data = {}
            
            # Post title
            title_elem = post.find(['h1', 'h2', 'h3'], class_=re.compile(r'title|heading', re.I))
            if not title_elem:
                title_elem = post.find(['h1', 'h2', 'h3'])
            if title_elem:
                post_data['title'] = title_elem.get_text(strip=True)
            
            # Post link
            link_elem = post.find('a')
            if link_elem:
                post_data['url'] = urljoin(self.base_url, link_elem.get('href', ''))
            
            # Post excerpt
            excerpt_elem = post.find(class_=re.compile(r'excerpt|summary|description', re.I))
            if excerpt_elem:
                post_data['excerpt'] = excerpt_elem.get_text(strip=True)
            
            # Post date
            date_elem = post.find(class_=re.compile(r'date|time|published', re.I))
            if date_elem:
                post_data['date'] = date_elem.get_text(strip=True)
            
            if post_data.get('title'):
                self.scraped_data['blog_posts'].append(post_data)
    
    def scrape_additional_pages(self):
        """Scrape additional important pages"""
        important_pages = [
            '/shipping-and-deliveries/',
            '/refund-policy/',
            '/terms-conditions/',
            '/privacy-policy/',
            '/become-a-stockist/',
            '/farming/',
            '/community/',
            '/testimonials/'
        ]
        
        for page_path in important_pages:
            print(f"Scraping {page_path}...")
            url = f"{self.base_url}{page_path}"
            response = self.get_page(url)
            if not response:
                continue
            
            soup = BeautifulSoup(response.content, 'html.parser')
            page_key = page_path.strip('/').replace('-', '_')
            
            self.scraped_data['pages'][page_key] = {
                'url': url,
                'title': soup.title.string if soup.title else '',
                'content': self.extract_text_content(soup)
            }
            
            time.sleep(1)  # Be respectful
    
    def extract_social_media(self):
        """Extract social media links from all pages"""
        social_patterns = {
            'facebook': r'facebook\.com',
            'instagram': r'instagram\.com',
            'twitter': r'twitter\.com|x\.com',
            'linkedin': r'linkedin\.com',
            'youtube': r'youtube\.com',
            'tiktok': r'tiktok\.com'
        }
        
        for page_data in self.scraped_data['pages'].values():
            if 'content' in page_data:
                for platform, pattern in social_patterns.items():
                    matches = re.findall(rf'https?://[^\s]*{pattern}[^\s]*', page_data['content'])
                    for match in matches:
                        if match not in [item.get('url', '') for item in self.scraped_data['social_media']]:
                            self.scraped_data['social_media'].append({
                                'platform': platform,
                                'url': match
                            })
    
    def save_data(self, filename='our_grounds_scraped_data.json'):
        """Save scraped data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    def run_full_scrape(self):
        """Run complete scraping process"""
        print("Starting comprehensive scrape of Our Grounds website...")
        
        self.scrape_homepage()
        time.sleep(2)
        
        self.scrape_about_page()
        time.sleep(2)
        
        self.scrape_contact_page()
        time.sleep(2)
        
        self.scrape_shop_page()
        time.sleep(2)
        
        self.scrape_blog()
        time.sleep(2)
        
        self.scrape_additional_pages()
        
        self.extract_social_media()
        
        self.save_data()
        
        print("Scraping completed!")
        print(f"Found {len(self.scraped_data['products'])} products")
        print(f"Scraped {len(self.scraped_data['pages'])} pages")
        print(f"Found {len(self.scraped_data['blog_posts'])} blog posts")
        print(f"Found {len(self.scraped_data['social_media'])} social media links")

if __name__ == "__main__":
    scraper = OurGroundsScraper()
    scraper.run_full_scrape()