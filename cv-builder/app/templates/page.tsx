'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  EyeIcon,
  ArrowRightIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  SwatchIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  HeartIcon,
  DocumentDuplicateIcon,
  PaintBrushIcon,
  CubeTransparentIcon,
  BoltIcon,
  ChartBarIcon,
  GlobeAltIcon,
  Bars3Icon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { THEME_CONFIGS, type ThemeConfig, type ThemeSkin } from '../../lib/types/cv'
import { Navbar } from '../../components/common/Navbar'
import { Footer } from '../../components/common/Footer'

// Sample data for preview
const SAMPLE_CV_DATA = {
  sidebar: {
    name: 'Alex Johnson',
    tagline: 'Senior Product Designer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'alexjohnson',
    github: 'alexj',
    website: 'alexjohnson.design'
  },
  'career-profile': {
    summary: 'Creative product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies.'
  },
  experiences: {
    info: [
      {
        role: 'Senior Product Designer',
        company: 'TechCorp Inc.',
        time: '2021 - Present',
        details: 'Lead design for flagship products serving 2M+ users.',
        tags: ['Figma', 'User Research', 'Design Systems']
      },
      {
        role: 'Product Designer',
        company: 'StartupXYZ',
        time: '2018 - 2021',
        details: 'Designed mobile app from 0 to 500K downloads.',
        tags: ['Mobile Design', 'Prototyping']
      }
    ]
  },
  skills: {
    toolset: [
      { name: 'UI/UX Design', level: 95 },
      { name: 'Figma', level: 90 },
      { name: 'Prototyping', level: 85 },
      { name: 'User Research', level: 80 }
    ]
  }
}

// Template categories
const CATEGORIES = [
  { id: 'all', name: 'All', count: THEME_CONFIGS.length },
  { id: 'professional', name: 'Professional', count: THEME_CONFIGS.filter(t => t.category === 'professional').length },
  { id: 'creative', name: 'Creative', count: THEME_CONFIGS.filter(t => t.category === 'creative').length },
  { id: 'minimal', name: 'Minimal', count: THEME_CONFIGS.filter(t => t.category === 'minimal').length },
  { id: 'bold', name: 'Bold', count: THEME_CONFIGS.filter(t => t.category === 'bold').length }
]

// Feature highlights
const FEATURES = [
  { icon: PaintBrushIcon, title: '40+ Themes' },
  { icon: DevicePhoneMobileIcon, title: 'Responsive' },
  { icon: BoltIcon, title: 'Live Preview' },
  { icon: DocumentDuplicateIcon, title: 'PDF Export' }
]

// Import shared theme utilities for consistency
import { isDarkTheme, SHARED_ANIMATIONS } from '../../lib/utils/theme'

