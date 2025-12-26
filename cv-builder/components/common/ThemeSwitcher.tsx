'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { ChevronDownIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { colors } from '@/lib/design-system'

interface ThemeSwitcherProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

// Type for theme entries
type ThemeEntry = {
  primary: string
  secondary: string
  text: string
  bg: string
  accent: string
  category: string
  label: string
  gradient?: string
}

// Category order and labels
const categoryConfig = {
  professional: { label: 'Professional', icon: '💼', description: 'Clean and corporate' },
  creative: { label: 'Creative & Bold', icon: '🎨', description: 'Vibrant and expressive' },
  minimal: { label: 'Minimal', icon: '✨', description: 'Simple and refined' },
  videography: { label: 'Videography', icon: '🎬', description: 'For video professionals' },
  dark: { label: 'Dark Mode', icon: '🌙', description: 'Elegant dark themes' },
  executive: { label: 'Executive', icon: '👔', description: 'Luxury and prestige' },
  tech: { label: 'Tech & Developer', icon: '💻', description: 'For developers' },
  gradient: { label: 'Gradient', icon: '🌈', description: 'Modern gradients' },
} as const

type CategoryKey = keyof typeof categoryConfig

// Convert themes from design system to array format
function getThemesFromDesignSystem() {
  const themes: { name: string; label: string; color: string; category: string; gradient?: string; bgColor: string }[] = []

  for (const [name, theme] of Object.entries(colors.themes)) {
    const typedTheme = theme as ThemeEntry
    themes.push({
      name,
      label: typedTheme.label,
      color: typedTheme.primary,
      category: typedTheme.category,
      gradient: typedTheme.gradient,
      bgColor: typedTheme.bg,
    })
  }

  return themes
}

// Group themes by category
function groupThemesByCategory(themes: ReturnType<typeof getThemesFromDesignSystem>) {
  const grouped: Record<string, typeof themes> = {}
  const categoryOrder: CategoryKey[] = ['professional', 'creative', 'minimal', 'videography', 'dark', 'executive', 'tech', 'gradient']

  for (const category of categoryOrder) {
    grouped[category] = themes.filter(t => t.category === category)
  }

  return grouped
}

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Get themes from design system
  const themes = useMemo(() => getThemesFromDesignSystem(), [])
  const groupedThemes = useMemo(() => groupThemesByCategory(themes), [themes])

  // Create flat list for keyboard navigation
  const flatThemes = useMemo(() => {
    const flat: typeof themes = []
    const categoryOrder: CategoryKey[] = ['professional', 'creative', 'minimal', 'videography', 'dark', 'executive', 'tech', 'gradient']
    for (const category of categoryOrder) {
      flat.push(...(groupedThemes[category] || []))
    }
    return flat
  }, [groupedThemes])

  const currentThemeData = themes.find(t => t.name === currentTheme) || themes[0]
  const currentIndex = flatThemes.findIndex(t => t.name === currentTheme)

  // Check if current theme is dark
  const isDarkTheme = currentThemeData?.bgColor?.startsWith('#0') ||
                      currentThemeData?.bgColor?.startsWith('#1') ||
                      currentThemeData?.category === 'dark' ||
                      currentThemeData?.category === 'tech' || currentThemeData?.category === 'videography'

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
        setFocusedIndex(prev => (prev + 1) % flatThemes.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setFocusedIndex(prev => (prev - 1 + flatThemes.length) % flatThemes.length)
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedIndex(flatThemes.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (focusedIndex >= 0) {
          onThemeChange(flatThemes[focusedIndex].name)
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
  }, [isOpen, focusedIndex, currentIndex, onThemeChange, flatThemes])

  const handleOptionClick = (themeName: string) => {
    onThemeChange(themeName)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  // Track flat index for keyboard navigation
  let flatIndex = -1

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
        aria-label={`Select theme. Current theme: ${currentThemeData.label}`}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
          style={{
            backgroundColor: currentThemeData.color,
            background: currentThemeData.gradient || currentThemeData.color
          }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline truncate max-w-[120px]">{currentThemeData.label}</span>
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
            aria-activedescendant={focusedIndex >= 0 ? `theme-option-${flatThemes[focusedIndex].name}` : undefined}
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
                      </div>
                    </div>

                    {/* Theme Options */}
                    <div className="py-1">
                      {categoryThemes.map((theme) => {
                        flatIndex++
                        const idx = flatIndex
                        const isSelected = currentTheme === theme.name
                        const isFocused = focusedIndex === idx
                        const isDark = theme.bgColor?.startsWith('#0') ||
                                       theme.bgColor?.startsWith('#1') ||
                                       categoryKey === 'dark' ||
                                       categoryKey === 'tech'

                        return (
                          <button
                            key={theme.name}
                            id={`theme-option-${theme.name}`}
                            ref={el => { optionRefs.current[idx] = el }}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleOptionClick(theme.name)}
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
                                style={{
                                  backgroundColor: theme.bgColor,
                                  background: theme.gradient || theme.bgColor
                                }}
                                aria-hidden="true"
                              >
                                {/* Inner accent circle */}
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: theme.color }}
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
                              <div className="font-medium truncate">{theme.label}</div>
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
