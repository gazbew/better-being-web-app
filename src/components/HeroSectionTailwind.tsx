import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Heart, Shield } from 'lucide-react';

export const HeroSectionTailwind = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              100% Natural & Organic
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Better
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Being
              </span>
              Starts Here
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Discover premium wellness products crafted with nature's finest ingredients. 
              Transform your health journey with our scientifically-backed supplements and 
              natural remedies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg group" onClick={() => window.location.href = '/products'}>
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                FDA Registered
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                10,000+ Happy Customers
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Eco-Friendly
              </div>
            </div>
          </div>
          
          {/* Right Column - Product Image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl p-8">
              <img
                src="/all_prouct_shots-1.webp"
                alt="Better Being Products"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-green-600">25+</div>
                <div className="text-sm text-gray-600">Premium Products</div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-emerald-600">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionTailwind;