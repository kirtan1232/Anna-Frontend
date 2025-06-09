import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173/dashboard"); // Adjust if necessary
    });

    test("renders the dashboard correctly", async ({ page }) => {
        await expect(page.getByText("Hello, User")).toBeVisible(); // Default user greeting
        await expect(page.getByPlaceholder("Search")).toBeVisible(); // Search input
        await expect(page.getByText("Have not tried the lessons yet?")).toBeVisible(); // Promo section
    });
    

    test("navigates to lessons page when clicking 'Get Started'", async ({ page }) => {
        const getStartedButton = page.getByRole("button", { name: "Get Started" });
        await getStartedButton.click();

        await expect(page).toHaveURL(/\/lesson/); // Verify navigation
    });



    test("navigates to tuner page when clicking on the 'Tune your instruments easily' box", async ({ page }) => {
        const tunerBox = page.locator("div.cursor-pointer", { hasText: "Tune your instruments easily" });

        await expect(tunerBox).toBeVisible();
        await tunerBox.click();

        await page.waitForTimeout(500);
        await expect(page).toHaveURL(/\/tuner/);
    });




});
