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

export interface Subcategory {
  id: string;
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  inStock?: boolean;
  featured?: boolean;
  popular?: boolean;
  searchQuery?: string;
}

export interface ProductSortOptions {
  sortBy: 'popularity' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'name';
  order: 'asc' | 'desc';
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

export interface WishlistItem {
  productId: number;
  addedAt: Date;
}

export type ProductBadgeType = 'Best Seller' | 'Featured' | 'New' | 'Sale' | 'Popular';
