import React, { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiHeart, FiBell, FiMapPin, FiGlobe, FiMenu, FiX } from 'react-icons/fi';

const EnterpriseNavigation: React.FC = () => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const [currency, setCurrency] = useState('ZAR');
  const [location, setLocation] = useState('Johannesburg');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize announcements
  useEffect(() => {
    setAnnouncements([
      '✨ Free shipping on orders over R500!',
      '🔥 New customers get 10% off first order!',
      '🎉 Black Friday deals now live!'
    ]);
  }, []);

  // Rotate announcements every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [announcements.length]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // AI search implementation would go here
  };

  // Currency options
  const currencies = [
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'EUR', name: 'Euro' }
  ];

  return (
    <nav className="bg-white shadow-md">
      {/* Announcement Bar */}
      <div className="bg-indigo-600 text-white text-center py-2 px-4 flex justify-center items-center">
        <div className="animate-pulse mr-2">✨</div>
        <p className="truncate">{announcements[currentAnnouncement]}</p>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7-1xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Menu */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="font-bold text-xl text-indigo-700">BetterBeing</span>
            </div>
            
            {/* Mega Menu - Desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-b-indigo-500 text-sm font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Products</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Categories</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">Deals</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">About</a>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search products, categories..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center">
            {/* Currency Selector */}
            <div className="ml-4 relative">
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-white border-0 rounded-md shadow-sm pl-3 pr-8 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>{curr.code} - {curr.name}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="ml-4 flex items-center">
              <FiMapPin className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-700">{location}</span>
            </div>

            {/* Notifications */}
            <div className="ml-4 relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiBell className="h-6 w-6" />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                3
              </span>
            </div>

            {/* Wishlist */}
            <div className="ml-4 relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiHeart className="h-6 w-6" />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {wishlistCount}
              </span>
            </div>

            {/* Cart */}
            <div className="ml-4 relative">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiShoppingCart className="h-6 w-6" />
              </button>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            </div>

            {/* Mobile menu button */}
            <div className="ml-ml-4 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a href="#" className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</a>
            <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Products</a>
            <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Categories</a>
            <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Deals</a>
            <a href="#" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">About</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default EnterpriseNavigation;