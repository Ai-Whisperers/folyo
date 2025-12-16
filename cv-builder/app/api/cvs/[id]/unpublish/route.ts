/**
 * Folyo API - Unpublish CV Route
 * POST /api/cvs/[id]/unpublish - Unpublish a CV (make it private)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import type { CV as CVType, CVSaveResponse } from '@/lib/types'

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

    // Find and update the CV
    const cv = await CV.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id
      },
      {
        status: 'draft',
        isPublic: false,
        lastEditedAt: new Date()
      },
      { new: true }
    )

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    const cvJson = cv.toJSON()
    const response: CVSaveResponse = {
      success: true,
      cv: {
        ...cvJson,
        id: cv._id.toString(),
        userId: cv.userId.toString()
      } as unknown as CVType
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error unpublishing CV:', error)
    return NextResponse.json(
      { error: 'Failed to unpublish CV' },
      { status: 500 }
    )
  }
}
