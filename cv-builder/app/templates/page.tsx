'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  SparklesIcon,
  EyeIcon,
  ArrowRightIcon,
  CheckIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { THEME_CONFIGS, type ThemeConfig, type ThemeSkin } from '../../lib/types/cv'

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
    summary: 'Creative product designer with 8+ years of experience crafting intuitive digital experiences for Fortune 500 companies. Passionate about user-centered design and building products that make a difference.'
  },
  experiences: {
    info: [
      {
        role: 'Senior Product Designer',
        company: 'TechCorp Inc.',
        time: '2021 - Present',
        details: 'Lead design for flagship products serving 2M+ users. Increased conversion by 34% through data-driven design iterations.',
        tags: ['Figma', 'User Research', 'Design Systems']
      },
      {
        role: 'Product Designer',
        company: 'StartupXYZ',
        time: '2018 - 2021',
        details: 'Designed mobile app from 0 to 500K downloads. Collaborated with engineering to build component library.',
        tags: ['Mobile Design', 'Prototyping', 'Usability Testing']
      }
    ]
  },
  skills: {
    toolset: [
      { name: 'UI/UX Design', level: 95 },
      { name: 'Figma', level: 90 },
      { name: 'Prototyping', level: 85 },
      { name: 'User Research', level: 80 },
      { name: 'Design Systems', level: 85 }
    ]
  }
}

// Template categories for filtering
const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: SparklesIcon },
  { id: 'professional', name: 'Professional', icon: BriefcaseIcon },
  { id: 'creative', name: 'Creative', icon: VideoCameraIcon },
  { id: 'minimal', name: 'Minimal', icon: AcademicCapIcon },
  { id: 'bold', name: 'Bold', icon: CodeBracketIcon }
]

// Mini CV Preview Component
function MiniCVPreview({ theme, isActive }: { theme: ThemeConfig; isActive: boolean }) {
  const isDark = theme.id === 'video-portfolio'

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden transition-all duration-300
        ${isActive ? 'ring-2 ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: theme.bgColor,
        borderColor: theme.primaryColor,
        ...(isActive && { ringColor: theme.primaryColor })
      }}
    >
      {/* Mini Header */}
      <div
        className="h-16 flex items-center px-4 gap-3"
        style={{ backgroundColor: isDark ? '#2D2D2D' : theme.accentColor }}
      >
        <div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: theme.primaryColor }}
        />
        <div className="flex-1">
          <div
            className="h-2 w-20 rounded mb-1.5"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="h-1.5 w-14 rounded opacity-60"
            style={{ backgroundColor: isDark ? '#666' : theme.primaryColor }}
          />
        </div>
      </div>

      {/* Mini Content */}
      <div className="p-4 space-y-3">
        {/* Section Title */}
        <div
          className="h-2 w-16 rounded"
          style={{ backgroundColor: theme.primaryColor }}
        />

        {/* Content Lines */}
        <div className="space-y-1.5">
          <div
            className="h-1.5 w-full rounded"
            style={{ backgroundColor: isDark ? '#444' : '#E5E7EB' }}
          />
          <div
            className="h-1.5 w-4/5 rounded"
            style={{ backgroundColor: isDark ? '#444' : '#E5E7EB' }}
          />
          <div
            className="h-1.5 w-3/5 rounded"
            style={{ backgroundColor: isDark ? '#444' : '#E5E7EB' }}
          />
        </div>

        {/* Skills Preview */}
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-12 rounded"
              style={{ backgroundColor: isDark ? '#555' : '#D1D5DB' }}
            />
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '85%', backgroundColor: theme.primaryColor }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 w-10 rounded"
              style={{ backgroundColor: isDark ? '#555' : '#D1D5DB' }}
            />
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '70%', backgroundColor: theme.primaryColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Full Preview Component
function FullPreview({ theme }: { theme: ThemeConfig }) {
  const isDark = theme.id === 'video-portfolio'

  return (
    <div
      className="rounded-xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Header Section */}
      <div
        className="p-8"
        style={{ backgroundColor: isDark ? '#2D2D2D' : theme.accentColor }}
      >
        <div className="flex items-start gap-6">
          <div
            className="w-24 h-24 rounded-full flex-shrink-0"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div className="flex-1">
            <h3
              className="text-2xl font-bold mb-1"
              style={{ color: isDark ? '#FFF' : theme.textColor }}
            >
              {SAMPLE_CV_DATA.sidebar.name}
            </h3>
            <p
              className="text-lg mb-3"
              style={{ color: theme.primaryColor }}
            >
              {SAMPLE_CV_DATA.sidebar.tagline}
            </p>
            <div
              className="flex flex-wrap gap-4 text-sm"
              style={{ color: isDark ? '#AAA' : '#6B7280' }}
            >
              <span>{SAMPLE_CV_DATA.sidebar.location}</span>
              <span>{SAMPLE_CV_DATA.sidebar.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Career Profile */}
        <div>
          <h4
            className="text-lg font-semibold mb-2 pb-1 border-b-2"
            style={{
              color: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Career Profile
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: isDark ? '#CCC' : '#4B5563' }}
          >
            {SAMPLE_CV_DATA['career-profile'].summary}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h4
            className="text-lg font-semibold mb-3 pb-1 border-b-2"
            style={{
              color: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Experience
          </h4>
          <div className="space-y-4">
            {SAMPLE_CV_DATA.experiences.info.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h5
                      className="font-medium"
                      style={{ color: isDark ? '#FFF' : theme.textColor }}
                    >
                      {exp.role}
                    </h5>
                    <p
                      className="text-sm"
                      style={{ color: theme.primaryColor }}
                    >
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: isDark ? '#333' : theme.accentColor,
                      color: isDark ? '#AAA' : '#6B7280'
                    }}
                  >
                    {exp.time}
                  </span>
                </div>
                <p
                  className="text-sm mt-1"
                  style={{ color: isDark ? '#AAA' : '#6B7280' }}
                >
                  {exp.details}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exp.tags?.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: theme.primaryColor + '20',
                        color: theme.primaryColor
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4
            className="text-lg font-semibold mb-3 pb-1 border-b-2"
            style={{
              color: theme.primaryColor,
              borderColor: theme.primaryColor
            }}
          >
            Skills
          </h4>
          <div className="space-y-2">
            {SAMPLE_CV_DATA.skills.toolset.map((skill, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="w-24 text-sm"
                  style={{ color: isDark ? '#CCC' : '#4B5563' }}
                >
                  {skill.name}
                </span>
                <div
                  className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDark ? '#333' : '#E5E7EB' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: theme.primaryColor
                    }}
                  />
                </div>
                <span
                  className="text-xs w-8 text-right"
                  style={{ color: isDark ? '#AAA' : '#9CA3AF' }}
                >
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

  const activeTheme = THEME_CONFIGS.find(t => t.id === selectedTheme) || THEME_CONFIGS[0]

  const filteredThemes = selectedCategory === 'all'
    ? THEME_CONFIGS
    : THEME_CONFIGS.filter(t => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Folyo</span>
              </Link>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600">Choose Your Template</span>
            </div>

            <Link
              href={`/builder?theme=${selectedTheme}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Use This Template
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Template Selection */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                      ${selectedCategory === category.id
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-4">
                {filteredThemes.length} Templates Available
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {filteredThemes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`
                      relative rounded-xl overflow-hidden border-2 transition-all duration-200
                      ${selectedTheme === theme.id
                        ? 'border-teal-500 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <MiniCVPreview theme={theme} isActive={selectedTheme === theme.id} />

                    {/* Selection Indicator */}
                    {selectedTheme === theme.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Theme Name */}
                    <div className="p-2 bg-white border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 truncate">
                        {theme.name}
                      </p>
                      <p className="text-[10px] text-gray-400 capitalize">
                        {theme.category}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Theme Info */}
            <div
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: activeTheme.accentColor,
                borderColor: activeTheme.primaryColor + '40'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: activeTheme.primaryColor }}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{activeTheme.name}</h4>
                  <p className="text-sm text-gray-600">{activeTheme.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs px-2 py-1 rounded-full capitalize"
                  style={{
                    backgroundColor: activeTheme.primaryColor + '20',
                    color: activeTheme.primaryColor
                  }}
                >
                  {activeTheme.category}
                </span>
                {activeTheme.id === 'video-portfolio' && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    Video Support
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              {/* Preview Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Live Preview</span>
                </div>

                {/* Device Toggle */}
                <div className="flex items-center gap-1 bg-gray-200 rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`
                      p-1.5 rounded-md transition-colors
                      ${previewMode === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}
                    `}
                  >
                    <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`
                      p-1.5 rounded-md transition-colors
                      ${previewMode === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}
                    `}
                  >
                    <DevicePhoneMobileIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div
                className={`
                  p-6 overflow-auto transition-all duration-300
                  ${activeTheme.id === 'video-portfolio' ? 'bg-[#1a1a1a]' : 'bg-gray-100'}
                `}
                style={{ maxHeight: 'calc(100vh - 200px)' }}
              >
                <div
                  className={`
                    mx-auto transition-all duration-300
                    ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}
                  `}
                >
                  <FullPreview theme={activeTheme} />
                </div>
              </div>

              {/* Preview Footer */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Preview with sample data • Your content will look even better
                </p>

                <Link
                  href={`/builder?theme=${selectedTheme}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Start Building
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
