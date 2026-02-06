'use client'

import { useState, useEffect } from 'react'
import {
  EyeIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface AnalyticsCardProps {
  cvId: string
}

interface AnalyticsData {
  views?: number
  downloads?: number
  uniqueVisitors?: number
  lastViewed?: string
  dailyStats?: Array<{ date: string; views: number; downloads: number }>
}

export function AnalyticsCard({ cvId }: AnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/cvs/${cvId}/analytics`)
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [cvId])

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />
  }

  if (!analytics) {
    return null
  }

  const stats = [
    {
      label: 'Total Views',
      value: analytics.views || 0,
      icon: EyeIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'Downloads',
      value: analytics.downloads || 0,
      icon: ArrowDownTrayIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Unique Visitors',
      value: analytics.uniqueVisitors || 0,
      icon: UserGroupIcon,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Portfolio Analytics
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
