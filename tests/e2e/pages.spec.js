import { expect, test } from "@playwright/test"

import { pagesBasePath } from "../../pages.config.js"

test("domain root and direct workspace URLs load assets and refresh without hash routing", async ({ page }) => {
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    for (const route of ["", "frontend", "frontend/"]) {
        const response = await page.goto(route || "./")
        expect(response.status()).toBe(200)
        await expect(page.getByRole("tab", { name: "HTML" })).toBeVisible()
        expect(new URL(page.url()).pathname).toMatch(new RegExp(`^${pagesBasePath}frontend/?$`))
        expect(new URL(page.url()).hash).toBe("")
        await page.reload()
        await expect(page.getByRole("tab", { name: "HTML" })).toBeVisible()
        // A loaded stylesheet proves base-prefixed CSS requests succeeded.
        await expect(page.locator(".workspace")).toHaveCSS("display", "grid")
    }
    expect(errors).toEqual([])
})

test("standalone links preserve domain-root paths, settings and query/hash on direct refresh", async ({ page }) => {
    await page.goto("frontend/")
    await page.getByRole("button", { name: /Desktop preview/ }).click()
    const popupPromise = page.waitForEvent("popup")
    await page.getByRole("button", { name: "Open New Tab" }).click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    expect(new URL(popup.url()).pathname).toMatch(new RegExp(`^${pagesBasePath}frontend/visualized/?$`))
    await expect(popup.getByRole("status")).toContainText("Tablet preview selected")
    const response = await page.goto("frontend/visualized?device=phone&zoom=125&css=false&note=a%26b%3Fc%20d#sample")
    expect(response.status()).toBe(200)
    await expect(page).toHaveTitle("Visualized - Visualizer Lab")
    await expect(page.getByRole("status")).toContainText("Phone preview selected")
    await expect(page.getByRole("button", { name: "CSS", exact: true })).toHaveAttribute("aria-pressed", "false")
    const before = page.url()
    await page.reload()
    expect(page.url()).toBe(before)
    expect(new URL(page.url()).searchParams.get("note")).toBe("a&b?c d")
    expect(new URL(page.url()).hash).toBe("#sample")
})

test("real static 404 boots the app at the original URL and returns to the domain-root workspace", async ({ page }) => {
    const response = await page.goto("missing/nested?note=%26%3F")
    expect(response.status()).toBe(404)
    await expect(page).toHaveURL(new RegExp(`${pagesBasePath}frontend$`))
    await expect(page.getByRole("tab", { name: "HTML" })).toBeVisible()
})
