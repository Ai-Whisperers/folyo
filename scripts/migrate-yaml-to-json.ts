/**
 * YAML to JSON Portfolio Migration Script
 * 
 * Converts legacy YAML templates to the new PortfolioV2 JSON format.
 * 
 * Usage: npx ts-node cv-builder/scripts/migrate-yaml-to-json.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Simple YAML parser for our specific format (avoiding external dependencies)
function parseYaml(content: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = content.split('\n')
  const stack: Array<{ indent: number; obj: any; key?: string }> = [{ indent: -2, obj: result }]
  let currentArrayKey: string | null = null
  let multilineKey: string | null = null
  let multilineValue = ''
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      if (multilineKey) {
        multilineValue += '\n'
      }
      continue
    }
    
    // Handle multiline strings
    if (multilineKey) {
      const contentIndent = line.search(/\S/)
      if (contentIndent > 0) {
        multilineValue += (multilineValue ? '\n' : '') + line.trim()
        continue
      } else {
        // End of multiline
        const parent = stack[stack.length - 1]
        if (parent.obj && multilineKey) {
          parent.obj[multilineKey] = multilineValue.trim()
        }
        multilineKey = null
        multilineValue = ''
      }
    }
    
    const indent = line.search(/\S/)
    line = line.trim()
    
    // Pop stack to correct level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }
    
    const parent = stack[stack.length - 1]
    
    // Array item
    if (line.startsWith('- ')) {
      const content = line.slice(2).trim()
      
      // Simple array item (string)
      if (!content.includes(':')) {
        if (!Array.isArray(parent.obj)) {
          // Create array on parent
          const arrKey = currentArrayKey
          if (arrKey && stack.length > 1) {
            const grandparent = stack[stack.length - 2]
            if (!grandparent.obj[arrKey]) {
              grandparent.obj[arrKey] = []
            }
            grandparent.obj[arrKey].push(content)
          }
        } else {
          parent.obj.push(content)
        }
      } else {
        // Object array item
        const [key, ...valueParts] = content.split(':')
        const value = valueParts.join(':').trim()
        const newObj: Record<string, any> = {}
        
        if (key && value) {
          newObj[key] = parseValue(value)
        }
        
        if (Array.isArray(parent.obj)) {
          parent.obj.push(newObj)
        } else if (currentArrayKey) {
          if (!parent.obj[currentArrayKey]) {
            parent.obj[currentArrayKey] = []
          }
          parent.obj[currentArrayKey].push(newObj)
        }
        
        stack.push({ indent, obj: newObj })
      }
    }
    // Key-value pair
    else if (line.includes(':')) {
      const colonIndex = line.indexOf(':')
      const key = line.slice(0, colonIndex).trim()
      const rawValue = line.slice(colonIndex + 1).trim()
      
      // Multiline indicator
      if (rawValue === '|' || rawValue === '>') {
        multilineKey = key
        multilineValue = ''
        continue
      }
      
      // Array indicator
      if (rawValue === '' || rawValue === '[]') {
        parent.obj[key] = []
        currentArrayKey = key
        stack.push({ indent, obj: parent.obj[key], key })
        continue
      }
      
      // Nested object
      if (rawValue === '') {
        parent.obj[key] = {}
        stack.push({ indent, obj: parent.obj[key], key })
        continue
      }
      
      // Simple value
      parent.obj[key] = parseValue(rawValue)
    }
  }
  
  // Handle any remaining multiline content
  if (multilineKey && multilineValue) {
    const parent = stack[stack.length - 1]
    if (parent.obj && multilineKey) {
      parent.obj[multilineKey] = multilineValue.trim()
    }
  }
  
  return result
}

function parseValue(value: string): any {
  value = value.trim()
  
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  
  // Boolean
  if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
    return value.toLowerCase() === 'true'
  }
  
  // Number
  if (!isNaN(Number(value)) && value !== '') {
    return Number(value)
  }
  
  // Array notation
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1)
    return inner.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
  }
  
  return value
}

// Convert YAML format to PortfolioV2 JSON format
function convertToV2(yaml: Record<string, any>, slug: string): Record<string, any> {
  const normalizeSkillLevel = (level: string | number): number => {
    if (typeof level === 'number') return level
    const match = String(level).match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 80
  }
  
  return {
    slug,
    color_palette: yaml.theme_skin || 'teal',
    layout: 'hero-centered',
    
    sidebar: {
      position: yaml.sidebar?.position || 'left',
      about: yaml.sidebar?.about ?? false,
      education: yaml.sidebar?.education ?? false,
      name: yaml.sidebar?.name || '',
      tagline: yaml.sidebar?.tagline || '',
      avatar: yaml.sidebar?.avatar ? `/uploads/${yaml.sidebar.avatar}` : null,
      email: yaml.sidebar?.email || undefined,
      phone: yaml.sidebar?.phone || undefined,
      timezone: yaml.sidebar?.timezone || undefined,
      citizenship: yaml.sidebar?.citizenship || undefined,
      website: yaml.sidebar?.website || undefined,
      linkedin: yaml.sidebar?.linkedin || undefined,
      github: yaml.sidebar?.github || undefined,
      languages: (yaml.sidebar?.languages?.info || []).map((l: any) => ({
        idiom: l.idiom,
        level: l.level
      }))
    },
    
    career_profile: {
      title: yaml['career-profile']?.title || 'About Me',
      summary: yaml['career-profile']?.summary || ''
    },
    
    interests: (yaml.interests?.info || []).map((i: any) => 
      typeof i === 'string' ? i : (i.item || '')
    ),
    
    education: (yaml.education?.info || []).map((e: any) => ({
      degree: e.degree,
      university: e.university,
      time: e.time,
      details: e.details || undefined
    })),
    
    experiences: (yaml.experiences?.info || []).map((e: any) => ({
      role: e.role,
      time: e.time,
      company: e.company,
      details: e.details || '',
      tags: e.tags || [],
      icon: e.icon || undefined
    })),
    
    projects: (yaml.projects?.assignments || []).map((p: any) => ({
      title: p.title,
      time: p.time || undefined,
      details: p.details || ''
    })),
    
    certifications: (yaml.certifications?.list || []).map((c: any) => ({
      name: c.name,
      start: c.start || '',
      organization: c.organization,
      details: c.details || undefined
    })),
    
    skills: (yaml.skills?.toolset || []).map((s: any) => ({
      name: s.name,
      level: normalizeSkillLevel(s.level),
      tags: s.tags || []
    })),
    
    volunteer: (yaml.volunteer?.info || []).map((v: any) => ({
      role: v.role,
      time: v.time,
      company: v.company,
      details: v.details || '',
      tags: v.tags || []
    })),
    
    footer: yaml.footer || ''
  }
}

// Main migration function
async function migrate() {
  const templatesDir = path.join(__dirname, '../../templates/cv-examples')
  const outputDir = path.join(__dirname, '../data/portfolios')
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  const files = fs.readdirSync(templatesDir)
  const yamlFiles = files.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
  
  console.log(`Found ${yamlFiles.length} YAML files to migrate\n`)
  
  for (const file of yamlFiles) {
    try {
      const filePath = path.join(templatesDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Parse YAML
      const yaml = parseYaml(content)
      
      // Generate slug from filename
      const slug = file
        .replace(/\.ya?ml$/, '')
        .replace(/-cv$/, '')
        .replace(/-example$/, '')
      
      // Convert to V2 format
      const v2 = convertToV2(yaml, slug)
      
      // Write JSON
      const outputPath = path.join(outputDir, `${slug}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(v2, null, 2))
      
      console.log(`✅ Migrated: ${file} → ${slug}.json`)
      console.log(`   Name: ${v2.sidebar.name}`)
      console.log(`   Layout: ${v2.layout}`)
      console.log(`   Palette: ${v2.color_palette}`)
      console.log('')
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error)
    }
  }
  
  console.log('\n✨ Migration complete!')
}

// Run migration
migrate().catch(console.error)



