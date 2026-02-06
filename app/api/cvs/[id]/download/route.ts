/**
 * Folyo API - Track CV Download Route
 * POST /api/cvs/[id]/download - Track a CV download
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import Analytics from '@/models/Analytics'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await connectDB()

    // Verify CV belongs to user
    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id
    })

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Increment download count
    await cv.incrementDownloads()

    // Log analytics event
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    await Analytics.create({
      userId: session.user.id,
      cvId: id,
      eventType: 'cv_download',
      ipAddress: ip,
      userAgent,
      metadata: {
        cvTitle: cv.title
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}
