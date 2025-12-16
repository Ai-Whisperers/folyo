/**
 * Folyo API - CV Analytics Route
 * GET /api/cvs/[id]/analytics - Get analytics for a CV
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

    // Verify CV belongs to user
    const cv = await CV.findOne({
      _id: id,
      userId: session.user.id
    }).select('analytics').lean()

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      )
    }

    // Get query parameters for date range
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start')
    const endDate = searchParams.get('end')

    // Default to last 30 days
    const now = new Date()
    const start = startDate ? new Date(startDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : now

    // Get detailed analytics from Analytics collection
    const dailyStats = await Analytics.aggregate([
      {
        $match: {
          cvId: cv._id,
          eventType: { $in: ['cv_view', 'cv_download'] },
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            eventType: '$eventType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          events: {
            $push: {
              type: '$_id.eventType',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          views: {
            $reduce: {
              input: '$events',
              initialValue: 0,
              in: {
                $cond: [
                  { $eq: ['$$this.type', 'cv_view'] },
                  { $add: ['$$value', '$$this.count'] },
                  '$$value'
                ]
              }
            }
          },
          downloads: {
            $reduce: {
              input: '$events',
              initialValue: 0,
              in: {
                $cond: [
                  { $eq: ['$$this.type', 'cv_download'] },
                  { $add: ['$$value', '$$this.count'] },
                  '$$value'
                ]
              }
            }
          }
        }
      },
      {
        $sort: { date: 1 }
      }
    ])

    return NextResponse.json({
      views: cv.analytics?.views || 0,
      downloads: cv.analytics?.downloads || 0,
      uniqueVisitors: cv.analytics?.uniqueVisitors || 0,
      dailyStats
    })
  } catch (error) {
    console.error('Error fetching CV analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
