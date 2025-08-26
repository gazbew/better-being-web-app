import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const NavigationPrimary = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const cartItemCount = cartItems?.length || 0;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-[#BB4500]/10"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Top Bar */}
        <div className="bg-[#BB4500] text-white py-2 px-4">
          <div className="container mx-auto flex justify-between items-center text-sm">
            <div
              className="font-medium tracking-wide"
              style={{ fontFamily: "'League Spartan', sans-serif" }}
            >
              FREE SHIPPING ON ORDERS OVER R500
            </div>
            <div className="hidden md:flex items-center gap-4">
              <span
                className="font-medium tracking-wide"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                NEED HELP? +27 12 345 6789
              </span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#BB4500] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-[#280B0B] uppercase tracking-wide"
                  style={{
                    fontFamily: "'League Spartan', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  Better Being
                </div>
                <div
                  className="text-sm text-[#626675] -mt-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Natural Wellness Solutions
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className="text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] transition-colors duration-300 py-2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] transition-colors duration-300 py-2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className="text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] transition-colors duration-300 py-2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                About
              </Link>
              <Link
                to="/wellness"
                className="text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] transition-colors duration-300 py-2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Wellness
              </Link>
              <Link
                to="/contact"
                className="text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] transition-colors duration-300 py-2"
                style={{
                  fontFamily: "'League Spartan', sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                Contact
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search - Hidden on mobile */}
              <form
                onSubmit={handleSearch}
                className="relative hidden md:block"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-12 pr-4 py-3 border-2 border-stone-400/60 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 transition-all duration-300 bg-transparent shadow-2xl shadow-stone-900/20 backdrop-blur-sm"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                />
              </form>

              {/* Wishlist */}
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 rounded-lg transition-all duration-300"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 rounded-lg transition-all duration-300 relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[#C4C240] text-[#280B0B] font-bold text-xs rounded-full shadow-lg">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Actions */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/account">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 rounded-lg transition-all duration-300"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 px-4 py-2 rounded-lg font-medium uppercase tracking-wide transition-all duration-300"
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-stone-800 hover:text-amber-600 hover:bg-amber-500/10 font-semibold uppercase tracking-wide transition-all duration-300 border-2 border-transparent hover:border-amber-400/40 rounded-2xl shadow-lg shadow-stone-900/10 hover:shadow-xl hover:shadow-amber-500/20 backdrop-blur-sm"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-wide shadow-2xl shadow-amber-600/40 hover:shadow-3xl hover:shadow-amber-600/60 transition-all duration-300 border-2 border-amber-400/50 hover:border-amber-300/70">
                      <Leaf className="w-4 h-4 mr-2 drop-shadow-sm" />
                      <span
                        style={{
                          fontFamily: "'League Spartan', sans-serif",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Shop Now
                      </span>
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden w-10 h-10 text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 rounded-lg transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t border-[#626675]/10">
            <div className="container mx-auto px-4 py-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-stone-400/60 rounded-2xl focus:border-amber-400 focus:ring-4 focus:ring-amber-400/30 bg-transparent shadow-2xl shadow-stone-900/20 backdrop-blur-sm"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-500" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-6">
                {[
                  { to: "/", label: "Home" },
                  { to: "/shop", label: "Shop" },
                  { to: "/about", label: "About" },
                  { to: "/wellness", label: "Wellness" },
                  { to: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block px-4 py-3 text-[#280B0B] font-semibold uppercase tracking-wide hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 rounded-lg transition-all duration-300"
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile User Actions */}
              {user ? (
                <div className="flex items-center justify-between pt-4 border-t border-[#626675]/10">
                  <Link to="/account">
                    <Button
                      variant="ghost"
                      className="text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 px-4 py-2 rounded-lg font-medium uppercase tracking-wide"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Account
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[#626675] hover:text-[#BB4500] hover:bg-[#F9E7C9]/50 px-4 py-2 rounded-lg font-medium uppercase tracking-wide"
                    style={{
                      fontFamily: "'League Spartan', sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t border-[#626675]/10">
                  <Link to="/login" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-[#BB4500] text-[#BB4500] hover:bg-[#BB4500] hover:text-white font-bold uppercase tracking-wide py-3 rounded-lg transition-all duration-300"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/shop" className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold uppercase tracking-wide py-4 rounded-2xl shadow-2xl shadow-amber-600/40 hover:shadow-3xl hover:shadow-amber-600/60 transition-all duration-300 border-2 border-amber-400/50 hover:border-amber-300/70"
                      style={{
                        fontFamily: "'League Spartan', sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Leaf className="w-4 h-4 mr-2 drop-shadow-sm" />
                      Shop Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Navigation Spacer */}
      <div
        className={`${scrolled ? "h-32" : "h-36"} transition-all duration-300`}
      />
    </>
  );
};

export { NavigationPrimary };
export default NavigationPrimary;
