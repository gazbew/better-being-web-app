import React, { useState } from 'react';

/**
 * Demo component showcasing the brand animation system
 */
export const BrandAnimationsDemo: React.FC = () => {
  const [triggerAnimation, setTriggerAnimation] = useState<string | null>(null);

  const handleTriggerAnimation = (animationType: string) => {
    setTriggerAnimation(animationType);
    setTimeout(() => setTriggerAnimation(null), 1000);
  };

  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-gradient-brand text-4xl font-bold text-center mb-8 animate-fade-in-down">
          Brand Animation System Demo
        </h1>

        {/* Float Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-fade-in-left">Float Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-wellness-md animate-float">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Standard Float</h3>
              <p className="text-gray-600">Gentle floating motion for wellness elements</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-wellness-md animate-float-gentle">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Gentle Float</h3>
              <p className="text-gray-600">Subtle floating with reduced movement</p>
            </div>

            <div className="bg-gradient-premium text-white p-6 rounded-lg animate-float-premium">
              <h3 className="text-xl font-semibold mb-2">Premium Float</h3>
              <p>Enhanced floating with scale effect</p>
            </div>
          </div>
        </section>

        {/* Glow Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-fade-in-right">Glow Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg animate-glow">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Brand Glow</h3>
              <p className="text-gray-600">Orange brand glow effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg animate-glow-wellness">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Wellness Glow</h3>
              <p className="text-gray-600">Green wellness glow effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg animate-glow-premium">
              <h3 className="text-xl font-semibold mb-2 text-orange-700">Premium Glow</h3>
              <p className="text-gray-600">Multi-layered premium glow</p>
            </div>
          </div>
        </section>

        {/* Bounce Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-scale-in">Bounce Animations</h2>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold animate-bounce-gentle"
              onClick={() => handleTriggerAnimation('bounce-gentle')}
            >
              Gentle Bounce
            </button>
            
            <button 
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold animate-bounce-wellness"
              onClick={() => handleTriggerAnimation('bounce-wellness')}
            >
              Wellness Bounce
            </button>
            
            <button 
              className="bg-gradient-premium text-white px-6 py-3 rounded-lg font-semibold animate-bounce-premium"
              onClick={() => handleTriggerAnimation('bounce-premium')}
            >
              Premium Bounce
            </button>
          </div>
        </section>

        {/* Fade In Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Fade In Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-floating-sm animate-fade-in animate-delay-100">
              <h4 className="font-semibold text-gray-800">Fade In</h4>
              <p className="text-sm text-gray-600">Basic fade in</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-floating-sm animate-fade-in-up animate-delay-200">
              <h4 className="font-semibold text-gray-800">Fade In Up</h4>
              <p className="text-sm text-gray-600">Fade with upward motion</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-floating-sm animate-fade-in-left animate-delay-300">
              <h4 className="font-semibold text-gray-800">Fade In Left</h4>
              <p className="text-sm text-gray-600">Fade from left side</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-floating-sm animate-fade-in-right animate-delay-400">
              <h4 className="font-semibold text-gray-800">Fade In Right</h4>
              <p className="text-sm text-gray-600">Fade from right side</p>
            </div>
          </div>
        </section>

        {/* Scale In Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Scale In Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-card animate-scale-in animate-delay-100">
              <h4 className="font-semibold text-gray-800">Scale In</h4>
              <p className="text-sm text-gray-600">Basic scale animation</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-card animate-scale-in-center animate-delay-200">
              <h4 className="font-semibold text-gray-800">Scale Center</h4>
              <p className="text-sm text-gray-600">Center-focused scale</p>
            </div>
            
            <div className="bg-gradient-wellness text-gray-800 p-4 rounded-lg animate-scale-in-wellness animate-delay-300">
              <h4 className="font-semibold">Wellness Scale</h4>
              <p className="text-sm">Wellness-themed scale</p>
            </div>
            
            <div className="bg-gradient-premium text-white p-4 rounded-lg animate-scale-in-premium animate-delay-400">
              <h4 className="font-semibold">Premium Scale</h4>
              <p className="text-sm">Premium scale with rotation</p>
            </div>
          </div>
        </section>

        {/* Brand-Specific Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Brand-Specific Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-wellness text-gray-800 p-6 rounded-lg animate-wellness-breathe">
              <h3 className="text-lg font-semibold mb-2">Wellness Breathe</h3>
              <p className="text-sm">Breathing animation for wellness content</p>
            </div>

            <div className="bg-gradient-premium text-white p-6 rounded-lg animate-premium-shimmer">
              <h3 className="text-lg font-semibold mb-2">Premium Shimmer</h3>
              <p className="text-sm">Shimmer effect for premium elements</p>
            </div>

            <div className="bg-white p-6 rounded-lg animate-brand-pulse">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Brand Pulse</h3>
              <p className="text-sm text-gray-600">Pulsing effect with brand colors</p>
            </div>

            <div className="bg-white p-6 rounded-lg animate-wellness-wave">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Wellness Wave</h3>
              <p className="text-sm text-gray-600">Gentle wave motion</p>
            </div>
          </div>
        </section>

        {/* Hover Animations */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Hover Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-wellness-md hover-float cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Hover Float</h3>
              <p className="text-sm text-gray-600">Hover to see float effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-wellness-md hover-glow cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Hover Glow</h3>
              <p className="text-sm text-gray-600">Hover to see glow effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-wellness-md hover-bounce cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-green-700">Hover Bounce</h3>
              <p className="text-sm text-gray-600">Hover to see bounce effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card hover-scale cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Hover Scale</h3>
              <p className="text-sm text-gray-600">Hover to see scale effect</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card hover-lift cursor-pointer">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Hover Lift</h3>
              <p className="text-sm text-gray-600">Hover to see lift effect</p>
            </div>

            <div className="bg-gradient-wellness text-gray-800 p-6 rounded-lg hover-wellness cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Hover Wellness</h3>
              <p className="text-sm">Combined wellness hover effect</p>
            </div>
          </div>
        </section>

        {/* Interactive Triggers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Interactive Animation Triggers</h2>
          
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold focus-pulse"
              onClick={() => handleTriggerAnimation('pulse')}
            >
              Focus Pulse (Tab to focus)
            </button>
            
            <button 
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold focus-glow"
              onClick={() => handleTriggerAnimation('glow')}
            >
              Focus Glow (Tab to focus)
            </button>
            
            <button 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold active-bounce"
              onClick={() => handleTriggerAnimation('bounce')}
            >
              Active Bounce (Click and hold)
            </button>
            
            <button 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold active-scale"
              onClick={() => handleTriggerAnimation('scale')}
            >
              Active Scale (Click and hold)
            </button>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Loading State Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg loading-pulse">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Loading Pulse</h3>
              <p className="text-sm text-gray-600">Pulsing loading indicator</p>
            </div>

            <div className="bg-gradient-wellness text-gray-800 p-6 rounded-lg loading-breathe">
              <h3 className="text-lg font-semibold mb-2">Loading Breathe</h3>
              <p className="text-sm">Breathing loading animation</p>
            </div>

            <div className="loading-shimmer p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Loading Shimmer</h3>
              <p className="text-sm">Shimmer loading effect</p>
            </div>
          </div>
        </section>

        {/* Animation Timing Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Animation Timing Examples</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <div className="bg-white p-4 rounded shadow-card animate-fade-in animate-duration-instant animate-delay-100">
                <span className="text-sm font-medium">Instant (100ms)</span>
              </div>
              <div className="bg-white p-4 rounded shadow-card animate-fade-in animate-duration-quick animate-delay-200">
                <span className="text-sm font-medium">Quick (200ms)</span>
              </div>
              <div className="bg-white p-4 rounded shadow-card animate-fade-in animate-duration-smooth animate-delay-300">
                <span className="text-sm font-medium">Smooth (300ms)</span>
              </div>
              <div className="bg-white p-4 rounded shadow-card animate-fade-in animate-duration-gentle animate-delay-400">
                <span className="text-sm font-medium">Gentle (500ms)</span>
              </div>
              <div className="bg-white p-4 rounded shadow-card animate-fade-in animate-duration-slow animate-delay-500">
                <span className="text-sm font-medium">Slow (700ms)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="bg-white p-8 rounded-xl shadow-card">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Animation Usage Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-700">Float Animations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-float</code> - Standard floating motion</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-float-gentle</code> - Subtle floating</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-float-premium</code> - Enhanced premium floating</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-4 mt-6 text-orange-700">Glow Animations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-glow</code> - Brand orange glow</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-glow-wellness</code> - Green wellness glow</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-glow-premium</code> - Multi-layer premium glow</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-700">Entrance Animations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-fade-in-*</code> - Fade in variations</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-scale-in-*</code> - Scale in variations</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.animate-slide-in-*</code> - Slide in variations</li>
              </ul>
              
              <h3 className="text-lg font-semibold mb-4 mt-6 text-blue-700">Interaction States</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">.hover-*</code> - Hover state animations</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.focus-*</code> - Focus state animations</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">.active-*</code> - Active state animations</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Accessibility Note</h4>
            <p className="text-sm text-yellow-700">
              All animations respect the <code>prefers-reduced-motion</code> setting. 
              Users who prefer reduced motion will see instant transitions or no animations at all.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandAnimationsDemo;