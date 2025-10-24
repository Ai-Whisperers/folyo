'use client'

import { useState } from 'react'
import { ArrowDownTrayIcon, DocumentIcon, CodeBracketIcon } from '@heroicons/react/24/outline'

interface ExportButtonProps {
  onExport: (format: 'pdf' | 'json' | 'yaml') => void
}

export function ExportButton({ onExport }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'Export as PDF',
      description: 'Download your CV as a PDF file',
      icon: DocumentIcon,
      color: 'text-red-600'
    },
    {
      format: 'json' as const,
      label: 'Export as JSON',
      description: 'Download raw data in JSON format',
      icon: CodeBracketIcon,
      color: 'text-blue-600'
    },
    {
      format: 'yaml' as const,
      label: 'Export as YAML',
      description: 'Download Jekyll-compatible YAML data',
      icon: CodeBracketIcon,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Export Options
            </div>
            
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => {
                  onExport(option.format)
                  setIsOpen(false)
                }}
                className="w-full flex items-start space-x-3 px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <option.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${option.color}`} />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
            
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 mt-2">
              💡 Tip: Use YAML export to customize with Jekyll
            </div>
          </div>
        </>
      )}
    </div>
  )
}