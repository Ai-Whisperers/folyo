'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface CV {
  _id: string
  title: string
  slug?: string
  status: 'draft' | 'published' | 'archived'
  isPublic: boolean
  createdAt: string
  updatedAt: string
  lastEditedAt: string
  theme: {
    skin: string
  }
  analytics: {
    views: number
    downloads: number
  }
  sidebar: {
    name?: string
    tagline?: string
  }
}

interface UserAnalytics {
  cv_view: number
  cv_download: number
  cv_edit: number
  cv_created: number
  export_pdf: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cvs, setCvs] = useState<CV[]>([])
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCvs, setSelectedCvs] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchUserData()
  }, [session, status])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      const [cvsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/user/cvs', {
          headers: {
            'x-user-id': (session?.user as any)?.id || ''
          }
        }),
        fetch('/api/user/analytics', {
          headers: {
            'x-user-id': (session?.user as any)?.id || ''
          }
        })
      ])

      if (cvsResponse.ok) {
        const cvsData = await cvsResponse.json()
        setCvs(cvsData.cvs || [])
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData.analytics || {})
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/cv/${cvId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': (session?.user as any)?.id || ''
        }
      })

      if (response.ok) {
        setCvs(prev => prev.filter(cv => cv._id !== cvId))
      } else {
        alert('Failed to delete CV. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting CV:', error)
      alert('Failed to delete CV. Please try again.')
    }
  }

  const handleTogglePublish = async (cvId: string, isCurrentlyPublic: boolean) => {
    try {
      const endpoint = isCurrentlyPublic ? 'unpublish' : 'publish'
      const response = await fetch(`/api/cv/${cvId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'x-user-id': (session?.user as any)?.id || ''
        }
      })

      if (response.ok) {
        setCvs(prev => prev.map(cv =>
          cv._id === cvId
            ? { ...cv, isPublic: !isCurrentlyPublic, status: !isCurrentlyPublic ? 'published' : 'draft' }
            : cv
        ))
      } else {
        alert(`Failed to ${endpoint} CV. Please try again.`)
      }
    } catch (error) {
      console.error(`Error ${isCurrentlyPublic ? 'unpublishing' : 'publishing'} CV:`, error)
      alert(`Failed to ${isCurrentlyPublic ? 'unpublish' : 'publish'} CV. Please try again.`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getThemeColor = (skin: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-500',
      turquoise: 'bg-teal-500',
      green: 'bg-green-500',
      berry: 'bg-purple-500',
      orange: 'bg-orange-500',
      ceramic: 'bg-amber-500',
      teal: 'bg-cyan-500',
      oceanstale: 'bg-gray-500'
    }
    return colors[skin] || 'bg-gray-500'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                CV Builder Pro
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChartBarIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{(session?.user as any)?.subscription?.plan || 'Free'}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{cvs.length}</p>
                  <p className="text-sm text-gray-600">Total CVs</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <EyeIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analytics.cv_view || 0}</p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <ShareIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analytics.cv_download || 0}</p>
                  <p className="text-sm text-gray-600">Downloads</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analytics.cv_edit || 0}</p>
                  <p className="text-sm text-gray-600">Edits Made</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">My CVs</h1>
                <p className="text-sm text-gray-600">Manage your professional CV collection</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-md text-sm ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                      }`}
                  >
                    List
                  </button>
                </div>
                <Link
                  href="/builder?type=cv"
                  className="bg-white border text-gray-700 hover:bg-gray-50 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  New CV
                </Link>
                <Link
                  href="/builder?type=portfolio"
                  className="bg-primary-600 text-white hover:bg-primary-700 flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Portfolio
                </Link>
              </div>
            </div>
          </div>

          {/* CV List */}
          <div className="p-6">
            {cvs.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No CVs yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first professional CV</p>
                <Link href="/builder" className="btn-primary">
                  Create Your First CV
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {cvs.map((cv) => (
                  <div key={cv._id} className={viewMode === 'grid'
                    ? 'border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow'
                    : 'border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50'
                  }>
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-3 h-3 rounded-full ${getThemeColor(cv.theme.skin)}`}></div>
                          <div className="flex items-center space-x-1">
                            {cv.isPublic && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Public
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${cv.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : cv.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {cv.status}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1">{cv.title}</h3>
                        {cv.sidebar.name && (
                          <p className="text-sm text-gray-600 mb-2">{cv.sidebar.name}</p>
                        )}
                        {cv.sidebar.tagline && (
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{cv.sidebar.tagline}</p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>Updated {formatDate(cv.lastEditedAt)}</span>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <EyeIcon className="h-3 w-3 mr-1" />
                              {cv.analytics.views}
                            </span>
                            <span className="flex items-center">
                              <ShareIcon className="h-3 w-3 mr-1" />
                              {cv.analytics.downloads}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <Link
                              href={`/builder?cvId=${cv._id}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Link>
                            {cv.isPublic && cv.slug && (
                              <a
                                href={`/cv/${cv.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                              </a>
                            )}
                            <button
                              onClick={() => handleTogglePublish(cv._id, cv.isPublic)}
                              className="text-gray-600 hover:text-gray-700"
                              title={cv.isPublic ? 'Unpublish' : 'Publish'}
                            >
                              <ShareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCV(cv._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <>
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${getThemeColor(cv.theme.skin)}`}></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{cv.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Updated {formatDate(cv.lastEditedAt)}</span>
                              <span className="flex items-center">
                                <EyeIcon className="h-3 w-3 mr-1" />
                                {cv.analytics.views} views
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${cv.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : cv.status === 'draft'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                                }`}>
                                {cv.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/builder?cvId=${cv._id}`}
                            className="btn-secondary text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(cv._id, cv.isPublic)}
                            className="btn-secondary text-sm"
                          >
                            {cv.isPublic ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteCV(cv._id)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}