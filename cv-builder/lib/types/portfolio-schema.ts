/**
 * Portfolio Schema v2.0
 * 
 * This is the canonical schema for portfolios, based on Victoria Rolon's format.
 * All portfolio data should conform to this schema for consistent rendering.
 * 
 * Key features:
 * - Flat arrays (no nested .info or .toolset)
 * - Numeric skill levels (0-100)
 * - Tags support for experiences and skills
 * - Icons for visual enhancement
 * - Volunteer section
 * - Explicit layout and color_palette selection
 * - Markdown support in text fields
 */

// ============================================
// Layout Types
// ============================================

export type PortfolioLayoutType =
  | 'classic'        // Traditional sidebar layout
  | 'modern'         // Contemporary split design
  | 'minimal'        // Clean, minimal design
  | 'creative'       // Bold, creative layout
  | 'executive'      // Professional executive style
  | 'compact'        // Dense information layout
  | 'timeline'       // Timeline-focused design
  | 'cards'          // Card-based layout
  | 'landing'        // Full landing page style
  | 'hero-centered'  // Hero section with centered content (Victoria style)
  | 'hero-split'     // Hero with split layout

export type ColorPaletteType =
  | 'teal'
  | 'blue'
  | 'navy'
  | 'slate'
  | 'emerald'
  | 'lavender'
  | 'violet'
  | 'rose'
  | 'orange'
  | 'cyan'
  | 'pink'
  | 'graphite'
  | 'stone'
  | 'zinc'
  | 'midnight'
  | 'dark-purple'
  | 'dark-teal'
  | 'charcoal'
  | 'turquoise'
  | 'green'
  | 'berry'
  | 'ceramic'
  | 'oceanstale'

export type SidebarPosition = 'left' | 'right'

// ============================================
// Component Types (Flat Structure)
// ============================================

export interface PortfolioLanguage {
  idiom: string
  level: string  // "Native", "Fluent", "Professional", "Intermediate", "Basic"
}

export interface PortfolioSidebar {
  position?: SidebarPosition
  about?: boolean
  education?: boolean
  name: string
  tagline: string
  avatar?: string | null
  email?: string
  phone?: string
  location?: string      // Preferred over citizenship for display
  timezone?: string
  citizenship?: string   // Legacy, maps to location
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  languages: PortfolioLanguage[]
}

export interface PortfolioCareerProfile {
  title: string
  summary: string  // Supports markdown: **bold**, *italic*, bullet points
}

export interface PortfolioEducation {
  degree: string
  university: string
  time: string
  details?: string  // Supports markdown
}

export interface PortfolioExperience {
  role: string
  time: string
  company: string
  details: string   // Supports markdown
  tags?: string[]   // Keywords for filtering/display
  icon?: string     // Icon identifier (e.g., 'briefcase', 'desktop', 'heart')
}

export interface PortfolioProject {
  title: string
  time?: string
  details: string   // Supports markdown
  link?: string     // Project URL
}

export interface PortfolioCertification {
  name: string
  start: string     // Year or date
  organization: string
  details?: string  // Supports markdown
}

export interface PortfolioSkill {
  name: string
  level: number     // 0-100 (NOT string percentage)
  tags?: string[]   // Sub-skills or related keywords
}

export interface PortfolioVolunteer {
  role: string
  time: string
  company: string   // Organization name
  details: string   // Supports markdown
  tags?: string[]
}

// ============================================
// Main Portfolio Schema v2
// ============================================

export interface PortfolioV2 {
  // Metadata
  slug: string
  color_palette: ColorPaletteType | string  // Theme color reference
  layout: PortfolioLayoutType               // Template layout
  
  // Contact & Basic Info
  sidebar: PortfolioSidebar
  
  // Content Sections (flat arrays)
  career_profile: PortfolioCareerProfile
  interests: string[]                       // Simple string array
  education: PortfolioEducation[]
  experiences: PortfolioExperience[]
  projects: PortfolioProject[]
  certifications: PortfolioCertification[]
  skills: PortfolioSkill[]
  volunteer?: PortfolioVolunteer[]
  
  // Footer
  footer?: string
}

// ============================================
// Legacy Format Types (for normalization)
// ============================================

export interface LegacyLanguagesSection {
  title?: string
  info: PortfolioLanguage[]
}

export interface LegacyInterestsSection {
  title?: string
  info: Array<{ item: string }>
}

export interface LegacyCareerProfile {
  title?: string
  summary: string
}

export interface LegacyExperiencesSection {
  title?: string
  info: PortfolioExperience[]
}

export interface LegacyEducationSection {
  title?: string
  info: PortfolioEducation[]
}

export interface LegacySkillsSection {
  title?: string
  toolset: Array<{
    name: string
    level: string | number  // Could be "85%" or 85
    tags?: string[]
    details?: string        // Legacy field, convert to tags
  }>
}

export interface LegacyProjectsSection {
  title?: string
  intro?: string
  assignments: PortfolioProject[]
}

