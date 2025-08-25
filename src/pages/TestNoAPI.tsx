import React from 'react';

const TestNoAPI = () => {
  return (
    <div className="min-h-screen bg-primary-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary-500">
          CSS WORKS! 🎉
        </h1>
        
        <div className="bg-primary-500 text-white p-6 rounded-lg mb-4">
          <h2 className="text-2xl font-bold">Primary Color Box</h2>
          <p>If you can see this colored box, CSS is working perfectly!</p>
        </div>

        <div className="bg-accent-500 text-black p-6 rounded-lg mb-4">
          <h2 className="text-2xl font-bold">Accent Color Box</h2>
          <p>This proves Tailwind and custom colors work fine.</p>
        </div>

        <div className="bg-success-500 text-white p-6 rounded-lg mb-4">
          <h2 className="text-2xl font-bold">Success Color Box</h2>
          <p>The issue was API calls failing, not CSS!</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
          <h3 className="text-xl font-semibold text-card-foreground mb-2">Card Component</h3>
          <p className="text-muted-foreground">
            Your React app loads fine, but API calls to localhost:3001 are failing.
            The "white page" was React components waiting for data that never arrived.
          </p>
        </div>

        <div className="mt-8 p-4 bg-warning-100 border border-warning-300 rounded-lg">
          <h4 className="font-bold text-warning-800">Next Steps:</h4>
          <ul className="list-disc list-inside text-warning-700 mt-2">
            <li>Start your backend server on localhost:3001</li>
            <li>Or disable API calls temporarily</li>
            <li>Configure CORS properly on the backend</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestNoAPI;