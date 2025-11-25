import { expect, test } from '@playwright/test';

/**
 * Admin Panel E2E Tests
 *
 * Tests for the admin panel functionality including:
 * - Access control (admin-only)
 * - User management
 * - Personality management
 * - Program management
 * - Knowledge base overview
 */

test.describe('Admin Panel', () => {
  // Helper to login as admin
  async function loginAsAdmin(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Admin/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  // Helper to login as non-admin (client)
  async function loginAsClient(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Client/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  test.describe('Access Control', () => {
    test('ADMIN-01: Admin user can access admin panel', async ({ page }) => {
      await loginAsAdmin(page);

      await test.step('Navigate to admin panel', async () => {
        await page.goto('/admin');
      });

      await test.step('Verify admin panel loads', async () => {
        await expect(
          page.getByRole('heading', { name: /Admin Panel/i })
        ).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/Manage users, personalities, programs/i)
        ).toBeVisible();
      });

      await test.step('Verify all tabs are visible', async () => {
        await expect(
          page.getByRole('button', { name: /Overview/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Users/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Personalities/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Programs/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Knowledge Base/i })
        ).toBeVisible();
      });
    });

    test('ADMIN-02: Non-admin user cannot access admin panel', async ({
      page,
    }) => {
      await loginAsClient(page);

      await test.step('Attempt to navigate to admin panel', async () => {
        await page.goto('/admin');
      });

      await test.step('Verify access is denied or redirected', async () => {
        // Should either redirect to home/login or show access denied
        const currentUrl = page.url();
        const adminPanelVisible = await page
          .getByRole('heading', { name: /Admin Panel/i })
          .isVisible()
          .catch(() => false);

        // Admin panel should NOT be visible for non-admin users
        expect(adminPanelVisible).toBeFalsy();

        test.info().annotations.push({
          type: 'info',
          description: `Non-admin redirected to: ${currentUrl}`,
        });
      });
    });
  });

  test.describe('Overview Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-OVERVIEW-01: Overview tab shows system statistics', async ({
      page,
    }) => {
      await test.step('Verify overview is default tab', async () => {
        // Overview should be active by default
        const overviewButton = page.getByRole('button', { name: /Overview/i });
        await expect(overviewButton).toHaveClass(/active/);
      });

      await test.step('Verify statistics cards', async () => {
        await expect(page.getByText(/Users/i).first()).toBeVisible();
        await expect(page.getByText(/Personalities/i).first()).toBeVisible();
        await expect(page.getByText(/Programs/i).first()).toBeVisible();
        await expect(page.getByText(/Knowledge Base/i).first()).toBeVisible();
      });

      await test.step('Verify backend capabilities list', async () => {
        await expect(page.getByText(/Backend Capabilities/i)).toBeVisible();
        await expect(page.getByText(/RAG with Azure AI Search/i)).toBeVisible();
        await expect(
          page.getByText(/Custom coaching personalities/i)
        ).toBeVisible();
      });
    });
  });

  test.describe('Users Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-03: View users list', async ({ page }) => {
      await test.step('Click Users tab', async () => {
        await page.getByRole('button', { name: /Users/i }).click();
      });

      await test.step('Verify users table is displayed', async () => {
        // Wait for loading to complete
        await expect(page.getByText(/Loading users/i)).not.toBeVisible({
          timeout: 10000,
        });

        // Check for table headers
        await expect(
          page.getByRole('columnheader', { name: /ID/i })
        ).toBeVisible();
        await expect(
          page.getByRole('columnheader', { name: /Email/i })
        ).toBeVisible();
        await expect(
          page.getByRole('columnheader', { name: /Name/i })
        ).toBeVisible();
        await expect(
          page.getByRole('columnheader', { name: /Role/i })
        ).toBeVisible();
      });

      await test.step('Verify at least one user is listed', async () => {
        // At minimum, the demo users should be present
        const userRows = page.locator('table tbody tr');
        const count = await userRows.count();

        expect(count).toBeGreaterThan(0);

        test.info().annotations.push({
          type: 'info',
          description: `Found ${count} users in the list`,
        });
      });
    });
  });

  test.describe('Personalities Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-04: View personalities list', async ({ page }) => {
      await test.step('Click Personalities tab', async () => {
        await page.getByRole('button', { name: /Personalities/i }).click();
      });

      await test.step('Verify personalities section loads', async () => {
        await expect(
          page.getByRole('heading', { name: /Coaching Personalities/i })
        ).toBeVisible();
        await expect(page.getByText(/Custom AI personas/i)).toBeVisible();
      });

      await test.step('Check for personality cards', async () => {
        // Wait for loading to complete
        await expect(page.getByText(/Loading personalities/i)).not.toBeVisible({
          timeout: 10000,
        });

        // Look for personality cards (implementation-specific)
        const personalityCards = page.locator('[class*="personalityCard"]');
        const count = await personalityCards.count();

        test.info().annotations.push({
          type: 'info',
          description: `Found ${count} personality cards`,
        });
      });
    });
  });

  test.describe('Programs Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-05: View programs list', async ({ page }) => {
      await test.step('Click Programs tab', async () => {
        await page.getByRole('button', { name: /Programs/i }).click();
      });

      await test.step('Verify programs section loads', async () => {
        await expect(
          page.getByRole('heading', { name: /Programs/i })
        ).toBeVisible();
        await expect(
          page.getByText(/Coaching programs with assigned coaches/i)
        ).toBeVisible();
      });

      await test.step('Check for programs table', async () => {
        // Wait for loading to complete
        await expect(page.getByText(/Loading programs/i)).not.toBeVisible({
          timeout: 10000,
        });

        // Check for table structure
        const programsTable = page.locator('table');
        const hasTable = await programsTable.isVisible();

        test.info().annotations.push({
          type: 'info',
          description: `Programs table visible: ${hasTable}`,
        });
      });
    });
  });

  test.describe('Knowledge Base Tab', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-06: View knowledge base overview', async ({ page }) => {
      await test.step('Click Knowledge Base tab', async () => {
        await page.getByRole('button', { name: /Knowledge Base/i }).click();
      });

      await test.step('Verify knowledge base section loads', async () => {
        await expect(
          page.getByRole('heading', { name: /Knowledge Base/i })
        ).toBeVisible();
        await expect(page.getByText(/RAG-indexed documents/i)).toBeVisible();
      });

      await test.step('Check for statistics', async () => {
        // Wait for loading to complete
        await expect(page.getByText(/Loading knowledge base/i)).not.toBeVisible(
          { timeout: 10000 }
        );

        // Check for stats cards or message
        const totalResources = page.getByText(/Total Resources/i);
        const noData = page.getByText(/No knowledge base data/i);

        const hasStats = await totalResources.isVisible().catch(() => false);
        const hasNoData = await noData.isVisible().catch(() => false);

        expect(hasStats || hasNoData).toBeTruthy();

        test.info().annotations.push({
          type: 'info',
          description: `Knowledge base has data: ${hasStats}`,
        });
      });
    });
  });

  test.describe('Tab Navigation', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/admin');
      await expect(
        page.getByRole('heading', { name: /Admin Panel/i })
      ).toBeVisible({ timeout: 10000 });
    });

    test('ADMIN-07: Tab navigation works correctly', async ({ page }) => {
      const tabs = [
        'Overview',
        'Users',
        'Personalities',
        'Programs',
        'Knowledge Base',
      ];

      for (const tab of tabs) {
        await test.step(`Click ${tab} tab`, async () => {
          await page
            .getByRole('button', { name: new RegExp(tab, 'i') })
            .click();

          // Verify tab becomes active
          const tabButton = page.getByRole('button', {
            name: new RegExp(tab, 'i'),
          });
          await expect(tabButton).toHaveClass(/active/);

          // Wait for content to load
          await page.waitForTimeout(500);
        });
      }
    });
  });
});

test.describe('Admin Panel - Visual', () => {
  async function loginAsAdmin(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Admin/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  test('ADMIN-VIS-01: Admin panel visual snapshot (desktop)', async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/admin');

    // Wait for page to fully load
    await expect(
      page.getByRole('heading', { name: /Admin Panel/i })
    ).toBeVisible({ timeout: 10000 });

    // Wait for any loading states to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('admin-panel-desktop.png');
  });
});
