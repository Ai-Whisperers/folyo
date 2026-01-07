'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowRightIcon,
  UserCircleIcon,
  SparklesIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  FireIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { Navbar } from '../../components/common/Navbar'
import { THEME_CONFIGS, type ThemeConfig } from '../../lib/types/cv'

interface PublicPortfolio {
  id: string
  slug: string
  name: string
  tagline: string
  avatar?: string
  theme: string
  views: number
  category?: string
  createdAt?: string
}

// Demo portfolios for display when database is unavailable
// Only includes portfolios that actually have data files
const DEMO_PORTFOLIOS: PublicPortfolio[] = [
  {
    id: 'demo-1',
    slug: 'demo',
    name: 'Maria Lopez',
    tagline: 'Senior Product Designer | UX Expert | Design Systems',
    theme: 'teal',
    views: 12500,
    category: 'creative',
    createdAt: '2024-01-15'
  },
  {
    id: 'demo-2',
    slug: 'milagros-aguilera',
    name: 'Milagros Mabel Aguilera Baez',
    tagline: 'Estudiante de Administracion | Asistente Administrativa | Lider Scout',
    theme: 'berry',
    views: 890,
    category: 'professional',
    createdAt: '2024-06-20'
  },
  {
    id: 'demo-3',
    slug: 'victoria-rolon',
    name: 'Victoria Isabel Rolon Aguilar',
    tagline: 'Tecnica en Informatica | Soporte Tecnico | Estudiante de Administracion',
    theme: 'turquoise',
    views: 645,
    category: 'tech',
    createdAt: '2024-08-10'
  }
]

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Squares2X2Icon },
  { id: 'professional', name: 'Professional', icon: UserCircleIcon },
  { id: 'creative', name: 'Creative', icon: SparklesIcon },
  { id: 'tech', name: 'Tech', icon: ListBulletIcon },
  { id: 'minimal', name: 'Minimal', icon: Squares2X2Icon }
]

const SORT_OPTIONS = [
  { id: 'popular', name: 'Most Popular', icon: FireIcon },
  { id: 'recent', name: 'Recently Added', icon: ClockIcon },
  { id: 'name-asc', name: 'Name A-Z', icon: ArrowUpIcon },
  { id: 'name-desc', name: 'Name Z-A', icon: ArrowDownIcon }
]

function getThemeConfig(themeId: string): ThemeConfig {
  return THEME_CONFIGS.find(t => t.id === themeId) || THEME_CONFIGS[0]
}

