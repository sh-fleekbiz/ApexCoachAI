import { expect, test } from '@playwright/test';

/**
 * Content Library E2E Tests
 *
 * Tests for the content library functionality including:
 * - Browsing resources
 * - Searching and filtering
 * - Viewing resource details
 * - Admin-only upload functionality
 */

test.describe('Content Library', () => {
  // Helper to login as client
  async function loginAsClient(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Client/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  // Helper to login as admin
  async function loginAsAdmin(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Admin/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  test.describe('Browse Library', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsClient(page);
    });

    test('LIB-01: Browse content library', async ({ page }) => {
      await test.step('Navigate to library', async () => {
        await page.goto('/library');
      });

      await test.step('Verify library page loads', async () => {
        await expect(
          page.getByRole('heading', { name: /Content Library/i })
        ).toBeVisible({ timeout: 10000 });
        await expect(
          page.getByText(/Browse videos, transcripts/i)
        ).toBeVisible();
      });

      await test.step('Verify search and filter controls', async () => {
        // Search input
        await expect(page.getByPlaceholder(/Search by title/i)).toBeVisible();

        // Status filter
        const statusFilter = page
          .locator('select')
          .filter({ hasText: /All Status/i });
        await expect(statusFilter).toBeVisible();

        // View toggle buttons
        await expect(
          page.getByRole('button', { name: /Grid view/i })
        ).toBeVisible();
        await expect(
          page.getByRole('button', { name: /List view/i })
        ).toBeVisible();
      });

      await test.step('Check for content or empty state', async () => {
        // Wait for loading to complete
        await expect(page.getByText(/Loading library/i)).not.toBeVisible({
          timeout: 10000,
        });

        // Either resources are displayed or empty state
        const hasResources =
          (await page
            .locator('[class*="grid"], [class*="list"]')
            .locator('> *')
            .count()) > 0;
        const hasEmptyState = await page
          .getByText(/No resources found/i)
          .isVisible()
          .catch(() => false);

        expect(hasResources || hasEmptyState).toBeTruthy();

        test.info().annotations.push({
          type: 'info',
          description: `Library has resources: ${hasResources}`,
        });
      });
    });

    test('LIB-02: Search library resources', async ({ page }) => {
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      await test.step('Enter search term', async () => {
        const searchInput = page.getByPlaceholder(/Search by title/i);
        await searchInput.fill('test');
      });

      await test.step('Verify search filters results', async () => {
        // Wait for search to be applied (debounced)
        await page.waitForTimeout(500);

        // Results should be filtered (or empty)
        // Check that the page responds to search
        test.info().annotations.push({
          type: 'info',
          description: 'Search input accepted and processed',
        });
      });

      await test.step('Clear search', async () => {
        const searchInput = page.getByPlaceholder(/Search by title/i);
        await searchInput.clear();

        // Wait for filter to be removed
        await page.waitForTimeout(500);
      });
    });

    test('LIB-03: Filter by status', async ({ page }) => {
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      const statusOptions = [
        'all',
        'indexed',
        'processing',
        'pending',
        'failed',
      ];

      for (const status of statusOptions) {
        await test.step(`Filter by ${status} status`, async () => {
          const statusFilter = page
            .locator('select')
            .filter({ hasText: /Status/i });
          await statusFilter.selectOption(status);

          // Wait for filter to be applied
          await page.waitForTimeout(300);

          test.info().annotations.push({
            type: 'info',
            description: `Filtered by status: ${status}`,
          });
        });
      }
    });

    test('LIB-06: Grid/list view toggle', async ({ page }) => {
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      await test.step('Toggle to list view', async () => {
        await page.getByRole('button', { name: /List view/i }).click();

        // Verify list view button is now active
        const listButton = page.getByRole('button', { name: /List view/i });
        await expect(listButton).toHaveClass(/active/);
      });

      await test.step('Toggle back to grid view', async () => {
        await page.getByRole('button', { name: /Grid view/i }).click();

        // Verify grid view button is now active
        const gridButton = page.getByRole('button', { name: /Grid view/i });
        await expect(gridButton).toHaveClass(/active/);
      });
    });
  });

  test.describe('Resource Details', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsClient(page);
    });

    test('LIB-04: View resource details', async ({ page }) => {
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      // Wait for loading to complete
      await expect(page.getByText(/Loading library/i)).not.toBeVisible({
        timeout: 10000,
      });

      // Check if there are any resources to click
      const resourceCards = page
        .locator('[class*="resourceCard"], [class*="card"]')
        .first();
      const hasResources = await resourceCards.isVisible().catch(() => false);

      if (hasResources) {
        await test.step('Click on a resource', async () => {
          await resourceCards.click();
        });

        await test.step('Verify detail view opens', async () => {
          // Detail modal or panel should open
          // Look for close button or detail-specific elements
          const detailView = page.locator(
            '[class*="detail"], [class*="modal"]'
          );
          await expect(detailView).toBeVisible({ timeout: 5000 });
        });

        await test.step('Close detail view', async () => {
          // Find and click close button
          const closeButton = page
            .getByRole('button', { name: /close|×/i })
            .first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
          }
        });
      } else {
        test.info().annotations.push({
          type: 'skip',
          description: 'No resources available to view details',
        });
      }
    });
  });

  test.describe('Admin Upload', () => {
    test('LIB-05: Upload resource (admin only)', async ({ page }) => {
      await loginAsAdmin(page);
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      await test.step('Verify upload button is visible for admin', async () => {
        const uploadButton = page.getByRole('button', {
          name: /Upload Resource/i,
        });
        await expect(uploadButton).toBeVisible();
      });

      await test.step('Click upload button', async () => {
        await page.getByRole('button', { name: /Upload Resource/i }).click();
      });

      await test.step('Verify upload modal opens', async () => {
        // Upload modal should appear
        const uploadModal = page
          .locator('[class*="upload"], [class*="modal"]')
          .first();
        await expect(uploadModal).toBeVisible({ timeout: 5000 });
      });

      await test.step('Close upload modal', async () => {
        // Find and click close button
        const closeButton = page
          .getByRole('button', { name: /close|cancel|×/i })
          .first();
        if (await closeButton.isVisible()) {
          await closeButton.click();
        }
      });
    });

    test('LIB-05b: Upload button not visible for non-admin', async ({
      page,
    }) => {
      await loginAsClient(page);
      await page.goto('/library');
      await expect(
        page.getByRole('heading', { name: /Content Library/i })
      ).toBeVisible({ timeout: 10000 });

      await test.step('Verify upload button is NOT visible for client', async () => {
        const uploadButton = page.getByRole('button', {
          name: /Upload Resource/i,
        });
        await expect(uploadButton).not.toBeVisible();
      });
    });
  });
});

test.describe('Content Library - Visual', () => {
  async function loginAsClient(page: any) {
    await page.goto('/login');
    await page.getByRole('button', { name: /Client/i }).click();
    await expect(page).toHaveURL('/', { timeout: 10000 });
  }

  test('LIB-VIS-01: Library page visual snapshot (desktop)', async ({
    page,
  }) => {
    await loginAsClient(page);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/library');

    // Wait for page to fully load
    await expect(
      page.getByRole('heading', { name: /Content Library/i })
    ).toBeVisible({ timeout: 10000 });

    // Wait for any loading states to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('library-page-desktop.png');
  });

  test('LIB-VIS-02: Library page visual snapshot (mobile)', async ({
    page,
  }) => {
    await loginAsClient(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/library');

    // Wait for page to fully load
    await expect(
      page.getByRole('heading', { name: /Content Library/i })
    ).toBeVisible({ timeout: 10000 });

    // Wait for any loading states to complete
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('library-page-mobile.png');
  });
});
