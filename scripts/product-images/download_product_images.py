#!/usr/bin/env python3

import json
import requests
import os
import re
from pathlib import Path
from urllib.parse import urlparse
import time
from typing import List, Dict, Set

def sanitize_filename(filename: str) -> str:
    """Sanitize filename by removing invalid characters."""
    # Remove invalid characters and replace with underscores
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Remove extra spaces and convert to lowercase
    filename = re.sub(r'\s+', '_', filename.strip()).lower()
    return filename

def download_image(url: str, filepath: Path, timeout: int = 30) -> bool:
    """Download an image from URL to filepath."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        response = requests.get(url, headers=headers, timeout=timeout, stream=True)
        response.raise_for_status()

        # Create directory if it doesn't exist
        filepath.parent.mkdir(parents=True, exist_ok=True)

        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"✓ Downloaded: {filepath.name}")
        return True

    except Exception as e:
        print(f"✗ Failed to download {url}: {str(e)}")
        return False

def extract_images_from_products(products_data: Dict) -> List[Dict]:
    """Extract all image URLs from products data."""
    image_data = []
    seen_urls = set()

    if 'detailed_products' in products_data:
        products = products_data['detailed_products']
    elif isinstance(products_data, list):
        products = products_data
    else:
        print("Unknown data structure in products file")
        return []

    for product in products:
        product_name = product.get('name', 'unknown_product')
        images = product.get('images', [])

        for i, image_url in enumerate(images):
            if image_url and image_url not in seen_urls:
                seen_urls.add(image_url)

                # Parse URL to get filename
                parsed_url = urlparse(image_url)
                original_filename = os.path.basename(parsed_url.path)

                # Create a meaningful filename
                if original_filename and '.' in original_filename:
                    name_part = sanitize_filename(product_name)
                    extension = original_filename.split('.')[-1].lower()

                    # If it's the first image, use the product name
                    if i == 0:
                        filename = f"{name_part}.{extension}"
                    else:
                        filename = f"{name_part}_{i+1}.{extension}"
                else:
                    # Fallback filename
                    filename = f"{sanitize_filename(product_name)}_{i+1}.webp"

                image_data.append({
                    'url': image_url,
                    'filename': filename,
                    'product_name': product_name,
                    'original_filename': original_filename
                })

    return image_data

def main():
    print("🖼️  Product Image Downloader")
    print("=" * 50)

    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    public_dir = project_root / 'public' / 'products'

    # Data files to check
    data_files = [
        project_root / 'our_grounds_detailed_products.json',
        project_root / 'our_grounds_scraped_data.json',
        project_root / 'our_grounds_structured_data.json'
    ]

    all_images = []

    # Extract images from all data files
    for data_file in data_files:
        if data_file.exists():
            print(f"\n📂 Processing: {data_file.name}")
            try:
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                images = extract_images_from_products(data)
                all_images.extend(images)
                print(f"   Found {len(images)} images")

            except Exception as e:
                print(f"   ✗ Error reading {data_file.name}: {str(e)}")
        else:
            print(f"\n📂 Skipping: {data_file.name} (not found)")

    # Remove duplicates based on URL
    unique_images = {}
    for img in all_images:
        if img['url'] not in unique_images:
            unique_images[img['url']] = img

    total_images = len(unique_images)
    print(f"\n🎯 Total unique images to download: {total_images}")

    if total_images == 0:
        print("No images found to download.")
        return

    # Create public/products directory
    public_dir.mkdir(parents=True, exist_ok=True)

    # Download images
    print(f"\n📥 Downloading images to: {public_dir}")
    print("-" * 50)

    successful_downloads = 0
    failed_downloads = 0

    # Create a mapping file for products
    image_mapping = {}

    for i, (url, img_data) in enumerate(unique_images.items(), 1):
        filepath = public_dir / img_data['filename']

        # Skip if file already exists and is not empty
        if filepath.exists() and filepath.stat().st_size > 0:
            print(f"⏭️  Skipping: {img_data['filename']} (already exists)")
            successful_downloads += 1
        else:
            print(f"📥 [{i}/{total_images}] Downloading: {img_data['filename']}")

            if download_image(url, filepath):
                successful_downloads += 1
            else:
                failed_downloads += 1

            # Small delay to be respectful to the server
            time.sleep(0.5)

        # Add to mapping
        product_name = img_data['product_name']
        if product_name not in image_mapping:
            image_mapping[product_name] = []
        image_mapping[product_name].append({
            'filename': img_data['filename'],
            'url': url,
            'path': f"/products/{img_data['filename']}"
        })

    # Save image mapping
    mapping_file = project_root / 'src' / 'data' / 'product_images.json'
    mapping_file.parent.mkdir(parents=True, exist_ok=True)

    with open(mapping_file, 'w', encoding='utf-8') as f:
        json.dump(image_mapping, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 50)
    print(f"✅ Download Complete!")
    print(f"   Successful: {successful_downloads}")
    print(f"   Failed: {failed_downloads}")
    print(f"   Total: {total_images}")
    print(f"\n📋 Image mapping saved to: {mapping_file}")
    print(f"🖼️  Images saved to: {public_dir}")

    # Show some statistics
    print(f"\n📊 Product Statistics:")
    print(f"   Total products with images: {len(image_mapping)}")
    print(f"   Average images per product: {total_images / len(image_mapping):.1f}")

if __name__ == "__main__":
    main()
