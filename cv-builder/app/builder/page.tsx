'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { CVBuilderForm } from '../../components/cv/CVBuilderForm'
import { CVPreview } from '../../components/cv/CVPreview'
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher'
import { ExportButton } from '../../components/common/ExportButton'
import { SaveButton } from '../../components/common/SaveButton'
import {
  SaveStatus,
  UnsavedChangesModal,
  ProgressIndicator,
  OnboardingTooltip,
  BUILDER_ONBOARDING_STEPS,
} from '../../components/ui'
import { useUnsavedChanges } from '../../lib/hooks'
import {
  EyeIcon,
  PencilIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

// Default CV data structure matching the Jekyll template
const defaultCVData = {
  theme_skin: 'teal',
  sidebar: {
    position: 'right',
    about: false,
    education: false,
    name: '',
    tagline: '',
    avatar: 'profile-picture-placeholder.jpg',
    email: '',
    phone: '',
    timezone: '',
    citizenship: '',
    website: '',
    linkedin: '',
    github: '',
    pdf: '',
    languages: {
      title: 'Languages',
      info: []
    }
  },
  interests: {
    title: 'Interests',
    info: []
  },
  'career-profile': {
    title: 'Career Profile',
    summary: ''
  },
  education: {
    title: 'Education',
    info: []
  },
  experiences: {
    title: 'Experiences',
    info: []
  },
  skills: {
    title: 'Skills & Proficiency',
    toolset: []
  },
  projects: {
    title: 'Projects',
    intro: '',
    assignments: []
  },
  certifications: {
    title: 'Certifications',
    list: []
  },
  volunteer: {
    title: 'Volunteer Work',
    info: []
  }
}

// CV Builder sections for progress tracking
const CV_SECTIONS = [
  { id: 'contact', label: 'Contact', required: true },
  { id: 'summary', label: 'Summary', required: true },
  { id: 'experience', label: 'Experience', required: true },
  { id: 'education', label: 'Education', required: true },
  { id: 'skills', label: 'Skills', required: true },
  { id: 'projects', label: 'Projects', required: false },
  { id: 'certifications', label: 'Certs', required: false },
]

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState(defaultCVData)
  const [initialData, setInitialData] = useState(defaultCVData)
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Calculate completed sections for progress indicator
  const completedSections = useMemo(() => {
    const completed: string[] = []

    // Contact info check
    if (cvData.sidebar.name && cvData.sidebar.email) {
      completed.push('contact')
    }

    // Career profile/summary check
    if (cvData['career-profile']?.summary && cvData['career-profile'].summary.length > 20) {
      completed.push('summary')
    }

    // Experience check
    if (cvData.experiences?.info && cvData.experiences.info.length > 0) {
      completed.push('experience')
    }

    // Education check
    if (cvData.education?.info && cvData.education.info.length > 0) {
      completed.push('education')
    }

    // Skills check
    if (cvData.skills?.toolset && cvData.skills.toolset.length > 0) {
      completed.push('skills')
    }

    // Projects check
    if (cvData.projects?.assignments && cvData.projects.assignments.length > 0) {
      completed.push('projects')
    }

    // Certifications check
    if (cvData.certifications?.list && cvData.certifications.list.length > 0) {
      completed.push('certifications')
    }

    return completed
  }, [cvData])

  // Check for unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(cvData) !== JSON.stringify(initialData)
  }, [cvData, initialData])

  // Unsaved changes warning
  const {
    showModal: showUnsavedModal,
    confirmLeave,
    cancelLeave,
  } = useUnsavedChanges({
    hasUnsavedChanges,
    message: 'You have unsaved changes. Are you sure you want to leave?',
  })

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)

    // Check URL params for document type and theme
    const searchParams = new URLSearchParams(window.location.search)
    const docType = searchParams.get('type')
    const themeParam = searchParams.get('theme')

    // Load saved data from localStorage
    const savedData = localStorage.getItem('cv-data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)

        // If a specific theme is requested via URL, use it
        if (themeParam) {
          parsed.theme_skin = themeParam
        } else if (docType === 'portfolio') {
          // If creating new portfolio, force switch to that theme regardless of saved state
          parsed.theme_skin = 'video-portfolio'
        }

        setCvData(parsed)
        setInitialData(parsed)
      } catch (error) {
        console.error('Error loading saved CV data:', error)
      }
    } else {
      // No saved data - create new with requested theme
      let initialTheme = 'teal'
      if (themeParam) {
        initialTheme = themeParam
      } else if (docType === 'portfolio') {
        initialTheme = 'video-portfolio'
      }
      const newData = { ...defaultCVData, theme_skin: initialTheme }
      setCvData(newData)
      setInitialData(newData)
    }
  }, [])

  // Auto-save functionality with debounce
  useEffect(() => {
    if (!isClient || !hasUnsavedChanges) return

    setSaveStatus('saving')

    const saveData = () => {
      try {
        localStorage.setItem('cv-data', JSON.stringify(cvData))
        setInitialData(cvData)
        setSaveStatus('saved')
        setLastSaved(new Date())
      } catch (error) {
        console.error('Error saving:', error)
        setSaveStatus('error')
      }
    }

    const timeoutId = setTimeout(saveData, 1500) // Auto-save after 1.5 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [cvData, isClient, hasUnsavedChanges])

  const handleDataChange = useCallback((newData: typeof cvData) => {
    setCvData(newData)
  }, [])

  const handleThemeChange = useCallback((theme: string) => {
    setCvData(prev => ({
      ...prev,
      theme_skin: theme
    }))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    try {
      // TODO: Implement API call to save CV data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      localStorage.setItem('cv-data', JSON.stringify(cvData))
      setInitialData(cvData)
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'json' | 'yaml') => {
    if (format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cvData, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', `${cvData.sidebar.name || 'cv'}.json`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } else if (format === 'yaml') {
      const dataStr = 'data:text/yaml;charset=utf-8,' + encodeURIComponent(JSON.stringify(cvData, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', dataStr)
      downloadAnchorNode.setAttribute('download', `${cvData.sidebar.name || 'cv'}.yaml`)
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    } else if (format === 'pdf') {
      try {
        // Use enhanced PDF export
        const { exportCVToPDF } = await import('@/lib/utils/pdfExport')
        await exportCVToPDF(cvData, {
          filename: `${cvData.sidebar.name || 'cv'}.pdf`,
          quality: 2,
          scale: 2
        })
      } catch (error) {
        console.error('PDF export failed:', error)
        alert('Failed to generate PDF. Please try again.')
      }
    }
  }

  if (!isClient) {
    // Prevent hydration mismatch
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Onboarding tooltip for first-time users */}
      <OnboardingTooltip
        steps={BUILDER_ONBOARDING_STEPS}
        storageKey="folyo-builder-onboarding"
      />

      {/* Unsaved changes modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and back */}
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Back to dashboard"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div className="hidden sm:block h-6 w-px bg-gray-200" />
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-lg font-bold text-gray-900 hidden sm:inline">Folyo</span>
              </Link>

              {/* Save status indicator */}
              <div className="hidden sm:block" data-section="save">
                <SaveStatus
                  status={saveStatus}
                  lastSaved={lastSaved}
                />
              </div>
            </div>

            {/* Center - View Toggle (desktop) */}
            <div className="hidden md:flex items-center" data-section="preview">
              <div className="bg-gray-100 rounded-lg p-1 flex items-center">
                <button
                  onClick={() => setActiveView('edit')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeView === 'edit'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-pressed={activeView === 'edit'}
                >
                  <PencilIcon className="h-4 w-4 inline mr-2" aria-hidden="true" />
                  Edit
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeView === 'preview'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-pressed={activeView === 'preview'}
                >
                  <EyeIcon className="h-4 w-4 inline mr-2" aria-hidden="true" />
                  Preview
                </button>
              </div>

              {/* Device toggle for preview */}
              {activeView === 'preview' && (
                <div className="ml-2 bg-gray-100 rounded-lg p-1 flex items-center">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-md transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Desktop preview"
                    aria-pressed={previewDevice === 'desktop'}
                  >
                    <ComputerDesktopIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-md transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Mobile preview"
                    aria-pressed={previewDevice === 'mobile'}
                  >
                    <DevicePhoneMobileIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Switcher */}
              <div data-section="theme">
                <ThemeSwitcher
                  currentTheme={cvData.theme_skin}
                  onThemeChange={handleThemeChange}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <SaveButton
                  onSave={handleSave}
                  isSaving={isSaving}
                  saveStatus={saveStatus}
                />
                <ExportButton onExport={handleExport} />
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator (below header) */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 sm:px-6 lg:px-8 py-2">
          <div className="mx-auto max-w-7xl">
            <ProgressIndicator
              sections={CV_SECTIONS}
              completedSections={completedSections}
              variant="compact"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Editor Panel */}
          <div className={`${activeView === 'preview' ? 'hidden lg:block' : ''}`} data-section="contact">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Build Your Portfolio
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in your details to create a stunning portfolio
                </p>
              </div>
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
                <CVBuilderForm
                  data={cvData}
                  onChange={handleDataChange}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${activeView === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col sticky top-28">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Live Preview
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    See changes in real-time
                  </p>
                </div>

                {/* Mobile device toggle (on preview panel header) */}
                <div className="lg:hidden bg-gray-100 rounded-lg p-1 flex items-center">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-md transition-all ${
                      previewDevice === 'desktop'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-500'
                    }`}
                    aria-label="Desktop view"
                  >
                    <ComputerDesktopIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-md transition-all ${
                      previewDevice === 'mobile'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-gray-500'
                    }`}
                    aria-label="Mobile view"
                  >
                    <DevicePhoneMobileIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className={`flex-1 p-4 sm:p-6 overflow-y-auto flex justify-center ${
                previewDevice === 'mobile' ? 'bg-gray-100' : ''
              }`}>
                <div className={`
                  w-full transition-all duration-300
                  ${previewDevice === 'mobile'
                    ? 'max-w-[375px] shadow-xl rounded-2xl overflow-hidden border-8 border-gray-800 bg-white'
                    : ''
                  }
                `}>
                  <CVPreview
                    data={cvData}
                    theme={cvData.theme_skin}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle FAB */}
        <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={() => setActiveView(activeView === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg text-sm font-medium transition-all active:scale-95"
          >
            {activeView === 'edit' ? (
              <>
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                Preview
              </>
            ) : (
              <>
                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                Edit
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
