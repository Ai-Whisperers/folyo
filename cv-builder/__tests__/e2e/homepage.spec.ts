import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Folyo/)
  })

  test('displays hero section', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('has "Get Started" button', async ({ page }) => {
    const getStarted = page.getByRole('link', { name: /get started/i })
    await expect(getStarted).toBeVisible()
  })

  test('has "See Live Example" button that works', async ({ page }) => {
    const liveExample = page.getByRole('link', { name: /see live example/i })
    await expect(liveExample).toBeVisible()
    await liveExample.click()
    await expect(page).toHaveURL('/cv/demo')
  })

  test('has navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /templates/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible()
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Check no horizontal scroll
    const body = page.locator('body')
    const bodyWidth = await body.evaluate((el) => el.scrollWidth)
    const viewportWidth = 375

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5) // Allow small margin
  })
})
