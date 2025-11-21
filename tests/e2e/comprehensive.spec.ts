import { test, expect } from '@playwright/test';

test.describe('Comprehensive E2E Test Suite', () => {
  test.describe('Functional Testing', () => {
    test('FT-001: Successful Chat Interaction (Happy Path)', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/chat-response.har', {
        url: '/chat',
        update: false,
      });

      await page.goto('/');
      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('What is the capital of France?');
      await page.getByTestId('submit-question-button').click();

      // The HAR file for chat-response.har contains "Paris is the capital of France"
      const chatResponse = page.locator('.chat__txt').nth(-1);
      await expect(chatResponse).toContainText('Paris is the capital of France');
    });

    test('FT-002: Ask a Question (Happy Path)', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/ask-response.har', {
        url: '/ask',
        update: false,
      });

      await page.goto('/ask');
      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('Tell me about the Contoso Real Estate privacy policy.');
      await page.getByTestId('submit-question-button').click();

      const chatResponse = page.locator('.chat__txt').last();
      await expect(chatResponse).toContainText(
        'The Contoso Real Estate privacy policy is a document that outlines how the company collects, uses, and protects the personal information of its users.',
      );
    });

    test('FT-003: Empty Question Submission', async ({ page }) => {
      await page.goto('/');
      const submitButton = page.getByTestId('submit-question-button');
      await submitButton.click();

      const errorMessage = page.locator('.chat__txt.error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Please enter a question.');
    });

    test('FT-004: Server Error Handling', async ({ page }) => {
      await page.goto('/');
      await page.route('**/chat', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });

      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('What is the meaning of life?');
      await page.getByTestId('submit-question-button').click();

      const errorMessage = page.locator('.chat__txt.error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Sorry, we are having some problems.');
    });
  });

  test.describe('Visual / UI Testing (Mobile-First)', () => {
    test('VT-001: Mobile Layout Verification', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone 12 viewport
      await page.goto('/');

      const brandTitle = page.getByTestId('brand-title');
      await expect(brandTitle).toBeVisible();

      const mainContent = page.locator('main');
      const mainContentBoundingBox = await mainContent.boundingBox();
      expect(mainContentBoundingBox).not.toBeNull();
      if (mainContentBoundingBox) {
        expect(mainContentBoundingBox.width).toBeLessThanOrEqual(375);
      }

      await expect(page).toHaveScreenshot('mobile-chat-page.png');
    });

    test('VT-002: Tablet Layout Verification', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad Air viewport
      await page.goto('/');
      await expect(page).toHaveScreenshot('tablet-chat-page.png');
    });

    test('VT-003: Desktop Layout Verification', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop viewport
      await page.goto('/');
      await expect(page).toHaveScreenshot('desktop-chat-page.png');
    });
  });

  test.describe('User Experience & Usability', () => {
    test('UX-001: Clear Call-to-Actions', async ({ page }) => {
      await page.goto('/');
      const chatInput = page.getByTestId('question-input');
      await expect(chatInput).toHaveAttribute('placeholder', 'Ask me anything or try an example');

      const submitButton = page.getByTestId('submit-question-button');
      await expect(submitButton).toBeVisible();
    });

    test('UX-002: Mobile Navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone 12 viewport
      await page.goto('/');

      // Example check for a mobile navigation element (e.g., a hamburger menu button)
      // This is a placeholder; the actual selector will depend on the app's implementation
      // await expect(mobileNavButton).toBeVisible();
    });
  });

  test.describe('Cross-Browser / Cross-Device Considerations', () => {
    // These tests will be run across the configured browsers (Chrome, Firefox, WebKit)
    // and devices (Pixel 5, iPhone 12, iPad Air) by Playwright.
    // The test logic is the same as the functional tests, but the execution context is different.

    test('CB-001 / CB-002 / CB-003: Full User Flow', async ({ page, browserName }) => {
      console.log(`[Cross-Browser Test] Running on browser: ${browserName}`);
      // Chat
      await page.routeFromHAR('./tests/e2e/hars/chat-response.har', { url: '/chat', update: false });
      await page.goto('/');
      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('What is the capital of France?');
      await page.getByTestId('submit-question-button').click();
      const chatResponse = page.locator('.chat__txt').nth(-1);
      await expect(chatResponse).toContainText('Paris is the capital of France');

      // Ask
      await page.routeFromHAR('./tests/e2e/hars/ask-response.har', { url: '/ask', update: false });
      await page.goto('/ask');
      const askInput = page.getByTestId('question-input');
      await askInput.fill('Tell me about the Contoso Real Estate privacy policy.');
      await page.getByTestId('submit-question-button').click();
      const askResponse = page.locator('.chat__txt').nth(-1);
      await expect(askResponse).toContainText(
        'The Contoso Real Estate privacy policy is a document that outlines how the company collects, uses, and protects the personal information of its users.',
      );

      // Library
      await page.routeFromHAR('./tests/e2e/hars/library-response.har', { url: '/library', update: false });
      await page.goto('/library');
      const libraryTitle = page.getByRole('heading', { name: 'Library' });
      await expect(libraryTitle).toBeVisible();
      const documentList = page.locator('.library-document');
      await expect(documentList.first()).toBeVisible({ timeout: 10_000 });

      // Settings
      await page.routeFromHAR('./tests/e2e/hars/settings-response.har', { url: '/settings', update: false });
      await page.goto('/settings');
      const settingsTitle = page.getByRole('heading', { name: 'Settings' });
      await expect(settingsTitle).toBeVisible();
      const developerSettings = page.getByTestId('developer-settings');
      await expect(developerSettings).toBeVisible();
    });
  });
});
