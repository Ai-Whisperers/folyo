/**
 * Schema Transformer - Converts between YAML (Jekyll) and JSON (Next.js) CV formats
 *
 * This utility ensures consistency between the two template formats used in the project:
 * - YAML format: Used by Jekyll static site (_data/data.yml, templates/cv-examples/*.yml)
 * - JSON format: Used by Next.js CV builder (cv-builder/data/portfolios/*.json)
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface YAMLLanguage {
  idiom: string
  level: string
}

interface YAMLExperience {
  role: string
  time: string
  company: string
  details: string
  tags?: string[]
  icon?: string
}

interface YAMLEducation {
  degree: string
  university: string
  time: string
  details?: string
}

interface YAMLSkill {
  name: string
  level: string // e.g., "85%"
  tags?: string[]
}

interface YAMLProject {
  title: string
  time?: string
  details: string
}

interface YAMLCertification {
  name: string
  start?: string
  organization: string
  details?: string
}

interface YAMLSidebar {
  position?: string
  about?: boolean
  education?: boolean
  name: string
  tagline?: string
  avatar?: string
  email?: string
  phone?: string
  timezone?: string
  citizenship?: string
  website?: string
  linkedin?: string
  github?: string
  pdf?: string
  languages?: {
    title?: string
    info: YAMLLanguage[]
  }
}

interface YAMLTemplate {
  theme_skin: string
  sidebar: YAMLSidebar
  interests?: {
    title?: string
    info: Array<{ item: string }>
  }
  'career-profile'?: {
    title?: string
    summary: string
  }
  education?: {
    title?: string
    info: YAMLEducation[]
  }
  experiences?: {
    title?: string
    info: YAMLExperience[]
  }
  projects?: {
    title?: string
    intro?: string
    assignments: YAMLProject[]
  }
  certifications?: {
    title?: string
    list: YAMLCertification[]
  }
  skills?: {
    title?: string
    toolset: YAMLSkill[]
  }
  volunteer?: {
    title?: string
    info: YAMLExperience[]
  }
  footer?: string
}

// JSON Schema types (Next.js format)
interface JSONLanguage {
  idiom: string
  level: string
}

interface JSONExperience {
  role: string
  time: string
  company: string
  details: string
  tags: string[]
  icon?: string
}

interface JSONEducation {
  degree: string
  university: string
  time: string
  details: string
}

interface JSONSkill {
  name: string
  level: number // 0-100
  tags: string[]
}

interface JSONProject {
  title: string
  time: string
  details: string
}

interface JSONCertification {
  name: string
  start: string
  organization: string
  details: string
}

interface JSONSidebar {
  position: string
  about: boolean
  education: boolean
  name: string
  tagline: string
  avatar: string | null
  email: string
  phone: string
  timezone: string
  citizenship: string
  website?: string
  linkedin?: string
  github?: string
  pdf?: string
  languages: JSONLanguage[]
}

interface JSONTemplate {
  slug: string
  theme_skin: string
  sidebar: JSONSidebar
  interests: string[]
  career_profile: {
    title: string
    summary: string
  }
  education: JSONEducation[]
  experiences: JSONExperience[]
  projects: JSONProject[]
  certifications: JSONCertification[]
  skills: JSONSkill[]
  volunteer?: JSONExperience[]
  footer: string
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Convert YAML template format to JSON format
 */
export function yamlToJson(yaml: YAMLTemplate, slug: string): JSONTemplate {
  return {
    slug,
    theme_skin: yaml.theme_skin || 'teal',

    sidebar: {
      position: yaml.sidebar?.position || 'right',
      about: yaml.sidebar?.about ?? false,
      education: yaml.sidebar?.education ?? false,
      name: yaml.sidebar?.name || '',
      tagline: yaml.sidebar?.tagline || '',
      avatar: yaml.sidebar?.avatar || null,
      email: yaml.sidebar?.email || '',
      phone: yaml.sidebar?.phone || '',
      timezone: yaml.sidebar?.timezone || '',
      citizenship: yaml.sidebar?.citizenship || '',
      website: yaml.sidebar?.website,
      linkedin: yaml.sidebar?.linkedin,
      github: yaml.sidebar?.github,
      pdf: yaml.sidebar?.pdf,
      languages: yaml.sidebar?.languages?.info || []
    },

    interests: yaml.interests?.info?.map(i => i.item) || [],

    career_profile: {
      title: yaml['career-profile']?.title || 'Career Profile',
      summary: yaml['career-profile']?.summary || ''
    },

    education: yaml.education?.info?.map(e => ({
      degree: e.degree,
      university: e.university,
      time: e.time,
      details: e.details || ''
    })) || [],

    experiences: yaml.experiences?.info?.map(e => ({
      role: e.role,
      time: e.time,
      company: e.company,
      details: e.details,
      tags: e.tags || [],
      icon: e.icon
    })) || [],

    projects: yaml.projects?.assignments?.map(p => ({
      title: p.title,
      time: p.time || '',
      details: p.details
    })) || [],

    certifications: yaml.certifications?.list?.map(c => ({
      name: c.name,
      start: c.start || '',
      organization: c.organization,
      details: c.details || ''
    })) || [],

    skills: yaml.skills?.toolset?.map(s => ({
      name: s.name,
      level: parseSkillLevel(s.level),
      tags: s.tags || []
    })) || [],

    volunteer: yaml.volunteer?.info?.map(v => ({
      role: v.role,
      time: v.time,
      company: v.company,
      details: v.details,
      tags: v.tags || [],
      icon: v.icon
    })),

    footer: yaml.footer || ''
  }
}

