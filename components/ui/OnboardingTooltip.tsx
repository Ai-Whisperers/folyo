'use client'

import { useState, useEffect, useCallback } from 'react'
import { XMarkIcon, ArrowRightIcon, ArrowLeftIcon, LightBulbIcon } from '@heroicons/react/24/outline'

interface TooltipStep {
  id: string
  title: string
  content: string
  target?: string // CSS selector for the target element
  position?: 'top' | 'bottom' | 'left' | 'right'
}

interface OnboardingTooltipProps {
  steps: TooltipStep[]
  storageKey?: string
  onComplete?: () => void
  onSkip?: () => void
}

export function OnboardingTooltip({
  steps,
  storageKey = 'folyo-onboarding-completed',
  onComplete,
  onSkip,
}: OnboardingTooltipProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Check if onboarding was already completed
  useEffect(() => {
    const completed = localStorage.getItem(storageKey)
    if (!completed) {
      // Delay showing to let page render
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [storageKey])

  // Position tooltip relative to target element
  useEffect(() => {
    if (!isVisible) return

    const step = steps[currentStep]
    if (!step?.target) {
      // Center on screen if no target
      setPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 175,
      })
      return
    }

    const target = document.querySelector(step.target)
    if (!target) return

    const rect = target.getBoundingClientRect()
    const tooltipWidth = 350
    const tooltipHeight = 180
    const offset = 12

    let top = 0
    let left = 0

    switch (step.position || 'bottom') {
      case 'top':
        top = rect.top - tooltipHeight - offset
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - tooltipWidth - offset
        break
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + offset
        break
    }

    // Keep within viewport bounds
    top = Math.max(20, Math.min(top, window.innerHeight - tooltipHeight - 20))
    left = Math.max(20, Math.min(left, window.innerWidth - tooltipWidth - 20))

    setPosition({ top, left })

    // Highlight target element
    target.classList.add('ring-2', 'ring-teal-500', 'ring-offset-2', 'relative', 'z-40')
    return () => {
      target.classList.remove('ring-2', 'ring-teal-500', 'ring-offset-2', 'relative', 'z-40')
    }
  }, [currentStep, isVisible, steps])

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }, [currentStep, steps.length])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const handleComplete = useCallback(() => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    onComplete?.()
  }, [storageKey, onComplete])

  const handleSkip = useCallback(() => {
    localStorage.setItem(storageKey, 'true')
    setIsVisible(false)
    onSkip?.()
  }, [storageKey, onSkip])

  // Keyboard navigation
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleSkip()
          break
        case 'ArrowRight':
        case 'Enter':
          handleNext()
          break
        case 'ArrowLeft':
          handlePrev()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, handleNext, handlePrev, handleSkip])

  if (!isVisible || steps.length === 0) return null

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-30"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-[350px] bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        style={{ top: position.top, left: position.left }}
        role="dialog"
        aria-label="Onboarding guide"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-100 rounded-lg">
              <LightBulbIcon className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">
              Tip {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Skip tour"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            {step.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-xl">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
            >
              {isLastStep ? 'Got it!' : 'Next'}
              {!isLastStep && <ArrowRightIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentStep ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// Pre-defined onboarding steps for the CV builder
export const BUILDER_ONBOARDING_STEPS: TooltipStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Folyo! 🎉',
    content: 'Let\'s create your professional portfolio. This quick tour will show you around.',
  },
  {
    id: 'contact',
    title: 'Start with your details',
    content: 'Add your contact information first. This appears in the sidebar of your portfolio.',
    target: '[data-section="contact"]',
    position: 'right',
  },
  {
    id: 'theme',
    title: 'Choose your style',
    content: 'Pick a theme that matches your personality. You can change it anytime!',
    target: '[data-section="theme"]',
    position: 'bottom',
  },
  {
    id: 'preview',
    title: 'Live preview',
    content: 'See your changes instantly on the right. Toggle mobile view to check responsiveness.',
    target: '[data-section="preview"]',
    position: 'left',
  },
  {
    id: 'save',
    title: 'Auto-save enabled',
    content: 'Your work is saved automatically. Look for the green checkmark to confirm.',
    target: '[data-section="save"]',
    position: 'bottom',
  },
]

export default OnboardingTooltip
