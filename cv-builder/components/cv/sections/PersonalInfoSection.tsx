'use client'

import { useState } from 'react'
import { UserIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ImageUpload } from '@/components/common/ImageUpload'
import { ValidatedInput } from '@/components/ui/ValidatedInput'
import { CVFormData } from '@/lib/types/cv'

interface PersonalInfoSectionProps {
  data: CVFormData
  onChange: (data: CVFormData) => void
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const handleImageChange = (imageUrl: string) => {
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        avatar: imageUrl
      }
    })
  }

  const updateField = (field: string, value: string) => {
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        [field]: value
      }
    })
  }

  const addLanguage = () => {
    const languages = Array.isArray(data.sidebar.languages) ? data.sidebar.languages : []
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        languages: [...languages, { idiom: '', level: 'Intermediate' }]
      }
    })
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    const languages = Array.isArray(data.sidebar.languages) ? [...data.sidebar.languages] : []
    languages[index] = { ...languages[index], [field]: value }
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        languages
      }
    })
  }

  const removeLanguage = (index: number) => {
    const languages = Array.isArray(data.sidebar.languages) ? data.sidebar.languages : []
    onChange({
      ...data,
      sidebar: {
        ...data.sidebar,
        languages: languages.filter((_, i) => i !== index)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div>
        <label className="form-label">Profile Picture</label>
        <ImageUpload
          currentImage={data.sidebar.avatar || ''}
          onImageChange={handleImageChange}
          type="profile"
          placeholder="Upload your professional headshot"
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload a professional headshot. Square images work best (400x400px recommended).
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <ValidatedInput
          label="Full Name"
          name="name"
          type="text"
          required
          validationType="name"
          value={data.sidebar.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
        />

        <ValidatedInput
          label="Professional Tagline"
          name="tagline"
          type="text"
          value={data.sidebar.tagline || ''}
          onChange={(e) => updateField('tagline', e.target.value)}
          placeholder="e.g., Senior Software Engineer | Full-Stack Developer"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Email"
            name="email"
            type="email"
            required
            validationType="email"
            value={data.sidebar.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="your.email@example.com"
          />

          <ValidatedInput
            label="Phone"
            name="phone"
            type="tel"
            validationType="phone"
            value={data.sidebar.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="Location"
            name="location"
            type="text"
            value={data.sidebar.timezone || ''}
            onChange={(e) => updateField('timezone', e.target.value)}
            placeholder="New York, NY"
          />

          <ValidatedInput
            label="Website"
            name="website"
            type="url"
            validationType="url"
            value={data.sidebar.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ValidatedInput
            label="LinkedIn Username"
            name="linkedin"
            type="text"
            value={data.sidebar.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="your-linkedin-username"
          />

          <ValidatedInput
            label="GitHub Username"
            name="github"
            type="text"
            value={data.sidebar.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="your-github-username"
          />
        </div>
      </div>

      {/* Languages Section */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          <button
            onClick={addLanguage}
            className="btn-secondary text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Language
          </button>
        </div>

        {(Array.isArray(data.sidebar.languages) ? data.sidebar.languages : []).map((lang, index) => (
          <div key={index} className="flex items-center gap-4 mb-3">
            <ValidatedInput
              label=""
              name={`language-${index}`}
              type="text"
              value={lang.idiom || ''}
              onChange={(e) => updateLanguage(index, 'idiom', e.target.value)}
              placeholder="e.g., English, Spanish"
              className="flex-1"
            />
            
            <select
              className="form-input w-40"
              value={lang.level || 'Intermediate'}
              onChange={(e) => updateLanguage(index, 'level', e.target.value)}
            >
              <option value="Native">Native</option>
              <option value="Professional">Professional</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            
            <button
              onClick={() => removeLanguage(index)}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}