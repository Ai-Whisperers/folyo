# Project Requirements Document (PRD)
# Folyo - Professional Portfolio Webpage Builder

**Version:** 1.0.0
**Date:** 2025-12-18
**Status:** Active Development
**Branch:** AnaCV

---

## 1. Executive Summary

### 1.1 Project Vision
Transform static PDF resumes into dynamic, shareable living portfolios that can be viewed online via link/QR code AND downloaded as professional PDFs for traditional job applications.

### 1.2 Target Users
- **Primary:** Spanish-speaking job seekers in Paraguay and Latin America
- **Secondary:** Global users (future multi-language support)
- **Industry Focus:** Administrative, business, general professional roles

### 1.3 Core Value Proposition
- **Online Portfolio:** Shareable link + QR code for modern job applications
- **PDF Export:** High-quality downloadable CV for traditional applications
- **AI Enhancement:** Automatic text refinement and information organization
- **Multiple Themes:** 8 professional color schemes

---

## 2. Functional Requirements

### 2.1 Core Features (MVP)

#### FR-001: Portfolio Builder Interface
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001.1 | Real-time preview as user types | P0 | Implemented |
| FR-001.2 | Section-based form (Profile, Experience, Education, Skills, etc.) | P0 | Implemented |
| FR-001.3 | Add/remove/reorder items within sections | P0 | Implemented |
| FR-001.4 | Profile photo upload with optimization | P1 | Implemented |
| FR-001.5 | Markdown support in text fields | P1 | Implemented |
| FR-001.6 | Auto-save functionality | P1 | Implemented |

#### FR-002: Theme System
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-002.1 | 8 professional color themes | P0 | Implemented |
| FR-002.2 | Live theme switching | P0 | Implemented |
| FR-002.3 | Theme persistence across sessions | P1 | Implemented |
| FR-002.4 | Dark/light mode toggle | P2 | Planned |

#### FR-003: PDF Export (Critical)
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-003.1 | Client-side PDF generation (works offline) | P0 | Implemented |
| FR-003.2 | Professional print-optimized layout | P0 | Implemented |
| FR-003.3 | Consistent formatting with web preview | P0 | Partial |
| FR-003.4 | Spanish character support (UTF-8) | P0 | Implemented |
| FR-003.5 | Server-side PDF generation (higher quality) | P1 | Planned |
| FR-003.6 | Multiple page support | P1 | Planned |

#### FR-004: Online Sharing
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-004.1 | Public portfolio URL with custom slug | P0 | Implemented |
| FR-004.2 | QR code generation for portfolio link | P0 | **NEW** |
| FR-004.3 | Social media sharing buttons | P2 | Planned |
| FR-004.4 | SEO optimization for public portfolios | P2 | Planned |

#### FR-005: AI Content Enhancement
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-005.1 | Text refinement (casual to professional) | P0 | Implemented |
| FR-005.2 | Information organization suggestions | P0 | Implemented |
| FR-005.3 | ATS keyword optimization | P1 | Implemented |
| FR-005.4 | Multiple alternative suggestions | P1 | Implemented |
| FR-005.5 | Job description analysis | P1 | Implemented |
| FR-005.6 | Graceful degradation when AI unavailable | P0 | Implemented |

#### FR-006: Data Export
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-006.1 | Export as PDF | P0 | Implemented |
| FR-006.2 | Export as JSON | P1 | Implemented |
| FR-006.3 | Export as YAML (Jekyll compatible) | P1 | Implemented |

### 2.2 User Management (Phase 2)

#### FR-007: Authentication
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-007.1 | Email/password registration | P1 | Partial |
| FR-007.2 | Social login (Google, LinkedIn) | P2 | Planned |
| FR-007.3 | Password reset flow | P1 | Planned |
| FR-007.4 | Session management | P1 | Partial |

#### FR-008: Dashboard
| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-008.1 | List user's portfolios | P1 | Implemented |
| FR-008.2 | Portfolio analytics (views, downloads) | P2 | Implemented |
| FR-008.3 | Duplicate/archive portfolios | P2 | Planned |

---

## 3. Non-Functional Requirements

### 3.1 Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Page load time | < 3 seconds |
| NFR-002 | PDF generation time | < 5 seconds |
| NFR-003 | Real-time preview update | < 100ms |
| NFR-004 | API response time | < 500ms |

### 3.2 Compatibility
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-005 | Browser support | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| NFR-006 | Mobile responsive | iOS Safari, Android Chrome |
| NFR-007 | Print compatibility | Standard A4/Letter paper |
| NFR-008 | Character encoding | UTF-8 (Spanish, Portuguese characters) |

### 3.3 Accessibility
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-009 | WCAG compliance | Level AA |
| NFR-010 | Keyboard navigation | Full support |
| NFR-011 | Screen reader compatibility | Basic support |

