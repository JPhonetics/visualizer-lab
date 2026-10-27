import { expect, test } from "@playwright/test"

test("editing retains language buffers, history and collapse state without executing Preview", async ({ page }) => {
    const errors = []
    const dialogs = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("dialog", async (dialog) => { dialogs.push(dialog.message()); await dialog.dismiss() })
    await page.goto("/frontend")
    const redoShortcut = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta+Shift+z" : "Control+y")
    const previewBefore = await page.locator(".preview-frame").getAttribute("srcdoc")
    const html = page.getByRole("textbox", { name: "HTML code editor" })
    await html.pressSequentially("<h1>My editable page")
    await page.getByRole("tab", { name: "CSS", exact: true }).click()
    await page.getByRole("textbox", { name: "CSS code editor" }).fill("h1 { color: green; }")
    await page.getByRole("tab", { name: "JavaScript", exact: true }).click()
    await page.getByRole("textbox", { name: "JavaScript code editor" }).fill("alert('must not execute')")
    await page.getByRole("tab", { name: "HTML", exact: true }).click()
    await expect(html).toHaveText("<h1>My editable page</h1>")
    await html.focus()
    await page.keyboard.press("ControlOrMeta+End")
    await html.pressSequentially("!")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(html).toHaveText("<h1>My editable page</h1>")
    await page.keyboard.press(redoShortcut)
    await expect(html).toHaveText("<h1>My editable page</h1>!")
    await page.keyboard.press("ControlOrMeta+Home")
    for (let index = 0; index < 4; index++) await page.keyboard.press("Shift+ArrowRight")
    await page.getByRole("button", { name: "Collapse Editor" }).click()
    await page.getByRole("button", { name: "Expand Editor" }).click()
    await expect(html).toHaveText("<h1>My editable page</h1>!")
    await html.focus()
    await expect.poll(() => html.evaluate(el => el.ownerDocument.getSelection().toString())).toBe("<h1>")
    await page.keyboard.press("ControlOrMeta+z")
    await expect(html).toHaveText("<h1>My editable page</h1>")
    await page.keyboard.press(redoShortcut)
    await expect(html).toHaveText("<h1>My editable page</h1>!")
    await page.getByRole("tab", { name: "CSS", exact: true }).click()
    await page.getByRole("tab", { name: "HTML", exact: true }).click()
    await html.focus()
    await page.keyboard.press("ControlOrMeta+Home")
    for (let index = 0; index < 4; index++) await page.keyboard.press("Shift+ArrowRight")
    await page.getByRole("tab", { name: "CSS", exact: true }).click()
    await page.getByRole("tab", { name: "HTML", exact: true }).click()
    await html.focus()
    await expect.poll(() => html.evaluate(el => el.ownerDocument.getSelection().toString())).toBe("<h1>")
    await page.getByRole("tab", { name: "CSS", exact: true }).click()
    const css = page.getByRole("textbox", { name: "CSS code editor" })
    await expect(css).toHaveText("h1 { color: green; }")
    await css.focus()
    await page.keyboard.press("Tab")
    await expect(css).not.toBeFocused()
    await page.keyboard.press("Shift+Tab")
    await expect(css).toBeFocused()
    expect(await page.locator(".preview-frame").getAttribute("srcdoc")).toBe(previewBefore)
    const stored = await page.evaluate(() => Object.values(localStorage).join(" "))
    expect(stored).not.toContain("editable page")
    expect(stored).not.toContain("must not execute")
    expect(dialogs).toEqual([])
    await page.reload()
    await expect(page.getByRole("textbox", { name: "HTML code editor" })).toHaveText("")
    expect(errors).toEqual([])
})

test("long documents scroll within the editor in both themes and narrow windows", async ({ page }) => {
    await page.goto("/frontend")
    const editor = page.getByRole("textbox", { name: "HTML code editor" })
    await expect(editor).toBeVisible()
    const workspace = page.locator(".workspace")
    const heightBefore = (await workspace.boundingBox()).height
    await editor.fill(Array.from({ length: 80 }, (_, index) => `<p>Line ${index} of the scrolling document</p>`).join("\n"))
    await expect.poll(async () => (await workspace.boundingBox()).height).toBeLessThanOrEqual(heightBefore + 1)
    const scroller = page.locator(".cm-scroller")
    expect(await scroller.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true)
    await editor.focus()
    await page.keyboard.press("ControlOrMeta+End")
    await expect.poll(() => scroller.evaluate(el => el.scrollTop)).toBeGreaterThan(0)
    await page.getByRole("button", { name: /Theme: System/ }).click()
    await page.getByRole("button", { name: /Theme: Light/ }).click()
    const background = await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor)
    await expect(page.locator(".cm-editor")).toHaveCSS("background-color", background)
    await page.setViewportSize({ width: 390, height: 844 })
    await expect(editor).toBeVisible()
    expect((await workspace.boundingBox()).height).toBeLessThanOrEqual(844)
    expect(await scroller.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true)
})

// Measure actual painted token/background colors, not just the shared theme flag.
function contrastRatio(foreground, background) {
    const luminance = (color) => {
        const channels = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(channel => {
            const value = channel / 255
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        })
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
    }
    const a = luminance(foreground)
    const b = luminance(background)
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

test("keywords and strings change palette with readable contrast in both themes", async ({ page }) => {
    await page.goto("/frontend")
    await page.getByRole("tab", { name: "JavaScript", exact: true }).click()
    const editor = page.getByRole("textbox", { name: "JavaScript code editor" })
    const source = 'const greeting = "text";'
    await editor.fill(source)
    const keyword = editor.locator("span").filter({ hasText: /^const$/ })
    const string = editor.locator("span").filter({ hasText: /^"text"$/ })
    await page.getByRole("button", { name: /Theme: System/ }).click()
    for (const [theme, keywordColor, stringColor] of [
        ["Light", "rgb(0, 92, 197)", "rgb(163, 21, 21)"],
        ["Dark", "rgb(211, 167, 232)", "rgb(155, 221, 179)"],
    ]) {
        await expect(page.getByRole("button", { name: new RegExp(`Theme: ${theme}`) })).toBeVisible()
        await expect(keyword).toHaveCSS("color", keywordColor)
        await expect(string).toHaveCSS("color", stringColor)
        const backgrounds = await page.locator(".cm-editor").evaluate(el => [
            getComputedStyle(el).backgroundColor,
            getComputedStyle(el.querySelector(".cm-activeLine")).backgroundColor,
        ])
        for (const background of backgrounds) {
            expect(contrastRatio(keywordColor, background)).toBeGreaterThanOrEqual(4.5)
            expect(contrastRatio(stringColor, background)).toBeGreaterThanOrEqual(4.5)
        }
        await expect(editor).toHaveText(source)
        await page.getByRole("button", { name: new RegExp(`Theme: ${theme}`) }).click()
    }
    await expect(keyword).toHaveCSS("color", "rgb(0, 92, 197)")
    await expect(string).toHaveCSS("color", "rgb(163, 21, 21)")
})
