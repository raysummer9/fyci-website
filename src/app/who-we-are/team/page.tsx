import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Team - FYCI',
  description: 'Meet the dedicated team behind the Foundation for Youth Civic Initiative.',
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Our Team
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
              Meet the passionate individuals driving positive change in youth development
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Content will be added here based on your requirements...
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
