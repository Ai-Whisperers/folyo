'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
  xl: 'h-16 w-16 border-4'
}

const colors = {
  primary: 'border-teal-200 border-t-teal-600',
  white: 'border-white/30 border-t-white',
  gray: 'border-gray-200 border-t-gray-600'
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className = ''
}: LoadingSpinnerProps) {
  return (
    <div
      className={`
        animate-spin rounded-full
        ${sizes[size]}
        ${colors[color]}
        ${className}
      `}
    />
  )
}

interface LoadingOverlayProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingOverlay({
  message = 'Loading...',
  fullScreen = false
}: LoadingOverlayProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        ${fullScreen ? 'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm' : 'py-12'}
      `}
    >
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200'

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export function CVCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4 h-5" />
          <Skeleton variant="text" className="w-1/2 h-4" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-4/5" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton variant="rectangular" className="w-16 h-6" />
        <Skeleton variant="rectangular" className="w-20 h-6" />
      </div>
    </div>
  )
}

export function CVPreviewSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="bg-gray-100 p-8">
        <div className="flex items-center gap-6">
          <Skeleton variant="circular" width={96} height={96} />
          <div className="flex-1 space-y-3">
            <Skeleton variant="text" className="w-48 h-7" />
            <Skeleton variant="text" className="w-36 h-5" />
            <div className="flex gap-4 mt-2">
              <Skeleton variant="text" className="w-24 h-4" />
              <Skeleton variant="text" className="w-32 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        {/* Section */}
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton variant="text" className="w-32 h-6 mb-4" />
            <div className="space-y-2">
              <Skeleton variant="text" className="w-full h-4" />
              <Skeleton variant="text" className="w-4/5 h-4" />
              <Skeleton variant="text" className="w-3/5 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoadingSpinner
