/**
 * Folyo API - Track CV View Route
 * POST /api/cv/[slug]/view - Track a public CV view
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import Analytics from '@/models/Analytics'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    await connectDB()

    // Find the public CV by slug
    const cv = await CV.findOne({
      slug,
      isPublic: true
    })

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'
    const referrer = request.headers.get('referer') || null

    // Determine device type from user agent
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (/mobile/i.test(userAgent)) {
      deviceType = 'mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet'
    }

    // Increment view count
    await cv.incrementViews()

    // Log analytics event (anonymous since it's public view)
    try {
      await Analytics.create({
        userId: cv.userId,
        cvId: cv._id,
        eventType: 'cv_view',
        ipAddress: ip,
        userAgent,
        referrer,
        device: {
          type: deviceType
        },
        metadata: {
          slug,
          cvTitle: cv.title,
          isOwnerView: false
        }
      })
    } catch (analyticsError) {
      // Don't fail the request if analytics logging fails
      console.error('Error logging analytics:', analyticsError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking CV view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}
