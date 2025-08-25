#!/usr/bin/env python3
"""
Generate Comprehensive Report for Our Grounds Website Scraping
Combines all scraped data into a readable format
"""

import json
import os
from datetime import datetime

def load_json_file(filename):
    """Load JSON file with error handling"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Warning: {filename} not found")
        return {}
    except json.JSONDecodeError:
        print(f"Warning: Error reading {filename}")
        return {}

def generate_markdown_report():
    """Generate comprehensive markdown report"""
    
    # Load all data files
    basic_data = load_json_file('our_grounds_scraped_data.json')
    detailed_products = load_json_file('our_grounds_detailed_products.json')
    
    report = []
    report.append("# Our Grounds Website - Comprehensive Scraping Report")
    report.append(f"*Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")
    report.append("")
    
    # Company Information
    report.append("## Company Information")
    company_info = basic_data.get('company_info', {})
    report.append(f"**Company Name:** {company_info.get('name', 'Our Grounds')}")
    report.append(f"**Description:** {company_info.get('description', '')}")
    report.append("")
    
    # Contact Information
    contact_info = basic_data.get('contact_info', {})
    if contact_info:
        report.append("## Contact Information")
        
        if 'emails' in contact_info:
            report.append("**Email Addresses:**")
            for email in contact_info['emails']:
                report.append(f"- {email}")
            report.append("")
        
        if 'phones' in contact_info:
            report.append("**Phone Numbers:**")
            for phone in contact_info['phones']:
                report.append(f"- {phone}")
            report.append("")
        
        if 'addresses' in contact_info:
            report.append("**Addresses:**")
            for address in contact_info['addresses']:
                report.append(f"- {address}")
            report.append("")
    
    # Navigation Structure
    navigation = basic_data.get('navigation', [])
    if navigation:
        report.append("## Website Navigation")
        for nav_item in navigation[:20]:  # Limit to first 20 items
            report.append(f"- [{nav_item.get('text', '')}]({nav_item.get('url', '')})")
        report.append("")
    
    # Products Section
    products = detailed_products.get('detailed_products', [])
    if products:
        report.append(f"## Products ({len(products)} total)")
        report.append("")
        
        # Group products by category
        categories = {}
        for product in products:
            category = product.get('category', 'Uncategorized')
            if category not in categories:
                categories[category] = []
            categories[category].append(product)
        
        for category, category_products in categories.items():
            report.append(f"### {category} ({len(category_products)} products)")
            report.append("")
            
            for product in category_products:
                report.append(f"#### {product.get('name', 'Unnamed Product')}")
                
                if product.get('price'):
                    report.append(f"**Price:** {product['price']}")
                
                if product.get('short_description'):
                    report.append(f"**Description:** {product['short_description']}")
                
                if product.get('sku'):
                    report.append(f"**SKU:** {product['sku']}")
                
                stock_status = "In Stock" if product.get('in_stock', True) else "Out of Stock"
                report.append(f"**Stock Status:** {stock_status}")
                
                if product.get('tags'):
                    report.append(f"**Tags:** {', '.join(product['tags'])}")
                
                if product.get('url'):
                    report.append(f"**Product URL:** {product['url']}")
                
                # Additional information
                additional_info = product.get('additional_info', {})
                if additional_info:
                    report.append("**Additional Information:**")
                    for key, value in additional_info.items():
                        report.append(f"- {key}: {value}")
                
                # Images
                images = product.get('images', [])
                if images:
                    report.append("**Images:**")
                    for img in images[:3]:  # Limit to first 3 images
                        report.append(f"- {img}")
                
                report.append("")
    
    # Blog Posts
    blog_posts = basic_data.get('blog_posts', [])
    if blog_posts:
        report.append(f"## Blog Posts ({len(blog_posts)} total)")
        report.append("")
        
        for post in blog_posts[:10]:  # Limit to first 10 posts
            report.append(f"### {post.get('title', 'Untitled Post')}")
            
            if post.get('date'):
                report.append(f"**Date:** {post['date']}")
            
            if post.get('excerpt'):
                report.append(f"**Excerpt:** {post['excerpt']}")
            
            if post.get('url'):
                report.append(f"**URL:** {post['url']}")
            
            report.append("")
    
    # Social Media
    social_media = basic_data.get('social_media', [])
    if social_media:
        report.append("## Social Media Presence")
        for social in social_media:
            report.append(f"- **{social.get('platform', '').title()}:** {social.get('url', '')}")
        report.append("")
    
    # Website Pages
    pages = basic_data.get('pages', {})
    if pages:
        report.append(f"## Website Pages ({len(pages)} total)")
        report.append("")
        
        for page_key, page_data in pages.items():
            report.append(f"### {page_key.replace('_', ' ').title()}")
            report.append(f"**URL:** {page_data.get('url', '')}")
            report.append(f"**Title:** {page_data.get('title', '')}")
            
            # Show first 200 characters of content
            content = page_data.get('content', '')
            if content:
                preview = content[:200] + "..." if len(content) > 200 else content
                report.append(f"**Content Preview:** {preview}")
            
            report.append("")
    
    # Summary Statistics
    report.append("## Summary Statistics")
    report.append(f"- **Total Products:** {len(products)}")
    report.append(f"- **Total Blog Posts:** {len(blog_posts)}")
    report.append(f"- **Total Pages Scraped:** {len(pages)}")
    report.append(f"- **Navigation Items:** {len(navigation)}")
    report.append(f"- **Social Media Links:** {len(social_media)}")
    report.append("")
    
    # Technical Details
    report.append("## Technical Details")
    report.append("- **Website Platform:** WordPress with WooCommerce")
    report.append("- **Theme:** Hello Elementor")
    report.append("- **Key Plugins:** Elementor Pro, WooCommerce, Instagram Feed")
    report.append("- **Analytics:** Google Analytics (GT-WRDDWZL)")
    report.append("")
    
    return "\n".join(report)

def generate_json_summary():
    """Generate a JSON summary of all data"""
    basic_data = load_json_file('our_grounds_scraped_data.json')
    detailed_products = load_json_file('our_grounds_detailed_products.json')
    
    summary = {
        'company_info': basic_data.get('company_info', {}),
        'contact_info': basic_data.get('contact_info', {}),
        'products_summary': {
            'total_products': len(detailed_products.get('detailed_products', [])),
            'categories': {},
            'price_range': {'min': None, 'max': None},
            'in_stock_count': 0,
            'out_of_stock_count': 0
        },
        'content_summary': {
            'total_pages': len(basic_data.get('pages', {})),
            'blog_posts': len(basic_data.get('blog_posts', [])),
            'navigation_items': len(basic_data.get('navigation', [])),
            'social_media_links': len(basic_data.get('social_media', []))
        },
        'scrape_metadata': {
            'timestamp': datetime.now().isoformat(),
            'base_url': 'https://our-grounds.com',
            'total_urls_scraped': len(basic_data.get('pages', {})) + len(detailed_products.get('detailed_products', []))
        }
    }
    
    # Analyze products
    products = detailed_products.get('detailed_products', [])
    prices = []
    
    for product in products:
        # Category analysis
        category = product.get('category', 'Uncategorized')
        if category not in summary['products_summary']['categories']:
            summary['products_summary']['categories'][category] = 0
        summary['products_summary']['categories'][category] += 1
        
        # Stock analysis
        if product.get('in_stock', True):
            summary['products_summary']['in_stock_count'] += 1
        else:
            summary['products_summary']['out_of_stock_count'] += 1
        
        # Price analysis
        price_text = product.get('price', '')
        if price_text:
            # Extract numeric price (assuming R format)
            import re
            price_match = re.search(r'R?(\d+(?:,\d+)*(?:\.\d+)?)', price_text.replace(',', ''))
            if price_match:
                price = float(price_match.group(1))
                prices.append(price)
    
    if prices:
        summary['products_summary']['price_range']['min'] = min(prices)
        summary['products_summary']['price_range']['max'] = max(prices)
    
    return summary

if __name__ == "__main__":
    # Generate markdown report
    markdown_report = generate_markdown_report()
    with open('OUR_GROUNDS_COMPREHENSIVE_REPORT.md', 'w', encoding='utf-8') as f:
        f.write(markdown_report)
    
    # Generate JSON summary
    json_summary = generate_json_summary()
    with open('our_grounds_summary.json', 'w', encoding='utf-8') as f:
        json.dump(json_summary, f, indent=2, ensure_ascii=False)
    
    print("Reports generated successfully!")
    print("- OUR_GROUNDS_COMPREHENSIVE_REPORT.md")
    print("- our_grounds_summary.json")
    print(f"Total products scraped: {len(json_summary['products_summary']['categories'])}")