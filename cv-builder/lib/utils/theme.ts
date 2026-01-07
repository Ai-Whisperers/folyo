/**
 * Shared Theme Utilities
 * Single source of truth for theme-related functions across all pages
 */

import { THEME_CONFIGS, ThemeConfig, ThemeSkin } from '@/lib/types/cv'
import {
  COLOR_PALETTES,
  TEMPLATE_LAYOUTS,
  getColorPalette,
  getTemplateLayout,
  colorPaletteToThemeConfig,
  isColorDark,
  type ColorPalette,
  type TemplateLayout,
  type TemplateLayoutId,
  LEGACY_THEME_CONFIGS
} from '@/lib/templates'

// Re-export new template system for easier access
export {
  COLOR_PALETTES,
  TEMPLATE_LAYOUTS,
  getColorPalette,
  getTemplateLayout,
  colorPaletteToThemeConfig,
  isColorDark,
  LEGACY_THEME_CONFIGS
}
export type { ColorPalette, TemplateLayout, TemplateLayoutId }

// ============================================================================
// Theme Data Types
// ============================================================================

export interface ThemeColors {
  primary: string
  secondary: string
  text: string
  bg: string
  accent: string
  category: string
  name: string
  description?: string
}

// ============================================================================
// Theme Functions
// ============================================================================

/**
 * Get theme configuration by ID
 * First checks new color palettes, then falls back to legacy themes
 * Returns default (teal) theme if not found
 */
export const getThemeConfig = (themeId: string | undefined): ThemeConfig => {
  if (!themeId) return THEME_CONFIGS[0]

  // First check if it's a new color palette ID
  const colorPalette = getColorPalette(themeId)
  if (colorPalette) {
    return colorPaletteToThemeConfig(colorPalette) as ThemeConfig
  }

  // Fall back to legacy THEME_CONFIGS
  const theme = THEME_CONFIGS.find(t => t.id === themeId)
  return theme || THEME_CONFIGS[0]
}

/**
 * Get all available themes (combines new palettes with legacy themes)
 */
export const getAllThemes = (): ThemeConfig[] => {
  // Start with legacy themes converted from new color palettes
  const newThemes = LEGACY_THEME_CONFIGS as ThemeConfig[]

  // Add any legacy themes that don't have an equivalent in new system
  const newThemeIds = new Set(newThemes.map(t => t.id))
  const uniqueLegacyThemes = THEME_CONFIGS.filter(t => !newThemeIds.has(t.id))

  return [...newThemes, ...uniqueLegacyThemes]
}

/**
 * Get theme colors mapped to a simpler interface
 * Used for components that need a flatter color structure
 */
export const getThemeColors = (themeId: string): ThemeColors => {
  const config = getThemeConfig(themeId)
  return {
    primary: config.primaryColor,
    secondary: config.secondaryColor,
    text: config.textColor,
    bg: config.bgColor,
    accent: config.accentColor,
    category: config.category,
    name: config.name,
    description: config.description,
  }
}

/**
 * Check if a theme is dark based on background color
 * Used for determining text colors and UI variants
 */
export const isDarkTheme = (theme: ThemeConfig | ThemeColors | string): boolean => {
  // If it's a string (theme ID), check color palette first
  if (typeof theme === 'string') {
    const palette = getColorPalette(theme)
    if (palette) {
      return isColorDark(palette.background)
    }
    const config = getThemeConfig(theme)
    return isDarkTheme(config)
  }

  const bgColor = ('bgColor' in theme ? theme.bgColor : theme.bg)?.toLowerCase() || ''

  // Use the isColorDark function for consistent dark detection
  if (bgColor) {
    return isColorDark(bgColor)
  }

  // Check category for known dark themes
  const isDarkCategory = theme.category === 'bold'

  // Known dark theme IDs
  const darkThemeIds = [
    'video-portfolio',
    'midnight',
    'indigo',
    'charcoal',
    'crimson',
    'burgundy',
    'plum',
    'rust',
    'wine',
    'mocha',
    'graphite'
  ]

  const themeId = 'id' in theme ? (theme as ThemeConfig).id : null
  const isKnownDark = themeId ? darkThemeIds.includes(themeId) : false

  return isDarkCategory || isKnownDark
}

/**
 * Get navbar variant based on theme
 */
export const getNavbarVariant = (theme: ThemeConfig | string): 'light' | 'dark' => {
  const themeConfig = typeof theme === 'string' ? getThemeConfig(theme) : theme
  return isDarkTheme(themeConfig) ? 'dark' : 'light'
}

/**
 * Get contrasting text color for a background
 */
export const getContrastColor = (theme: ThemeConfig): string => {
  return isDarkTheme(theme) ? '#FFFFFF' : '#1F2937'
}

/**
 * Generate CSS custom properties for a theme
 */
export const getThemeCSSVars = (theme: ThemeConfig): Record<string, string> => {
  return {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-text': theme.textColor,
    '--theme-bg': theme.bgColor,
    '--theme-accent': theme.accentColor,
  }
}

/**
 * Get themes by category
 */
export const getThemesByCategory = (category: string): ThemeConfig[] => {
  const allThemes = getAllThemes()
  if (category === 'all') return allThemes
  return allThemes.filter(t => t.category === category)
}

/**
 * Get category counts for filter badges
 */
export const getThemeCategoryCounts = (): Record<string, number> => {
  const allThemes = getAllThemes()
  const counts: Record<string, number> = { all: allThemes.length }
  allThemes.forEach(theme => {
    counts[theme.category] = (counts[theme.category] || 0) + 1
  })
  return counts
}

/**
 * Search themes by name, category, or description
 */
export const searchThemes = (query: string): ThemeConfig[] => {
  const allThemes = getAllThemes()
  if (!query.trim()) return allThemes
  const lowerQuery = query.toLowerCase()
  return allThemes.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery) ||
    t.description?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get color palettes by category
 */
export const getColorPalettesByCategory = (category: ColorPalette['category'] | 'all'): ColorPalette[] => {
  if (category === 'all') return COLOR_PALETTES
  return COLOR_PALETTES.filter(p => p.category === category)
}

// ============================================================================
// Slug Utilities
// ============================================================================

/**
 * Generate URL-safe slug from a name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || 'my-portfolio'
}

/**
 * Generate portfolio URL from name
 */
export const getPortfolioUrl = (name: string, origin?: string): string => {
  const slug = generateSlug(name)
  const baseUrl = origin || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${baseUrl}/portfolio/${slug}`
}

// ============================================================================
// Animation Styles (consistent across pages)
// ============================================================================

export const SHARED_ANIMATIONS = `
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }

  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`

// ============================================================================
// Common Style Constants
// ============================================================================

export const BUTTON_STYLES = {
  primary: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl',
  secondary: 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 border',
  ghost: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-100',
} as const

export const CARD_STYLES = {
  base: 'rounded-xl shadow-lg transition-all hover:shadow-xl',
  bordered: 'rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md hover:border-gray-300',
  elevated: 'rounded-2xl shadow-xl transition-all hover:shadow-2xl',
} as const

export const SECTION_STYLES = {
  padding: 'px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16',
  maxWidth: 'max-w-7xl mx-auto',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
} as const