### 3.4 Security
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-012 | HTTPS enforcement | Required in production |
| NFR-013 | Rate limiting | 100 requests/15min per IP |
| NFR-014 | Input sanitization | All user inputs |
| NFR-015 | File upload validation | Type + size limits |

### 3.5 Reliability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-016 | Uptime | 99.5% |
| NFR-017 | Graceful degradation | Core features work without DB/AI |
| NFR-018 | Data backup | Daily (when DB enabled) |

---

## 4. Technical Architecture

### 4.1 System Components

```
+------------------+     +------------------+     +------------------+
|   Jekyll Site    |     |   Next.js App    |     |  Express API     |
|   (Static CV)    |     |   (Portfolio     |     |  (Backend)       |
|                  |     |    Builder)      |     |                  |
|  - GitHub Pages  |     |  - React 18      |     |  - REST API      |
|  - 8 Themes      |     |  - Tailwind CSS  |     |  - MongoDB       |
|  - YAML Data     |     |  - TypeScript    |     |  - OpenAI        |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        |                        v                        |
        |                +------------------+             |
        +--------------->|   Shared Data    |<------------+
                         |   (_data/data.yml)|
                         +------------------+
```

### 4.2 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Next.js | 14.x |
| Frontend | React | 18.x |
| Frontend | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| Backend | Express.js | 4.x |
| Database | MongoDB | 8.x (optional) |
| AI | OpenAI API | GPT-4 |
| PDF | html2canvas + jsPDF | Latest |
| Static Site | Jekyll | 4.x |

### 4.3 External Dependencies

| Service | Required | Purpose |
|---------|----------|---------|
| MongoDB | Optional | User data persistence |
| OpenAI API | Optional | AI text enhancement |
| AWS S3 | Optional | File storage |
| GitHub Pages | Optional | Static site hosting |

---

## 5. Data Models

### 5.1 CV/Portfolio Schema

```typescript
interface Portfolio {
  // Identity
  id: string;
  slug: string;
  title: string;

  // Theme
  theme: {
    skin: 'blue' | 'turquoise' | 'green' | 'berry' |
          'orange' | 'ceramic' | 'teal' | 'oceanstale';
    sidebarPosition: 'left' | 'right';
  };

  // Content Sections
  sidebar: {
    name: string;           // Required
    tagline?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    website?: string;
    linkedin?: string;
    github?: string;
    citizenship?: string;
    timezone?: string;
    languages?: Language[];
  };

  careerProfile: {
    title: string;
    summary: string;        // Markdown supported
  };

  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects?: Project[];
  certifications?: Certification[];
  volunteer?: Experience[];
  interests?: string[];

  // Publishing
  isPublic: boolean;
  publicUrl?: string;
  qrCode?: string;          // NEW: QR code data URL

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastEditedAt: Date;
}
```

### 5.2 Section Interfaces

```typescript
interface Experience {
  role: string;
  company: string;
  time: string;
  location?: string;
  details?: string;         // Markdown supported
  tags?: string[];
  icon?: string;
}

interface Education {
  degree: string;
  university: string;
  time: string;
  details?: string;
}

interface Skill {
  name: string;
  level: number;            // 0-100
  tags?: string[];
}

interface Project {
  title: string;
  time?: string;
  link?: string;
  details?: string;
}

interface Certification {
  name: string;
  organization: string;
  start?: string;
  end?: string;
  details?: string;
}

interface Language {
  idiom: string;
  level: string;
}
```

---

## 6. API Specification

### 6.1 Core Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/health | Health check with status | No |
| GET | /api/themes | Available themes list | No |

### 6.2 Portfolio Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/cv/save | Create/update portfolio | Yes |
| GET | /api/cv/:id | Get portfolio by ID | Partial |
| DELETE | /api/cv/:id | Delete portfolio | Yes |
| POST | /api/cv/:id/publish | Publish portfolio | Yes |
| POST | /api/cv/:id/unpublish | Unpublish portfolio | Yes |

### 6.3 Export Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/cv/export/pdf | Export as PDF | Yes |
| POST | /api/cv/export/json | Export as JSON | Yes |
| POST | /api/cv/export/yaml | Export as YAML | Yes |
| GET | /api/cv/:id/qrcode | Generate QR code | No |

### 6.4 AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/ai/enhance | Enhance text content | Yes |
| POST | /api/ai/analyze-job | Analyze job description | Yes |
| POST | /api/ai/evaluate-cv | Evaluate CV quality | Yes |

---

## 7. User Interface Requirements

### 7.1 Builder Page Layout

```
+------------------------------------------------------------------+
|  Header: Logo | Theme Selector | Export Button | Save Status     |
+------------------------------------------------------------------+
|                    |                                              |
|   Form Sections    |           Live Preview                      |
|                    |                                              |
|   [Profile]        |   +----------------------------------+      |
|   [Experience]     |   |  Name                            |      |
|   [Education]      |   |  Tagline                         |      |
|   [Skills]         |   |  Contact Info                    |      |
|   [Projects]       |   |                                  |      |
|   [Certifications] |   |  Experience Section              |      |
|   [Languages]      |   |  Education Section               |      |
|   [Interests]      |   |  Skills Section                  |      |
|                    |   +----------------------------------+      |
|                    |                                              |
+------------------------------------------------------------------+
|  Footer: QR Code | Share Link | Download PDF                     |
+------------------------------------------------------------------+
```

