'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  GlobeAltIcon,
  ChartBarIcon,
  VideoCameraIcon,
  PhotoIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { THEME_CONFIGS } from '@/lib/types/cv'
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  buttonPop,
  cardHover,
  heroAnimation,
  heroStagger,
  scaleIn,
  viewportOptions
} from '@/lib/utils/animations'

const features = [
  {
    name: 'Living Portfolios',
    description: 'Not PDFs. Beautiful, shareable web pages that showcase your work with videos, galleries, and interactive elements.',
    icon: GlobeAltIcon,
    highlight: true
  },
  {
    name: 'Rich Media Support',
    description: 'Embed YouTube videos, create image galleries, add documents. Perfect for creatives and tech professionals.',
    icon: VideoCameraIcon,
  },
  {
    name: 'AI Writing Assistant',
    description: 'Transform casual descriptions into professional copy. Our AI helps you write content that impresses.',
    icon: SparklesIcon,
  },
  {
    name: 'Real-time Analytics',
    description: 'Know who views your portfolio, where they come from, and what they click. Data-driven career moves.',
    icon: ChartBarIcon,
  },
]

const portfolioTypes = [
  {
    name: 'Professional CV',
    description: 'Clean, ATS-friendly resumes',
    icon: DocumentTextIcon,
    color: 'bg-blue-100 text-blue-600',
    href: '/builder?theme=teal'
  },
  {
    name: 'Video Portfolio',
    description: 'For filmmakers & creators',
    icon: VideoCameraIcon,
    color: 'bg-purple-100 text-purple-600',
    href: '/builder?theme=video-portfolio'
  },
  {
    name: 'Design Showcase',
    description: 'Visual galleries & projects',
    icon: PhotoIcon,
    color: 'bg-pink-100 text-pink-600',
    href: '/builder?theme=art-gallery'
  },
  {
    name: 'Developer Profile',
    description: 'Code samples & GitHub links',
    icon: LinkIcon,
    color: 'bg-green-100 text-green-600',
    href: '/builder?theme=github-style'
  }
]

const comparisons = [
  { feature: 'Shareable web portfolio', folyo: true, others: false },
  { feature: 'Video & media embeds', folyo: true, others: false },
  { feature: 'Real-time analytics', folyo: true, others: false },
  { feature: 'Custom domain support', folyo: true, others: false },
  { feature: 'AI writing assistant', folyo: true, others: 'Limited' },
  { feature: 'PDF export', folyo: true, others: true },
  { feature: 'Multiple templates', folyo: true, others: true },
]

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Filmmaker & Director',
    content: 'Finally, a portfolio that lets me showcase my reels properly. Got contacted by 3 production companies within a month.',
    avatar: '🎬',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Senior UX Designer',
    content: 'The living portfolio concept is genius. Recruiters love that they can see my work without downloading anything.',
    avatar: '🎨',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Full-Stack Developer',
    content: 'Switched from a static resume. The analytics showed me exactly which projects hiring managers were interested in.',
    avatar: '💻',
    rating: 5,
  },
]

