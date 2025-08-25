#!/usr/bin/env python3

import json
import re
from pathlib import Path
from typing import Dict, List, Any

def sanitize_string(text: str) -> str:
    """Sanitize strings for TypeScript usage."""
    if not text:
        return ""
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    # Escape quotes for TypeScript strings
    text = text.replace('"', '\\"').replace("'", "\\'")
    return text

def price_to_number(price_str: str) -> tuple:
    """Convert price string to number format."""
    if not price_str:
        return "R0", "R0"

    # Extract price number
    price_match = re.search(r'R?(\d+(?:,\d{3})*(?:\.\d{2})?)', price_str.replace(' ', ''))
    if price_match:
        price_num = price_match.group(1).replace(',', '')
        return f"R{price_num}", f"R{int(float(price_num) * 1.3):.0f}"
    return "R0", "R0"

def extract_categories_from_tags(tags: List[str]) -> tuple:
    """Extract category and subcategory from tags."""
    category_mapping = {
        "wellness": "wellness-essentials",
        "nutrition & supplements": "wellness-essentials",
        "skin & beauty": "natural-skincare",
        "bone, joint & muscle": "wellness-essentials",
        "energy & fitness": "wellness-essentials",
        "respiratory health": "wellness-essentials",
        "recipes": "digital-products",
        "digestive health": "wellness-essentials"
    }

    subcategory_mapping = {
        "bone, joint & muscle": "pain-relief",
        "energy & fitness": "energy-support",
        "skin & beauty": "skincare",
        "respiratory health": "respiratory",
        "nutrition & supplements": "multivitamins",
        "recipes": "ebooks",
        "digestive health": "digestive"
    }

    category_id = "wellness-essentials"
    subcategory_id = "multivitamins"

    for tag in tags:
        tag_lower = tag.lower()
        if tag_lower in category_mapping:
            category_id = category_mapping[tag_lower]
        if tag_lower in subcategory_mapping:
            subcategory_id = subcategory_mapping[tag_lower]

    return category_id, subcategory_id

def generate_benefits_and_ingredients(product: Dict[str, Any]) -> tuple:
    """Generate benefits and ingredients from product data."""
    benefits = []
    ingredients = []

    desc = product.get('short_description', '').lower()

    # Common benefit keywords
    if 'pain' in desc or 'relief' in desc:
        benefits.append("Pain Relief")
    if 'anti-inflammatory' in desc:
        benefits.append("Anti-Inflammatory")
    if 'skin' in desc or 'beauty' in desc:
        benefits.append("Skin Health")
    if 'gut' in desc or 'digestive' in desc:
        benefits.append("Digestive Health")
    if 'probiotic' in desc:
        benefits.append("Gut Health")
    if 'collagen' in desc:
        benefits.append("Anti-Aging")
    if 'energy' in desc:
        benefits.append("Energy Support")
    if 'immune' in desc:
        benefits.append("Immune Support")

    # Common ingredient keywords
    if 'msm' in desc:
        ingredients.append("MSM")
    if 'magnesium' in desc:
        ingredients.append("Magnesium")
    if 'collagen' in desc:
        ingredients.append("Collagen Peptides")
    if 'probiotic' in desc:
        ingredients.append("Probiotic Strains")
    if 'herbal' in desc:
        ingredients.append("Herbal Extract Blend")
    if 'oil' in desc:
        ingredients.append("Essential Oils")

    # Default if none found
    if not benefits:
        benefits = ["General Wellness", "Natural Support"]
    if not ingredients:
        ingredients = ["Natural Ingredients", "Herbal Blend"]

    return benefits, ingredients

def format_string_array(items: List[str]) -> str:
    """Format a list of strings for TypeScript array."""
    formatted_items = [f'"{item}"' for item in items[:4]]  # Limit to 4 items
    return f"[{', '.join(formatted_items)}]"

