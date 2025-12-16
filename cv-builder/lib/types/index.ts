// Export all types
export * from './cv'

// User types
export interface User {
  id: string
  _id?: string
  name: string
  email: string
  profilePicture?: string
  subscription: {
    plan: 'free' | 'pro' | 'business'
    status: 'active' | 'cancelled' | 'expired'
    expiresAt?: Date | string
  }
  usage: {
    cvsCreated: number
    pdfDownloads: number
    aiEnhancements: number
  }
  createdAt: Date | string
  updatedAt: Date | string
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
