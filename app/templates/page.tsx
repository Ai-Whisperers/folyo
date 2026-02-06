'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  EyeIcon,
  ArrowRightIcon,
  CheckIcon,
  SwatchIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline'
import {
  COLOR_PALETTES,
  type ColorPalette,
  getColorPalette,
} from '@/lib/templates'

// Kyrian's CV data for preview
const SAMPLE_DATA = {
  name: 'Kyrian Weiss van der Pol',
  tagline: 'QA Automation Engineer | Embedded Systems Developer',
  summary: 'QA Automation Engineer & Embedded Systems Developer passionate about solving real-world problems with creative thinking. Experienced in Python, Selenium, ESP32, and IoT systems.',
  experience: 'QA Automation Trainee at MentorMate Bootcamp',
  skills: ['Python', 'Selenium', 'ESP32', 'IoT', 'Test Automation']
}

const COLOR_CATEGORIES: { id: ColorPalette['category']; name: string }[] = [
  { id: 'professional', name: 'Professional' },
  { id: 'vibrant', name: 'Vibrant' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'dark', name: 'Dark Mode' }
]

// Color Swatch Component
function ColorSwatch({
  palette,
  isSelected,
  onClick
}: {
  palette: ColorPalette
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all
        ${isSelected
          ? 'bg-gray-100 ring-2 ring-teal-500 scale-105'
          : 'hover:bg-gray-50 hover:scale-105'
        }
      `}
      title={palette.name}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md transition-transform ${
          isSelected ? 'scale-110' : ''
        }`}
        style={{
          backgroundColor: palette.primary,
          border: palette.isDark ? '3px solid rgba(255,255,255,0.2)' : '3px solid rgba(0,0,0,0.05)'
        }}
      >
        {isSelected && (
          <CheckIcon className="w-5 h-5 text-white m-auto mt-3 sm:mt-4" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-700 truncate max-w-full">
        {palette.name}
      </span>
    </button>
  )
}

// Live CV Preview
function CVPreviewMini({ color }: { color: ColorPalette }) {
  const isDark = color.isDark
  const textColor = isDark ? '#F9FAFB' : '#1F2937'
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280'

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-xl"
      style={{ backgroundColor: color.background }}
    >
      {/* Header */}
      <div className="p-4" style={{ backgroundColor: color.primary }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-lg font-bold text-white">K</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{SAMPLE_DATA.name}</h3>
            <p className="text-xs text-white/80">{SAMPLE_DATA.tagline}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* About */}
        <div>
          <h4 className="text-xs font-semibold mb-1" style={{ color: color.primary }}>About</h4>
          <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
            {SAMPLE_DATA.summary}
          </p>
        </div>
        
        {/* Experience */}
        <div>
          <h4 className="text-xs font-semibold mb-1" style={{ color: color.primary }}>Experience</h4>
          <p className="text-[11px]" style={{ color: textColor }}>{SAMPLE_DATA.experience}</p>
        </div>
        
        {/* Skills */}
        <div>
          <h4 className="text-xs font-semibold mb-2" style={{ color: color.primary }}>Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_DATA.skills.map((skill, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: color.accent, 
                  color: color.primary 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [selectedColor, setSelectedColor] = useState('teal')
  
  const activeColor = getColorPalette(selectedColor) || COLOR_PALETTES[0]

  const groupedColors = useMemo(() => {
    return COLOR_CATEGORIES.map(cat => ({
      ...cat,
      palettes: COLOR_PALETTES.filter(p => p.category === cat.id)
    }))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1%, transparent 1%), radial-gradient(circle at 75% 75%, white 1%, transparent 1%)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 backdrop-blur rounded-full mb-6">
            <SwatchIcon className="w-4 h-4 text-teal-300" />
            <span className="text-teal-200 text-sm font-medium">
              {COLOR_PALETTES.length} Color Themes
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Pick Your
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {' '}Perfect Color
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose from our curated color palettes to personalize your CV. 
            Your resume will be responsive and work beautifully on any device.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { icon: DevicePhoneMobileIcon, text: 'Responsive Design' },
              { icon: PrinterIcon, text: 'Print Optimized' },
              { icon: DocumentDuplicateIcon, text: 'PDF Export' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full"
              >
                <feature.icon className="w-4 h-4 text-teal-300" />
                <span className="text-sm text-white">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 33.75C1200 37.5 1320 37.5 1380 37.5L1440 37.5V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Color Selection - Left/Top */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SwatchIcon className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-gray-900">Choose Your Color</h2>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Select a color that matches your personality and industry
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-8">
                {groupedColors.map(category => (
                  <div key={category.id}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {category.palettes.map(palette => (
                        <ColorSwatch
                          key={palette.id}
                          palette={palette}
                          isSelected={selectedColor === palette.id}
                          onClick={() => setSelectedColor(palette.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Color Info */}
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl shadow-inner"
                      style={{ backgroundColor: activeColor.primary }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{activeColor.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{activeColor.category} theme</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[activeColor.primary, activeColor.secondary, activeColor.accent].map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview - Right/Bottom */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">Live Preview</span>
                </div>

                <div 
                  className="p-4"
                  style={{ backgroundColor: activeColor.isDark ? '#1a1a1a' : '#f3f4f6' }}
                >
                  <CVPreviewMini color={activeColor} />
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <Link
                    href={`/builder?color=${selectedColor}&new=true`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
                  >
                    Start Building
                    <ArrowRightIcon className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                <h4 className="font-semibold text-teal-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-teal-600" />
                  Color Tips
                </h4>
                <ul className="text-sm text-teal-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Professional</strong> colors work best for corporate roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Vibrant</strong> colors suit creative industries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Dark</strong> themes look great on screens</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <Link
          href={`/builder?color=${selectedColor}&new=true`}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
        >
          Start Building with {activeColor.name}
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
