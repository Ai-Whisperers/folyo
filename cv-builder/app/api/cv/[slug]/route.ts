/**
 * Folyo API - Public CV Route
 * GET /api/cv/[slug] - Get a public CV by its slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import type { CV as CVType, CVResponse } from '@/lib/types'

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    await connectDB()

    // Find the public CV by slug
    const cv = await CV.findOne({
      slug,
      isPublic: true
    })
      .populate('userId', 'name profilePicture')
      .lean()

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Don't expose autosave data to public
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { autosaveData, lastAutosave, ...cvData } = cv

    // Extract owner info if userId was populated
    const ownerInfo = cv.userId && typeof cv.userId === 'object' && 'name' in cv.userId ? {
      name: (cv.userId as { name: string }).name,
      profilePicture: (cv.userId as { profilePicture?: string }).profilePicture
    } : undefined

    const response: CVResponse = {
      cv: {
        ...cvData,
        id: cv._id.toString(),
        userId: cv.userId && typeof cv.userId === 'object' && '_id' in cv.userId
          ? String((cv.userId as unknown as Record<string, unknown>)._id)
          : String(cv.userId || '')
      } as unknown as CVType,
      owner: ownerInfo
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching public CV:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CV' },
      { status: 500 }
    )
  }
}
