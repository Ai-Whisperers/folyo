'use client'

import { useMemo, memo } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { getThemeColors, isDarkTheme as isDarkThemeUtil, type ThemeColors } from '@/lib/utils/theme'

interface CVPreviewProps {
  data: any
  theme: string
  templateLayout?: string
  scale?: number
  className?: string
}

// Type alias for backward compatibility
type ThemeData = ThemeColors & { gradient?: string; label?: string }

// Get theme data using shared utility
const getThemeData = (theme: string): ThemeData => {
  const colors = getThemeColors(theme)
  return {
    ...colors,
    primary: colors.primary,
    secondary: colors.secondary,
    text: colors.text,
    bg: colors.bg,
    accent: colors.accent,
    label: colors.name,
  }
}

// Check if theme is dark using shared utility
const isDarkTheme = (theme: ThemeData): boolean => {
  return isDarkThemeUtil(theme)
}

// =============================================================================
// DATA NORMALIZATION HELPERS - Victoria Rolon Standard v2.0
// Supports both new standard (direct arrays) and legacy format (nested .info/.toolset)
// =============================================================================
const normalizeExperiences = (data: any): any[] => {
  if (Array.isArray(data.experiences)) return data.experiences
  return data.experiences?.info || []
}

const normalizeEducation = (data: any): any[] => {
  if (Array.isArray(data.education)) return data.education
  return data.education?.info || []
}

const normalizeSkills = (data: any): any[] => {
  if (Array.isArray(data.skills)) return data.skills
  return data.skills?.toolset || []
}

const normalizeCertifications = (data: any): any[] => {
  if (Array.isArray(data.certifications)) return data.certifications
  return data.certifications?.list || []
}

const normalizeProjects = (data: any): any[] => {
  if (Array.isArray(data.projects)) return data.projects
  return data.projects?.assignments || []
}

const normalizeInterests = (data: any): string[] => {
  if (Array.isArray(data.interests)) {
    return data.interests.map((i: any) => typeof i === 'string' ? i : (i.item || ''))
  }
  if (data.interests?.info) {
    return data.interests.info.map((i: any) => i.item || i)
  }
  return []
}

const normalizeLanguages = (data: any): Array<{ idiom: string; level: string }> => {
  const langs = data.sidebar?.languages
  if (Array.isArray(langs)) {
    return langs.map((l: any) => ({
      idiom: l.idiom || '',
      level: l.level || 'Intermediate'
    }))
  }
  if (langs?.info) {
    return langs.info.map((l: any) => ({
      idiom: l.idiom || '',
      level: l.level || 'Intermediate'
    }))
  }
  return []
}

const getCareerSummary = (data: any): string => {
  return data.career_profile?.summary || data['career-profile']?.summary || ''
}

// Normalize skill level to percentage number
const normalizeSkillLevel = (level: any): number => {
  if (typeof level === 'number') return level
  if (typeof level === 'string') {
    const num = parseInt(level.replace('%', ''), 10)
    return isNaN(num) ? 80 : num
  }
  return 80
}

