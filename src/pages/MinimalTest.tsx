import React from 'react';

// Completely minimal test - no imports, no external dependencies
const MinimalTest = () => {
  const redBoxStyle = {
    backgroundColor: '#ff0000',
    color: 'white',
    padding: '20px',
    margin: '10px 0',
    fontSize: '18px'
  };

  const greenBoxStyle = {
    backgroundColor: '#00ff00',
    color: 'black',
    padding: '20px',
    margin: '10px 0',
    fontSize: '18px'
  };

  const blueBoxStyle = {
    backgroundColor: '#0000ff',
    color: 'white',
    padding: '20px',
    margin: '10px 0',
    fontSize: '18px'
  };

  const pageStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh'
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ color: '#333', fontSize: '32px' }}>MINIMAL CSS TEST</h1>
      
      <div style={redBoxStyle}>
        🔴 This should be a RED box with WHITE text
      </div>
      
      <div style={greenBoxStyle}>
        🟢 This should be a GREEN box with BLACK text  
      </div>
      
      <div style={blueBoxStyle}>
        🔵 This should be a BLUE box with WHITE text
      </div>
      
      <div style={{
        backgroundColor: '#ff00ff',
        color: 'white',
        padding: '20px',
        margin: '10px 0',
        fontSize: '18px'
      }}>
        🟣 This should be a MAGENTA box with WHITE text
      </div>
      
      <p style={{ color: '#333', fontSize: '16px' }}>
        If you can see colored boxes above, then React and inline styles work.
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        If everything is still white, then there's a fundamental React rendering issue.
      </p>
      
      <div style={{
        backgroundColor: '#ffff00',
        color: 'black',
        padding: '15px',
        margin: '20px 0',
        border: '2px solid #000'
      }}>
        🟡 YELLOW BOX - If you see this, React is working!
      </div>
    </div>
  );
};

export default MinimalTest;