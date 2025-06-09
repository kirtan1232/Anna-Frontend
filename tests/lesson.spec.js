import { test, expect } from '@playwright/test';

test.describe('Lesson Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/lesson'); // Adjust the URL as necessary
    });

    test('should render the lesson component without crashing', async ({ page }) => {
        await expect(page.locator('h2:has-text("Available")')).toBeVisible();
    });

    test('should fetch and display quizzes', async ({ page }) => {
        // Mock the fetch API to return dummy quizzes
        await page.addInitScript(() => {
            window.fetch = async (url) => {
                if (url === 'http://localhost:3000/api/quiz/getquiz') {
                    return {
                        ok: true,
                        json: async () => [
                            { instrument: 'Ukulele', day: 'Monday' },
                            { instrument: 'Ukulele', day: 'Tuesday' },
                        ],
                    };
                }
                if (url === 'http://localhost:3000/api/auth/profile') {
                    return {
                        ok: true,
                        json: async () => ({ profilePicture: 'uploads/profile.jpg' }),
                    };
                }
                return { ok: false };
            };
        });

        // Reload the page to trigger useEffect
        await page.reload();

        await expect(page.locator('p:has-text("Monday")')).toBeVisible();
        await expect(page.locator('p:has-text("Tuesday")')).toBeVisible();
    });


    test('should display unique days for the selected category', async ({ page }) => {
        // Mock the fetch API to return dummy quizzes
        await page.addInitScript(() => {
            window.fetch = async (url) => {
                if (url === 'http://localhost:3000/api/quiz/getquiz') {
                    return {
                        ok: true,
                        json: async () => [
                            { instrument: 'Ukulele', day: 'Monday' },
                            { instrument: 'Ukulele', day: 'Tuesday' },
                            { instrument: 'Guitar', day: 'Wednesday' },
                        ],
                    };
                }
                return { ok: false };
            };
        });

        // Reload the page to trigger useEffect
        await page.reload();

        await expect(page.locator('p:has-text("Monday")')).toBeVisible();
        await expect(page.locator('p:has-text("Tuesday")')).toBeVisible();
        await expect(page.locator('p:has-text("Wednesday")')).not.toBeVisible(); // Guitar should not be displayed
    });


});
