import createEditorSession from "../editor/editorSession.js"
import { emptyProjectRecord, parseProjectRecord, PROJECTS_KEY, validName, writeProjectRecord } from "./projectStorage.js"

// Owns persisted text and session replacement, independently of Sidebar collapse.
// Undo history stays in memory; opening/new work starts a fresh editor history.
export default function createProjectWorkspace({ getStorage = () => window.localStorage, delay = 300 } = {}) {
    let storage, raw = null, blocked = false, message = "Current Work is saved in this browser."
    let record = emptyProjectRecord()
    try {
        storage = getStorage()
        raw = storage.getItem(PROJECTS_KEY)
        record = parseProjectRecord(raw)
    } catch (error) {
        blocked = true
        message = `${error.message} Editing is still available, but saving is disabled.`
    }
    let session = createEditorSession(record.draft.sources)
    let timer, unsubscribe, connected = false
    const listeners = new Set()
    let snapshot = { ...record, message, error: blocked, pending: false, canRetry: !blocked }
    const emit = (changes) => {
        snapshot = { ...snapshot, ...changes }
        for (const listener of listeners) listener()
    }
    function capture() {
        const sources = session.getSnapshot()
        const edited = ["html", "css", "javascript"].some(language => sources[language] !== record.draft.sources[language])
        record = { ...record, draft: { ...record.draft, sources,
            updatedAt: edited ? new Date().toISOString() : record.draft.updatedAt,
        } }
    }
    function persist(next = record) {
        clearTimeout(timer)
        if (blocked) return false
        try {
            raw = writeProjectRecord(storage, raw, next)
            record = next
            emit({ ...record, error: false, pending: false, canRetry: true, message: "Current Work is saved in this browser." })
            return true
        } catch (error) {
            emit({ error: true, pending: true, message: `Not saved: ${error.message}` })
            return false
        }
    }
    function changed() {
        capture()
        clearTimeout(timer)
        if (blocked) return
        if (!snapshot.pending) emit({ pending: true, message: "Saving Current Work…" })
        timer = setTimeout(() => persist(), delay)
    }
    function bindSession() {
        unsubscribe?.()
        unsubscribe = session.subscribe(changed)
    }
    function replaceDraft(draft) {
        const next = { ...record, draft }
        // Never replace the editor until the new draft has been safely written.
        if (!persist(next)) return false
        session = createEditorSession(draft.sources)
        if (connected) bindSession()
        emit({ ...record })
        return true
    }
    const api = {
        getSnapshot: () => snapshot,
        getSession: () => session,
        subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
        connect() {
            connected = true
            bindSession()
            const flush = () => { if (snapshot.pending) { capture(); persist() } }
            const onVisibility = () => { if (document.visibilityState === "hidden") flush() }
            const onStorage = (event) => {
                if (event.key !== PROJECTS_KEY && event.key !== null) return
                try {
                    if (!storage || storage.getItem(PROJECTS_KEY) === raw) return
                    clearTimeout(timer)
                    blocked = true
                    emit({ error: true, canRetry: false, message: "Work changed in another tab. Saving is paused. Copy your current code before refreshing to load that version." })
                } catch {
                    clearTimeout(timer)
                    blocked = true
                    emit({ error: true, canRetry: false, message: "Browser storage is unavailable. Saving is paused; keep a copy of your code before leaving." })
                }
            }
            window.addEventListener("pagehide", flush)
            window.addEventListener("storage", onStorage)
            document.addEventListener("visibilitychange", onVisibility)
            return () => {
                flush()
                clearTimeout(timer)
                unsubscribe?.()
                connected = false
                window.removeEventListener("pagehide", flush)
                window.removeEventListener("storage", onStorage)
                document.removeEventListener("visibilitychange", onVisibility)
            }
        },
        renameDraft(name) {
            if (!validName(name)) return false
            capture()
            return persist({ ...record, draft: { ...record.draft, name: name.trim(), updatedAt: new Date().toISOString() } })
        },
        retry() { capture(); return persist() },
        save() {
            return record.draft.savedId ? api.saveChanges() : api.saveCopy()
        },
        saveCopy(name = record.draft.name) {
            if (!validName(name)) return false
            capture()
            try {
                const project = { name: name.trim(), sources: record.draft.sources, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }
                return persist({ ...record, draft: { ...record.draft, name: project.name, savedId: project.id, updatedAt: project.updatedAt }, saved: [project, ...record.saved] })
            } catch {
                emit({ error: true, canRetry: false, message: "Could not create a saved copy in this browser. Current Work remains available." })
                return false
            }
        },
        saveChanges() {
            capture()
            const id = record.draft.savedId
            if (!id || !record.saved.some(project => project.id === id)) return false
            return persist({ ...record, saved: record.saved.map(project => project.id === id ? {
                ...project, name: record.draft.name, sources: record.draft.sources, updatedAt: record.draft.updatedAt ?? new Date().toISOString(),
            } : project) })
        },
        open(id) {
            const project = record.saved.find(item => item.id === id)
            return project ? replaceDraft({ name: project.name, savedId: project.id, updatedAt: project.updatedAt, sources: project.sources }) : false
        },
        newWork() { return replaceDraft(emptyProjectRecord().draft) },
        renameSaved(id, name) {
            if (!validName(name)) return false
            capture()
            return persist({ ...record,
                draft: record.draft.savedId === id ? { ...record.draft, name: name.trim(), updatedAt: new Date().toISOString() } : record.draft,
                saved: record.saved.map(project => project.id === id ? { ...project, name: name.trim(), updatedAt: new Date().toISOString() } : project),
            })
        },
        move(id, targetId) {
            const from = record.saved.findIndex(project => project.id === id)
            const to = record.saved.findIndex(project => project.id === targetId)
            if (from < 0 || to < 0 || from === to) return false
            capture()
            const saved = [...record.saved]
            const [project] = saved.splice(from, 1)
            saved.splice(to, 0, project)
            return persist({ ...record, saved })
        },
        remove(id) {
            capture()
            return persist({ ...record,
                draft: record.draft.savedId === id ? { ...record.draft, savedId: null } : record.draft,
                saved: record.saved.filter(project => project.id !== id),
            })
        },
    }
    return api
}