export default function HomePage() {
  const [selectedTheme, setSelectedTheme] = useState('teal')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroY = useTransform(scrollY, [0, 400], [0, 100])

  const visibleThemes = THEME_CONFIGS.slice(0, 8)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden"
        style={{ opacity: heroOpacity }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-teal-900" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          style={{ top: '-10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-3xl"
          animate={{
            x: mousePosition.x * -0.015,
            y: mousePosition.y * -0.015,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          style={{ bottom: '10%', right: '15%' }}
        />

        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <motion.div
          className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
          style={{ y: heroY, scale: heroScale }}
        >
          <motion.div
            className="text-center"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={heroAnimation}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-teal-300 text-sm font-medium">
                Stop downloading. Start showcasing.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={heroAnimation}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Your Career Deserves
              <br />
              <motion.span
                className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                A Living Portfolio
              </motion.span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={heroAnimation}
              className="text-xl sm:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Not another PDF. Create beautiful, shareable web portfolios with videos,
              galleries, and real-time analytics. Built for professionals who want to stand out.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={heroAnimation}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
            >
              <motion.div
                variants={buttonPop}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/templates"
                  className="group bg-teal-500 text-white hover:bg-teal-400 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-teal-500/25 hover:shadow-teal-400/30 inline-flex items-center justify-center"
                >
                  Create Your Portfolio
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div
                variants={buttonPop}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/cv/demo"
                  className="bg-white/10 backdrop-blur text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-bold text-lg transition-all border border-white/20 inline-flex items-center justify-center"
                >
                  <PlayCircleIcon className="mr-2 h-5 w-5" />
                  See Live Example
                </Link>
              </motion.div>
            </motion.div>

            {/* Theme Preview */}
            <motion.div
              variants={heroAnimation}
              className="max-w-lg mx-auto"
            >
              <p className="text-sm text-gray-500 mb-4">40+ stunning themes to choose from:</p>
              <div className="flex justify-center gap-2 sm:gap-3">
                {visibleThemes.map((theme, index) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-200
                      ${selectedTheme === theme.id
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                        : 'opacity-80 hover:opacity-100'
                      }
                    `}
                    style={{ backgroundColor: theme.primaryColor }}
                    title={theme.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.2, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </motion.div>

      {/* What You Can Build Section */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              One Platform, Every Portfolio Type
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a creative, developer, or executive—Folyo adapts to your profession.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
          >
            {portfolioTypes.map((type, index) => (
              <motion.div
                key={type.name}
                variants={staggerItem}
              >
                <Link
                  href={type.href}
                  className="block bg-white rounded-2xl p-6 border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10 transition-all group"
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <type.icon className="w-6 h-6" />
                  </motion.div>
                  <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                  <div className="mt-3 text-sm font-medium text-teal-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started <ArrowRightIcon className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Why Folyo</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
              More Than Just a Resume Builder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Traditional resume builders create documents. We create experiences.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`
                  relative bg-white rounded-2xl p-8 border transition-all hover:shadow-xl cursor-default
                  ${feature.highlight
                    ? 'border-teal-200 shadow-lg shadow-teal-500/10'
                    : 'border-gray-100 hover:border-gray-200'
                  }
                `}
              >
                {feature.highlight && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, delay: 0.3 }}
                    className="absolute -top-3 left-6 px-3 py-1 bg-teal-500 text-white text-xs font-semibold rounded-full"
                  >
                    Key Differentiator
                  </motion.div>
                )}
                <motion.div
                  className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-5
                    ${feature.highlight ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-600'}
                  `}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <feature.icon className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Folyo vs Traditional Resume Builders
            </h2>
            <p className="text-xl text-gray-600">
              See why professionals are switching to living portfolios.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-500">Feature</div>
              <div className="text-center">
                <motion.span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <SparklesIcon className="w-4 h-4" />
                  Folyo
                </motion.span>
              </div>
              <div className="text-center text-sm font-medium text-gray-500">Others</div>
            </div>

            {comparisons.map((item, index) => (
              <motion.div
                key={item.feature}
                className={`grid grid-cols-3 gap-4 p-4 items-center ${index !== comparisons.length - 1 ? 'border-b border-gray-100' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="text-sm text-gray-700">{item.feature}</div>
                <div className="text-center">
                  {item.folyo === true ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 500, delay: index * 0.05 }}
                    >
                      <CheckCircleIcon className="w-6 h-6 text-teal-500 mx-auto" />
                    </motion.div>
                  ) : (
                    <span className="text-gray-400">{item.folyo}</span>
                  )}
                </div>
                <div className="text-center">
                  {item.others === true ? (
                    <CheckCircleIcon className="w-6 h-6 text-gray-400 mx-auto" />
                  ) : item.others === false ? (
                    <span className="text-gray-300">—</span>
                  ) : (
                    <span className="text-sm text-gray-400">{item.others}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've transformed their career presence.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOptions}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, type: 'spring', stiffness: 500 }}
                    >
                      <StarSolid className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Stand Out?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Create your living portfolio in minutes. No credit card required.
            </p>
            <motion.div
              variants={buttonPop}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/templates"
                className="group inline-flex items-center gap-2 bg-white text-teal-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-2xl"
              >
                Start Building for Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.p
              className="text-teal-200 text-sm mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Free forever • No credit card • 2 minute setup
            </motion.p>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
