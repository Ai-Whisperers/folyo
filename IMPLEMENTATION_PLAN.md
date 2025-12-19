# 📋 Folyo Implementation Plan

> **Goal**: Scalable portfolio service where each customer gets their own unique page + QR code

---

## Table of Contents

1. [Overview](#overview)
2. [Current State Analysis](#current-state-analysis)
3. [Architecture](#architecture)
4. [Phase 1: Fix Public Portfolio Page](#phase-1-fix-public-portfolio-page)
5. [Phase 2: QR Code & Sharing Features](#phase-2-qr-code--sharing-features)
6. [Phase 3: URL Options](#phase-3-url-options)
7. [Phase 4: Analytics Dashboard](#phase-4-analytics-dashboard)
8. [Phase 5: Subscription & Payments](#phase-5-subscription--payments)
9. [Database Schema](#database-schema)
10. [API Endpoints](#api-endpoints)
11. [Component Updates](#component-updates)
12. [Deployment Checklist](#deployment-checklist)
13. [Pricing Model](#pricing-model)
14. [Timeline](#timeline)

---

## Overview

### The Business Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FOLYO PLATFORM                                   │
│                                                                          │
│   ONE CODEBASE → THOUSANDS OF UNIQUE PORTFOLIOS                         │
│                                                                          │
│   Customer signs up → Pays subscription → Creates portfolio             │
│                              ↓                                           │
│   Gets: • Unique URL (folyo.com/their-name)                            │
│         • QR Code (scannable, themed to their colors)                   │
│         • Analytics (who viewed their portfolio)                        │
│         • Multiple themes to choose from                                │
│                                                                          │
│   They share via link or QR → Visitors see their portfolio             │
│   Visitors DON'T know it's a shared platform                           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| Unique URL | `folyo.com/username` for each user |
| QR Code | Auto-generated, themed to match portfolio |
| 30+ Themes | Professional, Creative, Dark, Tech, Gradient |
| Analytics | Views, unique visitors, download counts |
| AI Builder | OpenAI-powered content generation |
| PDF Export | Traditional CV download option |
| Video/Image | Rich media portfolio support |

---

## Current State Analysis

### ✅ Already Built

| Component | File | Status |
|-----------|------|--------|
| User Authentication | `lib/auth.js` | ✅ Working |
| User Model | `models/User.js` | ✅ Working |
| CV Model | `models/CV.js` | ✅ Working |
| Analytics Model | `models/Analytics.js` | ✅ Working |
| QR Code Generator | `lib/qrcode.js` | ✅ Working |
| 30+ Themes | `lib/design-system.ts` | ✅ Working |
| Portfolio Builder | `app/builder/page.tsx` | ✅ Working |
| Dashboard | `app/dashboard/page.tsx` | ✅ Working |
| CV Preview Component | `components/cv/CVPreview.tsx` | ✅ Working |

### ⚠️ Needs Implementation

| Component | File | Issue |
|-----------|------|-------|
| Public Portfolio Page | `app/cv/[slug]/page.tsx` | Uses demo data, needs DB |
| Share/QR Section | Dashboard | Not implemented |
| View Tracking | API | Partial implementation |
| SEO Metadata | Public pages | Missing |

---

## Architecture

### Request Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC PORTFOLIO REQUEST                        │
│                                                                           │
│   1. Visitor navigates to: folyo.com/maria-lopez                         │
│                                    │                                      │
│                                    ▼                                      │
│   2. Next.js Route: app/cv/[slug]/page.tsx                               │
│      Extracts: slug = "maria-lopez"                                      │
│                                    │                                      │
│                                    ▼                                      │
│   3. Database Query:                                                      │
│      CV.findOne({ slug: "maria-lopez", isPublic: true })                 │
│                                    │                                      │
│                                    ▼                                      │
│   4. If found:                                                            │
│      • Increment view count                                              │
│      • Load user's theme (e.g., "berry")                                 │
│      • Load user's content (name, bio, experience, etc.)                 │
│                                    │                                      │
│                                    ▼                                      │
│   5. Render Portfolio:                                                    │
│      • Apply theme CSS variables                                         │
│      • Display user's content                                            │
│      • Generate SEO metadata                                             │
│                                    │                                      │
│                                    ▼                                      │
│   6. Visitor sees: Beautiful portfolio unique to Maria                   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### File Structure

```
cv-builder/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── auth/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/
│   │   └── page.tsx                  # User dashboard (UPDATE: add share section)
│   ├── builder/
│   │   └── page.tsx                  # Portfolio builder
│   ├── cv/
│   │   └── [slug]/
│   │       └── page.tsx              # PUBLIC PORTFOLIO (FIX THIS)
│   └── api/
│       ├── cv/
│       │   └── [slug]/
│       │       ├── route.ts          # Get CV by slug
│       │       └── view/
│       │           └── route.ts      # Track view (NEW)
│       └── user/
│           └── share/
│               └── route.ts          # Generate share links/QR (NEW)
├── components/
│   ├── cv/
│   │   ├── CVPreview.tsx             # Portfolio display component
│   │   └── ShareSection.tsx          # QR + Link sharing (NEW)
│   └── ui/
│       └── ...
├── lib/
│   ├── qrcode.js                     # QR generation (EXISTS)
│   ├── database.js                   # MongoDB connection
│   └── design-system.ts              # Theme definitions
└── models/
    ├── User.js
    ├── CV.js
    └── Analytics.js
```

---

## Phase 1: Fix Public Portfolio Page

### Current Problem

The public portfolio page (`app/cv/[slug]/page.tsx`) uses hardcoded demo data instead of fetching from the database.

### Solution

Replace the file with database-connected version:

```tsx
// app/cv/[slug]/page.tsx

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import { CVPreview } from '@/components/cv/CVPreview'

// Types
interface PageProps {
  params: { slug: string }
}

interface CVDocument {
  _id: string
  title: string
  slug: string
  isPublic: boolean
  status: string
  theme: {
    skin: string
    sidebarPosition: string
  }
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
  }
  careerProfile?: {
    title: string
    summary: string
  }
  experiences?: {
    title: string
    info: Array<{
      role: string
      company: string
      time: string
      location?: string
      details?: string
      tags?: string[]
    }>
  }
  education?: {
    title: string
    info: Array<{
      degree: string
      university: string
      time: string
      details?: string
    }>
  }
  skills?: {
    title: string
    toolset: Array<{
      name: string
      level: number
    }>
  }
  projects?: {
    title: string
    intro?: string
    assignments: Array<{
      title: string
      details?: string
      url?: string
    }>
  }
  certifications?: {
    title: string
    list: Array<{
      name: string
      organization: string
      start?: string
      end?: string
    }>
  }
  languages?: {
    title: string
    info: Array<{
      idiom: string
      level: string
    }>
  }
  interests?: {
    title: string
    info: Array<{ item: string }>
  }
  portfolio?: {
    title: string
    intro?: string
    items: Array<{
      type: 'video' | 'image' | 'document' | 'link'
      url: string
      thumbnail?: string
      title?: string
      description?: string
    }>
    layout: 'grid' | 'carousel' | 'list'
  }
  analytics: {
    views: number
    downloads: number
    uniqueVisitors: number
    lastViewed?: Date
  }
}

/**
 * Fetch public portfolio by slug
 */
async function getPublicPortfolio(slug: string): Promise<CVDocument | null> {
  try {
    await connectDB()
    
    const cv = await CV.findOne({
      slug: slug.toLowerCase(),
      isPublic: true,
      status: 'published'
    }).lean()
    
    return cv as CVDocument | null
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

/**
 * Track portfolio view
 */
async function trackView(slug: string): Promise<void> {
  try {
    await connectDB()
    
    await CV.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      {
        $inc: { 'analytics.views': 1 },
        $set: { 'analytics.lastViewed': new Date() }
      }
    )
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPublicPortfolio(params.slug)
  
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.'
    }
  }
  
  const name = portfolio.sidebar?.name || 'Portfolio'
  const tagline = portfolio.sidebar?.tagline || ''
  const summary = portfolio.careerProfile?.summary || ''
  const description = tagline || summary.slice(0, 160)
  
  return {
    title: `${name}${tagline ? ` - ${tagline}` : ''}`,
    description: description,
    openGraph: {
      title: name,
      description: description,
      type: 'profile',
      images: portfolio.sidebar?.avatar 
        ? [{ url: portfolio.sidebar.avatar, width: 400, height: 400 }]
        : [],
    },
    twitter: {
      card: 'summary',
      title: name,
      description: description,
    },
    robots: {
      index: true,
      follow: true,
    }
  }
}

/**
 * Public Portfolio Page
 */
export default async function PublicPortfolioPage({ params }: PageProps) {
  const portfolio = await getPublicPortfolio(params.slug)
  
  if (!portfolio) {
    notFound()
  }
  
  // Track view (non-blocking)
  trackView(params.slug)
  
  // Transform data for CVPreview component
  const cvData = {
    theme_skin: portfolio.theme?.skin || 'teal',
    sidebar: {
      name: portfolio.sidebar?.name || '',
      tagline: portfolio.sidebar?.tagline || '',
      email: portfolio.sidebar?.email || '',
      phone: portfolio.sidebar?.phone || '',
      website: portfolio.sidebar?.website || '',
      linkedin: portfolio.sidebar?.linkedin || '',
      github: portfolio.sidebar?.github || '',
      citizenship: portfolio.sidebar?.location || '',
      avatar: portfolio.sidebar?.avatar || '',
      languages: portfolio.languages || { title: 'Languages', info: [] }
    },
    'career-profile': {
      title: portfolio.careerProfile?.title || 'About',
      summary: portfolio.careerProfile?.summary || ''
    },
    experiences: {
      title: portfolio.experiences?.title || 'Experience',
      info: portfolio.experiences?.info || []
    },
    education: {
      title: portfolio.education?.title || 'Education',
      info: portfolio.education?.info || []
    },
    skills: {
      title: portfolio.skills?.title || 'Skills',
      toolset: portfolio.skills?.toolset?.map(s => ({
        name: s.name,
        level: `${s.level}%`
      })) || []
    },
    projects: {
      title: portfolio.projects?.title || 'Projects',
      intro: portfolio.projects?.intro || '',
      assignments: portfolio.projects?.assignments || []
    },
    certifications: {
      title: portfolio.certifications?.title || 'Certifications',
      list: portfolio.certifications?.list || []
    },
    interests: {
      title: portfolio.interests?.title || 'Interests',
      info: portfolio.interests?.info || []
    },
    portfolio: portfolio.portfolio || null
  }
  
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: portfolio.sidebar?.name,
            jobTitle: portfolio.sidebar?.tagline,
            email: portfolio.sidebar?.email,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/cv/${params.slug}`,
            sameAs: [
              portfolio.sidebar?.linkedin ? `https://linkedin.com/in/${portfolio.sidebar.linkedin}` : null,
              portfolio.sidebar?.github ? `https://github.com/${portfolio.sidebar.github}` : null,
              portfolio.sidebar?.website || null,
            ].filter(Boolean)
          })
        }}
      />
      
      {/* Portfolio Display */}
      <div className="min-h-screen">
        <CVPreview 
          data={cvData} 
          theme={portfolio.theme?.skin || 'teal'} 
        />
      </div>
    </>
  )
}

/**
 * Enable static generation for published portfolios
 * This pre-builds popular portfolios for faster loading
 */
export async function generateStaticParams() {
  try {
    await connectDB()
    
    // Get most viewed public portfolios for static generation
    const portfolios = await CV.find({
      isPublic: true,
      status: 'published'
    })
    .sort({ 'analytics.views': -1 })
    .limit(100)
    .select('slug')
    .lean()
    
    return portfolios.map((p: any) => ({
      slug: p.slug
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Revalidate every 60 seconds for ISR
export const revalidate = 60
```

### Create Not Found Page

```tsx
// app/cv/[slug]/not-found.tsx

import Link from 'next/link'

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Portfolio Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          This portfolio doesn't exist or hasn't been published yet.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Create Your Portfolio
        </Link>
      </div>
    </div>
  )
}
```

---

## Phase 2: QR Code & Sharing Features

### Create Share Section Component

```tsx
// components/cv/ShareSection.tsx

'use client'

import { useState, useEffect } from 'react'
import { 
  QrCodeIcon, 
  LinkIcon, 
  ClipboardIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface ShareSectionProps {
  slug: string
  theme: string
  name: string
}

export function ShareSection({ slug, theme, name }: ShareSectionProps) {
  const [qrCode, setQrCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://folyo.com'}/cv/${slug}`
  
  // Generate QR code on mount
  useEffect(() => {
    async function generateQR() {
      try {
        const response = await fetch('/api/user/qrcode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: portfolioUrl, theme })
        })
        
        if (response.ok) {
          const data = await response.json()
          setQrCode(data.qrCode)
        }
      } catch (error) {
        console.error('Error generating QR code:', error)
      } finally {
        setLoading(false)
      }
    }
    
    generateQR()
  }, [portfolioUrl, theme])
  
  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }
  
  // Download QR code as PNG
  const downloadQR = () => {
    if (!qrCode) return
    
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `${slug}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Native share (mobile)
  const sharePortfolio = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${name}'s Portfolio`,
          text: `Check out ${name}'s professional portfolio`,
          url: portfolioUrl
        })
      } catch (error) {
        // User cancelled or error
      }
    } else {
      copyLink()
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ShareIcon className="w-5 h-5 mr-2 text-teal-600" />
        Share Your Portfolio
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Link Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <LinkIcon className="w-4 h-4 inline mr-1" />
            Portfolio Link
          </label>
          <div className="flex">
            <input
              type="text"
              value={portfolioUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm text-gray-600 truncate"
            />
            <button
              onClick={copyLink}
              className={`px-4 py-2 border border-l-0 rounded-r-lg transition-colors ${
                copied 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {copied ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Share this link on LinkedIn, email, or anywhere!
          </p>
          
          {/* Share Button (for mobile) */}
          <button
            onClick={sharePortfolio}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ShareIcon className="w-4 h-4 mr-2" />
            Share Portfolio
          </button>
        </div>
        
        {/* QR Code Section */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <QrCodeIcon className="w-4 h-4 inline mr-1" />
            QR Code
          </label>
          
          <div className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-white">
            {loading ? (
              <div className="animate-pulse bg-gray-200 w-40 h-40 rounded" />
            ) : qrCode ? (
              <img 
                src={qrCode} 
                alt="Portfolio QR Code" 
                className="w-40 h-40"
              />
            ) : (
              <span className="text-gray-400 text-sm">QR Code</span>
            )}
          </div>
          
          <button
            onClick={downloadQR}
            disabled={!qrCode}
            className="mt-4 flex items-center px-4 py-2 text-sm text-teal-600 hover:text-teal-700 disabled:text-gray-400"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
            Download QR Code
          </button>
          
          <p className="mt-2 text-xs text-gray-500 text-center">
            Print this QR code on business cards, resumes, or posters!
          </p>
        </div>
      </div>
      
      {/* Preview Link */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center"
        >
          Preview your public portfolio →
        </a>
      </div>
    </div>
  )
}
```

### Create QR Code API Endpoint

```typescript
// app/api/user/qrcode/route.ts

import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

// Theme colors for QR codes
const THEME_COLORS: Record<string, string> = {
  teal: '#20c997',
  blue: '#2E86AB',
  turquoise: '#17a2b8',
  green: '#28a745',
  berry: '#8e44ad',
  orange: '#fd7e14',
  ceramic: '#d4926d',
  oceanstale: '#6c757d',
  coral: '#F43F5E',
  violet: '#7C3AED',
  slate: '#475569',
  charcoal: '#374151'
}

export async function POST(request: NextRequest) {
  try {
    const { url, theme = 'teal', size = 300 } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    // Get theme color or default to teal
    const darkColor = THEME_COLORS[theme] || THEME_COLORS.teal
    
    // Generate QR code as data URL
    const qrCode = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: darkColor,
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    
    return NextResponse.json({ qrCode })
    
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
```

### Update Dashboard to Include Share Section

```tsx
// In app/dashboard/page.tsx, add ShareSection to each CV card

import { ShareSection } from '@/components/cv/ShareSection'

// Inside the CV list mapping, add:
{cv.isPublic && cv.slug && (
  <ShareSection 
    slug={cv.slug}
    theme={cv.theme.skin}
    name={cv.sidebar?.name || cv.title}
  />
)}
```

---

## Phase 3: URL Options

### Option A: Path-Based (Default)

```
https://folyo.com/cv/maria-lopez
```

Already implemented. No changes needed.

### Option B: Subdomain-Based (Premium Feature)

```
https://maria-lopez.folyo.com
```

**Implementation:**

1. **DNS Setup**: Add wildcard A record `*.folyo.com`

2. **Middleware for Subdomain Resolution**:

```typescript
// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Skip for main domain and www
  if (host === 'folyo.com' || host === 'www.folyo.com' || host.startsWith('localhost')) {
    return NextResponse.next()
  }
  
  // Extract subdomain
  const subdomain = host.split('.')[0]
  
  // Skip reserved subdomains
  const reserved = ['www', 'app', 'api', 'admin', 'dashboard']
  if (reserved.includes(subdomain)) {
    return NextResponse.next()
  }
  
  // Rewrite to portfolio page
  url.pathname = `/cv/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)']
}
```

3. **Update User Model** (add subdomain field):

```javascript
// In models/User.js, add:
subdomain: {
  type: String,
  unique: true,
  sparse: true,
  lowercase: true,
  match: [/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens']
}
```

### Option C: Custom Domain (Premium+ Feature)

```
https://marialopez.com
```

**Implementation:**

1. **Add custom domain field to CV model**:

```javascript
// In models/CV.js, add to settings:
settings: {
  // ... existing fields
  customDomain: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  customDomainVerified: {
    type: Boolean,
    default: false
  }
}
```

2. **Domain verification API**:

```typescript
// app/api/domains/verify/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dns from 'dns/promises'

export async function POST(request: NextRequest) {
  const { domain, cvId } = await request.json()
  
  try {
    // Check for CNAME or TXT record pointing to folyo.com
    const records = await dns.resolveTxt(`_folyo.${domain}`)
    const isVerified = records.flat().includes(`folyo-verify=${cvId}`)
    
    if (isVerified) {
      // Update CV with verified domain
      await CV.findByIdAndUpdate(cvId, {
        'settings.customDomain': domain,
        'settings.customDomainVerified': true
      })
      
      return NextResponse.json({ verified: true })
    }
    
    return NextResponse.json({ 
      verified: false,
      instruction: `Add a TXT record: _folyo.${domain} → folyo-verify=${cvId}`
    })
  } catch (error) {
    return NextResponse.json({ verified: false, error: 'DNS lookup failed' })
  }
}
```

3. **Update middleware for custom domains**:

```typescript
// In middleware.ts, add custom domain handling:

// Check if host is a custom domain
const cv = await CV.findOne({
  'settings.customDomain': host,
  'settings.customDomainVerified': true
})

if (cv) {
  url.pathname = `/cv/${cv.slug}`
  return NextResponse.rewrite(url)
}
```

---

## Phase 4: Analytics Dashboard

### Analytics Data Structure

Already exists in CV model. Key fields:
- `analytics.views` - Total page views
- `analytics.downloads` - PDF downloads
- `analytics.uniqueVisitors` - Unique visitors
- `analytics.lastViewed` - Last view timestamp

### Create Analytics API

```typescript
// app/api/cvs/[id]/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import Analytics from '@/models/Analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const cv = await CV.findById(params.id)
      .select('analytics slug')
      .lean()
    
    if (!cv) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 })
    }
    
    // Get detailed analytics from Analytics collection
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const dailyViews = await Analytics.aggregate([
      {
        $match: {
          cvId: params.id,
          event: 'view',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])
    
    return NextResponse.json({
      summary: cv.analytics,
      dailyViews,
      slug: cv.slug
    })
    
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
```

### Analytics Display Component

```tsx
// components/cv/AnalyticsCard.tsx

'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, ArrowDownTrayIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface AnalyticsCardProps {
  cvId: string
}

export function AnalyticsCard({ cvId }: AnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/cvs/${cvId}/analytics`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [cvId])
  
  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
  }
  
  if (!analytics) {
    return null
  }
  
  const stats = [
    { 
      label: 'Total Views', 
      value: analytics.summary?.views || 0, 
      icon: EyeIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      label: 'Downloads', 
      value: analytics.summary?.downloads || 0, 
      icon: ArrowDownTrayIcon,
      color: 'text-green-600 bg-green-100'
    },
    { 
      label: 'Unique Visitors', 
      value: analytics.summary?.uniqueVisitors || 0, 
      icon: UserGroupIcon,
      color: 'text-purple-600 bg-purple-100'
    },
    { 
      label: 'Last Viewed', 
      value: analytics.summary?.lastViewed 
        ? new Date(analytics.summary.lastViewed).toLocaleDateString() 
        : 'Never',
      icon: CalendarIcon,
      color: 'text-orange-600 bg-orange-100'
    }
  ]
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Portfolio Analytics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Phase 5: Subscription & Payments

### Pricing Tiers

```javascript
// lib/pricing.ts

export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      maxPortfolios: 1,
      maxStorage: 10, // MB
      themes: ['teal', 'blue', 'oceanstale'],
      aiBuilder: false,
      videoPortfolio: false,
      analytics: false,
      pdfExport: false,
      qrCode: true,
      customSlug: true,
      subdomain: false,
      customDomain: false,
      removeWatermark: false
    }
  },
  pro: {
    name: 'Pro',
    price: 10, // per month
    features: {
      maxPortfolios: 5,
      maxStorage: 100, // MB
      themes: 'all',
      aiBuilder: true,
      videoPortfolio: true,
      analytics: true,
      pdfExport: true,
      qrCode: true,
      customSlug: true,
      subdomain: false,
      customDomain: false,
      removeWatermark: true
    }
  },
  premium: {
    name: 'Premium',
    price: 25, // per month
    features: {
      maxPortfolios: 'unlimited',
      maxStorage: 500, // MB
      themes: 'all',
      aiBuilder: true,
      videoPortfolio: true,
      analytics: true,
      pdfExport: true,
      qrCode: true,
      customSlug: true,
      subdomain: true,
      customDomain: true,
      removeWatermark: true
    }
  }
}

export function canUseFeature(userPlan: string, feature: string): boolean {
  const tier = PRICING_TIERS[userPlan as keyof typeof PRICING_TIERS] || PRICING_TIERS.free
  return !!tier.features[feature as keyof typeof tier.features]
}
```

### User Subscription Check Middleware

```typescript
// lib/middleware/subscription.ts

import { PRICING_TIERS } from '@/lib/pricing'

export function checkFeatureAccess(userPlan: string, requiredFeature: string): boolean {
  const tier = PRICING_TIERS[userPlan as keyof typeof PRICING_TIERS]
  if (!tier) return false
  
  const featureValue = tier.features[requiredFeature as keyof typeof tier.features]
  
  // Handle boolean features
  if (typeof featureValue === 'boolean') {
    return featureValue
  }
  
  // Handle 'all' or 'unlimited' values
  if (featureValue === 'all' || featureValue === 'unlimited') {
    return true
  }
  
  // Handle numeric limits
  return typeof featureValue === 'number' && featureValue > 0
}
```

---

## Database Schema

### Complete CV Model (Updated)

```javascript
// models/CV.js - Key fields for public portfolios

const cvSchema = new mongoose.Schema({
  // Identity
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, unique: true, sparse: true, lowercase: true },
  
  // Visibility
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  isPublic: { type: Boolean, default: false },
  
  // Theme
  theme: {
    skin: { type: String, default: 'teal' },
    sidebarPosition: { type: String, enum: ['left', 'right'], default: 'right' }
  },
  
  // Content sections (sidebar, experiences, education, skills, etc.)
  // ... (already defined)
  
  // Settings
  settings: {
    allowDownload: { type: Boolean, default: true },
    customDomain: { type: String, sparse: true },
    customDomainVerified: { type: Boolean, default: false }
  },
  
  // Analytics
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastViewed: Date,
    lastDownloaded: Date
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastEditedAt: { type: Date, default: Date.now }
})

// Indexes
cvSchema.index({ slug: 1 })
cvSchema.index({ userId: 1 })
cvSchema.index({ isPublic: 1, status: 1 })
cvSchema.index({ 'analytics.views': -1 })
```

---

## API Endpoints

### Summary of All Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cv/[slug]` | Get public portfolio by slug |
| POST | `/api/cv/[slug]/view` | Track portfolio view |
| POST | `/api/user/qrcode` | Generate QR code |
| GET | `/api/cvs/[id]/analytics` | Get portfolio analytics |
| POST | `/api/domains/verify` | Verify custom domain |
| GET | `/api/user/cvs` | Get user's portfolios |
| POST | `/api/cvs` | Create new portfolio |
| PUT | `/api/cvs/[id]` | Update portfolio |
| POST | `/api/cvs/[id]/publish` | Publish portfolio |
| POST | `/api/cvs/[id]/unpublish` | Unpublish portfolio |

---

## Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
  - `MONGODB_URI`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXTAUTH_SECRET`
  - `NEXTAUTH_URL`
  - `OPENAI_API_KEY`
- [ ] Database indexes created
- [ ] DNS configured (for subdomains)
- [ ] SSL certificates valid

### Post-Deployment

- [ ] Test public portfolio page with real data
- [ ] Test QR code generation
- [ ] Test share functionality
- [ ] Test analytics tracking
- [ ] Verify SEO metadata
- [ ] Test on mobile devices

---

## Pricing Model

### Recommended Pricing

| Plan | Price | Key Features |
|------|-------|--------------|
| **Free** | $0 | 1 portfolio, 3 themes, QR code |
| **Pro** | $10/mo | 5 portfolios, all themes, AI, analytics |
| **Premium** | $25/mo | Unlimited, subdomain, custom domain |

### Revenue Projections

| Users | Plan Mix | Monthly Revenue |
|-------|----------|-----------------|
| 1,000 | 70% Free, 25% Pro, 5% Premium | $3,750 |
| 5,000 | 60% Free, 30% Pro, 10% Premium | $27,500 |
| 10,000 | 50% Free, 35% Pro, 15% Premium | $72,500 |

---

## Timeline

| Phase | Tasks | Duration |
|-------|-------|----------|
| **Phase 1** | Fix public portfolio page | 1 day |
| **Phase 2** | QR code & sharing features | 1-2 days |
| **Phase 3** | URL options (subdomain) | 2-3 days |
| **Phase 4** | Analytics dashboard | 1-2 days |
| **Phase 5** | Subscription system | 2-3 days |
| **Testing** | End-to-end testing | 2 days |
| **Total** | | **10-14 days** |

---

## Quick Start Commands

```bash
# Install dependencies
cd cv-builder
npm install

# Start development server
npm run dev

# Test public portfolio
open http://localhost:3000/cv/demo

# Build for production
npm run build

# Start production server
npm start
```

---

## AI Agent Prompt

Use this to instruct another AI to implement this system:

> **Build a scalable portfolio service:**
> 
> 1. **Public Portfolio Page** (`app/cv/[slug]/page.tsx`):
>    - Fetch portfolio from MongoDB by slug
>    - Only show if `isPublic: true` and `status: 'published'`
>    - Track view count
>    - Generate SEO metadata (title, description, OpenGraph)
>    - Render using CVPreview component with user's chosen theme
> 
> 2. **QR Code & Sharing** (`components/cv/ShareSection.tsx`):
>    - Generate QR code using qrcode library
>    - Color QR code to match portfolio theme
>    - Copy link to clipboard functionality
>    - Download QR as PNG
>    - Native share for mobile
> 
> 3. **Analytics**:
>    - Track views in CV model (`analytics.views`)
>    - Show stats in dashboard: views, downloads, unique visitors
> 
> 4. **URL Structure**:
>    - Path-based: `folyo.com/cv/[slug]`
>    - Optional subdomain: `[slug].folyo.com` (requires middleware)
> 
> **Key principle:** ONE codebase renders UNIQUE portfolios for each user based on their chosen theme (CSS variables) and content (database). Users share via link or QR code.

---

*Document Version: 1.0*
*Project: Folyo*
*Created: December 2024*

