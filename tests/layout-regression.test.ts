import { test, expect } from '@playwright/test';

test.describe('Layout Centering Regression', () => {
  test('home page assessments container is centered in main area', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('main');
    
    const container = await page.locator('main .max-w-4xl').first();
    const main = await page.locator('main').first();
    
    const containerBox = await container.boundingBox();
    const mainBox = await main.boundingBox();
    
    if (containerBox && mainBox) {
      const containerCenter = containerBox.x + containerBox.width / 2;
      const mainCenter = mainBox.x + mainBox.width / 2;
      
      // Allow for minor sub-pixel rendering differences
      expect(Math.abs(containerCenter - mainCenter)).toBeLessThan(2);
    }
  });

  test('settings page container is centered in main area', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForSelector('main');
    
    const container = await page.locator('main .max-w-4xl').first();
    const main = await page.locator('main').first();
    
    const containerBox = await container.boundingBox();
    const mainBox = await main.boundingBox();
    
    if (containerBox && mainBox) {
      const containerCenter = containerBox.x + containerBox.width / 2;
      const mainCenter = mainBox.x + mainBox.width / 2;
      
      expect(Math.abs(containerCenter - mainCenter)).toBeLessThan(2);
    }
  });
});
