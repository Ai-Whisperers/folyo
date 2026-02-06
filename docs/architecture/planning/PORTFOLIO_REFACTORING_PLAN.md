# Portfolio Templates Refactoring Plan

## Objective
Standardize all portfolio templates to use the `victoria-rolon.json` exemplar format with:
- Landing page layout variations
- Simple color palette system
- Rich content structure

---

## Current State Analysis

### Exemplar Template: `victoria-rolon.json`
**Key characteristics:**

1. **Rich Markdown Content**: Formatted text with bold, bullets, structured sections
2. **Detailed Entries**: Achievements, metrics, and tags per role
3. **Skill Structure**: `level` (0-100) + `tags` array for sub-skills
4. **Landing Layout**: `template_layout: "landing"` for modern single-page feel
5. **Flat Arrays**: Languages, interests, experiences as direct arrays
6. **Footer Info**: Location, availability, contact details

### Problems to Fix

1. **PortfolioView.tsx**:
   - Expects nested format (`experiences.info`) vs flat arrays
   - Expects `career-profile` vs `career_profile`
   - Expects `interests.info[{item}]` vs string arrays

2. **Type Definitions**: Don't match new flat format

---

## Color Palette System

Replace complex theme configs with simple color palettes:

```typescript
export interface ColorPalette {
  id: string
  name: string
  primary: string      // Main accent color
  secondary: string    // Secondary accent
  background: string   // Page background
  surface: string      // Card/section background
  text: string         // Primary text
  muted: string        // Secondary text
  isDark: boolean      // Dark mode flag
}

export const COLOR_PALETTES: ColorPalette[] = [
  // Light Palettes
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#0891B2',
    secondary: '#06B6D4',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#9333EA',
    secondary: '#A855F7',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#059669',
    secondary: '#10B981',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'sunset',
    name: 'Sunset',
    primary: '#F97316',
    secondary: '#FB923C',
    background: '#FFFBF5',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'rose',
    name: 'Rose',
    primary: '#E11D48',
    secondary: '#F43F5E',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  {
    id: 'slate',
    name: 'Slate',
    primary: '#475569',
    secondary: '#64748B',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    muted: '#666666',
    isDark: false
  },
  // Dark Palettes
  {
    id: 'midnight',
    name: 'Midnight',
    primary: '#6366F1',
    secondary: '#818CF8',
    background: '#0A0A0A',
    surface: '#141414',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    isDark: true
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    background: '#0A0A0A',
    surface: '#141414',
    text: '#FFFFFF',
    muted: '#A0A0A0',
    isDark: true
  }
]
```

---

## Landing Page Layout Variations

All layouts use the landing page format with different section arrangements:

### Layout 1: `hero-centered` (Default - like victoria-rolon)
```
+------------------------------------------+
|              HERO (centered)              |
|         Avatar | Name | Tagline          |
|            CTA Buttons                    |
+------------------------------------------+
|  MAIN CONTENT (2/3)  |  SIDEBAR (1/3)    |
|  - About             |  - Contact        |
|  - Experience        |  - Languages      |
|  - Education         |  - Interests      |
|  - Skills            |  - Share          |
|  - Projects          |                   |
+------------------------------------------+
|              FOOTER                       |
+------------------------------------------+
```

### Layout 2: `hero-split`
```
+------------------------------------------+
|  AVATAR/PHOTO  |  NAME + TAGLINE         |
|    (40%)       |  + CTA BUTTONS (60%)    |
+------------------------------------------+
|  SIDEBAR (1/3)   |  MAIN CONTENT (2/3)   |
|  - Contact       |  - About              |
|  - Languages     |  - Experience         |
|  - Interests     |  - Skills             |
+------------------------------------------+
|              FOOTER                       |
+------------------------------------------+
```

### Layout 3: `hero-minimal`
```
+------------------------------------------+
|  Name                        [Contact]   |
+------------------------------------------+
|              ABOUT SECTION                |
|         (full width, prominent)          |
+------------------------------------------+
|  EXPERIENCE  |  EDUCATION  |  SKILLS     |
|   (card)     |   (card)    |   (card)    |
+------------------------------------------+
|              PROJECTS GRID                |
+------------------------------------------+
|              FOOTER                       |
+------------------------------------------+
```

### Layout 4: `hero-fullscreen`
```
+------------------------------------------+
|                                          |
|              HERO (100vh)                 |
|         Avatar | Name | Tagline          |
|            Scroll Indicator              |
|                                          |
+------------------------------------------+
|              ABOUT (full width)          |
+------------------------------------------+
|              EXPERIENCE TIMELINE          |
+------------------------------------------+
|              SKILLS GRID                  |
+------------------------------------------+
|              PROJECTS                     |
+------------------------------------------+
|              FOOTER                       |
+------------------------------------------+
```

---

## Data Structure (New Standard)

