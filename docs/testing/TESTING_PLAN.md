# Folyo Testing Plan

## Overview

This document outlines the comprehensive testing strategy for the Folyo CV Builder platform, covering unit tests, integration tests, end-to-end tests, and QA verification.

---

## Table of Contents

1. [Test Coverage Goals](#test-coverage-goals)
2. [Testing Stack](#testing-stack)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [End-to-End Tests](#end-to-end-tests)
6. [QA Test Checklist](#qa-test-checklist)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Accessibility Testing](#accessibility-testing)
10. [Test Execution](#test-execution)

---

## Test Coverage Goals

| Category | Target Coverage | Priority |
|----------|----------------|----------|
| Core Components | 90% | Critical |
| API Routes | 85% | Critical |
| Utility Functions | 95% | High |
| UI Components | 80% | Medium |
| E2E User Flows | 100% of critical paths | Critical |

---

## Testing Stack

```json
{
  "unit": "Jest + React Testing Library",
  "integration": "Jest + Supertest",
  "e2e": "Playwright",
  "visual": "Percy (optional)",
  "performance": "Lighthouse CI",
  "accessibility": "axe-core + Playwright"
}
```

---

## Unit Tests

### 1. Components

#### CVPreview Component
```
- [ ] Renders with minimal data
- [ ] Renders all sections when data provided
- [ ] Applies correct theme colors
- [ ] Handles dark themes correctly
- [ ] Displays profile image when provided
- [ ] Shows placeholder when no image
- [ ] Renders skills with correct percentage
- [ ] Handles empty sections gracefully
- [ ] Displays video portfolio items
- [ ] Displays image gallery items
```

#### ShareSection Component
```
- [ ] Renders portfolio URL correctly
- [ ] Copy button copies URL to clipboard
- [ ] QR code generates on mount
- [ ] Download QR button triggers download
- [ ] Share button triggers native share (mobile)
- [ ] Loading state shows skeleton
- [ ] Error state handled gracefully
```

#### AnalyticsCard Component
```
- [ ] Fetches analytics on mount
- [ ] Displays views count
- [ ] Displays downloads count
- [ ] Displays unique visitors
- [ ] Loading state shows skeleton
- [ ] Handles API errors
- [ ] Formats large numbers correctly
```

#### CVBuilderForm Component
```
- [ ] Renders all form sections
- [ ] Validates required fields
- [ ] Updates state on input change
- [ ] Handles array fields (add/remove)
- [ ] Auto-save triggers on change
- [ ] Theme selector works
- [ ] Image upload works
- [ ] Shows unsaved changes warning
```

### 2. Utility Functions

#### lib/pricing.ts
```
- [ ] canUseFeature returns correct boolean
- [ ] canUseTheme validates theme access
- [ ] getFeatureLimit returns correct limits
- [ ] Free tier has correct restrictions
- [ ] Pro tier has correct features
- [ ] Premium tier has all features
```

#### lib/qrcode.js
```
- [ ] Generates valid QR code data URL
- [ ] Applies theme color correctly
- [ ] Handles invalid URLs gracefully
- [ ] Respects size parameter
```

#### lib/design-system.ts
```
- [ ] All themes have required colors
- [ ] getThemeColors returns valid object
- [ ] Theme categories are correct
- [ ] CSS variables format is valid
```

### 3. Hooks

#### useAutoSave Hook
```
- [ ] Triggers save after debounce
- [ ] Cancels pending save on unmount
- [ ] Returns saving state
- [ ] Handles save errors
```

---

## Integration Tests

### 1. API Routes

#### GET /api/cv/[slug]
```
- [ ] Returns 404 for non-existent slug
- [ ] Returns 404 for unpublished CV
- [ ] Returns CV data for valid public slug
- [ ] Increments view count
- [ ] Returns correct theme data
```

#### POST /api/cv/[slug]/view
```
- [ ] Increments view counter
- [ ] Logs analytics event
- [ ] Returns 404 for invalid slug
- [ ] Handles concurrent requests
```

#### POST /api/user/qrcode
```
- [ ] Generates QR code for valid URL
- [ ] Applies theme color
- [ ] Returns 400 for missing URL
- [ ] Returns valid data URL
```

#### GET /api/cvs/[id]/analytics
```
- [ ] Returns 401 without auth
- [ ] Returns 404 for non-existent CV
- [ ] Returns 403 for non-owner
- [ ] Returns analytics data for owner
- [ ] Respects date range filters
```

#### POST /api/cvs
```
- [ ] Creates CV with valid data
- [ ] Returns 401 without auth
- [ ] Validates required fields
- [ ] Generates slug from title
- [ ] Sets default theme
```

#### PUT /api/cvs/[id]
```
- [ ] Updates CV data
- [ ] Returns 401 without auth
- [ ] Returns 404 for non-existent
- [ ] Returns 403 for non-owner
- [ ] Updates lastEditedAt
```

#### POST /api/cvs/[id]/publish
```
- [ ] Sets isPublic to true
- [ ] Sets status to published
- [ ] Returns 401 without auth
- [ ] Returns 403 for non-owner
```

#### POST /api/cvs/[id]/unpublish
```
- [ ] Sets isPublic to false
- [ ] Sets status to draft
- [ ] Returns 401 without auth
- [ ] Returns 403 for non-owner
```

### 2. Database Operations

#### CV Model
```
- [ ] Creates CV with valid data
- [ ] Generates slug on save
- [ ] incrementViews() works
- [ ] incrementDownloads() works
- [ ] publish() updates status
- [ ] findBySlug() returns public only
- [ ] findUserCVs() filters by user
```

#### Analytics Model
```
- [ ] Creates analytics event
- [ ] Aggregates by date correctly
- [ ] Filters by event type
- [ ] Calculates unique visitors
```

---

## End-to-End Tests

### 1. Authentication Flow

```
Test: User Registration
- Navigate to /auth/signup
- Fill in name, email, password
- Submit form
- Verify redirect to dashboard
- Verify welcome email (mock)

Test: User Login
- Navigate to /auth/signin
- Enter credentials
- Submit form
- Verify redirect to dashboard
- Verify session cookie set

Test: Protected Routes
- Access /dashboard without auth
- Verify redirect to signin
- Access /builder without auth
- Verify redirect to signin

Test: Logout
- Click logout button
- Verify session cleared
- Verify redirect to home
```

### 2. CV Builder Flow

```
Test: Create New CV
- Navigate to /builder
- Fill in personal info
- Add experience entry
- Add education entry
- Add skills
- Select theme
- Verify auto-save
- Verify preview updates

Test: Edit Existing CV
- Navigate to /dashboard
- Click edit on CV card
- Modify title
- Verify changes saved
- Verify preview reflects changes

Test: Theme Selection
- Open theme picker
- Select different theme
- Verify preview updates
- Verify color changes apply

Test: Image Upload
- Click avatar upload
- Select image file
- Verify preview shows image
- Verify cropping works
```

### 3. Portfolio Viewing Flow

```
Test: View Public Portfolio
- Navigate to /cv/demo
- Verify all sections render
- Verify theme applied
- Verify responsive on mobile
- Verify print styles work

Test: View Non-Existent Portfolio
- Navigate to /cv/invalid-slug
- Verify 404 page displays
- Verify "Create Portfolio" link works

Test: Track Views
- View portfolio
- Verify view count incremented
- Verify analytics logged
```

### 4. Sharing Flow

```
Test: Copy Portfolio Link
- Open dashboard
- Click QR icon on published CV
- Click copy button
- Verify clipboard contains URL
- Verify success toast

Test: Download QR Code
- Open share section
- Click download QR
- Verify PNG file downloaded
- Verify QR is scannable

Test: Native Share (Mobile)
- Open share section on mobile
- Click share button
- Verify native share dialog opens
```

### 5. Analytics Flow

```
Test: View Analytics Dashboard
- Navigate to /dashboard/analytics
- Verify stats cards display
- Verify CV table loads
- Change time range
- Verify data updates

Test: Per-CV Analytics
- Open CV share section
- Verify analytics card loads
- Verify counts match API
```

### 6. Pricing Flow

```
Test: View Pricing Page
- Navigate to /pricing
- Verify all tiers display
- Toggle yearly billing
- Verify prices update (20% discount)
- Click "Start Free Trial"
- Verify redirect to signup

Test: Feature Comparison
- Scroll to comparison table
- Verify all features listed
- Verify checkmarks/x-marks correct
```

---

## QA Test Checklist

### Homepage (/`)

| Test | Expected | Status |
|------|----------|--------|
| Page loads without errors | No console errors | [ ] |
| Hero section displays | Title, description visible | [ ] |
| CTA buttons work | Links navigate correctly | [ ] |
| Testimonials display | 3 testimonials visible | [ ] |
| Mobile responsive | No horizontal scroll | [ ] |
| "See Live Example" works | Opens /cv/demo | [ ] |
| "Choose Template" works | Opens /templates | [ ] |

### Templates Page (`/templates`)

| Test | Expected | Status |
|------|----------|--------|
| Page loads | Template grid displays | [ ] |
| Template cards clickable | Opens preview | [ ] |
| Preview updates | Shows selected template | [ ] |
| "Use Template" works | Opens builder with template | [ ] |
| Category filter works | Filters templates | [ ] |
| Mobile/Desktop toggle | Preview changes size | [ ] |

### Builder Page (`/builder`)

| Test | Expected | Status |
|------|----------|--------|
| Form loads | All sections visible | [ ] |
| Personal info saves | Data persists | [ ] |
| Add experience | New entry appears | [ ] |
| Remove experience | Entry removed | [ ] |
| Skills slider works | Percentage updates | [ ] |
| Theme picker works | Colors change | [ ] |
| Preview updates | Real-time sync | [ ] |
| Auto-save indicator | Shows "Saving..." | [ ] |
| PDF export works | PDF downloads | [ ] |
| YAML export works | YAML downloads | [ ] |
| QR modal opens | QR code displays | [ ] |
| Unsaved changes warning | Alert on navigate | [ ] |

### Dashboard (`/dashboard`)

| Test | Expected | Status |
|------|----------|--------|
| Requires auth | Redirects if not logged in | [ ] |
| CV list loads | User's CVs display | [ ] |
| Stats cards accurate | Counts match data | [ ] |
| Grid/List toggle | View changes | [ ] |
| Edit button works | Opens builder | [ ] |
| Delete button works | CV removed | [ ] |
| Publish toggle works | Status changes | [ ] |
| QR expand works | Share section appears | [ ] |
| "New CV" button | Opens builder | [ ] |
| "New Portfolio" button | Opens builder | [ ] |

### Public Portfolio (`/cv/[slug]`)

| Test | Expected | Status |
|------|----------|--------|
| Demo loads | /cv/demo shows Alex Johnson | [ ] |
| All sections render | Experience, Education, etc. | [ ] |
| Theme applied | Correct colors | [ ] |
| Profile image shows | If avatar provided | [ ] |
| Skills bars render | With percentages | [ ] |
| Links work | External links open | [ ] |
| SEO meta tags | Title, description set | [ ] |
| Schema.org JSON-LD | Present in source | [ ] |
| 404 for invalid slug | Not found page | [ ] |
| Mobile responsive | Stacks correctly | [ ] |
| Print styles | Clean print output | [ ] |

### Analytics (`/dashboard/analytics`)

| Test | Expected | Status |
|------|----------|--------|
| Requires auth | Redirects if not logged in | [ ] |
| Stats load | 5 stat cards | [ ] |
| Time range works | Data updates | [ ] |
| CV table loads | All CVs listed | [ ] |
| Sort by views | Highest first | [ ] |
| View link works | Opens portfolio | [ ] |
| Edit link works | Opens builder | [ ] |

### Pricing (`/pricing`)

| Test | Expected | Status |
|------|----------|--------|
| Page loads | 3 tier cards | [ ] |
| Monthly prices correct | $0, $10, $25 | [ ] |
| Yearly toggle works | Shows discounted prices | [ ] |
| Feature table accurate | All features listed | [ ] |
| CTA buttons work | Navigate to signup | [ ] |
| FAQ section displays | 4 questions visible | [ ] |

### Cross-Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | [ ] |
| Firefox | Latest | [ ] |
| Safari | Latest | [ ] |
| Edge | Latest | [ ] |
| Chrome Mobile | Latest | [ ] |
| Safari Mobile | Latest | [ ] |

### Responsive Breakpoints

| Breakpoint | Width | Status |
|------------|-------|--------|
| Mobile S | 320px | [ ] |
| Mobile M | 375px | [ ] |
| Mobile L | 425px | [ ] |
| Tablet | 768px | [ ] |
| Laptop | 1024px | [ ] |
| Desktop | 1440px | [ ] |

---

## Performance Testing

### Lighthouse Targets

| Metric | Target | Page |
|--------|--------|------|
| Performance | >90 | All pages |
| Accessibility | >90 | All pages |
| Best Practices | >90 | All pages |
| SEO | >90 | Public pages |
| LCP | <2.5s | All pages |
| FID | <100ms | All pages |
| CLS | <0.1 | All pages |

### Load Testing

```
- Homepage: 1000 concurrent users
- Portfolio page: 500 concurrent views
- Builder: 100 concurrent editors
- API: 1000 requests/second
```

---

## Security Testing

### OWASP Top 10 Checklist

| Vulnerability | Test | Status |
|--------------|------|--------|
| Injection | SQL/NoSQL injection on inputs | [ ] |
| Broken Auth | Session management | [ ] |
| Sensitive Data | HTTPS, encrypted storage | [ ] |
| XXE | XML parsing disabled | [ ] |
| Broken Access | User can't access others' CVs | [ ] |
| Misconfig | Security headers present | [ ] |
| XSS | Input sanitization | [ ] |
| Deserialization | Safe JSON parsing | [ ] |
| Components | No known vulnerabilities | [ ] |
| Logging | Sensitive data not logged | [ ] |

### Additional Security Tests

```
- [ ] CSRF protection on forms
- [ ] Rate limiting on API
- [ ] File upload validation
- [ ] Password strength requirements
- [ ] Session timeout
- [ ] JWT token expiration
```

---

## Accessibility Testing

### WCAG 2.1 AA Compliance

```
- [ ] Color contrast ratio >= 4.5:1
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Form labels associated
- [ ] Error messages descriptive
- [ ] Skip links present
- [ ] Alt text on images
- [ ] ARIA labels correct
- [ ] Touch targets >= 44x44px
```

---

## Test Execution

### Local Development

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Run with coverage
npm run test:coverage
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e
```

### Pre-Release Checklist

```
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Coverage meets targets
- [ ] Manual QA complete
- [ ] Performance audit passed
- [ ] Security scan passed
- [ ] Accessibility audit passed
```

---

## Test Data

### Test User

```json
{
  "email": "test@folyo.com",
  "password": "TestPass123!",
  "name": "Test User"
}
```

### Test CV (Minimal)

```json
{
  "title": "Test CV",
  "theme": { "skin": "teal" },
  "sidebar": { "name": "Test Name" }
}
```

### Test CV (Full)

```json
{
  "title": "Complete Test CV",
  "slug": "test-cv",
  "theme": { "skin": "teal" },
  "sidebar": {
    "name": "Test User",
    "tagline": "Software Engineer",
    "email": "test@example.com"
  },
  "careerProfile": {
    "title": "About",
    "summary": "Test summary"
  },
  "experiences": {
    "title": "Experience",
    "info": [{
      "role": "Developer",
      "company": "Test Corp",
      "time": "2020-2024"
    }]
  }
}
```

---

*Document Version: 1.0*
*Created: December 2024*
