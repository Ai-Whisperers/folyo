/**
 * Folyo CV/Portfolio TypeScript Definitions
 * These types match the MongoDB schema in models/CV.js
 */

// ============================================
// Base Types
// ============================================

export type ThemeSkin =
  | 'blue'
  | 'turquoise'
  | 'green'
  | 'berry'
  | 'orange'
  | 'ceramic'
  | 'teal'
  | 'oceanstale'
  | 'video-portfolio'
  // New portfolio-inspired themes
  | 'midnight'
  | 'sunset'
  | 'forest'
  | 'lavender'
  | 'coral'
  | 'slate'
  | 'gold'
  | 'rose'
  | 'indigo'
  | 'emerald'
  | 'amber'
  | 'crimson'
  | 'arctic'
  | 'charcoal'
  | 'mint'
  | 'peach'
  | 'navy'
  | 'burgundy'
  | 'sage'
  | 'copper'
  | 'plum'
  | 'sand'
  | 'graphite'
  | 'cobalt'
  | 'rust'
  | 'olive'
  | 'mauve'
  | 'steel'
  | 'wine'
  | 'honey'
  | 'aqua'
  | 'mocha'

export type SidebarPosition = 'left' | 'right'

export type CVStatus = 'draft' | 'published' | 'archived'

export type PortfolioItemType = 'video' | 'image' | 'document' | 'link'

export type PortfolioLayout = 'grid' | 'carousel' | 'list'

export type LanguageLevel = 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic'

// ============================================
// Section Types
// ============================================

export interface ContactInfo {
  name: string
  tagline?: string
  email?: string
  phone?: string
  website?: string
  linkedin?: string
  github?: string
  location?: string
  avatar?: string
  timezone?: string
  citizenship?: string
  pdf?: string
}

export interface Experience {
  id?: string
  role: string
  company: string
  time: string
  location?: string
  details?: string
  tags?: string[]
  icon?: string
  order?: number
}

export interface Education {
  id?: string
  degree: string
  university: string
  time: string
  location?: string
  details?: string
  gpa?: string
  order?: number
}

export interface Skill {
  id?: string
  name: string
  level: number // 0-100
  tags?: string[]
  category?: string
  order?: number
}

export interface Project {
  id?: string
  title: string
  time?: string
  details?: string
  technologies?: string[]
  url?: string
  github?: string
  order?: number
}

export interface Certification {
  id?: string
  name: string
  organization: string
  start?: string
  end?: string
  details?: string
  url?: string
  order?: number
}

export interface Language {
  id?: string
  idiom: string
  level: LanguageLevel
  order?: number
}

export interface Interest {
  id?: string
  item: string
  order?: number
}

export interface Publication {
  id?: string
  title: string
  authors?: string
  conference?: string
  details?: string
  url?: string
  order?: number
}

export interface Recommendation {
  id?: string
  name: string
  title?: string
  details: string
  order?: number
}

export interface PortfolioItem {
  id?: string
  type: PortfolioItemType
  url: string
  thumbnail?: string
  title?: string
  description?: string
  order?: number
}

// ============================================
// Section Wrappers (with titles)
// ============================================

export interface ExperiencesSection {
  title: string
  info: Experience[]
}

export interface EducationSection {
  title: string
  info: Education[]
}

export interface SkillsSection {
  title: string
  toolset: Skill[]
}

export interface ProjectsSection {
  title: string
  intro?: string
  assignments: Project[]
}

export interface CertificationsSection {
  title: string
  list: Certification[]
}

export interface LanguagesSection {
  title: string
  info: Language[]
}

export interface InterestsSection {
  title: string
  info: Interest[]
}

export interface PublicationsSection {
  title: string
  intro?: string
  papers: Publication[]
}

export interface RecommendationsSection {
  title: string
  intro?: string
  testimonials: Recommendation[]
}

export interface PortfolioSection {
  title: string
  intro?: string
  items: PortfolioItem[]
  layout: PortfolioLayout
}

export interface CareerProfile {
  title: string
  summary?: string
}

// ============================================
// Theme Configuration
// ============================================

export interface CVTheme {
  skin: ThemeSkin
  sidebarPosition: SidebarPosition
}

// ============================================
// CV Settings
// ============================================

export interface CVSettings {
  allowComments: boolean
  allowDownload: boolean
  seoOptimized: boolean
  customDomain?: string
}

