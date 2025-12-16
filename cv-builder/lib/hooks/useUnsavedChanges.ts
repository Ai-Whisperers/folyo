'use client'

import { useEffect, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseUnsavedChangesOptions {
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean
  /** Custom message to show in the browser dialog */
  message?: string
  /** Callback when user confirms leaving */
  onConfirmLeave?: () => void
}

/**
 * Hook to warn users about unsaved changes before leaving the page
 * Handles both browser navigation (back/forward/close) and Next.js navigation
 */
export function useUnsavedChanges({
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave?',
  onConfirmLeave,
}: UseUnsavedChangesOptions) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Handle browser beforeunload event (back button, close tab, refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges, message])

  // Intercept Next.js navigation
  const handleNavigation = useCallback((href: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(href)
      setShowModal(true)
      return false
    }
    return true
  }, [hasUnsavedChanges])

  // Confirm leaving (user clicked "Leave" in modal)
  const confirmLeave = useCallback(() => {
    setShowModal(false)
    onConfirmLeave?.()
    if (pendingNavigation) {
      router.push(pendingNavigation)
      setPendingNavigation(null)
    }
  }, [pendingNavigation, router, onConfirmLeave])

  // Cancel leaving (user clicked "Stay" in modal)
  const cancelLeave = useCallback(() => {
    setShowModal(false)
    setPendingNavigation(null)
  }, [])

  return {
    showModal,
    confirmLeave,
    cancelLeave,
    handleNavigation,
  }
}

export default useUnsavedChanges
