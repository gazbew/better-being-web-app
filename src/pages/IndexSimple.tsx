import React from 'react';

const IndexSimple = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-xl mb-8">
            <h1 className="text-6xl font-bold text-white mb-6">
              Better Being
            </h1>
            <p className="text-2xl text-green-100 mb-8">
              Your Wellness Journey Starts Here
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-green-600 mb-4">
              Welcome to Our Platform
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              This is a simple test page to verify that CSS and styling are working correctly. 
              If you can see styled text, gradients, shadows, and colors, then the styling system is functioning properly.
            </p>
            <div className="mt-8 space-y-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-green-800 font-medium">✅ CSS is working if you see this styled green box</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">✅ Tailwind classes are working if you see this styled blue box</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-purple-800 font-medium">✅ Gradients and shadows are working if this looks styled</p>
              </div>
            </div>
            <div className="mt-8 space-x-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Primary Button
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexSimple;