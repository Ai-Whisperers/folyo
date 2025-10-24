'use client'

import { useEffect, useState } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'

interface CVPreviewProps {
  data: any
  theme: string
}

export function CVPreview({ data, theme }: CVPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState('')

  // Theme color mapping
  const themeColors = {
    blue: '#2E86AB',
    turquoise: '#17a2b8', 
    green: '#28a745',
    berry: '#8e44ad',
    orange: '#fd7e14',
    ceramic: '#d4926d',
    teal: '#20c997',
    oceanstale: '#6c757d'
  }

  const currentThemeColor = themeColors[theme as keyof typeof themeColors] || themeColors.teal

  // Generate preview HTML based on the Jekyll template structure
  useEffect(() => {
    const generatePreview = () => {
      const sidebarContent = `
        <div class="sidebar-wrapper" style="background-color: ${currentThemeColor}; color: white; padding: 2rem; border-radius: 8px; margin-bottom: 1rem;">
          <div class="profile-container text-center mb-6">
            ${data.sidebar?.avatar ? 
              `<img class="avatar w-24 h-24 rounded-full mx-auto mb-4 bg-white p-1" src="/api/placeholder/96/96" alt="Profile" />` :
              `<div class="w-24 h-24 rounded-full mx-auto mb-4 bg-white bg-opacity-20 flex items-center justify-center">
                <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>`
            }
            <h1 class="text-xl font-bold mb-2">${data.sidebar?.name || 'Your Name'}</h1>
            <div class="text-sm opacity-90">${data.sidebar?.tagline || 'Your Professional Title'}</div>
          </div>
          
          <div class="contact-info space-y-2 text-sm">
            ${data.sidebar?.email ? `<div class="flex items-center space-x-2"><span>📧</span><span>${data.sidebar.email}</span></div>` : ''}
            ${data.sidebar?.phone ? `<div class="flex items-center space-x-2"><span>📱</span><span>${data.sidebar.phone}</span></div>` : ''}
            ${data.sidebar?.website ? `<div class="flex items-center space-x-2"><span>🌐</span><span>${data.sidebar.website}</span></div>` : ''}
            ${data.sidebar?.linkedin ? `<div class="flex items-center space-x-2"><span>💼</span><span>linkedin.com/in/${data.sidebar.linkedin}</span></div>` : ''}
            ${data.sidebar?.github ? `<div class="flex items-center space-x-2"><span>🔧</span><span>github.com/${data.sidebar.github}</span></div>` : ''}
          </div>
          
          ${data.sidebar?.languages?.info?.length > 0 ? `
            <div class="languages mt-6">
              <h3 class="text-lg font-semibold mb-3">Languages</h3>
              <div class="space-y-2">
                ${data.sidebar.languages.info.map((lang: any) => `
                  <div class="flex justify-between">
                    <span>${lang.idiom}</span>
                    <span class="opacity-75">${lang.level}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${data.interests?.info?.length > 0 ? `
            <div class="interests mt-6">
              <h3 class="text-lg font-semibold mb-3">Interests</h3>
              <div class="flex flex-wrap gap-2">
                ${data.interests.info.map((interest: any) => `
                  <span class="px-2 py-1 bg-white bg-opacity-20 rounded text-xs">${interest.item}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `

      const mainContent = `
        <div class="main-wrapper bg-white p-6 rounded-lg shadow-sm">
          ${data['career-profile']?.summary ? `
            <section class="career-profile mb-8">
              <h2 class="text-2xl font-bold mb-4" style="color: ${currentThemeColor};">Career Profile</h2>
              <div class="text-gray-700 leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
            </section>
          ` : ''}
          
          ${data.experiences?.info?.length > 0 ? `
            <section class="experiences mb-8">
              <h2 class="text-2xl font-bold mb-6" style="color: ${currentThemeColor};">Work Experience</h2>
              <div class="space-y-6">
                ${data.experiences.info.map((exp: any) => `
                  <div class="experience-item">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">${exp.role || 'Job Title'}</h3>
                      <span class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">${exp.time || 'Duration'}</span>
                    </div>
                    <div class="text-gray-600 mb-3 font-medium">${exp.company || 'Company Name'}</div>
                    ${exp.details ? `<div class="text-gray-700 text-sm leading-relaxed">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          ${data.education?.info?.length > 0 ? `
            <section class="education mb-8">
              <h2 class="text-2xl font-bold mb-6" style="color: ${currentThemeColor};">Education</h2>
              <div class="space-y-4">
                ${data.education.info.map((edu: any) => `
                  <div class="education-item">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">${edu.degree || 'Degree'}</h3>
                      <span class="text-sm text-gray-600">${edu.time || 'Duration'}</span>
                    </div>
                    <div class="text-gray-600 mb-2">${edu.university || 'Institution'}</div>
                    ${edu.details ? `<div class="text-gray-700 text-sm">${edu.details.replace(/\n/g, '<br>')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          ${data.skills?.toolset?.length > 0 ? `
            <section class="skills mb-8">
              <h2 class="text-2xl font-bold mb-6" style="color: ${currentThemeColor};">Skills & Proficiency</h2>
              <div class="space-y-4">
                ${data.skills.toolset.map((skill: any) => `
                  <div class="skill-item">
                    <div class="flex justify-between mb-2">
                      <span class="font-medium text-gray-900">${skill.name || 'Skill Name'}</span>
                      <span class="text-sm text-gray-600">${skill.level || '80%'}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="h-2 rounded-full" style="background-color: ${currentThemeColor}; width: ${skill.level || '80%'};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
          
          ${data.projects?.assignments?.length > 0 ? `
            <section class="projects mb-8">
              <h2 class="text-2xl font-bold mb-6" style="color: ${currentThemeColor};">Projects</h2>
              <div class="space-y-6">
                ${data.projects.assignments.map((project: any) => `
                  <div class="project-item">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-semibold text-gray-900">${project.title || 'Project Title'}</h3>
                      <span class="text-sm text-gray-600">${project.time || 'Year'}</span>
                    </div>
                    ${project.details ? `<div class="text-gray-700 text-sm leading-relaxed">${project.details.replace(/\n/g, '<br>')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      `

      return `
        <div class="cv-container" style="font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-1">
              ${sidebarContent}
            </div>
            <div class="lg:col-span-2">
              ${mainContent}
            </div>
          </div>
        </div>
      `
    }

    setPreviewHtml(generatePreview())
  }, [data, theme, currentThemeColor])

  return (
    <div className="cv-preview-container">
      <style jsx>{`
        .cv-preview-container {
          font-size: 14px;
          line-height: 1.4;
        }
        .cv-preview-container h1 {
          font-size: 1.5rem;
          line-height: 1.2;
        }
        .cv-preview-container h2 {
          font-size: 1.25rem;
          line-height: 1.3;
        }
        .cv-preview-container h3 {
          font-size: 1.1rem;
          line-height: 1.3;
        }
      `}</style>
      
      {!data.sidebar?.name && !data['career-profile']?.summary && !data.experiences?.info?.length ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <UserCircleIcon className="h-16 w-16 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Start Building Your CV</h3>
          <p className="text-center text-gray-500">
            Fill out the form on the left to see your CV come to life here.
            <br />
            Your changes will appear instantly!
          </p>
        </div>
      ) : (
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}
    </div>
  )
}