// ============================================
// CV Analytics
// ============================================

export interface CVAnalytics {
  views: number
  downloads: number
  lastViewed?: Date | string
  lastDownloaded?: Date | string
  uniqueVisitors: number
}

// ============================================
// Main CV Type
// ============================================

export interface CV {
  id?: string
  _id?: string
  title: string
  userId: string
  slug?: string

  // Theme and Layout
  theme: CVTheme
  theme_skin?: ThemeSkin // Legacy support

  // Content Sections
  sidebar: ContactInfo
  careerProfile: CareerProfile
  'career-profile'?: CareerProfile // Legacy support
  experiences: ExperiencesSection
  education: EducationSection
  skills: SkillsSection
  projects: ProjectsSection
  certifications: CertificationsSection
  languages: LanguagesSection
  interests: InterestsSection
  publications?: PublicationsSection
  recommendations?: RecommendationsSection
  portfolio?: PortfolioSection
  volunteer?: {
    title: string
    info: Experience[]
  }

  // Metadata
  status: CVStatus
  isPublic: boolean
  settings: CVSettings
  analytics: CVAnalytics
  version: number

  // Timestamps
  createdAt?: Date | string
  updatedAt?: Date | string
  lastEditedAt?: Date | string

  // Computed
  publicUrl?: string
}

// ============================================
// Form Data Types (for the builder)
// ============================================

export interface CVFormData {
  theme_skin: ThemeSkin
  templateLayout?: PortfolioLayoutType
  sidebar: ContactInfo & {
    position?: SidebarPosition
    about?: boolean
    education?: boolean
    languages?: LanguagesSection
  }
  'career-profile': CareerProfile
  experiences: ExperiencesSection
  education: EducationSection
  skills: SkillsSection
  projects: ProjectsSection
  certifications: CertificationsSection
  interests: InterestsSection
  volunteer?: {
    title: string
    info: Experience[]
  }
  portfolio?: PortfolioSection
}

// Alias for backward compatibility
export type CVData = CVFormData

// ============================================
// API Response Types
// ============================================

export interface CVListItem {
  id: string
  title: string
  slug?: string
  theme: CVTheme
  status: CVStatus
  isPublic: boolean
  analytics: CVAnalytics
  createdAt: string
  updatedAt: string
  lastEditedAt: string
  publicUrl?: string
}

