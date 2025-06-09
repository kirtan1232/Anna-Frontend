import { test, expect } from "@playwright/test";

test.describe("Song Details Page", () => {
    const songId = "67b4c10cd18e7f9e1a4ee10e"; // Use an existing song ID for testing

    test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:5173/song/${songId}`);
    });

    test("renders loading state initially", async ({ page }) => {
        await expect(page.locator("text=Loading...")).toBeVisible();
    });

    test("renders song details after loading", async ({ page }) => {
        await page.waitForResponse(response =>
            response.url().includes(`/api/songs/${songId}`) && response.status() === 200
        );

        await expect(page.locator("text=Song - Bladex")).toBeVisible();
        await expect(page.locator("text=Instrument: guitar")).toBeVisible();
    });

    test("auto-scroll functionality works", async ({ page }) => {
        // Enable auto-scroll
        await page.locator("button:has-text('Auto Scroll')").click();

        // Get the initial scroll position
        const initialScrollTop = await page.evaluate(() => {
            const lyricsContainer = document.querySelector('.flex-1.overflow-y-auto.p-2.bg-gray-100.rounded-lg'); // Adjusted selector
            return lyricsContainer ? lyricsContainer.scrollTop : 0; // Ensure the container is found
        });

        // Wait for a moment to allow scrolling to occur
        await page.waitForTimeout(3000); // Adjust time as necessary for your auto-scroll speed

        // Get the new scroll position
        const newScrollTop = await page.evaluate(() => {
            const lyricsContainer = document.querySelector('.flex-1.overflow-y-auto.p-2.bg-gray-100.rounded-lg'); // Adjusted selector
            return lyricsContainer ? lyricsContainer.scrollTop : 0; // Ensure the container is found
        });

        // Expect the new scroll position to be greater than the initial position
        expect(newScrollTop).toBeGreaterThan(initialScrollTop);
    });
});
