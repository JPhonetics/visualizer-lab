import { expect, test } from "@playwright/test"

test("mouse selection is visible on the first line of all languages in Light and Dark", async ({ page }) => {
    await page.goto("/frontend")
    for (const theme of ["Light", "Dark"]) {
        for (let index = 0; index < 3; index++) {
            if ((await page.getByRole("button", { name: /^Theme:/ }).getAttribute("aria-label")).includes(`Theme: ${theme}.`)) break
            await page.getByRole("button", { name: /^Theme:/ }).click()
        }
        for (const language of ["HTML", "CSS", "JavaScript"]) {
            await page.getByRole("tab", { name: language, exact: true }).click()
            const editor = page.getByRole("textbox", { name: `${language} code editor` })
            await editor.fill("first line selection\nsecond line selection\nthird line")
            const firstLine = editor.locator(".cm-line").first()
            const box = await firstLine.boundingBox()
            await page.mouse.move(box.x + 5, box.y + box.height / 2)
            await page.mouse.down()
            await page.mouse.move(box.x + 130, box.y + box.height / 2, { steps: 12 })
            await page.mouse.up()
            await expect.poll(() => editor.evaluate(element => element.ownerDocument.getSelection().toString())).toContain("line")
            const selection = page.locator(".cm-selectionBackground").first()
            await expect(selection).toBeVisible()
            const styles = await firstLine.evaluate(element => {
                const view = element.closest(".cm-editor")
                return {
                    line: getComputedStyle(element).backgroundColor,
                    selection: getComputedStyle(view.querySelector(".cm-selectionBackground")).backgroundColor,
                    expected: getComputedStyle(view).getPropertyValue("--editor-selection").trim(),
                }
            })
            expect(styles.line).toMatch(/rgba\(.+, 0\.08\)/)
            expect(styles.selection).toBe(theme === "Light" ? "rgb(180, 213, 255)" : "rgb(54, 92, 133)")
            await page.screenshot({ path: test.info().outputPath(`${theme}-${language}-selection.png`) })
        }
    }
})
