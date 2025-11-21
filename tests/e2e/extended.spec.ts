import { test, expect } from '@playwright/test';

test.describe('Extended E2E Tests', () => {
  test.describe('Mobile-First Responsive Tests', () => {
    test('should have a mobile-friendly layout', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8 viewport
      await page.goto('/');

      // Add assertions to check for mobile-specific layout
      const brandTitle = page.getByTestId('brand-title');
      await expect(brandTitle).toBeVisible();

      // Example: Check if the main content area is not wider than the viewport
      const mainContent = page.locator('main');
      const mainContentBoundingBox = await mainContent.boundingBox();
      expect(mainContentBoundingBox).not.toBeNull();
      if (mainContentBoundingBox) {
        expect(mainContentBoundingBox.width).toBeLessThanOrEqual(375);
      }

      await expect(page).toHaveScreenshot('mobile-chat-page.png');
    });

    test('should have a tablet-friendly layout', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad viewport
      await page.goto('/');
      await expect(page).toHaveScreenshot('tablet-chat-page.png');
    });

    test('should have a desktop-friendly layout', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop viewport
      await page.goto('/');
      await expect(page).toHaveScreenshot('desktop-chat-page.png');
    });
  });

  test.describe('Functional Tests', () => {
    test('should allow a user to ask a question in the chat', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/chat-response.har', {
        url: '/chat',
        update: false,
      });

      await page.goto('/');
      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('What is the capital of France?');
      await page.getByTestId('submit-question-button').click();

      const chatResponse = page.locator('.chat__txt').nth(-1);
      await expect(chatResponse).toContainText('Paris is the capital of France.');
    });

    test('should allow a user to ask a question in the ask a question page', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/ask-response.har', {
        url: '/ask',
        update: false,
      });

      await page.goto('/ask');
      const chatInput = page.getByTestId('question-input');
      await chatInput.fill('Tell me about the Contoso Real Estate privacy policy.');
      await page.getByTestId('submit-question-button').click();

      const chatResponse = page.locator('.chat__txt').nth(-1);
      await expect(chatResponse).toContainText(
        'The Contoso Real Estate privacy policy is a document that outlines how the company collects, uses, and protects the personal information of its users.',
      );
    });
  });

  test.describe('Library Page Tests', () => {
    test('should load the library page and display documents', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/library-response.har', {
        url: '/library',
        update: false,
      });
      await page.goto('/library');
      const libraryTitle = page.getByRole('heading', { name: 'Library' });
      await expect(libraryTitle).toBeVisible();

      // Check for at least one document in the library
      const documentList = page.locator('.library-document');
      await expect(documentList.first()).toBeVisible({ timeout: 10_000 });

      await expect(page).toHaveScreenshot('library-page.png');
    });
  });

  test.describe('Settings Page Tests', () => {
    test('should load the settings page and display developer settings', async ({ page }) => {
      await page.routeFromHAR('./tests/e2e/hars/settings-response.har', {
        url: '/settings',
        update: false,
      });
      await page.goto('/settings');
      const settingsTitle = page.getByRole('heading', { name: 'Settings' });
      await expect(settingsTitle).toBeVisible();

      // Check for the developer settings section
      const developerSettings = page.getByTestId('developer-settings');
      await expect(developerSettings).toBeVisible();

      await expect(page).toHaveScreenshot('settings-page.png');
    });
  });

  test.describe('Error Handling Tests', () => {
    test('should display an error message for an empty chat submission', async ({ page }) => {
      await page.goto('/');
      const submitButton = page.getByTestId('submit-question-button');
      await submitButton.click();

      const errorMessage = page.locator('.chat__txt.error');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText('Please enter a question.');
    });

    test('should display a user-friendly error on server failure', async ({ page }) => {
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

  test.describe('Usability Tests', () => {
    test('should have clear call-to-actions', async ({ page }) => {
      await page.goto('/');
      const chatInput = page.getByTestId('question-input');
      await expect(chatInput).toHaveAttribute('placeholder', 'Ask me anything or try an example');

      const submitButton = page.getByTestId('submit-question-button');
      await expect(submitButton).toBeVisible();
    });
  });
});
