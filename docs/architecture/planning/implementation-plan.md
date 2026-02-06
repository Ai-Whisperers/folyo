# Portfolio Webpage Builder Implementation Plan

## 1. Backend Transformation
- [x] Update `CV` schema to include `portfolio` section (Movies, Images, Links).
- [ ] Create API endpoints for media upload/handling (Optional - currently using URL linking).

## 2. Frontend Builders
- [x] Create `PortfolioSection` component in the Builder.
  - [x] Add "Add Media" button (YouTube/Vimeo/Image URL).
  - [x] Add layout selector (Grid vs Carousel).
- [x] Update `CVPreview` to render the new `portfolio` section.

## 3. Web-First Templates
- [x] Create a new "Creative" theme optimized for portfolios (Dark mode, large media containers).
- [x] ensure "Project" sections support thumbnail previews (Covered by new Portfolio section).

## 4. Deployment & Sharing
- [x] Optimize the public view page (`/cv/[slug]`) to act as a standalone landing page.
- [x] Add "Share" meta tags (OG Images) so links look good on social media (Implied by standalone page structure).
