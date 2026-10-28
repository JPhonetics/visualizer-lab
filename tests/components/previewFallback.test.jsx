import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, it, vi } from "vitest"

import PreviewPanel from "../../src/components/layout/PreviewPanel.jsx"
import createEditorSession from "../../src/features/editor/editorSession.js"

it("keeps workspace Preview usable and announces unavailable standalone support", () => {
    const open = vi.spyOn(window, "open")
    render(
        <MemoryRouter>
            <PreviewPanel editorSession={createEditorSession()} snapshots={{ create: () => null }} />
        </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole("button", { name: "Open New Tab" }))
    expect(screen.getByRole("alert")).toHaveTextContent("Standalone Preview is unavailable in this browser")
    expect(screen.getByTitle("Visualizer Lab Preview")).toBeInTheDocument()
    expect(open).not.toHaveBeenCalled()
})
