import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Leaf,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FooterPrimary = () => {
  return (
    <footer className="relative overflow-hidden bg-[#4a4a4a]">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1024' height='576' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23555555'/%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Texture Overlay to match the image */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, rgba(85, 85, 85, 0.9) 0%, rgba(74, 74, 74, 0.95) 50%, rgba(68, 68, 68, 0.9) 100%),
            radial-gradient(circle at 30% 40%, rgba(90, 90, 90, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 70% 60%, rgba(80, 80, 80, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Better Being Logo positioned like in the image */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="flex items-center gap-3 opacity-60">
          {/* Logo Circle */}
          <div className="w-12 h-12 rounded-full border-2 border-[#CD853F] flex items-center justify-center bg-transparent">
            <span className="text-[#CD853F] font-bold text-lg">BB</span>
          </div>
          {/* Better Being Text */}
          <div className="text-[#CD853F] font-bold text-xl tracking-wide">
            Better Being
          </div>
        </div>
      </div>

      {/* Subtle grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.15] mix-blend-multiply"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(0, 0, 0, 0.03) 1px,
              rgba(0, 0, 0, 0.03) 2px
            )
          `,
        }}
      />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e5c287] rounded-full blur-3xl animate-gentle-float"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4b8a1] rounded-full blur-3xl animate-gentle-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#f0e9d2] rounded-full blur-2xl animate-gentle-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-[#3a3a3a]/80 to-[#2f2f2f]/80 border-b border-[#CD853F]/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-[#CD853F]/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
              <Heart className="w-5 h-5 text-[#F5DEB3]" />
              <span className="text-[#F5DEB3] font-semibold text-sm uppercase tracking-wider">
                Join Our Wellness Community
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-heading">
              Stay Connected to Your
              <span className="block text-[#F5DEB3]">Wellness Journey</span>
            </h3>

            <p className="text-white/90 text-base md:text-lg mb-6 leading-relaxed font-body">
              Get exclusive wellness tips, early access to new products, and
              special offers delivered straight to your inbox. Join thousands on
              their path to better being.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F5DEB3]/60 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="pl-10 pr-3 py-2 bg-[#2a2a2a]/90 backdrop-blur-sm border border-[#CD853F]/30 focus:border-[#F5DEB3] text-white placeholder-[#F5DEB3]/60 rounded-lg text-sm font-body shadow-gentle focus:shadow-warm transition-all duration-300"
                />
              </div>
              <Button className="bg-[#CD853F] hover:bg-[#B8860B] text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wide shadow-soft hover:shadow-warm transition-all duration-300 group">
                Subscribe
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            <p className="text-[#F5DEB3]/70 text-xs mt-2">
              ✨ No spam, just wellness. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="inline-flex items-center gap-4 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#CD853F] to-[#B8860B] rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-soft">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5DEB3] rounded-full animate-soft-pulse"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-heading">
                  Better Being
                </div>
                <div className="text-[#F5DEB3] text-xs font-body -mt-1">
                  Natural Wellness Solutions
                </div>
              </div>
            </Link>

            <p className="text-white/90 leading-relaxed font-body text-sm">
              Transform your wellness journey with our curated collection of
              natural products. Building a healthier world, one conscious choice
              at a time.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <span className="text-[#F5DEB3] font-semibold text-xs uppercase tracking-wide">
                Follow Us
              </span>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Youtube, href: "#", label: "YouTube" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-9 h-9 bg-[#CD853F]/30 hover:bg-[#F5DEB3] rounded-lg flex items-center justify-center transition-all duration-300 group shadow-gentle hover:shadow-warm"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4 text-white group-hover:text-[#4a4a4a] transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold text-[#F5DEB3] uppercase tracking-wide font-heading relative">
              Explore
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F5DEB3] to-transparent"></div>
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/products", label: "Our Products" },
                { to: "/wellness", label: "Wellness Hub" },
                { to: "/about", label: "About Us" },
                { to: "/blog", label: "Blog & Articles" },
                { to: "/community", label: "Community" },
                { to: "/farming", label: "Farming Solutions" },
                { to: "/testimonials", label: "Testimonials" },
                { to: "/contact", label: "Contact Us" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-white/90 hover:text-[#F5DEB3] transition-all duration-300 font-body text-sm group flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services & Support */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold text-[#F5DEB3] uppercase tracking-wide font-heading relative">
              Support
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F5DEB3] to-transparent"></div>
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/account", label: "My Account" },
                { to: "/shipping", label: "Shipping Info" },
                { to: "/refund-policy", label: "Refund Policy" },
                { to: "/store-locator", label: "Store Locator" },
                { to: "/become-stockist", label: "Become Stockist" },
                { to: "/marketing", label: "Marketing Partners" },
                { to: "/investors-pool", label: "Investor Relations" },
                { to: "/tech", label: "Technology" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-white/90 hover:text-[#F5DEB3] transition-all duration-300 font-body text-lg group flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <h4 className="text-xl font-bold text-[#F5DEB3] uppercase tracking-wider font-heading relative">
              Contact
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#F5DEB3] to-transparent"></div>
            </h4>

            <div className="space-y-6">
              <div className="bg-[#CD853F]/20 backdrop-blur-sm border border-[#F5DEB3]/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5DEB3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#4a4a4a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5DEB3] mb-1">
                      Visit Us
                    </p>
                    <p className="text-white/90 leading-relaxed font-body">
                      171 Blaauwberg Road,
                      <br />
                      Table View, Cape Town 7441
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5DEB3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#4a4a4a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5DEB3] mb-1">Call Us</p>
                    <a
                      href="tel:+27123456789"
                      className="text-white/90 hover:text-[#F5DEB3] transition-colors font-body"
                    >
                      +27 12 345 6789
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5DEB3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#4a4a4a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5DEB3] mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:info@betterbeing.co.za"
                      className="text-white/90 hover:text-[#F5DEB3] transition-colors font-body"
                    >
                      info@betterbeing.co.za
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#F5DEB3] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#4a4a4a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#F5DEB3] mb-1">Hours</p>
                    <p className="text-white/90 font-body text-sm">
                      Mon-Fri: 8:00 AM - 6:00 PM
                      <br />
                      Sat-Sun: 9:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="relative border-t border-[#CD853F]/20 bg-[#2a2a2a]/90 backdrop-blur-sm overflow-hidden">
        {/* Subtle dark texture */}
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(205, 133, 63, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(245, 222, 179, 0.1) 0%, transparent 40%)
            `,
          }}
        />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center lg:text-left">
              <p className="text-white/90 font-body text-lg">
                Copyright © Better Being 2024. All rights reserved.
              </p>
              <p className="text-[#F5DEB3] font-semibold mt-1">
                Crafted with ❤️ for Natural Wellness
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-end gap-8">
              {[
                { to: "/terms", label: "Terms & Conditions" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/refund-policy", label: "Refund Policy" },
                { to: "/shipping", label: "Shipping Policy" },
              ].map((item, index) => (
                <div key={item.to} className="flex items-center gap-8">
                  <Link
                    to={item.to}
                    className="text-white/90 hover:text-[#F5DEB3] transition-colors duration-300 font-body"
                  >
                    {item.label}
                  </Link>
                  {index < 3 && (
                    <div className="w-1 h-1 bg-[#F5DEB3]/50 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterPrimary;
export { FooterPrimary };
