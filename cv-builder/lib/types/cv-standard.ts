/**
 * CV Standard Schema v2.0
 * Based on Victoria Rolon's portfolio - The new standard for professional CVs
 *
 * Key principles:
 * 1. Rich content with markdown support
 * 2. Visual hierarchy through levels and tags
 * 3. Complete professional information
 * 4. Flexible yet structured data
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export interface Language {
  idiom: string
  level: 'Nativo' | 'Profesional' | 'Avanzado' | 'Intermedio' | 'Basico' |
         'Native' | 'Professional' | 'Advanced' | 'Intermediate' | 'Basic'
}

export type ProficiencyLevel = 'expert' | 'advanced' | 'proficient' | 'familiar'

export interface Skill {
  name: string
  /**
   * Proficiency level - prefer string labels over numbers
   * - 'expert': Can teach others, deep expertise
   * - 'advanced': Highly proficient, minimal guidance needed
   * - 'proficient': Solid working knowledge
   * - 'familiar': Basic understanding, some experience
   *
   * Also supports legacy numeric levels (0-100) for backward compatibility
   */
  level: ProficiencyLevel | number
  /**
   * Specific competencies within this skill category
   * These are the PRIMARY display - recruiters search for these keywords
   */
  tags?: string[]
}

export interface Experience {
  role: string
  company: string
  time: string
  /**
   * Rich text description with markdown support
   * Use **bold** for metrics and achievements
   * Use bullet points for responsibilities
   */
  details: string
  /** Technologies, tools, or skills used */
  tags?: string[]
  /** Icon identifier for visual representation */
  icon?: string
}

export interface Education {
  degree: string
  university: string
  time: string
  /**
   * Rich text with achievements and specializations
   * Use **bold** for honors and key achievements
   * Use bullet points for focus areas
   */
  details?: string
}

export interface Certification {
  name: string
  organization: string
  start: string
  end?: string
  /**
   * Detailed training coverage
   * Use **bold** for key competencies
   * Use bullet points for skills covered
   */
  details?: string
}

export interface Project {
  title: string
  time?: string
  /**
   * Project description with outcomes
   * Use **bold** for key results
   */
  details: string
  link?: string
  tags?: string[]
}

export interface Volunteer {
  role: string
  company: string
  time: string
  details?: string
  tags?: string[]
}

// =============================================================================
// SIDEBAR (PROFILE INFO)
// =============================================================================

export interface CVSidebar {
  /** Full name as displayed */
  name: string
  /** Professional title/tagline - Keep concise but descriptive */
  tagline: string
  /** Profile photo URL */
  avatar?: string
  /** Contact email */
  email?: string
  /** Phone number with country code */
  phone?: string
  /** Timezone for scheduling */
  timezone?: string
  /** City/Country location */
  citizenship?: string
  /** LinkedIn username (not full URL) */
  linkedin?: string
  /** GitHub username (not full URL) */
  github?: string
  /** Personal website URL */
  website?: string
  /** Language proficiencies */
  languages?: Language[]
}

// =============================================================================
// CAREER PROFILE
// =============================================================================

export interface CareerProfile {
  title?: string
  /**
   * Professional summary with rich formatting
   *
   * Best practices (Victoria Rolon standard):
   * - Start with a strong professional identity statement
   * - Use **bold** for key skills and achievements
   * - Include 3-5 bullet points for "Key Strengths"
   * - Strategic use of emojis for visual interest (optional)
   * - Keep under 300 words
   *
   * Example structure:
   * "Professional identity statement...
   *
   * Unique value proposition...
   *
   * Key Strengths:
   * - Strength 1
   * - Strength 2
   * - Strength 3
   *
   * Closing statement about readiness/goals"
   */
  summary: string
}

// =============================================================================
// MAIN CV DATA STRUCTURE
// =============================================================================

export interface CVStandard {
  /** URL-friendly identifier */
  slug: string

  /**
   * Theme skin identifier
   * Options: teal, blue, lavender, rose, amber, emerald,
   *          midnight, ocean, charcoal, etc.
   */
  theme_skin: string

