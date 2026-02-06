'use client'

import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AppError } from '@/lib/types/errors'

interface ErrorDisplayProps {
  error: AppError | null
  onDismiss?: () => void
  className?: string
}

export function ErrorDisplay({ error, onDismiss, className = '' }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className={`rounded-md bg-red-50 p-4 ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {error.message}
          </h3>
          {error.details && (
            <div className="mt-2 text-sm text-red-700">
              {error.details}
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              aria-label="Dismiss error"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Simpler inline version for forms
interface InlineErrorProps {
  message: string | null
}

export function InlineError({ message }: InlineErrorProps) {
  if (!message) return null
  
  return (
    <p className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  )
}