def create_product_entry(product: Dict[str, Any], product_id: int, image_mapping: Dict[str, List[Dict]]) -> str:
    """Create a TypeScript product entry."""
    name = sanitize_string(product.get('name', 'Unknown Product'))
    price, original_price = price_to_number(product.get('price', 'R0'))

    # Get images for this product
    product_images = image_mapping.get(product.get('name', ''), [])
    main_image = product_images[0]['path'] if product_images else "/placeholder.svg"
    additional_images = [img['path'] for img in product_images[1:]] if len(product_images) > 1 else []

    # Extract category information
    tags = product.get('tags', [])
    category_id, subcategory_id = extract_categories_from_tags(tags)

    # Generate benefits and ingredients
    benefits, ingredients = generate_benefits_and_ingredients(product)

    # Generate SKU
    clean_name = re.sub(r'[^\w]', '', name.upper())[:10]
    sku = f"OG-{clean_name}-{product_id:03d}"

    # Create description and long description
    short_desc = sanitize_string(product.get('short_description', ''))
    description = short_desc[:100] + "..." if len(short_desc) > 100 else short_desc
    long_description = short_desc if short_desc else "Premium natural wellness product crafted with care."

    # Determine popularity and featured status
    try:
        price_num = int(price.replace('R', '').replace(',', ''))
        popular = price_num >= 200
    except:
        popular = False

    featured = product_id <= 6

    # Generate usage instructions
    usage = "Follow package directions or consult with healthcare provider."
    desc_lower = description.lower()
    if 'apply' in desc_lower or 'massage' in desc_lower:
        usage = "Apply to clean skin and massage gently until absorbed."
    elif 'pain' in desc_lower:
        usage = "Apply topically to affected area 2-3 times daily or as needed."
    elif 'capsule' in desc_lower or 'supplement' in desc_lower:
        usage = "Take 1-2 capsules daily with meals or as directed by healthcare provider."
    elif 'recipe' in desc_lower or 'e-book' in desc_lower:
        usage = "Digital download - access instructions included in e-book."

    # Format arrays
    benefits_str = format_string_array(benefits)
    ingredients_str = format_string_array(ingredients)

    # Clean tags for TypeScript
    clean_tags = []
    for tag in tags[:4]:  # Limit to 4 tags
        clean_tag = tag.lower().replace(' ', '-').replace('&', 'and').replace(',', '')
        clean_tags.append(clean_tag)

    tags_str = format_string_array(clean_tags)

    # Format additional images
    additional_images_str = ""
    if additional_images:
        additional_images_formatted = format_string_array(additional_images)
        additional_images_str = f",\n    additionalImages: {additional_images_formatted}"

    # Generate warnings if applicable
    warnings_str = ""
    if 'pain' in description.lower() or 'supplement' in description.lower():
        warnings_str = ',\n    warnings: "Not suitable for pregnant or nursing women. Consult your healthcare provider before use."'

    product_entry = f'''  {{
    id: {product_id},
    sku: "{sku}",
    name: "{name}",
    description: "{description}",
    longDescription: "{long_description}",
    price: "{price}",
    originalPrice: "{original_price}",
    rating: {4.5 + (product_id % 5) * 0.1:.1f},
    reviews: {50 + (product_id * 23) % 500},
    benefits: {benefits_str},
    ingredients: {ingredients_str},
    usage: "{usage}"{warnings_str},
    categoryId: "{category_id}",
    subcategoryId: "{subcategory_id}",
    image: "{main_image}"{additional_images_str},
    popular: {str(popular).lower()},
    featured: {str(featured).lower()},
    inStock: {str(product.get('in_stock', True)).lower()},
    stockCount: {50 + (product_id * 17) % 200},
    tags: {tags_str}
  }}'''

    return product_entry

