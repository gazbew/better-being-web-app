import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground text-center">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto">
<h3 className="text-3xl font-heading uppercase tracking-wider font-bold mb-4">
              Join the Wellness Revolution
            </h3>
            <p className="text-primary-foreground/80 mb-8">
              Get exclusive wellness tips, early access to new products, and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-4">
              No spam. Unsubscribe anytime. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">BB</span>
              </div>
              <div>
<h3 className="text-xl font-heading uppercase tracking-wider font-bold">Better Being</h3>
                <p className="text-sm text-primary-foreground/80">Natural Wellness</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6">
              Discover the power of nature with Better Being's premium wellness solutions.
              Ethically sourced, scientifically formulated for your optimal health.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-accent hover:bg-primary-foreground/10">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
<h4 className="text-lg font-heading uppercase tracking-wider font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-primary-foreground/80 hover:text-accent transition-colors">Home</a></li>
              <li><a href="/products" className="text-primary-foreground/80 hover:text-accent transition-colors">Products</a></li>
              <li><a href="/wellness" className="text-primary-foreground/80 hover:text-accent transition-colors">Wellness</a></li>
              <li><a href="/blog" className="text-primary-foreground/80 hover:text-accent transition-colors">Blog</a></li>
              <li><a href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="/community" className="text-primary-foreground/80 hover:text-accent transition-colors">Community</a></li>
              <li><a href="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support & Services */}
          <div>
<h4 className="text-lg font-heading uppercase tracking-wider font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="/shipping" className="text-primary-foreground/80 hover:text-accent transition-colors">Shipping Info</a></li>
              <li><a href="/refund-policy" className="text-primary-foreground/80 hover:text-accent transition-colors">Refund Policy</a></li>
              <li><a href="/store-locator" className="text-primary-foreground/80 hover:text-accent transition-colors">Store Locator</a></li>
              <li><a href="/testimonials" className="text-primary-foreground/80 hover:text-accent transition-colors">Testimonials</a></li>
              <li><a href="/farming" className="text-primary-foreground/80 hover:text-accent transition-colors">Farming Solutions</a></li>
              <li><a href="/become-stockist" className="text-primary-foreground/80 hover:text-accent transition-colors">Become a Stockist</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
<h4 className="text-lg font-heading uppercase tracking-wider font-semibold mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-primary-foreground/80">info@our-grounds.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5" />
                <span className="text-primary-foreground/80">
                  171 Blaauwberg Rd<br />
                  Table View, Cape Town 7441<br />
                  South Africa
                </span>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-6 p-4 bg-primary-foreground/10 rounded-lg">
<h5 className="font-heading uppercase tracking-wider font-semibold mb-2">Business Hours</h5>
              <div className="text-sm text-primary-foreground/80 space-y-1">
                <div>Mon - Fri: 8:00 AM - 8:00 PM</div>
                <div>Sat: 9:00 AM - 6:00 PM</div>
                <div>Sun: 10:00 AM - 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-primary-foreground/80 text-sm">
              © 2024 Better Being. All rights reserved. Nature's wisdom, your wellness.
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-primary-foreground/80">
              <a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="/refund-policy" className="hover:text-accent transition-colors">Refund Policy</a>
              <a href="/marketing" className="hover:text-accent transition-colors">Marketing Partners</a>
              <a href="/investors-pool" className="hover:text-accent transition-colors">Investors</a>
              <a href="/tech" className="hover:text-accent transition-colors">Technology</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};