import { useParams, Link } from "react-router-dom";
// Header/Footer provided by DefaultLayout
import { Breadcrumbs, breadcrumbConfigs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, Shield, Truck, RefreshCw, ChevronLeft, Plus, Minus } from "lucide-react";
import { getProductById, getRelatedProducts, categories } from "@/data/products";
import { api } from '@/services/api';
import { normalizeToLocalProduct } from '@/utils/normalizeProduct';
import { useEffect } from 'react';
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCart, useGuestCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToGuestCart } = useGuestCart();
  const { user } = useAuth();
  // Attempt to fetch product details from API; fall back to local data if API not available
  const [apiProduct, setApiProduct] = useState<any | null>(null);
  const productId = parseInt(id || "0");
  const localProduct = getProductById(productId);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const resp = await api.getProduct(productId);
        if (resp.success && resp.data) {
          const raw = (resp.data as any).product || resp.data;
          const normalized = normalizeToLocalProduct(raw);
          if (!cancelled) setApiProduct(normalized);
        }
      } catch (err) {
        // ignore and allow fallback
      }
    };

    load();
    return () => { cancelled = true; };
  }, [productId]);

  const product = apiProduct || localProduct;
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, 4);
  const category = categories.find(c => c.id === product.categoryId);
  const subcategory = category?.subcategories?.find(s => s.id === product.subcategoryId);
  
  const currentSize = product.sizes ? product.sizes[selectedSize] : null;
  const displayPrice = currentSize ? currentSize.price : product.price;
  const displayOriginalPrice = currentSize ? currentSize.originalPrice : product.originalPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header provided by DefaultLayout */}
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbConfigs.productDetail(product.name)} />
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="relative">
                {product.featured && (
                  <Badge className="absolute top-4 left-4 bg-[#C1581B]">
                    Featured Product
                  </Badge>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
            </div>
            
            {/* Additional Images (placeholder for now) */}
            {product.additionalImages && (
              <div className="grid grid-cols-4 gap-4">
                {product.additionalImages.map((img, index) => (
                  <div key={index} className="bg-white rounded-lg p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <img
                      src={img}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-20 object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{category?.name}</Badge>
                {subcategory && (
                  <Badge variant="outline">{subcategory.name}</Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "fill-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews.toLocaleString()} reviews)
              </span>
              <span className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </span>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline space-x-3 mb-2">
                <span className="text-4xl font-bold text-[#C1581B]">{displayPrice}</span>
                <span className="text-xl text-muted-foreground line-through">
                  {displayOriginalPrice}
                </span>
                <Badge className="bg-[#C1581B]/20 text-[#C1581B]">
                  Save{" "}
                  {Math.round(
                    (1 -
                      parseInt(displayPrice.replace(/[R,]/g, "")) /
                        parseInt(displayOriginalPrice.replace(/[R,]/g, ""))) *
                      100
                  )}
                  %
                </Badge>
              </div>
              {product.inStock ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock {product.stockCount && `(${product.stockCount} available)`}
                </p>
              ) : (
                <p className="text-red-600 font-medium">Out of Stock</p>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && (
              <div>
                <label className="font-medium mb-2 block">Size:</label>
                <div className="flex gap-3">
                  {product.sizes.map((size, index) => (
                    <Button
                      key={index}
                      variant={selectedSize === index ? "default" : "outline"}
                      className={selectedSize === index ? "bg-[#C1581B] hover:bg-[#B34E16]" : ""}
                      onClick={() => setSelectedSize(index)}
                    >
                      {size.size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="font-medium mb-2 block">Quantity:</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={product.stockCount ? quantity >= product.stockCount : false}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: {displayPrice.replace("R", "R ")}
                  {parseInt(displayPrice.replace(/[R,]/g, "")) * quantity}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 bg-[#C1581B] hover:bg-[#B34E16] text-white"
                disabled={!product.inStock}
                onClick={() => {
                  const sizeVal = currentSize?.size;
                  const payload: any = { productId: product.id, quantity };
                  if (sizeVal) payload.size = sizeVal;
                  if (user) {
                    addToCart(payload);
                  } else {
                    addToGuestCart(payload);
                  }
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#C1581B] text-[#C1581B] hover:bg-[#C1581B]/10"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-[#C1581B]" />
                <p className="text-sm font-medium">Quality Guaranteed</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-[#C1581B]" />
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-[#C1581B]" />
                <p className="text-sm font-medium">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <p className="text-muted-foreground mb-6">{product.longDescription}</p>
              
              <h4 className="font-bold mb-3">Key Benefits:</h4>
              <ul className="space-y-2 mb-6">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#C1581B] mr-2">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {product.warnings && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-medium text-amber-800 mb-1">Warning:</p>
                  <p className="text-sm text-amber-700">{product.warnings}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Full Ingredients List</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-[#C1581B] rounded-full mr-3" />
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="usage" className="mt-6">
              <h3 className="text-xl font-bold mb-4">How to Use</h3>
              <p className="text-muted-foreground mb-4">{product.usage}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-800 mb-1">Pro Tip:</p>
                <p className="text-sm text-blue-700">
                  For best results, maintain consistency with your supplementation routine. 
                  Set a daily reminder to take your supplements at the same time each day.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{product.rating}</p>
                      <div className="flex text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-current"
                                : "fill-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.reviews.toLocaleString()} reviews
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">Sarah M.</p>
                        <p className="text-sm text-muted-foreground">Verified Buyer</p>
                      </div>
                      <p className="text-sm text-muted-foreground">2 weeks ago</p>
                    </div>
                    <div className="flex text-accent mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      This product has been a game-changer for me! I've noticed significant improvements
                      in my energy levels and overall well-being. Highly recommend!
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">John D.</p>
                        <p className="text-sm text-muted-foreground">Verified Buyer</p>
                      </div>
                      <p className="text-sm text-muted-foreground">1 month ago</p>
                    </div>
                    <div className="flex text-accent mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-current" : "fill-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      Great quality product with noticeable results. The only reason I'm giving 4 stars
                      instead of 5 is the price point, but you definitely get what you pay for.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="group hover:shadow-wellness transition-all duration-500 hover:-translate-y-2"
                >
                  <CardContent className="p-0">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="relative h-48 bg-gradient-to-b from-gray-50 to-gray-100 p-4">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-primary mb-2 group-hover:text-[#C1581B] transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex text-accent">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(relatedProduct.rating)
                                    ? "fill-current"
                                    : "fill-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({relatedProduct.reviews})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-[#C1581B]">
                            {relatedProduct.price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {relatedProduct.originalPrice}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
