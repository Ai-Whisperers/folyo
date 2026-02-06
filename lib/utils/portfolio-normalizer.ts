/**
 * Portfolio Normalizer
 * 
 * Converts any portfolio format (legacy YAML/nested or v2 flat) to the canonical PortfolioV2 schema.
 * This ensures consistent data structure for rendering across all templates.
 * 
 * Handles:
 * - Legacy nested structures (experiences.info, skills.toolset, etc.)
 * - String skill levels ("85%") → numeric (85)
 * - Hyphenated keys (career-profile) → underscore (career_profile)
 * - Missing fields with sensible defaults
 * - Both YAML-sourced and JSON-sourced data
 */

import {
  PortfolioV2,
  PortfolioLanguage,
  PortfolioSidebar,
  PortfolioCareerProfile,
  PortfolioEducation,
  PortfolioExperience,
  PortfolioProject,
  PortfolioCertification,
  PortfolioSkill,
  PortfolioVolunteer,
  LegacyPortfolio,
  LegacyLanguagesSection,
  LegacyInterestsSection,
  LegacyExperiencesSection,
  LegacyEducationSection,
  LegacySkillsSection,
  LegacyProjectsSection,
  LegacyCertificationsSection,
  LegacyVolunteerSection,
  isLegacyFormat,
  DEFAULT_PORTFOLIO,
  PortfolioLayoutType,
} from '../types/portfolio-schema'

// ============================================
// Main Normalizer Function
// ============================================

/**
 * Normalize any portfolio format to PortfolioV2
 * 
 * @param data - Portfolio data in any supported format
 * @param defaultSlug - Optional slug to use if not present in data
 * @returns Normalized PortfolioV2 object
 * 
 * @example
 * ```typescript
 * // Legacy format
 * const legacy = { experiences: { info: [...] }, skills: { toolset: [...] } }
 * const normalized = normalizePortfolio(legacy)
 * 
 * // V2 format (passes through)
 * const v2 = { experiences: [...], skills: [...], layout: 'hero-centered' }
 * const normalized = normalizePortfolio(v2)
 * ```
 */
export function normalizePortfolio(data: unknown, defaultSlug?: string): PortfolioV2 {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_PORTFOLIO, slug: defaultSlug || '' }
  }

  const raw = data as Record<string, unknown>

  // Detect format and normalize
  if (isLegacyFormat(data)) {
    return normalizeLegacyPortfolio(data as LegacyPortfolio, defaultSlug)
  }

  // Already in v2-ish format, but ensure all fields are present
  return normalizeV2Portfolio(raw, defaultSlug)
}

// ============================================
// Legacy Format Normalizer
// ============================================

function normalizeLegacyPortfolio(data: LegacyPortfolio, defaultSlug?: string): PortfolioV2 {
  const slug = data.slug || defaultSlug || generateSlugFromName(data.sidebar?.name || '')

  return {
    slug,
    color_palette: data.color_palette || data.theme_skin || 'teal',
    layout: normalizeLayout(data.layout || data.template_layout),

    sidebar: normalizeSidebar(data.sidebar),

    career_profile: normalizeCareerProfile(
      data.career_profile || data['career-profile']
    ),

    interests: normalizeInterests(data.interests),
    education: normalizeEducation(data.education),
    experiences: normalizeExperiences(data.experiences),
    projects: normalizeProjects(data.projects),
    certifications: normalizeCertifications(data.certifications),
    skills: normalizeSkills(data.skills),
    volunteer: normalizeVolunteer(data.volunteer),

    footer: data.footer || ''
  }
}

// ============================================
// V2 Format Normalizer (ensure completeness)
// ============================================

