import { act, render, renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import App from "../../src/app/App.jsx"
import useLocalStorageState from "../../src/hooks/useLocalStorageState.js"

describe("workspace integration", () => {
    it.each(["/", "/missing"])("routes %s to Frontend despite a legacy selection", async (path) => {
        localStorage.setItem("visualizerLab.lastVisualizer", "python")
        window.history.replaceState(null, "", path)
        render(<App />)
        await screen.findByRole("tab", { name: "HTML" })
        expect(window.location.pathname).toBe("/frontend")
        expect(document.title).toBe("Frontend - Visualizer Lab")
    })

    it("persists layout but resets language and Preview controls across mounts", async () => {
        const user = userEvent.setup()
        const first = render(<App />)
        const width = screen.getByRole("separator", { name: "Workspace sidebar width" })
        width.focus()
        await user.keyboard("{End}")
        expect(width).toHaveAttribute("aria-valuenow", "360")
        await user.click(screen.getByRole("tab", { name: "CSS" }))
        await user.click(screen.getByRole("button", { name: /Desktop preview/ }))
        expect(screen.getByRole("status")).toHaveTextContent("Tablet preview selected")
        first.unmount()
        render(<App />)
        expect(screen.getByRole("separator", { name: "Workspace sidebar width" })).toHaveAttribute("aria-valuenow", "360")
        expect(screen.getByRole("tab", { name: "HTML" })).toHaveAttribute("aria-selected", "true")
        expect(screen.getByRole("status")).toHaveTextContent("Desktop preview selected")
    })

    it("keeps at least one panel open and disables the divider when collapsed", async () => {
        const user = userEvent.setup()
        render(<App />)
        await user.click(screen.getByRole("button", { name: "Collapse Editor" }))
        expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
        expect(screen.getByRole("separator", { name: "Editor width" })).toHaveAttribute("tabindex", "-1")
        await user.click(screen.getByRole("button", { name: "Collapse Preview" }))
        expect(screen.getByRole("tablist")).toBeVisible()
        expect(screen.queryByRole("button", { name: /Desktop preview/ })).not.toBeInTheDocument()
    })

    it("recovers malformed preferences and stays usable when persistence fails", () => {
        localStorage.setItem("test.preference", "{invalid")
        const { result } = renderHook(() => useLocalStorageState("test.preference", 220))
        expect(result.current[0]).toBe(220)
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("full") })
        act(() => result.current[1](260))
        expect(result.current[0]).toBe(260)
    })
})
