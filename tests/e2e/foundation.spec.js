import { expect, test } from "@playwright/test"

test("workspace keyboard controls, drag persistence and collapse survive refresh", async ({ page }) => {
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    await page.goto("/frontend")
    await expect(page).toHaveTitle("Frontend - Visualizer Lab")
    const sidebar = page.getByRole("separator", { name: "Workspace sidebar width" })
    await sidebar.focus()
    await page.keyboard.press("Home")
    await expect(sidebar).toHaveAttribute("aria-valuenow", "180")

    // Count only width writes, excluding initial preference effects.
    await page.evaluate(() => {
        window.layoutWrites = 0
        const original = Storage.prototype.setItem
        Storage.prototype.setItem = function (key, value) {
            if (key === "visualizerLab.sidebarWidth") {
                window.layoutWrites++
            }
            return original.call(this, key, value)
        }
    })
    const bounds = await sidebar.boundingBox()
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 80)
    await page.mouse.down()
    // Cross the iframe before returning to the desired final width.
    await page.mouse.move(1100, 400, { steps: 8 })
    await page.mouse.move(300, 200, { steps: 8 })
    expect(await page.evaluate(() => window.layoutWrites)).toBe(0)
    await page.mouse.up()
    await expect(sidebar).toHaveAttribute("aria-valuenow", "300")
    await expect.poll(() => page.evaluate(() => window.layoutWrites)).toBe(1)
    await page.reload()
    await expect(sidebar).toHaveAttribute("aria-valuenow", "300")

    await page.getByRole("button", { name: "Collapse Editor" }).click()
    await expect(page.getByRole("tablist")).toHaveCount(0)
    await expect(page.getByRole("separator", { name: "Editor width" })).toHaveAttribute("tabindex", "-1")
    await page.reload()
    await expect(page.getByRole("tablist")).toHaveCount(0)
    await page.getByRole("button", { name: "Collapse Preview" }).click()
    await expect(page.getByRole("tablist")).toBeVisible()
    expect(errors).toEqual([])
})

test("Preview transfers settings to standalone and workspace controls reset", async ({ page }) => {
    await page.goto("/frontend")
    await page.getByRole("button", { name: /Desktop preview/ }).click()
    await expect(page.getByRole("status", { name: "Preview device" })).toContainText("Tablet preview selected")
    await expect(page.locator(".preview-viewport")).toHaveCSS("max-width", "768px")
    await page.getByRole("button", { name: "CSS", exact: true }).click()
    const popupPromise = page.waitForEvent("popup")
    await page.getByRole("button", { name: "Open New Tab" }).click()
    const popup = await popupPromise
    await popup.waitForLoadState()
    await expect(popup).toHaveTitle("Visualized - Visualizer Lab")
    await expect(popup.getByRole("status", { name: "Preview device" })).toContainText("Tablet preview selected")
    await expect(popup.getByRole("button", { name: "CSS", exact: true })).toHaveAttribute("aria-pressed", "false")
    await popup.reload()
    await expect(popup.getByRole("status", { name: "Preview device" })).toContainText("Tablet preview selected")
    await page.reload()
    await expect(page.getByRole("status", { name: "Preview device" })).toContainText("Desktop preview selected")
    await expect(page.getByRole("button", { name: "CSS", exact: true })).toHaveAttribute("aria-pressed", "true")
})

test("direct routes and stale saved visualizer resolve intentionally", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("visualizerLab.lastVisualizer", "python"))
    for (const route of ["/", "/unknown"]) {
        await page.goto(route)
        await expect(page).toHaveURL(/\/frontend$/)
        await expect(page.getByRole("tab", { name: "HTML" })).toBeVisible()
    }
    await page.goto("/frontend/visualized?device=phone&zoom=125")
    await expect(page).toHaveTitle("Visualized - Visualizer Lab")
    await expect(page.getByRole("status", { name: "Preview device" })).toContainText("Phone preview selected")
    await page.reload()
    await expect(page.getByRole("status", { name: "Preview device" })).toContainText("Phone preview selected")
})
