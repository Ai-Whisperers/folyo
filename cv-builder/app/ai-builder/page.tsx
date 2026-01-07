'use client'


import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AIConversationFlow } from '../../components/ai/AIConversationFlow'
import { CVPreview } from '../../components/cv/CVPreview'
import {
  SparklesIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface JobDescriptionInput {
  jobDescription: string
  targetRole: string
  experienceLevel: 'entry' | 'mid' | 'senior'
}

export default function AIBuilderPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<'setup' | 'conversation' | 'preview'>('setup')
  const [jobInfo, setJobInfo] = useState<JobDescriptionInput>({
    jobDescription: '',
    targetRole: '',
    experienceLevel: 'mid'
  })
  const [generatedCV, setGeneratedCV] = useState<any>(null)
  const [activeView, setActiveView] = useState<'chat' | 'preview'>('chat')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, isLoading, router])

  const analyzeJobDescription = async () => {
    if (!jobInfo.jobDescription.trim()) {
      setStep('conversation')
      return
    }

    try {
      setIsAnalyzing(true)

      const response = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || ''
        },
        body: JSON.stringify({
          jobDescription: jobInfo.jobDescription
        })
      })

      const data = await response.json()

      if (data.success) {
        setAnalysisResult(data.analysis)
      }

      setStep('conversation')
    } catch (error) {
      console.error('Error analyzing job description:', error)
      setStep('conversation')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCVComplete = (cvData: any) => {
    setGeneratedCV(cvData)
    setStep('preview')
  }

  const handleStartOver = () => {
    setStep('setup')
    setJobInfo({
      jobDescription: '',
      targetRole: '',
      experienceLevel: 'mid'
    })
    setGeneratedCV(null)
    setAnalysisResult(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Setup Step
  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-lg">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">AI CV Builder</h1>
                    <p className="text-sm text-gray-600">Create your CV through conversation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Setup Form */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 px-6 py-8 text-white">
              <div className="text-center">
                <SparklesIcon className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl font-bold mb-2">Let's Build Your Perfect CV</h2>
                <p className="text-primary-100">
                  I'll ask you questions and transform your answers into professional CV content
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  What role are you targeting? <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={jobInfo.targetRole}
                  onChange={(e) => setJobInfo({ ...jobInfo, targetRole: e.target.value })}
                  placeholder="e.g., Senior Software Engineer, Marketing Manager"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Experience Level
                </label>
                <select
                  value={jobInfo.experienceLevel}
                  onChange={(e) => setJobInfo({ ...jobInfo, experienceLevel: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-7 years)</option>
                  <option value="senior">Senior Level (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Job Description <span className="text-gray-500">(Optional but recommended)</span>
                </label>
                <textarea
                  value={jobInfo.jobDescription}
                  onChange={(e) => setJobInfo({ ...jobInfo, jobDescription: e.target.value })}
                  placeholder="Paste the job description here. I'll analyze it to help tailor your CV to match the requirements..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {jobInfo.jobDescription.length} characters
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How this works:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• I'll ask you questions about your experience in a conversational way</li>
                      <li>• You answer naturally - don't worry about perfect formatting</li>
                      <li>• AI will transform your responses into professional CV content</li>
                      <li>• You can review and edit everything before finalizing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={analyzeJobDescription}
                disabled={isAnalyzing}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Analyzing Job Description...
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-3" />
                    Start AI Conversation
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/builder"
                  className="text-sm text-gray-600 hover:text-primary-600 underline"
                >
                  Prefer the traditional form-based builder?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Conversation Step
  if (step === 'conversation') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button onClick={handleStartOver} className="text-gray-600 hover:text-gray-900">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-2 rounded-lg">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">AI CV Builder</h1>
                    <p className="text-sm text-gray-600">
                      {jobInfo.targetRole ? `Building CV for ${jobInfo.targetRole}` : 'Creating your professional CV'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('chat')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'chat'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                    }`}
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 inline mr-2" />
                  Conversation
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'preview'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-primary-600'
                    }`}
                >
                  <EyeIcon className="h-4 w-4 inline mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Analysis Result */}
        {analysisResult && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <span className="font-medium text-green-800">Job description analyzed!</span>
                  <span className="text-green-700 ml-2">
                    I'll tailor your CV to match the key requirements I found.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Conversation Panel */}
            <div className={`${activeView === 'preview' ? 'hidden lg:block' : ''} bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}>
              <AIConversationFlow
                onComplete={handleCVComplete}
                initialJobDescription={jobInfo.jobDescription}
                targetRole={jobInfo.targetRole}
              />
            </div>

            {/* Preview Panel */}
            <div className={`${activeView === 'chat' ? 'hidden lg:block' : ''} bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                    <p className="text-sm text-gray-600">See your CV update in real-time</p>
                  </div>
                  <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <div className="p-6 overflow-y-auto h-full">
                {generatedCV ? (
                  <CVPreview data={generatedCV} theme="teal" />
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <DocumentTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">CV Preview</h4>
                      <p className="text-gray-600">
                        Your CV will appear here as you complete the conversation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="lg:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1">
              <button
                onClick={() => setActiveView(activeView === 'chat' ? 'preview' : 'chat')}
                className="px-6 py-3 bg-primary-600 text-white rounded-full text-sm font-medium flex items-center"
              >
                {activeView === 'chat' ? (
                  <>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Preview
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Back to Chat
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Preview/Complete Step
  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button onClick={() => setStep('conversation')} className="text-gray-600 hover:text-gray-900">
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">CV Created Successfully!</h1>
                    <p className="text-sm text-gray-600">Review and finalize your AI-generated CV</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="btn-secondary">
                  Back to Dashboard
                </Link>
                <Link
                  href={`/builder?cvId=${generatedCV?.id}`}
                  className="btn-primary"
                >
                  Continue Editing
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">
                  Your AI-powered CV has been created and saved to your dashboard!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  You can continue editing, export as PDF, or publish it online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CV Preview */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              {generatedCV && <CVPreview data={generatedCV} theme="teal" />}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartOver}
                className="btn-secondary"
              >
                Create Another CV
              </button>
              <Link
                href={`/builder?cvId=${generatedCV?.id}`}
                className="btn-primary"
              >
                Continue Editing CV
              </Link>
            </div>

            <p className="text-sm text-gray-600">
              Your CV has been saved to your dashboard and you can access it anytime.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}