```typescript
export interface PortfolioData {
  slug: string
  color_palette: string           // e.g., 'ocean', 'midnight'
  layout: 'hero-centered' | 'hero-split' | 'hero-minimal' | 'hero-fullscreen'

  sidebar: {
    position: 'left' | 'right'
    name: string
    tagline: string
    avatar?: string
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
    website?: string
    languages: Array<{ idiom: string; level: string }>
  }

  interests: string[]

  career_profile: {
    title: string
    summary: string
  }

  education: Array<{
    degree: string
    university: string
    time: string
    details?: string
  }>

  experiences: Array<{
    role: string
    time: string
    company: string
    details?: string
    tags?: string[]
    icon?: string
  }>

  projects: Array<{
    title: string
    time?: string
    details?: string
    link?: string
  }>

  certifications: Array<{
    name: string
    start: string
    organization: string
    details?: string
  }>

  skills: Array<{
    name: string
    level: number
    tags?: string[]
  }>

  volunteer?: Array<{
    role: string
    time: string
    company: string
    details?: string
    tags?: string[]
  }>

  footer?: string
}
```

---

## Implementation Phases

### Phase 1: Simplify Color System
**Files**: `cv-builder/lib/utils/theme.ts`, `cv-builder/lib/types/cv.ts`

1. Create `ColorPalette` interface
2. Define 8 color palettes (6 light, 2 dark)
3. Add `getColorPalette(id)` helper function

### Phase 2: Create Layout Components
**Files**: `cv-builder/components/portfolio/layouts/`

1. `HeroCentered.tsx` - Current victoria-rolon style
2. `HeroSplit.tsx` - Side-by-side hero
3. `HeroMinimal.tsx` - Compact header, card grid
4. `HeroFullscreen.tsx` - Full viewport hero

### Phase 3: Update PortfolioView
**File**: `cv-builder/components/portfolio/PortfolioView.tsx`

1. Add data normalizer for backward compatibility
2. Switch layout based on `data.layout`
3. Use color palette instead of theme configs

### Phase 4: Create Example Templates
**Location**: `templates/cv-examples/`

| Template | Layout | Palette | Focus |
|----------|--------|---------|-------|
| `developer-portfolio.json` | hero-centered | midnight | Tech, GitHub, code |
| `designer-portfolio.json` | hero-split | lavender | Visual, projects |
| `marketing-portfolio.json` | hero-minimal | sunset | Campaigns, metrics |
| `executive-portfolio.json` | hero-fullscreen | slate | Leadership, strategy |

### Phase 5: Update Existing Data
- Migrate `milagros-aguilera.json` to new format
- Update `cv-standard-template.json`

---

## File Changes Summary

| File | Action |
|------|--------|
| `lib/types/cv.ts` | Add `PortfolioData`, `ColorPalette` types |
| `lib/utils/theme.ts` | Replace with simple palette system |
| `components/portfolio/PortfolioView.tsx` | Add normalizer, layout switching |
| `components/portfolio/layouts/HeroCentered.tsx` | New file |
| `components/portfolio/layouts/HeroSplit.tsx` | New file |
| `components/portfolio/layouts/HeroMinimal.tsx` | New file |
| `components/portfolio/layouts/HeroFullscreen.tsx` | New file |
| `templates/cv-examples/*.json` | 4 new example files |
| `data/portfolios/milagros-aguilera.json` | Migrate to new format |

---

## Implementation Status: COMPLETE

### Completed Files

**Types & Utilities:**
- `lib/types/cv.ts` - Added `PortfolioData`, `ColorPalette`, `normalizePortfolioData()`

**Shared Components:**
- `components/portfolio/shared/index.tsx` - Reusable components for all layouts

**Layout Components:**
- `components/portfolio/layouts/HeroCentered.tsx` - Default victoria-rolon style
- `components/portfolio/layouts/HeroSplit.tsx` - Side-by-side hero
- `components/portfolio/layouts/HeroMinimal.tsx` - Compact card-based
- `components/portfolio/layouts/HeroFullscreen.tsx` - Full viewport hero

**Main Component:**
- `components/portfolio/PortfolioView.tsx` - Updated with normalizer and layout switching

**Example Templates:**
- `templates/cv-examples/developer-portfolio.json` - midnight, hero-centered
- `templates/cv-examples/designer-portfolio.json` - lavender, hero-split
- `templates/cv-examples/marketing-portfolio.json` - sunset, hero-minimal
- `templates/cv-examples/executive-portfolio.json` - slate, hero-fullscreen

**Migrated Data:**
- `data/portfolios/milagros-aguilera.json` - Updated to new format
- `data/portfolios/victoria-rolon.json` - Updated fields

---

## Testing Checklist

- [ ] All 4 layouts render correctly
- [ ] All 8 color palettes apply properly
- [ ] Dark mode palettes work
- [ ] Old format data still renders (backward compat)
- [ ] Skills progress bars animate
- [ ] Markdown formatting in summaries
- [ ] Mobile responsive for all layouts
- [ ] Smooth scroll navigation works

---

## Migration Notes

**Backward Compatibility**:
```typescript
// Normalizer handles old format
const palette = data.color_palette || data.theme_skin || 'ocean'
const layout = data.layout || data.template_layout || 'hero-centered'
```

**Deprecation Path**:
- `theme_skin` -> `color_palette`
- `template_layout` -> `layout`
- Nested arrays -> flat arrays
