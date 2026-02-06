'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { CVBuilderForm } from '@/components/cv/CVBuilderForm'
import { CVPreview } from '@/components/cv/CVPreview'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { ExportButton } from '@/components/common/ExportButton'
import { SaveButton } from '@/components/common/SaveButton'
import {
  SaveStatus,
  UnsavedChangesModal,
  ProgressIndicator,
  OnboardingTooltip,
  BUILDER_ONBOARDING_STEPS,
} from '@/components/ui'
import { useUnsavedChanges } from '@/lib/hooks'
import { useAuth } from '@/lib/contexts/AuthContext'
import { CVFormData } from '@/lib/types/cv'
import { createCV, updateCV } from '@/lib/api/cv'
import {
  EyeIcon,
  PencilIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowLeftIcon,
  QrCodeIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon,
  UserCircleIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { QRCodeModal } from '@/components/ui/QRCodeDisplay'

// Helper to get user-specific storage key
const getStorageKey = (userId?: string) => {
  return userId ? `cv-data-${userId}` : 'cv-data'
}

// Default CV data structure - Victoria Rolon Standard v2.0
const defaultCVData = {
  theme_skin: 'teal',
  template_layout: 'landing',
  sidebar: {
    position: 'left',
    about: true,
    education: true,
    name: '',
    tagline: '',
    avatar: '',
    email: '',
    phone: '',
    timezone: '',
    citizenship: '',
    website: '',
    linkedin: '',
    github: '',
    // New standard: languages as simple array
    languages: [] as Array<{ idiom: string; level: string }>
  },
  // New standard: interests as simple string array
  interests: [] as string[],
  // Career profile with markdown support
  career_profile: {
    title: 'About Me',
    summary: ''
  },
  // Also support legacy key for compatibility
  'career-profile': {
    title: 'About Me',
    summary: ''
  },
  // New standard: education as direct array
  education: [] as Array<{
    degree: string
    university: string
    time: string
    details?: string
  }>,
  // New standard: experiences as direct array with tags
  experiences: [] as Array<{
    role: string
    company: string
    time: string
    details: string
    tags?: string[]
    icon?: string
  }>,
  // New standard: skills with proficiency level and tags (no progress bars)
  skills: [] as Array<{
    name: string
    level: string | number // 'expert' | 'advanced' | 'proficient' | 'familiar' or legacy numeric
    tags?: string[]
  }>,
  // Projects as direct array
  projects: [] as Array<{
    title: string
    time?: string
    details: string
    link?: string
    tags?: string[]
  }>,
  // Certifications as direct array
  certifications: [] as Array<{
    name: string
    organization: string
    start: string
    end?: string
    details?: string
  }>,
  // Volunteer as direct array
  volunteer: [] as Array<{
    role: string
    company: string
    time: string
    details?: string
    tags?: string[]
  }>,
  // Footer with availability info
  footer: ''
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
  const { user, isLoading: authLoading } = useAuth()
  const [cvData, setCvData] = useState<CVFormData>(defaultCVData as CVFormData)
  const [initialData, setInitialData] = useState<CVFormData>(defaultCVData as CVFormData)
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit')
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [fullscreenPreview, setFullscreenPreview] = useState(false)

  // Storage key changes based on user
  const storageKey = useMemo(() => getStorageKey(user?.id), [user?.id])

  // Calculate completed sections for progress indicator
  // Supports both new standard (direct arrays) and legacy format (nested .info/.toolset)
  const completedSections = useMemo(() => {
    const completed: string[] = []

    // Contact info check
    if (cvData.sidebar?.name && cvData.sidebar?.email) {
      completed.push('contact')
    }

    // Career profile/summary check (supports both keys)
    const summary = cvData.career_profile?.summary || cvData['career-profile']?.summary
    if (summary && summary.length > 20) {
      completed.push('summary')
    }

    // Experience check (new: direct array, legacy: .info)
    const experiences = Array.isArray(cvData.experiences) 
      ? cvData.experiences 
      : (cvData.experiences as any)?.info || []
    if (experiences && experiences.length > 0) {
      completed.push('experience')
    }

    // Education check (new: direct array, legacy: .info)
    const education = Array.isArray(cvData.education) 
      ? cvData.education 
      : (cvData.education as any)?.info || []
    if (education && education.length > 0) {
      completed.push('education')
    }

    // Skills check (new: direct array, legacy: .toolset)
    const skills = Array.isArray(cvData.skills) 
      ? cvData.skills 
      : (cvData.skills as any)?.toolset || []
    if (skills && skills.length > 0) {
      completed.push('skills')
    }

    // Projects check (new: direct array, legacy: .assignments)
    const projects = Array.isArray(cvData.projects) 
      ? cvData.projects 
      : (cvData.projects as any)?.assignments || []
    if (projects && projects.length > 0) {
      completed.push('projects')
    }

    // Certifications check (new: direct array, legacy: .list)
    const certifications = Array.isArray(cvData.certifications) 
      ? cvData.certifications 
      : (cvData.certifications as any)?.list || []
    if (certifications && certifications.length > 0) {
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
  }, [])

  // Load data when user/auth state changes
  useEffect(() => {
    if (!isClient || authLoading) return

    // Check URL params for document type, theme, template layout, and color
    const searchParams = new URLSearchParams(window.location.search)
    const docType = searchParams.get('type')
    const themeParam = searchParams.get('theme')
    const templateParam = searchParams.get('template') // New: template layout ID
    const colorParam = searchParams.get('color') // New: color palette ID

    // Load saved data from localStorage (user-specific if logged in)
    const savedData = localStorage.getItem(storageKey)

    // Also check legacy 'cv-data' key for migration if user just logged in
    const legacyData = !user && localStorage.getItem('cv-data')

    const dataToLoad = savedData || legacyData

    if (dataToLoad) {
      try {
        const parsed = JSON.parse(dataToLoad)

        // Priority: color param > theme param > saved theme
        // Color param is from new template system
        if (colorParam) {
          parsed.theme_skin = colorParam
        } else if (themeParam) {
          parsed.theme_skin = themeParam
        } else if (docType === 'portfolio') {
          parsed.theme_skin = 'video-portfolio'
        }

        // Store template layout if provided (for future use)
        if (templateParam) {
          parsed.template_layout = templateParam
        }

        setCvData(parsed)
        setInitialData(parsed)
      } catch (error) {
        console.error('Error loading saved CV data:', error)
      }
    } else {
      // No saved data - create new with requested theme/color
      let initialTheme = 'teal'
      if (colorParam) {
        initialTheme = colorParam
      } else if (themeParam) {
        initialTheme = themeParam
      } else if (docType === 'portfolio') {
        initialTheme = 'video-portfolio'
      }

      // Pre-fill name and email if user is logged in
      const newData = {
        ...defaultCVData,
        theme_skin: initialTheme,
        template_layout: templateParam || 'classic', // Default to classic layout
        sidebar: {
          ...defaultCVData.sidebar,
          name: user?.name || '',
          email: user?.email || ''
        }
      }
      setCvData(newData)
      setInitialData(newData)
    }
  }, [isClient, authLoading, user, storageKey])

  // Auto-save functionality with debounce
  useEffect(() => {
    if (!isClient || !hasUnsavedChanges) return

    setSaveStatus('saving')

    const saveData = () => {
      try {
        // Save to user-specific storage key
        localStorage.setItem(storageKey, JSON.stringify(cvData))
        // Also save to legacy key for portfolio page compatibility
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
  }, [cvData, isClient, hasUnsavedChanges, storageKey])

  const handleDataChange = useCallback((newData: typeof cvData) => {
    setCvData(newData)
  }, [])

  const handleThemeChange = useCallback((theme: string) => {
    setCvData(prev => ({
      ...prev,
      theme_skin: theme
    }))
  }, [])

  // Generate portfolio URL based on user's name (slug)
  const portfolioSlug = useMemo(() => {
    const name = cvData.sidebar?.name || ''
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      || 'my-portfolio'
  }, [cvData.sidebar?.name])

  const portfolioUrl = useMemo(() => {
    // Use Jekyll site URL for portfolios (same domain in production, port 4000 in dev)
    const portfolioBaseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL
      || (typeof window !== 'undefined' && window.location.port === '3000'
          ? 'http://localhost:3000'
          : 'http://localhost:3000')
    return `${portfolioBaseUrl}/portfolio/${portfolioSlug}/`
  }, [portfolioSlug])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [portfolioUrl])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    try {
      // Use the existing API to save CV data
      if (cv.cv) {
        // Update existing CV
        await updateCV(cv.cv.id, cvData)
      } else {
        // Create new CV
        const newCV = await createCV({
          title: cvData.sidebar.name || 'Untitled CV',
          ...cvData
        })
        // Update local state with the new CV ID
        setCv(prev => ({ ...prev, cv: newCV }))
      }
      
      // Save to user-specific storage key as backup
      localStorage.setItem(storageKey, JSON.stringify(cvData))
      // Also save to legacy key for portfolio page compatibility
      localStorage.setItem('cv-data', JSON.stringify(cvData))
      setInitialData(cvData)
      setSaveStatus('saved')
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save CV:', error)
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

  if (!isClient || authLoading) {
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
                {/* Share/QR buttons */}
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                  title="View your portfolio website"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">View Site</span>
                </a>
                <button
                  onClick={handleCopyLink}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy portfolio link"
                >
                  <LinkIcon className="h-4 w-4" />
                  {copied ? 'Copied!' : 'Link'}
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Generate QR code"
                >
                  <QrCodeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">QR</span>
                </button>
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

                <div className="flex items-center gap-2">
                  {/* Fullscreen Preview Button */}
                  <button
                    onClick={() => setFullscreenPreview(true)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-teal-600 transition-all"
                    aria-label="Fullscreen preview"
                    title="View full size preview"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5" />
                  </button>

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
                    templateLayout={cvData.template_layout}
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

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        url={portfolioUrl}
        theme={cvData.theme_skin}
        title={`${cvData.sidebar?.name || 'Portfolio'} QR Code`}
      />

      {/* Fullscreen Preview Modal */}
      {fullscreenPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={() => setFullscreenPreview(false)}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close fullscreen preview"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Preview container with device toggle */}
          <div className="w-full h-full flex flex-col">
            {/* Header with device toggle */}
            <div className="flex items-center justify-center gap-4 py-4">
              <span className="text-white/70 text-sm font-medium">Preview Mode:</span>
              <div className="bg-white/10 rounded-lg p-1 flex items-center">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                    previewDevice === 'desktop'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <ComputerDesktopIcon className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                    previewDevice === 'mobile'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <DevicePhoneMobileIcon className="h-4 w-4" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Preview content */}
            <div className="flex-1 overflow-auto flex justify-center items-start pb-8">
              <div className={`
                bg-white shadow-2xl transition-all duration-300
                ${previewDevice === 'mobile'
                  ? 'max-w-[375px] w-full rounded-[2.5rem] border-[14px] border-gray-800 overflow-hidden'
                  : 'w-full max-w-5xl rounded-lg overflow-hidden'
                }
              `}>
                <CVPreview
                  data={cvData}
                  theme={cvData.theme_skin}
                  templateLayout={cvData.template_layout}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
