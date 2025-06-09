import { test, expect } from "@playwright/test";

test.describe("MusicSelection Component", () => {
    test.beforeEach(async ({page}) => {
        await page.goto("http://localhost:5173/"); // Adjust if necessary
    });

    test("renders genre selection page", async ({page}) => {
        await expect(page.getByText("Choose your interest")).toBeVisible();
        await expect(page.getByText("Please choose 3 genres")).toBeVisible();
    });

    test("allows selecting up to 3 genres", async ({page}) => {
        const genreButtons = await page.locator("button").all();

        await genreButtons[0].click();
        await genreButtons[1].click();
        await genreButtons[2].click();

        await expect(genreButtons[0]).toHaveClass(/bg-blue-200 text-blue-700/);
        await expect(genreButtons[1]).toHaveClass(/bg-blue-200 text-blue-700/);
        await expect(genreButtons[2]).toHaveClass(/bg-blue-200 text-blue-700/);
    });

    test("disables additional selections after 3 genres", async ({page}) => {
        const genreButtons = await page.locator("button").all();

        await genreButtons[0].click();
        await genreButtons[1].click();
        await genreButtons[2].click();

        await expect(genreButtons[3]).toBeDisabled(); // 4th button should be disabled
    });

    test("navigates to instrument selection after clicking Next with 3 genres selected", async ({page}) => {
        const genreButtons = await page.locator("button").all();
        const nextButton = page.getByRole("button", {name: "Next"});

        await genreButtons[0].click();
        await genreButtons[1].click();
        await genreButtons[2].click();
        await expect(nextButton).toBeEnabled(); // Ensure Next is enabled before clicking

        await nextButton.click(); // Click Next after selecting 3 genres

        await expect(page.getByText("Choose an instrument")).toBeVisible();
    });


});