/**
 * Folyo API - Publish CV Route
 * POST /api/cvs/[id]/publish - Publish a CV (make it public)
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

// Generate a unique slug
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)

  // Add random suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${suffix}`
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

    // Find the CV
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

    // Get custom slug from request body if provided
    const body = await request.json().catch(() => ({}))
    let slug = body.slug

    // If custom slug provided, validate and check availability
    if (slug) {
      slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

      if (slug.length < 3) {
        return NextResponse.json(
          { error: 'Slug must be at least 3 characters' },
          { status: 400 }
        )
      }

      // Check if slug is already taken (by another CV)
      const existingCV = await CV.findOne({
        slug,
        _id: { $ne: id }
      })

      if (existingCV) {
        return NextResponse.json(
          { error: 'This URL is already taken. Please choose another.' },
          { status: 409 }
        )
      }
    } else {
      // Generate slug from title if not already published
      slug = cv.slug || generateSlug(cv.title)

      // Ensure generated slug is unique
      let attempts = 0
      while (attempts < 5) {
        const existingCV = await CV.findOne({
          slug,
          _id: { $ne: id }
        })
        if (!existingCV) break
        slug = generateSlug(cv.title)
        attempts++
      }
    }

    // Update CV to published state
    cv.status = 'published'
    cv.isPublic = true
    cv.slug = slug
    cv.lastEditedAt = new Date()

    await cv.save()

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
    console.error('Error publishing CV:', error)
    return NextResponse.json(
      { error: 'Failed to publish CV' },
      { status: 500 }
    )
  }
}
