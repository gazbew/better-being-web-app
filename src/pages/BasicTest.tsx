import React from 'react';

const BasicTest = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ff0000',
      padding: '2rem',
      color: '#ffffff'
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#ffffff'
      }}>
        Basic CSS Test
      </h1>
      
      <div style={{
        backgroundColor: '#00ff00',
        padding: '1rem',
        margin: '1rem 0',
        color: '#000000',
        borderRadius: '8px'
      }}>
        This should be a GREEN box with BLACK text if inline styles work
      </div>

      <div style={{
        backgroundColor: '#0000ff',
        padding: '1rem',
        margin: '1rem 0',
        color: '#ffffff',
        borderRadius: '8px'
      }}>
        This should be a BLUE box with WHITE text if inline styles work
      </div>

      <div className="bg-red-500 p-4 text-white rounded">
        This should be a RED box if Tailwind is working
      </div>

      <div className="bg-primary-500 p-4 text-white rounded">
        This should be colored if custom colors work
      </div>
    </div>
  );
};

export default BasicTest;