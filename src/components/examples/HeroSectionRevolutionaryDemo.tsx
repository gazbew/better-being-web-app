import React from "react";
import HeroSectionRevolutionary from "../HeroSectionRevolutionary";

const HeroSectionRevolutionaryDemo = () => {
  return (
    <div className="min-h-screen bg-black">
      <HeroSectionRevolutionary />

      {/* Demo Information Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Revolutionary Hero Section Demo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-purple-400 mb-4">
                🚀 Advanced Features
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Framer Motion scroll animations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  3D transforms and perspective effects
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Dynamic gradient backgrounds
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Interactive particle system
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Advanced micro-interactions
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-pink-400 mb-4">
                🎯 Performance Optimizations
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  120fps animation optimization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  GPU-accelerated transforms
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Reduced motion support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Touch gesture detection
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Adaptive rendering
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gray-800 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              📱 Try It Out
            </h3>
            <p className="text-gray-300 mb-4">
              Move your mouse around the hero section to see the interactive cursor-following effects.
              Scroll to experience the advanced parallax animations and 3D transforms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                🖱️ Hover Effects
              </div>
              <div className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm">
                📜 Scroll Animations
              </div>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                👆 Touch Gestures
              </div>
              <div className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                ⚡ 120fps Performance
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSectionRevolutionaryDemo;