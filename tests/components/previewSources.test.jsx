import { act, renderHook } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import useDebouncedSources from "../../src/features/preview/useDebouncedSources.js"
import useVisualizedSources from "../../src/features/preview/useVisualizedSources.js"

afterEach(() => vi.useRealTimers())

it("debounces the newest source, flushes reload, and clears timers on unmount", () => {
    vi.useFakeTimers()
    const first = { html: "first" }
    const { result, rerender, unmount } = renderHook(value => useDebouncedSources(value), { initialProps: first })
    rerender({ html: "second" })
    act(() => vi.advanceTimersByTime(199))
    expect(result.current[0]).toBe(first)
    rerender({ html: "third" })
    act(() => vi.advanceTimersByTime(199))
    expect(result.current[0]).toBe(first)
    act(() => result.current[1]())
    expect(result.current[0]).toEqual({ html: "third" })
    unmount()
    expect(vi.getTimerCount()).toBe(0)
})

it("ignores malformed handoffs, accepts a snapshot, and closes its channel", () => {
    vi.useFakeTimers()
    const channels = []
    vi.stubGlobal("BroadcastChannel", class {
        constructor() { channels.push(this) }
        postMessage = vi.fn()
        close = vi.fn()
    })
    const id = "12345678-1234-1234-1234-123456789abc"
    const { result, unmount } = renderHook(() => useVisualizedSources(id))
    expect(result.current.status).toBe("loading")
    const channel = channels[0]
    expect(channel.postMessage).toHaveBeenCalledWith({ type: "request" })
    act(() => channel.onmessage({ data: { type: "snapshot", sources: { html: 1 } } }))
    expect(result.current.status).toBe("loading")
    const sources = { html: "hello", css: "", javascript: "" }
    act(() => channel.onmessage({ data: { type: "snapshot", sources } }))
    expect(result.current.sources).toEqual(sources)
    expect(result.current.status).toBe("ready")
    expect(channel.close).toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    unmount()
})

it("reports an unavailable snapshot rather than waiting indefinitely", () => {
    vi.useFakeTimers()
    vi.stubGlobal("BroadcastChannel", class { postMessage() {} close() {} })
    const { result, unmount } = renderHook(() => useVisualizedSources("12345678-1234-1234-1234-123456789abc"))
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.status).toBe("unavailable")
    unmount()
    expect(vi.getTimerCount()).toBe(0)
})

it.each(["constructor", "postMessage", "missing"])("handles %s messaging failure without crashing", (failure) => {
    vi.useFakeTimers()
    vi.stubGlobal("BroadcastChannel", failure === "missing" ? undefined : class {
        constructor() { if (failure === "constructor") throw new Error("blocked") }
        postMessage() { throw new Error("blocked") }
        close() {}
    })
    const { result, unmount } = renderHook(() => useVisualizedSources("12345678-1234-1234-1234-123456789abc"))
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.status).toBe("unavailable")
    unmount()
    expect(vi.getTimerCount()).toBe(0)
})
