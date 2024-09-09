import { test, expect } from '@playwright/test';

test('Register New User', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await expect(page).toHaveTitle('Todo App');

    await page.click('text=Register');

    await expect(page).toHaveURL(/authentication\/register/);

    // Fill the form
    await page.fill('input[name="email"]', `tester@test.tld` );
    await page.fill('input[name="password"]', 'password123');

    // Submit the form
    await page.click('button[type="submit"]');

    const rootLocator = page.locator('#root');
    
    // Expect the page to have a text "Welcome back" or "tester@test.tld' is already taken." DuplicateUserName
    await expect(rootLocator).toHaveText(/Welcome back|DuplicateUserName/);
});

test('Register a second known user', async ({ page }) => {  
    await page.goto('http://localhost:5173');

    await expect(page).toHaveTitle('Todo App');

    await page.click('text=Register');

    // Expect the URL to contain /authentication/register
    await expect(page).toHaveURL(/authentication\/register/);

    // Fill the form
    await page.fill('input[name="email"]', `admin@admin.tld` );
    await page.fill('input[name="password"]', 'password123');

    // wait 0.5 seconds
    await page.waitForTimeout(500);

    // Submit the form
    await page.click('button[type="submit"]');

    const rootLocator = page.locator('#root');
    
    // Expect the page to have a text "Welcome back" or "admin@test.tld' is already taken." DuplicateUserName
    await expect(rootLocator).toHaveText(/Welcome back|DuplicateUserName/);
});
