import React from 'react';

const WorkingTest = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          🎉 BETTER BEING CSS WORKS! 
        </h1>
        
        <div className="bg-primary text-primary-foreground p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Primary Color (Deep Forest Green)</h2>
          <p>This is the Better Being primary brand color - deep forest green that represents premium, trustworthy, natural wellness.</p>
        </div>

        <div className="bg-secondary text-secondary-foreground p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Secondary Color (Warm Earth Tones)</h2>
          <p>Warm, natural earth tones that complement the forest green.</p>
        </div>

        <div className="bg-accent text-accent-foreground p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Accent Color (Golden Premium)</h2>
          <p>Golden accent color that represents premium healing and energy.</p>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg shadow-wellness border border-border mb-6">
          <h3 className="text-xl font-semibold mb-4">Card Component with Wellness Shadow</h3>
          <p className="text-muted-foreground mb-4">
            This card uses the custom wellness shadow and proper border styling. 
            The text uses proper contrast with muted foreground for secondary text.
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors">
              Primary Button
            </button>
            <button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-md transition-colors">
              Secondary Button  
            </button>
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-md transition-colors">
              Accent Button
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-wellness p-6 rounded-lg">
            <h4 className="font-bold text-foreground mb-2">Wellness Gradient</h4>
            <p className="text-muted-foreground text-sm">Custom wellness gradient background</p>
          </div>
          
          <div className="bg-gradient-hero p-6 rounded-lg">
            <h4 className="font-bold text-white mb-2">Hero Gradient</h4>
            <p className="text-white/80 text-sm">Custom hero gradient for main sections</p>
          </div>
          
          <div className="bg-gradient-premium p-6 rounded-lg border border-accent/20">
            <h4 className="font-bold text-foreground mb-2">Premium Gradient</h4>
            <p className="text-muted-foreground text-sm">Subtle premium radial gradient</p>
          </div>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-bold text-foreground mb-4">✅ Success! Better Being Design System Working</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✅ Deep forest green primary colors</li>
            <li>✅ Golden premium accent colors</li>
            <li>✅ Warm earth tone secondary colors</li>
            <li>✅ Custom wellness shadows and gradients</li>
            <li>✅ Proper typography and spacing</li>
            <li>✅ Responsive grid layouts</li>
            <li>✅ Professional color contrast</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkingTest;