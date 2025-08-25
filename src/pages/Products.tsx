import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ChevronDown,
  SlidersHorizontal,
  Package,
  Leaf,
  Award,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock product data with the new soft aesthetic
const mockProducts = [
  {
    id: 1,
    name: "Organic Ashwagandha Capsules",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 156,
    category: "Adaptogens",
    brand: "Better Being",
    image: "/api/placeholder/400/400",
    tags: ["Organic", "Stress Relief", "Energy"],
    description:
      "Premium organic ashwagandha for stress relief and energy balance.",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Himalayan Shilajit Resin",
    price: 149.99,
    rating: 4.9,
    reviews: 89,
    category: "Minerals",
    brand: "Pure Mountain",
    image: "/api/placeholder/400/400",
    tags: ["Raw", "Energy", "Minerals"],
    description:
      "Authentic Himalayan shilajit for vitality and mineral supplementation.",
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "Lion's Mane Mushroom Extract",
    price: 67.99,
    rating: 4.7,
    reviews: 203,
    category: "Nootropics",
    brand: "Fungi Focus",
    image: "/api/placeholder/400/400",
    tags: ["Cognitive", "Brain Health", "Extract"],
    description: "Concentrated lion's mane extract for cognitive enhancement.",
    inStock: true,
    featured: false,
  },
  {
    id: 4,
    name: "Turmeric Golden Milk Blend",
    price: 34.99,
    rating: 4.6,
    reviews: 124,
    category: "Superfoods",
    brand: "Golden Wellness",
    image: "/api/placeholder/400/400",
    tags: ["Anti-inflammatory", "Blend", "Ayurvedic"],
    description:
      "Traditional golden milk blend with turmeric and warming spices.",
    inStock: false,
    featured: false,
  },
  {
    id: 5,
    name: "Organic Spirulina Powder",
    price: 42.99,
    rating: 4.5,
    reviews: 87,
    category: "Superfoods",
    brand: "Green Earth",
    image: "/api/placeholder/400/400",
    tags: ["Protein", "Detox", "Organic"],
    description:
      "Pure organic spirulina powder packed with nutrients and protein.",
    inStock: true,
    featured: false,
  },
  {
    id: 6,
    name: "Rhodiola Root Extract",
    price: 78.99,
    rating: 4.8,
    reviews: 67,
    category: "Adaptogens",
    brand: "Arctic Herbs",
    image: "/api/placeholder/400/400",
    tags: ["Adaptogen", "Mental Clarity", "Stress"],
    description:
      "Premium rhodiola extract for mental clarity and stress adaptation.",
    inStock: true,
    featured: false,
  },
];

const categories = [
  "All Products",
  "Adaptogens",
  "Minerals",
  "Nootropics",
  "Superfoods",
];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name", label: "Name A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

