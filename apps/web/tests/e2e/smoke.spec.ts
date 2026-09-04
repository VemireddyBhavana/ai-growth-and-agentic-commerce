import { test, expect } from '@playwright/test';

test.describe('Web Application Smoke Test', () => {
  test('landing page loads correctly and displays brand title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AI Sales Assistant');
  });
});
