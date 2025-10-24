'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface ThemeSwitcherProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

const themes = [
  { name: 'blue', label: 'Professional Blue', color: '#2E86AB' },
  { name: 'turquoise', label: 'Modern Turquoise', color: '#17a2b8' },
  { name: 'green', label: 'Fresh Green', color: '#28a745' },
  { name: 'berry', label: 'Creative Berry', color: '#8e44ad' },
  { name: 'orange', label: 'Vibrant Orange', color: '#fd7e14' },
  { name: 'ceramic', label: 'Warm Ceramic', color: '#d4926d' },
  { name: 'teal', label: 'Cool Teal', color: '#20c997' },
  { name: 'oceanstale', label: 'Neutral Gray', color: '#6c757d' },
]

export function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentThemeData = themes.find(t => t.name === currentTheme) || themes[6] // Default to teal

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <div
          className="w-4 h-4 rounded-full border border-gray-300"
          style={{ backgroundColor: currentThemeData.color }}
        />
        <span className="hidden sm:inline">{currentThemeData.label}</span>
        <span className="sm:hidden">Theme</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Choose Theme
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => {
                    onThemeChange(theme.name)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors ${
                    currentTheme === theme.name ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-xs text-gray-500 capitalize">{theme.name} theme</div>
                  </div>
                  {currentTheme === theme.name && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 mt-2">
              More themes coming soon!
            </div>
          </div>
        </>
      )}
    </div>
  )
}