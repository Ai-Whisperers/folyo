# Portfolio Schema Migration Plan

> **Goal**: Adopt Victoria Rolon's portfolio JSON format as the new standard schema, replacing legacy templates with a modern, feature-rich portfolio system.

## ✅ Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1.1: Schema Definition | ✅ Complete | `cv-builder/lib/types/portfolio-schema.ts` |
| Phase 1.2: Data Normalizer | ✅ Complete | `cv-builder/lib/utils/portfolio-normalizer.ts` |
| Phase 2.1: CVPreview Updates | ✅ Complete | Using normalizers in layouts |
| Phase 2.2: Section Renderers | ✅ Complete | All sections support new format |
| Phase 3.1: Hero-Centered Layout | ✅ Complete | `renderLayoutHeroCentered` added |
| Phase 3.2: Layout Router | ✅ Complete | Router updated with new layout |
| Phase 4: Template Migration | ✅ Complete | `software-developer.json`, `data-scientist.json` |
| Phase 5: Theme Consolidation | ✅ Complete | `cv-builder/lib/themes/index.ts` |

---

## Executive Summary

Victoria Rolon's portfolio (`cv-builder/data/portfolios/victoria-rolon.json`) represents a more modern, feature-rich portfolio format that we should adopt as the standard. This plan outlines the migration from the legacy YAML/HTML templates to this new JSON-based schema.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Target Schema Definition](#target-schema-definition)
3. [Phase 1: Schema Standardization](#phase-1-schema-standardization)
4. [Phase 2: CVPreview Updates](#phase-2-cvpreview-updates)
5. [Phase 3: Layout System Expansion](#phase-3-layout-system-expansion)
6. [Phase 4: Template Migration](#phase-4-template-migration)
7. [Phase 5: Theme System Cleanup](#phase-5-theme-system-cleanup)
8. [Database Schema Updates](#database-schema-updates)
9. [Migration Scripts](#migration-scripts)
10. [Testing Strategy](#testing-strategy)

---

## Current State Analysis

### Legacy Format (YAML/HTML in `templates/cv-examples/`)

```yaml
# Old format - complex nested structure
experiences:
  title: "Experience"
  info:
    - role: "Job Title"
      time: "2023"
      company: "Company"
      details: "Description text"

skills:
  title: "Skills"
  toolset:
    - name: "Skill Name"
      level: "80%"  # String percentage
      details: "Description"

sidebar:
  languages:
    title: "Languages"
    info:
      - idiom: "English"
        level: "Native"
```

**Problems with Legacy Format:**
- Inconsistent nesting (`info[]` vs `toolset[]` vs `assignments[]`)
- String-based skill levels (`"80%"`) instead of numbers
- No support for tags, icons, or volunteer work
- No explicit layout selection
- Mixed hyphenated keys (`career-profile` vs `career_profile`)

### New Format (Victoria Rolon's JSON Schema)

```json
{
  "slug": "victoria-rolon",
  "color_palette": "lavender",
  "layout": "hero-centered",
  
  "sidebar": {
    "name": "Victoria Rolon",
    "tagline": "Professional Title",
    "languages": [
      { "idiom": "Spanish", "level": "Native" }
    ]
  },
  
  "interests": ["Interest 1", "Interest 2"],
  
  "career_profile": {
    "title": "About Me",
    "summary": "Markdown-supported summary..."
  },
  
  "experiences": [
    {
      "role": "Job Title",
      "time": "2023",
      "company": "Company",
      "details": "Description with **markdown**",
      "tags": ["Tag1", "Tag2"],
      "icon": "briefcase"
    }
  ],
  
  "skills": [
    {
      "name": "Skill Name",
      "level": 85,  // Numeric 0-100
      "tags": ["Sub-skill 1", "Sub-skill 2"]
    }
  ],
  
  "volunteer": [
    {
      "role": "Volunteer Role",
      "time": "2023",
      "company": "Organization",
      "details": "Description",
      "tags": ["Tag1"]
    }
  ]
}
```

**Advantages of New Format:**
- ✅ Flat arrays (easier to iterate)
- ✅ Numeric skill levels (easier to render progress bars)
- ✅ Tags for filtering/display
- ✅ Icons for visual enhancement
- ✅ Volunteer section
- ✅ Explicit layout selection
- ✅ Color palette as theme reference
- ✅ Markdown support in descriptions
- ✅ Consistent snake_case keys

---

## Target Schema Definition

### Portfolio Schema v2.0

```typescript
// cv-builder/lib/types/portfolio-schema.ts

export interface PortfolioV2 {
  // Metadata
  slug: string
  color_palette: string  // References COLOR_PALETTES
  layout: PortfolioLayout
  
  // Contact & Basic Info
  sidebar: {
    position?: 'left' | 'right'
    about?: boolean
    education?: boolean
    name: string
    tagline: string
    avatar?: string
    email?: string
    phone?: string
    location?: string
    timezone?: string
    citizenship?: string
    website?: string
    linkedin?: string
    github?: string
    twitter?: string
    languages: Language[]
  }
  
  // Content Sections
  career_profile: {
    title: string
    summary: string  // Supports markdown
  }
  
  interests: string[]  // Simple string array
  
  education: Education[]
  experiences: Experience[]
  projects: Project[]
  certifications: Certification[]
  skills: Skill[]
  volunteer?: Volunteer[]
  
  // Footer
  footer?: string
}

export type PortfolioLayout = 
  | 'classic'      // Traditional sidebar layout
  | 'modern'       // Contemporary split design
  | 'minimal'      // Clean, minimal design
  | 'creative'     // Bold, creative layout
  | 'executive'    // Professional executive style
  | 'compact'      // Dense information layout
  | 'timeline'     // Timeline-focused design
  | 'cards'        // Card-based layout
  | 'landing'      // Full landing page style
  | 'hero-centered'  // NEW: Hero section with centered content
  | 'hero-split'     // NEW: Hero with split layout

export interface Language {
  idiom: string
  level: string
}

export interface Education {
  degree: string
  university: string
  time: string
  details?: string  // Supports markdown
}

export interface Experience {
  role: string
  time: string
  company: string
  details: string  // Supports markdown
  tags?: string[]
  icon?: string
}

export interface Project {
  title: string
  time?: string
  details: string
  link?: string
}

export interface Certification {
  name: string
  start: string
  organization: string
  details?: string
}

export interface Skill {
  name: string
  level: number  // 0-100
  tags?: string[]
}

export interface Volunteer {
  role: string
  time: string
  company: string
  details: string
  tags?: string[]
}
```

---

## Phase 1: Schema Standardization

### Task 1.1: Create TypeScript Schema Definition

**Files:**
- Create: `cv-builder/lib/types/portfolio-schema.ts`

**Steps:**
1. Define the `PortfolioV2` interface as shown above
2. Add validation functions (Zod or custom)
3. Export schema for use across the app

### Task 1.2: Create Data Normalizers

**Files:**
- Create: `cv-builder/lib/utils/portfolio-normalizer.ts`

**Purpose:** Convert legacy format to new format automatically

```typescript
// Portfolio normalizer - handles both legacy and new formats
export function normalizePortfolio(data: any): PortfolioV2 {
  // Detect format version
  const isLegacy = data.experiences?.info || data.skills?.toolset
  
  if (isLegacy) {
    return normalizeLegacyPortfolio(data)
  }
  
  return data as PortfolioV2
}

function normalizeLegacyPortfolio(data: any): PortfolioV2 {
  return {
    slug: data.slug || generateSlug(data.sidebar?.name),
    color_palette: data.theme_skin || data.color_palette || 'teal',
    layout: data.template_layout || data.layout || 'classic',
    
    sidebar: {
      ...data.sidebar,
      languages: normalizeLanguages(data.sidebar?.languages)
    },
    
    career_profile: data.career_profile || data['career-profile'] || { title: '', summary: '' },
    
    interests: normalizeInterests(data.interests),
    education: normalizeArray(data.education),
    experiences: normalizeExperiences(data.experiences),
    skills: normalizeSkills(data.skills),
    projects: normalizeProjects(data.projects),
    certifications: normalizeCertifications(data.certifications),
    volunteer: data.volunteer || [],
    
    footer: data.footer
  }
}
```

### Task 1.3: Update Portfolio Data Files

**Files to update:**
- `cv-builder/data/portfolios/victoria-rolon.json` ✅ (already in new format)
- `cv-builder/data/portfolios/milagros-aguilera.json` ✅ (already in new format)

**Files to migrate:**
- `templates/cv-examples/designer-portfolio.json` ✅ (already in new format)
- `templates/cv-examples/developer-portfolio.json`
- `templates/cv-examples/executive-portfolio.json`
- `templates/cv-examples/marketing-portfolio.json`
- `templates/cv-examples/*.yml` files (convert to JSON)

---

## Phase 2: CVPreview Updates

### Task 2.1: Update Data Normalization in CVPreview

**Files:**
- Modify: `cv-builder/components/cv/CVPreview.tsx`

**Changes:**
1. Import the new normalizer at the top of the file
2. Normalize data before rendering
3. Update all section renderers to use normalized format

```typescript
// At the start of CVPreviewComponent
const normalizedData = useMemo(() => 
  normalizePortfolio(data), 
  [data]
)

// Use normalizedData instead of data throughout
```

### Task 2.2: Update Section Renderers

Each section renderer needs to handle the new flat array format:

**Skills Section:**
```typescript
// OLD: data.skills?.toolset?.map(...)
// NEW: data.skills?.map(...)

// OLD: skill.level as string "80%"
// NEW: skill.level as number 85

// OLD: skill.details as string
// NEW: skill.tags as string[]
```

**Experiences Section:**
```typescript
// OLD: data.experiences?.info?.map(...)
// NEW: data.experiences?.map(...)

// NEW: Add tags rendering
{exp.tags?.map(tag => `<span class="tag">${tag}</span>`)}

// NEW: Add icon rendering
{exp.icon && `<span class="icon icon-${exp.icon}"></span>`}
```

---

## Phase 3: Layout System Expansion

### Task 3.1: Create Hero-Centered Layout

**Files:**
- Modify: `cv-builder/components/cv/CVPreview.tsx`

**Add new layout renderer:**

```typescript
const renderLayoutHeroCentered = (data: PortfolioV2, theme: ThemeData): string => {
  return `
    <div class="layout-hero-centered" style="font-family: Inter, system-ui, sans-serif;">
      <!-- Hero Section -->
      <header class="hero text-center py-16 px-8" style="background: linear-gradient(135deg, ${theme.primary}15, ${theme.accent});">
        ${data.sidebar?.avatar 
          ? `<img src="${data.sidebar.avatar}" alt="${data.sidebar.name}" class="w-32 h-32 rounded-full mx-auto mb-6 border-4" style="border-color: ${theme.primary};" />`
          : `<div class="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white" style="background-color: ${theme.primary};">
              ${data.sidebar?.name?.charAt(0) || 'P'}
            </div>`
        }
        
        <h1 class="text-4xl font-bold mb-2" style="color: ${theme.text};">
          ${data.sidebar?.name || 'Your Name'}
        </h1>
        
        <p class="text-xl mb-6" style="color: ${theme.primary};">
          ${data.sidebar?.tagline || 'Professional Title'}
        </p>
        
        <!-- Contact Pills -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          ${data.sidebar?.email ? `
            <a href="mailto:${data.sidebar.email}" class="px-4 py-2 rounded-full text-sm" style="background-color: ${theme.primary}15; color: ${theme.primary};">
              📧 ${data.sidebar.email}
            </a>
          ` : ''}
          ${data.sidebar?.phone ? `
            <a href="tel:${data.sidebar.phone}" class="px-4 py-2 rounded-full text-sm" style="background-color: ${theme.primary}15; color: ${theme.primary};">
              📱 ${data.sidebar.phone}
            </a>
          ` : ''}
          ${data.sidebar?.location || data.sidebar?.citizenship ? `
            <span class="px-4 py-2 rounded-full text-sm" style="background-color: #f3f4f6; color: #6b7280;">
              📍 ${data.sidebar.location || data.sidebar.citizenship}
            </span>
          ` : ''}
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="max-w-4xl mx-auto px-6 py-12">
        <!-- About Section -->
        ${data.career_profile?.summary ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-4" style="color: ${theme.primary};">
              ${data.career_profile.title || 'About Me'}
            </h2>
            <div class="prose max-w-none" style="color: ${theme.text};">
              ${renderMarkdown(data.career_profile.summary)}
            </div>
          </section>
        ` : ''}
        
        <!-- Experience Section -->
        ${data.experiences?.length > 0 ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">
              Experience
            </h2>
            <div class="space-y-6">
              ${data.experiences.map(exp => `
                <div class="p-6 rounded-xl" style="background-color: ${theme.accent};">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold" style="color: ${theme.text};">
                      ${exp.role}
                    </h3>
                    <span class="text-sm" style="color: ${theme.primary};">
                      ${exp.time}
                    </span>
                  </div>
                  <p class="text-sm mb-3" style="color: ${theme.primary};">
                    ${exp.company}
                  </p>
                  <div class="prose prose-sm" style="color: ${theme.text};">
                    ${renderMarkdown(exp.details)}
                  </div>
                  ${exp.tags?.length > 0 ? `
                    <div class="flex flex-wrap gap-2 mt-4">
                      ${exp.tags.map(tag => `
                        <span class="px-3 py-1 rounded-full text-xs font-medium" style="background-color: ${theme.primary}15; color: ${theme.primary};">
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
        
        <!-- Skills Section with Visual Bars -->
        ${data.skills?.length > 0 ? `
          <section class="mb-12">
            <h2 class="text-2xl font-bold mb-6" style="color: ${theme.primary};">
              Skills
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${data.skills.map(skill => `
                <div class="p-4 rounded-xl" style="background-color: ${theme.accent};">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-medium" style="color: ${theme.text};">${skill.name}</span>
                    <span class="text-sm" style="color: ${theme.primary};">${skill.level}%</span>
                  </div>
                  <div class="w-full h-2 rounded-full" style="background-color: ${theme.primary}20;">
                    <div class="h-full rounded-full" style="width: ${skill.level}%; background-color: ${theme.primary};"></div>
                  </div>
                  ${skill.tags?.length > 0 ? `
                    <div class="flex flex-wrap gap-1 mt-3">
                      ${skill.tags.map(tag => `
                        <span class="px-2 py-0.5 rounded text-xs" style="background-color: ${theme.primary}10; color: ${theme.primary};">
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
        
        <!-- Education, Projects, Certifications, Volunteer sections... -->
        
      </main>
      
      <!-- Footer -->
      ${data.footer ? `
        <footer class="text-center py-8" style="background-color: ${theme.accent}; color: ${theme.text}80;">
          <p class="text-sm">${data.footer}</p>
        </footer>
      ` : ''}
    </div>
  `
}
```

### Task 3.2: Update Layout Router

**Files:**
- Modify: `cv-builder/components/cv/CVPreview.tsx`

```typescript
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
    // NEW LAYOUTS
    case 'hero-centered':
      return renderLayoutHeroCentered(data, theme)
    case 'hero-split':
      return renderLayoutHeroSplit(data, theme)
    default:
      return renderLayoutClassic(data, theme)
  }
}
```

### Task 3.3: Add Layout Selection to Builder

**Files:**
- Modify: `cv-builder/components/builder/LayoutSelector.tsx`

Add new layout options:

```typescript
const LAYOUTS = [
  // ... existing layouts
  { id: 'hero-centered', name: 'Hero Centered', description: 'Modern hero section with centered content', preview: '/layouts/hero-centered.png' },
  { id: 'hero-split', name: 'Hero Split', description: 'Hero section with split layout', preview: '/layouts/hero-split.png' },
]
```

---

## Phase 4: Template Migration

### Task 4.1: Convert YAML Templates to JSON

**Files to convert:**
- `templates/cv-examples/data-scientist-example.yml` → `data-scientist.json`
- `templates/cv-examples/milagros-aguilera-cv.yml` → (merge with existing JSON)
- `templates/cv-examples/qa-engineer-example.yml` → `qa-engineer.json`
- `templates/cv-examples/software-developer-example.yml` → `software-developer.json`

**Migration Script:**

```typescript
// scripts/migrate-yaml-to-json.ts
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import { normalizePortfolio } from '../cv-builder/lib/utils/portfolio-normalizer'

const templatesDir = './templates/cv-examples'
const outputDir = './cv-builder/data/portfolios'

const yamlFiles = fs.readdirSync(templatesDir).filter(f => f.endsWith('.yml'))

for (const file of yamlFiles) {
  const yamlContent = fs.readFileSync(path.join(templatesDir, file), 'utf8')
  const data = yaml.load(yamlContent)
  
  // Normalize to new format
  const normalized = normalizePortfolio(data)
  
  // Generate slug from filename
  const slug = file.replace('.yml', '').replace(/-cv$/, '')
  normalized.slug = slug
  
  // Write JSON
  const outputPath = path.join(outputDir, `${slug}.json`)
  fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2))
  
  console.log(`Migrated: ${file} → ${slug}.json`)
}
```

### Task 4.2: Update Portfolio Registry

**Files:**
- Modify: `cv-builder/app/portfolio/[slug]/page.tsx`

```typescript
// Dynamic portfolio loading instead of static imports
async function loadPortfolio(slug: string): Promise<PortfolioV2 | null> {
  // 1. Check database
  const dbPortfolio = await fetchFromDatabase(slug)
  if (dbPortfolio) return normalizePortfolio(dbPortfolio)
  
  // 2. Check static JSON files
  try {
    const portfolioJson = await import(`@/data/portfolios/${slug}.json`)
    return normalizePortfolio(portfolioJson.default)
  } catch {
    // Not found
  }
  
  // 3. Check localStorage (for preview)
  if (typeof window !== 'undefined') {
    const localData = localStorage.getItem(`portfolio-${slug}`)
    if (localData) return normalizePortfolio(JSON.parse(localData))
  }
  
  return null
}
```

### Task 4.3: Deprecate Legacy Templates

**Files:**
- Delete after migration: `templates/cv-examples/*.yml`
- Delete after migration: `templates/cv-examples/*.html`
- Keep: `templates/cv-examples/*.json` (already in new format)

---

## Phase 5: Theme System Cleanup

### Task 5.1: Consolidate Theme Configuration

**Problem:** Theme configuration is duplicated across multiple files:
- `cv-builder/lib/templates.ts` - `COLOR_PALETTES`
- `cv-builder/lib/types/cv.ts` - `THEME_CONFIGS` and `COLOR_PALETTES`
- `cv-builder/lib/design-system.ts` - `colors.themes`
- `cv-builder/lib/utils/theme.ts` - theme utilities

**Solution:** Create single source of truth

**Files:**
- Create: `cv-builder/lib/themes/index.ts`
- Modify: Other files to import from themes/index.ts

```typescript
// cv-builder/lib/themes/index.ts

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  isDark: boolean
  category: 'professional' | 'creative' | 'minimal' | 'dark' | 'gradient'
}

export const THEMES: Theme[] = [
  // Professional
  { id: 'teal', name: 'Teal', primary: '#0D9488', secondary: '#14B8A6', accent: '#F0FDFA', background: '#FFFFFF', text: '#1F2937', isDark: false, category: 'professional' },
  { id: 'blue', name: 'Blue', primary: '#2563EB', secondary: '#3B82F6', accent: '#EFF6FF', background: '#FFFFFF', text: '#1F2937', isDark: false, category: 'professional' },
  // ... all themes
]

export const getTheme = (id: string): Theme => 
  THEMES.find(t => t.id === id) || THEMES[0]

// Re-export for backwards compatibility
export const COLOR_PALETTES = THEMES
export const THEME_CONFIGS = THEMES.map(t => ({
  id: t.id,
  name: t.name,
  primaryColor: t.primary,
  secondaryColor: t.secondary,
  textColor: t.text,
  bgColor: t.background,
  accentColor: t.accent,
  description: `${t.name} theme`,
  category: t.category
}))
```

---

## Database Schema Updates

### Task 6.1: Update Portfolio Table

If using a database, update the schema to support the new format:

```sql
-- Add new columns for v2 schema support
ALTER TABLE portfolios ADD COLUMN layout VARCHAR(50) DEFAULT 'classic';
ALTER TABLE portfolios ADD COLUMN color_palette VARCHAR(50) DEFAULT 'teal';
ALTER TABLE portfolios ADD COLUMN volunteer JSONB DEFAULT '[]';

-- Add indexes for common queries
CREATE INDEX idx_portfolios_layout ON portfolios(layout);
CREATE INDEX idx_portfolios_color_palette ON portfolios(color_palette);
```

### Task 6.2: Data Migration Script

```typescript
// scripts/migrate-database-portfolios.ts
import { normalizePortfolio } from '../cv-builder/lib/utils/portfolio-normalizer'

async function migratePortfolios() {
  const portfolios = await db.portfolio.findMany()
  
  for (const portfolio of portfolios) {
    const normalized = normalizePortfolio(portfolio.data)
    
    await db.portfolio.update({
      where: { id: portfolio.id },
      data: {
        layout: normalized.layout,
        color_palette: normalized.color_palette,
        data: normalized
      }
    })
  }
}
```

---

## Migration Scripts

### Full Migration Script

```bash
#!/bin/bash
# scripts/migrate-to-v2.sh

echo "🚀 Starting Portfolio Schema Migration v2.0"

# Step 1: Run TypeScript migrations
echo "📦 Converting YAML to JSON..."
npx ts-node scripts/migrate-yaml-to-json.ts

# Step 2: Update database (if applicable)
echo "🗄️ Migrating database records..."
npx ts-node scripts/migrate-database-portfolios.ts

# Step 3: Verify migrations
echo "✅ Verifying migrations..."
npx ts-node scripts/verify-migrations.ts

# Step 4: Generate TypeScript types
echo "📝 Generating types..."
npm run generate:types

echo "✨ Migration complete!"
```

---

## Testing Strategy

### Task 7.1: Unit Tests for Normalizer

```typescript
// __tests__/portfolio-normalizer.test.ts
import { normalizePortfolio } from '../lib/utils/portfolio-normalizer'

describe('normalizePortfolio', () => {
  it('should handle new format without changes', () => {
    const newFormat = {
      slug: 'test',
      color_palette: 'lavender',
      layout: 'hero-centered',
      career_profile: { title: 'About', summary: 'Test' },
      experiences: [{ role: 'Dev', time: '2023', company: 'Co', details: 'Work' }],
      skills: [{ name: 'JS', level: 90, tags: ['React'] }]
    }
    
    const result = normalizePortfolio(newFormat)
    expect(result).toEqual(newFormat)
  })
  
  it('should convert legacy experiences format', () => {
    const legacy = {
      experiences: {
        title: 'Experience',
        info: [{ role: 'Dev', time: '2023', company: 'Co', details: 'Work' }]
      }
    }
    
    const result = normalizePortfolio(legacy)
    expect(result.experiences).toHaveLength(1)
    expect(result.experiences[0].role).toBe('Dev')
  })
  
  it('should convert string skill levels to numbers', () => {
    const legacy = {
      skills: {
        toolset: [{ name: 'JS', level: '90%' }]
      }
    }
    
    const result = normalizePortfolio(legacy)
    expect(result.skills[0].level).toBe(90)
    expect(typeof result.skills[0].level).toBe('number')
  })
})
```

### Task 7.2: Visual Regression Tests

Use Playwright or Cypress to capture screenshots of all layouts and compare before/after migration.

### Task 7.3: E2E Tests

```typescript
// __tests__/e2e/portfolio-page.test.ts
import { test, expect } from '@playwright/test'

test('Victoria Rolon portfolio renders correctly', async ({ page }) => {
  await page.goto('/portfolio/victoria-rolon')
  
  // Check hero section
  await expect(page.locator('h1')).toContainText('Victoria')
  
  // Check experience section
  await expect(page.locator('text=Experience')).toBeVisible()
  
  // Check skills with progress bars
  const skillBars = page.locator('[class*="skill"]')
  await expect(skillBars.first()).toBeVisible()
  
  // Check tags are rendered
  const tags = page.locator('[class*="tag"]')
  await expect(tags.first()).toBeVisible()
})
```

---

## Timeline & Priority

| Phase | Task | Priority | Effort | Dependencies |
|-------|------|----------|--------|--------------|
| 1 | Schema Definition | High | 1 day | None |
| 1 | Data Normalizer | High | 2 days | Schema |
| 2 | CVPreview Updates | High | 3 days | Normalizer |
| 3 | Hero-Centered Layout | Medium | 2 days | CVPreview |
| 3 | Hero-Split Layout | Medium | 2 days | CVPreview |
| 4 | YAML Migration | Medium | 1 day | Normalizer |
| 4 | Registry Update | Medium | 1 day | Migration |
| 5 | Theme Cleanup | Low | 2 days | None |
| 6 | Database Updates | Low | 1 day | Schema |
| 7 | Testing | High | 3 days | All |

**Total Estimated Time:** 2-3 weeks

---

## Success Metrics

1. **Data Consistency:** 100% of portfolios use normalized v2 schema
2. **Rendering Accuracy:** All layouts render correctly with new schema
3. **Backwards Compatibility:** Existing portfolios continue to work
4. **Performance:** No degradation in page load times
5. **Test Coverage:** >80% coverage for normalizer and renderers

---

## Rollback Plan

If issues arise:

1. **Feature Flag:** Wrap new normalizer in feature flag
2. **Database Backup:** Snapshot before migration
3. **Gradual Rollout:** Deploy to staging first
4. **Monitoring:** Track errors in Sentry/similar

```typescript
// Feature flag implementation
const useV2Schema = process.env.NEXT_PUBLIC_USE_V2_SCHEMA === 'true'

const portfolioData = useV2Schema 
  ? normalizePortfolio(rawData)
  : rawData
```

---

## Next Steps

1. [ ] Review this plan with the team
2. [ ] Create feature branch: `feature/portfolio-schema-v2`
3. [ ] Start with Phase 1: Schema definition
4. [ ] Set up CI/CD for visual regression tests
5. [ ] Schedule migration window for production

---

*Created: January 8, 2026*
*Last Updated: January 8, 2026*
*Author: AI Assistant*

