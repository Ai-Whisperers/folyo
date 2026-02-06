/**
 * Template Layout System - Simplified
 * Single responsive template with beautiful color palette options
 */

// ============================================
// Template Layout (Single Template)
// ============================================

export type TemplateLayoutId = 'responsive'

export interface TemplateLayout {
  id: TemplateLayoutId
  name: string
  description: string
  features: string[]
}

export const TEMPLATE_LAYOUTS: TemplateLayout[] = [
  {
    id: 'responsive',
    name: 'Professional',
    description: 'Clean, responsive design that works on all devices',
    features: ['Mobile-first', 'Print optimized', 'ATS-friendly', 'Clean sections'],
  }
]

// ============================================
// Color Palette System
// ============================================

export interface ColorPalette {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  isDark: boolean
  category: 'professional' | 'vibrant' | 'neutral' | 'dark'
}

// Beautiful curated color palettes
export const COLOR_PALETTES: ColorPalette[] = [
  // ===== PROFESSIONAL =====
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0077B6',
    secondary: '#00B4D8',
    accent: '#E8F6FC',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#0D9488',
    secondary: '#14B8A6',
    accent: '#E6FFFA',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    primary: '#3B5998',
    secondary: '#5B7BD5',
    accent: '#EEF2FF',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#2D6A4F',
    secondary: '#40916C',
    accent: '#D8F3DC',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'navy',
    name: 'Navy',
    primary: '#1E3A5F',
    secondary: '#3D5A80',
    accent: '#E8EEF4',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'professional'
  },

  // ===== VIBRANT =====
  {
    id: 'coral',
    name: 'Coral',
    primary: '#E07A5F',
    secondary: '#F2A69E',
    accent: '#FFF5F3',
    background: '#FFFFFF',
    text: '#2D3748',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'violet',
    name: 'Violet',
    primary: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#F5F3FF',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#FFF7ED',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#DB2777',
    secondary: '#F472B6',
    accent: '#FDF2F8',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#059669',
    secondary: '#34D399',
    accent: '#D1FAE5',
    background: '#FFFFFF',
    text: '#1A202C',
    isDark: false,
    category: 'vibrant'
  },

  // ===== NEUTRAL =====
  {
    id: 'slate',
    name: 'Slate',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#F1F5F9',
    background: '#FFFFFF',
    text: '#1E293B',
    isDark: false,
    category: 'neutral'
  },
  {
    id: 'stone',
    name: 'Stone',
    primary: '#57534E',
    secondary: '#78716C',
    accent: '#F5F5F4',
    background: '#FFFFFF',
    text: '#1C1917',
    isDark: false,
    category: 'neutral'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    primary: '#374151',
    secondary: '#6B7280',
    accent: '#F3F4F6',
    background: '#FFFFFF',
    text: '#111827',
    isDark: false,
    category: 'neutral'
  },

  // ===== DARK MODE =====
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#818CF8',
    secondary: '#A5B4FC',
    accent: '#1E1B4B',
    background: '#0F0E17',
    text: '#FFFFFE',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'aurora',
    name: 'Aurora',
    primary: '#22D3EE',
    secondary: '#67E8F9',
    accent: '#164E63',
    background: '#0C1929',
    text: '#F0F9FF',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'ember',
    name: 'Ember',
    primary: '#F97316',
    secondary: '#FB923C',
    accent: '#431407',
    background: '#18120B',
    text: '#FFF7ED',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'royal',
    name: 'Royal',
    primary: '#A855F7',
    secondary: '#C084FC',
    accent: '#2E1065',
    background: '#13061F',
    text: '#FAF5FF',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'matrix',
    name: 'Matrix',
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#064E3B',
    background: '#0A1612',
    text: '#ECFDF5',
    isDark: true,
    category: 'dark'
  }
]

// ============================================
// Helper Functions
// ============================================

export function getTemplateLayout(id: TemplateLayoutId): TemplateLayout | undefined {
  return TEMPLATE_LAYOUTS.find(t => t.id === id)
}

export function getColorPalette(id: string): ColorPalette | undefined {
  return COLOR_PALETTES.find(c => c.id === id)
}

export function getColorsByCategory(category: ColorPalette['category']): ColorPalette[] {
  return COLOR_PALETTES.filter(c => c.category === category)
}

// Create CSS variables from a color palette
export function getColorCSSVars(palette: ColorPalette): Record<string, string> {
  return {
    '--cv-primary': palette.primary,
    '--cv-secondary': palette.secondary,
    '--cv-accent': palette.accent,
    '--cv-background': palette.background,
    '--cv-text': palette.text
  }
}

// Default selections
export const DEFAULT_TEMPLATE: TemplateLayoutId = 'responsive'
export const DEFAULT_COLOR: string = 'ocean'

// ============================================
// Backward Compatibility
// ============================================

export interface LegacyThemeConfig {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  bgColor: string
  accentColor: string
  description: string
  category: 'professional' | 'creative' | 'minimal' | 'bold'
}

function mapCategoryToLegacy(category: ColorPalette['category']): LegacyThemeConfig['category'] {
  switch (category) {
    case 'professional': return 'professional'
    case 'vibrant': return 'creative'
    case 'neutral': return 'minimal'
    case 'dark': return 'bold'
    default: return 'professional'
  }
}

export function colorPaletteToThemeConfig(palette: ColorPalette): LegacyThemeConfig {
  return {
    id: palette.id,
    name: palette.name,
    primaryColor: palette.primary,
    secondaryColor: palette.secondary,
    textColor: palette.text,
    bgColor: palette.background,
    accentColor: palette.accent,
    description: `${palette.name} color scheme`,
    category: mapCategoryToLegacy(palette.category)
  }
}

export const LEGACY_THEME_CONFIGS: LegacyThemeConfig[] = COLOR_PALETTES.map(colorPaletteToThemeConfig)

export function getLegacyThemeConfig(themeId: string): LegacyThemeConfig {
  const palette = getColorPalette(themeId)
  if (palette) {
    return colorPaletteToThemeConfig(palette)
  }
  return colorPaletteToThemeConfig(COLOR_PALETTES[0])
}

export function isColorDark(colorId: string): boolean {
  const palette = getColorPalette(colorId)
  return palette?.isDark ?? false
}

export const COLOR_CATEGORIES = [
  { id: 'professional' as const, name: 'Professional' },
  { id: 'vibrant' as const, name: 'Vibrant' },
  { id: 'neutral' as const, name: 'Neutral' },
  { id: 'dark' as const, name: 'Dark Mode' }
]