const ProductCard = ({ product }: { product: any }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card className="group relative bg-gradient-to-br from-[#faf8f1] to-[#f7f3eb] border-2 border-[#e5c287]/20 hover:border-[#e5c287]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-warm hover:-translate-y-2">
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.featured && (
          <Badge className="bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] text-[#7a4d3b] shadow-gentle">
            <Award className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        )}
        {!product.inStock && (
          <Badge variant="destructive" className="bg-red-500/90 text-white">
            Out of Stock
          </Badge>
        )}
        {product.originalPrice && (
          <Badge className="bg-[#7a4d3b] text-[#f7f3eb]">
            Save R{(product.originalPrice - product.price).toFixed(2)}
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm hover:bg-[#e5c287] transition-all duration-300 rounded-full group/heart"
        onClick={() => setIsWishlisted(!isWishlisted)}
      >
        <Heart
          className={`w-4 h-4 transition-all duration-300 ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-[#7a4d3b] group-hover/heart:fill-[#7a4d3b]"
          }`}
        />
      </Button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f0e9d2] to-[#e5c287]/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#7a4d3b]/0 group-hover:bg-[#7a4d3b]/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-3">
            <Button
              size="icon"
              className="bg-white/90 backdrop-blur-sm hover:bg-[#e5c287] text-[#7a4d3b] rounded-full shadow-gentle"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              className="bg-white/90 backdrop-blur-sm hover:bg-[#e5c287] text-[#7a4d3b] rounded-full shadow-gentle"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className="border-[#d4b8a1] text-[#7a4d3b]">
            {product.brand}
          </Badge>
          <span className="text-[#a67c52]">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-heading text-xl font-bold text-[#7a4d3b] line-clamp-2 group-hover:text-[#5c3a2d] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-[#7a4d3b]/70 font-body text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#e5c287]/20 text-[#7a4d3b] text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-[#e5c287] fill-[#e5c287]"
                    : "text-[#d4b8a1]"
                }`}
              />
            ))}
          </div>
          <span className="text-[#7a4d3b] font-semibold text-sm">
            {product.rating}
          </span>
          <span className="text-[#a67c52] text-sm">({product.reviews})</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#7a4d3b]">
              R{product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-[#a67c52] line-through">
                R{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
            product.inStock
              ? "bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] hover:from-[#d4ab6a] hover:to-[#c19854] text-[#7a4d3b] shadow-soft hover:shadow-warm"
              : "bg-[#d4b8a1]/50 text-[#7a4d3b]/50 cursor-not-allowed"
          }`}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f1] via-[#f7f3eb] to-[#f0e9d2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] py-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#7a4d3b] rounded-full blur-3xl animate-gentle-float"></div>
          <div
            className="absolute bottom-10 right-20 w-40 h-40 bg-[#f0e9d2] rounded-full blur-3xl animate-gentle-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#7a4d3b] rounded-full blur-2xl animate-gentle-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-3 bg-[#7a4d3b]/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <Package className="w-5 h-5 text-[#7a4d3b]" />
              <span className="text-[#7a4d3b] font-semibold text-sm uppercase tracking-wider">
                Premium Natural Products
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#7a4d3b] font-heading">
              Discover Your
              <span className="block text-gradient-soft">Wellness Journey</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#7a4d3b]/80 leading-relaxed font-body max-w-3xl mx-auto">
              Explore our curated collection of premium natural supplements,
              superfoods, and wellness products. Each item is carefully selected
              to support your path to better being.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-12 pt-8">
              {[
                {
                  icon: Leaf,
                  label: "100+ Products",
                  desc: "Natural & Organic",
                },
                { icon: Award, label: "5⭐ Rated", desc: "Customer Approved" },
                { icon: Zap, label: "Fast Shipping", desc: "2-3 Day Delivery" },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="text-center bg-[#7a4d3b]/10 backdrop-blur-sm rounded-2xl p-4"
                >
                  <Icon className="w-8 h-8 text-[#7a4d3b] mx-auto mb-2" />
                  <div className="font-bold text-[#7a4d3b]">{label}</div>
                  <div className="text-sm text-[#7a4d3b]/70">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-0 z-50 bg-[#faf8f1]/95 backdrop-blur-md border-b border-[#e5c287]/20 shadow-gentle">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7a4d3b]/60 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl text-[#7a4d3b] placeholder-[#7a4d3b]/60 shadow-gentle focus:shadow-warm transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48 bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl text-[#7a4d3b] shadow-gentle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#e5c287]/30 rounded-xl shadow-warm">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-[#7a4d3b] hover:bg-[#e5c287]/10 focus:bg-[#e5c287]/20"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white border-2 border-[#e5c287]/30 focus:border-[#e5c287] rounded-xl text-[#7a4d3b] shadow-gentle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#e5c287]/30 rounded-xl shadow-warm">
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-[#7a4d3b] hover:bg-[#e5c287]/10 focus:bg-[#e5c287]/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex bg-white border-2 border-[#e5c287]/30 rounded-xl p-1 shadow-gentle">
                <Button
                  size="icon"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-[#e5c287] text-[#7a4d3b] shadow-gentle"
                      : "text-[#7a4d3b]/60 hover:text-[#7a4d3b] hover:bg-[#e5c287]/20"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-[#e5c287] text-[#7a4d3b] shadow-gentle"
                      : "text-[#7a4d3b]/60 hover:text-[#7a4d3b] hover:bg-[#e5c287]/20"
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-2 border-[#e5c287]/30 text-[#7a4d3b] hover:bg-[#e5c287]/20 hover:border-[#e5c287] rounded-xl shadow-gentle"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#7a4d3b] font-heading mb-2">
                {selectedCategory === "All Products"
                  ? "All Products"
                  : selectedCategory}
              </h2>
              <p className="text-[#7a4d3b]/70 font-body">
                Showing {filteredAndSortedProducts.length} of{" "}
                {mockProducts.length} products
                {searchQuery && <span> for "{searchQuery}"</span>}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="animate-fade-in-gentle"
                  style={{ animationDelay: `${product.id * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#e5c287]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-[#7a4d3b]/50" />
              </div>
              <h3 className="text-2xl font-bold text-[#7a4d3b] mb-2">
                No products found
              </h3>
              <p className="text-[#7a4d3b]/70 mb-8">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Products");
                }}
                className="bg-gradient-to-r from-[#e5c287] to-[#d4b8a1] text-[#7a4d3b] hover:from-[#d4ab6a] hover:to-[#c19854] rounded-xl px-8 py-3 font-semibold shadow-soft hover:shadow-warm transition-all duration-300"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
