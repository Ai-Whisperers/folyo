'use client'

import { useMemo, memo } from 'react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { getThemeColors, isDarkTheme as isDarkThemeUtil, type ThemeColors } from '@/lib/utils/theme'

interface CVPreviewProps {
  data: any
  theme: string
  scale?: number
  className?: string
}

// Type alias for backward compatibility
type ThemeData = ThemeColors & { gradient?: string }

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
// MAIN PREVIEW COMPONENT
// =============================================================================
function CVPreviewComponent({ data, theme, scale = 1, className = '' }: CVPreviewProps) {
  const themeData = useMemo(() => getThemeData(theme), [theme])

  // Memoize preview HTML generation based on theme category
  const previewHtml = useMemo(() => {
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
  }, [data, theme, themeData])

  // Memoize empty state check
  const isEmpty = useMemo(() => {
    return !data.sidebar?.name && !data['career-profile']?.summary && !data.experiences?.info?.length
  }, [data.sidebar?.name, data['career-profile']?.summary, data.experiences?.info?.length])

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
