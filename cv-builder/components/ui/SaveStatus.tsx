'use client'

import { CheckCircleIcon, CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from './LoadingSpinner'

interface SaveStatusProps {
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved?: Date | null
  hasUnsavedChanges?: boolean
  className?: string
}

export function SaveStatus({
  status,
  lastSaved,
  hasUnsavedChanges = false,
  className = ''
}: SaveStatusProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (status === 'saving') {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <LoadingSpinner size="sm" color="gray" />
        <span className="text-sm">Saving...</span>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className={`flex items-center gap-2 text-red-500 ${className}`}>
        <ExclamationCircleIcon className="w-4 h-4" />
        <span className="text-sm">Save failed</span>
      </div>
    )
  }

  if (status === 'saved' && !hasUnsavedChanges) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <CheckCircleIcon className="w-4 h-4" />
        <span className="text-sm">
          Saved {lastSaved && `at ${formatTime(lastSaved)}`}
        </span>
      </div>
    )
  }

  if (hasUnsavedChanges) {
    return (
      <div className={`flex items-center gap-2 text-amber-500 ${className}`}>
        <CloudArrowUpIcon className="w-4 h-4" />
        <span className="text-sm">Unsaved changes</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 text-gray-400 ${className}`}>
      <CloudArrowUpIcon className="w-4 h-4" />
      <span className="text-sm">Auto-save enabled</span>
    </div>
  )
}

export default SaveStatus
