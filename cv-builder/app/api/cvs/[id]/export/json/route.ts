/**
 * Folyo API - Export CV as JSON Route
 * GET /api/cvs/[id]/export/json - Export a CV as JSON data
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/database'
import CV from '@/models/CV'

interface RouteParams {
  params: Promise<{ id: string }>
}

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

    // Find the CV
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

    // Prepare export data (exclude internal fields)
    const exportData = {
      title: cv.title,
      theme: cv.theme,
      sidebar: cv.sidebar,
      careerProfile: cv.careerProfile,
      experiences: cv.experiences,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      languages: cv.languages,
      interests: cv.interests,
      publications: cv.publications,
      recommendations: cv.recommendations,
      portfolio: cv.portfolio,
      exportedAt: new Date().toISOString(),
      exportVersion: '2.0'
    }

    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="${cv.title.replace(/[^a-z0-9]/gi, '_')}.json"`,
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Error exporting CV as JSON:', error)
    return NextResponse.json(
      { error: 'Failed to export CV' },
      { status: 500 }
    )
  }
}