// Compact Template Card Component
function TemplateCard({
  theme,
  isSelected,
  onClick,
  isFavorite,
  onToggleFavorite
}: {
  theme: ThemeConfig
  isSelected: boolean
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}) {
  const isDark = isDarkTheme(theme)

  return (
    <div
      className={`
        group relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out active:scale-[0.98]
        ${isSelected
          ? 'ring-2 ring-teal-500 ring-offset-2 shadow-lg'
          : 'hover:shadow-lg border border-gray-200'
        }
      `}
      onClick={onClick}
    >
      {/* Preview Container */}
      <div
        className="aspect-[3/4] relative overflow-hidden"
        style={{ backgroundColor: theme.bgColor }}
      >
        {/* Mini CV Preview */}
        <div className="absolute inset-0 p-2 sm:p-3 scale-[0.85] sm:scale-[0.9] origin-top">
          {/* Header */}
          <div
            className="rounded-t-lg p-2 sm:p-3 flex items-center gap-2"
            style={{ backgroundColor: isDark ? '#2D2D2D' : theme.accentColor }}
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div className="flex-1 space-y-1">
              <div
                className="h-2 w-16 sm:w-20 rounded"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div
                className="h-1.5 w-10 sm:w-14 rounded opacity-60"
                style={{ backgroundColor: isDark ? '#666' : theme.primaryColor }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-2 sm:p-3 space-y-3" style={{ backgroundColor: theme.bgColor }}>
            {/* Section Lines */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-14 rounded" style={{ backgroundColor: theme.primaryColor }} />
              <div className="h-1 w-full rounded" style={{ backgroundColor: isDark ? '#444' : '#E5E7EB' }} />
              <div className="h-1 w-4/5 rounded" style={{ backgroundColor: isDark ? '#444' : '#E5E7EB' }} />
            </div>

            {/* Skills Preview */}
            {[75, 60, 50].map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="h-1 w-10 rounded" style={{ backgroundColor: isDark ? '#555' : '#D1D5DB' }} />
                <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${w}%`, backgroundColor: theme.primaryColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Check */}
        {isSelected && (
          <div className="absolute top-2 left-2 w-5 h-5 sm:w-6 sm:h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`
            absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
            transition-all duration-200 backdrop-blur-sm
            ${isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }
          `}
        >
          {isFavorite ? (
            <HeartSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          ) : (
            <HeartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>

        {/* Popular Badge */}
        {theme.id === 'teal' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-white text-[9px] sm:text-[10px] font-bold uppercase rounded-full">
            Popular
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{theme.name}</h3>
            <span className="text-[10px] sm:text-xs text-gray-500 capitalize">{theme.category}</span>
          </div>
          <div
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 ml-2"
            style={{ backgroundColor: theme.primaryColor }}
          />
        </div>
      </div>
    </div>
  )
}

// Compact Preview Component for Mobile
function MobilePreview({ theme, onClose }: { theme: ThemeConfig; onClose: () => void }) {
  const isDark = isDarkTheme(theme)

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{theme.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{theme.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div
          className="p-4 overflow-auto"
          style={{ maxHeight: 'calc(85vh - 180px)', backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6' }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-lg"
            style={{ backgroundColor: theme.bgColor }}
          >
            {/* Mini Header */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ backgroundColor: isDark ? '#2D2D2D' : theme.accentColor }}
            >
              <div
                className="w-14 h-14 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div>
                <h4 className="font-bold" style={{ color: isDark ? '#FFF' : theme.textColor }}>
                  {SAMPLE_CV_DATA.sidebar.name}
                </h4>
                <p className="text-sm" style={{ color: theme.primaryColor }}>
                  {SAMPLE_CV_DATA.sidebar.tagline}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Summary */}
              <p className="text-sm" style={{ color: isDark ? '#CCC' : '#4B5563' }}>
                {SAMPLE_CV_DATA['career-profile'].summary}
              </p>

              {/* Skills */}
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_CV_DATA.skills.toolset.slice(0, 4).map((skill, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: isDark ? '#CCC' : '#4B5563' }}>{skill.name}</span>
                      <span style={{ color: theme.primaryColor }}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${skill.level}%`, backgroundColor: theme.primaryColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <Link
            href={`/builder?theme=${theme.id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
          >
            Use This Template
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// Full Preview Component for Desktop
function FullPreview({ theme }: { theme: ThemeConfig }) {
  const isDark = isDarkTheme(theme)

  return (
    <div
      className="rounded-xl overflow-hidden shadow-xl"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Header Section */}
      <div
        className="p-4 lg:p-6"
        style={{ backgroundColor: isDark ? '#2D2D2D' : theme.accentColor }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex-shrink-0"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg lg:text-xl font-bold truncate"
              style={{ color: isDark ? '#FFF' : theme.textColor }}
            >
              {SAMPLE_CV_DATA.sidebar.name}
            </h3>
            <p
              className="text-sm lg:text-base truncate"
              style={{ color: theme.primaryColor }}
            >
              {SAMPLE_CV_DATA.sidebar.tagline}
            </p>
            <div
              className="flex flex-wrap gap-2 mt-2 text-xs"
              style={{ color: isDark ? '#AAA' : '#6B7280' }}
            >
              <span className="flex items-center gap-1">
                <GlobeAltIcon className="w-3 h-3" />
                {SAMPLE_CV_DATA.sidebar.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 space-y-4">
        {/* Career Profile */}
        <div>
          <h4
            className="text-sm font-semibold mb-2 pb-1 border-b-2 flex items-center gap-1.5"
            style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
          >
            <SparklesIcon className="w-4 h-4" />
            Career Profile
          </h4>
          <p
            className="text-xs lg:text-sm leading-relaxed"
            style={{ color: isDark ? '#CCC' : '#4B5563' }}
          >
            {SAMPLE_CV_DATA['career-profile'].summary}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h4
            className="text-sm font-semibold mb-2 pb-1 border-b-2 flex items-center gap-1.5"
            style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
          >
            <ChartBarIcon className="w-4 h-4" />
            Experience
          </h4>
          <div className="space-y-3">
            {SAMPLE_CV_DATA.experiences.info.slice(0, 1).map((exp, i) => (
              <div key={i} className="relative pl-3 border-l-2" style={{ borderColor: theme.primaryColor + '40' }}>
                <div
                  className="absolute left-0 top-1 w-1.5 h-1.5 rounded-full -translate-x-[4px]"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <h5 className="font-medium text-sm" style={{ color: isDark ? '#FFF' : theme.textColor }}>
                  {exp.role}
                </h5>
                <p className="text-xs" style={{ color: theme.primaryColor }}>{exp.company}</p>
                <p className="text-xs mt-1" style={{ color: isDark ? '#AAA' : '#6B7280' }}>
                  {exp.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4
            className="text-sm font-semibold mb-2 pb-1 border-b-2 flex items-center gap-1.5"
            style={{ color: theme.primaryColor, borderColor: theme.primaryColor }}
          >
            <CubeTransparentIcon className="w-4 h-4" />
            Skills
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_CV_DATA.skills.toolset.slice(0, 3).map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-20 truncate" style={{ color: isDark ? '#CCC' : '#4B5563' }}>
                  {skill.name}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${skill.level}%`, backgroundColor: theme.primaryColor }}
                  />
                </div>
                <span className="text-xs w-8" style={{ color: theme.primaryColor }}>
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeSkin>('teal')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showMobilePreview, setShowMobilePreview] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const activeTheme = THEME_CONFIGS.find(t => t.id === selectedTheme) || THEME_CONFIGS[0]

  const filteredThemes = useMemo(() => {
    let result = THEME_CONFIGS

    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      )
    }

    if (showFavoritesOnly) {
      result = result.filter(t => favorites.includes(t.id))
    }

    return result
  }, [selectedCategory, searchQuery, showFavoritesOnly, favorites])

  const toggleFavorite = (themeId: string) => {
    setFavorites(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    )
  }

  const handleTemplateSelect = (themeId: ThemeSkin) => {
    setSelectedTheme(themeId)
    // Show mobile preview on small screens
    if (window.innerWidth < 1024) {
      setShowMobilePreview(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Responsive */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1%, transparent 1%), radial-gradient(circle at 75% 75%, white 1%, transparent 1%)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 backdrop-blur rounded-full mb-4 sm:mb-6">
              <SwatchIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
              <span className="text-teal-200 text-xs sm:text-sm font-medium">
                {THEME_CONFIGS.length} Templates
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Choose Your
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {' '}Portfolio Template
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              Stand out with professionally designed templates. Fully customizable and responsive.
            </p>

            {/* Feature Pills - Horizontal Scroll on Mobile */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full whitespace-nowrap flex-shrink-0"
                >
                  <feature.icon className="w-3.5 h-3.5 text-teal-300" />
                  <span className="text-xs sm:text-sm text-white">{feature.title}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
              <a
                href="#templates"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/25 text-sm sm:text-base"
              >
                Browse Templates
                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <Link
                href="/cv/demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold rounded-xl transition-all border border-white/20 text-sm sm:text-base"
              >
                <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Live Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 33.75C1200 37.5 1320 37.5 1380 37.5L1440 37.5V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters Bar - Responsive */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8 sticky top-16 sm:top-20 z-20">
          {/* Mobile: Compact Filter Row */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter Toggle - Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
            >
              <FunnelIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${showFavoritesOnly
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {showFavoritesOnly ? (
                <HeartSolid className="w-4 h-4" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              {favorites.length > 0 && (
                <span className="text-xs bg-red-200 px-1.5 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Categories - Desktop inline, Mobile collapsible */}
          <div className={`
            mt-3 lg:mt-0 lg:flex lg:items-center lg:gap-2 overflow-x-auto
            ${showFilters ? 'block' : 'hidden lg:flex'}
          `}>
            <div className="flex items-center gap-2 pb-2 lg:pb-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${selectedCategory === cat.id
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {cat.name}
                  <span className={`text-xs px-1 py-0.5 rounded ${selectedCategory === cat.id ? 'bg-teal-400/50' : 'bg-gray-200'}`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid + Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Templates Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {filteredThemes.length} Templates
                {selectedCategory !== 'all' && (
                  <span className="text-gray-500 font-normal"> in {selectedCategory}</span>
                )}
              </h2>
            </div>

            {filteredThemes.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl border border-gray-200">
                <SwatchIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setShowFavoritesOnly(false); }}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {filteredThemes.map(theme => (
                  <TemplateCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedTheme === theme.id}
                    onClick={() => handleTemplateSelect(theme.id)}
                    isFavorite={favorites.includes(theme.id)}
                    onToggleFavorite={() => toggleFavorite(theme.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live Preview Panel - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Preview Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700 text-sm">Live Preview</span>
                  </div>

                  {/* Device Toggle */}
                  <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-0.5">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                    >
                      <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                    >
                      <DevicePhoneMobileIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div
                  className={`p-3 overflow-auto ${isDarkTheme(activeTheme) ? 'bg-gray-900' : 'bg-gray-100'}`}
                  style={{ maxHeight: '50vh' }}
                >
                  <div className={`transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[200px] mx-auto' : ''}`}>
                    <FullPreview theme={activeTheme} />
                  </div>
                </div>

                {/* Preview Footer */}
                <div className="px-4 py-3 border-t border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{activeTheme.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{activeTheme.category}</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-lg shadow-inner"
                      style={{ backgroundColor: activeTheme.primaryColor }}
                    />
                  </div>

                  <Link
                    href={`/builder?theme=${selectedTheme}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    Use This Template
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                <h4 className="font-semibold text-teal-900 mb-2 flex items-center gap-2 text-sm">
                  <SparklesIcon className="w-4 h-4 text-teal-600" />
                  Pro Tips
                </h4>
                <ul className="text-xs text-teal-800 space-y-1.5">
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    Click any template to preview
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    Heart templates to save favorites
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    All templates are customizable
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Sheet */}
      {showMobilePreview && (
        <MobilePreview
          theme={activeTheme}
          onClose={() => setShowMobilePreview(false)}
        />
      )}

      {/* Mobile Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobilePreview(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all text-sm"
          >
            <EyeIcon className="w-4 h-4" />
            Preview
          </button>
          <Link
            href={`/builder?theme=${selectedTheme}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Use Template
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Add bottom padding on mobile for fixed CTA */}
      <div className="h-20 lg:hidden" />

      <Footer />

      {/* Shared Animation Styles */}
      <style jsx global>{SHARED_ANIMATIONS}</style>
    </div>
  )
}
