import React, { useState, useEffect, useRef, useCallback } from "react";
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
  CheckCircle,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MousePosition {
  x: number;
  y: number;
}

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const HeroSectionEnhanced = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 50, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>();

  const slogans = [
    "Better Being, Brighter Living.",
    "Wellness Beyond the Everyday.",
    "Nourish the Body, Elevate the Soul.",
    "Transform Your Life Naturally.",
  ];

  const trustElements = [
    { 
      icon: Users, 
      text: "Happy Customers", 
      number: "10,000+",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    { 
      icon: Star, 
      text: "Average Rating", 
      number: "4.9★",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    { 
      icon: Award, 
      text: "Awards Won", 
      number: "15+",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
  ];

  const features = [
    { icon: CheckCircle, text: "100% Natural Ingredients" },
    { icon: Shield, text: "Lab Tested & Certified" },
    { icon: TrendingUp, text: "Proven Results" },
  ];

  // Initialize particles
  useEffect(() => {
    const newParticles: ParticleProps[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y <= -5 ? 105 : particle.y - particle.speed,
        x: particle.x + Math.sin(Date.now() * 0.001 + particle.id) * 0.1,
      })));
      animationRef.current = requestAnimationFrame(animateParticles);
    };

    animationRef.current = requestAnimationFrame(animateParticles);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Mouse tracking with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleMouseMove(e), 16); // ~60fps
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", throttledMouseMove);
      return () => {
        heroElement.removeEventListener("mousemove", throttledMouseMove);
        clearTimeout(timeoutId);
      };
    }
  }, [handleMouseMove]);

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
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

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f3eb] via-[#f0e9d2] to-[#e8dcc0]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Gradient Background with Cursor Following */}
      <div
        className="absolute inset-0 opacity-60 transition-all duration-500"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(229, 194, 135, ${isHovered ? 0.6 : 0.4}) 0%, 
              transparent 50%),
            conic-gradient(from ${scrollY * 0.1}deg at 20% 30%, 
              #f5d199 0deg, 
              transparent 90deg, 
              #e8c79a 180deg, 
              transparent 270deg),
            linear-gradient(135deg, 
              rgba(245, 209, 153, 0.3) 0%, 
              rgba(232, 199, 154, 0.2) 50%, 
              rgba(212, 180, 115, 0.3) 100%)
          `,
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute transition-all duration-100 ease-linear"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              transform: `scale(${particle.size / 4})`,
            }}
          >
            <Sparkles className="w-4 h-4 text-[#d4a673] animate-spin-slow" />
          </div>
        ))}
      </div>

      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#e5c287] rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#d4a673] rounded-full blur-3xl animate-gentle-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#f5d199] rounded-full blur-2xl animate-gentle-float" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-soft hover:shadow-warm transition-all duration-300 cursor-pointer group">
                <Heart className="w-5 h-5 text-[#d4a673] animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-[#7a4d3b] font-semibold text-sm uppercase tracking-wider">
                  Natural Wellness Solutions
                </span>
                <Sparkles className="w-4 h-4 text-[#e5c287] animate-spin-slow group-hover:animate-spin transition-all" />
              </div>

              {/* Dynamic Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#7a4d3b] leading-tight font-heading">
                  <span className="block animate-slide-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                    Transform Your
                  </span>
                  <span className="block text-gradient bg-gradient-to-r from-[#d4a673] to-[#e5c287] bg-clip-text text-transparent animate-slide-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                    Wellness Journey
                  </span>
                </h1>

                {/* Rotating Slogans with Smooth Transition */}
                <div className="h-16 overflow-hidden relative">
                  <div
                    className="absolute inset-0 flex flex-col transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateY(-${currentSlogan * 100}%)` }}
                  >
                    {slogans.map((slogan, index) => (
                      <p key={index} className="text-2xl md:text-3xl text-[#7a4d3b]/80 font-medium h-16 flex items-center">
                        {slogan}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xl text-[#7a4d3b]/70 leading-relaxed max-w-lg animate-fade-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                Discover our curated collection of natural products designed to
                elevate your mind, body, and spirit. Experience wellness that
                goes beyond the ordinary.
              </p>

              {/* Feature List */}
              <div className="space-y-3 animate-fade-up opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <feature.icon className="w-5 h-5 text-[#d4a673] group-hover:scale-110 transition-transform" />
                    <span className="text-[#7a4d3b]/80 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
                <Button
                  asChild
                  className="group bg-[#7a4d3b] hover:bg-[#5c3a2d] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-warm hover:shadow-glow transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <Link to="/products">
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Shop Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="group border-2 border-[#7a4d3b] text-[#7a4d3b] hover:bg-[#7a4d3b] hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Watch Story
                </Button>
              </div>

              {/* Trust Elements with Enhanced Animations */}
              <div className="flex flex-wrap gap-6 pt-8 animate-fade-up opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                {trustElements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 group cursor-pointer transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${1.4 + index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-warm transition-all duration-300 group-hover:rotate-3`}>
                      <item.icon className={`w-6 h-6 ${item.color} group-hover:animate-pulse`} />
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

            {/* Right Visual - Enhanced */}
            <div className={`relative transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`} style={{ animationDelay: "0.4s" }}>
              
              {/* Main Hero Image Container */}
              <div className="relative group cursor-pointer">
                
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#d4a673]/20 to-[#e5c287]/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-all duration-500 group-hover:scale-105"></div>
                
                {/* Main Image Card */}
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-glow transform group-hover:scale-105 transition-all duration-500 overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(229, 194, 135, 0.8), transparent 70%)`
                    }}
                  />
                  
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Natural wellness products"
                    className="w-full h-96 object-cover rounded-2xl relative z-10 group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Badge - Top Right */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#e5c287] to-[#d4a673] rounded-full flex items-center justify-center shadow-warm animate-gentle-bounce hover:animate-spin-slow transition-all duration-300 cursor-pointer group/badge">
                    <Leaf className="w-8 h-8 text-white animate-pulse group-hover/badge:scale-110 transition-transform" />
                  </div>
                  
                  {/* Floating Badge - Bottom Left */}
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft animate-gentle-float hover:shadow-warm transition-all duration-300 cursor-pointer group/natural">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#7a4d3b] group-hover/natural:text-[#d4a673] transition-colors">100%</div>
                      <div className="text-xs text-[#7a4d3b]/60">Natural</div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute top-8 -left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft animate-gentle-float hover:shadow-warm transition-all duration-300 cursor-pointer group/rating">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center group-hover/rating:rotate-12 transition-transform">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[#7a4d3b] group-hover/rating:text-yellow-600 transition-colors">4.9★</div>
                      <div className="text-xs text-[#7a4d3b]/60">Rating</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 -right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-soft animate-gentle-float hover:shadow-warm transition-all duration-300 cursor-pointer group/customers" style={{ animationDelay: "1s" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center group-hover/customers:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[#7a4d3b] group-hover/customers:text-blue-600 transition-colors">10K+</div>
                      <div className="text-xs text-[#7a4d3b]/60">Customers</div>
                    </div>
                  </div>
                </div>

                {/* Additional Floating Element */}
                <div className="absolute top-1/2 -right-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full p-3 shadow-warm animate-gentle-bounce cursor-pointer hover:animate-spin-slow transition-all duration-300" style={{ animationDelay: "2s" }}>
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator with Enhanced Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
        <div className="w-6 h-10 border-2 border-[#7a4d3b]/30 rounded-full flex justify-center group-hover:border-[#7a4d3b]/60 transition-colors">
          <div className="w-1 h-3 bg-[#7a4d3b]/50 rounded-full mt-2 animate-pulse group-hover:bg-[#7a4d3b] transition-colors"></div>
        </div>
        <div className="text-xs text-[#7a4d3b]/60 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Scroll to explore
        </div>
      </div>

      {/* Performance Optimization: Preload critical images */}
      <link rel="preload" as="image" href="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
    </section>
  );
};

export default HeroSectionEnhanced;