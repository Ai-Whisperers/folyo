'use client'

import { useState } from 'react'
import { CheckIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'
import { TEMPLATE_LAYOUTS, type TemplateLayoutId, type TemplateLayout } from '@/lib/templates'

interface TemplateSelectorProps {
  selectedTemplate: TemplateLayoutId
  onTemplateChange: (templateId: TemplateLayoutId) => void
  previewColor?: string
}

// Mini preview representations for each template layout
function TemplatePreview({ template, color }: { template: TemplateLayout; color: string }) {
  const previewStyles: Record<TemplateLayoutId, JSX.Element> = {
    classic: (
      // Classic: Left sidebar layout
      <div className="flex h-full">
        <div className="w-1/3 h-full rounded-l" style={{ backgroundColor: color }} />
        <div className="flex-1 p-1.5 space-y-1">
          <div className="h-1.5 w-3/4 bg-gray-200 rounded" />
          <div className="h-1 w-full bg-gray-100 rounded" />
          <div className="h-1 w-2/3 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    modern: (
      // Modern: Card-based with header
      <div className="h-full p-1.5 space-y-1.5">
        <div className="h-3 w-full rounded" style={{ backgroundColor: color }} />
        <div className="flex gap-1">
          <div className="flex-1 h-4 bg-gray-100 rounded border border-gray-200" />
          <div className="flex-1 h-4 bg-gray-100 rounded border border-gray-200" />
        </div>
        <div className="h-3 bg-gray-50 rounded border border-gray-200" />
      </div>
    ),
    minimal: (
      // Minimal: Single column, clean
      <div className="h-full p-2 space-y-1.5">
        <div className="h-2 w-1/2 rounded" style={{ backgroundColor: color }} />
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-3/4 bg-gray-100 rounded" />
        <div className="h-px bg-gray-200 my-1" />
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-2/3 bg-gray-100 rounded" />
      </div>
    ),
    creative: (
      // Creative: Hero header with grid
      <div className="h-full">
        <div className="h-1/3 rounded-t flex items-center justify-center" style={{ backgroundColor: color }}>
          <div className="w-4 h-4 bg-white/30 rounded-full" />
        </div>
        <div className="p-1.5 grid grid-cols-2 gap-1">
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
          <div className="h-3 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    executive: (
      // Executive: Elegant with subtle accents
      <div className="h-full p-2 border-t-2" style={{ borderColor: color }}>
        <div className="flex items-center gap-1 mb-2">
          <div className="w-5 h-5 rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-1.5 w-12 bg-gray-300 rounded mb-0.5" />
            <div className="h-1 w-8 rounded" style={{ backgroundColor: color, opacity: 0.5 }} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-1 w-full bg-gray-100 rounded" />
          <div className="h-1 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    ),
    compact: (
      // Compact: Dense, multi-column
      <div className="h-full p-1 space-y-0.5">
        <div className="h-2 rounded" style={{ backgroundColor: color }} />
        <div className="flex gap-0.5">
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
      // Timeline: Visual timeline
      <div className="h-full p-1.5 flex">
        <div className="w-1 rounded-full mr-2" style={{ backgroundColor: color }} />
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1 flex-1 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1 flex-1 bg-gray-100 rounded" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <div className="h-1 flex-1 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    ),
    cards: (
      // Cards: Floating card sections
      <div className="h-full p-2 space-y-1.5 bg-gray-50">
        <div className="h-2.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
        <div className="h-2.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
        <div className="h-2.5 bg-white rounded shadow-sm border-l-2" style={{ borderColor: color }} />
      </div>
    )
  }

  return previewStyles[template.id] || previewStyles.classic
}

export function TemplateSelector({ selectedTemplate, onTemplateChange, previewColor = '#0D9488' }: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<TemplateLayoutId | null>(null)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {TEMPLATE_LAYOUTS.map(template => {
        const isSelected = selectedTemplate === template.id
        const isHovered = hoveredTemplate === template.id

        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            className={`
              group relative rounded-xl overflow-hidden transition-all duration-200
              ${isSelected
                ? 'ring-2 ring-teal-500 ring-offset-2 shadow-lg'
                : 'border border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {/* Badges */}
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              {template.popular && (
                <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <StarIcon className="w-2.5 h-2.5" />
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
              <TemplatePreview template={template} color={previewColor} />
            </div>

            {/* Info */}
            <div className="p-3 bg-white border-t border-gray-100">
              <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{template.description}</p>
            </div>

            {/* Hover overlay with features */}
            {(isHovered || isSelected) && (
              <div className="absolute inset-0 bg-black/60 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-3 text-white w-full">
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
            )}
          </button>
        )
      })}
    </div>
  )
}

// Compact horizontal template selector
export function TemplateStrip({
  selectedTemplate,
  onTemplateChange,
  previewColor = '#0D9488'
}: TemplateSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {TEMPLATE_LAYOUTS.map(template => {
        const isSelected = selectedTemplate === template.id

        return (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`
              flex-shrink-0 rounded-lg overflow-hidden transition-all
              ${isSelected
                ? 'ring-2 ring-teal-500 scale-105'
                : 'border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="w-16 h-20 bg-white">
              <TemplatePreview template={template} color={previewColor} />
            </div>
            <div className="px-1.5 py-1 bg-gray-50 border-t border-gray-100">
              <span className="text-[10px] font-medium text-gray-700">{template.name}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