// Render markdown-style bold (**text**) as HTML
const renderMarkdownBold = (text: string): string => {
  if (!text) return ''
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

// =============================================================================
// HELPER: Render Video Portfolio Section
// =============================================================================
const renderVideoPortfolioSection = (data: any, theme: ThemeData, isDark: boolean) => {
  const videos = data.videoPortfolio?.videos || []
  const showreel = data.videoPortfolio?.showreel || ''

  if (!showreel && videos.length === 0) return ''

  const parseVideoUrl = (url: string) => {
    if (!url) return url
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/')
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/')
    if (url.includes('vimeo.com/')) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }
    return url
  }

  return `
    <section class="video-portfolio-section mb-16">
      <h2 class="text-3xl font-bold mb-8" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent}; padding-bottom: 1rem;">
        Video Reel
      </h2>

      ${showreel ? `
        <div class="featured-showreel mb-10">
          <h3 class="text-xl font-semibold mb-4" style="color: ${theme.text};">Featured Showreel</h3>
          <div class="aspect-video w-full rounded-xl overflow-hidden shadow-2xl" style="background-color: ${theme.accent};">
            <iframe
              src="${parseVideoUrl(showreel)}"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      ` : ''}

      ${videos.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${videos.map((video: any) => `
            <div class="video-item rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105" style="background-color: ${theme.accent};">
              <div class="aspect-video w-full relative" style="background-color: ${theme.bg};">
                ${video.url ? `
                  <iframe
                    src="${parseVideoUrl(video.url)}"
                    class="absolute top-0 left-0 w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                  ></iframe>
                ` : `
                  <div class="absolute inset-0 flex items-center justify-center" style="color: ${theme.text}; opacity: 0.5;">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                `}
              </div>
              <div class="p-4">
                <h4 class="font-bold text-lg mb-1" style="color: ${theme.text};">${video.title || 'Untitled Video'}</h4>
                <div class="flex items-center gap-3 text-sm mb-2" style="color: ${theme.text}; opacity: 0.6;">
                  ${video.category ? `<span class="px-2 py-0.5 rounded" style="background-color: ${theme.primary}20; color: ${theme.primary};">${video.category}</span>` : ''}
                  ${video.year ? `<span>${video.year}</span>` : ''}
                  ${video.duration ? `<span>${video.duration}</span>` : ''}
                </div>
                ${video.role ? `<div class="text-sm mb-2" style="color: ${theme.primary};">Role: ${video.role}</div>` : ''}
                ${video.description ? `<p class="text-sm" style="color: ${theme.text}; opacity: 0.7;">${video.description}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `
}

// =============================================================================
// HELPER: Render Image Gallery Section
// =============================================================================
const renderImageGallerySection = (data: any, theme: ThemeData, isDark: boolean) => {
  const images = data.imageGallery?.images || []
  const heroImage = data.imageGallery?.heroImage || ''
  const layout = data.imageGallery?.layout || 'masonry'
  const columns = data.imageGallery?.columns || '3'

  if (!heroImage && images.length === 0) return ''

  const gridClass = layout === 'masonry'
    ? `columns-1 md:columns-2 lg:columns-${columns} gap-4 space-y-4`
    : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`

  return `
    <section class="image-gallery-section mb-16">
      <h2 class="text-3xl font-bold mb-8" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent}; padding-bottom: 1rem;">
        Gallery
      </h2>

      ${heroImage ? `
        <div class="hero-image mb-10 rounded-xl overflow-hidden shadow-2xl">
          <img src="${heroImage}" alt="Featured Artwork" class="w-full h-auto max-h-[500px] object-cover" loading="lazy" />
        </div>
      ` : ''}

      ${images.length > 0 ? `
        <div class="${layout === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}">
          ${images.map((image: any) => `
            <div class="gallery-item ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''} rounded-xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl" style="background-color: ${theme.accent};">
              <div class="relative overflow-hidden">
                <img src="${image.url}" alt="${image.title || 'Artwork'}" class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div class="text-center text-white p-4">
                    <h4 class="font-bold text-lg mb-2">${image.title || 'Untitled'}</h4>
                    ${image.category ? `<span class="text-sm opacity-80">${image.category}</span>` : ''}
                  </div>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-lg mb-1" style="color: ${theme.text};">${image.title || 'Untitled'}</h4>
                <div class="flex items-center gap-3 text-sm mb-2" style="color: ${theme.text}; opacity: 0.6;">
                  ${image.category ? `<span>${image.category}</span>` : ''}
                  ${image.year ? `<span>• ${image.year}</span>` : ''}
                </div>
                ${image.medium ? `<div class="text-sm mb-1" style="color: ${theme.text}; opacity: 0.6;">Medium: ${image.medium}</div>` : ''}
                ${image.description ? `<p class="text-sm mt-2" style="color: ${theme.text}; opacity: 0.7;">${image.description}</p>` : ''}
                ${image.forSale && image.price ? `
                  <div class="mt-3 pt-3" style="border-top: 1px solid ${theme.accent};">
                    <span class="font-bold" style="color: ${theme.primary};">${image.price}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `
}

// =============================================================================
// HELPER: Render Developer Profile Section
// =============================================================================
const renderDeveloperProfileSection = (data: any, theme: ThemeData, isDark: boolean) => {
  const repositories = data.developerProfile?.repositories || []
  const codeSnippets = data.developerProfile?.codeSnippets || []
  const languages = data.developerProfile?.languages || []
  const frameworks = data.developerProfile?.frameworks || []
  const githubUsername = data.developerProfile?.githubUsername || data.sidebar?.github || ''

  if (repositories.length === 0 && codeSnippets.length === 0 && languages.length === 0) return ''

  return `
    <section class="developer-profile-section mb-16">
      <h2 class="text-3xl font-bold mb-8" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent}; padding-bottom: 1rem;">
        Projects & Code
      </h2>

      ${githubUsername ? `
        <div class="github-profile mb-8 p-4 rounded-xl flex items-center gap-4" style="background-color: ${theme.accent};">
          <svg class="h-10 w-10" fill="${theme.text}" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
          </svg>
          <div>
            <a href="https://github.com/${githubUsername}" target="_blank" class="font-bold text-lg hover:underline" style="color: ${theme.text};">@${githubUsername}</a>
            <div class="text-sm" style="color: ${theme.text}; opacity: 0.6;">View GitHub Profile</div>
          </div>
        </div>
      ` : ''}

      ${(languages.length > 0 || frameworks.length > 0) ? `
        <div class="tech-stack mb-8 p-4 rounded-xl" style="background-color: ${theme.accent};">
          <h3 class="font-bold text-lg mb-4" style="color: ${theme.primary};">Tech Stack</h3>
          ${languages.length > 0 ? `
            <div class="mb-3">
              <div class="text-sm mb-2" style="color: ${theme.text}; opacity: 0.7;">Languages</div>
              <div class="flex flex-wrap gap-2">
                ${languages.map((lang: string) => `
                  <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: ${theme.primary}20; color: ${theme.primary};">${lang}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
          ${frameworks.length > 0 ? `
            <div>
              <div class="text-sm mb-2" style="color: ${theme.text}; opacity: 0.7;">Frameworks & Tools</div>
              <div class="flex flex-wrap gap-2">
                ${frameworks.map((fw: string) => `
                  <span class="px-3 py-1 rounded-full text-sm" style="background-color: ${theme.bg}; color: ${theme.text}; border: 1px solid ${theme.primary}40;">${fw}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${repositories.length > 0 ? `
        <div class="repositories mb-8">
          <h3 class="font-bold text-xl mb-4" style="color: ${theme.text};">Featured Repositories</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${repositories.map((repo: any) => `
              <div class="repo-card p-4 rounded-xl transition-all duration-300 hover:shadow-xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.accent};">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" style="color: ${theme.text};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <a href="${repo.url}" target="_blank" class="font-bold hover:underline" style="color: ${theme.primary};">${repo.name}</a>
                  </div>
                  ${repo.featured ? `
                    <svg class="w-5 h-5 text-yellow-500 fill-yellow-500" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ` : ''}
                </div>
                ${repo.description ? `<p class="text-sm mb-3" style="color: ${theme.text}; opacity: 0.7;">${repo.description}</p>` : ''}
                <div class="flex items-center gap-4 text-sm" style="color: ${theme.text}; opacity: 0.6;">
                  ${repo.language ? `
                    <span class="flex items-center gap-1">
                      <span class="w-3 h-3 rounded-full" style="background-color: ${theme.primary};"></span>
                      ${repo.language}
                    </span>
                  ` : ''}
                  ${repo.stars ? `
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ${repo.stars}
                    </span>
                  ` : ''}
                  ${repo.forks ? `
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                      ${repo.forks}
                    </span>
                  ` : ''}
                </div>
                ${repo.demoUrl ? `
                  <a href="${repo.demoUrl}" target="_blank" class="inline-flex items-center gap-1 mt-3 text-sm font-medium hover:underline" style="color: ${theme.primary};">
                    Live Demo
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${codeSnippets.length > 0 ? `
        <div class="code-snippets">
          <h3 class="font-bold text-xl mb-4" style="color: ${theme.text};">Code Snippets</h3>
          <div class="space-y-6">
            ${codeSnippets.map((snippet: any) => `
              <div class="snippet-card rounded-xl overflow-hidden" style="background-color: ${theme.accent};">
                <div class="flex items-center justify-between px-4 py-2" style="background-color: ${theme.bg}; border-bottom: 1px solid ${theme.accent};">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5" style="color: ${theme.primary};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <span class="font-medium" style="color: ${theme.text};">${snippet.title || 'Code Snippet'}</span>
                    ${snippet.filename ? `<span class="text-sm" style="color: ${theme.text}; opacity: 0.5;">(${snippet.filename})</span>` : ''}
                  </div>
                  <span class="px-2 py-0.5 rounded text-xs" style="background-color: ${theme.primary}20; color: ${theme.primary};">${snippet.language || 'code'}</span>
                </div>
                ${snippet.description ? `<div class="px-4 py-2 text-sm" style="color: ${theme.text}; opacity: 0.7;">${snippet.description}</div>` : ''}
                <pre class="p-4 overflow-x-auto text-sm" style="background-color: #0d1117; color: #c9d1d9;"><code>${snippet.code?.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '// No code provided'}</code></pre>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  `
}

// =============================================================================
// DARK THEME RENDERER (Cinematographic, Art Gallery, Developer styles)
// =============================================================================
const renderDarkTheme = (data: any, theme: ThemeData, themeName: string) => {
  const isTerminalGreen = themeName === 'terminal-green'
  const isArtGallery = themeName === 'art-gallery' || themeName === 'noir-elegant' || themeName === 'neon-nights'
  const isCinema = ['video-portfolio', 'midnight-cinema', 'director-cut', 'film-noir', 'documentary-style', 'broadcast-red', 'drone-aerial'].includes(themeName)
  const isDeveloper = themeName === 'developer-dark' || themeName === 'github-style' || themeName === 'vscode-dark'

  // Special font styling for terminal theme
  const fontFamily = isTerminalGreen
    ? 'JetBrains Mono, Menlo, Monaco, monospace'
    : 'Inter, system-ui, sans-serif'

  // Specialized portfolio content based on theme type
  const specializedContent = isCinema
    ? renderVideoPortfolioSection(data, theme, true)
    : isArtGallery
    ? renderImageGallerySection(data, theme, true)
    : isDeveloper
    ? renderDeveloperProfileSection(data, theme, true)
    : ''

  const portfolioContent = data.portfolio?.items?.length > 0 ? `
    <section class="portfolio-section mb-16">
      <h2 class="text-3xl font-bold mb-8" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent}; padding-bottom: 1rem;">
        ${isArtGallery ? 'Gallery' : isCinema ? 'Showreel' : isDeveloper ? 'Projects' : 'Portfolio'}
      </h2>
      <div class="${data.portfolio.layout === 'list' ? 'space-y-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}">
        ${data.portfolio.items.map((item: any) => `
          <div class="portfolio-item rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.accent};">
            ${item.type === 'video' ? `
              <div class="aspect-video w-full relative" style="background-color: ${theme.bg};">
                <iframe
                  src="${item.url.includes('youtube.com/watch?v=') ? item.url.replace('watch?v=', 'embed/') : item.url}"
                  class="absolute top-0 left-0 w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>
            ` : item.type === 'image' ? `
              <div class="w-full h-56 overflow-hidden relative">
                <img src="${item.url}" alt="${item.title || 'Portfolio Item'}" class="w-full h-full object-cover" loading="lazy" />
              </div>
            ` : ''}

            <div class="p-6">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-xl font-bold" style="color: ${theme.text};">${item.title || 'Untitled'}</h3>
                ${item.type === 'document' ? '<span class="text-2xl">📄</span>' : ''}
                ${item.type === 'link' ? '<span class="text-2xl">🔗</span>' : ''}
              </div>

              ${item.description ? `<p class="text-sm mb-4 leading-relaxed" style="color: ${theme.text}; opacity: 0.7;">${item.description}</p>` : ''}

              ${(item.type === 'link' || item.type === 'document' || (item.type !== 'video' && item.type !== 'image')) ? `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                   style="background-color: ${theme.primary}; color: ${isDarkTheme(theme) ? theme.bg : '#fff'};">
                  ${isDeveloper ? 'View Code' : 'View Project'}
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
    <div class="cv-container dark-theme" style="font-family: ${fontFamily}; background-color: ${theme.bg}; min-height: 100%; color: ${theme.text}; padding: 2rem;">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="text-center py-16 mb-12" style="border-bottom: 1px solid ${theme.accent};">
          ${data.sidebar?.avatar
            ? `<img class="w-32 h-32 rounded-full mx-auto mb-6 shadow-xl" style="border: 4px solid ${theme.accent};" src="${data.sidebar.avatar}" alt="Profile" />`
            : ''
          }
          <h1 class="text-5xl font-black mb-4 tracking-tight" style="color: ${theme.text};">${data.sidebar?.name || 'Your Name'}</h1>
          <p class="text-xl font-light mb-8" style="color: ${theme.primary};">${data.sidebar?.tagline || 'Your Creative Role'}</p>

          <div class="flex justify-center flex-wrap gap-4" style="color: ${theme.text}; opacity: 0.8;">
            ${data.sidebar?.email ? `<a href="mailto:${data.sidebar.email}" class="hover:opacity-100 transition-opacity">📧 Email</a>` : ''}
            ${data.sidebar?.linkedin ? `<a href="https://linkedin.com/in/${data.sidebar.linkedin}" target="_blank" class="hover:opacity-100 transition-opacity">💼 LinkedIn</a>` : ''}
            ${data.sidebar?.github ? `<a href="https://github.com/${data.sidebar.github}" target="_blank" class="hover:opacity-100 transition-opacity">💻 GitHub</a>` : ''}
            ${data.sidebar?.website ? `<a href="${data.sidebar.website}" target="_blank" class="hover:opacity-100 transition-opacity">🌐 Website</a>` : ''}
          </div>
        </header>

        <!-- Main Content -->
        <div class="space-y-16">
          ${specializedContent}
          ${portfolioContent}

          ${data['career-profile']?.summary ? `
            <section class="max-w-3xl mx-auto text-center mb-16">
              <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">About Me</h2>
              <div class="text-lg leading-relaxed" style="color: ${theme.text}; opacity: 0.9;">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
            </section>
          ` : ''}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            ${data.experiences?.info?.length > 0 ? `
              <section>
                <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent};">Experience</h2>
                <div class="space-y-8">
                  ${data.experiences.info.map((exp: any) => `
                    <div class="relative pl-6" style="border-left: 2px solid ${theme.accent};">
                      <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full" style="background-color: ${theme.primary};"></div>
                      <h3 class="text-xl font-bold mb-1" style="color: ${theme.text};">${exp.role}</h3>
                      <div class="mb-2 font-medium" style="color: ${theme.primary};">${exp.company}</div>
                      <div class="text-sm mb-3 uppercase tracking-wider" style="color: ${theme.text}; opacity: 0.5;">${exp.time}</div>
                      <div class="leading-relaxed" style="color: ${theme.text}; opacity: 0.8;">${exp.details?.replace(/\n/g, '<br>') || ''}</div>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            <div class="space-y-12">
              ${data.skills?.toolset?.length > 0 ? `
                <section>
                  <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent};">Skills</h2>
                  <div class="flex flex-wrap gap-3">
                    ${data.skills.toolset.map((skill: any) => `
                      <span class="px-4 py-2 rounded-full text-sm font-medium" style="background-color: ${theme.accent}; color: ${theme.text}; border: 1px solid ${theme.primary}40;">
                        ${skill.name} <span style="color: ${theme.primary}; margin-left: 4px;">${skill.level}%</span>
                      </span>
                    `).join('')}
                  </div>
                </section>
              ` : ''}

              ${data.education?.info?.length > 0 ? `
                <section>
                  <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent};">Education</h2>
                  <div class="space-y-6">
                    ${data.education.info.map((edu: any) => `
                      <div>
                        <h3 class="text-lg font-bold" style="color: ${theme.text};">${edu.degree}</h3>
                        <div style="color: ${theme.text}; opacity: 0.7;">${edu.university}</div>
                        <div class="text-sm mt-1" style="color: ${theme.text}; opacity: 0.5;">${edu.time}</div>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="mt-20 pt-8 text-center text-sm" style="border-top: 1px solid ${theme.accent}; color: ${theme.text}; opacity: 0.5;">
          <p>&copy; ${new Date().getFullYear()} ${data.sidebar?.name || 'My Portfolio'}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  `
}

// =============================================================================
// GRADIENT THEME RENDERER
// =============================================================================
const renderGradientTheme = (data: any, theme: ThemeData) => {
  const gradient = theme.gradient || `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`

  return `
    <div class="cv-container gradient-theme" style="font-family: Inter, system-ui, sans-serif; background-color: ${theme.bg}; min-height: 100%;">
      <div class="max-w-4xl mx-auto">
        <!-- Gradient Header -->
        <header class="rounded-b-3xl p-8 mb-8" style="background: ${gradient}; color: white;">
          <div class="text-center">
            ${data.sidebar?.avatar
              ? `<img class="w-28 h-28 rounded-full mx-auto mb-6 shadow-xl border-4 border-white/30" src="${data.sidebar.avatar}" alt="Profile" />`
              : `<div class="w-28 h-28 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center">
                  <svg class="w-14 h-14 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>`
            }
            <h1 class="text-4xl font-bold mb-2">${data.sidebar?.name || 'Your Name'}</h1>
            <p class="text-xl opacity-90 mb-6">${data.sidebar?.tagline || 'Your Professional Title'}</p>

            <div class="flex justify-center flex-wrap gap-4 text-sm opacity-90">
              ${data.sidebar?.email ? `<span>📧 ${data.sidebar.email}</span>` : ''}
              ${data.sidebar?.phone ? `<span>📱 ${data.sidebar.phone}</span>` : ''}
              ${data.sidebar?.website ? `<span>🌐 ${data.sidebar.website}</span>` : ''}
            </div>
          </div>
        </header>

        <div class="px-6 pb-8" style="color: ${theme.text};">
          ${data['career-profile']?.summary ? `
            <section class="mb-10 p-6 rounded-2xl" style="background-color: ${theme.accent};">
              <h2 class="text-2xl font-bold mb-4" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">About Me</h2>
              <div class="leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
            </section>
          ` : ''}

          ${data.experiences?.info?.length > 0 ? `
            <section class="mb-10">
              <h2 class="text-2xl font-bold mb-6" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Experience</h2>
              <div class="space-y-6">
                ${data.experiences.info.map((exp: any) => `
                  <div class="p-5 rounded-xl" style="background-color: ${theme.accent};">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-lg font-semibold">${exp.role}</h3>
                      <span class="text-sm px-3 py-1 rounded-full" style="background: ${gradient}; color: white;">${exp.time}</span>
                    </div>
                    <div class="font-medium mb-3" style="color: ${theme.primary};">${exp.company}</div>
                    ${exp.details ? `<div class="text-sm opacity-80 leading-relaxed">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.skills?.toolset?.length > 0 ? `
            <section class="mb-10">
              <h2 class="text-2xl font-bold mb-6" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Skills</h2>
              <div class="space-y-4">
                ${data.skills.toolset.map((skill: any) => `
                  <div>
                    <div class="flex justify-between mb-2">
                      <span class="font-medium">${skill.name}</span>
                      <span class="text-sm opacity-70">${skill.level}</span>
                    </div>
                    <div class="w-full rounded-full h-2" style="background-color: ${theme.accent};">
                      <div class="h-2 rounded-full" style="background: ${gradient}; width: ${skill.level};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.education?.info?.length > 0 ? `
            <section class="mb-10">
              <h2 class="text-2xl font-bold mb-6" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Education</h2>
              <div class="space-y-4">
                ${data.education.info.map((edu: any) => `
                  <div class="p-5 rounded-xl" style="background-color: ${theme.accent};">
                    <h3 class="text-lg font-semibold">${edu.degree}</h3>
                    <div class="opacity-70">${edu.university}</div>
                    <div class="text-sm opacity-50 mt-1">${edu.time}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.portfolio?.items?.length > 0 ? `
            <section class="mb-10">
              <h2 class="text-2xl font-bold mb-6" style="background: ${gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Portfolio</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${data.portfolio.items.map((item: any) => `
                  <div class="rounded-xl overflow-hidden" style="background-color: ${theme.accent};">
                    ${item.type === 'video' ? `
                      <div class="aspect-video w-full relative">
                        <iframe
                          src="${item.url.includes('youtube.com/watch?v=') ? item.url.replace('watch?v=', 'embed/') : item.url}"
                          class="absolute top-0 left-0 w-full h-full"
                          frameborder="0"
                          allowfullscreen
                          loading="lazy"
                        ></iframe>
                      </div>
                    ` : item.type === 'image' ? `
                      <div class="h-40 overflow-hidden">
                        <img src="${item.url}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy" />
                      </div>
                    ` : ''}
                    <div class="p-4">
                      <h3 class="font-semibold mb-1">${item.title || 'Untitled'}</h3>
                      ${item.description ? `<p class="text-sm opacity-70 line-clamp-2">${item.description}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// =============================================================================
// EXECUTIVE THEME RENDERER (Luxury, sophisticated)
// =============================================================================
const renderExecutiveTheme = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container executive-theme" style="font-family: 'Georgia', serif; background-color: ${theme.bg}; min-height: 100%; color: ${theme.text};">
      <div class="max-w-4xl mx-auto py-12 px-8">
        <!-- Elegant Header with border -->
        <header class="text-center pb-8 mb-10" style="border-bottom: 3px double ${theme.primary};">
          ${data.sidebar?.avatar
            ? `<img class="w-36 h-36 rounded-full mx-auto mb-6 shadow-lg" style="border: 3px solid ${theme.primary};" src="${data.sidebar.avatar}" alt="Profile" />`
            : ''
          }
          <h1 class="text-4xl font-bold mb-3 tracking-wide" style="color: ${theme.primary};">${data.sidebar?.name || 'Your Name'}</h1>
          <p class="text-xl italic mb-6" style="color: ${theme.secondary};">${data.sidebar?.tagline || 'Executive Title'}</p>

          <div class="flex justify-center flex-wrap gap-6 text-sm">
            ${data.sidebar?.email ? `<span style="color: ${theme.text};">✉️ ${data.sidebar.email}</span>` : ''}
            ${data.sidebar?.phone ? `<span style="color: ${theme.text};">☎️ ${data.sidebar.phone}</span>` : ''}
            ${data.sidebar?.linkedin ? `<span style="color: ${theme.text};">🔗 LinkedIn</span>` : ''}
          </div>
        </header>

        ${data['career-profile']?.summary ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.secondary};">Executive Summary</h2>
            <div class="leading-relaxed text-lg italic" style="color: ${theme.text};">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
          </section>
        ` : ''}

        ${data.experiences?.info?.length > 0 ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.secondary};">Professional Experience</h2>
            <div class="space-y-8">
              ${data.experiences.info.map((exp: any) => `
                <div class="pl-6" style="border-left: 2px solid ${theme.primary};">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold" style="color: ${theme.primary};">${exp.role}</h3>
                    <span class="text-sm italic" style="color: ${theme.secondary};">${exp.time}</span>
                  </div>
                  <div class="font-medium mb-3">${exp.company}</div>
                  ${exp.details ? `<div class="leading-relaxed opacity-90">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          ${data.education?.info?.length > 0 ? `
            <section>
              <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.secondary};">Education</h2>
              <div class="space-y-4">
                ${data.education.info.map((edu: any) => `
                  <div>
                    <h3 class="text-lg font-semibold" style="color: ${theme.primary};">${edu.degree}</h3>
                    <div class="italic">${edu.university}</div>
                    <div class="text-sm opacity-70">${edu.time}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.skills?.toolset?.length > 0 ? `
            <section>
              <h2 class="text-2xl font-bold mb-6 pb-2" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.secondary};">Core Competencies</h2>
              <div class="grid grid-cols-2 gap-3">
                ${data.skills.toolset.map((skill: any) => `
                  <div class="flex items-center gap-2">
                    <span style="color: ${theme.primary};">◆</span>
                    <span>${skill.name}</span>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// =============================================================================
// CLASSIC/LIGHT THEME RENDERER (Default for professional, creative, minimal)
// =============================================================================
const renderClassicTheme = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container" style="font-family: Inter, system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <!-- Sidebar -->
          <div class="sidebar-wrapper" style="background-color: ${theme.primary}; color: white; padding: 2rem; border-radius: 8px; margin-bottom: 1rem;">
            <div class="profile-container text-center mb-6">
              ${data.sidebar?.avatar
                ? `<img class="avatar w-24 h-24 rounded-full mx-auto mb-4 bg-white p-1" src="${data.sidebar.avatar}" alt="Profile" />`
                : `<div class="w-24 h-24 rounded-full mx-auto mb-4 bg-white bg-opacity-20 flex items-center justify-center">
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
        </div>

        <div class="lg:col-span-2">
          <!-- Main Content -->
          <div class="main-wrapper bg-white p-6 rounded-lg shadow-sm">
            ${data['career-profile']?.summary ? `
              <section class="career-profile mb-8">
                <h2 class="text-2xl font-bold mb-4" style="color: ${theme.primary};">Career Profile</h2>
                <div class="text-gray-700 leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
              </section>
            ` : ''}

            ${data.experiences?.info?.length > 0 ? `
              <section class="experiences mb-8">
                <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">Work Experience</h2>
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
                <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">Education</h2>
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
                <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">Skills & Proficiency</h2>
                <div class="space-y-4">
                  ${data.skills.toolset.map((skill: any) => `
                    <div class="skill-item">
                      <div class="flex justify-between mb-2">
                        <span class="font-medium text-gray-900">${skill.name || 'Skill Name'}</span>
                        <span class="text-sm text-gray-600">${skill.level || '80%'}</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full" style="background-color: ${theme.primary}; width: ${skill.level || '80%'};"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

            ${data.projects?.assignments?.length > 0 ? `
              <section class="projects mb-8">
                <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">Projects</h2>
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
                <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">Portfolio</h2>
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
                            loading="lazy"
                          ></iframe>
                        </div>
                      ` : item.type === 'image' ? `
                        <div class="w-full h-48 overflow-hidden">
                          <img src="${item.url}" alt="${item.title || 'Portfolio Item'}" class="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ` : ''}

                      <div class="p-4">
                        <div class="flex items-start justify-between">
                          <h3 class="font-semibold text-gray-900 mb-1">${item.title || 'Untitled'}</h3>
                          ${item.type === 'document' ? '<span class="text-2xl">📄</span>' : ''}
                        </div>
                        ${item.description ? `<p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.description}</p>` : ''}

                        ${(item.type === 'link' || item.type === 'document' || (item.type !== 'video' && item.type !== 'image')) ? `
                          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium hover:underline flex items-center mt-2" style="color: ${theme.primary};">
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
        </div>
      </div>
    </div>
  `
}

// =============================================================================
// TEMPLATE LAYOUT RENDERERS (8 distinct layouts)
// =============================================================================

// Layout: Classic - Left sidebar layout (traditional CV)
const renderLayoutClassic = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-classic" style="font-family: Inter, system-ui, sans-serif; max-width: 900px; margin: 0 auto; display: flex; gap: 0; min-height: 100%;">
      <!-- Left Sidebar -->
      <div style="width: 280px; background-color: ${theme.primary}; color: white; padding: 2rem; flex-shrink: 0;">
        <div class="text-center mb-8">
          ${data.sidebar?.avatar
            ? `<img class="w-28 h-28 rounded-full mx-auto mb-4 bg-white p-1" src="${data.sidebar.avatar}" alt="Profile" />`
            : `<div class="w-28 h-28 rounded-full mx-auto mb-4 bg-white bg-opacity-20 flex items-center justify-center">
                <svg class="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>`
          }
          <h1 class="text-xl font-bold mb-2">${data.sidebar?.name || 'Your Name'}</h1>
          <div class="text-sm opacity-90">${data.sidebar?.tagline || 'Professional Title'}</div>
        </div>

        <div class="space-y-2 text-sm mb-8">
          ${data.sidebar?.email ? `<div class="flex items-center gap-2"><span>📧</span><span>${data.sidebar.email}</span></div>` : ''}
          ${data.sidebar?.phone ? `<div class="flex items-center gap-2"><span>📱</span><span>${data.sidebar.phone}</span></div>` : ''}
          ${data.sidebar?.website ? `<div class="flex items-center gap-2"><span>🌐</span><span>${data.sidebar.website}</span></div>` : ''}
          ${data.sidebar?.linkedin ? `<div class="flex items-center gap-2"><span>💼</span><span>linkedin.com/in/${data.sidebar.linkedin}</span></div>` : ''}
        </div>

        ${data.skills?.toolset?.length > 0 ? `
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3 pb-2" style="border-bottom: 1px solid rgba(255,255,255,0.3);">Skills</h3>
            <div class="space-y-3">
              ${data.skills.toolset.map((skill: any) => `
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span>${skill.name}</span>
                    <span class="opacity-70">${skill.level}</span>
                  </div>
                  <div class="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                    <div class="h-1.5 rounded-full bg-white" style="width: ${skill.level};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${data.sidebar?.languages?.info?.length > 0 ? `
          <div>
            <h3 class="text-lg font-semibold mb-3 pb-2" style="border-bottom: 1px solid rgba(255,255,255,0.3);">Languages</h3>
            <div class="space-y-2 text-sm">
              ${data.sidebar.languages.info.map((lang: any) => `
                <div class="flex justify-between">
                  <span>${lang.idiom}</span>
                  <span class="opacity-75">${lang.level}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Main Content -->
      <div style="flex: 1; padding: 2rem; background-color: ${theme.bg}; color: ${theme.text};">
        ${data['career-profile']?.summary ? `
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4" style="color: ${theme.primary};">About</h2>
            <div class="leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
          </section>
        ` : ''}

        ${data.experiences?.info?.length > 0 ? `
          <section class="mb-8">
            <h2 class="text-2xl font-bold mb-4" style="color: ${theme.primary};">Experience</h2>
            <div class="space-y-6">
              ${data.experiences.info.map((exp: any) => `
                <div>
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="text-lg font-semibold">${exp.role}</h3>
                    <span class="text-sm px-2 py-1 rounded" style="background-color: ${theme.accent};">${exp.time}</span>
                  </div>
                  <div class="font-medium mb-2" style="color: ${theme.primary};">${exp.company}</div>
                  ${exp.details ? `<div class="text-sm opacity-80">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.education?.info?.length > 0 ? `
          <section>
            <h2 class="text-2xl font-bold mb-4" style="color: ${theme.primary};">Education</h2>
            <div class="space-y-4">
              ${data.education.info.map((edu: any) => `
                <div>
                  <h3 class="font-semibold">${edu.degree}</h3>
                  <div class="text-sm">${edu.university}</div>
                  <div class="text-sm opacity-60">${edu.time}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `
}

// Layout: Modern - Card-based with bold header
const renderLayoutModern = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-modern" style="font-family: Inter, system-ui, sans-serif; max-width: 900px; margin: 0 auto; background-color: ${theme.bg}; color: ${theme.text};">
      <!-- Bold Header -->
      <header style="background-color: ${theme.primary}; color: white; padding: 2.5rem 2rem; margin-bottom: 2rem;">
        <div class="flex items-center gap-6">
          ${data.sidebar?.avatar
            ? `<img class="w-24 h-24 rounded-xl shadow-lg" src="${data.sidebar.avatar}" alt="Profile" />`
            : `<div class="w-24 h-24 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>`
          }
          <div>
            <h1 class="text-3xl font-bold mb-1">${data.sidebar?.name || 'Your Name'}</h1>
            <p class="text-lg opacity-90">${data.sidebar?.tagline || 'Professional Title'}</p>
            <div class="flex flex-wrap gap-4 mt-3 text-sm opacity-80">
              ${data.sidebar?.email ? `<span>📧 ${data.sidebar.email}</span>` : ''}
              ${data.sidebar?.phone ? `<span>📱 ${data.sidebar.phone}</span>` : ''}
            </div>
          </div>
        </div>
      </header>

      <div style="padding: 0 2rem 2rem;">
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${data['career-profile']?.summary ? `
            <div class="md:col-span-2 p-6 rounded-xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.primary}20;">
              <h2 class="text-lg font-bold mb-3" style="color: ${theme.primary};">About Me</h2>
              <p class="leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${data.experiences?.info?.length > 0 ? `
            <div class="p-6 rounded-xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.primary}20;">
              <h2 class="text-lg font-bold mb-4" style="color: ${theme.primary};">Experience</h2>
              <div class="space-y-4">
                ${data.experiences.info.slice(0, 3).map((exp: any) => `
                  <div class="pb-4" style="border-bottom: 1px solid ${theme.primary}10;">
                    <h3 class="font-semibold">${exp.role}</h3>
                    <div class="text-sm font-medium" style="color: ${theme.primary};">${exp.company}</div>
                    <div class="text-xs opacity-60 mt-1">${exp.time}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.skills?.toolset?.length > 0 ? `
            <div class="p-6 rounded-xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.primary}20;">
              <h2 class="text-lg font-bold mb-4" style="color: ${theme.primary};">Skills</h2>
              <div class="flex flex-wrap gap-2">
                ${data.skills.toolset.map((skill: any) => `
                  <span class="px-3 py-1.5 rounded-lg text-sm font-medium" style="background-color: ${theme.primary}; color: white;">
                    ${skill.name}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.education?.info?.length > 0 ? `
            <div class="md:col-span-2 p-6 rounded-xl" style="background-color: ${theme.accent}; border: 1px solid ${theme.primary}20;">
              <h2 class="text-lg font-bold mb-4" style="color: ${theme.primary};">Education</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${data.education.info.map((edu: any) => `
                  <div>
                    <h3 class="font-semibold">${edu.degree}</h3>
                    <div class="text-sm">${edu.university}</div>
                    <div class="text-xs opacity-60">${edu.time}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// Layout: Minimal - Single column, clean typography
const renderLayoutMinimal = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-minimal" style="font-family: 'Georgia', serif; max-width: 700px; margin: 0 auto; padding: 3rem 2rem; background-color: ${theme.bg}; color: ${theme.text};">
      <!-- Clean Header -->
      <header class="text-center mb-12 pb-8" style="border-bottom: 1px solid ${theme.accent};">
        <h1 class="text-4xl font-light mb-2" style="color: ${theme.primary};">${data.sidebar?.name || 'Your Name'}</h1>
        <p class="text-lg opacity-70 mb-4">${data.sidebar?.tagline || 'Professional Title'}</p>
        <div class="flex justify-center flex-wrap gap-6 text-sm opacity-60">
          ${data.sidebar?.email ? `<span>${data.sidebar.email}</span>` : ''}
          ${data.sidebar?.phone ? `<span>${data.sidebar.phone}</span>` : ''}
          ${data.sidebar?.linkedin ? `<span>LinkedIn</span>` : ''}
        </div>
      </header>

      ${data['career-profile']?.summary ? `
        <section class="mb-10">
          <div class="leading-relaxed text-lg">${data['career-profile'].summary.replace(/\n/g, '<br>')}</div>
        </section>
      ` : ''}

      ${data.experiences?.info?.length > 0 ? `
        <section class="mb-10">
          <h2 class="text-sm font-bold uppercase tracking-widest mb-6" style="color: ${theme.primary};">Experience</h2>
          <div class="space-y-8">
            ${data.experiences.info.map((exp: any) => `
              <div>
                <div class="flex justify-between items-baseline mb-2">
                  <h3 class="text-lg font-semibold">${exp.role}</h3>
                  <span class="text-sm opacity-50">${exp.time}</span>
                </div>
                <div class="font-medium mb-2" style="color: ${theme.primary};">${exp.company}</div>
                ${exp.details ? `<div class="text-sm leading-relaxed opacity-80">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <div style="border-top: 1px solid ${theme.accent}; padding-top: 2rem;" class="grid grid-cols-2 gap-8">
        ${data.education?.info?.length > 0 ? `
          <section>
            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color: ${theme.primary};">Education</h2>
            <div class="space-y-4">
              ${data.education.info.map((edu: any) => `
                <div>
                  <h3 class="font-medium">${edu.degree}</h3>
                  <div class="text-sm opacity-70">${edu.university}</div>
                  <div class="text-xs opacity-50">${edu.time}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.skills?.toolset?.length > 0 ? `
          <section>
            <h2 class="text-sm font-bold uppercase tracking-widest mb-4" style="color: ${theme.primary};">Skills</h2>
            <div class="space-y-1 text-sm">
              ${data.skills.toolset.map((skill: any) => `
                <div>${skill.name}</div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `
}

// Layout: Creative - Hero header with project grid
const renderLayoutCreative = (data: any, theme: ThemeData) => {
  const isDark = theme.category === 'dark' || theme.category === 'bold'
  return `
    <div class="cv-container layout-creative" style="font-family: Inter, system-ui, sans-serif; background-color: ${theme.bg}; color: ${theme.text}; min-height: 100%;">
      <!-- Hero Header -->
      <header style="background-color: ${theme.primary}; padding: 4rem 2rem; text-align: center; color: white;">
        ${data.sidebar?.avatar
          ? `<img class="w-32 h-32 rounded-full mx-auto mb-6 shadow-2xl border-4 border-white/30" src="${data.sidebar.avatar}" alt="Profile" />`
          : `<div class="w-32 h-32 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center">
              <svg class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>`
        }
        <h1 class="text-4xl font-black mb-2">${data.sidebar?.name || 'Your Name'}</h1>
        <p class="text-xl opacity-90 mb-6">${data.sidebar?.tagline || 'Creative Professional'}</p>
        <div class="flex justify-center gap-4 flex-wrap">
          ${data.sidebar?.website ? `<a href="${data.sidebar.website}" class="px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition">Portfolio</a>` : ''}
          ${data.sidebar?.linkedin ? `<a href="https://linkedin.com/in/${data.sidebar.linkedin}" class="px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition">LinkedIn</a>` : ''}
          ${data.sidebar?.github ? `<a href="https://github.com/${data.sidebar.github}" class="px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition">GitHub</a>` : ''}
        </div>
      </header>

      <div style="max-width: 1000px; margin: 0 auto; padding: 3rem 2rem;">
        ${data['career-profile']?.summary ? `
          <section class="text-center max-w-2xl mx-auto mb-12">
            <p class="text-lg leading-relaxed opacity-90">${data['career-profile'].summary.replace(/\n/g, '<br>')}</p>
          </section>
        ` : ''}

        ${data.skills?.toolset?.length > 0 ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center" style="color: ${theme.primary};">Skills</h2>
            <div class="flex flex-wrap justify-center gap-3">
              ${data.skills.toolset.map((skill: any) => `
                <span class="px-4 py-2 rounded-full font-medium" style="background-color: ${theme.accent}; color: ${theme.primary};">
                  ${skill.name}
                </span>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Projects Grid -->
        ${data.experiences?.info?.length > 0 ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center" style="color: ${theme.primary};">Experience</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.experiences.info.map((exp: any) => `
                <div class="p-6 rounded-2xl" style="background-color: ${theme.accent};">
                  <h3 class="text-xl font-bold mb-1">${exp.role}</h3>
                  <div class="font-medium mb-2" style="color: ${theme.primary};">${exp.company}</div>
                  <div class="text-sm opacity-60 mb-3">${exp.time}</div>
                  ${exp.details ? `<div class="text-sm opacity-80 line-clamp-3">${exp.details}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        ${data.education?.info?.length > 0 ? `
          <section>
            <h2 class="text-2xl font-bold mb-6 text-center" style="color: ${theme.primary};">Education</h2>
            <div class="flex flex-wrap justify-center gap-6">
              ${data.education.info.map((edu: any) => `
                <div class="text-center">
                  <h3 class="font-bold">${edu.degree}</h3>
                  <div class="text-sm opacity-70">${edu.university}</div>
                  <div class="text-xs opacity-50">${edu.time}</div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </div>
    </div>
  `
}

// Layout: Executive - Sophisticated design
const renderLayoutExecutive = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-executive" style="font-family: 'Georgia', serif; max-width: 900px; margin: 0 auto; background-color: ${theme.bg}; color: ${theme.text};">
      <!-- Elegant Header -->
      <header style="padding: 3rem 2rem; border-top: 4px solid ${theme.primary};">
        <div class="flex items-center gap-8">
          ${data.sidebar?.avatar
            ? `<img class="w-28 h-28 rounded-full" style="border: 3px solid ${theme.primary};" src="${data.sidebar.avatar}" alt="Profile" />`
            : ''
          }
          <div>
            <h1 class="text-4xl font-bold tracking-wide mb-2" style="color: ${theme.primary};">${data.sidebar?.name || 'Your Name'}</h1>
            <p class="text-xl italic opacity-80">${data.sidebar?.tagline || 'Executive Title'}</p>
            <div class="flex gap-6 mt-4 text-sm opacity-70">
              ${data.sidebar?.email ? `<span>✉️ ${data.sidebar.email}</span>` : ''}
              ${data.sidebar?.phone ? `<span>☎️ ${data.sidebar.phone}</span>` : ''}
            </div>
          </div>
        </div>
      </header>

      <div style="padding: 0 2rem 3rem;">
        ${data['career-profile']?.summary ? `
          <section class="mb-10 pb-8" style="border-bottom: 1px solid ${theme.accent};">
            <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Executive Summary</h2>
            <p class="text-lg leading-relaxed italic">${data['career-profile'].summary.replace(/\n/g, '<br>')}</p>
          </section>
        ` : ''}

        ${data.experiences?.info?.length > 0 ? `
          <section class="mb-10">
            <h2 class="text-xl font-bold mb-6" style="color: ${theme.primary};">Professional Experience</h2>
            <div class="space-y-8">
              ${data.experiences.info.map((exp: any) => `
                <div class="pl-6" style="border-left: 2px solid ${theme.primary};">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold">${exp.role}</h3>
                    <span class="text-sm italic opacity-60">${exp.time}</span>
                  </div>
                  <div class="font-medium mb-3" style="color: ${theme.primary};">${exp.company}</div>
                  ${exp.details ? `<div class="leading-relaxed opacity-80">${exp.details.replace(/\n/g, '<br>')}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <div class="grid grid-cols-2 gap-12">
          ${data.education?.info?.length > 0 ? `
            <section>
              <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Education</h2>
              <div class="space-y-4">
                ${data.education.info.map((edu: any) => `
                  <div>
                    <h3 class="font-semibold">${edu.degree}</h3>
                    <div class="italic opacity-70">${edu.university}</div>
                    <div class="text-sm opacity-50">${edu.time}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.skills?.toolset?.length > 0 ? `
            <section>
              <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Core Competencies</h2>
              <div class="grid grid-cols-2 gap-2">
                ${data.skills.toolset.map((skill: any) => `
                  <div class="flex items-center gap-2">
                    <span style="color: ${theme.primary};">◆</span>
                    <span>${skill.name}</span>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// Layout: Compact - Dense, multi-column
const renderLayoutCompact = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-compact" style="font-family: Inter, system-ui, sans-serif; max-width: 900px; margin: 0 auto; background-color: ${theme.bg}; color: ${theme.text}; padding: 1.5rem; font-size: 13px;">
      <!-- Compact Header -->
      <header style="background-color: ${theme.primary}; color: white; padding: 1rem 1.5rem; margin-bottom: 1.5rem; border-radius: 8px;">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            ${data.sidebar?.avatar
              ? `<img class="w-16 h-16 rounded-full" src="${data.sidebar.avatar}" alt="Profile" />`
              : ''
            }
            <div>
              <h1 class="text-2xl font-bold">${data.sidebar?.name || 'Your Name'}</h1>
              <p class="opacity-90">${data.sidebar?.tagline || 'Title'}</p>
            </div>
          </div>
          <div class="text-right text-sm opacity-80">
            ${data.sidebar?.email ? `<div>${data.sidebar.email}</div>` : ''}
            ${data.sidebar?.phone ? `<div>${data.sidebar.phone}</div>` : ''}
            ${data.sidebar?.linkedin ? `<div>linkedin.com/in/${data.sidebar.linkedin}</div>` : ''}
          </div>
        </div>
      </header>

      <!-- Dense Grid Layout -->
      <div class="grid grid-cols-3 gap-4">
        <!-- Column 1: Summary + Skills -->
        <div class="space-y-4">
          ${data['career-profile']?.summary ? `
            <section class="p-3 rounded" style="background-color: ${theme.accent};">
              <h2 class="text-sm font-bold mb-2" style="color: ${theme.primary};">Profile</h2>
              <p class="text-xs leading-relaxed">${data['career-profile'].summary.substring(0, 200)}${data['career-profile'].summary.length > 200 ? '...' : ''}</p>
            </section>
          ` : ''}

          ${data.skills?.toolset?.length > 0 ? `
            <section class="p-3 rounded" style="background-color: ${theme.accent};">
              <h2 class="text-sm font-bold mb-2" style="color: ${theme.primary};">Skills</h2>
              <div class="space-y-1.5">
                ${data.skills.toolset.map((skill: any) => `
                  <div class="flex justify-between items-center">
                    <span class="text-xs">${skill.name}</span>
                    <div class="w-16 h-1 rounded-full" style="background-color: ${theme.primary}20;">
                      <div class="h-1 rounded-full" style="background-color: ${theme.primary}; width: ${skill.level};"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>

        <!-- Column 2: Experience -->
        <div class="col-span-2">
          ${data.experiences?.info?.length > 0 ? `
            <section class="mb-4">
              <h2 class="text-sm font-bold mb-3 pb-1" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent};">Experience</h2>
              <div class="space-y-3">
                ${data.experiences.info.map((exp: any) => `
                  <div class="pb-3" style="border-bottom: 1px dashed ${theme.accent};">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="font-semibold">${exp.role}</h3>
                        <div class="text-xs" style="color: ${theme.primary};">${exp.company}</div>
                      </div>
                      <span class="text-xs opacity-60">${exp.time}</span>
                    </div>
                    ${exp.details ? `<p class="text-xs mt-1 opacity-80 line-clamp-2">${exp.details}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.education?.info?.length > 0 ? `
            <section>
              <h2 class="text-sm font-bold mb-3 pb-1" style="color: ${theme.primary}; border-bottom: 1px solid ${theme.accent};">Education</h2>
              <div class="grid grid-cols-2 gap-3">
                ${data.education.info.map((edu: any) => `
                  <div>
                    <h3 class="font-semibold text-sm">${edu.degree}</h3>
                    <div class="text-xs opacity-70">${edu.university}</div>
                    <div class="text-xs opacity-50">${edu.time}</div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// Layout: Timeline - Visual timeline for experience
const renderLayoutTimeline = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-timeline" style="font-family: Inter, system-ui, sans-serif; max-width: 900px; margin: 0 auto; background-color: ${theme.bg}; color: ${theme.text}; padding: 2rem;">
      <!-- Header -->
      <header class="text-center mb-12">
        ${data.sidebar?.avatar
          ? `<img class="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg" style="border: 4px solid ${theme.primary};" src="${data.sidebar.avatar}" alt="Profile" />`
          : ''
        }
        <h1 class="text-3xl font-bold mb-2">${data.sidebar?.name || 'Your Name'}</h1>
        <p class="text-lg opacity-80 mb-4">${data.sidebar?.tagline || 'Professional Title'}</p>
        <div class="flex justify-center gap-4 text-sm opacity-60">
          ${data.sidebar?.email ? `<span>${data.sidebar.email}</span>` : ''}
          ${data.sidebar?.phone ? `<span>${data.sidebar.phone}</span>` : ''}
        </div>
      </header>

      ${data['career-profile']?.summary ? `
        <section class="max-w-2xl mx-auto text-center mb-12 p-6 rounded-xl" style="background-color: ${theme.accent};">
          <p class="leading-relaxed">${data['career-profile'].summary.replace(/\n/g, '<br>')}</p>
        </section>
      ` : ''}

      <!-- Timeline -->
      <div class="flex">
        <!-- Timeline Line -->
        <div class="flex flex-col items-center mr-6">
          <div class="w-1 h-full rounded-full" style="background-color: ${theme.primary};"></div>
        </div>

        <div class="flex-1 space-y-8">
          ${data.experiences?.info?.length > 0 ? `
            <section>
              <h2 class="text-xl font-bold mb-6" style="color: ${theme.primary};">Experience</h2>
              <div class="space-y-6 relative">
                ${data.experiences.info.map((exp: any, i: number) => `
                  <div class="relative pl-8">
                    <!-- Timeline Dot -->
                    <div class="absolute -left-9 top-1 w-5 h-5 rounded-full border-4" style="background-color: ${theme.bg}; border-color: ${theme.primary};"></div>
                    <div class="p-4 rounded-lg" style="background-color: ${theme.accent};">
                      <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg">${exp.role}</h3>
                        <span class="text-sm px-2 py-0.5 rounded" style="background-color: ${theme.primary}; color: white;">${exp.time}</span>
                      </div>
                      <div class="font-medium mb-2" style="color: ${theme.primary};">${exp.company}</div>
                      ${exp.details ? `<p class="text-sm opacity-80">${exp.details.replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          ${data.education?.info?.length > 0 ? `
            <section>
              <h2 class="text-xl font-bold mb-6" style="color: ${theme.primary};">Education</h2>
              <div class="space-y-4">
                ${data.education.info.map((edu: any) => `
                  <div class="relative pl-8">
                    <div class="absolute -left-9 top-1 w-5 h-5 rounded-full border-4" style="background-color: ${theme.bg}; border-color: ${theme.primary};"></div>
                    <div class="p-4 rounded-lg" style="background-color: ${theme.accent};">
                      <h3 class="font-bold">${edu.degree}</h3>
                      <div class="text-sm" style="color: ${theme.primary};">${edu.university}</div>
                      <div class="text-xs opacity-60">${edu.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>

      ${data.skills?.toolset?.length > 0 ? `
        <section class="mt-12">
          <h2 class="text-xl font-bold mb-4 text-center" style="color: ${theme.primary};">Skills</h2>
          <div class="flex flex-wrap justify-center gap-3">
            ${data.skills.toolset.map((skill: any) => `
              <span class="px-4 py-2 rounded-full text-sm" style="background-color: ${theme.accent}; border: 1px solid ${theme.primary};">${skill.name}</span>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `
}

// Layout: Cards - Floating card sections
const renderLayoutCards = (data: any, theme: ThemeData) => {
  return `
    <div class="cv-container layout-cards" style="font-family: Inter, system-ui, sans-serif; max-width: 1000px; margin: 0 auto; background-color: ${theme.accent}; padding: 2rem; min-height: 100%;">
      <!-- Profile Card -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-6" style="border-left: 4px solid ${theme.primary};">
        <div class="flex items-center gap-6">
          ${data.sidebar?.avatar
            ? `<img class="w-24 h-24 rounded-xl shadow-md" src="${data.sidebar.avatar}" alt="Profile" />`
            : `<div class="w-24 h-24 rounded-xl flex items-center justify-center" style="background-color: ${theme.accent};">
                <svg class="w-12 h-12" style="color: ${theme.primary};" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>`
          }
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-1" style="color: ${theme.text};">${data.sidebar?.name || 'Your Name'}</h1>
            <p class="text-lg mb-3" style="color: ${theme.primary};">${data.sidebar?.tagline || 'Professional Title'}</p>
            <div class="flex flex-wrap gap-4 text-sm" style="color: ${theme.text}; opacity: 0.7;">
              ${data.sidebar?.email ? `<span>📧 ${data.sidebar.email}</span>` : ''}
              ${data.sidebar?.phone ? `<span>📱 ${data.sidebar.phone}</span>` : ''}
              ${data.sidebar?.linkedin ? `<span>💼 LinkedIn</span>` : ''}
            </div>
          </div>
        </div>
        ${data['career-profile']?.summary ? `
          <div class="mt-4 pt-4" style="border-top: 1px solid ${theme.accent};">
            <p class="leading-relaxed" style="color: ${theme.text};">${data['career-profile'].summary.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${data.experiences?.info?.length > 0 ? `
          <div class="bg-white rounded-2xl shadow-lg p-6" style="border-left: 4px solid ${theme.primary};">
            <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Experience</h2>
            <div class="space-y-4">
              ${data.experiences.info.map((exp: any) => `
                <div class="pb-4" style="border-bottom: 1px solid ${theme.accent};">
                  <h3 class="font-bold" style="color: ${theme.text};">${exp.role}</h3>
                  <div class="text-sm font-medium" style="color: ${theme.primary};">${exp.company}</div>
                  <div class="text-xs opacity-60 mt-1">${exp.time}</div>
                  ${exp.details ? `<p class="text-sm mt-2 opacity-80">${exp.details.substring(0, 100)}${exp.details.length > 100 ? '...' : ''}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${data.skills?.toolset?.length > 0 ? `
          <div class="bg-white rounded-2xl shadow-lg p-6" style="border-left: 4px solid ${theme.primary};">
            <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Skills</h2>
            <div class="space-y-3">
              ${data.skills.toolset.map((skill: any) => `
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="font-medium" style="color: ${theme.text};">${skill.name}</span>
                    <span class="text-sm opacity-60">${skill.level}</span>
                  </div>
                  <div class="w-full h-2 rounded-full" style="background-color: ${theme.accent};">
                    <div class="h-2 rounded-full" style="background-color: ${theme.primary}; width: ${skill.level};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${data.education?.info?.length > 0 ? `
          <div class="bg-white rounded-2xl shadow-lg p-6" style="border-left: 4px solid ${theme.primary};">
            <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Education</h2>
            <div class="space-y-4">
              ${data.education.info.map((edu: any) => `
                <div>
                  <h3 class="font-bold" style="color: ${theme.text};">${edu.degree}</h3>
                  <div class="text-sm" style="color: ${theme.primary};">${edu.university}</div>
                  <div class="text-xs opacity-60">${edu.time}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${data.sidebar?.languages?.info?.length > 0 ? `
          <div class="bg-white rounded-2xl shadow-lg p-6" style="border-left: 4px solid ${theme.primary};">
            <h2 class="text-xl font-bold mb-4" style="color: ${theme.primary};">Languages</h2>
            <div class="space-y-2">
              ${data.sidebar.languages.info.map((lang: any) => `
                <div class="flex justify-between">
                  <span class="font-medium" style="color: ${theme.text};">${lang.idiom}</span>
                  <span class="text-sm opacity-60">${lang.level}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

// Layout: Landing - Premium landing page style with spacious sections
const renderLayoutLanding = (data: any, theme: ThemeData) => {
  const gradient = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
  
  return `
    <div class="cv-container layout-landing" style="font-family: 'Inter', system-ui, sans-serif; background: linear-gradient(180deg, ${theme.bg} 0%, ${theme.accent} 100%); min-height: 100vh; color: ${theme.text};">
      
      <!-- Hero Section - Clean Professional Design -->
      <section style="min-height: 100vh; display: flex; flex-direction: column; position: relative; overflow: hidden; background: ${theme.bg};">
        
        <!-- Main Hero Content -->
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; max-width: 1400px; margin: 0 auto; width: 100%; padding: 4rem 3rem;">
          
          <!-- Left Side - Photo -->
          <div style="display: flex; align-items: center; justify-content: center; padding-right: 3rem;">
            <div style="position: relative; width: 100%; max-width: 450px;">
              <div style="aspect-ratio: 3/4; border-radius: 2rem; overflow: hidden; box-shadow: 0 30px 60px -15px ${theme.primary}50;">
                ${data.sidebar?.avatar ? `
                  <img src="${data.sidebar.avatar}" alt="${data.sidebar?.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                ` : `
                  <div style="width: 100%; height: 100%; background: ${theme.accent}; display: flex; align-items: center; justify-content: center;">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="${theme.primary}" stroke-width="1" opacity="0.4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                `}
              </div>
              <!-- Decorative accent -->
              <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: ${gradient}; border-radius: 50%; opacity: 0.3; z-index: -1;"></div>
              <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: ${theme.secondary}; border-radius: 50%; opacity: 0.2; z-index: -1;"></div>
            </div>
          </div>
          
          <!-- Right Side - Content -->
          <div style="display: flex; flex-direction: column; justify-content: center; padding-left: 2rem;">
            <p style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.15em; color: ${theme.primary}; margin-bottom: 1.5rem; font-weight: 600;">Portfolio Profesional</p>
            
            <h1 style="font-size: 3.5rem; font-weight: 700; margin-bottom: 1.5rem; color: ${theme.text}; line-height: 1.15; letter-spacing: -0.02em;">
              ${data.sidebar?.name || 'Your Name'}
            </h1>
            
            <p style="font-size: 1.25rem; color: ${theme.primary}; margin-bottom: 1.5rem; font-weight: 500; line-height: 1.5;">
              ${data.sidebar?.tagline || 'Professional Title'}
            </p>
            
            ${data.sidebar?.citizenship ? `
              <p style="color: ${theme.text}; opacity: 0.6; font-size: 1rem; margin-bottom: 2.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${data.sidebar.citizenship}
              </p>
            ` : ''}
            
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
              ${data.sidebar?.phone ? `
                <a href="https://wa.me/${data.sidebar.phone.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect" target="_blank" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: ${theme.primary}; color: white; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 15px ${theme.primary}40; transition: all 0.3s;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Contact Me
                </a>
              ` : ''}
              ${data.sidebar?.linkedin ? `
                <a href="https://linkedin.com/in/${data.sidebar.linkedin}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: transparent; color: ${theme.text}; border: 2px solid ${theme.accent}; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 1rem; transition: all 0.3s;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              ` : ''}
            </div>
            
            ${data.sidebar?.email ? `
              <p style="color: ${theme.text}; opacity: 0.6; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                ${data.sidebar.email}
              </p>
            ` : ''}
          </div>
        </div>
        
        <!-- Bottom Photo Gallery Strip - Only show if gallery images exist -->
        ${data.imageGallery?.images?.length > 0 ? `
          <div style="padding: 0 3rem 3rem; max-width: 1400px; margin: 0 auto; width: 100%;">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
              ${data.imageGallery.images.slice(0, 5).map((img: any) => `
                <div style="aspect-ratio: 1; border-radius: 1rem; overflow: hidden; box-shadow: 0 10px 30px -10px ${theme.primary}30;">
                  <img src="${img.url || img}" alt="${img.title || data.sidebar?.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </section>

      <!-- About Section -->
      ${data['career-profile']?.summary || data.career_profile?.summary ? `
        <section style="padding: 6rem 2rem; background: ${theme.bg};">
          <div style="max-width: 800px; margin: 0 auto; text-align: left;">
            <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 1.5rem; font-weight: 600;">Sobre Mí</h2>
            <div style="font-size: 1.125rem; line-height: 1.9; color: ${theme.text}; opacity: 0.9;">
              ${(data['career-profile']?.summary || data.career_profile?.summary || '').replace(/\*\*(.*?)\*\*/g, '<strong style="color: ' + theme.primary + ';">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n\n/g, '</p><p style="margin-top: 1.5rem;">').replace(/\n/g, '<br>')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Skills Section - Tags-focused display -->
      ${data.skills?.length > 0 || data.skills?.toolset?.length > 0 ? `
        <section style="padding: 6rem 2rem; background: linear-gradient(180deg, ${theme.accent} 0%, ${theme.bg} 100%);">
          <div style="max-width: 1000px; margin: 0 auto;">
            <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 3rem; text-align: center; font-weight: 600;">Skills & Expertise</h2>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              ${(data.skills?.toolset || data.skills || []).map((skill: any) => {
                // Convert level to proficiency label
                const getProficiencyLabel = (level: any) => {
                  if (typeof level === 'string' && ['expert', 'advanced', 'proficient', 'familiar'].includes(level)) {
                    return level.charAt(0).toUpperCase() + level.slice(1)
                  }
                  const num = typeof level === 'number' ? level : parseInt(String(level).replace('%', ''), 10)
                  if (isNaN(num)) return 'Proficient'
                  if (num >= 90) return 'Expert'
                  if (num >= 75) return 'Advanced'
                  if (num >= 50) return 'Proficient'
                  return 'Familiar'
                }
                const proficiency = getProficiencyLabel(skill.level)
                return `
                <div style="background: ${theme.bg}; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid ${theme.accent};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 700; color: ${theme.text}; line-height: 1.3;">${skill.name}</h3>
                    <span style="font-size: 0.7rem; padding: 0.35rem 0.75rem; background: ${gradient}; color: white; border-radius: 100px; font-weight: 600; white-space: nowrap; margin-left: 0.75rem;">${proficiency}</span>
                  </div>
                  ${skill.tags?.length > 0 ? `
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                      ${skill.tags.map((tag: string) => `
                        <span style="font-size: 0.8rem; padding: 0.4rem 0.9rem; background: ${theme.primary}12; color: ${theme.primary}; border-radius: 100px; font-weight: 500;">${tag}</span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `}).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Experience Section -->
      ${data.experiences?.length > 0 || data.experiences?.info?.length > 0 ? `
        <section style="padding: 6rem 2rem; background: ${theme.bg};">
          <div style="max-width: 900px; margin: 0 auto;">
            <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 3rem; text-align: center; font-weight: 600;">Experiencia Profesional</h2>
            
            <div style="display: flex; flex-direction: column; gap: 3rem;">
              ${(data.experiences?.info || data.experiences || []).map((exp: any, index: number) => `
                <div style="position: relative; padding-left: 3rem;">
                  <!-- Timeline Line -->
                  <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, ${theme.primary} 0%, ${theme.accent} 100%);"></div>
                  <!-- Timeline Dot -->
                  <div style="position: absolute; left: -6px; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${theme.primary}; border: 3px solid ${theme.bg};"></div>
                  
                  <div style="background: ${theme.accent}; padding: 2rem; border-radius: 1rem; border-left: 4px solid ${theme.primary};">
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1rem;">
                      <div>
                        <h3 style="font-size: 1.5rem; font-weight: 700; color: ${theme.text}; margin-bottom: 0.5rem;">${exp.role}</h3>
                        <p style="font-size: 1.125rem; color: ${theme.primary}; font-weight: 600;">${exp.company}</p>
                      </div>
                      <span style="font-size: 0.875rem; padding: 0.5rem 1rem; background: ${theme.primary}; color: white; border-radius: 100px; font-weight: 600;">${exp.time}</span>
                    </div>
                    ${exp.details ? `
                      <div style="color: ${theme.text}; opacity: 0.85; line-height: 1.8; font-size: 1rem;">
                        ${exp.details.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p style="margin-top: 1rem;">').replace(/\n/g, '<br>')}
                      </div>
                    ` : ''}
                    ${exp.tags?.length > 0 ? `
                      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem;">
                        ${exp.tags.map((tag: string) => `
                          <span style="font-size: 0.75rem; padding: 0.375rem 0.875rem; background: ${theme.bg}; color: ${theme.primary}; border-radius: 100px; border: 1px solid ${theme.primary}30;">${tag}</span>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Education Section -->
      ${data.education?.length > 0 || data.education?.info?.length > 0 ? `
        <section style="padding: 6rem 2rem; background: linear-gradient(180deg, ${theme.accent} 0%, ${theme.bg} 100%);">
          <div style="max-width: 900px; margin: 0 auto;">
            <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 3rem; text-align: center; font-weight: 600;">Formación Académica</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
              ${(data.education?.info || data.education || []).map((edu: any) => `
                <div style="background: ${theme.bg}; padding: 2rem; border-radius: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                  <div style="width: 60px; height: 60px; margin: 0 auto 1.5rem; background: ${gradient}; border-radius: 1rem; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 1.5rem;">🎓</span>
                  </div>
                  <h3 style="font-size: 1.25rem; font-weight: 700; color: ${theme.text}; margin-bottom: 0.5rem;">${edu.degree}</h3>
                  <p style="font-size: 1rem; color: ${theme.primary}; font-weight: 600; margin-bottom: 0.5rem;">${edu.university}</p>
                  <p style="font-size: 0.875rem; color: ${theme.text}; opacity: 0.6; margin-bottom: 1rem;">${edu.time}</p>
                  ${edu.details ? `
                    <p style="font-size: 0.875rem; color: ${theme.text}; opacity: 0.8; line-height: 1.6;">
                      ${edu.details.replace(/\*\*(.*?)\*\*/g, '<strong style="color: ' + theme.primary + ';">$1</strong>').replace(/\n/g, '<br>')}
                    </p>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Certifications Section -->
      ${data.certifications?.length > 0 || data.certifications?.list?.length > 0 ? `
        <section style="padding: 6rem 2rem; background: ${theme.bg};">
          <div style="max-width: 900px; margin: 0 auto;">
            <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 3rem; text-align: center; font-weight: 600;">Certificaciones y Capacitaciones</h2>
            
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${(data.certifications?.list || data.certifications || []).map((cert: any) => `
                <div style="display: flex; align-items: flex-start; gap: 1.5rem; padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem;">
                  <div style="width: 50px; height: 50px; background: ${gradient}; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span style="font-size: 1.25rem;">🏆</span>
                  </div>
                  <div style="flex: 1;">
                    <h3 style="font-size: 1.125rem; font-weight: 700; color: ${theme.text}; margin-bottom: 0.25rem;">${cert.name}</h3>
                    <p style="font-size: 0.875rem; color: ${theme.primary}; font-weight: 600;">${cert.organization}</p>
                    ${cert.start ? `<p style="font-size: 0.75rem; color: ${theme.text}; opacity: 0.6; margin-top: 0.5rem;">${cert.start}</p>` : ''}
                    ${cert.details ? `<p style="font-size: 0.875rem; color: ${theme.text}; opacity: 0.8; margin-top: 0.75rem; line-height: 1.6;">${cert.details.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Languages & Interests -->
      <section style="padding: 6rem 2rem; background: linear-gradient(180deg, ${theme.accent} 0%, ${theme.bg} 100%);">
        <div style="max-width: 900px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
            
            ${data.sidebar?.languages?.length > 0 ? `
              <div>
                <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 2rem; font-weight: 600;">Idiomas</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  ${data.sidebar.languages.map((lang: any) => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: ${theme.bg}; border-radius: 1rem;">
                      <span style="font-weight: 600; color: ${theme.text};">🌍 ${lang.idiom}</span>
                      <span style="font-size: 0.875rem; padding: 0.375rem 1rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; font-weight: 600;">${lang.level}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${data.interests?.length > 0 ? `
              <div>
                <h2 style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.2em; color: ${theme.primary}; margin-bottom: 2rem; font-weight: 600;">Intereses</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                  ${data.interests.map((interest: string) => `
                    <span style="padding: 0.75rem 1.25rem; background: ${theme.bg}; color: ${theme.text}; border-radius: 100px; font-size: 0.875rem; border: 1px solid ${theme.primary}30;">
                      ${interest}
                    </span>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </section>

      <!-- Footer CTA -->
      <section style="padding: 6rem 2rem; background: ${gradient}; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; font-weight: 800; color: white; margin-bottom: 1rem;">Let's Connect!</h2>
          <p style="font-size: 1.125rem; color: white; opacity: 0.9; margin-bottom: 2rem;">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          ${data.sidebar?.phone ? `
            <a href="https://wa.me/${data.sidebar.phone.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20saw%20your%20portfolio" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; background: white; color: ${theme.primary}; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 1.125rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              Send me a message
            </a>
          ` : data.sidebar?.email ? `
            <a href="mailto:${data.sidebar.email}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2.5rem; background: white; color: ${theme.primary}; border-radius: 100px; text-decoration: none; font-weight: 700; font-size: 1.125rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
              Send me an email
            </a>
          ` : ''}
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 2rem; background: ${theme.bg}; text-align: center; border-top: 1px solid ${theme.accent};">
        <p style="font-size: 0.875rem; color: ${theme.text}; opacity: 0.6;">
          ${data.footer || `© ${new Date().getFullYear()} ${data.sidebar?.name || 'Portfolio'}. All rights reserved.`}
        </p>
      </footer>
    </div>
  `
}

// =============================================================================
// Layout: Hero Centered - Victoria Rolon Style (Modern centered hero with full sections)
// =============================================================================
const renderLayoutHeroCentered = (data: any, theme: ThemeData) => {
  // Use normalizer helpers for data consistency
  const experiences = normalizeExperiences(data)
  const education = normalizeEducation(data)
  const skills = normalizeSkills(data)
  const projects = normalizeProjects(data)
  const certifications = normalizeCertifications(data)
  const interests = normalizeInterests(data)
  const languages = normalizeLanguages(data)
  const careerSummary = getCareerSummary(data)
  const volunteer = data.volunteer || []
  
  return `
    <div class="cv-container layout-hero-centered" style="font-family: 'Inter', system-ui, sans-serif; background-color: ${theme.bg}; color: ${theme.text}; min-height: 100%;">
      
      <!-- Hero Section - Centered Design -->
      <header style="text-align: center; padding: 4rem 2rem; background: linear-gradient(180deg, ${theme.accent} 0%, ${theme.bg} 100%); position: relative; overflow: hidden;">
        <!-- Decorative circles -->
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: ${theme.primary}; opacity: 0.08; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: ${theme.secondary}; opacity: 0.08; border-radius: 50%;"></div>
        
        <!-- Avatar -->
        <div style="position: relative; display: inline-block; margin-bottom: 1.5rem;">
          ${data.sidebar?.avatar 
            ? `<img src="${data.sidebar.avatar}" alt="${data.sidebar?.name}" style="width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid ${theme.primary}; box-shadow: 0 10px 40px ${theme.primary}30;" />`
            : `<div style="width: 140px; height: 140px; border-radius: 50%; background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); display: flex; align-items: center; justify-content: center; color: white; font-size: 3.5rem; font-weight: 700; box-shadow: 0 10px 40px ${theme.primary}30;">
                ${(data.sidebar?.name || 'U').charAt(0).toUpperCase()}
              </div>`
          }
          <!-- Verified badge -->
          <div style="position: absolute; bottom: 5px; right: 5px; width: 36px; height: 36px; background: ${theme.primary}; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid ${theme.bg};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
        </div>
        
        <!-- Name & Tagline -->
        <h1 style="font-size: 2.75rem; font-weight: 800; color: ${theme.text}; margin-bottom: 0.75rem; letter-spacing: -0.02em;">
          ${data.sidebar?.name || 'Your Name'}
        </h1>
        <p style="font-size: 1.25rem; color: ${theme.primary}; margin-bottom: 2rem; font-weight: 500;">
          ${data.sidebar?.tagline || 'Professional Title'}
        </p>
        
        <!-- Contact Pills -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-bottom: 2rem;">
          ${data.sidebar?.email ? `
            <a href="mailto:${data.sidebar.email}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Email
            </a>
          ` : ''}
          ${data.sidebar?.phone ? `
            <a href="tel:${data.sidebar.phone}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; text-decoration: none; font-size: 0.875rem; font-weight: 500;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Call
            </a>
          ` : ''}
          ${data.sidebar?.citizenship || data.sidebar?.location ? `
            <span style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: ${theme.accent}; color: ${theme.text}80; border-radius: 100px; font-size: 0.875rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${data.sidebar.location || data.sidebar.citizenship}
            </span>
          ` : ''}
          ${data.sidebar?.linkedin ? `
            <a href="https://linkedin.com/in/${data.sidebar.linkedin}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; text-decoration: none; font-size: 0.875rem; font-weight: 500;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          ` : ''}
        </div>
        
        <!-- CTA Buttons -->
        <div style="display: flex; justify-content: center; gap: 1rem;">
          ${data.sidebar?.email ? `
            <a href="mailto:${data.sidebar.email}" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.75rem; background: ${theme.primary}; color: white; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 0.95rem; box-shadow: 0 4px 15px ${theme.primary}40;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Contact Me
            </a>
          ` : ''}
        </div>
      </header>
      
      <!-- Main Content -->
      <main style="max-width: 1000px; margin: 0 auto; padding: 3rem 2rem;">
        
        <!-- About Section -->
        ${careerSummary ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              About Me
            </h2>
            <div style="line-height: 1.8; color: ${theme.text}; font-size: 1rem;">
              ${renderMarkdownBold(careerSummary).replace(/\n/g, '<br>')}
            </div>
          </section>
        ` : ''}
        
        <!-- Experience Section -->
        ${experiences.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              Experience
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${experiences.map((exp: any) => `
                <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem; border-left: 4px solid ${theme.primary};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.text}; margin: 0;">${exp.role}</h3>
                    <span style="font-size: 0.8rem; color: ${theme.primary}; background: ${theme.primary}15; padding: 0.25rem 0.75rem; border-radius: 100px; font-weight: 500;">${exp.time}</span>
                  </div>
                  <p style="font-size: 0.95rem; color: ${theme.primary}; margin-bottom: 0.75rem; font-weight: 500;">${exp.company}</p>
                  <div style="font-size: 0.9rem; color: ${theme.text}; opacity: 0.85; line-height: 1.7;">
                    ${renderMarkdownBold(exp.details || '').replace(/\n/g, '<br>')}
                  </div>
                  ${exp.tags && exp.tags.length > 0 ? `
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                      ${exp.tags.map((tag: string) => `
                        <span style="padding: 0.25rem 0.75rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; font-size: 0.75rem; font-weight: 500;">
                          ${tag}
                        </span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Education Section -->
        ${education.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              Education
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              ${education.map((edu: any) => `
                <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.text}; margin: 0;">${edu.degree}</h3>
                    <span style="font-size: 0.8rem; color: ${theme.text}; opacity: 0.6;">${edu.time}</span>
                  </div>
                  <p style="font-size: 0.95rem; color: ${theme.primary}; margin-bottom: 0.5rem; font-weight: 500;">${edu.university}</p>
                  ${edu.details ? `
                    <div style="font-size: 0.9rem; color: ${theme.text}; opacity: 0.85; line-height: 1.7;">
                      ${renderMarkdownBold(edu.details).replace(/\n/g, '<br>')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Skills Section with Progress Bars -->
        ${skills.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              Skills
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${skills.map((skill: any) => {
                const level = normalizeSkillLevel(skill.level)
                return `
                  <div style="padding: 1.25rem; background: ${theme.accent}; border-radius: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span style="font-weight: 600; color: ${theme.text};">${skill.name}</span>
                      <span style="font-size: 0.875rem; color: ${theme.primary}; font-weight: 500;">${level}%</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: ${theme.primary}20; border-radius: 100px; overflow: hidden;">
                      <div style="width: ${level}%; height: 100%; background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary}); border-radius: 100px;"></div>
                    </div>
                    ${skill.tags && skill.tags.length > 0 ? `
                      <div style="display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.75rem;">
                        ${skill.tags.slice(0, 5).map((tag: string) => `
                          <span style="padding: 0.125rem 0.5rem; background: ${theme.primary}10; color: ${theme.primary}; border-radius: 4px; font-size: 0.7rem;">
                            ${tag}
                          </span>
                        `).join('')}
                      </div>
                    ` : ''}
                  </div>
                `
              }).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Projects Section -->
        ${projects.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              Projects
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${projects.map((proj: any) => `
                <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.text}; margin: 0;">${proj.title}</h3>
                    ${proj.time ? `<span style="font-size: 0.8rem; color: ${theme.text}; opacity: 0.6;">${proj.time}</span>` : ''}
                  </div>
                  <div style="font-size: 0.9rem; color: ${theme.text}; opacity: 0.85; line-height: 1.7;">
                    ${renderMarkdownBold(proj.details || '').replace(/\n/g, '<br>')}
                  </div>
                  ${proj.link ? `
                    <a href="${proj.link}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.25rem; margin-top: 0.75rem; color: ${theme.primary}; font-size: 0.875rem; text-decoration: none; font-weight: 500;">
                      View Project
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Certifications Section -->
        ${certifications.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              Certifications
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
              ${certifications.map((cert: any) => `
                <div style="padding: 1.25rem; background: ${theme.accent}; border-radius: 1rem;">
                  <h3 style="font-size: 1rem; font-weight: 600; color: ${theme.text}; margin-bottom: 0.25rem;">${cert.name}</h3>
                  <p style="font-size: 0.875rem; color: ${theme.primary}; margin-bottom: 0.25rem;">${cert.organization}</p>
                  <p style="font-size: 0.8rem; color: ${theme.text}; opacity: 0.6;">${cert.start}</p>
                  ${cert.details ? `
                    <div style="font-size: 0.85rem; color: ${theme.text}; opacity: 0.8; margin-top: 0.5rem; line-height: 1.6;">
                      ${renderMarkdownBold(cert.details).replace(/\n/g, '<br>')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Volunteer Section -->
        ${volunteer.length > 0 ? `
          <section style="margin-bottom: 3rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Volunteer Experience
            </h2>
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${volunteer.map((vol: any) => `
                <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem; border-left: 4px solid ${theme.secondary};">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.text}; margin: 0;">${vol.role}</h3>
                    <span style="font-size: 0.8rem; color: ${theme.text}; opacity: 0.6;">${vol.time}</span>
                  </div>
                  <p style="font-size: 0.95rem; color: ${theme.secondary}; margin-bottom: 0.75rem; font-weight: 500;">${vol.company}</p>
                  <div style="font-size: 0.9rem; color: ${theme.text}; opacity: 0.85; line-height: 1.7;">
                    ${renderMarkdownBold(vol.details || '').replace(/\n/g, '<br>')}
                  </div>
                  ${vol.tags && vol.tags.length > 0 ? `
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                      ${vol.tags.map((tag: string) => `
                        <span style="padding: 0.25rem 0.75rem; background: ${theme.secondary}15; color: ${theme.secondary}; border-radius: 100px; font-size: 0.75rem; font-weight: 500;">
                          ${tag}
                        </span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        
        <!-- Sidebar Info - Languages & Interests -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <!-- Languages -->
          ${languages.length > 0 ? `
            <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem;">
              <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                Languages
              </h3>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${languages.map((lang: { idiom: string; level: string }) => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: ${theme.text};">${lang.idiom}</span>
                    <span style="padding: 0.25rem 0.75rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; font-size: 0.75rem; font-weight: 500;">
                      ${lang.level}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <!-- Interests -->
          ${interests.length > 0 ? `
            <div style="padding: 1.5rem; background: ${theme.accent}; border-radius: 1rem;">
              <h3 style="font-size: 1.125rem; font-weight: 600; color: ${theme.primary}; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Interests
              </h3>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${interests.map((interest: string) => `
                  <span style="padding: 0.375rem 0.875rem; background: ${theme.primary}15; color: ${theme.primary}; border-radius: 100px; font-size: 0.8rem; font-weight: 500;">
                    ${interest}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </main>
      
      <!-- Footer -->
      <footer style="padding: 2rem; background: ${theme.accent}; text-align: center; border-top: 1px solid ${theme.primary}15;">
        <p style="font-size: 0.875rem; color: ${theme.text}; opacity: 0.7;">
          ${data.footer || `© ${new Date().getFullYear()} ${data.sidebar?.name || 'Portfolio'}. All rights reserved.`}
        </p>
      </footer>
    </div>
  `
}

// Router function to select layout renderer
const renderByLayout = (data: any, theme: ThemeData, layoutId: string): string => {
  switch (layoutId) {
    case 'classic':
      return renderLayoutClassic(data, theme)
    case 'modern':
      return renderLayoutModern(data, theme)
    case 'minimal':
      return renderLayoutMinimal(data, theme)
    case 'creative':
      return renderLayoutCreative(data, theme)
    case 'executive':
      return renderLayoutExecutive(data, theme)
    case 'compact':
      return renderLayoutCompact(data, theme)
    case 'timeline':
      return renderLayoutTimeline(data, theme)
    case 'cards':
      return renderLayoutCards(data, theme)
    case 'landing':
      return renderLayoutLanding(data, theme)
    // New Victoria Rolon style layouts
    case 'hero-centered':
      return renderLayoutHeroCentered(data, theme)
    default:
      return renderLayoutClassic(data, theme)
  }
}

// =============================================================================
// MAIN PREVIEW COMPONENT
// =============================================================================
function CVPreviewComponent({ data, theme, templateLayout, scale = 1, className = '' }: CVPreviewProps) {
  const themeData = useMemo(() => getThemeData(theme), [theme])

  // Memoize preview HTML generation - prioritize templateLayout over theme category
  const previewHtml = useMemo(() => {
    // If templateLayout is explicitly provided, use the layout-specific renderer
    if (templateLayout) {
      return renderByLayout(data, themeData, templateLayout)
    }

    // Legacy fallback: use theme category-based rendering
    const category = themeData.category

    // Dark themes (including tech themes)
    if (category === 'dark' || category === 'tech' || category === 'videography') {
      return renderDarkTheme(data, themeData, theme)
    }

    // Gradient themes
    if (category === 'gradient') {
      return renderGradientTheme(data, themeData)
    }

    // Executive themes
    if (category === 'executive') {
      return renderExecutiveTheme(data, themeData)
    }

    // Default: Classic light themes (professional, creative, minimal)
    return renderClassicTheme(data, themeData)
  }, [data, theme, themeData, templateLayout])

  // Memoize empty state check - supports both new and legacy formats
  const isEmpty = useMemo(() => {
    const summary = getCareerSummary(data)
    const experiences = normalizeExperiences(data)
    return !data.sidebar?.name && !summary && experiences.length === 0
  }, [data])

  // Memoize container styles
  const containerStyle = useMemo(() => ({
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'top left',
  }), [scale])

  return (
    <div className={`cv-preview-container ${className}`} style={containerStyle}>
      <style jsx>{`
        .cv-preview-container {
          font-size: 14px;
          line-height: 1.4;
          overflow: hidden;
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
        /* Fix overlapping sections */
        .cv-preview-container :global(.cv-container) {
          padding: 1rem;
        }
        .cv-preview-container :global(.grid) {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 1024px) {
          .cv-preview-container :global(.grid) {
            display: grid;
            grid-template-columns: 1fr 2fr;
          }
        }
        .cv-preview-container :global(.sidebar-wrapper) {
          position: relative;
          z-index: 1;
        }
        .cv-preview-container :global(.main-wrapper) {
          position: relative;
          z-index: 1;
        }
        .cv-preview-container :global(section) {
          margin-bottom: 1.5rem;
          overflow: hidden;
        }
        .cv-preview-container :global(.experience-item),
        .cv-preview-container :global(.education-item),
        .cv-preview-container :global(.project-item) {
          overflow: hidden;
          word-wrap: break-word;
        }
      `}</style>

      {isEmpty ? (
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

// Export memoized component to prevent unnecessary re-renders
export const CVPreview = memo(CVPreviewComponent)
