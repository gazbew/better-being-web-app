export const ColorTest = () => {
  // Do not render in production
  if (import.meta.env.MODE !== 'development') return null;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl mb-8">COLOR TEST (Brand)</h1>
      
      {/* Direct HSL brand colors without CSS variables */}
      <div style={{ backgroundColor: 'hsl(22, 100%, 37%)', color: 'white', padding: '20px', margin: '10px' }}>
        DIRECT MAHOGANY - Primary (#BB4500)
      </div>
      
      <div style={{ backgroundColor: 'hsl(59, 53%, 51%)', color: 'black', padding: '20px', margin: '10px' }}>
        DIRECT CITRON - Accent (#C4C240)
      </div>
      
      <div style={{ backgroundColor: 'hsl(227, 9%, 42%)', color: 'white', padding: '20px', margin: '10px' }}>
        DIRECT PAYNE GRAY - Secondary (#626675)
      </div>
      
      {/* Using CSS variables (Tailwind tokens) */}
      <div className="bg-primary text-white p-5 m-2">
        CSS VARIABLE PRIMARY - bg-primary (Mahogany)
      </div>
      
      <div className="bg-accent text-neutral-900 p-5 m-2">
        CSS VARIABLE ACCENT - bg-accent (Citron)
      </div>
      
      <div className="bg-secondary text-white p-5 m-2">
        CSS VARIABLE SECONDARY - bg-secondary (Payne Gray)
      </div>
    </div>
  );
};
