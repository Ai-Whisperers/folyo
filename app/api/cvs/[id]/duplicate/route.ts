/**
 * Folyo API - Duplicate CV Route
 * POST /api/cvs/[id]/duplicate - Create a copy of a CV
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

    // Find the original CV
    const originalCV = await CV.findOne({
      _id: id,
      userId: session.user.id
    }).lean()

    if (!originalCV) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Create a duplicate with modified fields
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, createdAt, updatedAt, ...cvDataToCopy } = originalCV

    const duplicateData = {
      ...cvDataToCopy,
      title: `${originalCV.title} (Copy)`,
      status: 'draft',
      isPublic: false,
      slug: null,
      analytics: {
        views: 0,
        downloads: 0,
        uniqueVisitors: 0
      },
      version: 1,
      autosaveData: null,
      lastAutosave: null
    }

    const newCV = await CV.create(duplicateData)
    const cvJson = newCV.toJSON()

    const response: CVSaveResponse = {
      success: true,
      cv: {
        ...cvJson,
        id: newCV._id.toString(),
        userId: newCV.userId.toString()
      } as unknown as CVType
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error duplicating CV:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate CV' },
      { status: 500 }
    )
  }
}
