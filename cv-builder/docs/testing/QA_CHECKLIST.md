# Folyo QA Test Checklist

> **Version**: 1.0
> **Last Updated**: December 2024
> **Tester**: _______________
> **Date**: _______________
> **Environment**: [ ] Staging [ ] Production

---

## Pre-Test Setup

- [ ] Clear browser cache and cookies
- [ ] Test in incognito/private mode
- [ ] Ensure latest code is deployed
- [ ] Database has test data
- [ ] All environment variables set

---

## 1. Homepage (`/`)

### Visual

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Page loads without errors | No console errors | [ ] | [ ] | |
| Logo displays correctly | Folyo logo visible | [ ] | [ ] | |
| Hero section renders | Title, subtitle, CTA visible | [ ] | [ ] | |
| Images load | All images display | [ ] | [ ] | |
| Animations work | Fade-in animations play | [ ] | [ ] | |

### Functionality

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| "Get Started" button | Navigates to /auth/signup | [ ] | [ ] | |
| "See Live Example" | Opens /cv/demo | [ ] | [ ] | |
| "View Templates" | Opens /templates | [ ] | [ ] | |
| "Pricing" link | Opens /pricing | [ ] | [ ] | |
| Navigation menu | All links work | [ ] | [ ] | |

### Responsive

| Viewport | Displays Correctly | Pass | Fail |
|----------|-------------------|------|------|
| Desktop (1920px) | | [ ] | [ ] |
| Laptop (1366px) | | [ ] | [ ] |
| Tablet (768px) | | [ ] | [ ] |
| Mobile (375px) | | [ ] | [ ] |
| Mobile (320px) | | [ ] | [ ] |

---

## 2. Templates Page (`/templates`)

### Visual

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Template grid displays | Multiple templates visible | [ ] | [ ] | |
| Preview panel shows | Full CV preview visible | [ ] | [ ] | |
| Theme colors accurate | Match design system | [ ] | [ ] | |
| Mini previews render | Thumbnails display | [ ] | [ ] | |

### Functionality

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Click template | Preview updates | [ ] | [ ] | |
| Category filter | Templates filter correctly | [ ] | [ ] | |
| Desktop/Mobile toggle | Preview size changes | [ ] | [ ] | |
| "Use Template" button | Opens builder with theme | [ ] | [ ] | |
| Scroll behavior | Smooth scrolling | [ ] | [ ] | |

---

## 3. CV Builder (`/builder`)

### Form Sections

| Section | Renders | Editable | Saves | Pass/Fail |
|---------|---------|----------|-------|-----------|
| Personal Info | [ ] | [ ] | [ ] | |
| Career Profile | [ ] | [ ] | [ ] | |
| Experience | [ ] | [ ] | [ ] | |
| Education | [ ] | [ ] | [ ] | |
| Skills | [ ] | [ ] | [ ] | |
| Projects | [ ] | [ ] | [ ] | |
| Certifications | [ ] | [ ] | [ ] | |
| Languages | [ ] | [ ] | [ ] | |
| Interests | [ ] | [ ] | [ ] | |

### Dynamic Features

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Add experience entry | New entry form appears | [ ] | [ ] | |
| Remove experience entry | Entry removed | [ ] | [ ] | |
| Reorder entries (drag) | Order changes | [ ] | [ ] | |
| Skills slider | Percentage updates | [ ] | [ ] | |
| Theme picker | Colors change | [ ] | [ ] | |

### Auto-Save

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Edit triggers save | "Saving..." indicator | [ ] | [ ] | |
| Save completes | "Saved" indicator | [ ] | [ ] | |
| Page refresh | Data persists | [ ] | [ ] | |
| Unsaved changes warning | Alert on navigate | [ ] | [ ] | |

### Preview

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Preview updates live | Changes reflect immediately | [ ] | [ ] | |
| Theme applies | Colors match selection | [ ] | [ ] | |
| All sections render | Content displays | [ ] | [ ] | |
| Scroll syncs | Preview scrolls with form | [ ] | [ ] | |

### Export

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| PDF export | File downloads | [ ] | [ ] | |
| PDF formatting | Layout correct | [ ] | [ ] | |
| YAML export | File downloads | [ ] | [ ] | |
| YAML content | Valid YAML format | [ ] | [ ] | |

