// tunerComponent.spec.js
import { test, expect } from '@playwright/test';

test.describe('TunerComponent', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/tuner'); // Adjust to the actual URL where your component is hosted
    });

    test('should switch instruments', async ({ page }) => {
        await page.click('text=Ukulele');
        const selectedInstrument = await page.locator('.bg-blue-200').innerText();
        expect(selectedInstrument).toBe('Ukulele');
    });





    test('should fetch user profile and display profile picture', async ({ page }) => {
        // Mocking the fetch request to simulate user profile retrieval
        await page.route('http://localhost:3000/api/auth/profile', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    profilePicture: 'uploads/profile-picture.jpg', // Mock profile picture
                }),
            });
        });

        await page.reload(); // Reload to trigger profile fetching
        const profilePicture = await page.locator('img[alt="Profile"]').getAttribute('src');
        expect(profilePicture).toContain('http://localhost:3000/uploads/profile-picture.jpg');
    });


});
