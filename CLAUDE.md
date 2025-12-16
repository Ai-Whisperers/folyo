# CLAUDE.md - Project Rules & Context

This file provides Claude Code with project context and enforces development rules.

## Project Overview

**Project**: Professional Online CV Template / Portfolio Webpage Builder
**Tech Stack**: Jekyll (Ruby), HTML/SCSS, JavaScript, Next.js (cv-builder)
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
├── cv-builder/                 # Next.js CV builder app
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   │   ├── ai/                 # AI-related components
│   │   ├── common/             # Shared components
│   │   ├── cv/                 # CV-specific components
│   │   └── ui/                 # UI primitives
│   └── lib/                    # Utilities and types
├── _data/                      # Jekyll data files (data.yml)
├── _layouts/                   # Jekyll layout templates
├── _includes/                  # Jekyll includes
├── _sass/                      # SCSS stylesheets
├── assets/                     # Static assets (images, CSS)
├── docs/                       # Documentation
│   ├── guides/                 # How-to guides
│   └── planning/               # Planning documents
├── scripts/                    # Utility scripts
│   ├── development/            # Dev tools (check_repo_organization.sh)
│   └── validation/             # Validation scripts (cv_validator.py)
└── templates/                  # CV templates
    └── cv-examples/            # Example CV data files
```

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

**Python** (if applicable):
- Max line length: 100 characters
- Type hints: Always
- Imports: Absolute imports only
- Docstrings: Google format

**TypeScript/JavaScript** (cv-builder):
- Style: Functional components
- State management: Hooks
- Naming: camelCase variables, PascalCase components
- Props: Always destructure

**SCSS**:
- Use variables from `_variables.scss`
- Follow BEM naming convention
- Mobile-first responsive design

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

### Jekyll Configuration
- `_config.yml` - Site configuration
- `_data/data.yml` - CV data

### CV Builder (Next.js)
- `cv-builder/app/` - Next.js app directory
- `cv-builder/components/` - React components
- `cv-builder/lib/` - Utilities and types

### Styles
- `_sass/_variables.scss` - Theme variables
- `_sass/_print.scss` - Print styles
- `cv-builder/app/globals.css` - CV builder styles

## Common Workflows

### 1. Edit CV Content
```bash
# Edit data file
_data/data.yml

# Preview locally
bundle exec jekyll serve --livereload
```

### 2. CV Builder Development
```bash
cd cv-builder
npm run dev
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

### Post Python Edit
- Reminds to run `/run-tests`

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
3. **Extended Thinking**: Use for complex Excel/formatting bugs
4. **Screenshots**: Drag and drop for visual debugging

## Troubleshooting

### Jekyll Issues
```bash
bundle install
bundle exec jekyll serve
```

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

---

**Version**: 1.0.0
**Last Updated**: 2025-12-15
**Configuration**: See `.claude/` directory for detailed settings