### QR Modal

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| QR modal opens | Modal displays | [ ] | [ ] | |
| QR code generates | Image appears | [ ] | [ ] | |
| Theme color applies | QR matches theme | [ ] | [ ] | |
| Download QR | PNG file downloads | [ ] | [ ] | |
| Copy URL | URL in clipboard | [ ] | [ ] | |

---

## 4. Public Portfolio (`/cv/[slug]`)

### Demo Page (`/cv/demo`)

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Page loads | Content displays | [ ] | [ ] | |
| Name displays | "Alex Johnson" visible | [ ] | [ ] | |
| Tagline displays | "Senior Product Designer" | [ ] | [ ] | |
| Theme applied | Teal colors | [ ] | [ ] | |
| All sections render | Experience, Education, etc. | [ ] | [ ] | |
| Skills bars | Progress bars visible | [ ] | [ ] | |
| Links work | External links open | [ ] | [ ] | |

### SEO

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Page title | Contains name | [ ] | [ ] | |
| Meta description | Set correctly | [ ] | [ ] | |
| OG tags | Present in source | [ ] | [ ] | |
| JSON-LD | Schema.org data | [ ] | [ ] | |
| Robots meta | Index, follow | [ ] | [ ] | |

### 404 Page

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Invalid slug | Shows 404 page | [ ] | [ ] | |
| Error message | "Portfolio Not Found" | [ ] | [ ] | |
| Create link | Links to homepage | [ ] | [ ] | |

### Print

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Print preview | Clean layout | [ ] | [ ] | |
| No navigation | Header/footer hidden | [ ] | [ ] | |
| Colors print | Theme colors work | [ ] | [ ] | |

---

## 5. Dashboard (`/dashboard`)

### Authentication

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Unauthenticated access | Redirects to signin | [ ] | [ ] | |
| After login | Dashboard loads | [ ] | [ ] | |
| Session persists | Refresh stays logged in | [ ] | [ ] | |

### Stats Cards

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Total CVs count | Accurate number | [ ] | [ ] | |
| Total Views count | Matches analytics | [ ] | [ ] | |
| Downloads count | Accurate number | [ ] | [ ] | |
| Edits count | Accurate number | [ ] | [ ] | |

### CV List

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| CVs display | User's CVs shown | [ ] | [ ] | |
| Grid view | Cards layout | [ ] | [ ] | |
| List view | Table layout | [ ] | [ ] | |
| Theme indicator | Color dot shows | [ ] | [ ] | |
| Status badge | Draft/Published | [ ] | [ ] | |

### Actions

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Edit button | Opens builder | [ ] | [ ] | |
| View button | Opens portfolio | [ ] | [ ] | |
| Publish button | Changes status | [ ] | [ ] | |
| Unpublish button | Changes status | [ ] | [ ] | |
| Delete button | Confirms then deletes | [ ] | [ ] | |
| QR button | Expands share section | [ ] | [ ] | |

### Share Section

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Expands on click | Section appears | [ ] | [ ] | |
| URL displays | Full URL shown | [ ] | [ ] | |
| Copy works | URL copied | [ ] | [ ] | |
| QR displays | Image loads | [ ] | [ ] | |
| Download QR | File downloads | [ ] | [ ] | |
| Analytics shows | Stats visible | [ ] | [ ] | |

---

## 6. Analytics (`/dashboard/analytics`)

### Stats Overview

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Total Views | Accurate sum | [ ] | [ ] | |
| Total Downloads | Accurate sum | [ ] | [ ] | |
| Unique Visitors | Accurate count | [ ] | [ ] | |
| Published count | Correct number | [ ] | [ ] | |
| Total CVs | Correct number | [ ] | [ ] | |

### Time Range

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| 7 days filter | Data updates | [ ] | [ ] | |
| 30 days filter | Data updates | [ ] | [ ] | |
| 90 days filter | Data updates | [ ] | [ ] | |
| All time | Shows all data | [ ] | [ ] | |

### CV Table

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| All CVs listed | Complete list | [ ] | [ ] | |
| Views column | Accurate counts | [ ] | [ ] | |
| Downloads column | Accurate counts | [ ] | [ ] | |
| Sorted by views | Highest first | [ ] | [ ] | |
| View link works | Opens portfolio | [ ] | [ ] | |
| Edit link works | Opens builder | [ ] | [ ] | |

---

## 7. Pricing (`/pricing`)

