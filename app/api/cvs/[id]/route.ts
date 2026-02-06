/**
 * Folyo API - Single CV Routes
 * GET /api/cvs/[id] - Get a single CV
 * PUT /api/cvs/[id] - Update a CV
 * DELETE /api/cvs/[id] - Delete a CV
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'
import type { CV as CVType, CVResponse, CVSaveResponse } from '@/lib/types'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/cvs/[id] - Get a single CV
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id
    }).lean()

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    const response: CVResponse = {
      cv: {
        ...cv,
        id: cv._id.toString(),
        userId: cv.userId.toString()
      } as unknown as CVType
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching CV:', error)
    return NextResponse.json(
      { error: 'Failed to fetch CV' },
      { status: 500 }
    )
  }
}

// PUT /api/cvs/[id] - Update a CV
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // First check if CV belongs to user
    const existingCV = await CV.findOne({
      _id: id,
      userId: session.user.id
    })

    if (!existingCV) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Remove fields that shouldn't be updated directly
    delete body.userId
    delete body.id
    delete body._id
    delete body.createdAt
    delete body.analytics

    // Update the CV
    const updatedCV = await CV.findByIdAndUpdate(
      id,
      {
        ...body,
        lastEditedAt: new Date(),
        $inc: { version: 1 }
      },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedCV) {
      return NextResponse.json(
        { error: 'Failed to update CV' },
        { status: 500 }
      )
    }

    const response: CVSaveResponse = {
      success: true,
      cv: {
        ...updatedCV,
        id: updatedCV._id.toString(),
        userId: updatedCV.userId.toString()
      } as unknown as CVType
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating CV:', error)

    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update CV' },
      { status: 500 }
    )
  }
}

// DELETE /api/cvs/[id] - Delete a CV
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const result = await CV.findOneAndDelete({
      _id: id,
      userId: session.user.id
    })

    if (!result) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting CV:', error)
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    )
  }
}
