'use client'

import { CheckCircleIcon, CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface SaveButtonProps {
  onSave: () => void
  isSaving: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

export function SaveButton({ onSave, isSaving, saveStatus }: SaveButtonProps) {
  const getButtonContent = () => {
    if (isSaving) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          <span className="hidden sm:inline">Saving...</span>
        </>
      )
    }

    if (saveStatus === 'saved') {
      return (
        <>
          <CheckCircleIcon className="h-4 w-4 text-green-600" />
          <span className="hidden sm:inline text-green-600">Saved</span>
        </>
      )
    }

    if (saveStatus === 'error') {
      return (
        <>
          <ExclamationCircleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Retry</span>
        </>
      )
    }

    return (
      <>
        <CloudArrowUpIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </>
    )
  }

  const getButtonStyle = () => {
    if (saveStatus === 'saved') {
      return 'bg-green-600 hover:bg-green-700 text-white'
    }
    
    if (saveStatus === 'error') {
      return 'bg-red-600 hover:bg-red-700 text-white'
    }

    return 'bg-primary-600 hover:bg-primary-700 text-white'
  }

  return (
    <button
      onClick={onSave}
      disabled={isSaving}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${getButtonStyle()} ${
        isSaving ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      {getButtonContent()}
    </button>
  )
}