// Export all types from centralized cv.ts file
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
// Import Additional Types (not in cv.ts)
// ============================================

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
