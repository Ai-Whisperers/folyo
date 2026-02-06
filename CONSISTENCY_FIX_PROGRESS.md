# Consistency Fixes - Implementation Progress

## Quick Start Commands

### Check Current State
```bash
# Count relative imports
grep -r "from '\.\.\/" app/ --include="*.tsx" | wc -l

# Count console.error statements
grep -r "console.error" app/ --include="*.tsx" | wc -l

# Check TypeScript errors
cd cv-builder && npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
```

### Run After Each Phase
```bash
# 1. Type check
npx tsc --noEmit

# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Commit
git add -A && git commit -m "phase X: description"
```

## Implementation Order

### Phase 1: Import Paths ✅
- [ ] Replace all `../` imports with `@/`
- [ ] Test: `grep -r "from '\.\.\/" app/ | wc -l` should return 0

### Phase 2: Type Definitions  
- [ ] Move inline types to `lib/types/index.ts`
- [ ] Import types in pages
- [ ] Delete duplicate definitions

### Phase 3: Layout Architecture
- [ ] Update root `app/layout.tsx`
- [ ] Create specialized layouts
- [ ] Remove Navbar/Footer from pages

### Phase 4: Error Handling
- [ ] Create `useError` hook
- [ ] Create `ErrorDisplay` component
- [ ] Refactor all catch blocks

### Phase 5: Loading States
- [ ] Create `useLoading` hook
- [ ] Create `LoadingWrapper` component
- [ ] Add to all data-fetching pages

### Phase 6: Server/Client Pattern
- [ ] Write ADR document
- [ ] Convert portfolio page to Server Component

### Phase 7: Data Fetching
- [ ] Create API client
- [ ] Create service functions
- [ ] Refactor pages

### Phase 8: Auth Patterns
- [ ] Create `ProtectedRoute` component
- [ ] Apply to protected pages

### Phase 9: Code Quality
- [ ] Update ESLint rules
- [ ] Add pre-commit hook

### Phase 10: Testing
- [ ] Full regression test
- [ ] Performance check

---

## File Change Log

Track all modified files here:

```
Phase 1:
- app/page.tsx (import changes)
- app/builder/page.tsx (import changes)
- app/templates/page.tsx (import changes)
- app/portfolios/page.tsx (import changes)
- app/auth/signin/page.tsx (import changes)
- app/auth/signup/page.tsx (import changes)

Phase 2:
- lib/types/index.ts (new exports)
- app/cv/[slug]/page.tsx (type imports)
- app/dashboard/page.tsx (type imports)
- app/templates/page.tsx (typed sample data)

Phase 3:
- app/layout.tsx (add Navbar/Footer)
- app/builder/layout.tsx (new)
- app/dashboard/layout.tsx (new)
- app/cv/[slug]/layout.tsx (new)
- app/pricing/page.tsx (add nav)
- [8 pages] remove Navbar/Footer imports

Phase 4:
- lib/types/errors.ts (new)
- lib/hooks/useError.ts (new)
- components/ui/ErrorDisplay.tsx (new)
- [5 pages] implement error handling

Phase 5:
- lib/hooks/useLoading.ts (new)
- components/ui/LoadingWrapper.tsx (new)
- [4 pages] add loading states

Phase 6:
- docs/adr/001-server-vs-client.md (new)
- app/portfolio/[slug]/page.tsx (refactor)

Phase 7:
- lib/api/client.ts (new)
- lib/api/services/cv.ts (new)
- lib/api/services/portfolio.ts (new)
- [5 pages] use service functions

Phase 8:
- components/auth/ProtectedRoute.tsx (new)
- app/ai-builder/page.tsx (wrap with ProtectedRoute)
- app/dashboard/page.tsx (wrap with ProtectedRoute)
- app/builder/page.tsx (decide: wrap or keep public)

Phase 9:
- .eslintrc.js (update rules)
- .husky/pre-commit (new)

Phase 10:
- All pages (regression testing)
```

---

## Common Issues & Solutions

### Issue: Path alias not working
**Solution:** Check `tsconfig.json` has:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

### Issue: TypeScript can't find types
**Solution:** Ensure types are exported from `lib/types/index.ts`:
```typescript
export * from './cv'
export * from './portfolio-schema'
export * from './errors'  // new
```

### Issue: Test fails after changes
**Solution:** Update jest setup to handle new patterns

### Issue: Build fails
**Solution:** Run `npm run build` and fix errors incrementally

---

## Commit Message Template

```
phase X: brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3

Files changed: N files
Tests: X passing
TypeScript: No errors
```

Example:
```
phase 1: standardize import paths

- Replace all '../' imports with '@/'
- Update app/page.tsx, app/builder/page.tsx, etc.
- No functional changes, only import paths

Files changed: 8 files
Tests: 76 passing
TypeScript: No errors
```
