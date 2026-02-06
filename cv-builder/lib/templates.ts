/**
 * Template Layout System
 * Single source of truth for templates and color palettes
 * Provides backward compatibility with legacy THEME_CONFIGS
 */

// ============================================
// Template Layout Types
// ============================================

export type TemplateLayoutId =
  | 'landing'
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'executive'
  | 'compact'
  | 'timeline'
  | 'cards'

export interface TemplateLayout {
  id: TemplateLayoutId
  name: string
  description: string
  features: string[]
  previewImage?: string
  popular?: boolean
  new?: boolean
}

// Distinct template layouts with different structural designs
export const TEMPLATE_LAYOUTS: TemplateLayout[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Premium portfolio-style landing page with hero section',
    features: ['Full-width hero', 'Photo gallery', 'Modern sections', 'Best for portfolios'],
    popular: true,
    new: true
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional two-column layout with sidebar on left',
    features: ['Left sidebar', 'Clear sections', 'ATS-friendly', 'Print optimized'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold headers and cards',
    features: ['Card-based sections', 'Modern typography', 'Visual hierarchy', 'Clean borders']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, distraction-free design focused on content',
    features: ['Single column', 'Lots of whitespace', 'Simple typography', 'Content-first']
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold design perfect for designers and creatives',
    features: ['Hero header', 'Project showcase', 'Visual skills display', 'Portfolio grid'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior professionals',
    features: ['Elegant typography', 'Subtle accents', 'Refined spacing', 'Premium feel']
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Information-dense layout that fits more content',
    features: ['Dense layout', 'Small margins', 'Multi-column skills', 'Efficient space']
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Visual timeline-based experience and education display',
    features: ['Visual timeline', 'Connected dots', 'Date prominence', 'Story flow']
  },
  {
    id: 'cards',
    name: 'Cards',
    description: 'Modern card-based design with floating sections',
    features: ['Floating cards', 'Shadow effects', 'Rounded corners', 'Contemporary']
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

// Curated color palettes
export const COLOR_PALETTES: ColorPalette[] = [
  // Professional
  {
    id: 'teal',
    name: 'Teal',
    primary: '#0D9488',
    secondary: '#14B8A6',
    accent: '#F0FDFA',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'blue',
    name: 'Blue',
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#EFF6FF',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'navy',
    name: 'Navy',
    primary: '#1E3A5F',
    secondary: '#2D5A87',
    accent: '#F1F5F9',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'slate',
    name: 'Slate',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#F8FAFC',
    background: '#FFFFFF',
    text: '#1E293B',
    isDark: false,
    category: 'professional'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#ECFDF5',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'professional'
  },

  // Vibrant
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#F5F3FF',
    background: '#FAFAF9',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'violet',
    name: 'Violet',
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    accent: '#F5F3FF',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#E11D48',
    secondary: '#F43F5E',
    accent: '#FFF1F2',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: '#EA580C',
    secondary: '#F97316',
    accent: '#FFF7ED',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'cyan',
    name: 'Cyan',
    primary: '#0891B2',
    secondary: '#06B6D4',
    accent: '#ECFEFF',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },
  {
    id: 'pink',
    name: 'Pink',
    primary: '#DB2777',
    secondary: '#EC4899',
    accent: '#FDF2F8',
    background: '#FFFFFF',
    text: '#1F2937',
    isDark: false,
    category: 'vibrant'
  },

  // Neutral
  {
    id: 'graphite',
    name: 'Graphite',
    primary: '#374151',
    secondary: '#4B5563',
    accent: '#F3F4F6',
    background: '#FFFFFF',
    text: '#111827',
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
    id: 'zinc',
    name: 'Zinc',
    primary: '#3F3F46',
    secondary: '#52525B',
    accent: '#F4F4F5',
    background: '#FFFFFF',
    text: '#18181B',
    isDark: false,
    category: 'neutral'
  },

  // Dark themes
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#1E293B',
    background: '#0F172A',
    text: '#F8FAFC',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#2D2D2D',
    background: '#1A1A1A',
    text: '#F9FAFB',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'dark-teal',
    name: 'Dark Teal',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#1E293B',
    background: '#0F172A',
    text: '#F1F5F9',
    isDark: true,
    category: 'dark'
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#60A5FA',
    secondary: '#93C5FD',
    accent: '#1F2937',
    background: '#111827',
    text: '#F9FAFB',
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

// Default selections (Victoria Rolon standard)
export const DEFAULT_TEMPLATE: TemplateLayoutId = 'landing'
export const DEFAULT_COLOR: string = 'teal'

// ============================================
// Backward Compatibility with THEME_CONFIGS
// ============================================

// Legacy ThemeConfig interface (for compatibility)
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

// Map new color category to old category
function mapCategoryToLegacy(category: ColorPalette['category']): LegacyThemeConfig['category'] {
  switch (category) {
    case 'professional': return 'professional'
    case 'vibrant': return 'creative'
    case 'neutral': return 'minimal'
    case 'dark': return 'bold'
    default: return 'professional'
  }
}

// Convert ColorPalette to legacy ThemeConfig format
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

// Generate legacy THEME_CONFIGS from COLOR_PALETTES
export const LEGACY_THEME_CONFIGS: LegacyThemeConfig[] = COLOR_PALETTES.map(colorPaletteToThemeConfig)

// Get legacy theme config by ID
export function getLegacyThemeConfig(themeId: string): LegacyThemeConfig {
  const palette = getColorPalette(themeId)
  if (palette) {
    return colorPaletteToThemeConfig(palette)
  }
  // Return default teal theme
  return colorPaletteToThemeConfig(COLOR_PALETTES[0])
}

// Check if a color palette is dark
export function isColorDark(colorId: string): boolean {
  const palette = getColorPalette(colorId)
  return palette?.isDark ?? false
}

// ============================================
// Theme Config Categories
// ============================================

export const COLOR_CATEGORIES = [
  { id: 'professional' as const, name: 'Professional' },
  { id: 'vibrant' as const, name: 'Vibrant' },
  { id: 'neutral' as const, name: 'Neutral' },
  { id: 'dark' as const, name: 'Dark Mode' }
]

export const TEMPLATE_CATEGORIES = TEMPLATE_LAYOUTS.map(t => ({
  id: t.id,
  name: t.name
}))