/**
 * Convert JSON template format to YAML format
 */
export function jsonToYaml(json: JSONTemplate): YAMLTemplate {
  return {
    theme_skin: json.theme_skin,

    sidebar: {
      position: json.sidebar.position,
      about: json.sidebar.about,
      education: json.sidebar.education,
      name: json.sidebar.name,
      tagline: json.sidebar.tagline,
      avatar: json.sidebar.avatar || undefined,
      email: json.sidebar.email,
      phone: json.sidebar.phone,
      timezone: json.sidebar.timezone,
      citizenship: json.sidebar.citizenship,
      website: json.sidebar.website,
      linkedin: json.sidebar.linkedin,
      github: json.sidebar.github,
      pdf: json.sidebar.pdf,
      languages: {
        title: 'Languages',
        info: json.sidebar.languages
      }
    },

    interests: {
      title: 'Interests',
      info: json.interests.map(item => ({ item }))
    },

    'career-profile': {
      title: json.career_profile.title,
      summary: json.career_profile.summary
    },

    education: {
      title: 'Education',
      info: json.education.map(e => ({
        degree: e.degree,
        university: e.university,
        time: e.time,
        details: e.details
      }))
    },

    experiences: {
      title: 'Experience',
      info: json.experiences.map(e => ({
        role: e.role,
        time: e.time,
        company: e.company,
        details: e.details,
        tags: e.tags,
        icon: e.icon
      }))
    },

    projects: {
      title: 'Projects',
      intro: '',
      assignments: json.projects.map(p => ({
        title: p.title,
        time: p.time,
        details: p.details
      }))
    },

    certifications: {
      title: 'Certifications',
      list: json.certifications.map(c => ({
        name: c.name,
        start: c.start,
        organization: c.organization,
        details: c.details
      }))
    },

    skills: {
      title: 'Skills & Proficiency',
      toolset: json.skills.map(s => ({
        name: s.name,
        level: `${s.level}%`,
        tags: s.tags
      }))
    },

    volunteer: json.volunteer ? {
      title: 'Volunteer Experience',
      info: json.volunteer.map(v => ({
        role: v.role,
        time: v.time,
        company: v.company,
        details: v.details,
        tags: v.tags,
        icon: v.icon
      }))
    } : undefined,

    footer: json.footer
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse skill level from YAML format (e.g., "85%") to JSON format (85)
 */
function parseSkillLevel(level: string): number {
  if (typeof level === 'number') return level

  const match = level.match(/(\d+)/)
  if (match) {
    return parseInt(match[1], 10)
  }
  return 50 // Default to 50% if parsing fails
}

/**
 * Generate a URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50) // Limit length
}

/**
 * Validate JSON template structure
 */
export function validateJsonTemplate(template: Partial<JSONTemplate>): string[] {
  const errors: string[] = []

  if (!template.slug) errors.push('Missing slug')
  if (!template.sidebar?.name) errors.push('Missing sidebar.name')
  if (!template.theme_skin) errors.push('Missing theme_skin')

  if (template.skills) {
    template.skills.forEach((skill, index) => {
      if (typeof skill.level !== 'number') {
        errors.push(`skills[${index}].level must be a number`)
      }
      if (skill.level < 0 || skill.level > 100) {
        errors.push(`skills[${index}].level must be between 0 and 100`)
      }
    })
  }

  return errors
}

/**
 * Validate YAML template structure
 */
export function validateYamlTemplate(template: Partial<YAMLTemplate>): string[] {
  const errors: string[] = []

  if (!template.sidebar?.name) errors.push('Missing sidebar.name')
  if (!template.theme_skin) errors.push('Missing theme_skin')

  if (template.skills?.toolset) {
    template.skills.toolset.forEach((skill, index) => {
      if (typeof skill.level !== 'string' || !skill.level.includes('%')) {
        errors.push(`skills.toolset[${index}].level should be a percentage string (e.g., "85%")`)
      }
    })
  }

  return errors
}

// ============================================================================
// Export default transformer object
// ============================================================================

const schemaTransformer = {
  yamlToJson,
  jsonToYaml,
  generateSlug,
  validateJsonTemplate,
  validateYamlTemplate,
  parseSkillLevel
}

export default schemaTransformer