function formatViews(views: number): string {
  if (views >= 10000) return `${(views / 1000).toFixed(1)}k`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}k`
  return views.toString()
}

// Portfolio Card Component with hover animations
function PortfolioCard({ portfolio, viewMode }: { portfolio: PublicPortfolio; viewMode: 'grid' | 'list' }) {
  const theme = getThemeConfig(portfolio.theme)
  const [isHovered, setIsHovered] = useState(false)

  if (viewMode === 'list') {
    return (
      <Link
        href={`/portfolio/${portfolio.slug}`}
        className="group flex items-center gap-6 bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {portfolio.avatar ? (
            <Image
              src={portfolio.avatar}
              alt={portfolio.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            portfolio.name.charAt(0)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors truncate">
            {portfolio.name}
          </h3>
          <p className="text-gray-500 text-sm truncate mt-0.5">
            {portfolio.tagline}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <EyeIcon className="w-3.5 h-3.5" />
              {formatViews(portfolio.views)} views
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: theme.primaryColor + '20',
                color: theme.primaryColor
              }}
            >
              {theme.name}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRightIcon className={`w-5 h-5 text-gray-400 transition-all duration-300 ${isHovered ? 'translate-x-1 text-teal-600' : ''}`} />
      </Link>
    )
  }

  return (
    <Link
      href={`/cv/${portfolio.slug}`}
      className="group relative block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Theme colored header with gradient */}
      <div
        className="h-28 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.primaryColor}dd 100%)` }}
      >
        {/* Animated pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2%, transparent 2%), radial-gradient(circle at 75% 75%, white 2%, transparent 2%)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 bg-white/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Featured badge for high views */}
        {portfolio.views > 10000 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium flex items-center gap-1">
            <FireIcon className="w-3 h-3" />
            Popular
          </div>
        )}

        {/* Avatar positioned at bottom */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div
            className={`w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-2xl font-bold transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
            style={{ backgroundColor: theme.primaryColor }}
          >
            {portfolio.avatar ? (
              <Image
                src={portfolio.avatar}
                alt={portfolio.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              portfolio.name.charAt(0)
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 pb-6 px-5 text-center">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-teal-600 transition-colors line-clamp-1">
          {portfolio.name}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {portfolio.tagline}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-3">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <EyeIcon className="w-4 h-4" />
            {formatViews(portfolio.views)}
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              backgroundColor: theme.primaryColor + '15',
              color: theme.primaryColor
            }}
          >
            {theme.name}
          </span>
        </div>
      </div>

      {/* Hover overlay with CTA */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-teal-600/90 via-teal-600/50 to-transparent flex items-end justify-center pb-8 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <span className="bg-white px-5 py-2.5 rounded-full shadow-xl text-sm font-semibold text-teal-600 flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
          View Portfolio
          <ArrowRightIcon className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}

// Loading skeleton
function SkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-6 bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="pt-14 pb-6 px-5 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto -mt-24 mb-4 border-4 border-white" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    </div>
  )
}

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PublicPortfolio[]>(DEMO_PORTFOLIOS)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const response = await fetch('/api/portfolios')
        if (response.ok) {
          const data = await response.json()
          if (data.portfolios && data.portfolios.length > 0) {
            setPortfolios(data.portfolios)
          }
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  // Filter and sort portfolios
  const filteredPortfolios = useMemo(() => {
    let result = portfolios.filter(p => {
      const matchesSearch = searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory

      const matchesTheme = !selectedTheme || p.theme === selectedTheme

      return matchesSearch && matchesCategory && matchesTheme
    })

    // Sort
    switch (sortBy) {
      case 'popular':
        result = result.sort((a, b) => b.views - a.views)
        break
      case 'recent':
        result = result.sort((a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        break
      case 'name-asc':
        result = result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result = result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return result
  }, [portfolios, searchQuery, selectedCategory, selectedTheme, sortBy])

  // Get unique themes from portfolios
  const availableThemes = useMemo(() =>
    Array.from(new Set(portfolios.map(p => p.theme))),
    [portfolios]
  )

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedTheme !== null

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedTheme(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with improved gradient */}
      <div className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
            </span>
            <span className="text-teal-100 text-sm font-medium">
              {portfolios.length}+ portfolios and counting
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Discover Amazing
            <br />
            <span className="bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">
              Professional Portfolios
            </span>
          </h1>
          <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Get inspired by portfolios from designers, developers, and professionals worldwide.
            Then create your own stunning portfolio in minutes.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, title, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-300/50 shadow-2xl text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <FunnelIcon className="w-5 h-5 text-gray-400 hidden sm:block" />
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${selectedCategory === category.id
                    ? 'bg-teal-100 text-teal-700 shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3 lg:ml-auto flex-wrap">
            {/* Theme Filter */}
            <select
              value={selectedTheme || ''}
              onChange={(e) => setSelectedTheme(e.target.value || null)}
              className="px-4 py-2 rounded-xl text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-gray-700"
            >
              <option value="">All Themes</option>
              {availableThemes.map(themeId => {
                const theme = getThemeConfig(themeId)
                return (
                  <option key={themeId} value={themeId}>
                    {theme.name}
                  </option>
                )
              })}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl text-sm bg-gray-50 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-gray-700"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredPortfolios.length}</span> portfolios
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-3 text-sm text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
              >
                <XMarkIcon className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Portfolio Grid/List */}
        {loading ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} viewMode={viewMode} />
            ))}
          </div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No portfolios found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
          }>
            {filteredPortfolios.map((portfolio, index) => (
              <div
                key={portfolio.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PortfolioCard portfolio={portfolio} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 rounded-3xl" />
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative p-10 md:p-16 text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
              <SparklesIcon className="w-4 h-4" />
              <span className="text-sm font-medium">40+ stunning themes available</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your Own?
            </h2>
            <p className="text-teal-100 mb-10 max-w-2xl mx-auto text-lg">
              Join thousands of professionals who showcase their work with Folyo.
              Beautiful portfolios, powerful analytics, zero hassle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-2xl"
              >
                Start Building Free
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                Browse Templates
              </Link>
            </div>

            <p className="text-teal-200 text-sm mt-6">
              Free forever. No credit card required.
            </p>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
