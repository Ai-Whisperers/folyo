import { test, expect } from '@playwright/test'

test.describe('Public Portfolio Page', () => {
  test.describe('Demo Portfolio (/cv/demo)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cv/demo')
    })

    test('displays portfolio content', async ({ page }) => {
      // Check name displays
      await expect(page.getByText('Alex Johnson')).toBeVisible()
    })

    test('displays tagline', async ({ page }) => {
      await expect(page.getByText('Senior Product Designer')).toBeVisible()
    })

    test('has correct page title for SEO', async ({ page }) => {
      await expect(page).toHaveTitle(/Alex Johnson/)
    })

    test('displays experience section', async ({ page }) => {
      await expect(page.getByText('Experience')).toBeVisible()
      await expect(page.getByText('TechCorp Inc.')).toBeVisible()
    })

    test('displays education section', async ({ page }) => {
      await expect(page.getByText('Education')).toBeVisible()
      await expect(page.getByText('Stanford University')).toBeVisible()
    })

    test('displays skills section', async ({ page }) => {
      await expect(page.getByText('Skills')).toBeVisible()
      await expect(page.getByText('UI/UX Design')).toBeVisible()
    })

    test('has JSON-LD structured data', async ({ page }) => {
      const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
      expect(jsonLd).toContain('Alex Johnson')
      expect(jsonLd).toContain('schema.org')
    })

    test('is responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })

      // Content should still be visible
      await expect(page.getByText('Alex Johnson')).toBeVisible()
    })
  })

  test.describe('Non-existent Portfolio', () => {
    test('shows 404 for invalid slug', async ({ page }) => {
      await page.goto('/cv/this-portfolio-does-not-exist-12345')

      // Should show not found page
      await expect(page.getByText('Portfolio Not Found')).toBeVisible()
    })

    test('has link to create portfolio', async ({ page }) => {
      await page.goto('/cv/invalid-slug')

      const createLink = page.getByRole('link', { name: /create/i })
      await expect(createLink).toBeVisible()
    })
  })
})
