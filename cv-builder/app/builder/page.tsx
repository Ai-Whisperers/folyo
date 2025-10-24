'use client'

import { useState, useEffect } from 'react'
import { CVBuilderForm } from '../../components/CVBuilderForm'
import { CVPreview } from '../../components/CVPreview'
import { ThemeSwitcher } from '../../components/ThemeSwitcher'
import { ExportButton } from '../../components/ExportButton'
import { SaveButton } from '../../components/SaveButton'
import { 
  EyeIcon, 
  PencilIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon
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

export default function CVBuilderPage() {
  const [cvData, setCvData] = useState(defaultCVData)
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [isClient, setIsClient] = useState(false)

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
    
    // Load saved data from localStorage
    const savedData = localStorage.getItem('cv-data')
    if (savedData) {
      try {
        setCvData(JSON.parse(savedData))
      } catch (error) {
        console.error('Error loading saved CV data:', error)
      }
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!isClient) return
    
    const saveData = () => {
      localStorage.setItem('cv-data', JSON.stringify(cvData))
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }

    const timeoutId = setTimeout(saveData, 1000) // Auto-save after 1 second of inactivity
    
    return () => clearTimeout(timeoutId)
  }, [cvData, isClient])

  const handleDataChange = (newData: typeof cvData) => {
    setCvData(newData)
    setSaveStatus('idle')
  }

  const handleThemeChange = (theme: string) => {
    setCvData(prev => ({
      ...prev,
      theme_skin: theme
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to save CV data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      localStorage.setItem('cv-data', JSON.stringify(cvData))
      setSaveStatus('saved')
    } catch (error) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'json' | 'yaml') => {
    // TODO: Implement export functionality
    console.log(`Exporting CV as ${format}`)
  }

  if (!isClient) {
    // Prevent hydration mismatch
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-primary-600">CV Builder Pro</h1>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span>•</span>
                <span>Auto-saved</span>
                {saveStatus === 'saved' && (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('edit')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'edit'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <PencilIcon className="h-4 w-4 inline mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'preview'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <EyeIcon className="h-4 w-4 inline mr-2" />
                  Preview
                </button>
              </div>

              {/* Theme Switcher */}
              <ThemeSwitcher
                currentTheme={cvData.theme_skin}
                onThemeChange={handleThemeChange}
              />

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
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Editor Panel */}
          <div className={`${activeView === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  CV Information
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Fill out your information below to create your professional CV
                </p>
              </div>
              <div className="p-6 h-full overflow-y-auto">
                <CVBuilderForm
                  data={cvData}
                  onChange={handleDataChange}
                />
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${activeView === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  See how your CV looks in real-time
                </p>
              </div>
              <div className="p-6 h-full overflow-y-auto">
                <CVPreview 
                  data={cvData}
                  theme={cvData.theme_skin}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1">
            <button
              onClick={() => setActiveView(activeView === 'edit' ? 'preview' : 'edit')}
              className="px-6 py-3 bg-primary-600 text-white rounded-full text-sm font-medium"
            >
              {activeView === 'edit' ? (
                <>
                  <EyeIcon className="h-4 w-4 inline mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4 inline mr-2" />
                  Edit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}