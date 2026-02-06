/**
 * Dynamic imports and lazy loading utilities
 */

import React, { lazy, useCallback, useEffect, useRef } from 'react'

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
    return React.createElement(
      React.Suspense,
      { 
        fallback: fallback ? React.createElement(fallback) : React.createElement('div', null, 'Loading...') 
      },
      React.createElement(LazyComponent, props)
    )
  }
}

/**
 * Lazy component imports
 */
export const LazyCVPreview = lazyLoad(() => import('@/components/cv/CVPreview').then(m => ({ default: m.CVPreview })))
export const LazyPortfolioView = lazyLoad(() => import('@/components/portfolio/PortfolioView').then(m => ({ default: m.PortfolioView })))
export const LazyAIAssistant = lazyLoad(() => import('@/components/ai/AIAssistant').then(m => ({ default: m.AIAssistant })))
export const LazyImageUpload = lazyLoad(() => import('@/components/common/ImageUpload').then(m => ({ default: m.ImageUpload })))

/**
 * Lazy load heavy utilities only when needed
 */
export const loadPDFExport = () => import('@/lib/utils/pdfExport').then(m => m.default || m)
export const loadCVValidation = () => import('@/lib/validation/cvValidator').then(m => m.default || m)
export const loadAnalytics = () => import('@/lib/services/analytics').then(m => m.default || m)

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