import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Menu, X, ShoppingBag, User, Search, Heart, ChevronDown, Leaf, Sparkles, Shield, LogOut, UserCircle } from "lucide-react";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const productCategories = [
  { name: "Supplements", href: "/products?category=supplements", description: "Natural vitamins & minerals", icon: Leaf },
  { name: "Skincare", href: "/products?category=skincare", description: "Organic beauty products", icon: Sparkles },
  { name: "Wellness", href: "/products?category=wellness", description: "Mind & body health", icon: Shield },
];

const wellnessResources = [
  { name: "Wellness Blog", href: "/blog", description: "Expert health tips" },
  { name: "Nutrition Guide", href: "/nutrition", description: "Balanced eating plans" },
  { name: "Mindfulness", href: "/mindfulness", description: "Mental wellness practices" },
  { name: "Sleep Health", href: "/sleep", description: "Better rest solutions" },
];

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { handleAnchorClick } = useScrollToSection();
  const { cartSummary } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target?.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Cart count comes from cart context
  const cartCount = cartSummary?.totalQuantity || 0;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-[var(--z-skiplink)]"
      >
        Skip to main content
      </a>

      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-300",
          scrolled 
            ? "bg-background/95 backdrop-blur-xl shadow-elegant border-b border-border/50" 
            : "bg-background/80 backdrop-blur-sm border-b border-border/30"
        )}
        role="banner"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between" style={{ height: "var(--nav-height)" }}>
            
            {/* Logo & Brand */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
              aria-label="Better Being - Natural Wellness Home"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-success-500 rounded-xl flex items-center justify-center shadow-wellness group-hover:shadow-premium transition-all duration-300 group-hover:scale-110 glow-primary">
                  <Leaf className="w-6 h-6 text-white animate-text-sparkle" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full flex items-center justify-center animate-breathe">
                  <Sparkles className="w-2 h-2 text-neutral-900 animate-text-sparkle" />
                </div>
                {/* Enhanced floating glow effect */}
                <div className="absolute inset-0 bg-primary-400/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 glow-primary" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground tracking-brand">
                  BETTER BEING
                </h1>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                  Natural Wellness
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block" role="navigation" aria-label="Main navigation">
              <NavigationMenu>
                <NavigationMenuList className="space-x-2">
                  
                  {/* Home */}
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink 
                        className={cn(
                          "relative group font-heading text-sm uppercase tracking-brand px-4 py-2 rounded-md transition-all duration-300 font-medium",
                          isActive("/") 
                            ? "text-primary-600 bg-primary-50" 
                            : "text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50"
                        )}
                      >
                        Home
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-success-500 group-hover:w-full transition-all duration-300" />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Products Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-heading text-sm uppercase tracking-brand font-medium">
                      Products
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[500px] lg:grid-cols-[1fr_1fr]">
                        <div className="row-span-3">
                          <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary-500/20 to-accent-500/20 p-6 no-underline outline-none focus:shadow-md glass-primary">
                            <Leaf className="h-8 w-8 text-primary-600 animate-text-sparkle" />
                            <div className="mb-2 mt-4 text-lg font-heading font-semibold tracking-brand text-morphing-primary">
                              Natural Products
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground font-body">
                              Discover our curated collection of natural wellness products for mind, body, and spirit.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {productCategories.map((category) => (
                            <Link
                              key={category.name}
                              to={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center space-x-2">
                                <category.icon className="h-4 w-4 text-primary-600 animate-text-sparkle" />
                                <div className="text-sm font-heading font-medium tracking-brand">
                                  {category.name}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground font-body">
                                {category.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Wellness Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-heading text-sm uppercase tracking-brand font-medium">
                      Wellness
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        <div className="grid gap-2">
                          {wellnessResources.map((resource) => (
                            <Link
                              key={resource.name}
                              to={resource.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              <div className="text-sm font-heading font-medium tracking-brand">
                                {resource.name}
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground font-body">
                                {resource.description}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* About */}
                  <NavigationMenuItem>
                    <Link to="/about">
                      <NavigationMenuLink 
                        className={cn(
                          "relative group font-heading text-sm uppercase tracking-brand px-4 py-2 rounded-md transition-all duration-300 font-medium",
                          isActive("/about") 
                            ? "text-secondary-600 bg-secondary-50" 
                            : "text-muted-foreground hover:text-secondary-600 hover:bg-secondary-50/50"
                        )}
                      >
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary-500 to-primary-500 group-hover:w-full transition-all duration-300" />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>

                  {/* Contact */}
                  <NavigationMenuItem>
                    <Link to="/contact">
                      <NavigationMenuLink 
                        className={cn(
                          "relative group font-heading text-sm uppercase tracking-brand px-4 py-2 rounded-md transition-all duration-300 font-medium",
                          isActive("/contact") 
                            ? "text-warning-600 bg-warning-50" 
                            : "text-muted-foreground hover:text-warning-600 hover:bg-warning-50/50"
                        )}
                      >
                        Contact
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-warning-500 to-accent-500 group-hover:w-full transition-all duration-300" />
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-secondary-600 hover:bg-secondary-50/50 glass-secondary font-heading uppercase text-sm tracking-wider py-3 px-5 rounded-xl transition-all duration-300 hover:scale-105 shadow-floating"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Wishlist Button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-warning-600 hover:bg-warning-50/50 relative glass-accent transition-all duration-300 hover:scale-105 shadow-floating"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 animate-text-sparkle" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-accent-500 text-neutral-900 animate-breathe">
                  3
                </Badge>
              </Button>

              {/* Account/Auth Section */}
              {isAuthenticated && user ? (
                <div className="relative" data-user-menu>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50 glass-primary font-heading uppercase text-xs tracking-brand transition-all duration-300 hover:scale-105 shadow-floating"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    {user.firstName}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border/50 rounded-lg shadow-premium backdrop-blur-xl z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm border-b border-border/30 mb-2">
                          <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link 
                          to="/profile" 
                          className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50 rounded-md transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile Settings
                        </Link>
                        <Link 
                          to="/account" 
                          className="flex items-center px-3 py-2 text-sm text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50 rounded-md transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Orders & Account
                        </Link>
                        <button 
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50 glass-primary font-heading uppercase text-xs tracking-brand transition-all duration-300 hover:scale-105 shadow-floating"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm"
                      className="btn-primary-vibrant font-heading uppercase text-xs tracking-wider px-4 py-2 rounded-xl shadow-premium hover:shadow-floating transition-all duration-300 hover:scale-105 btn-glow glow-primary"
                    >
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}

              <Separator orientation="vertical" className="h-8" />

              {/* Cart Button */}
              <Button 
                size="sm"
                className="btn-primary-vibrant font-heading uppercase text-xs tracking-wider px-8 py-3 rounded-xl shadow-premium hover:shadow-floating transition-all duration-300 hover:scale-105 btn-glow glow-primary relative"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 text-xs bg-accent-500 text-neutral-900 border-2 border-background animate-breathe">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Checkout Button */}
              <Link to="/checkout">
                <Button 
                  size="sm"
                  className="ml-2 font-heading uppercase text-xs tracking-wider px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-floating glass-primary hover:bg-primary-50/50"
                  aria-label="Go to checkout"
                >
                  Checkout
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-muted-foreground hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6 animate-text-sparkle" /> : <Menu className="w-6 h-6 animate-text-sparkle" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div 
              className="lg:hidden py-4 border-t border-border/50 animate-fade-in-up"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/") ? "text-primary-600 bg-primary-50" : "text-foreground hover:text-primary-600 hover:bg-primary-50/50"
                  )}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/products") ? "text-accent-600 bg-accent-50" : "text-foreground hover:text-accent-600 hover:bg-accent-50/50"
                  )}
                >
                  Products
                </Link>
                <Link 
                  to="/wellness" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/wellness") ? "text-success-600 bg-success-50" : "text-foreground hover:text-success-600 hover:bg-success-50/50"
                  )}
                >
                  Wellness
                </Link>
                <Link 
                  to="/about" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/about") ? "text-secondary-600 bg-secondary-50" : "text-foreground hover:text-secondary-600 hover:bg-secondary-50/50"
                  )}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/contact") ? "text-warning-600 bg-warning-50" : "text-foreground hover:text-warning-600 hover:bg-warning-50/50"
                  )}
                >
                  Contact
                </Link>
                <Link 
                  to="/checkout" 
                  className={cn(
                    "text-base font-heading uppercase tracking-brand transition-colors py-2 px-3 rounded-lg",
                    isActive("/checkout") ? "text-primary-600 bg-primary-50" : "text-foreground hover:text-primary-600 hover:bg-primary-50/50"
                  )}
                >
                  Checkout
                </Link>

                <Separator className="my-4" />

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="flex-1 mr-2 glass-secondary hover:bg-secondary-50/50">
                      <Search className="w-4 h-4 mr-2 animate-text-sparkle" />
                      Search
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 ml-2 relative glass-accent hover:bg-warning-50/50">
                      <Heart className="w-4 h-4 mr-2 animate-text-sparkle" />
                      Wishlist
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-accent-500 text-neutral-900 animate-breathe">3</Badge>
                    </Button>
                  </div>
                  <Link to="/account" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full glass-primary hover:bg-primary-50/50">
                      <User className="w-4 h-4 mr-2 animate-text-sparkle" />
                      My Account
                    </Button>
                  </Link>
                  <Button 
                    size="sm" 
                    className="w-full btn-primary-vibrant font-heading uppercase text-xs tracking-brand py-3 relative shadow-wellness hover:shadow-floating transition-all duration-300 hover:scale-105 btn-glow glow-primary"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Cart
                    {cartCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs bg-accent-500 text-neutral-900 animate-breathe">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                  <Link to="/checkout" className="w-full">
                    <Button 
                      size="sm" 
                      className="mt-2 w-full glass-primary hover:bg-primary-50/50 font-heading uppercase text-xs tracking-brand py-3 shadow-floating"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div style={{ height: "var(--nav-height)" }} />
    </>
  );
};
