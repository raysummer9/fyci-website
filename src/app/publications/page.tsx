export default function PublicationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our research reports, policy briefs, and other publications that drive our mission forward.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for publications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Publication</h3>
            <p className="text-gray-600 mb-4">Description of the publication content and its impact.</p>
            <button className="text-white px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#360e1d' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#4a1a2a'} onMouseLeave={(e) => e.target.style.backgroundColor = '#360e1d'}>
              Download PDF
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Report</h3>
            <p className="text-gray-600 mb-4">Comprehensive research findings and recommendations.</p>
            <button className="text-white px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#360e1d' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#4a1a2a'} onMouseLeave={(e) => e.target.style.backgroundColor = '#360e1d'}>
              Download PDF
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Brief</h3>
            <p className="text-gray-600 mb-4">Key policy recommendations and insights.</p>
            <button className="text-white px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#360e1d' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#4a1a2a'} onMouseLeave={(e) => e.target.style.backgroundColor = '#360e1d'}>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
