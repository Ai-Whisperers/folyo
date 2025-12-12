# Portfolio & Resume Builder Master Plan

## 1. Product Core & Vision
**Goal**: Build the world's best "Professional Identity Platform" that combines a traditional Resume Builder with a modern Portfolio Website builder.

## 2. Feature Roadmap

### Phase 1: Competitor Parity (What Users Expect)
*From Resume.io, OnlineCV, CVWizard*
- [x] **Smart Dashboard**: 
  - Manage multiple CVs/Portfolios.
  - Analytics (Who viewed my profile?).
- [x] **AI Writing Assistant**: 
  - "Fix my grammar".
  - "Rewrite for impact" (Action verbs).
  - Pre-written phrases for common roles (Dev, Designer, Admin).
- [x] **Export Options**: 
  - PDF (Print-ready).
  - Word/Docx (for legacy corporate systems).
- [ ] **Cover Letter Builder**: 
  - Matching themes with the Resume/Portfolio.

### Phase 2: The "Portfolio" Advantage (Our Differentiators)
- [x] **Rich Media Integration** (Basic Implemented):
  - [ ] YouTube/Vimeo Embeds (Polished UI).
  - [ ] Image Carousels (for Designers/Photographers).
  - [ ] PDF Viewer (for Scripts/Papers).
- [ ] **Web-First Themes**:
  - [x] "Dark Portfolio" (Cinematic dark mode).
  - [ ] "Minimalist Grid" (Clean, Apple-style).
  - [ ] "Academic" (Text-heavy, publication focused).
- [ ] **Public Profile (`/cv/username`)**:
  - SEO Optimization (Meta tags, OpenGraph images).
  - Contact Form (Direct messaging without exposing email).
  - Password Protection (Optional).

## 3. Implementation Strategy

### Step 1: Fix the "Invisible Changes"
**Problem**: You currently cannot see the new features easily because the Landing Page and Dashboard don't link to them prominently.
**Action**: 
- Update `app/page.tsx` (Landing) to showcase "Portfolio Building".
- Update `app/dashboard/page.tsx` to clearly distinguish between "Standard Resumes" and "Web Portfolios".

### Step 2: Deepen Portfolio Features
- Improve the `PortfolioSection` component to allow reordering (Drag & Drop).
- Add "Thumbnail Upload" (currently just URL).

### Step 3: Deployment & Analytics
- Connect to a real database (MongoDB is currently set up but need to verify persistence).
- Add "View Counter" logic.

## 4. Technical Stack
- **Frontend**: Next.js 14, TailwindCSS, Framer Motion (animations).
- **Backend**: Next.js API Routes + MongoDB.
- **Authentication**: NextAuth.js (already installed).
