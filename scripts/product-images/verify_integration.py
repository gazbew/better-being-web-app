#!/usr/bin/env python3

import json
import os
from pathlib import Path
from typing import Dict, List, Set
import re

def load_products_data():
    """Load the products data from TypeScript file."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    products_file = project_root / 'src' / 'data' / 'products.ts'

    if not products_file.exists():
        print(f"❌ Products file not found: {products_file}")
        return []

    # Read the TypeScript file and extract product data
    content = products_file.read_text()

    # Extract image paths from the file
    image_pattern = r'image:\s*["\']([^"\']+)["\']'
    additional_images_pattern = r'additionalImages:\s*\[(.*?)\]'

    main_images = re.findall(image_pattern, content)
    additional_matches = re.findall(additional_images_pattern, content, re.DOTALL)

    additional_images = []
    for match in additional_matches:
        # Extract individual image paths from the array
        paths = re.findall(r'["\']([^"\']+)["\']', match)
        additional_images.extend(paths)

    return main_images, additional_images

def check_image_files():
    """Check what image files actually exist in the public/products directory."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    products_dir = project_root / 'public' / 'products'

    if not products_dir.exists():
        print(f"❌ Products directory not found: {products_dir}")
        return set()

    # Get all image files
    image_extensions = {'.webp', '.jpg', '.jpeg', '.png', '.svg'}
    actual_files = set()

    for file in products_dir.iterdir():
        if file.is_file() and file.suffix.lower() in image_extensions:
            actual_files.add(f"/products/{file.name}")

    return actual_files

def verify_image_mapping():
    """Verify the image mapping file exists and is valid."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    mapping_file = project_root / 'src' / 'data' / 'product_images.json'

    if not mapping_file.exists():
        print(f"⚠️  Image mapping file not found: {mapping_file}")
        return {}

    try:
        with open(mapping_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ Error loading image mapping: {e}")
        return {}

def main():
    print("🔍 Product Image Integration Verification")
    print("=" * 60)

    # Load products data
    print("\n📂 Loading products data...")
    main_images, additional_images = load_products_data()
    all_referenced_images = set(main_images + additional_images)

    print(f"   Main product images: {len(main_images)}")
    print(f"   Additional images: {len(additional_images)}")
    print(f"   Total referenced images: {len(all_referenced_images)}")

    # Check actual files
    print("\n📁 Checking actual image files...")
    actual_files = check_image_files()
    print(f"   Found {len(actual_files)} image files")

    # Verify image mapping
    print("\n🗂️  Checking image mapping...")
    image_mapping = verify_image_mapping()
    if image_mapping:
        total_mapped_images = sum(len(images) for images in image_mapping.values())
        print(f"   Products with images: {len(image_mapping)}")
        print(f"   Total mapped images: {total_mapped_images}")

    # Analysis
    print("\n📊 Analysis Results:")
    print("-" * 40)

    # Find missing images
    missing_images = all_referenced_images - actual_files
    if missing_images:
        print(f"❌ Missing Images ({len(missing_images)}):")
        for img in sorted(missing_images):
            print(f"   • {img}")
    else:
        print("✅ All referenced images found!")

    # Find unused images
    unused_images = actual_files - all_referenced_images
    if unused_images:
        print(f"\n⚠️  Unused Images ({len(unused_images)}):")
        for img in sorted(unused_images):
            print(f"   • {img}")
    else:
        print("\n✅ No unused images found!")

    # Check for placeholder usage
    placeholder_usage = [img for img in all_referenced_images if 'placeholder' in img.lower()]
    if placeholder_usage:
        print(f"\n📋 Placeholder Usage ({len(placeholder_usage)}):")
        for img in placeholder_usage:
            print(f"   • {img}")

    # Summary
    print(f"\n📈 Summary:")
    print(f"   Total products with real images: {len(main_images) - len(placeholder_usage)}")
    print(f"   Coverage: {((len(main_images) - len(placeholder_usage)) / len(main_images) * 100):.1f}%" if main_images else "0%")
    print(f"   Missing images: {len(missing_images)}")
    print(f"   Unused images: {len(unused_images)}")

    # Recommendations
    print(f"\n💡 Recommendations:")
    if missing_images:
        print("   1. Download or create missing product images")
    if unused_images:
        print("   2. Remove unused images or update product references")
    if placeholder_usage:
        print("   3. Replace placeholder images with real product photos")
    if not missing_images and not placeholder_usage:
        print("   ✨ Image integration is complete and working perfectly!")

    # Generate quick fix commands
    if missing_images or unused_images:
        print(f"\n🔧 Quick Fix Commands:")
        if unused_images:
            print("   # Remove unused images:")
            for img in sorted(unused_images):
                file_path = img.replace('/products/', 'public/products/')
                print(f"   rm {file_path}")

    return len(missing_images) == 0

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n🎉 All product images are properly integrated!")
    else:
        print(f"\n⚠️  Some issues found - please review and fix.")
