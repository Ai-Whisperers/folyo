'use client'

import { useMemo } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface Section {
  id: string
  label: string
  required?: boolean
}

interface ProgressIndicatorProps {
  sections: Section[]
  completedSections: string[]
  currentSection?: string
  onSectionClick?: (sectionId: string) => void
  variant?: 'horizontal' | 'vertical' | 'compact'
}

export function ProgressIndicator({
  sections,
  completedSections,
  currentSection,
  onSectionClick,
  variant = 'horizontal',
}: ProgressIndicatorProps) {
  const progress = useMemo(() => {
    const requiredSections = sections.filter(s => s.required !== false)
    const completedRequired = requiredSections.filter(s => completedSections.includes(s.id))
    return Math.round((completedRequired.length / requiredSections.length) * 100)
  }, [sections, completedSections])

  const completedCount = completedSections.length
  const totalCount = sections.length

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
          {completedCount}/{totalCount}
        </span>
      </div>
    )
  }

  if (variant === 'vertical') {
    return (
      <nav aria-label="Progress" className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-semibold text-teal-600">{progress}%</span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="space-y-1">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id)
            const isCurrent = currentSection === section.id

            return (
              <li key={section.id}>
                <button
                  onClick={() => onSectionClick?.(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all
                    ${isCurrent
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : isCompleted
                        ? 'text-gray-600 hover:bg-gray-50'
                        : 'text-gray-500 hover:bg-gray-50'
                    }
                  `}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5 text-teal-500" aria-hidden="true" />
                    ) : section.required ? (
                      <span className={`
                        w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium
                        ${isCurrent ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xs">
                        {index + 1}
                      </span>
                    )}
                  </span>
                  <span className="flex-1 truncate">{section.label}</span>
                  {section.required && !isCompleted && (
                    <ExclamationCircleIcon
                      className="w-4 h-4 text-amber-500 flex-shrink-0"
                      aria-label="Required"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  // Horizontal variant (default)
  return (
    <nav aria-label="Progress" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        <span className="text-sm font-semibold text-teal-600">{progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Profile ${progress}% complete`}
        />
      </div>

      {/* Section indicators */}
      <ol className="flex items-center gap-1 overflow-x-auto pb-2">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id)
          const isCurrent = currentSection === section.id

          return (
            <li key={section.id} className="flex items-center">
              <button
                onClick={() => onSectionClick?.(section.id)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                  ${isCurrent
                    ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-500 ring-offset-1'
                    : isCompleted
                      ? 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? (
                  <CheckCircleIcon className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <span className={`
                    w-3.5 h-3.5 flex items-center justify-center rounded-full text-[10px]
                    ${isCurrent ? 'bg-teal-500 text-white' : 'bg-gray-300 text-gray-600'}
                  `}>
                    {index + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{section.label}</span>
              </button>

              {index < sections.length - 1 && (
                <div
                  className={`w-4 h-0.5 mx-1 ${isCompleted ? 'bg-teal-300' : 'bg-gray-200'}`}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Pre-defined sections for CV builder
export const CV_SECTIONS = [
  { id: 'contact', label: 'Contact Info', required: true },
  { id: 'summary', label: 'Summary', required: true },
  { id: 'experience', label: 'Experience', required: true },
  { id: 'education', label: 'Education', required: true },
  { id: 'skills', label: 'Skills', required: true },
  { id: 'projects', label: 'Projects', required: false },
  { id: 'certifications', label: 'Certifications', required: false },
  { id: 'languages', label: 'Languages', required: false },
]

export default ProgressIndicator