export interface LegacyCertificationsSection {
  title?: string
  list: PortfolioCertification[]
}

export interface LegacyVolunteerSection {
  title?: string
  info: PortfolioVolunteer[]
}

export interface LegacySidebar extends Omit<PortfolioSidebar, 'languages'> {
  languages?: LegacyLanguagesSection | PortfolioLanguage[]
}

/**
 * Legacy portfolio format with nested structures
 */
export interface LegacyPortfolio {
  slug?: string
  theme_skin?: string
  color_palette?: string
  template_layout?: string
  layout?: string
  
  sidebar?: LegacySidebar
  
  // Can be either hyphenated or underscored
  'career-profile'?: LegacyCareerProfile
  career_profile?: LegacyCareerProfile | PortfolioCareerProfile
  
  // Can be either nested or flat
  interests?: LegacyInterestsSection | string[]
  education?: LegacyEducationSection | PortfolioEducation[]
  experiences?: LegacyExperiencesSection | PortfolioExperience[]
  skills?: LegacySkillsSection | PortfolioSkill[]
  projects?: LegacyProjectsSection | PortfolioProject[]
  certifications?: LegacyCertificationsSection | PortfolioCertification[]
  volunteer?: LegacyVolunteerSection | PortfolioVolunteer[]
  
  footer?: string
}

// ============================================
// Type Guards
// ============================================

/**
 * Check if portfolio is in legacy nested format
 */
export function isLegacyFormat(data: unknown): data is LegacyPortfolio {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  
  // Check for legacy nested structures
  const hasLegacyExperiences = d.experiences && typeof d.experiences === 'object' && 'info' in (d.experiences as object)
  const hasLegacySkills = d.skills && typeof d.skills === 'object' && 'toolset' in (d.skills as object)
  const hasLegacyEducation = d.education && typeof d.education === 'object' && 'info' in (d.education as object)
  const hasLegacyInterests = d.interests && typeof d.interests === 'object' && !Array.isArray(d.interests) && 'info' in (d.interests as object)
  const hasHyphenatedCareerProfile = 'career-profile' in d
  
  return hasLegacyExperiences || hasLegacySkills || hasLegacyEducation || hasLegacyInterests || hasHyphenatedCareerProfile
}

/**
 * Check if portfolio is in v2 format
 */
export function isV2Format(data: unknown): data is PortfolioV2 {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  
  // V2 format has flat arrays and underscore keys
  const hasSlug = typeof d.slug === 'string'
  const hasLayout = typeof d.layout === 'string'
  const hasFlatExperiences = Array.isArray(d.experiences) && (!d.experiences.length || !('info' in (d.experiences as object)))
  const hasFlatSkills = Array.isArray(d.skills) && (!d.skills.length || typeof (d.skills as unknown[])[0] === 'object' && 'level' in ((d.skills as unknown[])[0] as object) && typeof ((d.skills as unknown[])[0] as Record<string, unknown>).level === 'number')
  
  return hasSlug && hasLayout && (hasFlatExperiences || hasFlatSkills)
}

// ============================================
// Validation
// ============================================

export interface ValidationError {
  field: string
  message: string
}

/**
 * Validate a PortfolioV2 object
 */
export function validatePortfolioV2(portfolio: PortfolioV2): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Required fields
  if (!portfolio.slug) {
    errors.push({ field: 'slug', message: 'Slug is required' })
  }
  
  if (!portfolio.sidebar?.name) {
    errors.push({ field: 'sidebar.name', message: 'Name is required' })
  }
  
  if (!portfolio.color_palette) {
    errors.push({ field: 'color_palette', message: 'Color palette is required' })
  }
  
  if (!portfolio.layout) {
    errors.push({ field: 'layout', message: 'Layout is required' })
  }
  
  // Skill level validation
  if (portfolio.skills) {
    portfolio.skills.forEach((skill, index) => {
      if (typeof skill.level !== 'number') {
        errors.push({ 
          field: `skills[${index}].level`, 
          message: `Skill level must be a number, got ${typeof skill.level}` 
        })
      } else if (skill.level < 0 || skill.level > 100) {
        errors.push({ 
          field: `skills[${index}].level`, 
          message: `Skill level must be between 0 and 100, got ${skill.level}` 
        })
      }
    })
  }
  
  return errors
}

// ============================================
// Default Values
// ============================================

export const DEFAULT_PORTFOLIO: PortfolioV2 = {
  slug: '',
  color_palette: 'teal',
  layout: 'classic',
  sidebar: {
    position: 'left',
    name: '',
    tagline: '',
    languages: []
  },
  career_profile: {
    title: 'About Me',
    summary: ''
  },
  interests: [],
  education: [],
  experiences: [],
  projects: [],
  certifications: [],
  skills: [],
  volunteer: []
}

// ============================================
// Export all types
// ============================================

export type {
  PortfolioV2 as Portfolio,
  PortfolioLayoutType as LayoutType,
  ColorPaletteType as PaletteType
}



