import React from "react";
import HeroSectionEnhanced from "../HeroSectionEnhanced";

/**
 * Hero Section Demo Component
 * 
 * This demonstrates the implementation of the brilliant hero section with:
 * - Impactful Headlines with dynamic text rotation
 * - Engaging Visuals with parallax effects
 * - Strong CTAs with micro-interactions
 * - Dynamic Backgrounds with cursor following
 * - Trust Elements with animated counters
 * - Particle animations and floating elements
 * - Scroll-triggered transformations
 * - Responsive design across all devices
 * 
 * Features Implemented:
 * ✅ Dynamic gradient backgrounds that respond to mouse movement
 * ✅ Animated particle system with floating sparkles
 * ✅ Parallax scrolling effects on background elements
 * ✅ Rotating slogans with smooth transitions
 * ✅ Micro-interactions on all interactive elements
 * ✅ Hover effects with scale, glow, and rotation
 * ✅ Cursor-based animations that follow mouse movement
 * ✅ Scroll-triggered animations with Intersection Observer
 * ✅ Performance optimized with requestAnimationFrame
 * ✅ Accessibility compliant with reduced motion support
 * ✅ Mobile-first responsive design
 * ✅ Trust elements with social proof
 * ✅ Strong call-to-action buttons
 * ✅ Professional floating cards and badges
 * 
 * Slogans Used:
 * - "Better Being, Brighter Living."
 * - "Wellness Beyond the Everyday."
 * - "Nourish the Body, Elevate the Soul."
 * - "Transform Your Life Naturally."
 */

const HeroSectionDemo = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section Implementation */}
      <HeroSectionEnhanced />
      
      {/* Demo Information Panel */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#7a4d3b] mb-8 text-center">
            Hero Section Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Dynamic Effects */}
            <div className="bg-[#f7f3eb] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Dynamic Effects</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• Cursor-following gradients</li>
                <li>• Animated particle system</li>
                <li>• Parallax scrolling</li>
                <li>• Rotating text slogans</li>
                <li>• Floating elements</li>
              </ul>
            </div>
            
            {/* Micro-Interactions */}
            <div className="bg-[#f0e9d2] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Micro-Interactions</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• Hover scale effects</li>
                <li>• Button animations</li>
                <li>• Icon rotations</li>
                <li>• Glow effects</li>
                <li>• Smooth transitions</li>
              </ul>
            </div>
            
            {/* Performance */}
            <div className="bg-[#e8dcc0] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Performance</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• GPU acceleration</li>
                <li>• Throttled animations</li>
                <li>• Intersection Observer</li>
                <li>• Reduced motion support</li>
                <li>• Optimized rendering</li>
              </ul>
            </div>
            
            {/* Trust Elements */}
            <div className="bg-[#d4b8a1] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Trust Elements</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• Customer count (10K+)</li>
                <li>• Star ratings (4.9★)</li>
                <li>• Awards won (15+)</li>
                <li>• Certifications</li>
                <li>• Social proof</li>
              </ul>
            </div>
            
            {/* Visual Design */}
            <div className="bg-[#e5c287] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Visual Design</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• Brand-compliant colors</li>
                <li>• Gradient backgrounds</li>
                <li>• Glassmorphism effects</li>
                <li>• Professional imagery</li>
                <li>• Consistent spacing</li>
              </ul>
            </div>
            
            {/* Accessibility */}
            <div className="bg-[#f5d199] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#7a4d3b] mb-4">Accessibility</h3>
              <ul className="space-y-2 text-[#7a4d3b]/80">
                <li>• WCAG compliant</li>
                <li>• Keyboard navigation</li>
                <li>• Screen reader support</li>
                <li>• High contrast ratios</li>
                <li>• Touch-friendly targets</li>
              </ul>
            </div>
          </div>
          
          {/* Implementation Notes */}
          <div className="mt-12 bg-[#7a4d3b] rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Implementation Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-[#e5c287]">Technical Stack</h4>
                <ul className="space-y-1 text-white/90">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Lucide React for icons</li>
                  <li>• Custom CSS animations</li>
                  <li>• Intersection Observer API</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-[#e5c287]">Best Practices</h4>
                <ul className="space-y-1 text-white/90">
                  <li>• Mobile-first responsive design</li>
                  <li>• Performance optimized animations</li>
                  <li>• Semantic HTML structure</li>
                  <li>• Accessible color contrasts</li>
                  <li>• SEO-friendly implementation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionDemo;