'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  DocumentTextIcon, 
  SparklesIcon, 
  EyeIcon, 
  ShareIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Professional Templates',
    description: 'Choose from 8 beautiful, industry-tested CV templates designed to impress recruiters.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Real-time Preview',
    description: 'See your changes instantly with live preview. What you see is exactly what you get.',
    icon: EyeIcon,
  },
  {
    name: 'AI-Powered Suggestions',
    description: 'Get smart content suggestions and optimization tips to make your CV stand out.',
    icon: SparklesIcon,
  },
  {
    name: 'Easy Sharing & Export',
    description: 'Share your CV with a link, download as PDF, or publish to your custom domain.',
    icon: ShareIcon,
  },
]

const themes = [
  { name: 'blue', color: 'bg-cv-blue' },
  { name: 'turquoise', color: 'bg-cv-turquoise' },
  { name: 'green', color: 'bg-cv-green' },
  { name: 'berry', color: 'bg-cv-berry' },
  { name: 'orange', color: 'bg-cv-orange' },
  { name: 'ceramic', color: 'bg-cv-ceramic' },
  { name: 'teal', color: 'bg-cv-teal' },
  { name: 'oceanstale', color: 'bg-cv-oceanstale' },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    content: 'Got 3 interview requests within a week of updating my CV with this builder. The templates are professional and ATS-friendly.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Marketing Manager',
    content: 'Love how easy it is to switch themes and see real-time changes. Saved me hours of formatting in Word.',
    rating: 5,
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Research Scientist',
    content: 'The academic template is perfect for my field. Clean, professional, and highlights my publications beautifully.',
    rating: 5,
  },
]

export default function HomePage() {
  const [selectedTheme, setSelectedTheme] = useState('teal')

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">CV Builder Pro</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-primary-600">
                Sign In
              </Link>
              <Link href="/builder" className="btn-primary">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Build Your Perfect{' '}
              <span className="text-primary-600">Professional CV</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning, ATS-friendly CVs in minutes with our intuitive builder. 
              Choose from professional templates, get real-time previews, and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/builder" className="btn-primary text-lg px-8 py-4">
                Start Building Free
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                View Examples
              </button>
            </div>
            
            {/* Theme Preview */}
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-gray-500 mb-4">Choose from 8 beautiful themes:</p>
              <div className="flex justify-center gap-3 mb-8">
                {themes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme.name)}
                    className={`theme-switcher ${theme.color} ${
                      selectedTheme === theme.name ? 'active ring-primary-500' : ''
                    }`}
                    title={`${theme.name.charAt(0).toUpperCase() + theme.name.slice(1)} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to create an outstanding CV
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our professional CV builder combines beautiful design with powerful features 
              to help you stand out from the competition.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="card text-center animate-slide-up">
                <div className="mx-auto h-12 w-12 text-primary-600 mb-4">
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-primary-100">CVs Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-primary-100">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by professionals worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <CheckCircleIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to build your perfect CV?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of professionals who have already transformed their careers
            </p>
            <Link href="/builder" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 inline-flex items-center">
              Start Building Now - It's Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">CV Builder Pro</h3>
            <p className="text-gray-400 mb-4">
              Professional CV templates that get results
            </p>
            <div className="text-sm text-gray-500">
              © 2024 CV Builder Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}