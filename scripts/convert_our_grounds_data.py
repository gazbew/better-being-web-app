#!/usr/bin/env python3
"""
Script to convert Our Grounds product data to Better Being Web application format
"""

import json
import re
import random
from pathlib import Path

def clean_price(price_str):
    """Extract numeric value from price string like 'R185,00'"""
    if not price_str:
        return "R0"
    # Remove R, commas, and .00
    clean = re.sub(r'[R,]', '', price_str)
    clean = re.sub(r'\.00$', '', clean)
    return f"R{clean}"

def generate_image_path(product_name, image_url, is_main=True):
    """Generate local image path from product name and URL"""
    # Clean product name for file path
    clean_name = re.sub(r'[^\w\s-]', '', product_name.lower())
    clean_name = re.sub(r'\s+', '_', clean_name)

    if is_main:
        return f"/products/{clean_name}.webp"
    else:
        # For additional images, add a number
        img_num = random.randint(2, 5)
        return f"/products/{clean_name}_{img_num}.webp"

def map_category(og_category, tags):
    """Map Our Grounds category and tags to application categories"""
    # Convert tags to lowercase for matching
    lower_tags = [tag.lower() for tag in tags]

    # Check for skincare products
    if any(tag in ['skin & beauty', 'skincare'] for tag in lower_tags):
        return "natural-skincare", "skincare"

    # Check for digital products
    if any(tag in ['recipes', 'ebooks'] for tag in lower_tags):
        return "digital-products", "ebooks"

    # Check for specific wellness subcategories
    if any(tag in ['bone, joint & muscle'] for tag in lower_tags):
        return "wellness-essentials", "pain-relief"

    if any(tag in ['respiratory health'] for tag in lower_tags):
        return "wellness-essentials", "respiratory"

    if any(tag in ['energy & fitness'] for tag in lower_tags):
        return "wellness-essentials", "energy-support"

    # Default to wellness essentials
    return "wellness-essentials", "multivitamins"

def extract_benefits_from_tags(tags):
    """Extract benefits from tags"""
    benefit_mapping = {
        'bone, joint & muscle': 'Pain Relief',
        'energy & fitness': 'Energy Support',
        'skin & beauty': 'Skin Health',
        'respiratory health': 'Respiratory Support',
        'nutrition & supplements': 'Nutritional Support'
    }

    benefits = []
    for tag in tags:
        tag_lower = tag.lower()
        if tag_lower in benefit_mapping:
            benefits.append(benefit_mapping[tag_lower])

    # Ensure at least one benefit
    if not benefits:
        benefits = ['General Wellness']

    return benefits

def clean_tags(tags):
    """Clean and format tags for the application"""
    cleaned = []
    for tag in tags:
        # Convert to lowercase and replace spaces/special chars with dashes
        clean_tag = re.sub(r'[^\w\s&]', '', tag.lower())
        clean_tag = re.sub(r'\s+', '-', clean_tag)
        clean_tag = re.sub(r'&', 'and', clean_tag)
        if clean_tag and clean_tag not in cleaned:
            cleaned.append(clean_tag)
    return cleaned[:8]  # Limit to 8 tags

def generate_realistic_rating():
    """Generate a realistic product rating between 4.0 and 5.0"""
    return round(random.uniform(4.0, 5.0), 1)

def generate_review_count():
    """Generate a realistic review count"""
    return random.randint(15, 150)

