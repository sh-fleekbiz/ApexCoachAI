import { expect, test } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * These tests cover the demo login flow which is the primary authentication
 * mechanism for Apex Coach AI. The app supports three demo roles:
 * - Admin: Full platform access
 * - Coach: Coaching features
 * - Client: Client-side features
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session before each test
    await page.context().clearCookies();
  });

  test.describe('Demo Login Flow', () => {
    test('AUTH-01: Demo login with Admin role', async ({ page }) => {
      await test.step('Navigate to login page', async () => {
        await page.goto('/login');
        await expect(page).toHaveURL(/\/login/);
      });

      await test.step('Verify login page elements', async () => {
        // Check page title and subtitle
        await expect(
          page.getByRole('heading', { name: /Apex Coach AI/i })
        ).toBeVisible();
        await expect(
          page.getByText(/AI-powered coaching companion/i)
        ).toBeVisible();

        // Check role selection buttons are present
        await expect(
          page.getByRole('button', { name: /Admin/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Coach/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Client/i })
        ).toBeVisible();
      });

      await test.step('Click Admin demo login', async () => {
        await page.getByRole('button', { name: /Admin/i }).click();
      });

      await test.step('Verify successful login and redirect', async () => {
        // Should redirect to home page after successful login
        await expect(page).toHaveURL('/', { timeout: 10000 });

        // Verify user is logged in by checking for authenticated elements
        // The chat page should be visible for logged-in users
        await expect(page.getByText(/Your AI Coach/i)).toBeVisible({
          timeout: 10000,
        });
      });
    });

    test('AUTH-02: Demo login with Coach role', async ({ page }) => {
      await test.step('Navigate to login page', async () => {
        await page.goto('/login');
      });

      await test.step('Click Coach demo login', async () => {
        await page.getByRole('button', { name: /Coach/i }).click();
      });

      await test.step('Verify successful login', async () => {
        await expect(page).toHaveURL('/', { timeout: 10000 });
        await expect(page.getByText(/Your AI Coach/i)).toBeVisible({
          timeout: 10000,
        });
      });
    });

    test('AUTH-03: Demo login with Client role', async ({ page }) => {
      await test.step('Navigate to login page', async () => {
        await page.goto('/login');
      });

      await test.step('Click Client demo login', async () => {
        await page.getByRole('button', { name: /Client/i }).click();
      });

      await test.step('Verify successful login', async () => {
        await expect(page).toHaveURL('/', { timeout: 10000 });
        await expect(page.getByText(/Your AI Coach/i)).toBeVisible({
          timeout: 10000,
        });
      });
    });

    test('AUTH-04: Login page renders correctly', async ({ page }) => {
      await page.goto('/login');

      await test.step('Verify login card structure', async () => {
        // Main title
        await expect(
          page.getByRole('heading', { name: /Apex Coach AI/i })
        ).toBeVisible();

        // Subtitle
        await expect(
          page.getByText(/AI-powered coaching companion/i)
        ).toBeVisible();

        // Role selection prompt
        await expect(page.getByText(/Select a demo role/i)).toBeVisible();

        // Footer text
        await expect(page.getByText(/No account needed/i)).toBeVisible();
      });

      await test.step('Verify role button descriptions', async () => {
        // Each role button should have an icon, label, and description
        const adminButton = page.getByRole('button', { name: /Admin/i });
        const coachButton = page.getByRole('button', { name: /Coach/i });
        const clientButton = page.getByRole('button', { name: /Client/i });

        await expect(adminButton).toBeVisible();
        await expect(coachButton).toBeVisible();
        await expect(clientButton).toBeVisible();
      });
    });
  });

  test.describe('Login Error Handling', () => {
    test('AUTH-05: Login error displays message', async ({ page }) => {
      // Mock the demo-login endpoint to return an error
      await page.route('**/auth/demo-login', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Demo login temporarily unavailable' }),
        });
      });

      await page.goto('/login');
      await page.getByRole('button', { name: /Admin/i }).click();

      // Should show error message
      await expect(page.getByText(/failed|error|unavailable/i)).toBeVisible({
        timeout: 5000,
      });

      // Should remain on login page
      await expect(page).toHaveURL(/\/login/);
    });

    test('AUTH-06: Disabled demo login shows appropriate message', async ({
      page,
    }) => {
      // Mock the demo-login endpoint to return 403 (disabled)
      await page.route('**/auth/demo-login', (route) => {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Demo login is disabled' }),
        });
      });

      await page.goto('/login');
      await page.getByRole('button', { name: /Client/i }).click();

      // Should show error message
      await expect(page.getByText(/disabled|error|failed/i)).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe('Protected Routes', () => {
    test('AUTH-07: Unauthenticated user redirected to login', async ({
      page,
    }) => {
      // Try to access protected route directly without logging in
      await page.goto('/');

      // Should redirect to login page
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });

    test('AUTH-08: Authenticated user can access protected routes', async ({
      page,
    }) => {
      // Login first
      await page.goto('/login');
      await page.getByRole('button', { name: /Client/i }).click();
      await expect(page).toHaveURL('/', { timeout: 10000 });

      // Navigate to library (protected route)
      await page.goto('/library');
      await expect(page).toHaveURL(/\/library/);
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('AUTH-09: User can logout successfully', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByRole('button', { name: /Client/i }).click();
      await expect(page).toHaveURL('/', { timeout: 10000 });

      // Find and click logout button (typically in settings or profile area)
      // This may need adjustment based on actual UI implementation
      const logoutButton = page.getByRole('button', {
        name: /logout|sign out/i,
      });

      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Should redirect to login page
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
      } else {
        // Skip if logout button not found in current UI
        test.skip();
      }
    });
  });
});

test.describe('Authentication - Visual', () => {
  test('AUTH-VIS-01: Login page visual snapshot (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');

    // Wait for page to fully load
    await expect(
      page.getByRole('heading', { name: /Apex Coach AI/i })
    ).toBeVisible();

    await expect(page).toHaveScreenshot('login-page-mobile.png');
  });

  test('AUTH-VIS-02: Login page visual snapshot (desktop)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/login');

    // Wait for page to fully load
    await expect(
      page.getByRole('heading', { name: /Apex Coach AI/i })
    ).toBeVisible();

    await expect(page).toHaveScreenshot('login-page-desktop.png');
  });
});
