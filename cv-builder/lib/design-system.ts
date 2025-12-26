/**
 * Folyo Design System
 * Centralized configuration for colors, typography, spacing, and components
 */

// ============================================
// Color System
// ============================================

export const colors = {
  // Brand Colors
  brand: {
    primary: '#0D9488',    // Teal - main brand color
    secondary: '#14B8A6',  // Lighter teal
    accent: '#7C3AED',     // Purple - for AI features
  },

  // Theme Colors (for CV themes)
  // PRD-specified colors for 8 core themes (Section 7.3)
  themes: {
    // ========== CORE 8 THEMES (PRD-specified) ==========
    teal: {
      primary: '#20c997',      // PRD: Finance, Analytics
      secondary: '#3dd9ad',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F0FDFA',
      category: 'professional',
      label: 'Cool Teal',
    },
    blue: {
      primary: '#2E86AB',      // PRD: Corporate, Business
      secondary: '#4A9EC2',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#EFF6FF',
      category: 'professional',
      label: 'Professional Blue',
    },
    turquoise: {
      primary: '#17a2b8',      // PRD: Tech, Startups
      secondary: '#2fc4da',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#ECFEFF',
      category: 'professional',
      label: 'Modern Turquoise',
    },
    green: {
      primary: '#28a745',      // PRD: Environment, Health
      secondary: '#3dc75e',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F0FDF4',
      category: 'professional',
      label: 'Fresh Green',
    },
    oceanstale: {
      primary: '#6c757d',      // PRD: Conservative, Legal
      secondary: '#868e96',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F8F9FA',
      category: 'professional',
      label: 'Neutral Gray',
    },

    // ========== CREATIVE & BOLD (PRD-specified) ==========
    berry: {
      primary: '#8e44ad',      // PRD: Design, Creative
      secondary: '#a855c9',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FDF2F8',
      category: 'creative',
      label: 'Creative Berry',
    },
    orange: {
      primary: '#fd7e14',      // PRD: Marketing, Sales
      secondary: '#fd9a47',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FFF7ED',
      category: 'creative',
      label: 'Vibrant Orange',
    },
    coral: {
      primary: '#F43F5E',
      secondary: '#FB7185',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FFF1F2',
      category: 'creative',
      label: 'Coral Rose',
    },
    violet: {
      primary: '#7C3AED',
      secondary: '#8B5CF6',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F5F3FF',
      category: 'creative',
      label: 'Royal Violet',
    },
    fuchsia: {
      primary: '#C026D3',
      secondary: '#D946EF',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FDF4FF',
      category: 'creative',
      label: 'Electric Fuchsia',
    },

    // ========== MINIMAL & NEUTRAL ==========
    ceramic: {
      primary: '#d4926d',      // PRD: Consulting, Education
      secondary: '#dfab8c',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FDF8F5',
      category: 'minimal',
      label: 'Warm Ceramic',
    },
    slate: {
      primary: '#475569',
      secondary: '#64748B',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F8FAFC',
      category: 'minimal',
      label: 'Modern Slate',
    },
    charcoal: {
      primary: '#374151',
      secondary: '#4B5563',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F9FAFB',
      category: 'minimal',
      label: 'Classic Charcoal',
    },
    sage: {
      primary: '#65A30D',
      secondary: '#84CC16',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F7FEE7',
      category: 'minimal',
      label: 'Natural Sage',
    },

    // ========== DARK THEMES ==========
    'video-portfolio': {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      text: '#F9FAFB',
      bg: '#1A1A1A',
      accent: '#2D2D2D',
      category: 'videography',
      label: 'Video Portfolio',
    },
    'midnight-cinema': {
      primary: '#EF4444',
      secondary: '#F87171',
      text: '#F9FAFB',
      bg: '#0F0F0F',
      accent: '#1C1C1C',
      category: 'videography',
      label: 'Midnight Cinema',
    },
    'director-cut': {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      text: '#F9FAFB',
      bg: '#18181B',
      accent: '#27272A',
      category: 'videography',
      label: 'Director\'s Cut',
    },
    'film-noir': {
      primary: '#E5E5E5',
      secondary: '#A3A3A3',
      text: '#FAFAFA',
      bg: '#0A0A0A',
      accent: '#171717',
      category: 'videography',
      label: 'Film Noir',
    },
    'documentary-style': {
      primary: '#22C55E',
      secondary: '#4ADE80',
      text: '#F0FDF4',
      bg: '#14532D',
      accent: '#166534',
      category: 'videography',
      label: 'Documentary',
    },
    'broadcast-red': {
      primary: '#DC2626',
      secondary: '#EF4444',
      text: '#FEF2F2',
      bg: '#1C1917',
      accent: '#292524',
      category: 'videography',
      label: 'Broadcast Red',
    },
    'drone-aerial': {
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      text: '#F0F9FF',
      bg: '#0C4A6E',
      accent: '#075985',
      category: 'videography',
      label: 'Aerial Drone',
    },
    'developer-dark': {
      primary: '#10B981',
      secondary: '#34D399',
      text: '#E5E7EB',
      bg: '#0D1117',
      accent: '#161B22',
      category: 'dark',
      label: 'Developer Dark',
    },
    'art-gallery': {
      primary: '#FBBF24',
      secondary: '#FCD34D',
      text: '#F9FAFB',
      bg: '#18181B',
      accent: '#27272A',
      category: 'dark',
      label: 'Art Gallery',
    },
    'noir-elegant': {
      primary: '#F5F5F4',
      secondary: '#E7E5E4',
      text: '#FAFAF9',
      bg: '#1C1917',
      accent: '#292524',
      category: 'dark',
      label: 'Noir Elegant',
    },
    'neon-nights': {
      primary: '#06B6D4',
      secondary: '#22D3EE',
      text: '#F0FDFA',
      bg: '#0C0A09',
      accent: '#1C1917',
      category: 'dark',
      label: 'Neon Nights',
    },

    // ========== EXECUTIVE & LUXURY ==========
    'executive-gold': {
      primary: '#B45309',
      secondary: '#D97706',
      text: '#1F2937',
      bg: '#FFFBEB',
      accent: '#FEF3C7',
      category: 'executive',
      label: 'Executive Gold',
    },
    'navy-brass': {
      primary: '#1E3A5F',
      secondary: '#2563EB',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F0F4F8',
      category: 'executive',
      label: 'Navy & Brass',
    },
    'burgundy-classic': {
      primary: '#881337',
      secondary: '#BE123C',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FFF1F2',
      category: 'executive',
      label: 'Burgundy Classic',
    },
    'forest-executive': {
      primary: '#14532D',
      secondary: '#166534',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F0FDF4',
      category: 'executive',
      label: 'Forest Executive',
    },

    // ========== MODERN TECH ==========
    'github-style': {
      primary: '#238636',
      secondary: '#3FB950',
      text: '#C9D1D9',
      bg: '#0D1117',
      accent: '#161B22',
      category: 'tech',
      label: 'GitHub Style',
    },
    'vscode-dark': {
      primary: '#007ACC',
      secondary: '#0098FF',
      text: '#D4D4D4',
      bg: '#1E1E1E',
      accent: '#252526',
      category: 'tech',
      label: 'VS Code Dark',
    },
    'terminal-green': {
      primary: '#00FF00',
      secondary: '#39FF14',
      text: '#00FF00',
      bg: '#0D0208',
      accent: '#1A1A1A',
      category: 'tech',
      label: 'Terminal Green',
    },

    // ========== GRADIENT THEMES ==========
    'sunset-gradient': {
      primary: '#F97316',
      secondary: '#EC4899',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#FFF7ED',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
      category: 'gradient',
      label: 'Sunset Gradient',
    },
    'ocean-gradient': {
      primary: '#0EA5E9',
      secondary: '#8B5CF6',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#F0F9FF',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
      category: 'gradient',
      label: 'Ocean Gradient',
    },
    'aurora-gradient': {
      primary: '#10B981',
      secondary: '#06B6D4',
      text: '#1F2937',
      bg: '#FFFFFF',
      accent: '#ECFDF5',
      gradient: 'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
      category: 'gradient',
      label: 'Aurora Gradient',
    },
  },

  // Theme Categories for organization
  themeCategories: {
    professional: { label: 'Professional', description: 'Clean and corporate-ready' },
    creative: { label: 'Creative & Bold', description: 'Stand out with vibrant colors' },
    minimal: { label: 'Minimal', description: 'Subtle and refined' },
    dark: { label: 'Dark Mode', description: 'Elegant dark backgrounds' },
    videography: { label: 'Videography', description: 'Perfect for video portfolios' },
    executive: { label: 'Executive', description: 'Luxury and sophistication' },
    tech: { label: 'Tech & Developer', description: 'For tech professionals' },
    gradient: { label: 'Gradient', description: 'Modern gradient styles' },
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const

// ============================================
// Typography
// ============================================

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, monospace',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

// ============================================
// Spacing
// ============================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const

// ============================================
// Breakpoints
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================
// Shadows
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const

// ============================================
// Transitions
// ============================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================
// Z-Index Scale
// ============================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// ============================================
// Component Tokens
// ============================================

export const components = {
  button: {
    sizes: {
      sm: { px: '12px', py: '6px', fontSize: '14px' },
      md: { px: '16px', py: '8px', fontSize: '14px' },
      lg: { px: '24px', py: '12px', fontSize: '16px' },
      xl: { px: '32px', py: '16px', fontSize: '18px' },
    },
    variants: {
      primary: {
        bg: colors.brand.primary,
        text: '#FFFFFF',
        hover: '#0F766E',
        focus: colors.brand.primary,
      },
      secondary: {
        bg: colors.gray[100],
        text: colors.gray[700],
        hover: colors.gray[200],
        focus: colors.gray[300],
      },
      ghost: {
        bg: 'transparent',
        text: colors.gray[700],
        hover: colors.gray[100],
        focus: colors.gray[200],
      },
      danger: {
        bg: colors.semantic.error,
        text: '#FFFFFF',
        hover: '#DC2626',
        focus: colors.semantic.error,
      },
    },
  },

  input: {
    borderColor: colors.gray[300],
    focusBorderColor: colors.brand.primary,
    errorBorderColor: colors.semantic.error,
    placeholderColor: colors.gray[400],
    bg: '#FFFFFF',
    disabledBg: colors.gray[100],
  },

  card: {
    bg: '#FFFFFF',
    borderColor: colors.gray[200],
    shadow: shadows.md,
    radius: borderRadius.xl,
  },

  modal: {
    overlayBg: 'rgba(0, 0, 0, 0.5)',
    bg: '#FFFFFF',
    shadow: shadows['2xl'],
    radius: borderRadius['2xl'],
  },
} as const

// ============================================
// Accessibility
// ============================================

export const a11y = {
  focusRing: {
    width: '2px',
    style: 'solid',
    color: colors.brand.primary,
    offset: '2px',
  },
  minTouchTarget: '44px', // WCAG 2.1 AA minimum
  reducedMotion: {
    transition: 'none',
    animation: 'none',
  },
} as const

// ============================================
// Helper Functions
// ============================================

export function getThemeColors(themeName: string) {
  return colors.themes[themeName as keyof typeof colors.themes] || colors.themes.teal
}

export function getCSSVariable(variable: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(variable)
}

// Export type for theme names
export type ThemeName = keyof typeof colors.themes

// Export the full design system
export const designSystem = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  transitions,
  zIndex,
  components,
  a11y,
} as const

export default designSystem
