import React, { useState } from "react";
import { NavigationPrimary } from "@/components/NavigationPrimary";
import { FooterPrimary } from "@/components/FooterPrimary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Minus,
  X,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Gift,
  Truck,
  Shield,
  Clock,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Go Go Pain Relief",
      category: "Pain Management",
      price: 185,
      originalPrice: 225,
      image: "/api/placeholder/120/120",
      quantity: 2,
      inStock: true,
      description: "MSM and magnesium oil enhanced with 15 herbal oils",
    },
    {
      id: 2,
      name: "Raw Pro-Biotic Gut Repair",
      category: "Digestive Health",
      price: 225,
      originalPrice: null,
      image: "/api/placeholder/120/120",
      quantity: 1,
      inStock: true,
      description: "Advanced digestive system repair and gut health support",
    },
    {
      id: 3,
      name: "Night Care Renewal",
      category: "Skincare",
      price: 200,
      originalPrice: null,
      image: "/api/placeholder/120/120",
      quantity: 1,
      inStock: true,
      description:
        "50ml evening skincare with essential oils and herbal nutrients",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "wellness10") {
      setAppliedPromo({ code: "WELLNESS10", discount: 0.1 });
    } else if (promoCode.toLowerCase() === "natural15") {
      setAppliedPromo({ code: "NATURAL15", discount: 0.15 });
    } else {
      alert("Invalid promo code");
    }
    setPromoCode("");
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const promoDiscount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal - promoDiscount + shipping;

  const savings = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice - item.price : 0) *
        item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9E7C9]">
        <NavigationPrimary />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <div className="w-24 h-24 mx-auto bg-[#BB4500]/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-[#BB4500]" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#280B0B] uppercase tracking-wide">
                YOUR CART IS EMPTY
              </h1>
              <p className="text-xl text-[#626675] max-w-md mx-auto">
                Discover our premium natural wellness products and start your
                journey to better health.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-[#BB4500] hover:bg-[#BB4500]/90 text-white px-8 py-4 text-lg"
              asChild
            >
              <Link to="/products">
                SHOP WELLNESS PRODUCTS
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
        <FooterPrimary />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9E7C9]">
      <NavigationPrimary />

      {/* Header */}
      <section className="bg-gradient-to-r from-[#BB4500] to-[#BB4500]/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-wide">
              YOUR CART
            </h1>
            <p className="text-lg text-white/90">
              Review your selected wellness products
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#280B0B] uppercase tracking-wide">
                CART ITEMS ({cartItems.length})
              </h2>
              <Button
                variant="ghost"
                className="text-[#BB4500] hover:bg-[#BB4500]/10"
                asChild
              >
                <Link to="/products">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-none shadow-md">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-32 h-32 flex-shrink-0 bg-[#F9E7C9]/50 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="text-sm text-[#626675] uppercase tracking-wide">
                            {item.category}
                          </div>
                          <h3 className="text-lg font-bold text-[#280B0B]">
                            {item.name}
                          </h3>
                          <p className="text-sm text-[#626675] leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-[#BB4500]">
                                R{item.price}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-[#626675] line-through">
                                  R{item.originalPrice}
                                </span>
                              )}
                              {item.originalPrice && (
                                <Badge className="bg-[#C4C240]/20 text-[#280B0B] text-xs">
                                  SAVE R{item.originalPrice - item.price}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-[#626675]">
                              Unit price
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-[#626675]/20 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 hover:bg-[#BB4500]/10"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="px-4 py-2 text-center min-w-[60px] font-medium">
                                {item.quantity}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 hover:bg-[#BB4500]/10"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#280B0B]">
                            Total: R{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-[#280B0B] uppercase tracking-wide">
                  ORDER SUMMARY
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#626675]">Subtotal</span>
                    <span className="font-medium">R{subtotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You save</span>
                      <span className="font-medium">
                        -R{savings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-green-600">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>{appliedPromo.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          -R{promoDiscount.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removePromoCode}
                          className="p-1 text-red-500 hover:bg-red-50"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#626675]" />
                      <span className="text-[#626675]">Shipping</span>
                    </div>
                    <span className="font-medium">
                      {shipping === 0 ? "FREE" : `R${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-[#626675] bg-[#C4C240]/10 p-3 rounded-lg">
                      Add R{(500 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-[#280B0B]">
                    <span>TOTAL</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                  <h4 className="font-medium text-[#280B0B] uppercase tracking-wide">
                    PROMO CODE
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={applyPromoCode}
                      variant="outline"
                      className="border-[#BB4500] text-[#BB4500] hover:bg-[#BB4500] hover:text-white"
                    >
                      APPLY
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-[#BB4500] hover:bg-[#BB4500]/90 text-white py-4 text-lg font-semibold"
                  asChild
                >
                  <Link to="/checkout">
                    PROCEED TO CHECKOUT
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Guarantees */}
            <Card className="border-none shadow-md">
              <CardContent className="p-6 space-y-4">
                <h4 className="font-medium text-[#280B0B] uppercase tracking-wide">
                  OUR GUARANTEES
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Shield className="w-5 h-5 text-[#BB4500]" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Truck className="w-5 h-5 text-[#BB4500]" />
                    <span>Free Shipping Over R500</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Clock className="w-5 h-5 text-[#BB4500]" />
                    <span>30-Day Money Back</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#626675]">
                    <Gift className="w-5 h-5 text-[#BB4500]" />
                    <span>Premium Quality Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FooterPrimary />
    </div>
  );
};

export default Cart;
