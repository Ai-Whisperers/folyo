# CV Builder Consistency Fix Plan

## Overview
This plan addresses the critical inconsistency issues across the CV Builder webapp. Each phase builds upon the previous one, creating a maintainable, scalable codebase.

**Estimated Time:** 3-4 days of focused work
**Team Size:** 1-2 developers
**Risk Level:** Medium (requires careful testing between phases)

---

## Phase 1: Standardize Import Paths (Day 1)

### Goal
Replace all relative imports (`../`, `../../`) with `@/` path aliases for consistency.

### Files to Modify
- `app/page.tsx` (Lines 1-35)
- `app/builder/page.tsx` (Lines 1-35)
- `app/portfolios/page.tsx` (Lines 1-25)
- `app/templates/page.tsx` (Lines 25-35)
- `app/auth/signin/page.tsx`
- `app/auth/signup/page.tsx`

### Implementation Steps

#### Step 1.1: Verify path aliases are configured
```typescript
// tsconfig.json (should already exist)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### Step 1.2: Create import transformation script
```bash
# Create a script to find and list all relative imports
grep -r "from '\.\.\/" app/ --include="*.tsx" | grep -v node_modules
```

#### Step 1.3: Transform imports systematically

**Pattern to replace:**
```typescript
// BEFORE (page.tsx - homepage)
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { THEME_CONFIGS } from '../lib/types/cv'

// AFTER
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { THEME_CONFIGS } from '@/lib/types/cv'
```

**Pattern to replace (builder page):**
```typescript
// BEFORE
import { CVBuilderForm } from '../../components/cv/CVBuilderForm'
import { CVPreview } from '../../components/cv/CVPreview'
import { useUnsavedChanges } from '../../lib/hooks'
import { useAuth } from '@/lib/contexts/AuthContext'

// AFTER
import { CVBuilderForm } from '@/components/cv/CVBuilderForm'
import { CVPreview } from '@/components/cv/CVPreview'
import { useUnsavedChanges } from '@/lib/hooks'
import { useAuth } from '@/lib/contexts/AuthContext'
```

#### Step 1.4: Verify no relative imports remain
```bash
grep -r "from '\.\.\/" app/ --include="*.tsx" | wc -l
# Should return 0
```

### Acceptance Criteria
- [ ] All imports use `@/` prefix
- [ ] No `../` or `../../` imports in app/ directory
- [ ] TypeScript compilation passes
- [ ] All tests pass

---

## Phase 2: Centralize Type Definitions (Day 1-2)

### Goal
Move all inline type definitions to `lib/types/` and ensure all pages import from central sources.

### Current Problems
1. `app/cv/[slug]/page.tsx` defines 100 lines of inline types
2. `app/dashboard/page.tsx` defines `CV` interface (different from lib/types/cv.ts)
3. `app/templates/page.tsx` uses inline `SAMPLE_CV_DATA` without types

### Files to Create/Modify

#### Step 2.1: Create comprehensive types file
```typescript
// lib/types/index.ts (create or update)

// Export all existing types
export * from './cv'
export * from './portfolio-schema'

// Add missing shared types
export interface User {
  id: string
  name: string
  email: string
  plan?: 'free' | 'pro' | 'premium'
  avatar?: string
}

