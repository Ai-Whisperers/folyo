# 🎯 Folyo - Professional Portfolio & CV Builder

> **Create living portfolios that get you hired.** Beautiful, shareable web portfolios with videos, galleries, and analytics.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-black?style=for-the-badge)

## 📚 Quick Navigation

| Section | Purpose | Key Files |
|---------|---------|-----------|
| **[cv-builder/](#cv-builder)** | Main Next.js 14 application | `app/`, `components/`, `lib/` |
| **[.claude/](#claude)** | AI assistant configuration | `CLAUDE.md`, `commands/` |
| **[docs/](#docs)** | Architecture & guides | `architecture/`, `guides/` |
| **[scripts/](#scripts)** | Dev tools & validators | `development/`, `validation/` |
| **[deprecated/](#deprecated)** | Legacy files (archived) | `jekyll/`, `templates/` |

---

## cv-builder/

**The main Next.js 14 application. Start here for all development work.**

### 🚀 Entry Points

| File | Purpose | Route |
|------|---------|-------|
| `app/page.tsx` | Homepage with Framer Motion animations | `/` |
| `app/cv/[slug]/page.tsx` | Dynamic CV viewer | `/cv/:slug` |
| `app/portfolio/[slug]/page.tsx` | Dynamic portfolio viewer | `/portfolio/:slug` |
| `app/builder/page.tsx` | CV builder interface | `/builder` |
| `app/dashboard/page.tsx` | User dashboard | `/dashboard` |

### 📖 Source of Truth Files

**These define the canonical data structures and business logic:**

| File | Purpose | Key Exports |
|------|---------|-------------|
| `lib/types/portfolio-schema.ts` | **PortfolioV2 schema** | `PortfolioV2`, `isLegacyFormat()`, `validatePortfolioV2()` |
| `lib/types/cv.ts` | CV types & 40+ themes | `CV`, `THEME_CONFIGS[]`, `ThemeSkin` |
| `lib/themes/index.ts` | Layout definitions | `getLayout()`, `getRecommendedLayouts()`, `LAYOUT_CATEGORIES` |
| `lib/design-system.ts` | Design tokens | Animation configs, color scales |
| `package.json` | Dependencies & scripts | `npm run dev`, `npm run test` |

### 🔧 Key Functions

**Data Normalization** (`lib/utils/portfolio-normalizer.ts`)
```typescript
normalizePortfolio(data, slug)      // Convert legacy → V2
normalizeLegacyPortfolio(data)      // Handle old nested structures
generateSlugFromName(name)          // URL-safe slugs
needsNormalization(data)            // Check format
```

**CV Rendering** (`components/cv/CVPreview.tsx` - 140KB, 11 layouts)
```typescript
renderLayoutClassic(data, theme)    // Traditional sidebar
renderLayoutModern(data, theme)     // Contemporary split
renderLayoutMinimal(data, theme)    // Clean design
renderLayoutCreative(data, theme)   // Bold layout
renderLayoutExecutive(data, theme)  // Professional style
renderLayoutTimeline(data, theme)   // Chronological
renderLayoutCards(data, theme)      // Card-based
renderLayoutLanding(data, theme)    // Landing page
renderLayoutHeroCentered(data, theme) // Hero style
renderDarkTheme(data, theme)        // Dark mode
renderGradientTheme(data, theme)    // Gradient themes
```

**Theme System** (`lib/themes/index.ts`)
```typescript
getLayout(id)                       // Layout configuration
getAllLayouts()                     // All available layouts
getLayoutsByCategory(category)      // Filter: professional/creative/minimal
getRecommendedLayouts(themeId)      // Theme → layout mapping
isDarkTheme(themeId)                // Boolean check
```

### 🧩 Component Architecture

```
components/
├── ai/                         # AI-powered builder
│   ├── AIAssistant.tsx
│   └── AIConversationFlow.tsx
├── common/                     # Shared UI (28KB total)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ColorPicker.tsx         # Theme selection
│   ├── TemplateSelector.tsx    # Layout picker
│   ├── ThemeSwitcher.tsx       # Dark/light mode
│   ├── ImageUpload.tsx         # Drag & drop upload
│   ├── ExportButton.tsx        # PDF/JSON/YAML export
│   └── ErrorBoundary.tsx
├── cv/                         # CV components (184KB total)
│   ├── CVBuilderForm.tsx       # Main form (44KB)
│   ├── CVPreview.tsx           # 11 layout renderers (140KB)
│   ├── PortfolioSection.tsx    # Portfolio display
│   ├── VideoPortfolioSection.tsx
│   ├── ImageGallerySection.tsx
│   ├── DeveloperProfileSection.tsx
│   ├── ShareSection.tsx        # Social sharing
│   └── AnalyticsCard.tsx       # View analytics
├── portfolio/                  # Portfolio viewer
│   ├── PortfolioView.tsx       # Main viewer
│   ├── layouts/                # Hero layouts
│   │   ├── HeroCentered.tsx    # Victoria style
│   │   ├── HeroFullscreen.tsx
│   │   ├── HeroMinimal.tsx
│   │   └── HeroSplit.tsx
│   └── shared/index.tsx
└── ui/                         # Primitives
    ├── QRCodeDisplay.tsx
    ├── SortableList.tsx        # Drag & drop lists
    ├── LoadingSpinner.tsx
    ├── ProgressIndicator.tsx
    ├── OnboardingTooltip.tsx
    └── UnsavedChangesModal.tsx
```

### 📊 Data Layer

```
data/
├── cvs/                        # YAML CV files
│   └── milagros-aguilera.yml
└── portfolios/                 # JSON portfolio files
    ├── data-scientist.json
    ├── milagros-aguilera.json
    ├── software-developer.json
    └── victoria-rolon.json     # V2 schema reference
```

### 🔌 API Routes

```
app/api/
├── ai/
│   └── analyze-job/route.ts    # AI job description analysis
├── cv/[slug]/route.ts          # CV CRUD operations
├── cvs/route.ts                # CV list endpoint
├── portfolios/route.ts         # Portfolio CRUD
├── upload/image/route.ts       # Image upload (POST/DELETE)
├── domains/route.ts            # Custom domain management
└── user/qrcode/route.ts        # QR code generation
```

### 🧪 Testing

```
__tests__/
├── e2e/                        # Playwright E2E tests
│   ├── homepage.spec.ts
│   ├── portfolio.spec.ts
│   ├── pricing.spec.ts
│   └── templates.spec.ts
├── integration/                # API integration tests
│   └── api/qrcode.test.ts
└── unit/                       # Jest unit tests
    ├── components/
    │   ├── CommonComponents.test.tsx
    │   ├── AnalyticsCard.test.tsx
    │   └── ShareSection.test.tsx
    └── lib/
        └── pricing.test.ts
```

### ⚙️ Configuration

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js config, API rewrites, env vars |
| `tailwind.config.js` | 8 CV themes + custom colors |
| `tsconfig.json` | TypeScript strict mode |
| `jest.config.js` | Jest test runner config |
| `playwright.config.ts` | E2E test config |
| `middleware.ts` | Auth middleware, route protection |
| `Dockerfile` | Container definition |
| `docker-compose.yml` | Multi-container setup |
| `render.yaml` | Render.com deployment config |

---

## .claude/

**AI assistant configuration for Claude Code.**

### Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | **Main project rules & context** (authoritative) |
| `commands/` | Slash commands: `/run-tests`, `/check-org`, `/debug` |
| `skills/` | Auto-activating skills (testing, writing, security) |
| `hooks/` | Git hooks and automation scripts |
| `THREE_FILE_RULE.md` | Critical: Max 3 files in context rule |
| `INDEX.md` | Claude config index |
| `SECURITY_PERMISSIONS.md` | Security restrictions |

### Important Rules (from CLAUDE.md)

1. **3-File Rule**: Maximum 3 files open in context at any time
2. **Model Selection**: haiku (70%), sonnet (25%), extended thinking (5%)
3. **Code Style**: Functional components, camelCase, PascalCase components
4. **Git Workflow**: Feature branches, conventional commits
5. **Security**: Never read .env files, never `git push --force`

---

## docs/

**Documentation organized by purpose.**

```
docs/
├── architecture/               # System design & planning
│   ├── PORTFOLIO_SCHEMA_MIGRATION_PLAN.md   # Migration strategy
│   ├── PORTFOLIO_REFACTORING_PLAN.md        # Refactoring roadmap
│   ├── DEPLOYMENT_PLAN.md                   # Deployment guide
│   ├── IMPLEMENTATION_PLAN.md               # Feature implementation
│   └── OPTIMIZATION_STRATEGY.md             # Performance plans
├── api/                        # API documentation (TODO)
├── guides/
│   ├── user-guides/           # End-user documentation
│   │   └── CV_STANDARD.md     # CV data format standard
│   ├── developer/             # Developer documentation
│   └── automation/            # Workflow automation
│       ├── n8n-setup.md
│       ├── linkedin-automation.md
│       └── workflows/         # n8n workflow JSON files
├── PROJECT_REQUIREMENTS.md    # Complete requirements (16KB)
├── QUICK_START.md             # Fast setup guide
├── TEMPLATE_GUIDE.md          # Template customization
├── AUDIT_REPORT.md            # Security audit
└── COMPREHENSIVE_ANALYSIS_REPORT.md  # Full project analysis
```

---

## scripts/

**Development and validation utilities.**

```
scripts/
├── development/
│   └── check_repo_organization.sh   # Pre-commit validation
└── validation/
    ├── cv_validator.py              # CV data validator
    └── test_cv_validator.py         # Validator tests
```

---

## deprecated/

**Legacy files preserved for reference only.**

```
deprecated/
├── jekyll/                     # Legacy Jekyll template
│   ├── _config.yml
│   ├── _data/
│   ├── _includes/
│   └── assets/
├── PersonalData/              # Personal info (migrated to DB)
│   ├── Personal_Info_AI.md
│   └── Certifications/
├── ana-cv-github-upload/     # Old upload utility
└── templates/
    └── cv-examples/          # Example YAML files
        ├── data-scientist-example.yml
        ├── milagros-aguilera-cv.yml
        ├── qa-engineer-example.yml
        └── software-developer-example.yml
```

**⚠️ Do not use deprecated files for new development.**

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 14 (App Router) |
| **Language** | TypeScript | 5.0 |
| **Styling** | Tailwind CSS | 3.3 |
| **Animation** | Framer Motion | 12.x |
| **UI Primitives** | Radix UI | Latest |
| **Icons** | Heroicons | 2.x |
| **Backend** | Express.js + MongoDB | 4.x, 8.x |
| **ODM** | Mongoose | 8.x |
| **Auth** | Next-Auth | 4.24 |
| **AI** | OpenAI API | 4.x |
| **PDF** | jsPDF + html2canvas | 3.x, 1.4 |
| **Testing** | Jest + Playwright | 29.x, 1.5x |
| **Deployment** | Render (Docker) | - |

---

## 🚀 Development Workflow

### Quick Start

```bash
cd cv-builder
npm install
npm run dev              # Starts client (3000) + server
```

### Available Scripts

```bash
npm run dev              # Development mode (client + server)
npm run dev:client       # Next.js only
npm run dev:server       # Express API only
npm run build            # Production build
npm run start            # Start production server
npm run server           # Start API server only

# Testing
npm run test             # Unit tests (Jest)
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests (Playwright)
npm run test:e2e:ui      # E2E with UI
npm run test:all         # All tests
```

### Before Committing

```bash
/check-org               # Validate repo organization (from .claude/)
/run-tests               # Run full test suite
git commit -m "feat: description"
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DATA FLOW                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   YAML/JSON File ──┐                                        │
│   (Legacy Format)  │                                        │
│                    ▼                                        │
│   ┌─────────────────────────┐                               │
│   │ normalizePortfolio()    │  ← portfolio-normalizer.ts    │
│   │ (lib/utils/)            │                               │
│   └─────────────────────────┘                               │
│                    │                                        │
│                    ▼                                        │
│   ┌─────────────────────────┐                               │
│   │    PortfolioV2          │  ← canonical schema           │
│   │    (Flat structure)     │                               │
│   └─────────────────────────┘                               │
│                    │                                        │
│                    ▼                                        │
│   ┌─────────────────────────┐     ┌──────────────────┐     │
│   │   React Components      │────▶│   Render to DOM  │     │
│   │   (CVPreview.tsx)       │     │   (11 layouts)   │     │
│   └─────────────────────────┘     └──────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Theme System

### CV Themes (40+ available)

**Professional** (8 themes):
- `teal`, `blue`, `navy`, `slate`, `cobalt`, `steel`, `oceanstale`

**Creative** (11 themes):
- `turquoise`, `midnight`, `sunset`, `lavender`, `coral`, `indigo`, `rose`, `plum`, `aqua`, `video-portfolio`

**Minimal** (12 themes):
- `green`, `ceramic`, `forest`, `emerald`, `arctic`, `charcoal`, `mint`, `sage`, `sand`, `graphite`, `olive`, `mauve`

**Bold** (12 themes):
- `berry`, `orange`, `gold`, `amber`, `crimson`, `peach`, `burgundy`, `copper`, `rust`, `wine`, `honey`, `mocha`

### Portfolio Palettes

**Light Mode**:
- `teal`, `blue`, `navy`, `slate`, `emerald`, `lavender`, `rose`, `orange`, `cyan`, `pink`, `turquoise`, `green`, `berry`, `ceramic`, `oceanstale`

**Dark Mode**:
- `graphite`, `stone`, `zinc`, `midnight`, `dark-purple`, `dark-teal`, `charcoal`

### Layouts

**CV Layouts** (11):
- `classic`, `modern`, `minimal`, `creative`, `executive`, `compact`, `timeline`, `cards`, `landing`, `hero-centered`

**Portfolio Hero Layouts** (4):
- `hero-centered` (Victoria style), `hero-split`, `hero-minimal`, `hero-fullscreen`

---

## 📦 Key Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `next` | React framework | Core |
| `react` / `react-dom` | UI library | Core |
| `typescript` | Type safety | Dev |
| `tailwindcss` | Utility CSS | Core |
| `framer-motion` | Animations | 12.x |
| `@radix-ui/*` | Accessible primitives | Multiple |
| `@heroicons/react` | Icons | 2.x |
| `mongoose` | MongoDB ODM | 8.x |
| `next-auth` | Authentication | 4.24 |
| `openai` | AI integration | 4.x |
| `jspdf` | PDF generation | 3.x |
| `html2canvas` | DOM to canvas | 1.4 |
| `qrcode` | QR generation | 1.5 |
| `yaml` | YAML parsing | 2.3 |
| `@dnd-kit/*` | Drag & drop | 6.x, 8.x |
| `puppeteer` | Headless browser | 21.x |
| `sharp` | Image optimization | 0.33 |
| `jest` | Unit testing | 29.x |
| `@playwright/test` | E2E testing | 1.5x |

---

## 🏗 Project Stats

- **Total Files**: ~300+ TypeScript/TSX files
- **Main Application**: 184KB of CV components
- **Type Definitions**: 1,600+ lines of type definitions
- **Test Coverage**: Unit + E2E tests included
- **Themes**: 40+ color themes
- **Layouts**: 11 CV layouts + 4 portfolio hero layouts

---

## 📄 License

MIT License - See [LICENSE.md](LICENSE.md)

---

## 🌿 Branch Information

- **Current Branch**: `AnaCV` (active development)
- **Main Branch**: `master`
- **Legacy Branch**: `jekyll-archive` (in deprecated/)

---

## 🆘 Support

- 📖 Check [docs/QUICK_START.md](docs/QUICK_START.md)
- 📋 Review [CLAUDE.md](CLAUDE.md) for development rules
- 🐛 Open an issue on GitHub
- 💬 Start a discussion

---

**Version**: 2.0.0  
**Last Updated**: 2026-02-06  
**Status**: Active Development  
**Migrated From**: Jekyll → Next.js 14

---

**⭐ If this project helps you land your dream job, please give it a star!**

**🚀 Happy portfolio building!**
