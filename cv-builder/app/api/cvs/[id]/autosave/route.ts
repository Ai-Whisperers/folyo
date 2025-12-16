/**
 * Folyo API - Autosave CV Route
 * POST /api/cvs/[id]/autosave - Auto-save CV data (lightweight, no validation)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'

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

    const body = await request.json()

    // Update only the autosave data (lightweight operation)
    const result = await CV.updateOne(
      {
        _id: id,
        userId: session.user.id
      },
      {
        autosaveData: body,
        lastAutosave: new Date()
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error auto-saving CV:', error)
    return NextResponse.json(
      { error: 'Failed to auto-save CV' },
      { status: 500 }
    )
  }
}
