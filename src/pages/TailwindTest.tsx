import React from 'react';

const TailwindTest = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333', fontSize: '32px', marginBottom: '20px' }}>TAILWIND TEST</h1>
      
      <div className="bg-red-500 text-white p-4 mb-4">
        🔴 Tailwind red-500 class
      </div>
      
      <div className="bg-green-500 text-white p-4 mb-4">
        🟢 Tailwind green-500 class
      </div>
      
      <div className="bg-blue-500 text-white p-4 mb-4">
        🔵 Tailwind blue-500 class  
      </div>
      
      <div className="test-red mb-4">
        🟥 Custom test-red class
      </div>
      
      <div className="test-green mb-4">
        🟩 Custom test-green class
      </div>
      
      <div style={{
        backgroundColor: '#ff00ff',
        color: 'white',
        padding: '16px',
        margin: '16px 0'
      }}>
        🟣 Inline style (control)
      </div>
      
      <p style={{ color: '#333' }}>
        If you see colored Tailwind boxes, Tailwind is working!
      </p>
    </div>
  );
};

export default TailwindTest;