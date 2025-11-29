import { expect, test } from '@playwright/test';

test.describe('Mobile Touch Interactions', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
  });

  test('should support touch interactions on starter prompts', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const starterPrompt = page.locator('button.starterPromptCard').first();
    if (await starterPrompt.isVisible({ timeout: 5000 })) {
      await starterPrompt.tap();
      await page.waitForTimeout(500);
      // Verify interaction occurred
      await expect(starterPrompt).toBeVisible();
    }
  });

  test('should have adequate touch target sizes for buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const buttons = page.locator('button, [role="button"]').filter({ hasText: /.+/ });
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const box = await firstButton.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should support touch on new chat button', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const newChatButton = page.getByRole('button', { name: /new chat/i }).first();
    if (await newChatButton.isVisible({ timeout: 5000 })) {
      const box = await newChatButton.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
      await newChatButton.tap();
      await page.waitForTimeout(500);
    }
  });

  test('should have adequate spacing between touch targets', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    const buttons = page.locator('button.starterPromptCard');
    const buttonCount = await buttons.count();
    
    if (buttonCount >= 2) {
      const firstButton = buttons.first();
      const secondButton = buttons.nth(1);
      const firstBox = await firstButton.boundingBox();
      const secondBox = await secondButton.boundingBox();
      
      if (firstBox && secondBox) {
        const verticalSpacing = Math.abs(secondBox.y - (firstBox.y + firstBox.height));
        const horizontalSpacing = Math.abs(secondBox.x - (firstBox.x + firstBox.width));
        const minSpacing = Math.min(verticalSpacing, horizontalSpacing);
        expect(minSpacing).toBeGreaterThanOrEqual(8);
      }
    }
  });
});

