'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { CV, CVFormData } from '../types'
import * as cvApi from '../api/cv'
import { DEFAULT_CV_DATA } from '../types/cv'

interface UseCVOptions {
  id?: string
  autoSave?: boolean
  autoSaveDelay?: number
  onSave?: (cv: CV) => void
  onError?: (error: Error) => void
}

interface UseCVReturn {
  // Data
  data: CVFormData
  cv: CV | null

  // State
  isLoading: boolean
  isSaving: boolean
  isAutoSaving: boolean
  error: string | null
  lastSaved: Date | null
  hasUnsavedChanges: boolean

  // Actions
  setData: (data: CVFormData | ((prev: CVFormData) => CVFormData)) => void
  updateField: (path: string, value: unknown) => void
  save: () => Promise<void>
  reset: () => void
  publish: (slug?: string) => Promise<void>
  unpublish: () => Promise<void>
}

export function useCV(options: UseCVOptions = {}): UseCVReturn {
  const {
    id,
    autoSave = true,
    autoSaveDelay = 2000,
    onSave,
    onError
  } = options

  // State
  const [data, setDataState] = useState<CVFormData>(DEFAULT_CV_DATA)
  const [cv, setCv] = useState<CV | null>(null)
  const [isLoading, setIsLoading] = useState(!!id)
  const [isSaving, setIsSaving] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Refs
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedDataRef = useRef<string>('')

  // Load CV data if ID provided
  useEffect(() => {
    if (!id) {
      // Load from localStorage for new CVs
      const savedData = localStorage.getItem('folyo-cv-draft')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setDataState(parsed)
          lastSavedDataRef.current = savedData
        } catch (e) {
          console.error('Failed to load draft:', e)
        }
      }
      return
    }

    const loadCV = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const fetchedCV = await cvApi.fetchCV(id)
        setCv(fetchedCV)

        // Transform CV to form data
        const formData: CVFormData = {
          theme_skin: fetchedCV.theme?.skin || fetchedCV.theme_skin || 'teal',
          sidebar: {
            ...fetchedCV.sidebar,
            position: fetchedCV.theme?.sidebarPosition || 'right',
            languages: fetchedCV.languages || { title: 'Languages', info: [] }
          },
          'career-profile': fetchedCV.careerProfile || fetchedCV['career-profile'] || {
            title: 'Career Profile',
            summary: ''
          },
          experiences: fetchedCV.experiences || { title: 'Experiences', info: [] },
          education: fetchedCV.education || { title: 'Education', info: [] },
          skills: fetchedCV.skills || { title: 'Skills & Proficiency', toolset: [] },
          projects: fetchedCV.projects || { title: 'Projects', intro: '', assignments: [] },
          certifications: fetchedCV.certifications || { title: 'Certifications', list: [] },
          interests: fetchedCV.interests || { title: 'Interests', info: [] },
          portfolio: fetchedCV.portfolio,
          volunteer: fetchedCV.volunteer
        }

        setDataState(formData)
        lastSavedDataRef.current = JSON.stringify(formData)
        setLastSaved(new Date(fetchedCV.lastEditedAt || fetchedCV.updatedAt || Date.now()))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load CV'
        setError(message)
        onError?.(err instanceof Error ? err : new Error(message))
      } finally {
        setIsLoading(false)
      }
    }

    loadCV()
  }, [id, onError])

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || isLoading) return

    const currentData = JSON.stringify(data)

    // Check if data has changed
    if (currentData === lastSavedDataRef.current) {
      setHasUnsavedChanges(false)
      return
    }

    setHasUnsavedChanges(true)

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setIsAutoSaving(true)

      try {
        if (id) {
          // Save to server
          await cvApi.autosaveCV(id, data)
        } else {
          // Save to localStorage for new CVs
          localStorage.setItem('folyo-cv-draft', currentData)
        }

        lastSavedDataRef.current = currentData
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
      } catch (err) {
        console.error('Auto-save failed:', err)
        // Don't show error for auto-save failures
      } finally {
        setIsAutoSaving(false)
      }
    }, autoSaveDelay)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [data, autoSave, autoSaveDelay, id, isLoading])

  // Set data with callback support
  const setData = useCallback((
    newData: CVFormData | ((prev: CVFormData) => CVFormData)
  ) => {
    setDataState(prev => {
      if (typeof newData === 'function') {
        return newData(prev)
      }
      return newData
    })
  }, [])

  // Update a specific field using dot notation path
  const updateField = useCallback((path: string, value: unknown) => {
    setDataState(prev => {
      const keys = path.split('.')
      const newData = { ...prev }
      let current: Record<string, unknown> = newData

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        current[key] = { ...(current[key] as Record<string, unknown>) }
        current = current[key] as Record<string, unknown>
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
  }, [])

  // Manual save
  const save = useCallback(async () => {
    setIsSaving(true)
    setError(null)

    try {
      let savedCV: CV

      if (id) {
        savedCV = await cvApi.updateCV(id, data)
      } else {
        // Create new CV
        savedCV = await cvApi.createCV({
          title: data.sidebar.name || 'Untitled CV',
          ...data
        })
        // Clear draft from localStorage
        localStorage.removeItem('folyo-cv-draft')
      }

      setCv(savedCV)
      lastSavedDataRef.current = JSON.stringify(data)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      onSave?.(savedCV)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save CV'
      setError(message)
      onError?.(err instanceof Error ? err : new Error(message))
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [id, data, onSave, onError])

  // Reset to last saved state
  const reset = useCallback(() => {
    if (lastSavedDataRef.current) {
      try {
        setDataState(JSON.parse(lastSavedDataRef.current))
        setHasUnsavedChanges(false)
      } catch (e) {
        console.error('Failed to reset:', e)
      }
    }
  }, [])

  // Publish CV
  const publish = useCallback(async (slug?: string) => {
    if (!id) {
      throw new Error('Save the CV first before publishing')
    }

    setIsSaving(true)
    setError(null)

    try {
      const publishedCV = await cvApi.publishCV(id, slug)
      setCv(publishedCV)
      onSave?.(publishedCV)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to publish CV'
      setError(message)
      onError?.(err instanceof Error ? err : new Error(message))
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [id, onSave, onError])

  // Unpublish CV
  const unpublish = useCallback(async () => {
    if (!id) return

    setIsSaving(true)
    setError(null)

    try {
      const unpublishedCV = await cvApi.unpublishCV(id)
      setCv(unpublishedCV)
      onSave?.(unpublishedCV)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unpublish CV'
      setError(message)
      onError?.(err instanceof Error ? err : new Error(message))
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [id, onSave, onError])

  return {
    data,
    cv,
    isLoading,
    isSaving,
    isAutoSaving,
    error,
    lastSaved,
    hasUnsavedChanges,
    setData,
    updateField,
    save,
    reset,
    publish,
    unpublish
  }
}

export default useCV
