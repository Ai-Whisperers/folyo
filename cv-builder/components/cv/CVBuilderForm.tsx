'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import {
  PlusIcon,
  MinusIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon,
  PresentationChartBarIcon,
  FilmIcon,
  PhotoIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

import { PortfolioSection } from './PortfolioSection'
import { VideoPortfolioSection } from './VideoPortfolioSection'
import { ImageGallerySection } from './ImageGallerySection'
import { DeveloperProfileSection } from './DeveloperProfileSection'
import { AIAssistant } from '../ai/AIAssistant'
import { ImageUpload } from '../common/ImageUpload'

interface CVBuilderFormProps {
  data: any
  onChange: (data: any) => void
  onSectionChange?: (section: string) => void
}

// Theme type mappings
const VIDEO_THEMES = ['video-portfolio', 'midnight-cinema', 'director-cut', 'film-noir', 'documentary-style', 'broadcast-red', 'drone-aerial']
const DESIGN_THEMES = ['art-gallery', 'noir-elegant', 'neon-nights']
const DEVELOPER_THEMES = ['github-style', 'vscode-dark', 'terminal-green', 'developer-dark']

// Helper to determine portfolio type from theme
const getPortfolioType = (theme: string): 'video' | 'design' | 'developer' | 'general' => {
  if (VIDEO_THEMES.includes(theme)) return 'video'
  if (DESIGN_THEMES.includes(theme)) return 'design'
  if (DEVELOPER_THEMES.includes(theme)) return 'developer'
  return 'general'
}

// Base sections for all portfolio types - Victoria Rolon Standard
const BASE_SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: UserIcon },
  { id: 'profile', name: 'About / Bio', icon: SparklesIcon },
  { id: 'interests', name: 'Interests', icon: HeartIcon },
]

