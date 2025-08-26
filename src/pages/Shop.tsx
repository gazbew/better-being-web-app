import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart, useGuestCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Menu,
  Home,
  ShoppingCart,
  Search,
  Grid3X3,
  ChevronRight,
  MapPin,
  Star,
  Triangle,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
// Header/Footer provided by DefaultLayout
import {
  products,
  categories,
  getFeaturedProducts,
  getPopularProducts,
  getProductsByCategory,
} from "@/data/products";

const Shop = () => {
  const [selectedFilter, setSelectedFilter] = useState("SEE ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Get filtered products based on selection
  const getFilteredProducts = () => {
    let filtered = products;

    switch (selectedFilter) {
      case "SALE!":
        filtered = products.filter((product) => product.originalPrice);
        break;
      case "UNDER R250":
        filtered = products.filter(
          (product) => parseInt(product.price.replace(/[^0-9]/g, "")) < 250,
        );
        break;
      case "TOP SELLERS":
        filtered = getPopularProducts();
        break;
      default:
        filtered = products;
    }

    // Apply additional filters for desktop
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (priceRange !== "all") {
      const price = (product: any) =>
        parseInt(product.price.replace(/[^0-9]/g, ""));
      switch (priceRange) {
        case "under-200":
          filtered = filtered.filter((product) => price(product) < 200);
          break;
        case "200-300":
          filtered = filtered.filter(
            (product) => price(product) >= 200 && price(product) <= 300,
          );
          break;
        case "300-500":
          filtered = filtered.filter(
            (product) => price(product) >= 300 && price(product) <= 500,
          );
          break;
        case "over-500":
          filtered = filtered.filter((product) => price(product) > 500);
          break;
      }
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();
  const featuredProducts = getFeaturedProducts().slice(0, 2);

  // Get real categories and product counts
  const productCategories = [
    {
      id: "all",
      name: "All Products",
      count: products.length,
    },
    ...categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      count: getProductsByCategory(cat.id).length,
    })),
  ];

  const { addToCart } = useCart();
  const { addToGuestCart } = useGuestCart();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-amber-50/30">
      {/* Desktop Navigation - Hidden on Mobile */}
      <div className="hidden md:block">
        {/* Header provided by DefaultLayout */}
      </div>

      {/* Mobile Header - Visible only on Mobile */}
      <div className="md:hidden">
        <header className="bg-gradient-to-r from-white to-stone-50/50 border-b border-stone-200/50 px-4 py-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-xl hover:bg-stone-100/60 transition-all duration-300 hover:shadow-sm"
            >
              <Menu className="w-6 h-6 text-stone-700" />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                Better Being
              </span>
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <span className="text-white font-bold text-lg drop-shadow-sm">
                  BB
                </span>
              </div>
            </div>
            <div className="w-6" />
          </div>
        </header>
      </div>

      {/* Desktop Header Section - Hidden on Mobile */}
      <div className="hidden md:block bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white py-20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold uppercase tracking-wider drop-shadow-lg">
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                WELLNESS COLLECTION
              </span>
            </h1>
            <p className="text-xl text-amber-50 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
              Discover premium natural health solutions crafted with care
            </p>
            <div className="flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Pills - Visible only on Mobile */}
      <div className="md:hidden px-4 py-4">
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {["SALE!", "UNDER R250", "TOP SELLERS", "SEE ALL"].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300 ${
                selectedFilter === filter
                  ? "bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-lg shadow-stone-800/25 border-0"
                  : "bg-gradient-to-r from-stone-100 to-stone-50 text-stone-700 hover:from-stone-200 hover:to-stone-100 shadow-sm hover:shadow-md border border-stone-200/50"
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Filter Bar - Hidden on Mobile */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center gap-6 p-6 bg-gradient-to-r from-stone-900/10 via-transparent to-stone-900/10 rounded-3xl shadow-2xl shadow-stone-900/30 border-2 border-stone-400/40 backdrop-blur-md">
          {/* Search */}
          <div className="relative flex-1 min-w-[320px]">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-500" />
            <Input
              type="text"
              placeholder="Search wellness products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-4 w-full border-2 border-stone-400/60 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 text-lg bg-transparent rounded-2xl shadow-2xl shadow-stone-900/20 backdrop-blur-sm"
            />
          </div>

          {/* Filters */}
          {[
            {
              value: selectedCategory,
              onChange: setSelectedCategory,
              placeholder: "Category",
              options: productCategories,
            },
            {
              value: priceRange,
              onChange: setPriceRange,
              placeholder: "Price Range",
              options: [
                { id: "all", name: "All Prices" },
                { id: "under-200", name: "Under R200" },
                { id: "200-300", name: "R200 - R300" },
                { id: "300-500", name: "R300 - R500" },
                { id: "over-500", name: "Over R500" },
              ],
            },
            {
              value: sortBy,
              onChange: setSortBy,
              placeholder: "Sort By",
              options: [
                { id: "popularity", name: "Most Popular" },
                { id: "newest", name: "Newest First" },
                { id: "price-low", name: "Price: Low to High" },
                { id: "price-high", name: "Price: High to Low" },
                { id: "rating", name: "Highest Rated" },
              ],
            },
          ].map((filter, index) => (
            <Select
              key={index}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-56 h-12 bg-transparent border-2 border-stone-400/60 hover:border-amber-400/70 rounded-2xl shadow-2xl shadow-stone-900/25 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 backdrop-blur-sm">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 border-stone-400/60 shadow-2xl shadow-stone-900/40 bg-stone-50/95 backdrop-blur-md">
                {filter.options.map((option: any) => (
                  <SelectItem
                    key={option.id}
                    value={option.id}
                    className="rounded-xl"
                  >
                    {option.name} {option.count && `(${option.count})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {/* Mobile Free Delivery Banner - Visible only on Mobile */}
      <div className="md:hidden mx-4 mb-6">
        <div className="bg-gradient-to-r from-lime-400 via-yellow-300 to-lime-400 text-center py-3 rounded-2xl shadow-lg shadow-lime-400/25 border border-lime-300/50">
          <span className="text-stone-800 font-bold text-sm tracking-wide drop-shadow-sm">
            FREE DELIVERY FOR ORDERS OVER R800
          </span>
        </div>
      </div>

      {/* Mobile Hero Section - Visible only on Mobile */}
      <div className="md:hidden px-4 mb-8">
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/60 rounded-3xl p-6 overflow-hidden border border-amber-200/30 shadow-xl shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-amber-100/20 rounded-3xl" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          <div className="relative flex justify-center items-end gap-8 min-h-[220px]">
            {featuredProducts.slice(0, 2).map((product, index) => (
              <div
                key={product.id}
                className="flex flex-col items-center transform hover:scale-105 transition-all duration-500"
              >
                <div className="w-26 h-44 mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl blur-sm"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-full h-full object-contain drop-shadow-2xl filter brightness-105"
                  />
                </div>
                <div className="bg-gradient-to-br from-stone-900/20 via-stone-800/10 to-stone-900/20 backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-stone-900/40 min-w-[110px] border-2 border-stone-500/50">
                  <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider text-center leading-tight mb-3">
                    {product.name.includes("Algorithm")
                      ? "WOMANS\nALGORITHM"
                      : product.name.includes("Acidosis")
                        ? "ACIDOSIS\nPH CONTROL"
                        : product.name.split(" ").slice(0, 2).join("\n")}
                  </h3>
                  <div className="w-9 h-9 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-600/50 border-2 border-amber-400/60">
                    <span className="text-white font-bold text-xs drop-shadow-sm">
                      BB
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              className="absolute top-4 right-4 bg-gradient-to-br from-stone-900/80 to-stone-800/90 text-white hover:from-stone-800/90 hover:to-stone-700/90 px-4 py-2 text-xs rounded-2xl shadow-xl shadow-stone-800/25 backdrop-blur-sm border border-stone-700/50 transition-all duration-300"
            >
              More <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8 mb-8">
        {/* Mobile Section Header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-stone-800 to-stone-700 bg-clip-text text-transparent">
            This Week's Highlight!
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-300"
          >
            See All
          </Button>
        </div>

        {/* Desktop Section Header */}
        <div className="hidden md:block mb-12">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-stone-800 via-stone-700 to-stone-800 bg-clip-text text-transparent">
              Premium Wellness Collection
            </h2>
            <p className="text-lg text-stone-600">
              Showing {filteredProducts.length} handcrafted products
            </p>
            <div className="flex justify-center">
              <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {filteredProducts.slice(0, 20).map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-2 border-stone-300/60 hover:border-amber-400/80 shadow-2xl shadow-stone-900/25 hover:shadow-3xl hover:shadow-amber-600/40 transition-all duration-500 rounded-3xl bg-transparent backdrop-blur-md"
            >
              <div className="absolute top-4 right-4 z-20">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-9 h-9 p-0 bg-stone-900/20 hover:bg-stone-900/30 rounded-2xl shadow-xl shadow-stone-900/30 hover:shadow-2xl hover:shadow-pink-600/40 backdrop-blur-md border-2 border-stone-600/50 hover:border-pink-400/70 transition-all duration-300 group-hover:scale-110"
                >
                  <Heart className="w-4 h-4 text-stone-600 group-hover:text-pink-500 transition-colors duration-300 drop-shadow-lg" />
                </Button>
              </div>

              {/* Premium Badges */}
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white z-20 px-3 py-1 rounded-xl shadow-2xl shadow-amber-600/50 border-2 border-amber-300/60 font-bold text-xs backdrop-blur-sm">
                  ✨ Featured
                </Badge>
              )}
              {product.popular && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white z-20 px-3 py-1 rounded-xl shadow-2xl shadow-emerald-600/50 border-2 border-emerald-300/60 font-bold text-xs backdrop-blur-sm">
                  🔥 Popular
                </Badge>
              )}

              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden bg-transparent relative group-hover:scale-[1.02] transition-transform duration-500 border-b-2 border-stone-400/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-stone-50/10 to-transparent group-hover:from-amber-50/20"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="relative w-full h-full object-contain p-6 md:p-8 group-hover:scale-105 transition-all duration-500 filter brightness-105 group-hover:brightness-110 drop-shadow-2xl shadow-stone-900/40"
                  />
                </div>
                <CardContent className="p-5 md:p-6 bg-gradient-to-br from-stone-800/5 via-transparent to-stone-800/5 backdrop-blur-sm">
                  <div className="text-center md:text-left">
                    <h3 className="text-sm md:text-base font-bold text-stone-800 mb-3 min-h-[40px] md:min-h-[48px] flex items-center justify-center md:justify-start leading-tight group-hover:text-amber-700 transition-colors duration-300">
                      {product.name.length > 16
                        ? product.name.substring(0, 16) + "..."
                        : product.name}
                    </h3>

                    {/* Mobile rating */}
                    <div className="md:hidden flex items-center justify-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        <span className="text-xs text-stone-600 font-medium">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Desktop rating and reviews */}
                    <div className="hidden md:flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                        <span className="text-sm font-semibold text-stone-700">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-stone-500">
                        ({product.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      <span className="text-lg md:text-xl font-black bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm md:text-base text-stone-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Desktop Add to Cart Button */}
                    <div className="hidden md:block">
                      <Button className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white shadow-2xl shadow-amber-600/40 hover:shadow-3xl hover:shadow-amber-600/60 rounded-2xl transition-all duration-300 font-bold border-2 border-amber-400/50 hover:border-amber-300/70"
                        onClick={(e)=>{ e.preventDefault(); if(user){ addToCart({ productId: product.id, quantity: 1 }); } else { addToGuestCart({ productId: product.id, quantity: 1 }); } }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2 drop-shadow-sm" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Store Locator Section - Visible only on Mobile */}
      <div className="md:hidden px-4 mb-32">
        <h3 className="text-xl font-bold text-stone-800 mb-8 text-center">
          Find us at premium outlets
        </h3>
        <div className="grid grid-cols-4 gap-6">
          {/* SPAR */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mb-3 shadow-2xl shadow-green-600/50 hover:shadow-3xl hover:shadow-green-600/70 transition-all duration-300 hover:scale-105 border-2 border-green-400/60">
              <div className="text-white font-bold text-center">
                <Triangle className="w-4 h-4 mx-auto mb-1 fill-white drop-shadow-sm" />
                <span className="text-xs font-black tracking-wider drop-shadow-sm">
                  SPAR
                </span>
              </div>
            </div>
          </div>

          {/* Takealot */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-3 shadow-2xl shadow-blue-600/50 hover:shadow-3xl hover:shadow-blue-600/70 transition-all duration-300 hover:scale-105 border-2 border-blue-400/60">
              <div className="text-white text-center">
                <span className="text-xs font-bold drop-shadow-sm">
                  takealot
                </span>
                <div className="w-2 h-2 bg-blue-300 rounded-full mx-auto mt-1 shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Faithful to Nature */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-800 to-emerald-900 rounded-3xl flex items-center justify-center mb-3 shadow-2xl shadow-green-800/50 hover:shadow-3xl hover:shadow-green-800/70 transition-all duration-300 hover:scale-105 border-2 border-green-600/60">
              <div className="text-white text-center">
                <div className="text-xs font-bold drop-shadow-sm leading-tight">
                  Faithful
                  <br />
                  to Nature
                </div>
              </div>
            </div>
          </div>

          {/* Find Your Local */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-3 shadow-2xl shadow-orange-600/50 hover:shadow-3xl hover:shadow-orange-600/70 transition-all duration-300 hover:scale-105 border-2 border-amber-400/60">
              <div className="text-white text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1 drop-shadow-sm" />
                <div className="text-xs font-bold leading-tight drop-shadow-sm">
                  find your
                  <br />
                  local
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Footer - Hidden on Mobile */}
      {/* Footer provided by DefaultLayout */}

      {/* Mobile Bottom Navigation - Visible only on Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white shadow-lg border-t border-orange-400/30 backdrop-blur-sm">
        <div className="flex">
          {[
            { to: "/", icon: Home, label: "HOME" },
            { to: "/cart", icon: ShoppingCart, label: "CART" },
            { icon: Search, label: "SEARCH", onClick: true },
            { icon: Grid3X3, label: "CATEGORY", active: true },
          ].map((item, index) => (
            <div key={index} className="flex-1">
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex flex-col items-center justify-center py-2 hover:bg-white/10 transition-all duration-300 relative group"
                >
                  <item.icon className="w-4 h-4 mb-0.5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wide drop-shadow-sm">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <button
                  className={`w-full flex flex-col items-center justify-center py-2 transition-all duration-300 relative group ${
                    item.active
                      ? "bg-gradient-to-br from-amber-700/40 to-orange-700/40"
                      : "hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4 mb-0.5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wide drop-shadow-sm">
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-amber-300 to-orange-300 rounded-b-full shadow-sm"></div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