function normalizeV2Portfolio(data: Record<string, unknown>, defaultSlug?: string): PortfolioV2 {
  const slug = (data.slug as string) || defaultSlug || generateSlugFromName(
    (data.sidebar as Record<string, unknown>)?.name as string || ''
  )

  return {
    slug,
    color_palette: (data.color_palette as string) || (data.theme_skin as string) || 'teal',
    layout: normalizeLayout(data.layout || data.template_layout),

    sidebar: normalizeSidebar(data.sidebar),

    career_profile: normalizeCareerProfile(
      data.career_profile || data['career-profile']
    ),

    interests: normalizeInterests(data.interests),
    education: normalizeEducation(data.education),
    experiences: normalizeExperiences(data.experiences),
    projects: normalizeProjects(data.projects),
    certifications: normalizeCertifications(data.certifications),
    skills: normalizeSkills(data.skills),
    volunteer: normalizeVolunteer(data.volunteer),

    footer: (data.footer as string) || ''
  }
}

// ============================================
// Section Normalizers
// ============================================

function normalizeLayout(layout: unknown): PortfolioLayoutType {
  const validLayouts: PortfolioLayoutType[] = [
    'classic', 'modern', 'minimal', 'creative', 'executive',
    'compact', 'timeline', 'cards', 'landing', 'hero-centered', 'hero-split'
  ]

  if (typeof layout === 'string' && validLayouts.includes(layout as PortfolioLayoutType)) {
    return layout as PortfolioLayoutType
  }

  return 'classic'
}

function normalizeSidebar(sidebar: unknown): PortfolioSidebar {
  if (!sidebar || typeof sidebar !== 'object') {
    return { ...DEFAULT_PORTFOLIO.sidebar }
  }

  const s = sidebar as Record<string, unknown>

  return {
    position: (s.position as 'left' | 'right') || 'left',
    about: Boolean(s.about),
    education: Boolean(s.education),
    name: (s.name as string) || '',
    tagline: (s.tagline as string) || '',
    avatar: (s.avatar as string) || null,
    email: (s.email as string) || undefined,
    phone: (s.phone as string) || undefined,
    location: (s.location as string) || (s.citizenship as string) || undefined,
    timezone: (s.timezone as string) || undefined,
    citizenship: (s.citizenship as string) || undefined,
    website: (s.website as string) || undefined,
    linkedin: (s.linkedin as string) || undefined,
    github: (s.github as string) || undefined,
    twitter: (s.twitter as string) || undefined,
    languages: normalizeLanguages(s.languages)
  }
}

function normalizeLanguages(languages: unknown): PortfolioLanguage[] {
  if (!languages) return []

  // Already flat array
  if (Array.isArray(languages)) {
    return languages.map(lang => ({
      idiom: (lang as Record<string, unknown>).idiom as string || '',
      level: (lang as Record<string, unknown>).level as string || ''
    }))
  }

  // Legacy nested format: { title: string, info: [...] }
  if (typeof languages === 'object' && 'info' in (languages as object)) {
    const legacy = languages as LegacyLanguagesSection
    return (legacy.info || []).map(lang => ({
      idiom: lang.idiom || '',
      level: lang.level || ''
    }))
  }

  return []
}

function normalizeCareerProfile(profile: unknown): PortfolioCareerProfile {
  if (!profile || typeof profile !== 'object') {
    return { title: 'About Me', summary: '' }
  }

  const p = profile as Record<string, unknown>

  return {
    title: (p.title as string) || 'About Me',
    summary: (p.summary as string) || ''
  }
}

function normalizeInterests(interests: unknown): string[] {
  if (!interests) return []

  // Already flat string array
  if (Array.isArray(interests)) {
    // Check if it's array of strings or array of objects
    if (interests.length > 0 && typeof interests[0] === 'string') {
      return interests as string[]
    }
    // Array of objects with 'item' property
    return interests.map(i => {
      if (typeof i === 'string') return i
      return (i as Record<string, unknown>).item as string || ''
    }).filter(Boolean)
  }

  // Legacy nested format: { title: string, info: [{ item: string }] }
  if (typeof interests === 'object' && 'info' in (interests as object)) {
    const legacy = interests as LegacyInterestsSection
    return (legacy.info || []).map(i => i.item).filter(Boolean)
  }

  return []
}

