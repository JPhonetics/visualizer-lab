import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import EditorPanel from "../../src/components/layout/EditorPanel.jsx"
import TopBar from "../../src/components/layout/TopBar.jsx"
import ZoomControl from "../../src/features/preview/ZoomControl.jsx"
import createEditorSession from "../../src/features/editor/editorSession.js"
import ThemeControl from "../../src/features/theme/ThemeControl.jsx"

describe("foundation controls", () => {
    it("moves selection/focus through linked editor tabs and wraps", async () => {
        const user = userEvent.setup()
        render(<EditorPanel onCollapse={() => {}} session={createEditorSession()} />)
        await user.tab()
        expect(screen.getByRole("tab", { name: "HTML" })).toHaveFocus()
        await user.keyboard("{ArrowLeft}")
        expect(screen.getByRole("tab", { name: "JavaScript" })).toHaveFocus()
        expect(screen.getByRole("tabpanel", { name: "JavaScript" })).toBeVisible()
        expect(screen.getAllByRole("tabpanel")).toHaveLength(1)
        await user.keyboard("{Home}{ArrowRight}")
        expect(screen.getByRole("tab", { name: "CSS" })).toHaveAttribute("aria-selected", "true")
        await user.keyboard("{End}")
        expect(screen.getByRole("tab", { name: "JavaScript" })).toHaveFocus()
    })

    it("dismisses the selector with Escape, selection, outside click and focus exit", async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><TopBar /></MemoryRouter>)
        const trigger = screen.getByRole("button", { name: "Frontend", expanded: false })
        await user.click(trigger)
        await user.tab()
        await user.keyboard("{Escape}")
        expect(trigger).toHaveFocus()
        expect(trigger).toHaveAttribute("aria-expanded", "false")
        await user.click(trigger)
        await user.click(screen.getAllByRole("button", { name: "Frontend" })[1])
        expect(trigger).toHaveFocus()
        expect(trigger).toHaveAttribute("aria-expanded", "false")
        await user.click(trigger)
        await user.click(document.body)
        expect(trigger).toHaveAttribute("aria-expanded", "false")
        await user.click(trigger)
        await user.tab()
        await user.tab()
        expect(trigger).toHaveAttribute("aria-expanded", "false")
    })

    it("preserves partial zoom input, clamps on blur and displays changed props", async () => {
        const user = userEvent.setup()
        const onZoomChange = vi.fn()
        const { rerender } = render(<ZoomControl zoom={100} onZoomChange={onZoomChange} />)
        await user.click(screen.getByRole("button", { name: "Preview zoom" }))
        const input = screen.getByRole("textbox", { name: "Preview zoom percentage" })
        await user.click(input)
        await user.clear(input)
        await user.type(input, "1")
        expect(onZoomChange).not.toHaveBeenCalled()
        await user.keyboard("{Enter}")
        expect(onZoomChange).toHaveBeenLastCalledWith(50)
        rerender(<ZoomControl zoom={125} onZoomChange={onZoomChange} />)
        expect(input).toHaveValue("125%")
        await user.click(input)
        await user.clear(input)
        await user.tab()
        expect(onZoomChange).toHaveBeenCalledTimes(1)
    })

    it("uses the current theme even when storage reads and writes fail", async () => {
        vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked") })
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked") })
        const user = userEvent.setup()
        render(<ThemeControl />)
        expect(document.documentElement).toHaveAttribute("data-theme-preference", "system")
        await user.click(screen.getByRole("button", { name: /Theme: System/ }))
        expect(document.documentElement).toHaveAttribute("data-theme", "light")
        await user.click(screen.getByRole("button", { name: /Theme: Light/ }))
        expect(document.documentElement).toHaveAttribute("data-theme", "dark")
    })
})