def convert_our_grounds_data():
    """Main conversion function"""

    # Load the Our Grounds data
    with open('our_grounds_detailed_products.json', 'r', encoding='utf-8') as f:
        og_data = json.load(f)

    products = []
    categories = [
        {
            "id": "wellness-essentials",
            "name": "Wellness Essentials",
            "description": "Core supplements for daily health and vitality",
            "icon": "Heart",
            "subcategories": [
                {"id": "multivitamins", "name": "Multivitamins", "description": "Complete vitamin and mineral support"},
                {"id": "pain-relief", "name": "Pain Relief", "description": "Natural pain management solutions"},
                {"id": "energy-support", "name": "Energy Support", "description": "Natural energy and vitality boosters"},
                {"id": "digestive", "name": "Digestive Health", "description": "Gut health and digestive support"},
                {"id": "respiratory", "name": "Respiratory Health", "description": "Breathing and lung support"}
            ]
        },
        {
            "id": "natural-skincare",
            "name": "Natural Skincare",
            "description": "Pure, organic skincare solutions",
            "icon": "Sparkles",
            "subcategories": [
                {"id": "skincare", "name": "Face Care", "description": "Natural facial care products"},
                {"id": "body-care", "name": "Body Care", "description": "Nourishing body care essentials"}
            ]
        },
        {
            "id": "digital-products",
            "name": "Digital Wellness",
            "description": "E-books, guides and digital wellness resources",
            "icon": "BookOpen",
            "subcategories": [
                {"id": "ebooks", "name": "Recipe E-Books", "description": "Digital recipe collections and guides"},
                {"id": "programs", "name": "Wellness Programs", "description": "Structured wellness programs"}
            ]
        }
    ]

    for i, og_product in enumerate(og_data.get('detailed_products', []), 1):
        if not og_product.get('name'):
            continue

        # Map category and subcategory
        category_id, subcategory_id = map_category(
            og_product.get('category', ''),
            og_product.get('tags', [])
        )

        # Generate realistic data
        rating = generate_realistic_rating()
        reviews = generate_review_count()

        # Extract benefits from tags
        benefits = extract_benefits_from_tags(og_product.get('tags', []))

        # Generate SKU
        name_parts = og_product['name'].split()[:3]
        sku_suffix = ''.join([part[:3].upper() for part in name_parts])
        sku = f"OG-{sku_suffix}-{i:03d}"

        # Clean price
        price = clean_price(og_product.get('price', 'R0'))

        # Generate original price (sometimes higher for discounts)
        original_price = None
        if random.random() > 0.7:  # 30% chance of having original price
            base_price = int(price.replace('R', ''))
            original_price = f"R{base_price + random.randint(20, 50)}"

        # Generate main image path
        main_image = generate_image_path(og_product['name'], '', True)

        # Generate additional images
        additional_images = []
        num_additional = min(4, len(og_product.get('images', [])) - 1)
        for _ in range(num_additional):
            additional_images.append(generate_image_path(og_product['name'], '', False))

        # Determine if featured or popular
        is_featured = rating >= 4.7 or 'featured' in og_product.get('tags', [])
        is_popular = reviews >= 100 or 'best seller' in [tag.lower() for tag in og_product.get('tags', [])]

        product = {
            "id": i,
            "sku": sku,
            "name": og_product['name'],
            "description": og_product.get('short_description', '')[:120] + "..." if len(og_product.get('short_description', '')) > 120 else og_product.get('short_description', ''),
            "longDescription": og_product.get('short_description', ''),
            "price": price,
            "originalPrice": original_price,
            "rating": rating,
            "reviews": reviews,
            "benefits": benefits,
            "ingredients": og_product.get('ingredients', '').split(', ') if og_product.get('ingredients') else ['Natural ingredients'],
            "usage": og_product.get('usage', '') or "Follow package instructions or consult healthcare provider.",
            "warnings": "Not suitable for pregnant or nursing women. Consult your healthcare provider before use." if category_id == "wellness-essentials" else "",
            "categoryId": category_id,
            "subcategoryId": subcategory_id,
            "image": main_image,
            "additionalImages": additional_images,
            "popular": is_popular,
            "featured": is_featured,
            "inStock": og_product.get('in_stock', True),
            "stockCount": random.randint(25, 150),
            "tags": clean_tags(og_product.get('tags', []))
        }

        products.append(product)

    # Generate TypeScript file content
    ts_content = """import { Product, Category } from '@/types/product';

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  warnings?: string;
  categoryId: string;
  subcategoryId: string;
  image: string;
  additionalImages: string[];
  popular: boolean;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

"""

    # Add categories
    ts_content += f"export const categories: Category[] = {json.dumps(categories, indent=2)};\n\n"

    # Add products
    ts_content += f"export const products: Product[] = {json.dumps(products, indent=2)};\n\n"

    # Add utility functions
    ts_content += """
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getPopularProducts = (): Product[] => {
  return products.filter(product => product.popular);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByTag = (tag: string): Product[] => {
  return products.filter(product => product.tags.includes(tag));
};

export const getRelatedProducts = (productId: number, limit: number = 4): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];

  const related = products.filter(p =>
    p.id !== productId &&
    (p.categoryId === product.categoryId ||
     p.tags.some(tag => product.tags.includes(tag)))
  );

  return related.slice(0, limit);
};
"""

    # Write the converted data
    output_path = Path('src/data/products_converted.ts')
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"✅ Successfully converted {len(products)} products to {output_path}")
    print(f"📊 Categories: {len(categories)}")
    print(f"📦 Featured products: {len([p for p in products if p['featured']])}")
    print(f"🔥 Popular products: {len([p for p in products if p['popular']])}")

if __name__ == "__main__":
    convert_our_grounds_data()