export interface CVListResponse {
  cvs: CVListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CVResponse {
  cv?: CV
  error?: string
  owner?: {
    name: string
    profilePicture?: string
  }
}

export interface CVSaveResponse {
  success: boolean
  cv?: CV
  message?: string
  error?: string
}

// ============================================
// Default Values
// ============================================

export const DEFAULT_CV_DATA: CVFormData = {
  theme_skin: 'teal',
  templateLayout: 'classic',
  sidebar: {
    position: 'right',
    about: false,
    education: false,
    name: '',
    tagline: '',
    avatar: '',
    email: '',
    phone: '',
    timezone: '',
    citizenship: '',
    website: '',
    linkedin: '',
    github: '',
    pdf: '',
    languages: {
      title: 'Languages',
      info: []
    }
  },
  'career-profile': {
    title: 'Career Profile',
    summary: ''
  },
  experiences: {
    title: 'Experiences',
    info: []
  },
  education: {
    title: 'Education',
    info: []
  },
  skills: {
    title: 'Skills & Proficiency',
    toolset: []
  },
  projects: {
    title: 'Projects',
    intro: '',
    assignments: []
  },
  certifications: {
    title: 'Certifications',
    list: []
  },
  interests: {
    title: 'Interests',
    info: []
  },
  volunteer: {
    title: 'Volunteer Work',
    info: []
  }
}

// ============================================
// Theme Configuration Data
// ============================================

export interface ThemeConfig {
  id: ThemeSkin
  name: string
  primaryColor: string
  secondaryColor: string
  textColor: string
  bgColor: string
  accentColor: string
  description: string
  category: 'professional' | 'creative' | 'minimal' | 'bold'
}

export const THEME_CONFIGS: ThemeConfig[] = [
  // === PROFESSIONAL THEMES ===
  {
    id: 'teal',
    name: 'Teal',
    primaryColor: '#0D9488',
    secondaryColor: '#14B8A6',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#F0FDFA',
    description: 'Professional and modern',
    category: 'professional'
  },
  {
    id: 'blue',
    name: 'Blue',
    primaryColor: '#2563EB',
    secondaryColor: '#3B82F6',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#EFF6FF',
    description: 'Classic and trustworthy',
    category: 'professional'
  },
  {
    id: 'oceanstale',
    name: 'Ocean',
    primaryColor: '#0EA5E9',
    secondaryColor: '#38BDF8',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#F0F9FF',
    description: 'Calm and professional',
    category: 'professional'
  },
  {
    id: 'navy',
    name: 'Navy Executive',
    primaryColor: '#1E3A5F',
    secondaryColor: '#2D5A87',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#F1F5F9',
    description: 'Executive sophistication',
    category: 'professional'
  },
  {
    id: 'slate',
    name: 'Slate Pro',
    primaryColor: '#475569',
    secondaryColor: '#64748B',
    textColor: '#1E293B',
    bgColor: '#FFFFFF',
    accentColor: '#F8FAFC',
    description: 'Corporate elegance',
    category: 'professional'
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    primaryColor: '#0047AB',
    secondaryColor: '#2563EB',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#EEF2FF',
    description: 'Confident and bold',
    category: 'professional'
  },
  {
    id: 'steel',
    name: 'Steel',
    primaryColor: '#4B5563',
    secondaryColor: '#6B7280',
    textColor: '#111827',
    bgColor: '#FFFFFF',
    accentColor: '#F3F4F6',
    description: 'Industrial strength',
    category: 'professional'
  },

  // === CREATIVE THEMES ===
  {
    id: 'turquoise',
    name: 'Turquoise',
    primaryColor: '#06B6D4',
    secondaryColor: '#22D3EE',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#ECFEFF',
    description: 'Fresh and vibrant',
    category: 'creative'
  },
  {
    id: 'video-portfolio',
    name: 'Portfolio Dark',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    textColor: '#F9FAFB',
    bgColor: '#1A1A1A',
    accentColor: '#2D2D2D',
    description: 'Perfect for creatives',
    category: 'creative'
  },
  {
    id: 'midnight',
    name: 'Midnight Studio',
    primaryColor: '#6366F1',
    secondaryColor: '#818CF8',
    textColor: '#F8FAFC',
    bgColor: '#0F172A',
    accentColor: '#1E293B',
    description: 'Dark mode elegance',
    category: 'creative'
  },
  {
    id: 'sunset',
    name: 'Sunset Gradient',
    primaryColor: '#F97316',
    secondaryColor: '#FB923C',
    textColor: '#1F2937',
    bgColor: '#FFFBF5',
    accentColor: '#FFF7ED',
    description: 'Warm creative energy',
    category: 'creative'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    primaryColor: '#9333EA',
    secondaryColor: '#A855F7',
    textColor: '#1F2937',
    bgColor: '#FEFBFF',
    accentColor: '#F3E8FF',
    description: 'Artistic and unique',
    category: 'creative'
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    primaryColor: '#F43F5E',
    secondaryColor: '#FB7185',
    textColor: '#1F2937',
    bgColor: '#FFFBFC',
    accentColor: '#FFE4E6',
    description: 'Vibrant personality',
    category: 'creative'
  },
  {
    id: 'indigo',
    name: 'Indigo Night',
    primaryColor: '#4F46E5',
    secondaryColor: '#6366F1',
    textColor: '#F9FAFB',
    bgColor: '#1E1B4B',
    accentColor: '#312E81',
    description: 'Deep creative vibes',
    category: 'creative'
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    primaryColor: '#E11D48',
    secondaryColor: '#F43F5E',
    textColor: '#1F2937',
    bgColor: '#FFF1F3',
    accentColor: '#FFE4E6',
    description: 'Elegant and bold',
    category: 'creative'
  },
  {
    id: 'plum',
    name: 'Plum',
    primaryColor: '#7C3AED',
    secondaryColor: '#8B5CF6',
    textColor: '#F9FAFB',
    bgColor: '#2E1065',
    accentColor: '#4C1D95',
    description: 'Rich and luxurious',
    category: 'creative'
  },
  {
    id: 'aqua',
    name: 'Aqua',
    primaryColor: '#0891B2',
    secondaryColor: '#06B6D4',
    textColor: '#1F2937',
    bgColor: '#F0FDFE',
    accentColor: '#CFFAFE',
    description: 'Cool and refreshing',
    category: 'creative'
  },

  // === MINIMAL THEMES ===
  {
    id: 'green',
    name: 'Green',
    primaryColor: '#16A34A',
    secondaryColor: '#22C55E',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#F0FDF4',
    description: 'Natural and balanced',
    category: 'minimal'
  },
  {
    id: 'ceramic',
    name: 'Ceramic',
    primaryColor: '#78716C',
    secondaryColor: '#A8A29E',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#FAFAF9',
    description: 'Elegant and timeless',
    category: 'minimal'
  },
  {
    id: 'forest',
    name: 'Forest',
    primaryColor: '#166534',
    secondaryColor: '#15803D',
    textColor: '#1F2937',
    bgColor: '#FEFFFE',
    accentColor: '#DCFCE7',
    description: 'Organic simplicity',
    category: 'minimal'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#D1FAE5',
    description: 'Fresh minimalism',
    category: 'minimal'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    primaryColor: '#0284C7',
    secondaryColor: '#0EA5E9',
    textColor: '#1F2937',
    bgColor: '#FAFEFF',
    accentColor: '#E0F2FE',
    description: 'Clean and crisp',
    category: 'minimal'
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primaryColor: '#374151',
    secondaryColor: '#4B5563',
    textColor: '#F9FAFB',
    bgColor: '#111827',
    accentColor: '#1F2937',
    description: 'Dark minimalism',
    category: 'minimal'
  },
  {
    id: 'mint',
    name: 'Mint',
    primaryColor: '#2DD4BF',
    secondaryColor: '#5EEAD4',
    textColor: '#1F2937',
    bgColor: '#F0FDFA',
    accentColor: '#CCFBF1',
    description: 'Light and airy',
    category: 'minimal'
  },
  {
    id: 'sage',
    name: 'Sage',
    primaryColor: '#65A30D',
    secondaryColor: '#84CC16',
    textColor: '#1F2937',
    bgColor: '#FEFFF5',
    accentColor: '#ECFCCB',
    description: 'Earthy and calm',
    category: 'minimal'
  },
  {
    id: 'sand',
    name: 'Sand',
    primaryColor: '#A16207',
    secondaryColor: '#CA8A04',
    textColor: '#1F2937',
    bgColor: '#FFFDF7',
    accentColor: '#FEF9C3',
    description: 'Warm neutrals',
    category: 'minimal'
  },
  {
    id: 'graphite',
    name: 'Graphite',
    primaryColor: '#52525B',
    secondaryColor: '#71717A',
    textColor: '#FAFAFA',
    bgColor: '#18181B',
    accentColor: '#27272A',
    description: 'Sleek monochrome',
    category: 'minimal'
  },
  {
    id: 'olive',
    name: 'Olive',
    primaryColor: '#4D7C0F',
    secondaryColor: '#65A30D',
    textColor: '#1F2937',
    bgColor: '#FEFFF8',
    accentColor: '#D9F99D',
    description: 'Nature inspired',
    category: 'minimal'
  },
  {
    id: 'mauve',
    name: 'Mauve',
    primaryColor: '#9D174D',
    secondaryColor: '#BE185D',
    textColor: '#1F2937',
    bgColor: '#FFF5F8',
    accentColor: '#FCE7F3',
    description: 'Soft sophistication',
    category: 'minimal'
  },

  // === BOLD THEMES ===
  {
    id: 'berry',
    name: 'Berry',
    primaryColor: '#DB2777',
    secondaryColor: '#EC4899',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#FDF2F8',
    description: 'Bold and creative',
    category: 'bold'
  },
  {
    id: 'orange',
    name: 'Orange',
    primaryColor: '#EA580C',
    secondaryColor: '#F97316',
    textColor: '#1F2937',
    bgColor: '#FFFFFF',
    accentColor: '#FFF7ED',
    description: 'Energetic and warm',
    category: 'bold'
  },
  {
    id: 'gold',
    name: 'Gold Luxe',
    primaryColor: '#B45309',
    secondaryColor: '#D97706',
    textColor: '#1F2937',
    bgColor: '#FFFCF5',
    accentColor: '#FEF3C7',
    description: 'Premium and luxurious',
    category: 'bold'
  },
  {
    id: 'amber',
    name: 'Amber',
    primaryColor: '#D97706',
    secondaryColor: '#F59E0B',
    textColor: '#1F2937',
    bgColor: '#FFFBEB',
    accentColor: '#FDE68A',
    description: 'Warm and inviting',
    category: 'bold'
  },
  {
    id: 'crimson',
    name: 'Crimson',
    primaryColor: '#DC2626',
    secondaryColor: '#EF4444',
    textColor: '#F9FAFB',
    bgColor: '#450A0A',
    accentColor: '#7F1D1D',
    description: 'Powerful and intense',
    category: 'bold'
  },
  {
    id: 'peach',
    name: 'Peach',
    primaryColor: '#F97316',
    secondaryColor: '#FB923C',
    textColor: '#1F2937',
    bgColor: '#FFF8F5',
    accentColor: '#FFEDD5',
    description: 'Friendly and warm',
    category: 'bold'
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primaryColor: '#881337',
    secondaryColor: '#9F1239',
    textColor: '#FECDD3',
    bgColor: '#4C0519',
    accentColor: '#881337',
    description: 'Rich and sophisticated',
    category: 'bold'
  },
  {
    id: 'copper',
    name: 'Copper',
    primaryColor: '#C2410C',
    secondaryColor: '#EA580C',
    textColor: '#1F2937',
    bgColor: '#FFF7F5',
    accentColor: '#FFEDD5',
    description: 'Metallic warmth',
    category: 'bold'
  },
  {
    id: 'rust',
    name: 'Rust',
    primaryColor: '#B45309',
    secondaryColor: '#D97706',
    textColor: '#FEFCE8',
    bgColor: '#451A03',
    accentColor: '#78350F',
    description: 'Earthy and bold',
    category: 'bold'
  },
  {
    id: 'wine',
    name: 'Wine',
    primaryColor: '#7F1D1D',
    secondaryColor: '#991B1B',
    textColor: '#FEF2F2',
    bgColor: '#450A0A',
    accentColor: '#7F1D1D',
    description: 'Classic elegance',
    category: 'bold'
  },
  {
    id: 'honey',
    name: 'Honey',
    primaryColor: '#CA8A04',
    secondaryColor: '#EAB308',
    textColor: '#1F2937',
    bgColor: '#FEFCE8',
    accentColor: '#FEF08A',
    description: 'Sweet and bold',
    category: 'bold'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    primaryColor: '#78350F',
    secondaryColor: '#92400E',
    textColor: '#FEF3C7',
    bgColor: '#451A03',
    accentColor: '#78350F',
    description: 'Rich coffee tones',
    category: 'bold'
  }
]

export const getThemeConfig = (skin: ThemeSkin): ThemeConfig => {
  return THEME_CONFIGS.find(t => t.id === skin) || THEME_CONFIGS[0]
}

// ============================================
// New Portfolio System (Landing Page Format)
// ============================================

export type PortfolioLayoutType = 'hero-centered' | 'hero-split' | 'hero-minimal' | 'hero-fullscreen'

export type ColorPaletteId = 'ocean' | 'lavender' | 'forest' | 'sunset' | 'rose' | 'slate' | 'midnight' | 'charcoal'

export interface ColorPalette {
  id: ColorPaletteId
  name: string
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  muted: string
  isDark: boolean
}

export const COLOR_PALETTES: ColorPalette[] = [
  // Light Palettes
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0891B2',
    secondary: '#06B6D4',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#9333EA',
    secondary: '#A855F7',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#059669',
    secondary: '#10B981',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#FB923C',
    background: '#FFFBF5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#E11D48',
    secondary: '#F43F5E',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'slate',
    name: 'Slate',
    primary: '#475569',
    secondary: '#64748B',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  // Dark Palettes
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366F1',
    secondary: '#818CF8',
    background: '#0A0A0A',
    surface: '#141414',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    isDark: true
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    background: '#0A0A0A',
    surface: '#141414',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    isDark: true
  }
]

