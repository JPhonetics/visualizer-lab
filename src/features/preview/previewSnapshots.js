export const snapshotChannelName = (id) => `visualizerLab.preview.${id}`
export const isSnapshotId = (id) => typeof id === "string" && /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id)
export const isPreviewSources = (sources) => sources != null && ["html", "css", "javascript"].every(key => typeof sources[key] === "string")

// In-memory snapshot handoff preserves noopener and keeps code out of URLs/storage.
// Channels live for the workspace lifetime so standalone refresh can request the
// original snapshot again. An already loaded child remains usable independently.
export default function createPreviewSnapshots() {
    const channels = new Map()
    const release = (id) => {
        channels.get(id)?.close()
        channels.delete(id)
    }
    return {
        create(sources) {
            if (typeof BroadcastChannel !== "function" || typeof globalThis.crypto?.randomUUID !== "function") return null
            let channel
            try {
                const id = crypto.randomUUID()
                channel = new BroadcastChannel(snapshotChannelName(id))
                const snapshot = { ...sources }
                channel.onmessage = (event) => {
                    if (event.data?.type !== "request") return
                    try {
                        channel.postMessage({ type: "snapshot", sources: snapshot })
                    } catch {
                        release(id)
                    }
                }
                channels.set(id, channel)
                return id
            } catch {
                channel?.close()
                return null
            }
        },
        release,
        dispose() {
            for (const id of channels.keys()) release(id)
        },
    }
}