  /**
   * Template layout style
   * - 'landing': Premium landing page (Victoria Rolon standard)
   * - 'classic': Traditional CV layout
   * - 'modern': Contemporary design
   * - 'minimal': Clean, minimalist
   * - 'creative': Bold, artistic
   * - 'executive': Corporate, professional
   * - 'compact': Space-efficient
   * - 'timeline': Chronological focus
   * - 'cards': Card-based sections
   */
  template_layout: 'landing' | 'classic' | 'modern' | 'minimal' |
                   'creative' | 'executive' | 'compact' | 'timeline' | 'cards'

  /** Profile and contact information */
  sidebar: CVSidebar

  /** Professional summary */
  career_profile: CareerProfile

  /** Work experience - Most recent first */
  experiences?: Experience[]

  /** Educational background - Most recent first */
  education?: Education[]

  /** Professional skills with proficiency levels */
  skills?: Skill[]

  /** Certifications and training */
  certifications?: Certification[]

  /** Notable projects */
  projects?: Project[]

  /** Volunteer work */
  volunteer?: Volunteer[]

  /** Professional interests as simple strings */
  interests?: string[]

  /**
   * Footer text with additional info
   * Example: "Location | Availability | Birth date | Work preferences"
   */
  footer?: string
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

export function isValidSkillLevel(level: ProficiencyLevel | number): boolean {
  if (typeof level === 'string') {
    return ['expert', 'advanced', 'proficient', 'familiar'].includes(level)
  }
  // Legacy numeric support
  return typeof level === 'number' && level >= 0 && level <= 100
}

export function normalizeProficiency(level: ProficiencyLevel | number | string): ProficiencyLevel {
  if (typeof level === 'string' && ['expert', 'advanced', 'proficient', 'familiar'].includes(level)) {
    return level as ProficiencyLevel
  }
  // Convert numeric to label
  const num = typeof level === 'number' ? level : parseInt(String(level).replace('%', ''), 10)
  if (isNaN(num)) return 'proficient'
  if (num >= 90) return 'expert'
  if (num >= 75) return 'advanced'
  if (num >= 50) return 'proficient'
  return 'familiar'
}

export function isValidLanguageLevel(level: string): boolean {
  const validLevels = [
    'Nativo', 'Profesional', 'Avanzado', 'Intermedio', 'Basico',
    'Native', 'Professional', 'Advanced', 'Intermediate', 'Basic'
  ]
  return validLevels.includes(level)
}

// =============================================================================
// TEMPLATE FACTORY
// =============================================================================

/**
 * Creates a new CV following the Victoria Rolon standard
 */
export function createCVStandard(
  name: string,
  tagline: string,
  options?: Partial<CVStandard>
): CVStandard {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    slug,
    theme_skin: 'teal',
    template_layout: 'landing',
    sidebar: {
      name,
      tagline,
      languages: []
    },
    career_profile: {
      title: 'About Me',
      summary: ''
    },
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    interests: [],
    ...options
  }
}

// =============================================================================
// CONTENT FORMATTING HELPERS
// =============================================================================

/**
 * Format text with markdown-style bold markers for CV content
 */
export function formatBold(text: string, boldPhrases: string[]): string {
  let result = text
  boldPhrases.forEach(phrase => {
    result = result.replace(new RegExp(phrase, 'g'), `**${phrase}**`)
  })
  return result
}

/**
 * Create a bullet list from an array of items
 */
export function createBulletList(items: string[]): string {
  return items.map(item => `- ${item}`).join('\n')
}

/**
 * Generate a professional footer string
 */
export function generateFooter(options: {
  location?: string
  availability?: string
  birthDate?: string
  workPreferences?: string
}): string {
  const parts: string[] = []
  if (options.location) parts.push(`Location: ${options.location}`)
  if (options.availability) parts.push(options.availability)
  if (options.birthDate) parts.push(`Born: ${options.birthDate}`)
  if (options.workPreferences) parts.push(options.workPreferences)
  return parts.join(' | ')
}
