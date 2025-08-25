import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Star,
  Users,
  Award,
  Sparkles,
  Heart,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slogans = [
    "Better Being, Brighter Living.",
    "Wellness Beyond the Everyday.",
    "Nourish the Body, Elevate the Soul.",
    "Better Being, Brighter Living.",
  ];

  const trustElements = [
    { icon: Users, text: "10,000+ Happy Customers", number: "10K+" },
    { icon: Star, text: "4.9/5 Star Rating", number: "4.9★" },
    { icon: Award, text: "Award-Winning Products", number: "15+" },
  ];

  // Mouse tracking for cursor effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () => heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Rotating slogans
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  // Auto-play video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if autoplay fails
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f3eb] via-[#f0e9d2] to-[#e8dcc0]"
    >
      {/* Dynamic Gradient Background with Motion */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(229, 194, 135, 0.4) 0%, 
              transparent 50%),
            conic-gradient(from 45deg at 20% 30%, 
              #f5d199 0deg, 
              transparent 90deg, 
              #e8c79a 180deg, 
              transparent 270deg),
            linear-gradient(135deg, 
              rgba(245, 209, 153, 0.3) 0%, 
              rgba(232, 199, 154, 0.2) 50%, 
              rgba(212, 180, 115, 0.3) 100%)
          `,
          transition: "background 0.3s ease",
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles
              className="w-4 h-4 text-[#d4a673]"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Background Video/Animation */}
      <div className="absolute inset-0 opacity-30">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwOCAzMWU5ZjM3IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAA3//728P4FNjuZQQAAAu5tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAZAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAACGHRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAgAAAAIAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAGQAAAAAAAEAAAAAAZBtZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAIAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAE7bWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAA+3N0YmwAAACXc3RzZAAAAAAAAAABAAAAh2F2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAgACAABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMWF2Y0MBZAAf/+EAGGdkAB+s2UGwloQAAAMABAAAAwBkDxgxlgEABmjr48siwAAAABhzdHRzAAAAAAAAAAEAAAABAAAACAAAAAQAAAAUc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUAAAAFHN0Y28AAAAAAAAAAQAAADAAAABidWR0YQAAAFptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAAC1pbHN0AAAAJal9dG9vAAAAHWRhdGEAAAABAAAAAExhdmY1OC43Ni4xMDA="
            type="video/mp4"
          />
        </video>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div
              className={`space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Animated Badge */}
              <div
                className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-soft animate-gentle-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                <Heart className="w-5 h-5 text-[#d4a673] animate-pulse" />
                <span className="text-[#7a4d3b] font-semibold text-sm uppercase tracking-wider">
                  Natural Wellness Solutions
                </span>
                <Sparkles className="w-4 h-4 text-[#e5c287] animate-spin-slow" />
              </div>

              {/* Dynamic Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#7a4d3b] leading-tight font-heading">
                  <span
                    className="block animate-slide-up"
                    style={{ animationDelay: "0.4s" }}
                  >
                    Transform Your
                  </span>
                  <span
                    className="block text-gradient bg-gradient-to-r from-[#d4a673] to-[#e5c287] bg-clip-text text-transparent animate-slide-up"
                    style={{ animationDelay: "0.6s" }}
                  >
                    Wellness Journey
                  </span>
                </h1>

                {/* Rotating Slogans */}
                <div className="h-16 overflow-hidden">
                  <p
                    key={currentSlogan}
                    className="text-2xl md:text-3xl text-[#7a4d3b]/80 font-medium animate-fade-slide-up"
                  >
                    {slogans[currentSlogan]}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className="text-xl text-[#7a4d3b]/70 leading-relaxed max-w-lg animate-fade-up"
                style={{ animationDelay: "0.8s" }}
              >
                Discover our curated collection of natural products designed to
                elevate your mind, body, and spirit. Experience wellness that
                goes beyond the ordinary.
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-up"
                style={{ animationDelay: "1s" }}
              >
                <Button
                  asChild
                  className="group bg-[#7a4d3b] hover:bg-[#5c3a2d] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  <Link to="/products">
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="group border-2 border-[#7a4d3b] text-[#7a4d3b] hover:bg-[#7a4d3b] hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Watch Story
                </Button>
              </div>

              {/* Trust Elements */}
              <div
                className="flex flex-wrap gap-8 pt-8 animate-fade-up"
                style={{ animationDelay: "1.2s" }}
              >
                {trustElements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-warm transition-all duration-300 group-hover:scale-110">
                      <item.icon className="w-6 h-6 text-[#d4a673] group-hover:animate-pulse" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#7a4d3b] group-hover:text-[#d4a673] transition-colors">
                        {item.number}
                      </div>
                      <div className="text-sm text-[#7a4d3b]/60 font-medium">
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div
              className={`relative transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              {/* Main Hero Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a673]/20 to-[#e5c287]/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-glow transform group-hover:scale-105 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Natural wellness products"
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#e5c287] rounded-full flex items-center justify-center shadow-warm animate-gentle-bounce">
                    <Leaf className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft animate-gentle-float">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#7a4d3b]">100%</div>
                      <div className="text-xs text-[#7a4d3b]/60">Natural</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-8 -left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft animate-gentle-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#d4a673] rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#7a4d3b]">4.9★</div>
                    <div className="text-xs text-[#7a4d3b]/60">Rating</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-8 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-soft animate-gentle-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e5c287] rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[#7a4d3b]">10K+</div>
                    <div className="text-xs text-[#7a4d3b]/60">Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#7a4d3b]/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#7a4d3b]/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;