'use client'

import { useState, useCallback } from 'react'
import { AppError, ErrorType, createError, handleApiError } from '@/lib/types/errors'

export function useError() {
  const [error, setError] = useState<AppError | null>(null)

  const setAppError = useCallback((type: ErrorType, details?: string) => {
    setError(createError(type, details))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Response) {
      setError(handleApiError(err))
    } else if (err instanceof Error) {
      // Check for common error patterns
      const message = err.message.toLowerCase()
      if (message.includes('network') || message.includes('fetch')) {
        setError(createError('NETWORK_ERROR'))
      } else if (message.includes('unauthorized') || message.includes('auth')) {
        setError(createError('AUTH_ERROR'))
      } else {
        setError(createError('UNKNOWN_ERROR', err.message))
      }
    } else if (typeof err === 'string') {
      setError(createError('UNKNOWN_ERROR', err))
    } else {
      setError(createError('UNKNOWN_ERROR'))
    }
  }, [])

  return {
    error,
    setError: setAppError,
    clearError,
    handleError,
    hasError: error !== null
  }
}
