'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  MinusIcon, 
  UserIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface CVBuilderFormProps {
  data: any
  onChange: (data: any) => void
}

export function CVBuilderForm({ data, onChange }: CVBuilderFormProps) {
  const [activeSection, setActiveSection] = useState('personal')

  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const newData = { ...data }
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    onChange(newData)
  }

  const addArrayItem = (path: string, template: any) => {
    const keys = path.split('.')
    const newData = { ...data }
    let current = newData
    
    for (const key of keys) {
      if (!current[key]) current[key] = []
      current = current[key]
    }
    
    current.push({ ...template })
    onChange(newData)
  }

  const removeArrayItem = (path: string, index: number) => {
    const keys = path.split('.')
    const newData = { ...data }
    let current = newData
    
    for (const key of keys) {
      current = current[key]
    }
    
    current.splice(index, 1)
    onChange(newData)
  }

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'profile', name: 'Career Profile', icon: SparklesIcon },
    { id: 'experience', name: 'Experience', icon: BriefcaseIcon },
    { id: 'education', name: 'Education', icon: AcademicCapIcon },
    { id: 'skills', name: 'Skills', icon: TrophyIcon },
    { id: 'projects', name: 'Projects', icon: SparklesIcon },
    { id: 'additional', name: 'Additional', icon: HeartIcon },
  ]

  const renderPersonalSection = () => (
    <div className="space-y-6">
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
    </div>
  )

  const renderCareerProfileSection = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-input h-32"
          value={data['career-profile']?.summary || ''}
          onChange={(e) => updateField('career-profile.summary', e.target.value)}
          placeholder="Write a compelling summary of your professional experience, key skills, and career objectives. Use keywords relevant to your target role."
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Include 3-4 sentences highlighting your experience, key achievements, and career goals.
        </p>
      </div>
    </div>
  )

  const renderExperienceSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
        <button
          onClick={() => addArrayItem('experiences.info', {
            role: '',
            company: '',
            time: '',
            details: '',
            tags: [],
            icon: 'briefcase'
          })}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Experience
        </button>
      </div>
      
      {data.experiences?.info?.map((exp: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
            <button
              onClick={() => removeArrayItem('experiences.info', index)}
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
                onChange={(e) => updateField(`experiences.info.${index}.role`, e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Company *</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.company || ''}
                  onChange={(e) => updateField(`experiences.info.${index}.company`, e.target.value)}
                  placeholder="e.g., Tech Corp Inc."
                />
              </div>
              <div>
                <label className="form-label">Duration *</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.time || ''}
                  onChange={(e) => updateField(`experiences.info.${index}.time`, e.target.value)}
                  placeholder="e.g., Jan 2020 - Present"
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Description & Achievements</label>
              <textarea
                className="form-input h-24"
                value={exp.details || ''}
                onChange={(e) => updateField(`experiences.info.${index}.details`, e.target.value)}
                placeholder="• Describe your key responsibilities and achievements using bullet points&#10;• Use action verbs and quantify results where possible&#10;• Focus on impact and outcomes rather than just tasks"
              />
            </div>
          </div>
        </div>
      ))}
      
      {(!data.experiences?.info || data.experiences.info.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <BriefcaseIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  )

  const renderEducationSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <button
          onClick={() => addArrayItem('education.info', {
            degree: '',
            university: '',
            time: '',
            details: ''
          })}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Education
        </button>
      </div>
      
      {data.education?.info?.map((edu: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
            <button
              onClick={() => removeArrayItem('education.info', index)}
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
                onChange={(e) => updateField(`education.info.${index}.degree`, e.target.value)}
                placeholder="e.g., Bachelor of Computer Science"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Institution *</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.university || ''}
                  onChange={(e) => updateField(`education.info.${index}.university`, e.target.value)}
                  placeholder="e.g., University of Technology"
                />
              </div>
              <div>
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.time || ''}
                  onChange={(e) => updateField(`education.info.${index}.time`, e.target.value)}
                  placeholder="e.g., 2018 - 2022"
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Additional Details</label>
              <textarea
                className="form-input h-20"
                value={edu.details || ''}
                onChange={(e) => updateField(`education.info.${index}.details`, e.target.value)}
                placeholder="• GPA, honors, relevant coursework&#10;• Thesis topic, awards, extracurricular activities"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderSkillsSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Skills & Proficiency</h3>
        <button
          onClick={() => addArrayItem('skills.toolset', {
            name: '',
            level: '80%',
            tags: []
          })}
          className="btn-secondary text-sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Skill
        </button>
      </div>
      
      {data.skills?.toolset?.map((skill: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-gray-900">Skill #{index + 1}</h4>
            <button
              onClick={() => removeArrayItem('skills.toolset', index)}
              className="text-red-600 hover:text-red-800"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Skill Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={skill.name || ''}
                  onChange={(e) => updateField(`skills.toolset.${index}.name`, e.target.value)}
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>
              <div>
                <label className="form-label">Proficiency Level</label>
                <select
                  className="form-input"
                  value={skill.level || '80%'}
                  onChange={(e) => updateField(`skills.toolset.${index}.level`, e.target.value)}
                >
                  <option value="100%">Expert (100%)</option>
                  <option value="90%">Advanced (90%)</option>
                  <option value="80%">Proficient (80%)</option>
                  <option value="70%">Intermediate (70%)</option>
                  <option value="60%">Beginner (60%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSection()
      case 'profile':
        return renderCareerProfileSection()
      case 'experience':
        return renderExperienceSection()
      case 'education':
        return renderEducationSection()
      case 'skills':
        return renderSkillsSection()
      default:
        return renderPersonalSection()
    }
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeSection === section.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <section.icon className="h-4 w-4" />
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="animate-fade-in">
        {renderSection()}
      </div>
    </div>
  )
}