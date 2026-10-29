import { fireEvent, render, screen, within } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import ProjectControls from "../../src/features/projects/ProjectControls.jsx"
import createProjectWorkspace from "../../src/features/projects/projectWorkspace.js"
import { PROJECTS_KEY } from "../../src/features/projects/projectStorage.js"

it("supports rename validation and canceling destructive actions", () => {
    const workspace = createProjectWorkspace()
    render(<ProjectControls projects={workspace} />)
    fireEvent.click(screen.getByRole("button", { name: "Rename current work" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Rename current work" }), { target: { value: " " } })
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(screen.getByRole("alert")).toHaveTextContent("1–100")
    fireEvent.change(screen.getByRole("textbox", { name: "Rename current work" }), { target: { value: "Named" } })
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
    expect(within(screen.getByRole("region", { name: "Current Work" })).getByRole("button", { name: "Rename current work" })).toHaveTextContent("Named")
    fireEvent.click(screen.getByRole("button", { name: "Save" , exact: true }))
    expect(screen.getByRole("button", { name: "Open Named" })).toBeInTheDocument()
    vi.spyOn(window, "confirm").mockReturnValue(false)
    fireEvent.click(screen.getByRole("button", { name: "New work" }))
    expect(within(screen.getByRole("region", { name: "Current Work" })).getByRole("button", { name: "Rename current work" })).toHaveTextContent("Named")
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "absent" } })
    expect(screen.getByText("No matching saved work.")).toBeInTheDocument()
})

it("announces blocked data without offering an ineffective retry", () => {
    localStorage.setItem(PROJECTS_KEY, "{broken")
    render(<ProjectControls projects={createProjectWorkspace()} />)
    expect(screen.getByRole("alert")).toHaveTextContent("Stored data was preserved")
    expect(screen.queryByRole("button", { name: "Retry saving" })).not.toBeInTheDocument()
})