// Sections configuration by portfolio type
const getSectionsForType = (portfolioType: 'video' | 'design' | 'developer' | 'general') => {
  const baseSections = [...BASE_SECTIONS]

  switch (portfolioType) {
    case 'video':
      return [
        ...baseSections,
        { id: 'videoPortfolio', name: 'Video Reel', icon: FilmIcon },
        { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
        { id: 'skills', name: 'Skills', icon: TrophyIcon },
        { id: 'education', name: 'Education', icon: AcademicCapIcon },
      ]
    case 'design':
      return [
        ...baseSections,
        { id: 'imageGallery', name: 'Gallery', icon: PhotoIcon },
        { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
        { id: 'skills', name: 'Skills', icon: TrophyIcon },
        { id: 'education', name: 'Education', icon: AcademicCapIcon },
      ]
    case 'developer':
      return [
        ...baseSections,
        { id: 'developerProfile', name: 'Projects & Code', icon: CodeBracketIcon },
        { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
        { id: 'skills', name: 'Tech Stack', icon: TrophyIcon },
        { id: 'education', name: 'Education', icon: AcademicCapIcon },
      ]
    default:
      return [
        ...baseSections,
        { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
        { id: 'education', name: 'Education', icon: AcademicCapIcon },
        { id: 'skills', name: 'Skills', icon: TrophyIcon },
        { id: 'certifications', name: 'Certifications', icon: TrophyIcon },
        { id: 'projects', name: 'Projects', icon: PresentationChartBarIcon },
      ]
  }
}

// Deep clone utility for immutable updates
const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj))

// Path-based update utility
const setNestedValue = (obj: any, path: string, value: any): any => {
  const result = deepClone(obj)
  const keys = path.split('.')
  let current = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    // Handle array indices
    const nextKey = keys[i + 1]
    const isNextArray = !isNaN(Number(nextKey))

    if (!current[key]) {
      current[key] = isNextArray ? [] : {}
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
  return result
}

function CVBuilderFormComponent({ data, onChange, onSectionChange }: CVBuilderFormProps) {
  const [activeSection, setActiveSection] = useState('personal')

  // Determine portfolio type from current theme
  const portfolioType = useMemo(() => {
    return getPortfolioType(data.theme_skin || 'teal')
  }, [data.theme_skin])

  // Get sections for current portfolio type
  const sections = useMemo(() => {
    return getSectionsForType(portfolioType)
  }, [portfolioType])

  // Memoized update field handler
  const updateField = useCallback((path: string, value: any) => {
    onChange(setNestedValue(data, path, value))
  }, [data, onChange])

  // Memoized add array item handler
  const addArrayItem = useCallback((path: string, template: any) => {
    const keys = path.split('.')
    const newData = deepClone(data)
    let current = newData

    for (const key of keys) {
      if (!current[key]) current[key] = []
      current = current[key]
    }

    current.push({ ...template })
    onChange(newData)
  }, [data, onChange])

  // Memoized remove array item handler
  const removeArrayItem = useCallback((path: string, index: number) => {
    const keys = path.split('.')
    const newData = deepClone(data)
    let current = newData

    for (const key of keys) {
      current = current[key]
    }

    current.splice(index, 1)
    onChange(newData)
  }, [data, onChange])

  // Handle section change with callback
  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId)
    onSectionChange?.(sectionId)
  }, [onSectionChange])

  const renderPersonalSection = () => (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div>
        <label className="form-label">Profile Picture</label>
        <ImageUpload
          currentImage={data.sidebar?.avatar || ''}
          onImageChange={(imageUrl) => updateField('sidebar.avatar', imageUrl)}
          type="profile"
          placeholder="Upload your professional headshot"
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload a professional headshot. Square images work best (400x400px recommended).
        </p>
      </div>

      <div>
        <label className="form-label">Full Name *</label>
        <input
          type="text"
          className="form-input"
          value={data.sidebar?.name || ''}
          onChange={(e) => updateField('sidebar.name', e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="form-label">Professional Tagline</label>
        <input
          type="text"
          className="form-input"
          value={data.sidebar?.tagline || ''}
          onChange={(e) => updateField('sidebar.tagline', e.target.value)}
          placeholder="e.g., Senior Software Engineer | Full-Stack Developer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            value={data.sidebar?.email || ''}
            onChange={(e) => updateField('sidebar.email', e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-input"
            value={data.sidebar?.phone || ''}
            onChange={(e) => updateField('sidebar.phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            value={data.sidebar?.timezone || ''}
            onChange={(e) => updateField('sidebar.timezone', e.target.value)}
            placeholder="New York, NY"
          />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input
            type="url"
            className="form-input"
            value={data.sidebar?.website || ''}
            onChange={(e) => updateField('sidebar.website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">LinkedIn Username</label>
          <input
            type="text"
            className="form-input"
            value={data.sidebar?.linkedin || ''}
            onChange={(e) => updateField('sidebar.linkedin', e.target.value)}
            placeholder="your-linkedin-username"
          />
        </div>
        <div>
          <label className="form-label">GitHub Username</label>
          <input
            type="text"
            className="form-input"
            value={data.sidebar?.github || ''}
            onChange={(e) => updateField('sidebar.github', e.target.value)}
            placeholder="your-github-username"
          />
        </div>
      </div>

      {/* Languages Section - Victoria Rolon Standard */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          <button
            onClick={() => {
              const currentLangs = Array.isArray(data.sidebar?.languages)
                ? data.sidebar.languages
                : []
              updateField('sidebar.languages', [...currentLangs, { idiom: '', level: 'Intermediate' }])
            }}
            className="btn-secondary text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Language
          </button>
        </div>

        {(Array.isArray(data.sidebar?.languages) ? data.sidebar.languages : []).map((lang: any, index: number) => (
          <div key={index} className="flex items-center gap-4 mb-3">
            <input
              type="text"
              className="form-input flex-1"
              value={lang.idiom || ''}
              onChange={(e) => {
                const langs = [...(data.sidebar?.languages || [])]
                langs[index] = { ...langs[index], idiom: e.target.value }
                updateField('sidebar.languages', langs)
              }}
              placeholder="e.g., English, Spanish"
            />
            <select
              className="form-input w-40"
              value={lang.level || 'Intermediate'}
              onChange={(e) => {
                const langs = [...(data.sidebar?.languages || [])]
                langs[index] = { ...langs[index], level: e.target.value }
                updateField('sidebar.languages', langs)
              }}
            >
              <option value="Native">Native</option>
              <option value="Professional">Professional</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <button
              onClick={() => {
                const langs = [...(data.sidebar?.languages || [])]
                langs.splice(index, 1)
                updateField('sidebar.languages', langs)
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  // AI Assistant State
  const [aiModal, setAiModal] = useState<{ isOpen: boolean, text: string, path: string, section: string } | null>(null)

  const handleAIComplete = (enhancedText: string) => {
    if (aiModal) {
      updateField(aiModal.path, enhancedText)
      setAiModal(null)
    }
  }

  const renderAIButton = (path: string, text: string, section: string) => (
    <button
      onClick={() => setAiModal({ isOpen: true, text, path, section })}
      className="absolute right-2 top-2 p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
      title="Enhance with AI"
    >
      <SparklesIcon className="h-4 w-4" />
    </button>
  )

  // Get career profile summary from either key
  const getCareerSummary = () => data.career_profile?.summary || data['career-profile']?.summary || ''

  const renderCareerProfileSection = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Professional Summary</label>
        <div className="relative">
          <textarea
            className="form-input h-48 pr-10"
            value={getCareerSummary()}
            onChange={(e) => {
              // Update both keys for compatibility
              updateField('career_profile.summary', e.target.value)
              updateField('career-profile.summary', e.target.value)
            }}
            placeholder="Write a compelling summary of your professional experience...

Example (Victoria Rolon Standard):
**Emerging professional** with passion for technology and drive toward excellence.

I bring a unique combination of **technical expertise** and **business acumen** to every role.

**Key Strengths:**
- Rapid problem diagnosis and resolution
- Cross-functional team collaboration
- Process optimization and automation"
          />
          {renderAIButton('career_profile.summary', getCareerSummary(), 'summary')}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          <strong>Tip:</strong> Use **bold** for emphasis on key terms. Include a Key Strengths section with bullet points.
        </p>
      </div>
    </div>
  )

  // Helper to get experiences array (supports both new standard and legacy format)
  const getExperiences = () => Array.isArray(data.experiences) ? data.experiences : (data.experiences?.info || [])

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
        <button
          onClick={() => {
            const current = getExperiences()
            updateField('experiences', [...current, {
              role: '',
              company: '',
              time: '',
              details: '',
              tags: [],
              icon: 'briefcase'
            }])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>

      {getExperiences().map((exp: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
            <button
              onClick={() => {
                const current = getExperiences()
                updateField('experiences', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-input"
                value={exp.role || ''}
                onChange={(e) => {
                  const current = getExperiences()
                  current[index] = { ...current[index], role: e.target.value }
                  updateField('experiences', [...current])
                }}
                placeholder="e.g., IT Support Specialist"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.company || ''}
                  onChange={(e) => {
                    const current = getExperiences()
                    current[index] = { ...current[index], company: e.target.value }
                    updateField('experiences', [...current])
                  }}
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>
              <div>
                <label className="form-label">Duration *</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.time || ''}
                  onChange={(e) => {
                    const current = getExperiences()
                    current[index] = { ...current[index], time: e.target.value }
                    updateField('experiences', [...current])
                  }}
                  placeholder="e.g., 2023 - Present"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Description & Achievements</label>
              <div className="relative">
                <textarea
                  className="form-input h-32 pr-10"
                  value={exp.details || ''}
                  onChange={(e) => {
                    const current = getExperiences()
                    current[index] = { ...current[index], details: e.target.value }
                    updateField('experiences', [...current])
                  }}
                  placeholder="**Key Achievements:**
- Resolved 95%+ of issues within SLA timeframes
- Configured and maintained 30+ workstations
- Implemented preventive protocols reducing downtime by 40%

Use **bold** for metrics and achievements."
                />
                {renderAIButton(`experiences.${index}.details`, exp.details || '', 'experience')}
              </div>
            </div>

            {/* Tags - Victoria Rolon Standard */}
            <div>
              <label className="form-label">Skills & Technologies (Tags)</label>
              <input
                type="text"
                className="form-input"
                value={(exp.tags || []).join(', ')}
                onChange={(e) => {
                  const current = getExperiences()
                  current[index] = {
                    ...current[index],
                    tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)
                  }
                  updateField('experiences', [...current])
                }}
                placeholder="e.g., Technical Support, Networking, Hardware, Windows"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>
        </div>
      ))}

      {getExperiences().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  )

  // Helper to get education array (supports both new standard and legacy format)
  const getEducation = () => Array.isArray(data.education) ? data.education : (data.education?.info || [])

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <button
          onClick={() => {
            const current = getEducation()
            updateField('education', [...current, {
              degree: '',
              university: '',
              time: '',
              details: ''
            }])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Education
        </button>
      </div>

      {getEducation().map((edu: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
            <button
              onClick={() => {
                const current = getEducation()
                updateField('education', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Degree *</label>
              <input
                type="text"
                className="form-input"
                value={edu.degree || ''}
                onChange={(e) => {
                  const current = getEducation()
                  current[index] = { ...current[index], degree: e.target.value }
                  updateField('education', [...current])
                }}
                placeholder="e.g., Bachelor's in Business Administration"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Institution *</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.university || ''}
                  onChange={(e) => {
                    const current = getEducation()
                    current[index] = { ...current[index], university: e.target.value }
                    updateField('education', [...current])
                  }}
                  placeholder="e.g., National University"
                />
              </div>
              <div>
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.time || ''}
                  onChange={(e) => {
                    const current = getEducation()
                    current[index] = { ...current[index], time: e.target.value }
                    updateField('education', [...current])
                  }}
                  placeholder="e.g., 2024 - Present"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Details & Achievements</label>
              <div className="relative">
                <textarea
                  className="form-input h-28 pr-10"
                  value={edu.details || ''}
                  onChange={(e) => {
                    const current = getEducation()
                    current[index] = { ...current[index], details: e.target.value }
                    updateField('education', [...current])
                  }}
                  placeholder="**Currently pursuing** at prestigious institution.

**Specializations:**
- Core competency 1
- Core competency 2
- Strategic planning and analysis"
                />
                {renderAIButton(`education.${index}.details`, edu.details || '', 'education')}
              </div>
            </div>
          </div>
        </div>
      ))}

      {getEducation().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No education added yet.</p>
          <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      )}
    </div>
  )

  // Helper to get skills array (supports both new standard and legacy format)
  const getSkills = () => Array.isArray(data.skills) ? data.skills : (data.skills?.toolset || [])

  // Proficiency levels with descriptions
  const PROFICIENCY_LEVELS = [
    { value: 'expert', label: 'Expert', description: 'Can teach others, deep expertise' },
    { value: 'advanced', label: 'Advanced', description: 'Highly proficient, minimal guidance needed' },
    { value: 'proficient', label: 'Proficient', description: 'Solid working knowledge' },
    { value: 'familiar', label: 'Familiar', description: 'Basic understanding, some experience' },
  ]

  // Convert legacy numeric levels to proficiency labels
  const normalizeProficiency = (level: any): string => {
    if (typeof level === 'string' && ['expert', 'advanced', 'proficient', 'familiar'].includes(level)) {
      return level
    }
    // Convert numeric to label
    const num = typeof level === 'number' ? level : parseInt(String(level).replace('%', ''), 10)
    if (isNaN(num)) return 'proficient'
    if (num >= 90) return 'expert'
    if (num >= 75) return 'advanced'
    if (num >= 50) return 'proficient'
    return 'familiar'
  }

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
        <button
          onClick={() => {
            const current = getSkills()
            updateField('skills', [...current, {
              name: '',
              level: 'proficient',
              tags: []
            }])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Group your skills by category and add specific competencies as tags. The tags are what recruiters will see.
      </p>

      {getSkills().map((skill: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Skill #{index + 1}</h4>
            <button
              onClick={() => {
                const current = getSkills()
                updateField('skills', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Skill Category *</label>
                <input
                  type="text"
                  className="form-input"
                  value={skill.name || ''}
                  onChange={(e) => {
                    const current = getSkills()
                    current[index] = { ...current[index], name: e.target.value }
                    updateField('skills', [...current])
                  }}
                  placeholder="e.g., Technical Support, Microsoft Office Suite"
                />
              </div>
              <div>
                <label className="form-label">Proficiency Level</label>
                <select
                  className="form-input"
                  value={normalizeProficiency(skill.level)}
                  onChange={(e) => {
                    const current = getSkills()
                    current[index] = { ...current[index], level: e.target.value }
                    updateField('skills', [...current])
                  }}
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags - The main focus */}
            <div>
              <label className="form-label">Specific Competencies (Tags) *</label>
              <input
                type="text"
                className="form-input"
                value={(skill.tags || []).join(', ')}
                onChange={(e) => {
                  const current = getSkills()
                  current[index] = {
                    ...current[index],
                    tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)
                  }
                  updateField('skills', [...current])
                }}
                placeholder="e.g., Hardware Diagnostics, Software Installation, Troubleshooting, Windows"
              />
              <p className="text-xs text-gray-500 mt-1">
                These appear as visual tags. Be specific - recruiters search for these keywords.
              </p>
            </div>

            {/* Preview of tags */}
            {skill.tags?.length > 0 && (
              <div className="pt-2">
                <label className="form-label text-xs">Preview:</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {skill.tags.map((tag: string, tagIndex: number) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {getSkills().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TrophyIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No skills added yet.</p>
          <p className="text-sm">Click "Add Skill" to get started.</p>
        </div>
      )}
    </div>
  )

  // Interests Section - Victoria Rolon Standard (simple string array)
  const getInterests = () => {
    if (Array.isArray(data.interests)) return data.interests
    if (data.interests?.info) return data.interests.info.map((i: any) => i.item || i)
    return []
  }

  const renderInterestsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Professional Interests</h3>
        <button
          onClick={() => {
            const current = getInterests()
            updateField('interests', [...current, ''])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Interest
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Add your professional interests. These appear as tags in your portfolio.
      </p>

      <div className="space-y-3">
        {getInterests().map((interest: string, index: number) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="text"
              className="form-input flex-1"
              value={interest}
              onChange={(e) => {
                const current = getInterests()
                current[index] = e.target.value
                updateField('interests', [...current])
              }}
              placeholder="e.g., Technology & Innovation, Customer Service Excellence"
            />
            <button
              onClick={() => {
                const current = getInterests()
                updateField('interests', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {getInterests().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <HeartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No interests added yet.</p>
          <p className="text-sm">Click "Add Interest" to get started.</p>
        </div>
      )}
    </div>
  )

  // Certifications Section - Victoria Rolon Standard
  const getCertifications = () => Array.isArray(data.certifications) ? data.certifications : (data.certifications?.list || [])

  const renderCertificationsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Certifications & Training</h3>
        <button
          onClick={() => {
            const current = getCertifications()
            updateField('certifications', [...current, {
              name: '',
              organization: '',
              start: '',
              details: ''
            }])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Certification
        </button>
      </div>

      {getCertifications().map((cert: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
            <button
              onClick={() => {
                const current = getCertifications()
                updateField('certifications', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="form-label">Certification Name *</label>
              <input
                type="text"
                className="form-input"
                value={cert.name || ''}
                onChange={(e) => {
                  const current = getCertifications()
                  current[index] = { ...current[index], name: e.target.value }
                  updateField('certifications', [...current])
                }}
                placeholder="e.g., Professional Barista Certification"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Organization *</label>
                <input
                  type="text"
                  className="form-input"
                  value={cert.organization || ''}
                  onChange={(e) => {
                    const current = getCertifications()
                    current[index] = { ...current[index], organization: e.target.value }
                    updateField('certifications', [...current])
                  }}
                  placeholder="e.g., Certified Training Program"
                />
              </div>
              <div>
                <label className="form-label">Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={cert.start || ''}
                  onChange={(e) => {
                    const current = getCertifications()
                    current[index] = { ...current[index], start: e.target.value }
                    updateField('certifications', [...current])
                  }}
                  placeholder="e.g., 2024"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Details</label>
              <textarea
                className="form-input h-24"
                value={cert.details || ''}
                onChange={(e) => {
                  const current = getCertifications()
                  current[index] = { ...current[index], details: e.target.value }
                  updateField('certifications', [...current])
                }}
                placeholder="**Specialized Training in:**
- Core skill 1
- Core skill 2
- Best practices and standards"
              />
            </div>
          </div>
        </div>
      ))}

      {getCertifications().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TrophyIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No certifications added yet.</p>
          <p className="text-sm">Click "Add Certification" to get started.</p>
        </div>
      )}
    </div>
  )

  // Projects Section - Victoria Rolon Standard
  const getProjects = () => Array.isArray(data.projects) ? data.projects : (data.projects?.assignments || [])

  const renderProjectsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Projects</h3>
        <button
          onClick={() => {
            const current = getProjects()
            updateField('projects', [...current, {
              title: '',
              time: '',
              details: '',
              tags: []
            }])
          }}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {getProjects().map((project: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Project #{index + 1}</h4>
            <button
              onClick={() => {
                const current = getProjects()
                updateField('projects', current.filter((_: any, i: number) => i !== index))
              }}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={project.title || ''}
                  onChange={(e) => {
                    const current = getProjects()
                    current[index] = { ...current[index], title: e.target.value }
                    updateField('projects', [...current])
                  }}
                  placeholder="e.g., Thesis Project - Technical Informatics"
                />
              </div>
              <div>
                <label className="form-label">Year/Duration</label>
                <input
                  type="text"
                  className="form-input"
                  value={project.time || ''}
                  onChange={(e) => {
                    const current = getProjects()
                    current[index] = { ...current[index], time: e.target.value }
                    updateField('projects', [...current])
                  }}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                className="form-input h-28"
                value={project.details || ''}
                onChange={(e) => {
                  const current = getProjects()
                  current[index] = { ...current[index], details: e.target.value }
                  updateField('projects', [...current])
                }}
                placeholder="**Comprehensive IT Solution Development**

Designed and implemented a complete project demonstrating mastery of:
- Systems Analysis and Design
- Programming Fundamentals
- Technical Documentation

**Result:** Successfully defended before academic committee."
              />
            </div>
          </div>
        </div>
      ))}

      {getProjects().length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <PresentationChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No projects added yet.</p>
          <p className="text-sm">Click "Add Project" to get started.</p>
        </div>
      )}
    </div>
  )

  // Memoized section content renderer
  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection()
      case 'profile':
        return renderCareerProfileSection()
      case 'interests':
        return renderInterestsSection()
      case 'experience':
        return renderExperienceSection()
      case 'education':
        return renderEducationSection()
      case 'skills':
        return renderSkillsSection()
      case 'certifications':
        return renderCertificationsSection()
      case 'projects':
        return renderProjectsSection()
      case 'portfolio':
        return (
          <PortfolioSection
            data={data}
            updateField={updateField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      case 'videoPortfolio':
        return (
          <VideoPortfolioSection
            data={data}
            updateField={updateField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      case 'imageGallery':
        return (
          <ImageGallerySection
            data={data}
            updateField={updateField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      case 'developerProfile':
        return (
          <DeveloperProfileSection
            data={data}
            updateField={updateField}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
          />
        )
      default:
        return renderPersonalSection()
    }
  }, [activeSection, data, updateField, addArrayItem, removeArrayItem])

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav
          className="-mb-px flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300"
          role="tablist"
          aria-label="CV Builder Sections"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              role="tab"
              aria-selected={activeSection === section.id}
              aria-controls={`section-${section.id}`}
              id={`tab-${section.id}`}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                activeSection === section.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <section.icon className="h-4 w-4" aria-hidden="true" />
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div
        className="animate-fade-in"
        role="tabpanel"
        id={`section-${activeSection}`}
        aria-labelledby={`tab-${activeSection}`}
      >
        {sectionContent}
      </div>

      {/* AI Assistant Modal */}
      {aiModal && (
        <AIAssistant
          initialText={aiModal.text}
          section={aiModal.section}
          onAccept={handleAIComplete}
          onClose={() => setAiModal(null)}
        />
      )}
    </div>
  )
}

// Export memoized component
export const CVBuilderForm = memo(CVBuilderFormComponent)