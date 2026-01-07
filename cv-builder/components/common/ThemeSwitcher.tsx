'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ChevronDownIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import {
  getThemeConfig,
  getAllThemes,
  isDarkTheme,
  COLOR_PALETTES,
  type ColorPalette
} from '@/lib/utils/theme'
import type { ThemeConfig } from '@/lib/types/cv'

interface ThemeSwitcherProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
  /** Use compact color-only mode (uses new COLOR_PALETTES) */
  colorMode?: boolean
}

// Category order and labels for legacy theme system
const categoryConfig = {
  professional: { label: 'Professional', icon: '💼', description: 'Clean and corporate' },
  creative: { label: 'Creative', icon: '🎨', description: 'Vibrant and expressive' },
  minimal: { label: 'Minimal', icon: '✨', description: 'Simple and refined' },
  bold: { label: 'Bold', icon: '🔥', description: 'Stand out from the crowd' },
} as const

// Category config for new color palette system
const colorCategoryConfig = {
  professional: { label: 'Professional', icon: '💼' },
  vibrant: { label: 'Vibrant', icon: '🎨' },
  neutral: { label: 'Neutral', icon: '✨' },
  dark: { label: 'Dark Mode', icon: '🌙' },
} as const

type CategoryKey = keyof typeof categoryConfig
type ColorCategoryKey = keyof typeof colorCategoryConfig

// Group themes by category
function groupThemesByCategory(themes: ThemeConfig[]) {
  const grouped: Record<string, ThemeConfig[]> = {}
  const categoryOrder: CategoryKey[] = ['professional', 'creative', 'minimal', 'bold']

  for (const category of categoryOrder) {
    grouped[category] = themes.filter(t => t.category === category)
  }

  return grouped
}

// Group color palettes by category
function groupColorsByCategory(colors: ColorPalette[]) {
  const grouped: Record<string, ColorPalette[]> = {}
  const categoryOrder: ColorCategoryKey[] = ['professional', 'vibrant', 'neutral', 'dark']

  for (const category of categoryOrder) {
    grouped[category] = colors.filter(c => c.category === category)
  }

  return grouped
}

