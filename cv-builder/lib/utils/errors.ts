/**
 * Error handling utilities and types
 */

export interface AppError {
  code: string
  message: string
  details?: string
  timestamp: Date
  stack?: string
}

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'PERMISSION_ERROR'
  | 'TIMEOUT_ERROR'
  | 'UNKNOWN_ERROR'

export const ERROR_MESSAGES: Record<ErrorType, string> = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  AUTH_ERROR: 'Please sign in to continue.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
}

/**
 * Create standardized error object
 */
export function createError(
  type: ErrorType, 
  details?: string, 
  originalError?: Error
): AppError {
  return {
    code: type,
    message: ERROR_MESSAGES[type],
    details,
    timestamp: new Date(),
    stack: originalError?.stack
  }
}

/**
 * Handle API response errors
 */
export function handleApiError(error: unknown): AppError {
  if (error instanceof Response) {
    switch (error.status) {
      case 400:
        return createError('VALIDATION_ERROR', 'Invalid request data')
      case 401:
        return createError('AUTH_ERROR', 'Authentication required')
      case 403:
        return createError('PERMISSION_ERROR', 'Access denied')
      case 404:
        return createError('NOT_FOUND', 'Resource not found')
      case 408:
        return createError('TIMEOUT_ERROR', 'Request timeout')
      case 500:
      case 502:
      case 503:
        return createError('SERVER_ERROR', 'Server error')
      default:
        return createError('UNKNOWN_ERROR', `HTTP ${error.status}`)
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return createError('NETWORK_ERROR', error.message, error)
    }
    if (error.message.includes('timeout')) {
      return createError('TIMEOUT_ERROR', error.message, error)
    }
    return createError('UNKNOWN_ERROR', error.message, error)
  }

  if (typeof error === 'string') {
    return createError('UNKNOWN_ERROR', error)
  }

  return createError('UNKNOWN_ERROR', 'Unknown error occurred')
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: AppError): boolean {
  const recoverableTypes = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR'
  ]
  return recoverableTypes.includes(error.code as ErrorType)
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: AppError): string {
  if (error.details) {
    return `${error.message}: ${error.details}`
  }
  return error.message
}

/**
 * Log error with context
 */
export function logError(error: AppError, context?: Record<string, any>): void {
  const logData = {
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp
    },
    context
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', logData)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
  }

  // In production, you might want to send this to an error tracking service
  // trackError(logData)
}