def main():
    print("🔧 Fixing products.ts syntax issues")
    print("=" * 50)

    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent

    # Load scraped product data
    detailed_products_file = project_root / 'our_grounds_detailed_products.json'
    image_mapping_file = project_root / 'src' / 'data' / 'product_images.json'

    if not detailed_products_file.exists():
        print(f"❌ Error: {detailed_products_file} not found")
        return

    if not image_mapping_file.exists():
        print(f"❌ Error: {image_mapping_file} not found")
        return

    # Load data
    with open(detailed_products_file, 'r', encoding='utf-8') as f:
        product_data = json.load(f)

    with open(image_mapping_file, 'r', encoding='utf-8') as f:
        image_mapping = json.load(f)

    products = product_data.get('detailed_products', [])

    # Generate product entries
    product_entries = []
    for i, product in enumerate(products, 1):
        try:
            entry = create_product_entry(product, i, image_mapping)
            product_entries.append(entry)
        except Exception as e:
            print(f"❌ Error generating product {i}: {str(e)}")

    # Create the complete products.ts file
    products_ts_content = f'''export interface Product {{
  id: number;
  sku: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  warnings?: string;
  categoryId: string;
  subcategoryId?: string;
  image: string;
  additionalImages?: string[];
  popular: boolean;
  featured: boolean;
  inStock: boolean;
  stockCount?: number;
  sizes?: {{
    size: string;
    price: string;
    originalPrice: string;
  }}[];
  tags: string[];
}}

export interface Category {{
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories?: {{
    id: string;
    name: string;
    description: string;
  }}[];
}}

export const categories: Category[] = [
  {{
    id: "wellness-essentials",
    name: "Wellness Essentials",
    description: "Core supplements for daily health and vitality",
    icon: "Heart",
    subcategories: [
      {{ id: "multivitamins", name: "Multivitamins", description: "Complete vitamin and mineral support" }},
      {{ id: "pain-relief", name: "Pain Relief", description: "Natural pain management solutions" }},
      {{ id: "energy-support", name: "Energy Support", description: "Natural energy and vitality boosters" }},
      {{ id: "digestive", name: "Digestive Health", description: "Gut health and digestive support" }},
      {{ id: "respiratory", name: "Respiratory Health", description: "Breathing and lung support" }}
    ]
  }},
  {{
    id: "natural-skincare",
    name: "Natural Skincare",
    description: "Pure, organic skincare solutions",
    icon: "Sparkles",
    subcategories: [
      {{ id: "skincare", name: "Face Care", description: "Natural facial care products" }},
      {{ id: "body-care", name: "Body Care", description: "Nourishing body care essentials" }}
    ]
  }},
  {{
    id: "digital-products",
    name: "Digital Wellness",
    description: "E-books, guides and digital wellness resources",
    icon: "BookOpen",
    subcategories: [
      {{ id: "ebooks", name: "Recipe E-Books", description: "Digital recipe collections and guides" }},
      {{ id: "programs", name: "Wellness Programs", description: "Structured wellness programs" }}
    ]
  }}
];

export const products: Product[] = [
{','.join(product_entries)}
];

// Utility functions
export const getProductsByCategory = (categoryId: string): Product[] => {{
  return products.filter(product => product.categoryId === categoryId);
}};

export const getFeaturedProducts = (): Product[] => {{
  return products.filter(product => product.featured);
}};

export const getPopularProducts = (): Product[] => {{
  return products.filter(product => product.popular);
}};

export const searchProducts = (query: string): Product[] => {{
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}};

export const getProductById = (id: number): Product | undefined => {{
  return products.find(product => product.id === id);
}};

export const getProductsByTag = (tag: string): Product[] => {{
  return products.filter(product => product.tags.includes(tag));
}};

export const getRelatedProducts = (productId: number, limit: number = 4): Product[] => {{
  const product = getProductById(productId);
  if (!product) return [];

  const related = products.filter(p =>
    p.id !== productId &&
    (p.categoryId === product.categoryId ||
     p.tags.some(tag => product.tags.includes(tag)))
  );

  return related.slice(0, limit);
}};'''

    # Save the fixed products.ts file
    output_file = project_root / 'src' / 'data' / 'products_fixed.ts'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(products_ts_content)

    print(f"✅ Fixed products file saved: {output_file}")
    print(f"📦 Generated {len(product_entries)} product entries")

if __name__ == "__main__":
    main()
