import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, User, Globe, Bell, ChevronDown, 
  Heart, Package, TrendingUp, Sparkles, Menu, X,
  Mic, Camera, MapPin, Clock, Phone, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AnnouncementBarProps {
  announcements: Array<{
    id: string;
    text: string;
    link?: string;
    type: 'info' | 'promo' | 'warning';
  }>;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!announcements.length) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white py-2 px-4 text-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Free Shipping on Orders Over R500
          </span>
          <span className="hidden md:flex items-center gap-2">
            <Phone className="w-3 h-3" />
            Support: 0800-WELLNESS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="font-medium">{current.text}</span>
          {current.link && (
            <Link to={current.link} className="underline hover:no-underline ml-1">
              Shop Now →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

interface SmartSearchProps {
  onSearch?: (query: string) => void;
}

const SmartSearchBar: React.FC<SmartSearchProps> = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [recentSearches] = useState(['Vitamin C', 'Probiotics', 'Omega 3']);
  const [trending] = useState(['Immune Support', 'Sleep Aid', 'Collagen']);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 2) {
      // Simulate API call for suggestions
      setSuggestions([
        { id: 1, name: 'Vitamin C 1000mg', category: 'Vitamins', price: 299 },
        { id: 2, name: 'Organic Vitamin C Complex', category: 'Vitamins', price: 399 },
        { id: 3, name: 'Vitamin C + Zinc', category: 'Immune', price: 349 },
      ]);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setOpen(false);
    navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    onSearch?.(searchTerm);
  };

  return (
    <>
      <div className="relative flex-1 max-w-xl mx-4">
        <div
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2.5 cursor-pointer hover:bg-white/20 transition-colors border border-white/20"
          onClick={() => setOpen(true)}
        >
          <Search className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-sm flex-1">Search products, brands, wellness goals...</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/20">
              <Mic className="w-3 h-3 text-white/80" />
            </Button>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-white/20">
              <Camera className="w-3 h-3 text-white/80" />
            </Button>
          </div>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search for products, brands, or wellness goals..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[500px]">
          {!query && (
            <>
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search) => (
                  <CommandItem key={search} onSelect={() => handleSearch(search)}>
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Trending Now">
                {trending.map((item) => (
                  <CommandItem key={item} onSelect={() => handleSearch(item)}>
                    <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                    {item}
                    <Badge variant="secondary" className="ml-auto">Hot</Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          
          {query && suggestions.length > 0 && (
            <CommandGroup heading="Products">
              {suggestions.map((product) => (
                <CommandItem 
                  key={product.id}
                  onSelect={() => navigate(`/products/${product.id}`)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <span className="font-semibold">R{product.price}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {query && suggestions.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

interface MegaMenuProps {
  categories: Array<{
    id: string;
    name: string;
    featured?: boolean;
    subcategories: Array<{
      id: string;
      name: string;
      items?: string[];
    }>;
    featuredProducts?: Array<{
      id: string;
      name: string;
      price: number;
      image: string;
    }>;
  }>;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ categories }) => {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {categories.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger 
              className={cn(
                "text-white/90 hover:text-white bg-transparent hover:bg-white/10",
                category.featured && "text-yellow-300"
              )}
            >
              {category.name}
              {category.featured && (
                <Badge variant="secondary" className="ml-2 text-xs">New</Badge>
              )}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-[800px] grid-cols-4">
                {category.subcategories.map((sub) => (
                  <div key={sub.id} className="space-y-3">
                    <h4 className="font-semibold text-sm text-primary">{sub.name}</h4>
                    {sub.items && (
                      <ul className="space-y-2">
                        {sub.items.map((item) => (
                          <li key={item}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/products?category=${category.id}&subcategory=${sub.id}`}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {item}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                
                {category.featuredProducts && (
                  <div className="col-span-2 border-l pl-6">
                    <h4 className="font-semibold text-sm mb-3">Featured Products</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {category.featuredProducts.slice(0, 2).map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium group-hover:text-primary">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">R{product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-white/90 hover:text-white bg-transparent hover:bg-white/10 px-4 py-2 rounded-md"
            href="/brands"
          >
            Brands
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-yellow-300 hover:text-yellow-200 bg-transparent hover:bg-white/10 px-4 py-2 rounded-md font-semibold"
            href="/deals"
          >
            🔥 Deals
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export const EnterpriseNavigation: React.FC = () => {
  const { cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const announcements = [
    { id: '1', text: '🎉 New Year Sale: Up to 40% OFF on Selected Items', link: '/deals', type: 'promo' as const },
    { id: '2', text: '✨ Join our Loyalty Program for Exclusive Benefits', link: '/loyalty', type: 'info' as const },
    { id: '3', text: '📦 Same Day Delivery Available in Major Cities', link: '/shipping', type: 'info' as const },
  ];

  const categories = [
    {
      id: 'vitamins',
      name: 'Vitamins & Minerals',
      featured: true,
      subcategories: [
        {
          id: 'multivitamins',
          name: 'Multivitamins',
          items: ['Men\'s Multivitamins', 'Women\'s Multivitamins', 'Kids Vitamins', 'Prenatal Vitamins']
        },
        {
          id: 'single-vitamins',
          name: 'Single Vitamins',
          items: ['Vitamin C', 'Vitamin D3', 'Vitamin B12', 'Vitamin E']
        },
        {
          id: 'minerals',
          name: 'Minerals',
          items: ['Magnesium', 'Zinc', 'Iron', 'Calcium']
        }
      ],
      featuredProducts: [
        { id: '1', name: 'Premium Multivitamin', price: 599, image: '/api/placeholder/100/100' },
        { id: '2', name: 'Vitamin D3 5000IU', price: 299, image: '/api/placeholder/100/100' }
      ]
    },
    {
      id: 'supplements',
      name: 'Supplements',
      subcategories: [
        {
          id: 'protein',
          name: 'Protein & Fitness',
          items: ['Whey Protein', 'Plant Protein', 'BCAAs', 'Creatine']
        },
        {
          id: 'wellness',
          name: 'Wellness',
          items: ['Probiotics', 'Omega-3', 'Collagen', 'Turmeric']
        },
        {
          id: 'specialty',
          name: 'Specialty',
          items: ['Nootropics', 'Adaptogens', 'Digestive Enzymes', 'Joint Support']
        }
      ]
    },
    {
      id: 'natural',
      name: 'Natural & Organic',
      subcategories: [
        {
          id: 'herbs',
          name: 'Herbs & Botanicals',
          items: ['Ashwagandha', 'Ginseng', 'Echinacea', 'Milk Thistle']
        },
        {
          id: 'superfoods',
          name: 'Superfoods',
          items: ['Spirulina', 'Chlorella', 'Moringa', 'Maca Root']
        }
      ]
    }
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar announcements={announcements} />
      
      {/* Main Navigation */}
      <header 
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-primary-900/95 backdrop-blur-lg shadow-lg" 
            : "bg-gradient-to-r from-primary-900 to-primary-800"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-primary-100 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <span className="text-primary-900 font-black text-sm">BB</span>
                </div>
                <div className="absolute inset-0 bg-white/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg tracking-wide">BETTER BEING</h1>
                <p className="text-white/70 text-xs">Premium Wellness Store</p>
              </div>
            </Link>

            {/* Search Bar */}
            <SmartSearchBar />

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Location Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Cape Town</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Cape Town</DropdownMenuItem>
                  <DropdownMenuItem>Johannesburg</DropdownMenuItem>
                  <DropdownMenuItem>Durban</DropdownMenuItem>
                  <DropdownMenuItem>Pretoria</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                    <Globe className="w-4 h-4 mr-1" />
                    ZAR
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>🇿🇦 ZAR - South African Rand</DropdownMenuItem>
                  <DropdownMenuItem>🇺🇸 USD - US Dollar</DropdownMenuItem>
                  <DropdownMenuItem>🇬🇧 GBP - British Pound</DropdownMenuItem>
                  <DropdownMenuItem>🇪🇺 EUR - Euro</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Support */}
              <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                <MessageCircle className="w-4 h-4 mr-1" />
                Support
              </Button>

              {/* Notifications */}
              {isAuthenticated && (
                <Button variant="ghost" size="sm" className="relative text-white/90 hover:text-white hover:bg-white/10">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </Button>
              )}

              {/* Wishlist */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/90 hover:text-white hover:bg-white/10"
                onClick={() => navigate('/wishlist')}
              >
                <Heart className="w-4 h-4" />
              </Button>

              {/* Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-1" />
                    {isAuthenticated ? user?.firstName || 'Account' : 'Sign In'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/account')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/orders')}>
                        <Package className="mr-2 h-4 w-4" />
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/account/rewards')}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Rewards
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Sign Out</DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/login')}>Sign In</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/register')}>Create Account</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Button 
                className="bg-white text-primary-900 hover:bg-white/90 relative"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mega Menu */}
          <div className="hidden lg:block border-t border-white/10">
            <MegaMenu categories={categories} />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <SmartSearchBar />
            
            {/* Mobile Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate(`/products?category=${category.id}`);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Mobile Actions */}
            <div className="border-t pt-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                {isAuthenticated ? 'My Account' : 'Sign In'}
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Cart ({cartItemCount})
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
