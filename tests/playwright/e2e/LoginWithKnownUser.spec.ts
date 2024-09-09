import { test, expect } from '@playwright/test';

test('Login with known user', async ({ page }) => {
    await page.goto('http://localhost:5173/authentication/login');

    // Fill the for
    await page.fill('input[name="email"]', `tester@test.tld` );
    await page.fill('input[name="password"]', 'password123');

    // Submit the form
    await page.click('button[type="submit"]');

    const rootLocator = page.locator('#root');
    await expect(rootLocator).toHaveText(/Welcome back|tester@test\.tld is already taken/);
});
