/**
 * Analytics Model declarations
 */

import { Document, Model, Types } from 'mongoose'

interface AnalyticsDocument extends Document {
  _id: Types.ObjectId
  userId: Types.ObjectId
  cvId: Types.ObjectId
  eventType: string
  metadata?: Record<string, unknown>
  ipAddress: string
  userAgent: string
  referrer?: string
  country?: string
  device?: {
    type: 'desktop' | 'mobile' | 'tablet'
    browser?: string
    os?: string
  }
  sessionId?: string
  createdAt: Date
  updatedAt: Date

  // Instance methods
  getDeviceInfo(): {
    type: string
    browser?: string
    os?: string
  }
}

interface AnalyticsModel extends Model<AnalyticsDocument> {
  getCVStats(cvId: string, timeframe?: string): Promise<Record<string, { count: number; uniqueUsers: number }>>
  getUserActivity(userId: string, timeframe?: string): Promise<Array<{
    _id: { date: string; eventType: string }
    count: number
  }>>
  getTopCVs(timeframe?: string, limit?: number): Promise<Array<{
    cvId: string
    views: number
    uniqueViewers: number
    cv: {
      title: string
      slug?: string
    }
    user: {
      name: string
    }
  }>>
}

declare const Analytics: AnalyticsModel
export = Analytics