### 7.2 Mobile Layout

```
+----------------------+
|  Header              |
+----------------------+
|                      |
|   Tab: Edit | Preview|
|                      |
|   [Current Tab       |
|    Content]          |
|                      |
+----------------------+
|  Actions Bar         |
+----------------------+
```

### 7.3 Theme Colors

| Theme | Primary Color | Use Case |
|-------|---------------|----------|
| blue | #2E86AB | Corporate, Business |
| turquoise | #17a2b8 | Tech, Startups |
| green | #28a745 | Environment, Health |
| berry | #8e44ad | Design, Creative |
| orange | #fd7e14 | Marketing, Sales |
| ceramic | #d4926d | Consulting, Education |
| teal | #20c997 | Finance, Analytics |
| oceanstale | #6c757d | Conservative, Legal |

---

## 8. Localization Requirements

### 8.1 Phase 1 (Current)
- **Primary Language:** Spanish (es-PY, es-ES)
- **Character Support:** Full UTF-8 (accents, special characters)
- **Date Format:** DD/MM/YYYY
- **Number Format:** 1.000,00

### 8.2 Phase 2 (Future)
- **Additional Languages:** English, Portuguese
- **RTL Support:** Not required
- **Currency:** Not applicable

---

## 9. QR Code Feature (NEW)

### 9.1 Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| QR-001 | Generate QR code for public portfolio URL | P0 |
| QR-002 | Display QR code in preview/export | P0 |
| QR-003 | Include QR code in PDF export | P1 |
| QR-004 | Downloadable QR code image (PNG) | P1 |
| QR-005 | Customizable QR code colors (match theme) | P2 |

### 9.2 Implementation

```typescript
// QR Code Generation
import QRCode from 'qrcode';

async function generateQRCode(portfolioUrl: string): Promise<string> {
  return await QRCode.toDataURL(portfolioUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
}
```

---

## 10. Acceptance Criteria

### 10.1 MVP Completion Criteria

- [ ] User can create portfolio with all sections
- [ ] User can select from 8 themes
- [ ] User can preview portfolio in real-time
- [ ] User can export portfolio as PDF (client-side)
- [ ] User can generate shareable public link
- [ ] User can generate QR code for portfolio
- [ ] AI enhancement works when API key configured
- [ ] System works without database (local mode)
- [ ] Spanish characters display correctly
- [ ] Mobile responsive design works

### 10.2 Quality Gates

| Gate | Criteria |
|------|----------|
| Code Quality | No TypeScript errors |
| Performance | Lighthouse score > 80 |
| Accessibility | No critical WCAG violations |
| Security | No high/critical vulnerabilities |
| Testing | Core flows manually tested |

---

## 11. Development Phases

### Phase 1: MVP (Current)
- [x] Jekyll template with themes
- [x] Next.js builder interface
- [x] Real-time preview
- [x] PDF export (client-side)
- [x] AI text enhancement
- [x] Optional database support
- [ ] QR code generation
- [ ] Public portfolio URLs

### Phase 2: Enhanced Features
- [ ] User authentication
- [ ] Multiple portfolios per user
- [ ] Server-side PDF generation
- [ ] Analytics dashboard
- [ ] Social sharing

### Phase 3: Scale
- [ ] Multi-language support
- [ ] Premium themes
- [ ] Custom domains
- [ ] Team/organization features

---

## 12. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OpenAI API costs | Medium | Medium | Graceful degradation, caching |
| MongoDB unavailable | Low | Low | Local storage fallback |
| PDF quality issues | High | Medium | Server-side generation option |
| Browser compatibility | Medium | Low | Progressive enhancement |
| Character encoding | High | Low | Explicit UTF-8 everywhere |

---

## 13. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| PDF Export Success Rate | > 95% | Error tracking |
| Page Load Time | < 3s | Lighthouse |
| User Satisfaction | > 4/5 | Feedback |
| Portfolio Completion Rate | > 70% | Analytics |

---

## Appendix A: Current Data File (Milagros CV)

Located at: `_data/data.yml`

This serves as the reference implementation for the Spanish-language administrative professional portfolio.

---

## Appendix B: Environment Variables

```env
# Required for full functionality
MONGODB_URI=mongodb://localhost:27017/cv-builder
OPENAI_API_KEY=sk-...

# Optional configuration
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000
NODE_ENV=development
PORT=5000

# Feature flags
SKIP_DB=false
```

---

**Document maintained by:** Development Team
**Last updated:** 2025-12-18
**Next review:** Upon Phase 1 completion