export interface PortfolioViewData {
  slug: string
  sidebar: {
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
  careerProfile: {
    title: string
    summary: string
  }
  experiences: Array<{
    role: string
    company: string
    time: string
    details?: string
    tags?: string[]
    icon?: string
  }>
  education: Array<{
    degree: string
    university: string
    time: string
    details?: string
  }>
  skills: Array<{
    name: string
    level: number
    tags?: string[]
  }>
  projects: Array<{
    title: string
    time?: string
    details?: string
    link?: string
  }>
  certifications: Array<{
    name: string
    organization: string
    start: string
    details?: string
  }>
  interests: string[]
  theme: string
  layout: string
  footer?: string
}

export interface DashboardCV {
  _id: string
  title: string
  slug?: string
  status: 'draft' | 'published' | 'archived'
  isPublic: boolean
  createdAt: string
  updatedAt: string
  lastEditedAt: string
  theme: { skin: string }
  analytics: { views: number; downloads: number }
  sidebar: { name?: string; tagline?: string }
}

export interface UserAnalytics {
  cv_view: number
  cv_download: number
  cv_edit: number
  cv_created: number
  export_pdf: number
}
```

#### Step 2.2: Refactor cv/[slug]/page.tsx
```typescript
// BEFORE: 100 lines of inline type definitions
interface CVDocument {
  _id: string
  title: string
  // ... 90 more lines
}

// AFTER: Import from central types
import { PortfolioViewData } from '@/lib/types'

// Use PortfolioViewData instead of inline CVDocument
```

#### Step 2.3: Refactor dashboard/page.tsx
```typescript
// BEFORE
interface CV {
  _id: string
  sidebar: { name?: string; tagline?: string }
  // Different from lib/types!
}

// AFTER
import { DashboardCV, UserAnalytics } from '@/lib/types'
```

#### Step 2.4: Add types to templates/page.tsx
```typescript
// BEFORE
const SAMPLE_CV_DATA = { ... } // No types

// AFTER
import { PortfolioViewData } from '@/lib/types'

const SAMPLE_CV_DATA: Partial<PortfolioViewData> = { ... }
```

### Acceptance Criteria
- [ ] No inline interface definitions in page files
- [ ] All pages import types from `@/lib/types`
- [ ] TypeScript strict mode passes (if enabled)
- [ ] No type duplication between files

---

## Phase 3: Create Layout Architecture (Day 2)

### Goal
Create a root layout with Navbar/Footer and remove imports from individual pages.

### Current Problem
8 pages manually import and render Navbar/Footer:
- `page.tsx` (homepage)
- `templates/page.tsx`
- `portfolio/[slug]/page.tsx`
- `portfolios/page.tsx`
- `auth/signin/page.tsx`
- `auth/signup/page.tsx`
- `privacy/page.tsx`
- `terms/page.tsx`

5 pages DON'T have them (which is correct for their use case):
- `builder/page.tsx` (custom header)
- `dashboard/page.tsx` (custom header)
- `cv/[slug]/page.tsx` (clean CV view)
- `ai-builder/page.tsx` (custom layout)
- `pricing/page.tsx` (❌ THIS IS A BUG - needs navigation)

### Implementation

#### Step 3.1: Create root layout with navigation
```typescript
// app/layout.tsx (modify existing)

import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

#### Step 3.2: Create specialized layouts

**Builder Layout:**
```typescript
// app/builder/layout.tsx

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* Builder has custom header */}
      {children}
    </div>
  )
}
```

**Dashboard Layout:**
```typescript
// app/dashboard/layout.tsx

import { Navbar } from '@/components/common/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
    </div>
  )
}
```

**CV View Layout (no nav):**
```typescript
// app/cv/[slug]/layout.tsx

export default function CVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Clean layout - no nav/footer for CV viewing
  return <>{children}</>
}
```

#### Step 3.3: Remove Navbar/Footer imports from pages
Remove from:
- `page.tsx`
- `templates/page.tsx`
- `portfolio/[slug]/page.tsx`
- `portfolios/page.tsx`
- `auth/signin/page.tsx`
- `auth/signup/page.tsx`
- `privacy/page.tsx`
- `terms/page.tsx`

#### Step 3.4: Add navigation to pricing page
```typescript
// app/pricing/page.tsx
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>{/* existing content */}</main>
      <Footer />
    </>
  )
}
```

### Acceptance Criteria
- [ ] Root layout includes Navbar/Footer
- [ ] No manual Navbar/Footer imports in pages (except pricing)
- [ ] Pricing page has navigation
- [ ] Builder/Dashboard use custom layouts
- [ ] CV view remains clean

---

## Phase 4: Standardize Error Handling (Day 2-3)

### Goal
Create consistent error handling across all pages with UI feedback.

### Current Problems
- 7 different error handling patterns
- Some pages just `console.error` with no UI
- Inconsistent error state naming (`error`, `err`, `fetchError`)

### Implementation

#### Step 4.1: Create error types
```typescript
// lib/types/errors.ts

export interface AppError {
  code: string
  message: string
  details?: string
}

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'

export const ERROR_MESSAGES: Record<ErrorType, string> = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  AUTH_ERROR: 'Please sign in to continue.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
}
```

#### Step 4.2: Create error hook
```typescript
// lib/hooks/useError.ts

import { useState, useCallback } from 'react'
import { AppError, ErrorType, ERROR_MESSAGES } from '@/lib/types/errors'

export function useError() {
  const [error, setError] = useState<AppError | null>(null)

  const setAppError = useCallback((type: ErrorType, details?: string) => {
    setError({
      code: type,
      message: ERROR_MESSAGES[type],
      details
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Response) {
      if (err.status === 401) setAppError('AUTH_ERROR')
      else if (err.status === 404) setAppError('NOT_FOUND')
      else if (err.status >= 500) setAppError('SERVER_ERROR')
      else setAppError('UNKNOWN_ERROR')
    } else if (err instanceof Error) {
      setAppError('UNKNOWN_ERROR', err.message)
    } else {
      setAppError('UNKNOWN_ERROR')
    }
  }, [setAppError])

  return { error, setError: setAppError, clearError, handleError }
}
```

#### Step 4.3: Create error display component
```typescript
// components/ui/ErrorDisplay.tsx

import { XCircleIcon } from '@heroicons/react/24/outline'
import { AppError } from '@/lib/types/errors'

interface ErrorDisplayProps {
  error: AppError | null
  onDismiss?: () => void
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {error.message}
          </h3>
          {error.details && (
            <div className="mt-2 text-sm text-red-700">
              {error.details}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="text-red-400 hover:text-red-500"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

#### Step 4.4: Refactor pages to use standardized error handling

**Example: Dashboard page**
```typescript
// BEFORE
const [cvs, setCvs] = useState<CV[]>([])
// ...
} catch (error) {
  console.error('Error fetching user data:', error)
}

