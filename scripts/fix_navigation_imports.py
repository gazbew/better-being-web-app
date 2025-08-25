#!/usr/bin/env python3

import os
import re
from pathlib import Path

def fix_navigation_import(file_path):
    """Fix NavigationPrimary import in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Pattern to match the incorrect default import
        patterns = [
            # Default import with relative path
            (r"import NavigationPrimary from ['\"]\.\.?/components/NavigationPrimary['\"];?",
             "import { NavigationPrimary } from '../components/NavigationPrimary';"),

            # Default import with absolute path
            (r"import NavigationPrimary from ['\"]@/components/NavigationPrimary['\"];?",
             "import { NavigationPrimary } from '@/components/NavigationPrimary';"),
        ]

        # Apply each pattern
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)

        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

        return False

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def find_files_with_wrong_import():
    """Find all TypeScript/JavaScript files with incorrect NavigationPrimary import."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    src_dir = project_root / 'src'

    files_to_fix = []

    # Search for files with incorrect import
    for file_path in src_dir.rglob('*.tsx'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check for the incorrect import pattern
            if re.search(r"import NavigationPrimary from", content):
                files_to_fix.append(file_path)

        except Exception as e:
            print(f"Error reading {file_path}: {e}")

    return files_to_fix

def main():
    print("🔧 NavigationPrimary Import Fixer")
    print("=" * 50)

    # Find files that need fixing
    print("🔍 Scanning for files with incorrect imports...")
    files_to_fix = find_files_with_wrong_import()

    if not files_to_fix:
        print("✅ No files found with incorrect NavigationPrimary imports!")
        return

    print(f"📁 Found {len(files_to_fix)} files to fix:")
    for file_path in files_to_fix:
        print(f"   • {file_path.relative_to(Path.cwd())}")

    print(f"\n🔨 Fixing imports...")

    fixed_count = 0
    failed_count = 0

    for file_path in files_to_fix:
        relative_path = file_path.relative_to(Path.cwd())

        if fix_navigation_import(file_path):
            print(f"✅ Fixed: {relative_path}")
            fixed_count += 1
        else:
            print(f"❌ Failed: {relative_path}")
            failed_count += 1

    print(f"\n" + "=" * 50)
    print(f"📊 Summary:")
    print(f"   Files processed: {len(files_to_fix)}")
    print(f"   Successfully fixed: {fixed_count}")
    print(f"   Failed: {failed_count}")

    if fixed_count > 0:
        print(f"\n✨ Import fixes completed!")
        print(f"🚀 All NavigationPrimary imports now use named exports")
        print(f"💡 You can now run 'npm run build' to verify the fixes")
    else:
        print(f"\n⚠️  No files were modified")

if __name__ == "__main__":
    main()
