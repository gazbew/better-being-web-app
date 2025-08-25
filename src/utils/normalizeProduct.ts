// Utility to normalize product objects coming from the API to shapes the UI expects
export function normalizeForList(raw: any) {
  if (!raw) return null;

  const image = raw.image || raw.image_url || (raw.images && raw.images[0]) || '';
  const featured = raw.featured ?? raw.is_featured ?? false;
  const popular = raw.popular ?? raw.is_popular ?? false;
  const in_stock = (raw.in_stock !== undefined ? raw.in_stock : (raw.inStock !== undefined ? raw.inStock : (typeof raw.stock_count === 'number' ? raw.stock_count > 0 : false)));
  const stock_count = raw.stock_count ?? raw.stockCount ?? 0;
  const reviews_count = raw.reviews_count ?? raw.reviews ?? 0;
  const original_price = raw.original_price ?? raw.originalPrice ?? null;
  const category_name = raw.category_name ?? raw.categoryName ?? (raw.category && raw.category.name) ?? raw.category ?? '';

  return {
    ...raw,
    image,
    featured,
    popular,
    in_stock,
    stock_count,
    reviews_count,
    original_price,
    category_name,
  };
}

// Normalize API product to the local `Product` shape used by ProductDetail (camelCase, price strings)
export function normalizeToLocalProduct(raw: any) {
  if (!raw) return null;

  const normalized = normalizeForList(raw);

  const priceNum = raw.price ?? raw.price_cents ?? 0;
  const originalPriceNum = normalized.original_price ?? raw.originalPrice ?? null;

  const formatPrice = (p: any) => {
    if (p === null || p === undefined) return '';
    // If already a string with currency, return as-is
    if (typeof p === 'string' && p.trim().startsWith('R')) return p;
    const num = typeof p === 'number' ? p : parseFloat(String(p)) || 0;
    return `R${num}`;
  };

  return {
    id: Number(raw.id),
    sku: raw.sku || raw.SKU || '',
    name: raw.name || '',
    description: raw.description || raw.short_description || '',
    longDescription: raw.long_description || raw.longDescription || '',
    price: formatPrice(priceNum),
    originalPrice: originalPriceNum ? formatPrice(originalPriceNum) : '',
    rating: raw.rating ?? 0,
    reviews: normalized.reviews_count ?? 0,
    benefits: normalized.benefits || [],
    ingredients: normalized.ingredients || [],
    usage: raw.usage || '',
    warnings: raw.warnings || '',
    categoryId: raw.category_id ?? raw.categoryId ?? '',
    subcategoryId: raw.subcategory_id ?? raw.subcategoryId ?? '',
    image: normalized.image || '',
    additionalImages: raw.additionalImages || raw.images || [],
    popular: normalized.popular,
    featured: normalized.featured,
    inStock: normalized.in_stock,
    stockCount: normalized.stock_count,
    sizes: normalized.sizes || raw.sizes || [],
    tags: normalized.tags || raw.tags || [],
    skuAvailable: !!raw.sku,
  };
}

export default {
  normalizeForList,
  normalizeToLocalProduct,
};
