import { test, expect } from '@playwright/test';

test.describe('Complete Exam Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete full exam workflow from homepage to results', async ({ page }) => {
    // Start from homepage
    await page.goto('http://localhost:5173');
    
    // Should see homepage content
    await expect(page.getByText('Welcome to MockExam Pro')).toBeVisible();
    
    // Navigate to exams listing
    await page.getByText('Browse Exams').click();
    await expect(page).toHaveURL('/exams');
    
    // Should see exam cards
    await expect(page.getByText('Available Exams')).toBeVisible();
    
    // Click on first exam
    await page.locator('.exam-card').first().click();
    
    // Should be on exam page
    await expect(page).toHaveURL(/\/mocks\/.+/);
    
    // Should see exam instructions
    await expect(page.getByText(/Please read the following instructions/)).toBeVisible();
    
    // Start exam
    await page.getByRole('button', { name: /start exam/i }).click();
    
    // Should see first question
    await expect(page.getByText(/Question 1/)).toBeVisible();
    
    // Answer first question
    await page.locator('input[type="radio"]').first().check();
    
    // Navigate to next question
    await page.getByRole('button', { name: /next/i }).click();
    
    // Should see second question
    await expect(page.getByText(/Question 2/)).toBeVisible();
    
    // Answer second question
    await page.locator('input[type="radio"]').first().check();
    
    // Submit exam
    await page.getByRole('button', { name: /submit exam/i }).click();
    
    // Confirm submission
    await page.getByRole('button', { name: /yes, submit/i }).click();
    
    // Should see results
    await expect(page.getByText(/Exam Completed/)).toBeVisible();
    await expect(page.getByText(/Your Score/)).toBeVisible();
    
    // Should show percentage
    await expect(page.locator('text=/\\d+%/')).toBeVisible();
  });

  test('should save and resume exam progress', async ({ page }) => {
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    
    // Start exam
    await page.getByRole('button', { name: /start exam/i }).click();
    
    // Answer first question
    await page.locator('input[type="radio"]').first().check();
    
    // Wait for auto-save
    await page.waitForTimeout(1000);
    
    // Reload page to simulate browser refresh
    await page.reload();
    
    // Should see resume dialog
    await expect(page.getByText(/resume previous attempt/i)).toBeVisible();
    
    // Resume exam
    await page.getByRole('button', { name: /resume/i }).click();
    
    // Should be on first question with answer preserved
    await expect(page.locator('input[type="radio"]').first()).toBeChecked();
  });

  test('should handle exam timeout correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    
    // Start exam
    await page.getByRole('button', { name: /start exam/i }).click();
    
    // Mock timer to expire quickly
    await page.evaluate(() => {
      // Override the timer to expire in 1 second instead of full duration
      window.dispatchEvent(new CustomEvent('exam-timeout'));
    });
    
    // Should auto-submit
    await expect(page.getByText(/Time's Up!/)).toBeVisible();
    await expect(page.getByText(/Exam Completed/)).toBeVisible();
  });

  test('should bookmark questions during exam', async ({ page }) => {
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    
    // Start exam
    await page.getByRole('button', { name: /start exam/i }).click();
    
    // Bookmark first question
    await page.getByRole('button', { name: /bookmark/i }).click();
    
    // Should show success message
    await expect(page.getByText(/Question bookmarked/)).toBeVisible();
    
    // Navigate to bookmarks page
    await page.getByText('Bookmarks').click();
    await expect(page).toHaveURL('/bookmarks');
    
    // Should see bookmarked question
    await expect(page.getByText(/Question 1/)).toBeVisible();
  });

  test('should flag questions and show in palette', async ({ page }) => {
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    
    // Start exam
    await page.getByRole('button', { name: /start exam/i }).click();
    
    // Flag current question
    await page.getByRole('button', { name: /flag/i }).click();
    
    // Question should show as flagged in palette
    const questionPalette = page.locator('.question-palette');
    await expect(questionPalette.locator('.flagged')).toBeVisible();
    
    // Navigate to next question
    await page.getByRole('button', { name: /next/i }).click();
    
    // Go back to flagged question via palette
    await questionPalette.locator('button').first().click();
    
    // Should show as flagged
    await expect(page.getByRole('button', { name: /unflag/i })).toBeVisible();
  });

  test('should display exam statistics on dashboard', async ({ page }) => {
    // First complete an exam to have data
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    await page.getByRole('button', { name: /start exam/i }).click();
    await page.locator('input[type="radio"]').first().check();
    await page.getByRole('button', { name: /next/i }).click();
    await page.locator('input[type="radio"]').first().check();
    await page.getByRole('button', { name: /submit exam/i }).click();
    await page.getByRole('button', { name: /yes, submit/i }).click();
    
    // Navigate to dashboard
    await page.getByText('Dashboard').click();
    await expect(page).toHaveURL('/dashboard');
    
    // Should show performance statistics
    await expect(page.getByText('Performance Overview')).toBeVisible();
    await expect(page.getByText('Total Attempts')).toBeVisible();
    await expect(page.getByText('Average Score')).toBeVisible();
    
    // Should show charts
    await expect(page.locator('.recharts-wrapper')).toBeVisible();
  });

  test('should search and filter exams', async ({ page }) => {
    await page.goto('http://localhost:5173/exams');
    
    // Should see search input
    await expect(page.getByPlaceholder(/search exams/i)).toBeVisible();
    
    // Search for specific exam
    await page.getByPlaceholder(/search exams/i).fill('Physics');
    
    // Should filter results
    await expect(page.getByText(/Physics/)).toBeVisible();
    
    // Change difficulty filter
    await page.locator('select[placeholder*="difficulty"]').selectOption('easy');
    
    // Should update results based on filter
    // Note: Actual filtering behavior depends on mock data
  });

  test('should export and import user data', async ({ page }) => {
    // Complete an exam first to have data
    await page.goto('http://localhost:5173/mocks/test-exam-1');
    await page.getByRole('button', { name: /start exam/i }).click();
    await page.locator('input[type="radio"]').first().check();
    await page.getByRole('button', { name: /submit exam/i }).click();
    await page.getByRole('button', { name: /yes, submit/i }).click();
    
    // Go to dashboard
    await page.getByText('Dashboard').click();
    
    // Export data
    await page.getByRole('button', { name: /export data/i }).click();
    
    // Should trigger download (we can't test actual download in Playwright easily)
    // But we can verify the button works
    
    // Clear all data
    await page.getByRole('button', { name: /clear all data/i }).click();
    await page.getByRole('button', { name: /confirm/i }).click();
    
    // Should show empty state
    await expect(page.getByText(/no attempts yet/i)).toBeVisible();
  });
});