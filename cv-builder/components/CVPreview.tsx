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
      // ---------------------------------------------------------
      // THEME: VIDEO PORTFOLIO (Creative Dark)
      // ---------------------------------------------------------
      if (theme === 'video-portfolio') {
        const portfolioContent = data.portfolio?.items?.length > 0 ? `
          <section class="portfolio-section mb-16">
            <h2 class="text-3xl font-bold mb-8 text-white border-b border-gray-800 pb-4">Portfolio</h2>
            <div class="${data.portfolio.layout === 'list' ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}">
              ${data.portfolio.items.map((item: any) => `
                <div class="portfolio-item bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-gray-600 transition-colors group">
                  ${item.type === 'video' ? `
                    <div class="aspect-video w-full bg-black relative">
                      <iframe 
                        src="${item.url.includes('youtube.com/watch?v=') ? item.url.replace('watch?v=', 'embed/') : item.url}" 
                        class="absolute top-0 left-0 w-full h-full" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                      ></iframe>
                    </div>
                  ` : item.type === 'image' ? `
                    <div class="w-full h-56 overflow-hidden relative">
                      <img src="${item.url}" alt="${item.title || 'Portfolio Item'}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ` : ''}
                  
                  <div class="p-6">
                    <div class="flex items-start justify-between mb-2">
                      <h3 class="text-xl font-bold text-gray-100">${item.title || 'Untitled'}</h3>
                      ${item.type === 'document' ? '<span class="text-2xl">📄</span>' : ''}
                      ${item.type === 'link' ? '<span class="text-2xl">🔗</span>' : ''}
                    </div>
                    
                    ${item.description ? `<p class="text-gray-400 text-sm mb-4 leading-relaxed">${item.description}</p>` : ''}
                    
                    ${(item.type === 'link' || item.type === 'document' || (item.type !== 'video' && item.type !== 'image')) ? `
                      <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                        View Project 
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''

        return `
          <div class="cv-container dark-theme" style="font-family: Inter, system-ui, sans-serif; background-color: #1a1a1a; min-height: 100%; color: #e5e7eb; padding: 2rem;">
            <div class="max-w-6xl mx-auto">
              <!-- Header -->
              <header class="text-center py-16 mb-12 border-b border-gray-800">
                ${data.sidebar?.avatar ?
            `<img class="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-800 shadow-xl" src="${data.sidebar.avatar}" alt="Profile" />` : ''
          }
                <h1 class="text-5xl font-black text-white mb-4 tracking-tight">${data.sidebar?.name || 'Your Name'}</h1>
                <p class="text-xl text-gray-400 font-light mb-8">${data.sidebar?.tagline || 'Your Creative Role'}</p>
                
                <div class="flex justify-center space-x-6 text-gray-400">
                  ${data.sidebar?.email ? `<a href="mailto:${data.sidebar.email}" class="hover:text-white transition-colors">📧 Email</a>` : ''}
                  ${data.sidebar?.linkedin ? `<a href="https://linkedin.com/in/${data.sidebar.linkedin}" target="_blank" class="hover:text-white transition-colors">💼 LinkedIn</a>` : ''}
                  ${data.sidebar?.github ? `<a href="https://github.com/${data.sidebar.github}" target="_blank" class="hover:text-white transition-colors">🔧 GitHub</a>` : ''}
                  ${data.sidebar?.website ? `<a href="${data.sidebar.website}" target="_blank" class="hover:text-white transition-colors">🌐 Website</a>` : ''}
                </div>
              </header>

              <!-- Main Content -->
              <div class="space-y-16">
                
                <!-- Portfolio Section (First for Creative Theme) -->
                ${portfolioContent}

                <!-- About / Career Profile -->
                ${data['career-profile']?.summary ? `
                  <section class="max-w-3xl mx-auto text-center mb-16">
                    <h2 class="text-2xl font-bold mb-6 text-white">About Me</h2>
                    <div class="text-lg text-gray-300 leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
                  </section>
                ` : ''}

                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <!-- Experience -->
                  ${data.experiences?.info?.length > 0 ? `
                    <section>
                      <h2 class="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Experience</h2>
                      <div class="space-y-8">
                        ${data.experiences.info.map((exp: any) => `
                          <div class="relative pl-6 border-l-2 border-gray-800">
                            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-600"></div>
                            <h3 class="text-xl font-bold text-white mb-1">${exp.role}</h3>
                            <div class="text-primary-400 mb-2 font-medium">${exp.company}</div>
                            <div class="text-sm text-gray-500 mb-3 uppercase tracking-wider">${exp.time}</div>
                            <div class="text-gray-400 leading-relaxed">${exp.details?.replace(/\n/g, '<br>')}</div>
                          </div>
                        `).join('')}
                      </div>
                    </section>
                  ` : ''}

                  <!-- Skills & Education -->
                  <div class="space-y-12">
                     ${data.skills?.toolset?.length > 0 ? `
                      <section>
                        <h2 class="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Skills</h2>
                        <div class="flex flex-wrap gap-3">
                          ${data.skills.toolset.map((skill: any) => `
                            <span class="px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm font-medium border border-gray-700">
                              ${skill.name} <span class="text-gray-500 ml-1">•</span> <span class="text-primary-400">${skill.level}%</span>
                            </span>
                          `).join('')}
                        </div>
                      </section>
                    ` : ''}

                    ${data.education?.info?.length > 0 ? `
                      <section>
                        <h2 class="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">Education</h2>
                        <div class="space-y-6">
                          ${data.education.info.map((edu: any) => `
                            <div>
                              <h3 class="text-lg font-bold text-white">${edu.degree}</h3>
                              <div class="text-gray-400">${edu.university}</div>
                              <div class="text-sm text-gray-500 mt-1">${edu.time}</div>
                            </div>
                          `).join('')}
                        </div>
                      </section>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <footer class="mt-20 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                <p>&copy; ${new Date().getFullYear()} ${data.sidebar?.name || 'My Portfolio'}. All rights reserved.</p>
              </footer>
            </div>
          </div>
        `
      }

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
          
          ${data.portfolio?.items?.length > 0 ? `
            <section class="portfolio mb-8">
              <h2 class="text-2xl font-bold mb-6" style="color: ${currentThemeColor};">Portfolio</h2>
              <div class="${data.portfolio.layout === 'list' ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}">
                ${data.portfolio.items.map((item: any) => `
                  <div class="portfolio-item border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                    ${item.type === 'video' ? `
                      <div class="aspect-video w-full bg-gray-100 relative" style="padding-bottom: 56.25%;">
                        <iframe 
                          src="${item.url.includes('youtube.com/watch?v=') ? item.url.replace('watch?v=', 'embed/') : item.url}" 
                          class="absolute top-0 left-0 w-full h-full" 
                          frameborder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowfullscreen
                        ></iframe>
                      </div>
                    ` : item.type === 'image' ? `
                      <div class="w-full h-48 overflow-hidden">
                        <img src="${item.url}" alt="${item.title || 'Portfolio Item'}" class="w-full h-full object-cover" />
                      </div>
                    ` : ''}
                    
                    <div class="p-4">
                      <div class="flex items-start justify-between">
                        <h3 class="font-semibold text-gray-900 mb-1">${item.title || 'Untitled'}</h3>
                        ${item.type === 'document' ? '<span class="text-2xl">📄</span>' : ''}
                      </div>
                      ${item.description ? `<p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.description}</p>` : ''}
                      
                      ${(item.type === 'link' || item.type === 'document' || (item.type !== 'video' && item.type !== 'image')) ? `
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium hover:underline flex items-center mt-2" style="color: ${currentThemeColor};">
                          View Resource 
                          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                      ` : ''}
                    </div>
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