// AFTER
import { useError } from '@/lib/hooks/useError'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'

export default function DashboardPage() {
  const { error, handleError, clearError } = useError()
  const [cvs, setCvs] = useState<DashboardCV[]>([])
  
  // ...
  } catch (err) {
    handleError(err)
  }
  
  return (
    <>
      <ErrorDisplay error={error} onDismiss={clearError} />
      {/* rest of component */}
    </>
  )
}
```

### Pages to Refactor
- [ ] `dashboard/page.tsx`
- [ ] `builder/page.tsx`
- [ ] `portfolio/[slug]/page.tsx`
- [ ] `portfolios/page.tsx`
- [ ] `ai-builder/page.tsx`

### Acceptance Criteria
- [ ] All pages use `useError` hook
- [ ] ErrorDisplay component shown on all error states
- [ ] No `console.error` without UI feedback
- [ ] Consistent error handling patterns

---

## Phase 5: Standardize Loading States (Day 3)

### Goal
Create consistent loading UI across all pages.

### Current Problems
- 5 different loading approaches
- Inconsistent naming (`isLoading`, `loading`, `isSaving`)
- Some pages have no loading state at all

### Implementation

#### Step 5.1: Create loading hook
```typescript
// lib/hooks/useLoading.ts

import { useState, useCallback } from 'react'

type LoadingState = {
  isLoading: boolean
  message?: string
}

export function useLoading(initialMessage?: string) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    message: initialMessage
  })

  const startLoading = useCallback((message?: string) => {
    setState({ isLoading: true, message })
  }, [])

  const stopLoading = useCallback(() => {
    setState({ isLoading: false, message: undefined })
  }, [])

  return {
    isLoading: state.isLoading,
    loadingMessage: state.message,
    startLoading,
    stopLoading
  }
}
```

#### Step 5.2: Create LoadingWrapper component
```typescript
// components/ui/LoadingWrapper.tsx

import { LoadingSpinner } from './LoadingSpinner'

interface LoadingWrapperProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingWrapper({
  isLoading,
  message,
  children,
  fallback
}: LoadingWrapperProps) {
  if (isLoading) {
    return fallback || (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="mt-4 text-sm text-gray-500">{message}</p>
        )}
      </div>
    )
  }

  return <>{children}</>
}
```

#### Step 5.3: Refactor pages

**Example: Dashboard**
```typescript
// BEFORE
const [cvs, setCvs] = useState<CV[]>([])
// Just renders empty array while loading

