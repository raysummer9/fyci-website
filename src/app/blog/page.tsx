export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest insights, stories, and perspectives on youth development and social change.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder for blog posts */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sample Blog Post</h3>
              <p className="text-gray-600 mb-4">Excerpt from the blog post content...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">March 15, 2024</span>
                <button className="font-medium" style={{ color: '#360e1d' }} onMouseEnter={(e) => e.target.style.color = '#4a1a2a'} onMouseLeave={(e) => e.target.style.color = '#360e1d'}>
                  Read More →
                </button>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Youth Empowerment Story</h3>
              <p className="text-gray-600 mb-4">Inspiring story of youth making a difference...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">March 10, 2024</span>
                <button className="font-medium" style={{ color: '#360e1d' }} onMouseEnter={(e) => e.target.style.color = '#4a1a2a'} onMouseLeave={(e) => e.target.style.color = '#360e1d'}>
                  Read More →
                </button>
              </div>
            </div>
          </article>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Programme Update</h3>
              <p className="text-gray-600 mb-4">Latest updates from our programmes...</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">March 5, 2024</span>
                <button className="font-medium" style={{ color: '#360e1d' }} onMouseEnter={(e) => e.target.style.color = '#4a1a2a'} onMouseLeave={(e) => e.target.style.color = '#360e1d'}>
                  Read More →
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
