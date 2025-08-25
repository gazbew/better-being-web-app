import React from 'react';

const ColorTest = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Color System Test</h1>
        
        {/* Test primary colors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary-500">Primary Colors</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-primary-50 p-4 rounded text-center">50</div>
            <div className="bg-primary-100 p-4 rounded text-center">100</div>
            <div className="bg-primary-200 p-4 rounded text-center">200</div>
            <div className="bg-primary-500 p-4 rounded text-center text-white">500</div>
            <div className="bg-primary-600 p-4 rounded text-center text-white">600</div>
          </div>
        </div>

        {/* Test accent colors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-accent-500">Accent Colors</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-accent-50 p-4 rounded text-center">50</div>
            <div className="bg-accent-100 p-4 rounded text-center">100</div>
            <div className="bg-accent-200 p-4 rounded text-center">200</div>
            <div className="bg-accent-500 p-4 rounded text-center text-white">500</div>
            <div className="bg-accent-600 p-4 rounded text-center text-white">600</div>
          </div>
        </div>

        {/* Test success colors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-success-500">Success Colors</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-success-50 p-4 rounded text-center">50</div>
            <div className="bg-success-100 p-4 rounded text-center">100</div>
            <div className="bg-success-200 p-4 rounded text-center">200</div>
            <div className="bg-success-500 p-4 rounded text-center text-white">500</div>
            <div className="bg-success-600 p-4 rounded text-center text-white">600</div>
          </div>
        </div>

        {/* Test warning colors */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-warning-500">Warning Colors</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-warning-50 p-4 rounded text-center">50</div>
            <div className="bg-warning-100 p-4 rounded text-center">100</div>
            <div className="bg-warning-200 p-4 rounded text-center">200</div>
            <div className="bg-warning-500 p-4 rounded text-center text-white">500</div>
            <div className="bg-warning-600 p-4 rounded text-center text-white">600</div>
          </div>
        </div>

        {/* Test card with shadows */}
        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">Card Component</h3>
          <p className="text-muted-foreground">This card should have proper styling with shadows and borders.</p>
        </div>
      </div>
    </div>
  );
};

export default ColorTest;