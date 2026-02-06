'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'teal' | 'white' | 'gray'
  fullScreen?: boolean
  message?: string
}

const sizeClasses = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4'
}

const colorClasses = {
  teal: 'border-teal-200 border-t-teal-600',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-200 border-t-gray-600'
}

export function LoadingSpinner({
  size = 'md',
  color = 'teal',
  fullScreen = false,
  message
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      />
      {message && (
        <p className={`text-sm font-medium ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-200" />
      <div className="p-6 pt-12">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-4 bg-gray-100 rounded w-full mb-4" />
        <div className="flex justify-center gap-2">
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="flex items-center gap-6 bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
        <div className="flex gap-2">
          <div className="h-4 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-12" />
        </div>
      </div>
    </div>
  )
}
