// Test page with no router dependencies
const TestClean = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Clean Test Page</h1>
      <p className="mb-4">This page has no router dependencies whatsoever.</p>
      <button 
        onClick={() => console.log('Button clicked')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Button
      </button>
    </div>
  );
};

export default TestClean;