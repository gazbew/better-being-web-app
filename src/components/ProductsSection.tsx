import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Heart } from "lucide-react";
import productsImage from "@/assets/products-showcase.jpg";
import { getFeaturedProducts, Product } from "@/data/products";
import { Link } from "react-router-dom";

export const ProductsSection = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <section id="products" className="py-20 bg-gradient-wellness">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 bg-[#C1581B]/10 rounded-full px-6 py-2 mb-6">
            <div className="w-6 h-6 rounded-full border border-[#C1581B] flex items-center justify-center">
              <span className="text-[#C1581B] font-bold text-xs">BB</span>
            </div>
            <span className="text-sm font-medium text-[#C1581B]">Better Being Products</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Natural Wellness
            <span className="block text-[#C1581B]">Better Being Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each product is meticulously formulated using the finest natural ingredients,
            backed by cutting-edge research and trusted by thousands worldwide.
          </p>
        </div>

        {/* Featured Image */}
        <div className="relative mb-16 animate-scale-in">
          <div className="relative overflow-hidden rounded-3xl shadow-floating">
            <img
              src={productsImage}
              alt="Premium wellness products showcase"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-primary-foreground">
              <h3 className="text-2xl font-bold mb-2">Better Being Quality Guaranteed</h3>
              <p className="text-primary-foreground/90">Lab-tested • Third-party verified • Sustainably sourced</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {featuredProducts.slice(0, 8).map((product: Product, index: number) => {
            const priceNum = parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
            const originalPriceNum = parseFloat(String(product.originalPrice || "0").replace(/[^0-9.-]+/g, "")) || 0;
            const savePercent = originalPriceNum > 0 ? Math.round((1 - priceNum / originalPriceNum) * 100) : 0;

            return (
              <Card
                key={product.id}
                className="relative group hover:shadow-wellness transition-all duration-500 hover:-translate-y-2 border-0 bg-white overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {product.popular && (
                  <div className="absolute top-3 left-3 bg-[#C1581B] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    Best Seller
                  </div>
                )}

                <CardContent className="p-0">
                  {/* Product Image Container */}
                  <div className="relative h-64 bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    {/* Better Being Overlay Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 shadow-md">
                      <div className="w-8 h-8 bg-[#C1581B] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">BB</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-3">{product.name}</h3>
                    <p className="text-muted-foreground mb-6">{product.description}</p>

                    {/* Benefits */}
                    <div className="space-y-2 mb-6">
                      {(product.benefits || []).map((benefit, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                          <span className="text-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="flex text-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {product.rating} ({product.reviews?.toLocaleString?.() || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-3 mb-6">
                      <span className="text-3xl font-bold text-[#C1581B]">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                      )}
                      {originalPriceNum > 0 && (
                        <span className="bg-[#C1581B]/20 text-[#C1581B] px-2 py-1 rounded text-sm font-medium">Save {savePercent}%</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button className="flex-1 bg-[#C1581B] hover:bg-[#B34E16] text-white shadow-wellness">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="ghost" size="icon" className="shrink-0 border-[#C1581B] text-[#C1581B] hover:bg-[#C1581B]/10">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up">
          <Link to="/products">
            <Button size="lg" variant="ghost" className="border-2 border-[#C1581B] text-[#C1581B] hover:bg-[#C1581B] hover:text-white text-lg px-8 py-4">
              View All Better Being Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;