export const getColorPalette = (id: string): ColorPalette => {
  return COLOR_PALETTES.find(p => p.id === id) || COLOR_PALETTES[0]
}

// ============================================
// Portfolio Data Types (Flat Structure)
// ============================================

export interface PortfolioSidebar {
  position: SidebarPosition
  name: string
  tagline: string
  avatar?: string
  email?: string
  phone?: string
  location?: string
  timezone?: string
  citizenship?: string
  linkedin?: string
  github?: string
  website?: string
  languages: Array<{ idiom: string; level: string }>
}

export interface PortfolioExperience {
  role: string
  time: string
  company: string
  details?: string
  tags?: string[]
  icon?: string
}

export interface PortfolioEducation {
  degree: string
  university: string
  time: string
  details?: string
}

export interface PortfolioProject {
  title: string
  time?: string
  details?: string
  link?: string
}

export interface PortfolioCertification {
  name: string
  start: string
  organization: string
  details?: string
}

export interface PortfolioSkill {
  name: string
  level: number
  tags?: string[]
}

export interface PortfolioVolunteer {
  role: string
  time: string
  company: string
  details?: string
  tags?: string[]
}

export interface PortfolioData {
  slug: string
  color_palette: ColorPaletteId
  layout: PortfolioLayoutType

  sidebar: PortfolioSidebar
  interests: string[]

