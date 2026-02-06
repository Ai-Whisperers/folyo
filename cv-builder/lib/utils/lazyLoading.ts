/**
 * Dynamic imports and lazy loading utilities
 */

import { lazy } from 'react'

/**
 * Lazy load components with loading fallback
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFunc)
  
  // Return a component that handles loading state
  return (props: React.ComponentProps<T>) => {
    return (
      <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }
}

/**
 * Lazy component imports
 */
export const LazyCVPreview = lazyLoad(() => import('@/components/cv/CVPreview'))
export const LazyPortfolioView = lazyLoad(() => import('@/components/portfolio/PortfolioView'))
export const LazyAIAssistant = lazyLoad(() => import('@/components/ai/AIAssistant'))
export const LazyImageUpload = lazyLoad(() => import('@/components/common/ImageUpload'))

/**
 * Lazy load heavy utilities only when needed
 */
export const loadPDFExport = () => import('@/lib/utils/pdfExport')
export const loadCVValidation = () => import('@/lib/validation/cvValidator')
export const loadAnalytics = () => import('@/lib/services/analytics')

/**
 * Intersection Observer for lazy loading
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      observerRef.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      })

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      }
    }
  }, [callback, options])

  const observe = React.useCallback((element: Element | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [])

  const unobserve = React.useCallback((element: Element) => {
    if (element && observerRef.current) {
      observerRef.current.unobserve(element)
    }
  }, [])

  return { observe, unobserve }
}

/**
 * Preload critical components
 */
export function preloadComponent(importFunc: () => Promise<{ default: React.ComponentType }>) {
  const componentLoader = importFunc()
  
  // Preload by calling the import but not using it
  componentLoader.catch(error => {
    console.warn('Failed to preload component:', error)
  })
  
  return componentLoader
}