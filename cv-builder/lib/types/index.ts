// Export all types
export * from './cv'
export * from './portfolio-schema'

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  _id?: string
  name: string
  email: string
  profilePicture?: string
  plan?: 'free' | 'pro' | 'premium'
  subscription?: {
    plan: 'free' | 'pro' | 'business'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: Date | string
  }
  usage?: {
    cvsCreated: number
    pdfDownloads: number
    aiEnhancements: number
  }
  createdAt?: Date | string
  updatedAt?: Date | string
}

// ============================================
// CV/Portfolio Types (Centralized from pages)
// ============================================

export interface CVSidebar {
  name: string
  tagline?: string
  email?: string
  phone?: string
  website?: string
  linkedin?: string
  github?: string
  location?: string
  avatar?: string
  languages?: Array<{ idiom: string; level: string }>
}

export interface CareerProfile {
  title: string
  summary: string
}

export interface Experience {
  role: string
  company: string
  time: string
  location?: string
  details?: string
  tags?: string[]
  icon?: string
}

export interface Education {
  degree: string
  university: string
  time: string
  details?: string
}

export interface Skill {
  name: string
  level: number
  tags?: string[]
}

export interface Project {
  title: string
  time?: string
  details?: string
  link?: string
}

export interface Certification {
  name: string
  organization: string
  start: string
  end?: string
  details?: string
}

export interface Interest {
  item: string
}

export interface Language {
  idiom: string
  level: string
}

export interface PortfolioItem {
  type: 'video' | 'image' | 'document' | 'link'
  url: string
  thumbnail?: string
  title?: string
  description?: string
}

export interface PortfolioSection {
  title: string
  intro?: string
  items: PortfolioItem[]
  layout: 'grid' | 'carousel' | 'list'
}

export interface CVAnalytics {
  views: number
  downloads: number
  uniqueVisitors?: number
  lastViewed?: Date | string
}

// Full CV Document (for public CV pages)
export interface CVDocument {
  _id: string
  title: string
  slug: string
  isPublic: boolean
  status: 'draft' | 'published' | 'archived'
  theme: {
    skin: string
    sidebarPosition: string
  }
  sidebar: CVSidebar
  careerProfile?: CareerProfile
  experiences?: {
    title: string
    info: Experience[]
  }
  education?: {
    title: string
    info: Education[]
  }
  skills?: {
    title: string
    toolset: Skill[]
  }
  projects?: {
    title: string
    intro?: string
    assignments: Project[]
  }
  certifications?: {
    title: string
    list: Certification[]
  }
  languages?: {
    title: string
    info: Language[]
  }
  interests?: {
    title: string
    info: Interest[]
  }
  portfolio?: PortfolioSection
  analytics: CVAnalytics
  footer?: string
}

// Dashboard CV (simplified for list views)
export interface DashboardCV {
  _id: string
  title: string
  slug?: string
  status: 'draft' | 'published' | 'archived'
  isPublic: boolean
  createdAt: string
  updatedAt: string
  lastEditedAt: string
  theme: {
    skin: string
  }
  analytics: {
    views: number
    downloads: number
  }
  sidebar: {
    name?: string
    tagline?: string
  }
}

// User Analytics
export interface UserAnalytics {
  cv_view: number
  cv_download: number
  cv_edit: number
  cv_created: number
  export_pdf: number
}

// API types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form state types
export interface FormState {
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved: Date | null
}

// Analytics types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp: Date
}

export interface ViewAnalytics {
  date: string
  views: number
  uniqueVisitors: number
  downloads: number
}
