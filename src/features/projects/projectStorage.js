// One bounded, versioned record keeps draft and named snapshots atomic. Layout
// preferences remain in their existing keys. Future schemas must migrate explicitly.
export const PROJECTS_KEY = "visualizerLab.projects.v1"
export const MAX_RECORD_LENGTH = 1_000_000
export const emptySources = () => ({ html: "", css: "", javascript: "" })
export const emptyProjectRecord = () => ({ version: 1, draft: { name: "Untitled", savedId: null, updatedAt: null, sources: emptySources() }, saved: [] })
export const validName = (name) => typeof name === "string" && name.trim().length > 0 && name.length <= 100
const validSources = (sources) => sources && ["html", "css", "javascript"].every(key => typeof sources[key] === "string")

export function parseProjectRecord(raw) {
    if (raw === null) return emptyProjectRecord()
    if (raw.length > MAX_RECORD_LENGTH) throw new Error("Project data exceeds the supported size. Stored data was preserved.")
    let value
    try { value = JSON.parse(raw) } catch { throw new Error("Project data could not be read. Stored data was preserved.") }
    if (value?.version !== 1) throw new Error("This project storage version is unsupported. Stored data was preserved.")
    if (!validName(value.draft?.name) || !validSources(value.draft?.sources) || !Array.isArray(value.saved) || value.saved.some(project =>
        !project || typeof project.id !== "string" || !project.id || !validName(project.name) || !validSources(project.sources)
        || typeof project.updatedAt !== "string" || !Number.isFinite(Date.parse(project.updatedAt)),
    ) || new Set(value.saved.map(project => project.id)).size !== value.saved.length) {
        throw new Error("Project data is invalid. Stored data was preserved.")
    }
    // Earlier local Phase 5 drafts had no saved-copy link; preserve their data.
    const savedId = value.draft.savedId ?? null
    if (savedId !== null && (typeof savedId !== "string" || !value.saved.some(project => project.id === savedId))) {
        throw new Error("Project link is invalid. Stored data was preserved.")
    }
    const updatedAt = value.draft.updatedAt ?? null
    if (updatedAt !== null && (typeof updatedAt !== "string" || !Number.isFinite(Date.parse(updatedAt)))) {
        throw new Error("Project edit time is invalid. Stored data was preserved.")
    }
    return { ...value, draft: { ...value.draft, savedId, updatedAt } }
}

export function writeProjectRecord(storage, expectedRaw, record) {
    const raw = JSON.stringify(record)
    if (raw.length > MAX_RECORD_LENGTH) throw new Error("Work is too large to save locally. Reduce its size and retry.")
    if (storage.getItem(PROJECTS_KEY) !== expectedRaw) throw new Error("Work changed in another tab. Copy your current code before refreshing to load that version.")
    storage.setItem(PROJECTS_KEY, raw)
    return raw
}
