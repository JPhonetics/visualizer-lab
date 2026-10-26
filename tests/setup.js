import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import { afterEach, beforeEach, vi } from "vitest"

// jsdom has no layout engine. Real geometry and pointer capture belong in E2E.
beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, "", "/frontend")
    vi.stubGlobal("matchMedia", vi.fn(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })))
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        disconnect() {}
    })
})

afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete document.documentElement.dataset.theme
    delete document.documentElement.dataset.themePreference
})
