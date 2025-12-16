/**
 * Folyo API - CV Collection Routes
 * GET /api/cvs - List all CVs for the current user
 * POST /api/cvs - Create a new CV
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CVModel from '@/models/CV'
import type { CV as CVType, CVListItem, CVListResponse, CVSaveResponse } from '@/lib/types'

// GET /api/cvs - List all CVs for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | null

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id }
    if (status) {
      query.status = status
    }

    // Get total count for pagination
    const total = await CVModel.countDocuments(query)

    // Get CVs with pagination
    const cvs = await CVModel.find(query)
      .sort({ lastEditedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-autosaveData')
      .lean()

    const response: CVListResponse = {
      cvs: cvs.map(cv => ({
        id: cv._id.toString(),
        title: cv.title,
        slug: cv.slug,
        theme: cv.theme,
        status: cv.status,
        isPublic: cv.isPublic,
        analytics: cv.analytics,
        createdAt: cv.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: cv.updatedAt?.toISOString() || new Date().toISOString(),
        lastEditedAt: cv.lastEditedAt?.toISOString() || new Date().toISOString(),
        publicUrl: cv.publicUrl
      })) as CVListItem[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching CVs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
      { status: 500 }
    )
  }
}

// POST /api/cvs - Create a new CV
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Create new CV
    const cvData = {
      ...body,
      userId: session.user.id,
      status: 'draft',
      isPublic: false
    }

    const cv = await CVModel.create(cvData)

    const cvJson = cv.toJSON()
    const response: CVSaveResponse = {
      success: true,
      cv: {
        ...cvJson,
        id: cv._id.toString(),
        userId: cv.userId.toString()
      } as unknown as CVType
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating CV:', error)

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create CV' },
      { status: 500 }
    )
  }
}
