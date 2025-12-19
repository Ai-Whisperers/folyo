'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface CVAnalytics {
  cvId: string
  title: string
  slug?: string
  theme: string
  views: number
  downloads: number
  uniqueVisitors: number
  lastViewed?: string
}

interface OverallStats {
  totalViews: number
  totalDownloads: number
  totalUniqueVisitors: number
  totalCVs: number
  publishedCVs: number
}

export default function AnalyticsDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cvAnalytics, setCvAnalytics] = useState<CVAnalytics[]>([])
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchAnalytics()
  }, [session, status, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch user's CVs with analytics
      const response = await fetch('/api/user/cvs', {
        headers: {
          'x-user-id': (session?.user as { id?: string })?.id || ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        const cvs = data.cvs || []

        // Transform CV data to analytics format
        const analytics: CVAnalytics[] = cvs.map((cv: {
          _id: string
          title: string
          slug?: string
          theme: { skin: string }
          analytics: { views: number; downloads: number; uniqueVisitors: number; lastViewed?: string }
        }) => ({
          cvId: cv._id,
          title: cv.title,
          slug: cv.slug,
          theme: cv.theme?.skin || 'teal',
          views: cv.analytics?.views || 0,
          downloads: cv.analytics?.downloads || 0,
          uniqueVisitors: cv.analytics?.uniqueVisitors || 0,
          lastViewed: cv.analytics?.lastViewed
        }))

        // Sort by views descending
        analytics.sort((a, b) => b.views - a.views)
        setCvAnalytics(analytics)

        // Calculate overall stats
        const overall: OverallStats = {
          totalViews: analytics.reduce((sum, cv) => sum + cv.views, 0),
          totalDownloads: analytics.reduce((sum, cv) => sum + cv.downloads, 0),
          totalUniqueVisitors: analytics.reduce((sum, cv) => sum + cv.uniqueVisitors, 0),
          totalCVs: cvs.length,
          publishedCVs: cvs.filter((cv: { isPublic: boolean }) => cv.isPublic).length
        }
        setOverallStats(overall)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      teal: 'bg-teal-500',
      blue: 'bg-blue-500',
      turquoise: 'bg-cyan-500',
      green: 'bg-green-500',
      berry: 'bg-purple-500',
      orange: 'bg-orange-500',
      ceramic: 'bg-amber-500',
      oceanstale: 'bg-gray-500'
    }
    return colors[theme] || 'bg-gray-500'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="mb-6 flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === 'all' && 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalViews.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ArrowDownTrayIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalDownloads.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalUniqueVisitors.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Unique Visitors</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.publishedCVs}
                  </p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {overallStats.totalCVs}
                  </p>
                  <p className="text-sm text-gray-600">Total CVs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Per-CV Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
            <p className="text-sm text-gray-600">Analytics breakdown by portfolio</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Portfolio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Viewed
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cvAnalytics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No portfolios yet. Create your first portfolio to see analytics.
                    </td>
                  </tr>
                ) : (
                  cvAnalytics.map((cv) => (
                    <tr key={cv.cvId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getThemeColor(cv.theme)} mr-3`} />
                          <div>
                            <p className="font-medium text-gray-900">{cv.title}</p>
                            {cv.slug && (
                              <p className="text-sm text-gray-500">/cv/{cv.slug}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {cv.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {cv.downloads.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {cv.uniqueVisitors.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(cv.lastViewed)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          {cv.slug && (
                            <a
                              href={`/cv/${cv.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                            >
                              View
                            </a>
                          )}
                          <Link
                            href={`/builder?cvId=${cv.cvId}`}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
