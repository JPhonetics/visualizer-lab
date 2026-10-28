import { useCallback, useEffect, useState } from "react"

// Delay iframe rebuilds while typing. Explicit Reload flushes the latest source.
export default function useDebouncedSources(sources, delay = 200) {
    const [debouncedSources, setDebouncedSources] = useState(sources)
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSources(sources), delay)
        return () => clearTimeout(timer)
    }, [sources, delay])
    const flush = useCallback(() => setDebouncedSources(sources), [sources])
    return [debouncedSources, flush]
}