// AFTER
import { useLoading } from '@/lib/hooks/useLoading'
import { LoadingWrapper } from '@/components/ui/LoadingWrapper'

export default function DashboardPage() {
  const { isLoading, startLoading, stopLoading } = useLoading('Loading your CVs...')
  const [cvs, setCvs] = useState<DashboardCV[]>([])
  
  useEffect(() => {
    startLoading()
    fetchCVs().then(() => stopLoading())
  }, [])
  
  return (
    <LoadingWrapper isLoading={isLoading}>
      {/* CV list */}
    </LoadingWrapper>
  )
}
```

### Pages to Refactor
- [ ] `dashboard/page.tsx` - Add loading state
- [ ] `templates/page.tsx` - Add loading state
- [ ] `portfolios/page.tsx` - Standardize existing loading
- [ ] `portfolio/[slug]/page.tsx` - Use LoadingWrapper

### Acceptance Criteria
- [ ] All data-fetching pages have loading states
- [ ] Consistent `useLoading` hook usage
- [ ] LoadingWrapper component used consistently
- [ ] User sees feedback during all async operations

---

## Phase 6: Document Server/Client Pattern (Day 3)

### Goal
Create clear guidelines and refactor pages to follow consistent patterns.

### Create ADR (Architecture Decision Record)
```markdown
# ADR 001: Server vs Client Components

## Context
We need clear guidelines on when to use Server Components vs Client Components.

## Decision

### Use Server Components when:
- Fetching data that doesn't need user interaction
- SEO is important (public CV/portfolio pages)
- No 'useState' or 'useEffect' needed
- Static generation is possible

### Use Client Components when:
- User interaction required (forms, buttons)
- Browser APIs needed (localStorage, clipboard)
- Real-time updates via WebSocket
- Auth state management

## Implementation

### Server Component Pattern (cv/[slug]/page.tsx)
```typescript
// app/cv/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }): Promise<Metadata> {
  // Generate metadata server-side
}

export default async function CVPage({ params }) {
  const data = await fetchCV(params.slug)
  if (!data) notFound()
  
  return <CVView data={data} />
}
```

### Client Component Pattern (builder/page.tsx)
```typescript
'use client'

import { useState } from 'react'

export default function BuilderPage() {
  const [data, setData] = useState()
  // Client-side logic
}
```

## Migration Plan
1. CV view page - Keep as Server Component
2. Portfolio view - Convert to Server Component (currently 'use client')
3. Builder - Keep as Client Component
4. Dashboard - Keep as Client Component
```

### Refactor portfolio/[slug]/page.tsx
```typescript
// BEFORE: Client Component with 'use client'
'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// AFTER: Server Component
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }): Promise<Metadata> {
  const portfolio = await getPortfolio(params.slug)
  return {
    title: portfolio?.sidebar?.name || 'Portfolio',
    description: portfolio?.careerProfile?.summary?.slice(0, 160)
  }
}

export default async function PortfolioPage({ params }) {
  const portfolio = await getPortfolio(params.slug)
  if (!portfolio) notFound()
  
  return <PortfolioView data={portfolio} />
}
```

---

## Phase 7: Create Data Fetching Utilities (Day 3-4)

### Goal
Standardize all API calls with consistent error handling and typing.

### Create API Client
```typescript
// lib/api/client.ts

import { AppError } from '@/lib/types/errors'

interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
}

class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: { ...this.headers, ...options.headers }
    })

    if (!response.ok) {
      throw response
    }

    return response.json()
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  }

  // ... put, delete, etc.
}

export const apiClient = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api'
})
```

### Create Service Functions
```typescript
// lib/api/services/cv.ts

import { apiClient } from '../client'
import { DashboardCV } from '@/lib/types'

