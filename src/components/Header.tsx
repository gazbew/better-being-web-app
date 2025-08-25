import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Leaf,
  ShoppingBag,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30 shadow-minimal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-earth-clay flex items-center justify-center shadow-float group-hover:shadow-ambient transition-all duration-300 group-hover:scale-105">
                <Sparkles className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full opacity-80 animate-pulse-soft"></div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gradient-primary">
                Better Being
              </div>
              <div className="text-xs text-muted-foreground font-medium tracking-wide">
                Natural Wellness Solutions
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className="btn-ghost-modern px-4 py-2 font-medium hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="btn-ghost-modern px-4 py-2 font-medium hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
            >
              Products
            </Link>
            <Link
              to="/wellness"
              className="btn-ghost-modern px-4 py-2 font-medium hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
            >
              Wellness
            </Link>
            <Link
              to="/about"
              className="btn-ghost-modern px-4 py-2 font-medium hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="btn-ghost-modern px-4 py-2 font-medium hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground mr-2">
                  Welcome, {user?.first_name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="btn-ghost-modern font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="btn-ghost-modern font-medium"
                asChild
              >
                <Link to="/login">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button size="sm" className="btn-primary px-6 font-medium" asChild>
              <Link to="/products">
                <Leaf className="w-4 h-4 mr-2" />
                Shop Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden btn-ghost-modern h-11 w-11 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden glass-strong border-t border-border/30 animate-fade-in-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/"
              className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/wellness"
              className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Wellness
            </Link>
            <Link
              to="/about"
              className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-[var(--radius)] transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="px-4 pb-4 border-t border-border/30 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user?.first_name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="btn-ghost-modern font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-ghost-modern font-medium"
                    asChild
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                className="btn-primary px-4 font-medium"
                asChild
              >
                <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                  <Leaf className="w-4 h-4 mr-2" />
                  Shop
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
