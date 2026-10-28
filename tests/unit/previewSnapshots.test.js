import { expect, it, vi } from "vitest"

import createPreviewSnapshots, { snapshotChannelName } from "../../src/features/preview/previewSnapshots.js"

it("retains an immutable snapshot for repeated handoffs and closes all workspace channels", () => {
    const channels = []
    vi.stubGlobal("BroadcastChannel", class {
        constructor(name) { this.name = name; channels.push(this) }
        postMessage = vi.fn()
        close = vi.fn()
    })
    const snapshots = createPreviewSnapshots()
    const sources = { html: "original", css: "", javascript: "" }
    const id = snapshots.create(sources)
    const channel = channels[0]
    sources.html = "later edit"
    expect(channel.name).toBe(snapshotChannelName(id))
    channel.onmessage({ data: { type: "request" } })
    channel.onmessage({ data: { type: "request" } })
    expect(channel.postMessage).toHaveBeenCalledTimes(2)
    expect(channel.postMessage).toHaveBeenLastCalledWith({ type: "snapshot", sources: { html: "original", css: "", javascript: "" } })
    snapshots.dispose()
    expect(channel.close).toHaveBeenCalledOnce()
})

it("reports unavailable messaging or UUID generation without throwing", () => {
    vi.stubGlobal("BroadcastChannel", undefined)
    expect(createPreviewSnapshots().create({ html: "", css: "", javascript: "" })).toBeNull()
    vi.stubGlobal("BroadcastChannel", class { constructor() { throw new Error("blocked") } })
    expect(createPreviewSnapshots().create({ html: "", css: "", javascript: "" })).toBeNull()
    vi.stubGlobal("crypto", {})
    expect(createPreviewSnapshots().create({ html: "", css: "", javascript: "" })).toBeNull()
})

it("closes a channel if sending its snapshot fails", () => {
    const channels = []
    vi.stubGlobal("BroadcastChannel", class {
        constructor() { channels.push(this) }
        postMessage() { throw new Error("blocked") }
        close = vi.fn()
    })
    const registry = createPreviewSnapshots()
    registry.create({ html: "", css: "", javascript: "" })
    channels[0].onmessage({ data: { type: "request" } })
    expect(channels[0].close).toHaveBeenCalledOnce()
    registry.dispose()
    expect(channels[0].close).toHaveBeenCalledOnce()
})