function normalizeEducation(education: unknown): PortfolioEducation[] {
  if (!education) return []

  // Already flat array
  if (Array.isArray(education)) {
    return education.map(e => normalizeEducationItem(e as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, info: [...] }
  if (typeof education === 'object' && 'info' in (education as object)) {
    const legacy = education as LegacyEducationSection
    return (legacy.info || []).map(e => normalizeEducationItem(e as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeEducationItem(e: Record<string, unknown>): PortfolioEducation {
  return {
    degree: (e.degree as string) || '',
    university: (e.university as string) || '',
    time: (e.time as string) || '',
    details: (e.details as string) || undefined
  }
}

function normalizeExperiences(experiences: unknown): PortfolioExperience[] {
  if (!experiences) return []

  // Already flat array
  if (Array.isArray(experiences)) {
    return experiences.map(e => normalizeExperienceItem(e as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, info: [...] }
  if (typeof experiences === 'object' && 'info' in (experiences as object)) {
    const legacy = experiences as LegacyExperiencesSection
    return (legacy.info || []).map(e => normalizeExperienceItem(e as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeExperienceItem(e: Record<string, unknown>): PortfolioExperience {
  return {
    role: (e.role as string) || '',
    time: (e.time as string) || '',
    company: (e.company as string) || '',
    details: (e.details as string) || '',
    tags: normalizeStringArray(e.tags),
    icon: (e.icon as string) || undefined
  }
}

function normalizeProjects(projects: unknown): PortfolioProject[] {
  if (!projects) return []

  // Already flat array
  if (Array.isArray(projects)) {
    return projects.map(p => normalizeProjectItem(p as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, assignments: [...] }
  if (typeof projects === 'object' && 'assignments' in (projects as object)) {
    const legacy = projects as LegacyProjectsSection
    return (legacy.assignments || []).map(p => normalizeProjectItem(p as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeProjectItem(p: Record<string, unknown>): PortfolioProject {
  return {
    title: (p.title as string) || '',
    time: (p.time as string) || undefined,
    details: (p.details as string) || '',
    link: (p.link as string) || (p.url as string) || undefined
  }
}

function normalizeCertifications(certifications: unknown): PortfolioCertification[] {
  if (!certifications) return []

  // Already flat array
  if (Array.isArray(certifications)) {
    return certifications.map(c => normalizeCertificationItem(c as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, list: [...] }
  if (typeof certifications === 'object' && 'list' in (certifications as object)) {
    const legacy = certifications as LegacyCertificationsSection
    return (legacy.list || []).map(c => normalizeCertificationItem(c as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeCertificationItem(c: Record<string, unknown>): PortfolioCertification {
  return {
    name: (c.name as string) || '',
    start: (c.start as string) || '',
    organization: (c.organization as string) || '',
    details: (c.details as string) || undefined
  }
}

function normalizeSkills(skills: unknown): PortfolioSkill[] {
  if (!skills) return []

  // Already flat array with numeric levels
  if (Array.isArray(skills)) {
    return skills.map(s => normalizeSkillItem(s as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, toolset: [...] }
  if (typeof skills === 'object' && 'toolset' in (skills as object)) {
    const legacy = skills as LegacySkillsSection
    return (legacy.toolset || []).map(s => normalizeSkillItem(s as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeSkillItem(s: Record<string, unknown>): PortfolioSkill {
  return {
    name: (s.name as string) || '',
    level: parseSkillLevel(s.level),
    tags: normalizeSkillTags(s)
  }
}

/**
 * Parse skill level from various formats to number 0-100
 */
function parseSkillLevel(level: unknown): number {
  // Already a number
  if (typeof level === 'number') {
    return Math.max(0, Math.min(100, level))
  }

  // String percentage like "85%" or "85"
  if (typeof level === 'string') {
    const match = level.match(/(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      return Math.max(0, Math.min(100, num))
    }
  }

  return 50 // Default
}

/**
 * Normalize skill tags - handle legacy 'details' field
 */
function normalizeSkillTags(s: Record<string, unknown>): string[] {
  // Already has tags
  if (Array.isArray(s.tags)) {
    return s.tags as string[]
  }

  // Legacy 'details' field - split by comma
  if (typeof s.details === 'string' && s.details.trim()) {
    return s.details
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }

  return []
}

function normalizeVolunteer(volunteer: unknown): PortfolioVolunteer[] {
  if (!volunteer) return []

  // Already flat array
  if (Array.isArray(volunteer)) {
    return volunteer.map(v => normalizeVolunteerItem(v as Record<string, unknown>))
  }

  // Legacy nested format: { title: string, info: [...] }
  if (typeof volunteer === 'object' && 'info' in (volunteer as object)) {
    const legacy = volunteer as LegacyVolunteerSection
    return (legacy.info || []).map(v => normalizeVolunteerItem(v as unknown as Record<string, unknown>))
  }

  return []
}

function normalizeVolunteerItem(v: Record<string, unknown>): PortfolioVolunteer {
  return {
    role: (v.role as string) || '',
    time: (v.time as string) || '',
    company: (v.company as string) || '',
    details: (v.details as string) || '',
    tags: normalizeStringArray(v.tags)
  }
}

// ============================================
// Helper Functions
// ============================================

function normalizeStringArray(arr: unknown): string[] {
  if (!arr || !Array.isArray(arr)) return []
  return arr.filter(item => typeof item === 'string') as string[]
}

/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlugFromName(name: string): string {
  if (!name) return ''

  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special characters
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Remove consecutive hyphens
    .replace(/^-|-$/g, '')            // Remove leading/trailing hyphens
    .substring(0, 50)                 // Limit length
}

// ============================================
// Convenience Functions
// ============================================

/**
 * Check if data needs normalization
 */
export function needsNormalization(data: unknown): boolean {
  return isLegacyFormat(data)
}

/**
 * Get career summary text from portfolio data (handles both formats)
 */
export function getCareerSummary(data: unknown): string {
  if (!data || typeof data !== 'object') return ''

  const d = data as Record<string, unknown>

  // V2 format
  if (d.career_profile && typeof d.career_profile === 'object') {
    return ((d.career_profile as Record<string, unknown>).summary as string) || ''
  }

  // Legacy format
  if (d['career-profile'] && typeof d['career-profile'] === 'object') {
    return ((d['career-profile'] as Record<string, unknown>).summary as string) || ''
  }

  return ''
}

/**
 * Get experiences array from portfolio data (handles both formats)
 */
export function getExperiences(data: unknown): PortfolioExperience[] {
  if (!data || typeof data !== 'object') return []

  const d = data as Record<string, unknown>

  // Already normalized or V2
  if (Array.isArray(d.experiences)) {
    return d.experiences as PortfolioExperience[]
  }

  // Legacy nested
  if (d.experiences && typeof d.experiences === 'object' && 'info' in (d.experiences as object)) {
    return (d.experiences as LegacyExperiencesSection).info || []
  }

  return []
}

/**
 * Get skills array from portfolio data (handles both formats)
 */
export function getSkills(data: unknown): PortfolioSkill[] {
  if (!data || typeof data !== 'object') return []

  const d = data as Record<string, unknown>

  // Already normalized or V2
  if (Array.isArray(d.skills)) {
    return (d.skills as Record<string, unknown>[]).map(s => normalizeSkillItem(s))
  }

  // Legacy nested
  if (d.skills && typeof d.skills === 'object' && 'toolset' in (d.skills as object)) {
    return ((d.skills as LegacySkillsSection).toolset || []).map(s => 
      normalizeSkillItem(s as unknown as Record<string, unknown>)
    )
  }

  return []
}

// ============================================
// Export
// ============================================

export default {
  normalizePortfolio,
  needsNormalization,
  generateSlugFromName,
  getCareerSummary,
  getExperiences,
  getSkills,
  parseSkillLevel
}