### Display

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Three tiers show | Free, Pro, Premium | [ ] | [ ] | |
| Prices correct | $0, $10, $25 | [ ] | [ ] | |
| Pro highlighted | "Most Popular" badge | [ ] | [ ] | |
| Features listed | All features shown | [ ] | [ ] | |

### Billing Toggle

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Monthly selected | Default state | [ ] | [ ] | |
| Click yearly | Prices update | [ ] | [ ] | |
| 20% discount | Yearly = monthly * 12 * 0.8 | [ ] | [ ] | |
| "Save 20%" badge | Visible | [ ] | [ ] | |

### Feature Table

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| All features listed | 12+ features | [ ] | [ ] | |
| Check/X icons | Correct per tier | [ ] | [ ] | |
| Numeric values | Correct limits | [ ] | [ ] | |

### CTAs

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| "Start Free" | Goes to signup | [ ] | [ ] | |
| "Start Free Trial" | Goes to signup with plan | [ ] | [ ] | |
| Bottom CTA | Goes to signup | [ ] | [ ] | |

---

## 8. Authentication

### Sign Up (`/auth/signup`)

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Form displays | All fields visible | [ ] | [ ] | |
| Valid submission | Account created | [ ] | [ ] | |
| Weak password | Error shown | [ ] | [ ] | |
| Existing email | Error shown | [ ] | [ ] | |
| Invalid email | Validation error | [ ] | [ ] | |
| Redirect after | Goes to dashboard | [ ] | [ ] | |

### Sign In (`/auth/signin`)

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Form displays | Email, password fields | [ ] | [ ] | |
| Valid login | Logs in successfully | [ ] | [ ] | |
| Invalid password | Error shown | [ ] | [ ] | |
| Non-existent email | Error shown | [ ] | [ ] | |
| Redirect after | Goes to dashboard | [ ] | [ ] | |

### Logout

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Click logout | Session ends | [ ] | [ ] | |
| Redirect | Goes to home | [ ] | [ ] | |
| Dashboard access | Requires login again | [ ] | [ ] | |

---

## 9. Cross-Browser Testing

| Browser | Version | Homepage | Builder | Portfolio | Pass/Fail |
|---------|---------|----------|---------|-----------|-----------|
| Chrome | Latest | [ ] | [ ] | [ ] | |
| Firefox | Latest | [ ] | [ ] | [ ] | |
| Safari | Latest | [ ] | [ ] | [ ] | |
| Edge | Latest | [ ] | [ ] | [ ] | |
| Chrome Android | Latest | [ ] | [ ] | [ ] | |
| Safari iOS | Latest | [ ] | [ ] | [ ] | |

---

## 10. Performance Checks

| Page | Load Time | Lighthouse Score | Pass/Fail |
|------|-----------|------------------|-----------|
| Homepage | <3s | >90 | |
| Templates | <3s | >85 | |
| Builder | <4s | >80 | |
| Portfolio | <2s | >90 | |
| Dashboard | <3s | >85 | |

---

## 11. Security Checks

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| HTTPS enforced | Redirects HTTP | [ ] | [ ] | |
| Session secure | HttpOnly cookies | [ ] | [ ] | |
| XSS prevention | Input sanitized | [ ] | [ ] | |
| CSRF protection | Tokens present | [ ] | [ ] | |
| Can't access others' CVs | 403 error | [ ] | [ ] | |
| Rate limiting | API throttled | [ ] | [ ] | |

---

## 12. Accessibility Checks

| Test Case | Expected Result | Pass | Fail | Notes |
|-----------|----------------|------|------|-------|
| Keyboard navigation | All elements reachable | [ ] | [ ] | |
| Focus indicators | Visible focus rings | [ ] | [ ] | |
| Screen reader | Content announced | [ ] | [ ] | |
| Color contrast | WCAG AA (4.5:1) | [ ] | [ ] | |
| Form labels | All inputs labeled | [ ] | [ ] | |
| Alt text | All images have alt | [ ] | [ ] | |
| Skip links | Skip to content works | [ ] | [ ] | |
| Touch targets | Min 44x44px | [ ] | [ ] | |

---

## Sign-Off

### Summary

- **Total Tests**: ___
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___

### Critical Issues Found

1. _______________
2. _______________
3. _______________

### Approved for Release

- [ ] Yes
- [ ] No - Issues must be fixed

**QA Lead Signature**: _______________

**Date**: _______________

---

*Document Version: 1.0*
