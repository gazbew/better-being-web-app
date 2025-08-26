// Header/Footer provided by DefaultLayout
import HeroSectionPrime from "@/components/HeroSectionPrime";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Leaf,
  Heart,
  Star,
  Truck,
  Clock,
  CreditCard,
  RefreshCw,
  Users,
  Phone,
  MapPin,
  Quote,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart, useGuestCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  categories,
  getFeaturedProducts,
  getProductsByCategory,
} from "@/data/products";

const BetterBeingHome = () => {
  const { addToCart } = useCart();
  const { addToGuestCart } = useGuestCart();
  const { user } = useAuth();
  // Product categories from real data
  const categoryData = categories.map((category) => {
    const iconMapping = {
      Heart: <Heart className="w-8 h-8 text-[#BB4500]" />,
      Sparkles: <Sparkles className="w-8 h-8 text-[#BB4500]" />,
      BookOpen: <BookOpen className="w-8 h-8 text-[#BB4500]" />,
    };

    return {
      id: category.id,
      name: category.name,
      count: getProductsByCategory(category.id).length,
      icon: iconMapping[category.icon as keyof typeof iconMapping] || (
        <Heart className="w-8 h-8 text-[#BB4500]" />
      ),
      image: "/api/placeholder/200/200",
    };
  });

  // Featured products from real data
  const featuredProducts = getFeaturedProducts()
    .slice(0, 4)
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: parseInt(product.price.replace(/[^0-9]/g, "")),
      originalPrice: product.originalPrice
        ? parseInt(product.originalPrice.replace(/[^0-9]/g, ""))
        : null,
      image: product.image,
      rating: product.rating,
      badge: product.popular
        ? "Best Seller"
        : product.featured
          ? "Featured"
          : undefined,
    }));

  // Service guarantees
  const guarantees = [
    {
      icon: <Truck className="w-6 h-6 text-[#BB4500]" />,
      title: "Free Shipping & Returns",
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#BB4500]" />,
      title: "Money Back Guarantee",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#BB4500]" />,
      title: "100% Secure Payment",
    },
    {
      icon: <Clock className="w-6 h-6 text-[#BB4500]" />,
      title: "Online Support",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Mitchell",
      text: "Better Being transformed my wellness journey. The natural products are incredible and I feel amazing every day.",
      rating: 5,
      avatar: "https://placehold.co/60x60",
    },
    {
      name: "Michael Chen",
      text: "The quality is outstanding and customer service is fantastic. I trust Better Being with my family's health.",
      rating: 5,
      avatar: "https://placehold.co/60x60",
    },
    {
      name: "Emma Thompson",
      text: "Natural, effective, and reliable. Better Being products have become an essential part of my daily routine.",
      rating: 5,
      avatar: "https://placehold.co/60x60",
    },
  ];

  // Wellness benefits
  const benefits = [
    {
      title: "Natural Pain Relief & Recovery",
      description:
        "Our natural formulations help reduce inflammation and relieve pain using traditional herbal remedies combined with modern science.",
    },
    {
      title: "Boost Immune System Naturally",
      description:
        "Strengthen your body's natural defenses with our carefully crafted immune support products featuring premium natural ingredients.",
    },
    {
      title: "Improve Digestive Health",
      description:
        "Support your gut health and digestive system with our probiotic and digestive wellness solutions designed for optimal absorption.",
    },
    {
      title: "Enhance Sleep & Recovery",
      description:
        "Achieve better sleep and faster recovery with our natural sleep support products that work with your body's natural rhythms.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Prime Hero Section */}
      <HeroSectionPrime />

      {/* Service Guarantees */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {guarantees.map((guarantee, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 text-center"
              >
                {guarantee.icon}
                <h3 className="font-semibold text-[#280B0B]">
                  {guarantee.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryData.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-gray-100 group-hover:border-[#BB4500]/20">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-[#F9E7C9]/50 rounded-full flex items-center justify-center group-hover:bg-[#F9E7C9] transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#280B0B] mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[#626675]">{category.count} Items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#280B0B]">
              Popular Products
            </h2>
            <p className="text-xl text-[#626675] max-w-2xl mx-auto">
              Discover our most loved natural wellness solutions, carefully
              crafted for your health journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-gray-100 overflow-hidden"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <Badge className="absolute top-4 left-4 bg-[#BB4500] text-white">
                        {product.badge}
                      </Badge>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#C4C240] text-[#C4C240]" />
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#280B0B] mb-3 group-hover:text-[#BB4500] transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-[#280B0B]">
                            R{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#626675] line-through">
                              R{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          if (user) {
                            addToCart({ productId: product.id, quantity: 1 });
                          } else {
                            addToGuestCart({ productId: product.id, quantity: 1 });
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="secondary"
              className="border-[#BB4500] text-[#BB4500] hover:bg-[#BB4500] hover:text-white px-8 py-4"
              asChild
            >
              <Link to="/shop">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section with Testimonials */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#280B0B]">
              Your Trust is Our Top Concern
            </h2>
            <p className="text-xl text-[#626675] max-w-2xl mx-auto">
              Thousands of customers trust Better Being for their wellness
              journey. Here's what they say about us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white border-gray-100 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-8 text-center">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#C4C240] text-[#C4C240]"
                      />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#BB4500] mx-auto mb-4" />
                  <p className="text-[#626675] mb-6 italic leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <h5 className="font-bold text-[#280B0B]">
                      {testimonial.name}
                    </h5>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-[#BB4500]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Sign Up for Our Newsletter
            </h2>
            <p className="text-xl text-white/90">
              Get the latest wellness tips, exclusive offers, and natural health
              insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white border-0"
              />
              <Button className="bg-[#C4C240] hover:bg-[#C4C240]/90 text-black font-semibold px-8">
                Send
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#280B0B]">
              The Benefits of Natural Wellness
            </h2>
            <p className="text-xl text-[#626675] max-w-3xl mx-auto">
              Discover how our natural products can enhance your health and
              well-being through the power of nature's finest ingredients.
            </p>
          </div>

          <div className="space-y-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="bg-[#F9E7C9]/20 rounded-3xl p-8 h-64 flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#BB4500]/10 rounded-full flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-[#BB4500]" />
                    </div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <h4 className="text-2xl font-bold text-[#280B0B] mb-4">
                    {benefit.title}
                  </h4>
                  <p className="text-lg text-[#626675] leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-[#280B0B]">
              Have any Questions?
            </h2>
            <p className="text-xl text-[#626675] max-w-2xl mx-auto">
              We're here to help you on your wellness journey. Get in touch with
              our expert team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border-gray-100">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-[#BB4500] mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#280B0B] mb-4">
                  Our Office Location
                </h4>
                <p className="text-[#626675]">
                  171 Blaauwberg Road
                  <br />
                  Table View, Cape Town 7441
                  <br />
                  South Africa
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-gray-100">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-[#BB4500] mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#280B0B] mb-4">
                  How Can We Help?
                </h4>
                <ul className="text-[#626675] space-y-2">
                  <li>✓ Product recommendations</li>
                  <li>✓ Wellness consultations</li>
                  <li>✓ Order support</li>
                  <li>✓ Natural health advice</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center bg-white border-gray-100">
              <CardContent className="p-8">
                <Phone className="w-12 h-12 text-[#BB4500] mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#280B0B] mb-4">
                  Contact Us
                </h4>
                <p className="text-[#626675]">
                  <strong>Phone:</strong> +27 21 555 0123
                  <br />
                  <strong>Email:</strong> info@betterbeing.co.za
                  <br />
                  <strong>Hours:</strong> 9:00 AM - 5:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer provided by DefaultLayout */}
    </div>
  );
};

export default BetterBeingHome;
