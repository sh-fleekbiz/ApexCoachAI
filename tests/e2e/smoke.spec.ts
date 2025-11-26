import { test, expect } from '@playwright/test';

// Minimal, stable smoke test for the main landing page
// Verifies default questions render and populate the input when clicked.

test.describe('Smoke - Home page', () => {
  test('default questions populate the chat input', async ({ page }) => {
    await page.goto('/');

    const defaultQuestions = page.getByTestId('default-question');
    const chatInput = page.getByTestId('question-input');

    // Expect at least one default question; existing tests expect 3
    await expect(defaultQuestions).toHaveCount(3);

    const firstQuestionButton = defaultQuestions.nth(0);
    const firstQuestionText = ((await firstQuestionButton.textContent()) ?? '')
      .replace('Ask now', '')
      .trim();

    await expect(chatInput).toHaveValue('');

    await firstQuestionButton.click();

    await expect(chatInput).toHaveValue(firstQuestionText);
  });
});
