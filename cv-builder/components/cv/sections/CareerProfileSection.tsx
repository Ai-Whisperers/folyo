'use client'

import { useState } from 'react'
import { SparklesIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { AIAssistant } from '@/components/ai/AIAssistant'
import { CVFormData } from '@/lib/types/cv'

interface CareerProfileSectionProps {
  data: CVFormData
  onChange: (data: CVFormData) => void
}

export function CareerProfileSection({ data, onChange }: CareerProfileSectionProps) {
  const [aiModal, setAiModal] = useState<{ isOpen: boolean, text: string, path: string } | null>(null)

  const getCareerSummary = () => data.career_profile?.summary || data['career-profile']?.summary || ''

  const handleAIComplete = (enhancedText: string) => {
    if (aiModal) {
      // Update both keys for compatibility
      onChange({
        ...data,
        career_profile: {
          ...data.career_profile,
          summary: enhancedText
        },
        'career-profile': {
          ...data['career-profile'],
          summary: enhancedText
        }
      })
      setAiModal(null)
    }
  }

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      career_profile: {
        ...data.career_profile,
        summary: value
      },
      'career-profile': {
        ...data['career-profile'],
        summary: value
      }
    })
  }

  const openAIModal = () => {
    setAiModal({
      isOpen: true,
      text: getCareerSummary(),
      path: 'career_profile.summary'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="form-label">Professional Summary</label>
        <div className="relative">
          <textarea
            className="form-input h-48 pr-10"
            value={getCareerSummary()}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a compelling summary of your professional experience...

Example:
**Emerging professional** with passion for technology and drive toward excellence.

I bring a unique combination of **technical expertise** and **business acumen** to every role.

**Key Strengths:**
- Rapid problem diagnosis and resolution
- Cross-functional team collaboration
- Process optimization and automation"
          />
          <button
            onClick={openAIModal}
            className="absolute right-2 top-2 p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-colors"
            title="Enhance with AI"
          >
            <SparklesIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <strong>Tip:</strong> Use **bold** for emphasis on key terms. Include a Key Strengths section with bullet points.
        </p>
      </div>

      {/* AI Assistant Modal */}
      {aiModal && aiModal.isOpen && (
        <AIAssistant
          initialText={aiModal.text}
          section="summary"
          onAccept={handleAIComplete}
          onClose={() => setAiModal(null)}
        />
      )}
    </div>
  )
}