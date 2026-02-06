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
  Squares2X2Icon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid, HeartIcon as HeartSolid } from '@heroicons/react/24/solid'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import {
  TEMPLATE_LAYOUTS,
  COLOR_PALETTES,
  type TemplateLayoutId,
  type TemplateLayout,
  type ColorPalette,
  getColorPalette,
} from '@/lib/templates'

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

// Feature highlights
const FEATURES = [
  { icon: Squares2X2Icon, title: '8 Unique Layouts' },
  { icon: SwatchIcon, title: '17 Color Palettes' },
  { icon: DevicePhoneMobileIcon, title: 'Responsive' },
  { icon: DocumentDuplicateIcon, title: 'PDF Export' }
]

const COLOR_CATEGORIES: { id: ColorPalette['category']; name: string }[] = [
  { id: 'professional', name: 'Professional' },
  { id: 'vibrant', name: 'Vibrant' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'dark', name: 'Dark Mode' }
]

// Mini preview representations for each template layout
function TemplatePreview({ template, color }: { template: TemplateLayout; color: string }) {
  const previewStyles: Record<TemplateLayoutId, JSX.Element> = {
    classic: (
      <div className="flex h-full">
        <div className="w-1/3 h-full rounded-l" style={{ backgroundColor: color }} />
        <div className="flex-1 p-2 space-y-1.5">
          <div className="h-2 w-3/4 bg-gray-200 rounded" />
          <div className="h-1.5 w-full bg-gray-100 rounded" />
          <div className="h-1.5 w-2/3 bg-gray-100 rounded" />
          <div className="h-1.5 w-4/5 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    modern: (
      <div className="h-full p-2 space-y-2">
        <div className="h-4 w-full rounded" style={{ backgroundColor: color }} />
        <div className="flex gap-1.5">
          <div className="flex-1 h-6 bg-gray-100 rounded border border-gray-200" />
          <div className="flex-1 h-6 bg-gray-100 rounded border border-gray-200" />
        </div>
        <div className="h-4 bg-gray-50 rounded border border-gray-200" />
      </div>
    ),
    minimal: (
      <div className="h-full p-3 space-y-2">
        <div className="h-2.5 w-1/2 rounded" style={{ backgroundColor: color }} />
        <div className="h-1.5 w-full bg-gray-100 rounded" />
        <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
        <div className="h-px bg-gray-200 my-1.5" />
        <div className="h-1.5 w-full bg-gray-100 rounded" />
        <div className="h-1.5 w-2/3 bg-gray-100 rounded" />
      </div>
    ),
    creative: (
      <div className="h-full">
        <div className="h-1/3 rounded-t flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="w-6 h-6 bg-white/30 rounded-full" />
        </div>
        <div className="p-2 grid grid-cols-2 gap-1.5">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    executive: (
      <div className="h-full p-3 border-t-3" style={{ borderColor: color, borderTopWidth: '3px' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-2 w-16 bg-gray-300 rounded mb-1" />
            <div className="h-1.5 w-10 rounded" style={{ backgroundColor: color, opacity: 0.5 }} />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-gray-100 rounded" />
          <div className="h-1.5 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    compact: (
      <div className="h-full p-1.5 space-y-1">
        <div className="h-3 rounded" style={{ backgroundColor: color }} />
        <div className="flex gap-1">
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
            <div className="h-1 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    ),
    timeline: (
      <div className="h-full p-2 flex">
        <div className="w-1 rounded-full mr-2" style={{ backgroundColor: color }} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1.5 flex-1 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1.5 flex-1 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1.5 flex-1 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    ),
    cards: (
      <div className="h-full p-2 space-y-2 bg-gray-50">
        <div className="h-3.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
        <div className="h-3.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
        <div className="h-3.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
      </div>
    ),
    landing: (
      <div className="h-full flex flex-col">
        <div className="h-1/2 w-full flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="w-10 h-10 bg-white/20 rounded-full" />
        </div>
        <div className="flex-1 p-2 grid grid-cols-3 gap-1.5">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-100 rounded col-span-3" />
        </div>
      </div>
    )
  }

  return previewStyles[template.id] || previewStyles.classic
}

// Template Card Component
function TemplateCard({
  template,
  isSelected,
  onClick,
  color
}: {
  template: TemplateLayout
  isSelected: boolean
  onClick: () => void
  color: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative rounded-xl sm:rounded-2xl overflow-hidden text-left transition-all duration-200
        ${isSelected
          ? 'ring-2 ring-teal-500 ring-offset-2 shadow-lg scale-[1.02]'
          : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* Badges */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {template.popular && (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <StarSolid className="w-2.5 h-2.5" />
            Popular
          </span>
        )}
        {template.new && (
          <span className="bg-teal-100 text-teal-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <SparklesIcon className="w-2.5 h-2.5" />
            New
          </span>
        )}
      </div>

      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-10 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
          <CheckIcon className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Preview */}
      <div className="aspect-[3/4] bg-white">
        <TemplatePreview template={template} color={color} />
      </div>

      {/* Info */}
      <div className="p-3 bg-white border-t border-gray-100">
        <h4 className="font-semibold text-gray-900 text-sm">{template.name}</h4>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
      </div>

      {/* Hover overlay with features */}
      <div className="absolute inset-0 bg-black/70 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="p-3 text-white w-full">
          <p className="text-xs font-medium mb-2">{template.name}</p>
          <ul className="text-[10px] space-y-0.5">
            {template.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center gap-1">
                <CheckIcon className="w-2.5 h-2.5 text-teal-400" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}

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
        group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all
        ${isSelected
          ? 'bg-gray-100 ring-2 ring-teal-500 scale-105'
          : 'hover:bg-gray-50 hover:scale-105'
        }
      `}
      title={palette.name}
    >
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm transition-transform ${
          isSelected ? 'scale-110' : ''
        }`}
        style={{
          backgroundColor: palette.primary,
          border: palette.isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.05)'
        }}
      >
        {isSelected && (
          <CheckIcon className="w-5 h-5 text-white m-auto mt-2 sm:mt-3" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 truncate max-w-full">
        {palette.name}
      </span>
    </button>
  )
}

// Live Preview Component - renders different layouts based on selected template
function LivePreview({
  template,
  color,
  previewMode
}: {
  template: TemplateLayout
  color: ColorPalette
  previewMode: 'desktop' | 'mobile'
}) {
  const textColor = color.isDark ? '#F9FAFB' : '#1F2937'
  const mutedTextColor = color.isDark ? '#9CA3AF' : '#6B7280'
  const lineColor = color.isDark ? '#374151' : '#E5E7EB'
  const cardBg = color.isDark ? '#1F2937' : '#FFFFFF'
  const sectionBg = color.isDark ? '#111827' : '#F9FAFB'

  // Classic layout - left sidebar
  if (template.id === 'classic') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl flex" style={{ backgroundColor: color.background }}>
        {/* Left Sidebar */}
        <div className="w-1/3 p-3" style={{ backgroundColor: color.primary }}>
          <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-white text-center truncate">{SAMPLE_CV_DATA.sidebar.name}</h3>
          <p className="text-[10px] text-white/80 text-center truncate">{SAMPLE_CV_DATA.sidebar.tagline}</p>
          <div className="mt-3 space-y-1">
            <div className="h-1 w-full bg-white/20 rounded" />
            <div className="h-1 w-3/4 bg-white/20 rounded" />
            <div className="h-1 w-1/2 bg-white/20 rounded" />
          </div>
        </div>
        {/* Right Content */}
        <div className="flex-1 p-3 space-y-3">
          <div>
            <h4 className="text-xs font-semibold mb-1" style={{ color: color.primary }}>About</h4>
            <p className="text-[10px] leading-relaxed" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary.slice(0, 80)}...</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold mb-1" style={{ color: color.primary }}>Experience</h4>
            <p className="text-[10px] font-medium" style={{ color: textColor }}>{SAMPLE_CV_DATA.experiences.info[0].role}</p>
            <p className="text-[10px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[0].company}</p>
          </div>
        </div>
      </div>
    )
  }

  // Modern layout - card-based with header
  if (template.id === 'modern') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: color.background }}>
        <div className="p-3" style={{ backgroundColor: color.primary }}>
          <h3 className="text-sm font-bold text-white">{SAMPLE_CV_DATA.sidebar.name}</h3>
          <p className="text-xs text-white/80">{SAMPLE_CV_DATA.sidebar.tagline}</p>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg border" style={{ backgroundColor: cardBg, borderColor: lineColor }}>
            <h4 className="text-[10px] font-semibold mb-1" style={{ color: color.primary }}>About</h4>
            <p className="text-[9px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary.slice(0, 50)}...</p>
          </div>
          <div className="p-2 rounded-lg border" style={{ backgroundColor: cardBg, borderColor: lineColor }}>
            <h4 className="text-[10px] font-semibold mb-1" style={{ color: color.primary }}>Experience</h4>
            <p className="text-[9px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[0].role}</p>
          </div>
        </div>
        <div className="px-3 pb-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: sectionBg }}>
            <h4 className="text-[10px] font-semibold mb-1" style={{ color: color.primary }}>Skills</h4>
            <div className="flex gap-1 flex-wrap">
              {SAMPLE_CV_DATA.skills.toolset.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-[8px] px-1.5 py-0.5 rounded" style={{ backgroundColor: color.primary + '20', color: color.primary }}>{skill.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Minimal layout - single column, clean
  if (template.id === 'minimal') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl p-4" style={{ backgroundColor: color.background }}>
        <h3 className="text-sm font-bold mb-0.5" style={{ color: color.primary }}>{SAMPLE_CV_DATA.sidebar.name}</h3>
        <p className="text-xs mb-3" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.sidebar.tagline}</p>
        <div className="h-px mb-3" style={{ backgroundColor: lineColor }} />
        <p className="text-[10px] leading-relaxed mb-3" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary}</p>
        <div className="h-px mb-3" style={{ backgroundColor: lineColor }} />
        <h4 className="text-xs font-semibold mb-1" style={{ color: textColor }}>Experience</h4>
        <p className="text-[10px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[0].role} at {SAMPLE_CV_DATA.experiences.info[0].company}</p>
      </div>
    )
  }

  // Creative layout - hero header with grid
  if (template.id === 'creative') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: color.background }}>
        <div className="p-4 flex items-center justify-center" style={{ backgroundColor: color.primary }}>
          <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{SAMPLE_CV_DATA.sidebar.name.charAt(0)}</span>
          </div>
        </div>
        <div className="p-2 -mt-4">
          <div className="bg-white rounded-lg shadow p-2 text-center mb-2">
            <h3 className="text-xs font-bold" style={{ color: textColor }}>{SAMPLE_CV_DATA.sidebar.name}</h3>
            <p className="text-[10px]" style={{ color: color.primary }}>{SAMPLE_CV_DATA.sidebar.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-2 rounded-lg" style={{ backgroundColor: sectionBg }}>
              <h4 className="text-[10px] font-semibold" style={{ color: color.primary }}>Projects</h4>
              <p className="text-[9px]" style={{ color: mutedTextColor }}>8 works</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: sectionBg }}>
              <h4 className="text-[10px] font-semibold" style={{ color: color.primary }}>Experience</h4>
              <p className="text-[9px]" style={{ color: mutedTextColor }}>8+ years</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Executive layout - elegant with subtle accents
  if (template.id === 'executive') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl border-t-4" style={{ backgroundColor: color.background, borderColor: color.primary }}>
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full" style={{ backgroundColor: lineColor }} />
            <div>
              <h3 className="text-xs font-bold" style={{ color: textColor }}>{SAMPLE_CV_DATA.sidebar.name}</h3>
              <p className="text-[10px]" style={{ color: color.primary }}>{SAMPLE_CV_DATA.sidebar.tagline}</p>
            </div>
          </div>
          <div className="border-l-2 pl-2 mb-2" style={{ borderColor: color.primary }}>
            <p className="text-[10px] leading-relaxed" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary.slice(0, 100)}...</p>
          </div>
          <div className="flex gap-1">
            {SAMPLE_CV_DATA.skills.toolset.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[8px] px-1.5 py-0.5 rounded border" style={{ borderColor: lineColor, color: mutedTextColor }}>{skill.name}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Compact layout - dense, multi-column
  if (template.id === 'compact') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl" style={{ backgroundColor: color.background }}>
        <div className="p-2" style={{ backgroundColor: color.primary }}>
          <h3 className="text-xs font-bold text-white">{SAMPLE_CV_DATA.sidebar.name}</h3>
          <p className="text-[9px] text-white/80">{SAMPLE_CV_DATA.sidebar.tagline} | {SAMPLE_CV_DATA.sidebar.location}</p>
        </div>
        <div className="p-2 grid grid-cols-3 gap-1.5 text-[9px]">
          <div>
            <h4 className="font-semibold mb-0.5" style={{ color: color.primary }}>Experience</h4>
            <p style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[0].role}</p>
            <p style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[1]?.role}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-0.5" style={{ color: color.primary }}>Skills</h4>
            {SAMPLE_CV_DATA.skills.toolset.slice(0, 3).map((skill, i) => (
              <p key={i} style={{ color: mutedTextColor }}>{skill.name}</p>
            ))}
          </div>
          <div>
            <h4 className="font-semibold mb-0.5" style={{ color: color.primary }}>Contact</h4>
            <p style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.sidebar.email}</p>
            <p style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.sidebar.phone}</p>
          </div>
        </div>
      </div>
    )
  }

  // Timeline layout - visual timeline
  if (template.id === 'timeline') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl p-3 flex" style={{ backgroundColor: color.background }}>
        <div className="w-1 rounded-full mr-3" style={{ backgroundColor: color.primary }} />
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-2">
            <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: color.primary }} />
            <div>
              <h3 className="text-xs font-bold" style={{ color: textColor }}>{SAMPLE_CV_DATA.sidebar.name}</h3>
              <p className="text-[10px]" style={{ color: color.primary }}>{SAMPLE_CV_DATA.sidebar.tagline}</p>
            </div>
          </div>
          {SAMPLE_CV_DATA.experiences.info.slice(0, 2).map((exp, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: color.primary }} />
              <div>
                <p className="text-[10px] font-medium" style={{ color: textColor }}>{exp.role}</p>
                <p className="text-[9px]" style={{ color: mutedTextColor }}>{exp.company} | {exp.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Cards layout - floating card sections
  if (template.id === 'cards') {
    return (
      <div className="rounded-xl overflow-hidden shadow-xl p-3 space-y-2" style={{ backgroundColor: sectionBg }}>
        <div className="p-2.5 rounded-lg shadow-sm border-l-3" style={{ backgroundColor: cardBg, borderColor: color.primary, borderLeftWidth: '3px' }}>
          <h3 className="text-xs font-bold" style={{ color: textColor }}>{SAMPLE_CV_DATA.sidebar.name}</h3>
          <p className="text-[10px]" style={{ color: color.primary }}>{SAMPLE_CV_DATA.sidebar.tagline}</p>
        </div>
        <div className="p-2.5 rounded-lg shadow-sm border-l-3" style={{ backgroundColor: cardBg, borderColor: color.primary, borderLeftWidth: '3px' }}>
          <h4 className="text-[10px] font-semibold mb-0.5" style={{ color: color.primary }}>About</h4>
          <p className="text-[9px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary.slice(0, 60)}...</p>
        </div>
        <div className="p-2.5 rounded-lg shadow-sm border-l-3" style={{ backgroundColor: cardBg, borderColor: color.primary, borderLeftWidth: '3px' }}>
          <h4 className="text-[10px] font-semibold mb-0.5" style={{ color: color.primary }}>Experience</h4>
          <p className="text-[9px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA.experiences.info[0].role}</p>
        </div>
      </div>
    )
  }

  // Default fallback (same as classic)
  return (
    <div className="rounded-xl overflow-hidden shadow-xl flex" style={{ backgroundColor: color.background }}>
      <div className="w-1/3 p-3" style={{ backgroundColor: color.primary }}>
        <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-2" />
        <h3 className="text-xs font-bold text-white text-center truncate">{SAMPLE_CV_DATA.sidebar.name}</h3>
      </div>
      <div className="flex-1 p-3">
        <p className="text-[10px]" style={{ color: mutedTextColor }}>{SAMPLE_CV_DATA['career-profile'].summary.slice(0, 80)}...</p>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateLayoutId>('classic')
  const [selectedColor, setSelectedColor] = useState('teal')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const activeTemplate = TEMPLATE_LAYOUTS.find(t => t.id === selectedTemplate) || TEMPLATE_LAYOUTS[0]
  const activeColor = getColorPalette(selectedColor) || COLOR_PALETTES[0]

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return TEMPLATE_LAYOUTS
    const query = searchQuery.toLowerCase()
    return TEMPLATE_LAYOUTS.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const groupedColors = useMemo(() => {
    return COLOR_CATEGORIES.map(cat => ({
      ...cat,
      palettes: COLOR_PALETTES.filter(p => p.category === cat.id)
    }))
  }, [])

  const handleTemplateSelect = (templateId: TemplateLayoutId) => {
    setSelectedTemplate(templateId)
    if (window.innerWidth < 1024) {
      setShowMobilePreview(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1%, transparent 1%), radial-gradient(circle at 75% 75%, white 1%, transparent 1%)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl lg:max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 backdrop-blur rounded-full mb-4 sm:mb-6">
              <Squares2X2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-300" />
              <span className="text-teal-200 text-xs sm:text-sm font-medium">
                {TEMPLATE_LAYOUTS.length} Layouts + {COLOR_PALETTES.length} Colors
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Choose Layout
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {' '}+ Pick Colors
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-xl">
              Select from 8 unique template layouts, then customize with 17 color palettes. Mix and match for the perfect CV.
            </p>

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

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 52.5C120 45 240 30 360 22.5C480 15 600 15 720 18.75C840 22.5 960 30 1080 33.75C1200 37.5 1320 37.5 1380 37.5L1440 37.5V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Templates & Colors */}
          <div className="lg:col-span-2 space-y-8">
            {/* Template Layouts Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Squares2X2Icon className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Choose Layout
                  </h2>
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-32 sm:w-40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    color={activeColor.primary}
                  />
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <Squares2X2Icon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-sm text-gray-500 mb-4">Try a different search term</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </section>

            {/* Color Palettes Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <SwatchIcon className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Pick Your Colors
                </h2>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 space-y-6">
                  {groupedColors.map(category => (
                    <div key={category.id}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
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

                {/* Selected Color Details */}
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg shadow-inner"
                        style={{ backgroundColor: activeColor.primary }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{activeColor.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{activeColor.category} palette</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[activeColor.primary, activeColor.secondary, activeColor.accent].map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Live Preview */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-700 text-sm">Live Preview</span>
                  </div>

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

                <div
                  className={`p-3 overflow-auto ${activeColor.isDark ? 'bg-gray-900' : 'bg-gray-100'}`}
                  style={{ maxHeight: '55vh' }}
                >
                  <div className={`transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-[200px] mx-auto' : ''}`}>
                    <LivePreview template={activeTemplate} color={activeColor} previewMode={previewMode} />
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{activeTemplate.name}</h3>
                      <p className="text-xs text-gray-500">{activeColor.name} palette</p>
                    </div>
                    <div
                      className="w-6 h-6 rounded-lg shadow-inner"
                      style={{ backgroundColor: activeColor.primary }}
                    />
                  </div>

                  <Link
                    href={`/builder?template=${selectedTemplate}&color=${selectedColor}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    Use This Combination
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
                    Mix any layout with any color
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    Dark palettes work great at night
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckIcon className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    Professional colors for corporate roles
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobilePreview(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden">
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl"
                  style={{ backgroundColor: activeColor.primary }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{activeTemplate.name}</h3>
                  <p className="text-sm text-gray-500">{activeColor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div
              className="p-4 overflow-auto"
              style={{ maxHeight: 'calc(85vh - 180px)', backgroundColor: activeColor.isDark ? '#1a1a1a' : '#f3f4f6' }}
            >
              <LivePreview template={activeTemplate} color={activeColor} previewMode="mobile" />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <Link
                href={`/builder?template=${selectedTemplate}&color=${selectedColor}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all"
              >
                Use This Combination
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
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
            href={`/builder?template=${selectedTemplate}&color=${selectedColor}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all text-sm"
          >
            Use Template
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="h-20 lg:hidden" />

      <Footer />
    </div>
  )
}
