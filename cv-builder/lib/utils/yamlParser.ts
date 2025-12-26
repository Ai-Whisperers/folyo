/**
 * YAML Parser Utility
 * Loads and parses YAML data files (migrated from Jekyll)
 */

import yaml from 'yaml'
import fs from 'fs'
import path from 'path'
import { CVData } from '@/lib/types/cv'

// Base path for data files
const DATA_DIR = path.join(process.cwd(), 'data', 'cvs')
const LEGACY_DATA_DIR = path.join(process.cwd(), '..', '_data')

/**
 * Load CV data from YAML file
 */
export async function loadCVFromYAML(filename: string): Promise<CVData | null> {
  try {
    // Try new location first
    let filePath = path.join(DATA_DIR, filename)

    if (!fs.existsSync(filePath)) {
      // Try legacy Jekyll location
      filePath = path.join(LEGACY_DATA_DIR, filename)
    }

    if (!fs.existsSync(filePath)) {
      console.warn(`YAML file not found: ${filename}`)
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = yaml.parse(fileContent)

    return transformYAMLtoCVData(data)
  } catch (error) {
    console.error(`Error loading YAML file ${filename}:`, error)
    return null
  }
}

/**
 * Load CV data from YAML string
 */
export function parseCVFromYAML(yamlContent: string): CVData | null {
  try {
    const data = yaml.parse(yamlContent)
    return transformYAMLtoCVData(data)
  } catch (error) {
    console.error('Error parsing YAML:', error)
    return null
  }
}

/**
 * Transform YAML data structure to CVData interface
 * Handles the Jekyll data.yml format
 */
export function transformYAMLtoCVData(data: any): CVData {
  return {
    // Theme
    theme_skin: data.theme_skin || 'teal',

    // Sidebar
    sidebar: {
      position: data.sidebar?.position || 'right',
      about: data.sidebar?.about ?? true,
      education: data.sidebar?.education ?? true,
      name: data.sidebar?.name || '',
      tagline: data.sidebar?.tagline || '',
      avatar: data.sidebar?.avatar || '',
      email: data.sidebar?.email || '',
      phone: data.sidebar?.phone || '',
      timezone: data.sidebar?.timezone || '',
      citizenship: data.sidebar?.citizenship || '',
      website: data.sidebar?.website || '',
      linkedin: data.sidebar?.linkedin || '',
      github: data.sidebar?.github || '',
      twitter: data.sidebar?.twitter || '',
      instagram: data.sidebar?.instagram || '',
      youtube: data.sidebar?.youtube || '',
      pdf: data.sidebar?.pdf || '',
      languages: data.sidebar?.languages ? {
        title: data.sidebar.languages.title || 'Languages',
        info: (data.sidebar.languages.info || []).map((lang: any) => ({
          idiom: lang.idiom || '',
          level: lang.level || ''
        }))
      } : undefined
    },

    // Career Profile
    'career-profile': data['career-profile'] ? {
      title: data['career-profile'].title || 'Profile',
      summary: data['career-profile'].summary || ''
    } : undefined,

    // Education
    education: data.education ? {
      title: data.education.title || 'Education',
      info: (data.education.info || []).map((edu: any) => ({
        degree: edu.degree || '',
        university: edu.university || '',
        time: edu.time || '',
        details: edu.details || ''
      }))
    } : undefined,

    // Experience
    experiences: data.experiences ? {
      title: data.experiences.title || 'Experience',
      info: (data.experiences.info || []).map((exp: any) => ({
        role: exp.role || '',
        time: exp.time || '',
        company: exp.company || '',
        details: exp.details || '',
        tags: exp.tags || [],
        icon: exp.icon || ''
      }))
    } : undefined,

    // Volunteer
    volunteer: data.volunteer ? {
      title: data.volunteer.title || 'Volunteer Work',
      info: (data.volunteer.info || []).map((vol: any) => ({
        role: vol.role || '',
        time: vol.time || '',
        company: vol.company || '',
        details: vol.details || ''
      }))
    } : undefined,

    // Projects
    projects: data.projects ? {
      title: data.projects.title || 'Projects',
      intro: data.projects.intro || '',
      assignments: (data.projects.assignments || []).map((proj: any) => ({
        title: proj.title || '',
        time: proj.time || '',
        details: proj.details || '',
        link: proj.link || ''
      }))
    } : undefined,

    // Certifications
    certifications: data.certifications ? {
      title: data.certifications.title || 'Certifications',
      list: (data.certifications.list || []).map((cert: any) => ({
        name: cert.name || '',
        start: cert.start || '',
        end: cert.end || '',
        organization: cert.organization || '',
        details: cert.details || ''
      }))
    } : undefined,

    // Skills
    skills: data.skills ? {
      title: data.skills.title || 'Skills',
      toolset: (data.skills.toolset || []).map((skill: any) => ({
        name: skill.name || '',
        level: skill.level || '0%',
        tags: skill.tags || []
      }))
    } : undefined,

    // Interests
    interests: data.interests ? {
      title: data.interests.title || 'Interests',
      info: (data.interests.info || []).map((interest: any) => ({
        item: interest.item || ''
      }))
    } : undefined,

    // Publications
    publications: data.publications ? {
      title: data.publications.title || 'Publications',
      intro: data.publications.intro || '',
      papers: (data.publications.papers || []).map((pub: any) => ({
        title: pub.title || '',
        authors: pub.authors || '',
        conference: pub.conference || '',
        link: pub.link || ''
      }))
    } : undefined,

    // Video Portfolio (for videographers)
    video_portfolio: data.video_portfolio ? {
      title: data.video_portfolio.title || 'Video Portfolio',
      showreel: data.video_portfolio.showreel || '',
      items: (data.video_portfolio.items || []).map((item: any) => ({
        title: item.title || '',
        description: item.description || '',
        video_url: item.video_url || '',
        thumbnail: item.thumbnail || '',
        category: item.category || ''
      }))
    } : undefined,

    // Footer
    footer: data.footer || ''
  }
}

/**
 * Convert CVData back to YAML string
 */
export function cvDataToYAML(data: CVData): string {
  return yaml.stringify(data, {
    indent: 2,
    lineWidth: 0,
    minContentWidth: 0
  })
}

/**
 * Save CV data to YAML file
 */
export async function saveCVToYAML(filename: string, data: CVData): Promise<boolean> {
  try {
    const filePath = path.join(DATA_DIR, filename)

    // Ensure directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    const yamlContent = cvDataToYAML(data)
    fs.writeFileSync(filePath, yamlContent, 'utf8')

    return true
  } catch (error) {
    console.error(`Error saving YAML file ${filename}:`, error)
    return false
  }
}

/**
 * List all available CV YAML files
 */
export function listCVFiles(): string[] {
  const files: string[] = []

  // Check new location
  if (fs.existsSync(DATA_DIR)) {
    const newFiles = fs.readdirSync(DATA_DIR)
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    files.push(...newFiles)
  }

  // Check legacy location
  if (fs.existsSync(LEGACY_DATA_DIR)) {
    const legacyFiles = fs.readdirSync(LEGACY_DATA_DIR)
      .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
    files.push(...legacyFiles.filter(f => !files.includes(f)))
  }

  return files
}

/**
 * Migrate Jekyll data file to new format
 */
export async function migrateJekyllData(sourceFile: string, destFile: string): Promise<boolean> {
  const data = await loadCVFromYAML(sourceFile)
  if (!data) return false

  return saveCVToYAML(destFile, data)
}
