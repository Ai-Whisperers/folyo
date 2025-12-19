import { test, expect } from '@playwright/test'

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing')
  })

  test('displays pricing page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /pricing/i })).toBeVisible()
  })

  test('shows all three pricing tiers', async ({ page }) => {
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Premium')).toBeVisible()
  })

  test('shows correct monthly prices', async ({ page }) => {
    // Ensure monthly is selected
    await page.getByRole('button', { name: /monthly/i }).click()

    await expect(page.getByText('$0')).toBeVisible()
    await expect(page.getByText('$10/month')).toBeVisible()
    await expect(page.getByText('$25/month')).toBeVisible()
  })

  test('yearly toggle shows discounted prices', async ({ page }) => {
    // Click yearly toggle
    await page.getByRole('button', { name: /yearly/i }).click()

    // Should show yearly prices (20% discount)
    // $10 * 12 * 0.8 = $96
    // $25 * 12 * 0.8 = $240
    await expect(page.getByText('$96/year')).toBeVisible()
    await expect(page.getByText('$240/year')).toBeVisible()
  })

  test('shows "Save 20%" badge on yearly toggle', async ({ page }) => {
    await expect(page.getByText('Save 20%')).toBeVisible()
  })

  test('Pro tier is marked as most popular', async ({ page }) => {
    await expect(page.getByText('Most Popular')).toBeVisible()
  })

  test('feature comparison table exists', async ({ page }) => {
    await expect(page.getByText('Feature Comparison')).toBeVisible()
  })

  test('CTA buttons navigate to signup', async ({ page }) => {
    const startFreeButton = page.getByRole('link', { name: /start free/i }).first()
    await startFreeButton.click()

    await expect(page).toHaveURL(/auth\/signup/)
  })

  test('FAQ section is visible', async ({ page }) => {
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible()
    await expect(page.getByText(/Can I change plans/i)).toBeVisible()
    await expect(page.getByText(/free trial/i)).toBeVisible()
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Pricing cards should still be visible
    await expect(page.getByText('Free')).toBeVisible()
    await expect(page.getByText('Pro')).toBeVisible()
    await expect(page.getByText('Premium')).toBeVisible()
  })
})
