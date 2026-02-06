'use client'

import { useState, useRef, useEffect } from 'react'
import { SwatchIcon, CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { COLOR_PALETTES, type ColorPalette } from '@/lib/templates'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (colorId: string) => void
  compact?: boolean
}

const CATEGORY_LABELS: Record<ColorPalette['category'], string> = {
  professional: 'Professional',
  vibrant: 'Vibrant',
  neutral: 'Neutral',
  dark: 'Dark Mode'
}

export function ColorPicker({ selectedColor, onColorChange, compact = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentPalette = COLOR_PALETTES.find(c => c.id === selectedColor) || COLOR_PALETTES[0]

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const groupedColors = COLOR_PALETTES.reduce((acc, palette) => {
    if (!acc[palette.category]) acc[palette.category] = []
    acc[palette.category].push(palette)
    return acc
  }, {} as Record<string, ColorPalette[]>)

  if (compact) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentPalette.primary }}
          />
          <span className="text-sm font-medium text-gray-700">{currentPalette.name}</span>
          <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-3 max-h-80 overflow-y-auto">
              {Object.entries(groupedColors).map(([category, palettes]) => (
                <div key={category} className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    {CATEGORY_LABELS[category as ColorPalette['category']]}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {palettes.map(palette => (
                      <button
                        key={palette.id}
                        onClick={() => {
                          onColorChange(palette.id)
                          setIsOpen(false)
                        }}
                        className={`group relative w-full aspect-square rounded-lg transition-all ${
                          selectedColor === palette.id
                            ? 'ring-2 ring-offset-2 ring-teal-500 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: palette.primary }}
                        title={palette.name}
                      >
                        {selectedColor === palette.id && (
                          <CheckIcon className="w-4 h-4 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Full color chart view
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <SwatchIcon className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Color Palette</h3>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(groupedColors).map(([category, palettes]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[category as ColorPalette['category']]}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {palettes.map(palette => (
                <button
                  key={palette.id}
                  onClick={() => onColorChange(palette.id)}
                  className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                    selectedColor === palette.id
                      ? 'bg-gray-100 ring-2 ring-teal-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full shadow-sm transition-transform group-hover:scale-110 ${
                      selectedColor === palette.id ? 'scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: palette.primary,
                      border: palette.isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    {selectedColor === palette.id && (
                      <CheckIcon className="w-5 h-5 text-white m-auto mt-2" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600 truncate max-w-full">
                    {palette.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom color option hint */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Want more colors? Custom color picker coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

// Inline color strip for quick selection
export function ColorStrip({
  selectedColor,
  onColorChange,
  showLabels = false
}: {
  selectedColor: string
  onColorChange: (colorId: string) => void
  showLabels?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLOR_PALETTES.slice(0, 12).map(palette => (
        <button
          key={palette.id}
          onClick={() => onColorChange(palette.id)}
          className={`group relative transition-all ${
            selectedColor === palette.id
              ? 'scale-110'
              : 'hover:scale-105'
          }`}
          title={palette.name}
        >
          <div
            className={`w-8 h-8 rounded-full shadow-sm ${
              selectedColor === palette.id
                ? 'ring-2 ring-offset-2 ring-teal-500'
                : ''
            }`}
            style={{
              backgroundColor: palette.primary,
              border: palette.isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid rgba(0,0,0,0.05)'
            }}
          >
            {selectedColor === palette.id && (
              <CheckIcon className="w-4 h-4 text-white m-auto mt-1.5" />
            )}
          </div>
          {showLabels && (
            <span className="block text-[10px] text-gray-500 text-center mt-1 truncate max-w-[40px]">
              {palette.name}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
