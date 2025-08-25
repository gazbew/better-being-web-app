import React from 'react';

/**
 * Demo component showcasing the brand gradient and shadow utilities
 */
export const BrandUtilitiesDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-gradient-brand text-4xl font-bold text-center mb-8">
          Brand Utilities Demo
        </h1>

        {/* Gradient Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Gradient Utilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hero Gradients */}
            <div className="bg-gradient-hero text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Hero Gradient</h3>
              <p>Perfect for main CTAs and hero sections</p>
            </div>

            <div className="bg-gradient-hero-animated text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Animated Hero</h3>
              <p>Dynamic gradient with movement</p>
            </div>

            <div className="bg-gradient-hero-radial text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Radial Hero</h3>
              <p>Radial gradient variation</p>
            </div>

            {/* Wellness Gradients */}
            <div className="bg-gradient-wellness text-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Wellness Gradient</h3>
              <p>Natural health and wellness theme</p>
            </div>

            <div className="bg-gradient-wellness-breathing text-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Breathing Effect</h3>
              <p>Subtle wellness animation</p>
            </div>

            <div className="bg-gradient-wellness-vertical text-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Vertical Wellness</h3>
              <p>Top-to-bottom gradient</p>
            </div>

            {/* Premium Gradients */}
            <div className="bg-gradient-premium text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Premium Gradient</h3>
              <p>Luxury and premium products</p>
            </div>

            <div className="bg-gradient-premium-gold text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Premium Gold</h3>
              <p>Gold-toned premium effect</p>
            </div>

            <div className="bg-gradient-premium-shimmer text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Premium Shimmer</h3>
              <p>Animated shimmer effect</p>
            </div>
          </div>
        </section>

        {/* Shadow Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Shadow Utilities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wellness Shadows */}
            <div className="shadow-wellness-md bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Wellness Shadow</h3>
              <p className="text-gray-600">Natural, organic feeling shadow</p>
            </div>

            <div className="shadow-wellness-hover bg-white p-6 rounded-lg cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Wellness Hover</h3>
              <p className="text-gray-600">Hover for interactive effect</p>
            </div>

            <div className="shadow-wellness-glow bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Wellness Glow</h3>
              <p className="text-gray-600">Subtle glow effect</p>
            </div>

            {/* Premium Shadows */}
            <div className="shadow-premium-md bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Premium Shadow</h3>
              <p className="text-gray-600">Sophisticated luxury shadow</p>
            </div>

            <div className="shadow-premium-hover bg-white p-6 rounded-lg cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Premium Hover</h3>
              <p className="text-gray-600">Hover for premium effect</p>
            </div>

            <div className="shadow-premium-shimmer bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Premium Shimmer</h3>
              <p className="text-gray-600">Animated shimmer shadow</p>
            </div>

            {/* Floating Shadows */}
            <div className="shadow-floating-md bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Floating Shadow</h3>
              <p className="text-gray-600">Dynamic elevated shadow</p>
            </div>

            <div className="shadow-floating-animated bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Floating Animated</h3>
              <p className="text-gray-600">Continuous floating effect</p>
            </div>

            <div className="shadow-card bg-white p-6 rounded-lg cursor-pointer">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Card Shadow</h3>
              <p className="text-gray-600">Perfect for product cards</p>
            </div>
          </div>
        </section>

        {/* Combined Effects */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Combined Effects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-hero shadow-hero text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Hero + Shadow</h3>
              <p className="mb-4">Perfect combination for main call-to-action sections</p>
              <button className="btn-gradient-wellness px-6 py-3 rounded-lg text-gray-800 font-semibold">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-wellness shadow-wellness-lg text-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Wellness + Shadow</h3>
              <p className="mb-4">Ideal for health and wellness content sections</p>
              <button className="btn-gradient-premium px-6 py-3 rounded-lg text-white font-semibold">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Text Gradients */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Text Gradients</h2>
          
          <div className="text-center space-y-4">
            <h3 className="text-gradient-brand text-3xl font-bold">
              Brand Gradient Text
            </h3>
            <h3 className="text-gradient-premium text-3xl font-bold">
              Premium Gradient Text
            </h3>
            <h3 className="text-gradient-wellness text-3xl font-bold">
              Wellness Gradient Text
            </h3>
          </div>
        </section>

        {/* Button Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Button Examples</h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-gradient-hero px-6 py-3 rounded-lg font-semibold">
              Hero Button
            </button>
            <button className="btn-gradient-wellness px-6 py-3 rounded-lg font-semibold">
              Wellness Button
            </button>
            <button className="btn-gradient-premium px-6 py-3 rounded-lg font-semibold">
              Premium Button
            </button>
            <button className="shadow-btn-primary bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
              Primary Shadow
            </button>
          </div>
        </section>

        {/* Responsive Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Responsive Examples</h2>
          
          <div className="space-y-4">
            <div className="bg-gradient-hero-responsive shadow-hero-responsive text-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Responsive Hero</h3>
              <p>Adapts gradient direction based on screen size</p>
            </div>
            
            <div className="bg-gradient-wellness-responsive shadow-card-responsive text-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Responsive Wellness</h3>
              <p>Optimized for different viewport sizes</p>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-white p-8 rounded-xl shadow-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Usage Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-700">Gradient Classes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.bg-gradient-hero</code> - Main hero sections</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.bg-gradient-wellness</code> - Health content</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.bg-gradient-premium</code> - Premium products</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.text-gradient-brand</code> - Brand text</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-orange-700">Shadow Classes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.shadow-wellness-md</code> - Natural shadows</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.shadow-premium-lg</code> - Luxury shadows</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.shadow-floating-md</code> - Elevated shadows</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.shadow-card</code> - Product cards</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandUtilitiesDemo;