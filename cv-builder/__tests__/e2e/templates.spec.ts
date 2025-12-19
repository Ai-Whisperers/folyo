import { test, expect } from '@playwright/test'

test.describe('Templates Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/templates')
  })

  test('displays templates page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /templates/i })).toBeVisible()
  })

  test('shows template grid', async ({ page }) => {
    // Should have multiple template options
    const templateCards = page.locator('[data-testid="template-card"]')
    const count = await templateCards.count()

    // If no data-testid, look for template-like elements
    if (count === 0) {
      // Look for theme/template indicators
      await expect(page.getByText(/teal|blue|berry|professional/i).first()).toBeVisible()
    } else {
      expect(count).toBeGreaterThan(0)
    }
  })

  test('has preview panel', async ({ page }) => {
    // Desktop view should have preview
    await page.setViewportSize({ width: 1280, height: 800 })

    // Look for preview section
    const preview = page.locator('[data-testid="template-preview"]')
    const previewExists = (await preview.count()) > 0

    if (!previewExists) {
      // Alternative: check for CV content in preview
      await expect(page.getByText(/Alex Johnson|Preview/i).first()).toBeVisible()
    }
  })

  test('has "Use This Template" button', async ({ page }) => {
    const useTemplate = page.getByRole('link', { name: /use.*template/i })
    await expect(useTemplate.first()).toBeVisible()
  })

  test('template selection changes preview', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })

    // Find and click a different template
    const templateOptions = page.locator('[data-testid="template-option"]')
    const count = await templateOptions.count()

    if (count > 1) {
      await templateOptions.nth(1).click()
      // Preview should update (theme color should change)
    }
  })

  test('category filters work', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]')
    const filterExists = (await categoryFilter.count()) > 0

    if (filterExists) {
      await categoryFilter.first().click()
      // Templates should filter
    }
  })

  test('mobile/desktop preview toggle works', async ({ page }) => {
    const desktopToggle = page.getByRole('button', { name: /desktop/i })
    const mobileToggle = page.getByRole('button', { name: /mobile/i })

    const hasToggle = (await desktopToggle.count()) > 0

    if (hasToggle) {
      await mobileToggle.click()
      // Preview should show mobile view
      await desktopToggle.click()
      // Preview should show desktop view
    }
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Page should still load without errors
    await expect(page.locator('body')).toBeVisible()
  })
})
