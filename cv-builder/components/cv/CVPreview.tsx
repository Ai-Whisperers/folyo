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

type ThemeData = ThemeColors & { gradient?: string; label?: string }

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

// =============================================================================
// DATA NORMALIZATION HELPERS
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

const normalizeVolunteer = (data: any): any[] => {
  if (Array.isArray(data.volunteer)) return data.volunteer
  return data.volunteer?.info || []
}

const getCareerSummary = (data: any): string => {
  return data.career_profile?.summary || data['career-profile']?.summary || ''
}

// Generate a lighter shade of a color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1)
}

// =============================================================================
// BEAUTIFUL RESPONSIVE TEMPLATE
// =============================================================================
const renderResponsiveTemplate = (data: any, theme: ThemeData): string => {
  const experiences = normalizeExperiences(data)
  const education = normalizeEducation(data)
  const skills = normalizeSkills(data)
  const certifications = normalizeCertifications(data)
  const projects = normalizeProjects(data)
  const interests = normalizeInterests(data)
  const languages = normalizeLanguages(data)
  const volunteer = normalizeVolunteer(data)
  const careerSummary = getCareerSummary(data)
  
  const isDark = theme.isDark
  const primaryLight = lightenColor(theme.primary, 40)

  return `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      .cv-modern {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: ${isDark ? `linear-gradient(135deg, ${theme.bg} 0%, #1a1a2e 100%)` : `linear-gradient(180deg, #fafbfc 0%, #f0f2f5 100%)`};
        color: ${theme.text};
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.7;
        min-height: 100%;
      }
      
      .cv-modern * {
        box-sizing: border-box;
      }
      
      /* ===== HEADER SECTION ===== */
      .cv-header {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${isDark ? lightenColor(theme.primary, -20) : theme.secondary || lightenColor(theme.primary, 15)} 100%);
        color: white;
        padding: 2.5rem 2rem;
        position: relative;
        overflow: hidden;
      }
      
      .cv-header::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: 60%;
        height: 200%;
        background: radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%);
        pointer-events: none;
      }
      
      .cv-header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3));
      }
      
      .cv-header-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1.25rem;
        position: relative;
        z-index: 1;
      }
      
      @media (min-width: 640px) {
        .cv-header-content {
          flex-direction: row;
          text-align: left;
          align-items: center;
          gap: 2rem;
        }
      }
      
      .cv-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid rgba(255,255,255,0.9);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        flex-shrink: 0;
      }
      
      .cv-avatar-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 3px solid rgba(255,255,255,0.2);
      }
      
      .cv-name {
        font-size: 2rem;
        font-weight: 800;
        margin: 0 0 0.375rem 0;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .cv-tagline {
        font-size: 1.125rem;
        opacity: 0.95;
        margin: 0 0 1rem 0;
        font-weight: 400;
        letter-spacing: 0.01em;
      }
      
      .cv-contact-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.625rem 1.25rem;
        font-size: 0.875rem;
        justify-content: center;
      }
      
      @media (min-width: 640px) {
        .cv-contact-row {
          justify-content: flex-start;
        }
      }
      
      .cv-contact-item {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(255,255,255,0.15);
        backdrop-filter: blur(10px);
        padding: 0.375rem 0.875rem;
        border-radius: 50px;
        font-weight: 500;
        transition: all 0.2s ease;
      }
      
      .cv-contact-item:hover {
        background: rgba(255,255,255,0.25);
      }
      
      /* ===== MAIN CONTENT ===== */
      .cv-main {
        padding: 2rem 1.5rem;
      }
      
      @media (min-width: 640px) {
        .cv-main {
          padding: 2.5rem 2rem;
        }
      }
      
      /* Two Column Layout */
      .cv-content-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      
      @media (min-width: 768px) {
        .cv-content-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 3rem;
        }
      }
      
      /* ===== SECTIONS ===== */
      .cv-section {
        margin-bottom: 2rem;
      }
      
      .cv-section-title {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: ${theme.primary};
        margin: 0 0 1.25rem 0;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : theme.primary + '20'};
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      
      .cv-section-title::before {
        content: '';
        width: 4px;
        height: 1.25rem;
        background: ${theme.primary};
        border-radius: 2px;
      }
      
      /* ===== ABOUT CARD ===== */
      .cv-about-card {
        background: ${isDark ? 'rgba(255,255,255,0.03)' : 'white'};
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: ${isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.04)'};
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
      }
      
      .cv-about-text {
        font-size: 0.9375rem;
        color: ${isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)'};
        line-height: 1.8;
        white-space: pre-line;
      }
      
      /* ===== EXPERIENCE & EDUCATION ITEMS ===== */
      .cv-item {
        position: relative;
        padding: 1.25rem;
        margin-bottom: 1rem;
        background: ${isDark ? 'rgba(255,255,255,0.02)' : 'white'};
        border-radius: 12px;
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        box-shadow: ${isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.03)'};
        transition: all 0.2s ease;
      }
      
      .cv-item:hover {
        border-color: ${theme.primary}30;
        box-shadow: ${isDark ? `0 4px 20px ${theme.primary}10` : `0 8px 30px ${theme.primary}12`};
      }
      
      .cv-item:last-child {
        margin-bottom: 0;
      }
      
      .cv-item-header {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        margin-bottom: 0.75rem;
      }
      
      @media (min-width: 480px) {
        .cv-item-header {
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
        }
      }
      
      .cv-item-title {
        font-size: 1rem;
        font-weight: 700;
        margin: 0;
        color: ${theme.text};
      }
      
      .cv-item-date {
        font-size: 0.75rem;
        font-weight: 600;
        color: ${theme.primary};
        background: ${theme.primary}15;
        padding: 0.25rem 0.75rem;
        border-radius: 50px;
        white-space: nowrap;
      }
      
      .cv-item-subtitle {
        font-size: 0.9375rem;
        color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
        font-weight: 500;
        margin: 0 0 0.625rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .cv-item-subtitle::before {
        content: '◆';
        font-size: 0.5rem;
        color: ${theme.primary};
      }
      
      .cv-item-details {
        font-size: 0.875rem;
        color: ${isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)'};
        white-space: pre-line;
        line-height: 1.7;
      }
      
      /* ===== TAGS ===== */
      .cv-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.875rem;
      }
      
      .cv-tag {
        font-size: 0.6875rem;
        font-weight: 600;
        background: linear-gradient(135deg, ${theme.primary}15, ${theme.primary}08);
        color: ${theme.primary};
        padding: 0.3125rem 0.75rem;
        border-radius: 50px;
        border: 1px solid ${theme.primary}20;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      
      /* ===== SKILLS ===== */
      .cv-skills-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .cv-skill-item {
        background: ${isDark ? 'rgba(255,255,255,0.02)' : 'white'};
        padding: 0.875rem 1rem;
        border-radius: 10px;
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
      }
      
      .cv-skill-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      
      .cv-skill-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: ${theme.text};
      }
      
      .cv-skill-percent {
        font-size: 0.75rem;
        font-weight: 700;
        color: ${theme.primary};
      }
      
      .cv-skill-bar {
        height: 6px;
        background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
        border-radius: 3px;
        overflow: hidden;
      }
      
      .cv-skill-fill {
        height: 100%;
        background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary || lightenColor(theme.primary, 20)});
        border-radius: 3px;
        transition: width 0.5s ease;
      }
      
      /* ===== LANGUAGES ===== */
      .cv-languages-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .cv-lang-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.625rem 0.875rem;
        background: ${isDark ? 'rgba(255,255,255,0.02)' : 'white'};
        border-radius: 8px;
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        font-size: 0.875rem;
      }
      
      .cv-lang-name {
        font-weight: 600;
      }
      
      .cv-lang-level {
        color: ${isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
        font-size: 0.8125rem;
      }
      
      /* ===== INTERESTS ===== */
      .cv-interests {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .cv-interest {
        font-size: 0.8125rem;
        font-weight: 500;
        background: linear-gradient(135deg, ${theme.primary}12, ${theme.primary}05);
        color: ${isDark ? 'rgba(255,255,255,0.9)' : theme.text};
        padding: 0.5rem 1rem;
        border-radius: 50px;
        border: 1px solid ${theme.primary}20;
        transition: all 0.2s ease;
      }
      
      .cv-interest:hover {
        background: ${theme.primary}20;
        border-color: ${theme.primary}40;
      }
      
      /* ===== PROJECTS ===== */
      .cv-project-link {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        color: ${theme.primary};
        font-size: 0.8125rem;
        font-weight: 600;
        text-decoration: none;
        margin-top: 0.75rem;
        padding: 0.375rem 0;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      
      .cv-project-link:hover {
        border-bottom-color: ${theme.primary};
      }
      
      /* ===== CERTIFICATIONS ===== */
      .cv-cert-item {
        padding: 0.875rem 1rem;
        background: ${isDark ? 'rgba(255,255,255,0.02)' : 'white'};
        border-radius: 10px;
        border: 1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
        margin-bottom: 0.75rem;
      }
      
      .cv-cert-item:last-child {
        margin-bottom: 0;
      }
      
      .cv-cert-name {
        font-size: 0.875rem;
        font-weight: 700;
        color: ${theme.text};
        margin: 0 0 0.25rem 0;
      }
      
      .cv-cert-org {
        font-size: 0.8125rem;
        color: ${theme.primary};
        font-weight: 500;
      }
      
      .cv-cert-date {
        font-size: 0.75rem;
        color: ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
        margin-top: 0.25rem;
      }
      
      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-modern {
          max-width: 100%;
          font-size: 10pt;
          background: white !important;
        }
        .cv-header {
          padding: 1.5rem;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cv-main {
          padding: 1.5rem;
        }
        .cv-content-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 2rem;
        }
        .cv-section {
          page-break-inside: avoid;
        }
        .cv-item, .cv-about-card, .cv-skill-item, .cv-lang-item, .cv-cert-item {
          box-shadow: none;
          border: 1px solid #eee;
        }
      }
    </style>
    
    <div class="cv-modern">
      <!-- Header -->
      <header class="cv-header">
        <div class="cv-header-content">
          ${data.sidebar?.avatar
            ? `<img class="cv-avatar" src="${data.sidebar.avatar}" alt="${data.sidebar?.name || 'Profile'}" />`
            : `<div class="cv-avatar-placeholder">
                <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24" opacity="0.8">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>`
          }
          <div>
            <h1 class="cv-name">${data.sidebar?.name || 'Your Name'}</h1>
            <p class="cv-tagline">${data.sidebar?.tagline || 'Professional Title'}</p>
            <div class="cv-contact-row">
              ${data.sidebar?.email ? `<span class="cv-contact-item">✉️ ${data.sidebar.email}</span>` : ''}
              ${data.sidebar?.phone ? `<span class="cv-contact-item">📱 ${data.sidebar.phone}</span>` : ''}
              ${data.sidebar?.website ? `<span class="cv-contact-item">🌐 ${data.sidebar.website}</span>` : ''}
              ${data.sidebar?.linkedin ? `<span class="cv-contact-item">💼 ${data.sidebar.linkedin}</span>` : ''}
              ${data.sidebar?.github ? `<span class="cv-contact-item">⌨️ ${data.sidebar.github}</span>` : ''}
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="cv-main">
        <!-- About Section -->
        ${careerSummary ? `
          <div class="cv-about-card">
            <h2 class="cv-section-title">About Me</h2>
            <p class="cv-about-text">${careerSummary}</p>
          </div>
        ` : ''}
        
        <div class="cv-content-grid">
          <!-- Left Column -->
          <div class="cv-main-column">
            <!-- Experience -->
            ${experiences.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Experience</h2>
                ${experiences.map((exp: any) => `
                  <div class="cv-item">
                    <div class="cv-item-header">
                      <h3 class="cv-item-title">${exp.role || exp.title || ''}</h3>
                      <span class="cv-item-date">${exp.time || ''}</span>
                    </div>
                    <p class="cv-item-subtitle">${exp.company || ''}</p>
                    ${exp.details ? `<p class="cv-item-details">${exp.details}</p>` : ''}
                    ${exp.tags?.length ? `
                      <div class="cv-tags">
                        ${exp.tags.map((tag: string) => `<span class="cv-tag">${tag}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}
            
            <!-- Projects -->
            ${projects.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Projects</h2>
                ${projects.map((proj: any) => `
                  <div class="cv-item">
                    <div class="cv-item-header">
                      <h3 class="cv-item-title">${proj.title || ''}</h3>
                      ${proj.time ? `<span class="cv-item-date">${proj.time}</span>` : ''}
                    </div>
                    ${proj.details ? `<p class="cv-item-details">${proj.details}</p>` : ''}
                    ${proj.link ? `<a class="cv-project-link" href="${proj.link}" target="_blank">View Project →</a>` : ''}
                    ${proj.tags?.length ? `
                      <div class="cv-tags">
                        ${proj.tags.map((tag: string) => `<span class="cv-tag">${tag}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}
            
            <!-- Volunteer -->
            ${volunteer.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Volunteer</h2>
                ${volunteer.map((vol: any) => `
                  <div class="cv-item">
                    <div class="cv-item-header">
                      <h3 class="cv-item-title">${vol.role || ''}</h3>
                      <span class="cv-item-date">${vol.time || ''}</span>
                    </div>
                    <p class="cv-item-subtitle">${vol.company || vol.organization || ''}</p>
                    ${vol.details ? `<p class="cv-item-details">${vol.details}</p>` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </div>
          
          <!-- Right Column -->
          <div class="cv-sidebar-column">
            <!-- Education -->
            ${education.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Education</h2>
                ${education.map((edu: any) => `
                  <div class="cv-item">
                    <h3 class="cv-item-title">${edu.degree || ''}</h3>
                    <p class="cv-item-subtitle">${edu.university || ''}</p>
                    <span class="cv-item-date">${edu.time || ''}</span>
                    ${edu.details ? `<p class="cv-item-details" style="margin-top: 0.5rem;">${edu.details}</p>` : ''}
                  </div>
                `).join('')}
              </section>
            ` : ''}
            
            <!-- Skills -->
            ${skills.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Skills</h2>
                <div class="cv-skills-list">
                  ${skills.map((skill: any) => {
                    const level = typeof skill.level === 'number' ? skill.level : 
                      (skill.level === 'expert' ? 95 : 
                       skill.level === 'advanced' ? 85 : 
                       skill.level === 'proficient' ? 70 : 55)
                    return `
                      <div class="cv-skill-item">
                        <div class="cv-skill-header">
                          <span class="cv-skill-name">${skill.name || ''}</span>
                          <span class="cv-skill-percent">${level}%</span>
                        </div>
                        <div class="cv-skill-bar">
                          <div class="cv-skill-fill" style="width: ${level}%"></div>
                        </div>
                      </div>
                    `
                  }).join('')}
                </div>
              </section>
            ` : ''}
            
            <!-- Certifications -->
            ${certifications.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Certifications</h2>
                ${certifications.map((cert: any) => `
                  <div class="cv-cert-item">
                    <h3 class="cv-cert-name">${cert.name || ''}</h3>
                    <p class="cv-cert-org">${cert.organization || ''}</p>
                    <p class="cv-cert-date">${cert.start || ''}${cert.end ? ` - ${cert.end}` : ''}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}
            
            <!-- Languages -->
            ${languages.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Languages</h2>
                <div class="cv-languages-list">
                  ${languages.map((lang: any) => `
                    <div class="cv-lang-item">
                      <span class="cv-lang-name">${lang.idiom}</span>
                      <span class="cv-lang-level">${lang.level}</span>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
            
            <!-- Interests -->
            ${interests.length > 0 ? `
              <section class="cv-section">
                <h2 class="cv-section-title">Interests</h2>
                <div class="cv-interests">
                  ${interests.map((interest: string) => `
                    <span class="cv-interest">${interest}</span>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>
        </div>
      </main>
    </div>
  `
}

// =============================================================================
// MAIN PREVIEW COMPONENT
// =============================================================================
function CVPreviewComponent({ data, theme, scale = 1, className = '' }: CVPreviewProps) {
  const themeData = useMemo(() => getThemeData(theme), [theme])

  const previewHtml = useMemo(() => {
    return renderResponsiveTemplate(data, themeData)
  }, [data, themeData])

  const isEmpty = useMemo(() => {
    const summary = getCareerSummary(data)
    const experiences = normalizeExperiences(data)
    return !data.sidebar?.name && !summary && experiences.length === 0
  }, [data])

  const containerStyle = useMemo(() => ({
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: 'top left',
  }), [scale])

  return (
    <div className={`cv-preview-container ${className}`} style={containerStyle}>
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

export const CVPreview = memo(CVPreviewComponent)