export const cvService = {
  getAll: () => apiClient.get<DashboardCV[]>('/cvs'),
  
  getById: (id: string) => apiClient.get<DashboardCV>(`/cvs/${id}`),
  
  create: (data: Partial<DashboardCV>) => 
    apiClient.post<DashboardCV>('/cvs', data),
  
  update: (id: string, data: Partial<DashboardCV>) =>
    apiClient.post<DashboardCV>(`/cvs/${id}`, data),
  
  delete: (id: string) =>
    apiClient.request<void>(`/cvs/${id}`, { method: 'DELETE' })
}
```

### Refactor pages to use services
```typescript
// dashboard/page.tsx
import { cvService } from '@/lib/api/services/cv'

// BEFORE
const response = await fetch('/api/cvs', {
  headers: { 'x-user-id': user.id }
})
const data = await response.json()

// AFTER
const cvs = await cvService.getAll()
```

---

## Phase 8: Fix Auth Patterns (Day 4)

### Goal
Create ProtectedRoute wrapper for consistent auth checks.

### Create ProtectedRoute Component
```typescript
// components/auth/ProtectedRoute.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { LoadingWrapper } from '@/components/ui/LoadingWrapper'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return fallback || <LoadingWrapper isLoading={true} />
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

### Apply to pages
```typescript
// ai-builder/page.tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AIBuilderPage() {
  return (
    <ProtectedRoute>
      <AIBuilderContent />
    </ProtectedRoute>
  )
}

function AIBuilderContent() {
  // Existing component logic
}
```

---

## Phase 9: Code Quality Enforcement (Day 4)

### ESLint Rules
```javascript
// .eslintrc.js additions
module.exports = {
  rules: {
    // Enforce @/ imports over relative
    'no-restricted-imports': ['error', {
      patterns: ['../*', '. ./*']
    }],
    
    // No console.log in production
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    
    // Consistent naming
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['camelCase'],
        prefix: ['is', 'has', 'should', 'can']
      }
    ]
  }
}
```

### Pre-commit Hook
```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

cd cv-builder

# Run linter
npm run lint

# Run type check
npx tsc --noEmit

# Run tests
npm test
```

---

## Phase 10: Testing & Validation (Ongoing)

### Pre-Merge Checklist
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] All tests pass (`npm test`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Manual testing of key user flows:
  - [ ] Create new CV
  - [ ] Edit existing CV
  - [ ] View public CV
  - [ ] Dashboard operations
  - [ ] Template gallery
  - [ ] Pricing page

### Regression Testing
After each phase, verify:
1. Homepage loads correctly
2. Builder page works end-to-end
3. Dashboard displays CVs
4. Public CVs are viewable
5. Auth flows (signin/signup) work
6. Template gallery displays correctly

---

## Summary

| Phase | Duration | Risk | Key Files |
|-------|----------|------|-----------|
| 1 - Import Paths | 0.5 day | Low | 8 page files |
| 2 - Type Definitions | 1 day | Medium | lib/types/, 5 pages |
| 3 - Layout Architecture | 0.5 day | Medium | app/layout.tsx, 9 pages |
| 4 - Error Handling | 1 day | Medium | lib/hooks/, components/ui/ |
| 5 - Loading States | 0.5 day | Low | lib/hooks/, 4 pages |
| 6 - Server/Client | 0.5 day | High | 2 pages, docs/ |
| 7 - Data Fetching | 0.5 day | Medium | lib/api/, 5 pages |
| 8 - Auth Patterns | 0.5 day | Medium | components/auth/, 3 pages |
| 9 - Code Quality | 0.5 day | Low | .eslintrc, .husky/ |
| 10 - Testing | Ongoing | - | - |

**Total Estimated Time:** 5-6 days (with testing)

**Critical Success Factors:**
1. Test after EACH phase, not just at the end
2. Commit after each phase with clear messages
3. Run full test suite before merging
4. Document any deviations from the plan

---

## Rollback Strategy

If issues arise:
1. Each phase is in its own commit - can revert individually
2. Keep a `main-stable` branch that always works
3. Feature flags for risky changes (Server Component conversion)

**Emergency Contacts:**
- If build breaks: Check TypeScript errors first
- If tests fail: Check jest.setup.js configuration
- If runtime errors: Check for missing error boundaries