  career_profile: {
    title: string
    summary: string
  }

  education: PortfolioEducation[]
  experiences: PortfolioExperience[]
  projects: PortfolioProject[]
  certifications: PortfolioCertification[]
  skills: PortfolioSkill[]
  volunteer?: PortfolioVolunteer[]

  footer?: string
}

// ============================================
// Normalized Data (for component consumption)
// ============================================

export interface NormalizedPortfolioData {
  slug: string
  palette: ColorPalette
  layout: PortfolioLayoutType
  sidebar: PortfolioSidebar
  interests: string[]
  careerProfile: { title: string; summary: string }
  education: PortfolioEducation[]
  experiences: PortfolioExperience[]
  projects: PortfolioProject[]
  certifications: PortfolioCertification[]
  skills: PortfolioSkill[]
  volunteer: PortfolioVolunteer[]
  footer?: string
}

/**
 * Normalizes portfolio data from various formats (old nested or new flat)
 * into a consistent structure for component consumption
 */
export function normalizePortfolioData(data: any): NormalizedPortfolioData {
  // Determine palette - support both old theme_skin and new color_palette
  const paletteId = data.color_palette || data.theme_skin || 'ocean'
  const palette = getColorPalette(paletteId)

  // Determine layout - support both old template_layout and new layout
  const layout: PortfolioLayoutType = data.layout || data.template_layout || 'hero-centered'

  // Normalize sidebar with languages
  const sidebarLanguages = Array.isArray(data.sidebar?.languages)
    ? data.sidebar.languages
    : data.sidebar?.languages?.info || []

  const sidebar: PortfolioSidebar = {
    position: data.sidebar?.position || 'left',
    name: data.sidebar?.name || '',
    tagline: data.sidebar?.tagline || '',
    avatar: data.sidebar?.avatar,
    email: data.sidebar?.email,
    phone: data.sidebar?.phone,
    location: data.sidebar?.location || data.sidebar?.citizenship,
    timezone: data.sidebar?.timezone,
    citizenship: data.sidebar?.citizenship,
    linkedin: data.sidebar?.linkedin,
    github: data.sidebar?.github,
    website: data.sidebar?.website,
    languages: sidebarLanguages
  }

  // Normalize interests - support both string[] and {info: [{item}]}
  const interests: string[] = Array.isArray(data.interests)
    ? data.interests
    : data.interests?.info?.map((i: any) => i.item || i) || []

  // Normalize career profile - support both career_profile and career-profile
  const careerProfile = data.career_profile || data['career-profile'] || { title: 'About', summary: '' }

  // Normalize arrays - support both flat and nested formats
  const education: PortfolioEducation[] = data.education?.info || data.education || []
  const experiences: PortfolioExperience[] = data.experiences?.info || data.experiences || []
  const projects: PortfolioProject[] = data.projects?.assignments || data.projects || []
  const certifications: PortfolioCertification[] = data.certifications?.list || data.certifications || []
  const skills: PortfolioSkill[] = (data.skills?.toolset || data.skills || []).map((s: any) => ({
    name: s.name,
    level: typeof s.level === 'string' ? parseInt(s.level) : s.level,
    tags: s.tags
  }))
  const volunteer: PortfolioVolunteer[] = data.volunteer?.info || data.volunteer || []

  return {
    slug: data.slug || '',
    palette,
    layout,
    sidebar,
    interests,
    careerProfile,
    education,
    experiences,
    projects,
    certifications,
    skills,
    volunteer,
    footer: data.footer
  }
}
