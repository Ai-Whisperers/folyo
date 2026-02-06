/**
 * Folyo Theme System - Single Source of Truth
 * 
 * This module consolidates all theme-related configurations and exports.
 * Import from this file for consistent theming across the application.
 * 
 * @example
 * ```typescript
 * import { getTheme, THEMES, LAYOUTS, isDark } from '@/lib/themes'
 * 
 * const theme = getTheme('lavender')
 * const layout = LAYOUTS['hero-centered']
 * ```
 */

import { ThemeConfig, THEME_CONFIGS } from '@/lib/types/cv'
import { PortfolioLayoutType } from '@/lib/types/portfolio-schema'

// ============================================================================
// Layout Definitions
// ============================================================================

export interface LayoutConfig {
  id: PortfolioLayoutType
  name: string
  description: string
  category: 'classic' | 'modern' | 'creative' | 'professional'
  preview?: string
}

/**
 * Available portfolio layouts
 * Based on Victoria Rolon's hero-centered design as the default
 */
export const LAYOUTS: Record<PortfolioLayoutType, LayoutConfig> = {
  'classic': {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional sidebar layout with left navigation',
    category: 'classic',
  },
  'modern': {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary card-based design with bold header',
    category: 'modern',
  },
  'minimal': {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean single-column with elegant typography',
    category: 'classic',
  },
  'creative': {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and colorful for creative professionals',
    category: 'creative',
  },
  'executive': {
    id: 'executive',
    name: 'Executive',
    description: 'Professional and sophisticated for leadership roles',
    category: 'professional',
  },
  'compact': {
    id: 'compact',
    name: 'Compact',
    description: 'Dense information layout for comprehensive CVs',
    category: 'classic',
  },
  'timeline': {
    id: 'timeline',
    name: 'Timeline',
    description: 'Chronological focus with visual timeline',
    category: 'modern',
  },
  'cards': {
    id: 'cards',
    name: 'Cards',
    description: 'Modular card-based sections',
    category: 'modern',
  },
  'landing': {
    id: 'landing',
    name: 'Landing Page',
    description: 'Full landing page style with hero sections',
    category: 'creative',
  },
  'hero-centered': {
    id: 'hero-centered',
    name: 'Hero Centered',
    description: 'Modern centered hero with full sections (Victoria Rolon style)',
    category: 'modern',
  },
  'hero-split': {
    id: 'hero-split',
    name: 'Hero Split',
    description: 'Hero section with split content layout',
    category: 'modern',
  },
}

/**
 * Default layout for new portfolios
 */
export const DEFAULT_LAYOUT: PortfolioLayoutType = 'hero-centered'

/**
 * Get layout configuration by ID
 */
export const getLayout = (id: PortfolioLayoutType): LayoutConfig => {
  return LAYOUTS[id] || LAYOUTS[DEFAULT_LAYOUT]
}

/**
 * Get all layouts as an array
 */
export const getAllLayouts = (): LayoutConfig[] => {
  return Object.values(LAYOUTS)
}

/**
 * Get layouts by category
 */
export const getLayoutsByCategory = (category: LayoutConfig['category']): LayoutConfig[] => {
  return Object.values(LAYOUTS).filter(l => l.category === category)
}

// ============================================================================
// Theme Exports (re-export from theme.ts for convenience)
// ============================================================================

export { 
  THEME_CONFIGS as THEMES,
  type ThemeConfig
} from '@/lib/types/cv'

export {
  getThemeConfig as getTheme,
  getAllThemes,
  getThemeColors,
  isDarkTheme as isDark,
  getNavbarVariant,
  getContrastColor,
  getThemeCSSVars,
  getThemesByCategory,
  searchThemes,
  COLOR_PALETTES,
  TEMPLATE_LAYOUTS,
  type ThemeColors,
  type ColorPalette,
} from '@/lib/utils/theme'

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Check if a theme is in the dark category
 */
export const isDarkTheme = (themeId: string): boolean => {
  const theme = THEME_CONFIGS.find(t => t.id === themeId)
  if (!theme) return false
  
  const darkCategories = ['dark', 'bold']
  const darkThemes = ['midnight', 'charcoal', 'dark-purple', 'dark-teal', 'video-portfolio']
  
  return darkCategories.includes(theme.category) || darkThemes.includes(themeId)
}

/**
 * Get recommended layouts for a theme
 */
export const getRecommendedLayouts = (themeId: string): PortfolioLayoutType[] => {
  const isDark = isDarkTheme(themeId)
  
  if (isDark) {
    return ['hero-centered', 'landing', 'creative']
  }
  
  return ['hero-centered', 'modern', 'classic']
}

/**
 * Get theme-layout combinations that work well together
 */
export const RECOMMENDED_COMBINATIONS: Array<{ theme: string; layout: PortfolioLayoutType; name: string }> = [
  { theme: 'lavender', layout: 'hero-centered', name: 'Lavender Modern' },
  { theme: 'teal', layout: 'hero-centered', name: 'Teal Professional' },
  { theme: 'blue', layout: 'classic', name: 'Blue Classic' },
  { theme: 'midnight', layout: 'landing', name: 'Midnight Landing' },
  { theme: 'rose', layout: 'hero-centered', name: 'Rose Creative' },
  { theme: 'emerald', layout: 'modern', name: 'Emerald Modern' },
]

// ============================================================================
// Layout Categories for UI
// ============================================================================

export const LAYOUT_CATEGORIES = [
  { id: 'all', name: 'All Layouts', count: Object.keys(LAYOUTS).length },
  { id: 'modern', name: 'Modern', count: getLayoutsByCategory('modern').length },
  { id: 'classic', name: 'Classic', count: getLayoutsByCategory('classic').length },
  { id: 'creative', name: 'Creative', count: getLayoutsByCategory('creative').length },
  { id: 'professional', name: 'Professional', count: getLayoutsByCategory('professional').length },
]



