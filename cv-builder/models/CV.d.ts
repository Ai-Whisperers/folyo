/**
 * CV Model declarations
 */

import { Document, Model, Types } from 'mongoose'

interface CVDocument extends Document {
  _id: Types.ObjectId
  title: string
  userId: Types.ObjectId
  slug?: string
  theme: {
    skin: string
    sidebarPosition: string
  }
  sidebar: {
    name: string
    tagline?: string
    email?: string
    phone?: string
    website?: string
    linkedin?: string
    github?: string
    location?: string
    avatar?: string
  }
  careerProfile: {
    title: string
    summary?: string
  }
  experiences: {
    title: string
    info: Array<{
      role: string
      company: string
      time: string
      location?: string
      details?: string
      tags?: string[]
      icon?: string
      order?: number
    }>
  }
  education: {
    title: string
    info: Array<{
      degree: string
      university: string
      time: string
      location?: string
      details?: string
      gpa?: string
      order?: number
    }>
  }
  skills: {
    title: string
    toolset: Array<{
      name: string
      level: number
      tags?: string[]
      category?: string
      order?: number
    }>
  }
  projects: {
    title: string
    intro?: string
    assignments: Array<{
      title: string
      time?: string
      details?: string
      technologies?: string[]
      url?: string
      github?: string
      order?: number
    }>
  }
  certifications: {
    title: string
    list: Array<{
      name: string
      organization: string
      start?: string
      end?: string
      details?: string
      url?: string
      order?: number
    }>
  }
  languages: {
    title: string
    info: Array<{
      idiom: string
      level: string
      order?: number
    }>
  }
  interests: {
    title: string
    info: Array<{
      item: string
      order?: number
    }>
  }
  publications?: {
    title: string
    intro?: string
    papers: Array<{
      title?: string
      authors?: string
      conference?: string
      details?: string
      url?: string
      order?: number
    }>
  }
  recommendations?: {
    title: string
    intro?: string
    testimonials: Array<{
      name?: string
      title?: string
      details?: string
      order?: number
    }>
  }
  portfolio?: {
    title: string
    intro?: string
    items: Array<{
      type: string
      url: string
      thumbnail?: string
      title?: string
      description?: string
      order?: number
    }>
    layout: string
  }
  status: string
  isPublic: boolean
  settings: {
    allowComments: boolean
    allowDownload: boolean
    seoOptimized: boolean
    customDomain?: string
  }
  analytics: {
    views: number
    downloads: number
    lastViewed?: Date
    lastDownloaded?: Date
    uniqueVisitors: number
  }
  version: number
  lastEditedAt: Date
  autosaveData?: unknown
  lastAutosave?: Date
  createdAt: Date
  updatedAt: Date
  publicUrl?: string

  // Instance methods
  incrementViews(): Promise<CVDocument>
  incrementDownloads(): Promise<CVDocument>
  publish(): Promise<CVDocument>
  unpublish(): Promise<CVDocument>
  createAutosave(data: unknown): Promise<CVDocument>
}

interface CVModel extends Model<CVDocument> {
  findBySlug(slug: string): Promise<CVDocument | null>
  findUserCVs(userId: string, limit?: number): Promise<CVDocument[]>
  getPopularCVs(limit?: number): Promise<CVDocument[]>
}

declare const CV: CVModel
export = CV
