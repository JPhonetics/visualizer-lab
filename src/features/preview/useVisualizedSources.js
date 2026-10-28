import { useEffect, useState } from "react"

import { isPreviewSources, isSnapshotId, snapshotChannelName } from "./previewSnapshots.js"

const initialState = (id) => ({
    id,
    sources: null,
    status: !id ? "empty" : isSnapshotId(id) && typeof BroadcastChannel === "function" ? "loading" : "unavailable",
})

export default function useVisualizedSources(id) {
    const [state, setState] = useState(() => initialState(id))
    useEffect(() => {
        if (!isSnapshotId(id) || typeof BroadcastChannel !== "function") return
        let channel
        const timer = setTimeout(() => {
            setState({ id, sources: null, status: "unavailable" })
            channel?.close()
        }, 3000)
        try {
            channel = new BroadcastChannel(snapshotChannelName(id))
            channel.onmessage = (event) => {
                if (event.data?.type !== "snapshot" || !isPreviewSources(event.data.sources)) return
                clearTimeout(timer)
                setState({ id, sources: event.data.sources, status: "ready" })
                channel.close()
            }
            channel.postMessage({ type: "request" })
        } catch {
            // Blocked browser messaging follows the same bounded unavailable path
            // as a closed workspace. No source is persisted as a fallback.
        }
        return () => {
            clearTimeout(timer)
            channel?.close()
        }
    }, [id])
    // A changed route must never display an earlier snapshot while loading.
    return state.id === id ? state : initialState(id)
}
