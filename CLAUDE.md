# CLAUDE.md - Project Rules & Context

This file provides Claude Code with project context and enforces development rules.

## Project Overview

**Project**: Professional Online CV Template / Portfolio Webpage Builder
**Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
**Branch**: AnaCV (active development)
**Main Branch**: master

## Repository Structure

```
kiki/
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Slash commands
│   ├── skills/                 # Auto-activating skills
│   ├── settings.json           # Shared team settings (committed)
│   └── settings.local.json     # Personal settings (gitignored)
├── cv-builder/                 # Next.js CV builder app (MAIN APP)
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage with animations
│   │   ├── cv/[slug]/          # CV viewer pages
│   │   └── portfolio/[slug]/   # Portfolio pages
│   ├── components/             # React components
│   │   ├── ai/                 # AI-related components
│   │   ├── common/             # Shared components
│   │   ├── cv/                 # CV-specific components
│   │   ├── portfolio/          # Portfolio components (PortfolioView)
│   │   └── ui/                 # UI primitives
│   ├── lib/                    # Utilities and types
│   │   └── utils/              # Animation, theme, YAML utilities
│   └── data/                   # CV and portfolio data
│       ├── cvs/                # YAML CV data files
│       └── portfolios/         # Portfolio JSON data
├── archive/                    # Legacy Jekyll files (gitignored)
│   └── jekyll/                 # Original Jekyll templates
├── assets/                     # Static assets (images, CSS)
├── docs/                       # Documentation
│   ├── guides/                 # How-to guides
│   └── planning/               # Planning documents
├── scripts/                    # Utility scripts
│   ├── development/            # Dev tools
│   └── validation/             # Validation scripts
└── templates/                  # CV templates
    └── cv-examples/            # Example CV data files
```

## Tech Stack Details

### Core Technologies
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations and transitions
- **Radix UI**: Accessible component primitives

### Animation System
- `lib/utils/animations.ts` - Reusable animation variants
- Scroll-based animations with `useScroll` and `useTransform`
- Mouse-following effects with spring physics
- Staggered child animations

## Critical Rules

### 1. The 3-File Rule (MANDATORY)

**Keep maximum 3 files open in context at any time.**

- Close files immediately after completing tasks
- Rotate files as needed (close least recently used)
- Exceptions: Code review (4-6 files), refactoring (5-8 files)

Benefits: 60-80% token savings, faster responses, better focus

### 2. Model Selection

```
Simple tasks (editing, reading, running tests): haiku (70%)
Complex tasks (debugging, architecture): sonnet (25%)
Critical decisions: sonnet with extended thinking (5%)
```

### 3. Code Style

**TypeScript/JavaScript**:
- Style: Functional components
- State management: React hooks
- Naming: camelCase variables, PascalCase components
- Props: Always destructure
- Animations: Use Framer Motion variants

**Tailwind CSS**:
- Use design tokens from design-system.ts
- Mobile-first responsive design
- Dark mode support with `dark:` prefix

### 4. Git Workflow

- Work on feature branches (currently: AnaCV)
- Small, atomic commits with conventional commit format
- Never commit without running tests first
- Never commit files >10MB
- Run `/check-org` before commits

### 5. Communication Style

- Concise responses (avoid long explanations)
- Minimal code comments (only for complex logic)
- NO emojis in code or responses
- Update documentation as you go

## Security Restrictions (ENFORCED)

### Never Read
- `.env` and `.env.*` files
- `**/kaggle.json`
- `**/.aws/credentials`
- `**/.ssh/id_*`
- `**/id_rsa*`

### Never Execute
- `rm -rf /` or `rm -rf ~`
- `git push --force` or `git push -f`
- `docker system prune -a`
- `sudo` or `su`
- `killall` or `pkill`

### Always Ask First
- `pip install` / `npm install`
- `git push origin main`
- `git reset --hard`
- `docker-compose down -v`
- `rm -rf` on project directories

## Available Slash Commands

| Command | Description |
|---------|-------------|
| `/run-tests` | Run full test suite |
| `/check-org` | Validate repository organization |
| `/debug` | Run debugging workflow |
| `/refactor` | Run code refactoring checks |

## Key Files

### CV Builder (Next.js)
- `cv-builder/app/page.tsx` - Homepage with animations
- `cv-builder/components/portfolio/PortfolioView.tsx` - Main portfolio component
- `cv-builder/lib/utils/animations.ts` - Animation utilities
- `cv-builder/lib/design-system.ts` - Design tokens

### Data Files
- `cv-builder/data/cvs/*.yml` - CV data in YAML format
- `cv-builder/data/portfolios/*.json` - Portfolio data in JSON

### Styles
- `cv-builder/app/globals.css` - Global styles
- `cv-builder/tailwind.config.ts` - Tailwind configuration

## Common Workflows

### 1. Development
```bash
cd cv-builder
npm run dev
```

### 2. Build & Deploy
```bash
cd cv-builder
npm run build
npm start
```

### 3. Before Committing
```bash
# Check organization
/check-org

# Run tests
/run-tests

# Commit with conventional format
git commit -m "feat: description"
```

## Hooks (Auto-Execute)

### Pre-Commit
- Runs `scripts/development/check_repo_organization.sh`

### Post TypeScript Edit
- Reminds to run tests

### Post Documentation Edit
- Reminds to review for completeness

## Context Management

### Auto-Compact Trigger
- At 35,000 tokens (17.5% of limit)

### Typical Working Set
1. Current implementation file
2. Test file (if applicable)
3. Reference file (CLAUDE.md or config)

### Close Immediately
- Files not directly needed
- "Nice to have" context
- Historical references

## Performance Tips

1. **Batch Operations**: Read multiple files in single request
2. **3-File Rule**: Keep context minimal
3. **Extended Thinking**: Use for complex animations/formatting bugs
4. **Screenshots**: Drag and drop for visual debugging

## Troubleshooting

### CV Builder Issues
```bash
cd cv-builder
npm install
npm run dev
```

### Git Issues
```bash
git status
git diff
```

### Animation Issues
- Check Framer Motion variants in `lib/utils/animations.ts`
- Verify `motion` components have proper `initial`, `animate`, `exit` props

---

**Version**: 2.0.0
**Last Updated**: 2025-12-26
**Architecture**: Next.js 14 (migrated from Jekyll)
**Configuration**: See `.claude/` directory for detailed settings
