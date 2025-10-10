import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - FYCI',
  description: 'Learn about the Foundation for Youth Civic Initiative and our mission to empower young people.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              About Us
            </h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto">
              Empowering young people to become active citizens and leaders in their communities
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
