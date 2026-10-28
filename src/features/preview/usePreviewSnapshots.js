import { useEffect, useState } from "react"

import createPreviewSnapshots from "./previewSnapshots.js"

export default function usePreviewSnapshots() {
    const [snapshots] = useState(createPreviewSnapshots)
    useEffect(() => () => snapshots.dispose(), [snapshots])
    return snapshots
}
