/**
 * Application Error Types
 * Standardized error handling across the application
 */

export type ErrorType = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'FILE_UPLOAD_ERROR'
  | 'PDF_EXPORT_ERROR'
  | 'AI_ERROR'

export interface AppError {
  type: ErrorType
  message: string
  details?: string
  code?: string
}

export const ERROR_MESSAGES: Record<ErrorType, string> = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  AUTH_ERROR: 'Please sign in to continue.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  FILE_UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  PDF_EXPORT_ERROR: 'Failed to generate PDF. Please try again.',
  AI_ERROR: 'AI service is temporarily unavailable. Please try again later.'
}

export function createError(type: ErrorType, details?: string): AppError {
  return {
    type,
    message: ERROR_MESSAGES[type],
    details
  }
}

export function handleApiError(response: Response): AppError {
  switch (response.status) {
    case 401:
      return createError('AUTH_ERROR')
    case 404:
      return createError('NOT_FOUND')
    case 422:
      return createError('VALIDATION_ERROR')
    case 500:
    case 502:
    case 503:
      return createError('SERVER_ERROR')
    default:
      return createError('UNKNOWN_ERROR', `Status: ${response.status}`)
  }
}
