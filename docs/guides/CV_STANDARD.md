# CV Standard v2.0

> Based on Victoria Rolon's portfolio - The new standard for professional CVs

## Overview

This document defines the standard format for creating professional CVs in the Folyo CV Builder. The standard is based on Victoria Rolon's portfolio, which exemplifies best practices for modern, impactful professional presentations.

## Key Principles

1. **Rich Content with Markdown Support** - Use bold, bullets, and structure
2. **Visual Hierarchy** - Skill levels (0-100) and tag categorization
3. **Complete Professional Information** - All relevant contact and profile data
4. **Flexible yet Structured** - Consistent schema with optional fields

## Data Structure

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | URL-friendly identifier |
| `theme_skin` | string | Theme identifier (teal, lavender, etc.) |
| `template_layout` | string | Layout style (landing, classic, modern, etc.) |
| `sidebar` | object | Profile and contact information |
| `career_profile` | object | Professional summary |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `experiences` | array | Work history (most recent first) |
| `education` | array | Educational background |
| `skills` | array | Professional skills with levels |
| `certifications` | array | Certifications and training |
| `projects` | array | Notable projects |
| `volunteer` | array | Volunteer work |
| `interests` | array | Professional interests (strings) |
| `footer` | string | Additional info line |

## Sidebar Structure

```json
{
  "name": "Full Name",
  "tagline": "Title | Specialization | Role",
  "avatar": "/uploads/photo.jpeg",
  "email": "email@example.com",
  "phone": "+1 555 123 4567",
  "timezone": "America/New_York",
  "citizenship": "City, Country",
  "linkedin": "username",
  "github": "username",
  "languages": [
    { "idiom": "English", "level": "Native" },
    { "idiom": "Spanish", "level": "Professional" }
  ]
}
```

## Career Profile Best Practices

The career profile should follow this structure:

1. **Opening Statement** - Strong professional identity
2. **Value Proposition** - What makes you unique
3. **Key Strengths** - 3-5 bullet points
4. **Closing** - Readiness/availability statement

### Markdown Formatting

- Use `**bold**` for key terms and metrics
- Use bullet points for lists
- Keep under 300 words
- Strategic emoji use is optional

### Example

```
**Emerging IT professional** with passion for technology and drive toward excellence.

I bring a unique combination of **technical expertise** and **business acumen** to every role.

**Key Strengths:**
- Rapid problem diagnosis and resolution
- Cross-functional team collaboration
- Process optimization

I am a **proactive**, **adaptable** professional ready to make immediate impact.
```

## Skills Structure

Each skill should include:

```json
{
  "name": "Skill Category Name",
  "level": 85,
  "tags": ["Sub-skill 1", "Sub-skill 2", "Technology", "Tool"]
}
```

### Level Guidelines

| Level | Description |
|-------|-------------|
| 90-100 | Expert / Native |
| 80-89 | Advanced / Professional |
| 70-79 | Proficient |
| 60-69 | Intermediate |
| 50-59 | Basic |
| <50 | Beginner |

### Recommended Skill Categories

1. Primary Technical Skill
2. Secondary Technical Skill
3. Software/Tools Proficiency
4. Creative/Design Skills (if applicable)
5. Administrative Skills
6. Customer Service Excellence
7. Professional Soft Skills

## Experience Structure

```json
{
  "role": "Job Title",
  "company": "Company Name",
  "time": "2023 - Present",
  "details": "**Key contribution** description...\n\n**Achievements:**\n- Achievement 1\n- Achievement 2",
  "tags": ["Skill 1", "Tool 1", "Technology"],
  "icon": "desktop"
}
```

### Details Best Practices

- Start with a **bold** summary of responsibility
- Include measurable achievements with numbers
- Use bullet points for multiple accomplishments
- Add relevant tags for skills demonstrated

## Education Structure

```json
{
  "degree": "Degree Name",
  "university": "Institution Name",
  "time": "2020 - 2024",
  "details": "**Graduated with Honors**\n\n**Specializations:**\n- Focus area 1\n- Focus area 2"
}
```

## Certifications Structure

```json
{
  "name": "Certification Name",
  "organization": "Issuing Organization",
  "start": "2024",
  "details": "**Specialized Training:**\n- Skill covered 1\n- Skill covered 2"
}
```

## Template Layouts

| Layout | Description | Best For |
|--------|-------------|----------|
| `landing` | Premium landing page style | Portfolios, personal branding |
| `classic` | Traditional CV layout | Corporate applications |
| `modern` | Contemporary design | Tech roles |
| `minimal` | Clean, minimalist | Design roles |
| `creative` | Bold, artistic | Creative industries |
| `executive` | Corporate, professional | Senior positions |
| `compact` | Space-efficient | One-page CVs |
| `timeline` | Chronological focus | Career progression |
| `cards` | Card-based sections | Visual portfolios |

## Theme Skins

### Light Themes
- `teal` - Professional teal (default)
- `blue` - Classic blue
- `lavender` - Soft purple
- `rose` - Warm pink
- `amber` - Golden warm
- `emerald` - Fresh green

### Dark Themes
- `midnight` - Deep blue-black
- `ocean` - Dark teal
- `charcoal` - Dark gray

## File Locations

- **Schema Types**: `cv-builder/lib/types/cv-standard.ts`
- **Template Example**: `templates/cv-examples/cv-standard-template.json`
- **Victoria Rolon Reference**: `cv-builder/data/portfolios/victoria-rolon.json`

## Migration Guide

To convert an existing CV to the new standard:

1. Ensure `template_layout` is set (use `"landing"` for best results)
2. Convert `sidebar.languages` to array of `{ idiom, level }` objects
3. Add `level` (0-100) and `tags` to all skills
4. Add `tags` and `icon` to experiences
5. Use markdown formatting in `details` fields
6. Add `footer` with availability info

## Validation

Use the TypeScript types in `cv-standard.ts` for validation:

```typescript
import { CVStandard, createCVStandard } from '@/lib/types/cv-standard'

// Create new CV
const cv = createCVStandard('John Doe', 'Software Engineer')

// Validate existing data
function validateCV(data: unknown): data is CVStandard {
  // Type checking logic
}
```

---

**Version**: 2.0.0
**Based on**: Victoria Rolon Portfolio
**Last Updated**: January 2026
