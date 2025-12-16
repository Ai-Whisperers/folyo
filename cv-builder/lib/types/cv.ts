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
    id: 'video-portfolio',
    name: 'Portfolio Dark',
    primaryColor: '#8B5CF6',
    secondaryColor: '#A78BFA',
    textColor: '#F9FAFB',
    bgColor: '#1A1A1A',
    accentColor: '#2D2D2D',
    description: 'Perfect for creatives',
    category: 'creative'
  }
]

export const getThemeConfig = (skin: ThemeSkin): ThemeConfig => {
  return THEME_CONFIGS.find(t => t.id === skin) || THEME_CONFIGS[0]
}