export function ThemeSwitcher({ currentTheme, onThemeChange, colorMode = false }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Get all themes from the unified system
  const themes = useMemo(() => getAllThemes(), [])
  const groupedThemes = useMemo(() => groupThemesByCategory(themes), [themes])

  // Group colors for color mode
  const groupedColors = useMemo(() => groupColorsByCategory(COLOR_PALETTES), [])

  // Create flat list for keyboard navigation
  const flatThemes = useMemo(() => {
    const flat: ThemeConfig[] = []
    const categoryOrder: CategoryKey[] = ['professional', 'creative', 'minimal', 'bold']
    for (const category of categoryOrder) {
      flat.push(...(groupedThemes[category] || []))
    }
    return flat
  }, [groupedThemes])

  const flatColors = useMemo(() => {
    const flat: ColorPalette[] = []
    const categoryOrder: ColorCategoryKey[] = ['professional', 'vibrant', 'neutral', 'dark']
    for (const category of categoryOrder) {
      flat.push(...(groupedColors[category] || []))
    }
    return flat
  }, [groupedColors])

  const currentThemeData = useMemo(() => getThemeConfig(currentTheme), [currentTheme])
  const currentColorData = useMemo(() =>
    COLOR_PALETTES.find(c => c.id === currentTheme) || COLOR_PALETTES[0],
    [currentTheme]
  )

  const currentIndex = colorMode
    ? flatColors.findIndex(c => c.id === currentTheme)
    : flatThemes.findIndex(t => t.id === currentTheme)

  const itemCount = colorMode ? flatColors.length : flatThemes.length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Focus management
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.focus()
    }
  }, [focusedIndex, isOpen])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        setIsOpen(true)
        setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
      }
      return
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setFocusedIndex(-1)
        buttonRef.current?.focus()
        break
      case 'ArrowDown':
        event.preventDefault()
        setFocusedIndex(prev => (prev + 1) % itemCount)
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount)
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(itemCount - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0) {
          const selectedId = colorMode
            ? flatColors[focusedIndex].id
            : flatThemes[focusedIndex].id
          onThemeChange(selectedId)
          setIsOpen(false)
          setFocusedIndex(-1)
          buttonRef.current?.focus()
        }
        break
      case 'Tab':
        setIsOpen(false)
        setFocusedIndex(-1)
        break
    }
  }, [isOpen, focusedIndex, currentIndex, onThemeChange, flatThemes, flatColors, itemCount, colorMode])

  const handleOptionClick = (id: string) => {
    onThemeChange(id)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  // Track flat index for keyboard navigation
  let flatIndex = -1

  // Render color mode (simplified palette selector)
  if (colorMode) {
    return (
      <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
        <button
          ref={buttonRef}
          onClick={() => {
            setIsOpen(!isOpen)
            if (!isOpen) {
              setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
            }
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select color. Current: ${currentColorData.name}`}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
            style={{ backgroundColor: currentColorData.primary }}
            aria-hidden="true"
          />
          <span className="hidden sm:inline truncate max-w-[120px]">{currentColorData.name}</span>
          <span className="sm:hidden">Color</span>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10 bg-black/20 sm:bg-transparent"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200"
              role="listbox"
              aria-label="Color options"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Choose Color</div>
                  <div className="text-xs text-gray-500">{flatColors.length} colors available</div>
                </div>
                <SparklesIcon className="w-5 h-5 text-teal-500" />
              </div>

              <div className="max-h-80 overflow-y-auto p-3">
                {(Object.keys(colorCategoryConfig) as ColorCategoryKey[]).map((categoryKey) => {
                  const categoryColors = groupedColors[categoryKey]
                  if (!categoryColors || categoryColors.length === 0) return null

                  const config = colorCategoryConfig[categoryKey]

                  return (
                    <div key={categoryKey} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-sm">{config.icon}</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {config.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {categoryColors.map((color) => {
                          flatIndex++
                          const idx = flatIndex
                          const isSelected = currentTheme === color.id
                          const isFocused = focusedIndex === idx

                          return (
                            <button
                              key={color.id}
                              id={`color-option-${color.id}`}
                              ref={el => { optionRefs.current[idx] = el }}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleOptionClick(color.id)}
                              onMouseEnter={() => setFocusedIndex(idx)}
                              className={`
                                group relative aspect-square rounded-lg transition-all
                                ${isSelected
                                  ? 'ring-2 ring-teal-500 ring-offset-2 scale-110'
                                  : isFocused
                                    ? 'ring-2 ring-gray-300 scale-105'
                                    : 'hover:scale-105'
                                }
                                focus:outline-none
                              `}
                              style={{ backgroundColor: color.primary }}
                              title={color.name}
                            >
                              {isSelected && (
                                <CheckIcon className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50/50">
                <span className="text-gray-500">Tip:</span> Use ↑↓ to navigate, Enter to select
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Render full theme mode (legacy behavior)
  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) {
            setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select theme. Current theme: ${currentThemeData.name}`}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
          style={{ backgroundColor: currentThemeData.primaryColor }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline truncate max-w-[120px]">{currentThemeData.name}</span>
        <span className="sm:hidden">Theme</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-10 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-20 animate-in fade-in slide-in-from-top-2 duration-200"
            role="listbox"
            aria-label="Theme options"
            aria-activedescendant={focusedIndex >= 0 ? `theme-option-${flatThemes[focusedIndex].id}` : undefined}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-gray-900">Choose Theme</div>
                <div className="text-xs text-gray-500">{flatThemes.length} themes available</div>
              </div>
              <SparklesIcon className="w-5 h-5 text-teal-500" />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {(Object.keys(categoryConfig) as CategoryKey[]).map((categoryKey) => {
                const categoryThemes = groupedThemes[categoryKey]
                if (!categoryThemes || categoryThemes.length === 0) return null

                const config = categoryConfig[categoryKey]

                return (
                  <div key={categoryKey} className="border-b border-gray-50 last:border-0">
                    {/* Category Header */}
                    <div className="px-4 py-2 bg-gray-50/80 sticky top-0 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{config.icon}</span>
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {config.label}
                        </span>
                        <span className="text-xs text-gray-400">({categoryThemes.length})</span>
                      </div>
                    </div>

                    {/* Theme Options */}
                    <div className="py-1">
                      {categoryThemes.map((theme) => {
                        flatIndex++
                        const idx = flatIndex
                        const isSelected = currentTheme === theme.id
                        const isFocused = focusedIndex === idx
                        const isDark = isDarkTheme(theme)

                        return (
                          <button
                            key={theme.id}
                            id={`theme-option-${theme.id}`}
                            ref={el => { optionRefs.current[idx] = el }}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleOptionClick(theme.id)}
                            onMouseEnter={() => setFocusedIndex(idx)}
                            className={`
                              w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left transition-all duration-150
                              ${isSelected
                                ? 'bg-teal-50 text-teal-700'
                                : isFocused
                                  ? 'bg-gray-50 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }
                              focus:outline-none focus:bg-gray-100
                            `}
                          >
                            {/* Theme color preview */}
                            <div className="relative flex-shrink-0">
                              <div
                                className={`
                                  w-8 h-8 rounded-lg border-2 transition-transform duration-150 flex items-center justify-center
                                  ${isSelected ? 'border-teal-500 scale-105' : 'border-gray-200'}
                                `}
                                style={{ backgroundColor: theme.bgColor }}
                                aria-hidden="true"
                              >
                                {/* Inner accent circle */}
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.primaryColor }}
                                />
                              </div>
                              {isDark && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-300 flex items-center justify-center">
                                  <span className="text-[6px]">🌙</span>
                                </div>
                              )}
                            </div>

                            {/* Theme info */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{theme.name}</div>
                              {theme.description && (
                                <div className="text-xs text-gray-400 truncate">{theme.description}</div>
                              )}
                            </div>

                            {/* Selected check */}
                            {isSelected && (
                              <CheckIcon className="w-5 h-5 text-teal-600 flex-shrink-0" aria-hidden="true" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100 bg-gray-50/50">
              <span className="text-gray-500">Tip:</span> Use ↑↓ to navigate, Enter to select
            </div>
          </div>
        </>
      )}
    </div>
  )
}
