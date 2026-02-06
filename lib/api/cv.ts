/**
 * Folyo CV API Client
 * Functions for interacting with the CV API
 */

import type { CV, CVFormData, CVListResponse, CVResponse, CVSaveResponse } from '../types'

const API_BASE = '/api'

// ============================================
// Helper Functions
// ============================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// ============================================
// CV CRUD Operations
// ============================================

/**
 * Fetch all CVs for the current user
 */
export async function fetchCVs(options?: {
  page?: number
  limit?: number
  status?: 'draft' | 'published' | 'archived'
}): Promise<CVListResponse> {
  const params = new URLSearchParams()
  if (options?.page) params.set('page', options.page.toString())
  if (options?.limit) params.set('limit', options.limit.toString())
  if (options?.status) params.set('status', options.status)

  const response = await fetch(`${API_BASE}/cvs?${params}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  return handleResponse<CVListResponse>(response)
}

/**
 * Fetch a single CV by ID
 */
export async function fetchCV(id: string): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  const data = await handleResponse<CVResponse>(response)
  if (!data.cv) throw new Error('CV not found')
  return data.cv
}

/**
 * Fetch a public CV by slug
 */
export async function fetchPublicCV(slug: string): Promise<CV> {
  const response = await fetch(`${API_BASE}/cv/${slug}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await handleResponse<CVResponse>(response)
  if (!data.cv) throw new Error('CV not found')
  return data.cv
}

/**
 * Create a new CV
 */
export async function createCV(data: Partial<CVFormData> & { title: string }): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  const result = await handleResponse<CVSaveResponse>(response)
  if (!result.cv) throw new Error(result.error || 'Failed to create CV')
  return result.cv
}

/**
 * Update an existing CV
 */
export async function updateCV(id: string, data: Partial<CVFormData>): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  const result = await handleResponse<CVSaveResponse>(response)
  if (!result.cv) throw new Error(result.error || 'Failed to update CV')
  return result.cv
}

/**
 * Delete a CV
 */
export async function deleteCV(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/cvs/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })

  await handleResponse(response)
}

/**
 * Duplicate a CV
 */
export async function duplicateCV(id: string): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs/${id}/duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  const result = await handleResponse<CVSaveResponse>(response)
  if (!result.cv) throw new Error(result.error || 'Failed to duplicate CV')
  return result.cv
}

// ============================================
// CV Publishing
// ============================================

/**
 * Publish a CV (make it public)
 */
export async function publishCV(id: string, slug?: string): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs/${id}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ slug })
  })

  const result = await handleResponse<CVSaveResponse>(response)
  if (!result.cv) throw new Error(result.error || 'Failed to publish CV')
  return result.cv
}

/**
 * Unpublish a CV (make it private)
 */
export async function unpublishCV(id: string): Promise<CV> {
  const response = await fetch(`${API_BASE}/cvs/${id}/unpublish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  const result = await handleResponse<CVSaveResponse>(response)
  if (!result.cv) throw new Error(result.error || 'Failed to unpublish CV')
  return result.cv
}

// ============================================
// Auto-save
// ============================================

/**
 * Auto-save CV data (lightweight, no validation)
 */
export async function autosaveCV(id: string, data: Partial<CVFormData>): Promise<void> {
  const response = await fetch(`${API_BASE}/cvs/${id}/autosave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  await handleResponse(response)
}

// ============================================
// Analytics
// ============================================

/**
 * Track CV view (for public CVs)
 */
export async function trackView(slug: string): Promise<void> {
  await fetch(`${API_BASE}/cv/${slug}/view`, {
    method: 'POST'
  })
}

/**
 * Track CV download
 */
export async function trackDownload(id: string): Promise<void> {
  await fetch(`${API_BASE}/cvs/${id}/download`, {
    method: 'POST',
    credentials: 'include'
  })
}

/**
 * Get CV analytics
 */
export async function getCVAnalytics(id: string, options?: {
  startDate?: string
  endDate?: string
}): Promise<{
  views: number
  downloads: number
  uniqueVisitors: number
  dailyStats: Array<{ date: string; views: number; downloads: number }>
}> {
  const params = new URLSearchParams()
  if (options?.startDate) params.set('start', options.startDate)
  if (options?.endDate) params.set('end', options.endDate)

  const response = await fetch(`${API_BASE}/cvs/${id}/analytics?${params}`, {
    method: 'GET',
    credentials: 'include'
  })

  return handleResponse(response)
}

// ============================================
// Export
// ============================================

/**
 * Export CV as PDF (server-side generation)
 */
export async function exportPDF(id: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/cvs/${id}/export/pdf`, {
    method: 'GET',
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to export PDF')
  }

  return response.blob()
}

/**
 * Export CV as JSON
 */
export async function exportJSON(id: string): Promise<CVFormData> {
  const response = await fetch(`${API_BASE}/cvs/${id}/export/json`, {
    method: 'GET',
    credentials: 'include'
  })

  return handleResponse(response)
}
