import { afterEach, expect, it, vi } from "vitest"

import { emptyProjectRecord, MAX_RECORD_LENGTH, parseProjectRecord, PROJECTS_KEY, writeProjectRecord } from "../../src/features/projects/projectStorage.js"
import createProjectWorkspace from "../../src/features/projects/projectWorkspace.js"

afterEach(() => vi.useRealTimers())
const edit = (workspace, text, language = "html") => {
    const session = workspace.getSession()
    session.setState(language, session.getState(language).update({ changes: { from: 0, to: session.getState(language).doc.length, insert: text } }).state)
}

it("validates schema, preserves unsupported/corrupt data, and bounds writes", () => {
    expect(parseProjectRecord(null)).toEqual(emptyProjectRecord())
    for (const raw of ["broken", '{"version":2}', JSON.stringify({ ...emptyProjectRecord(), draft: {} }), " ".repeat(MAX_RECORD_LENGTH + 1)]) expect(() => parseProjectRecord(raw)).toThrow()
    const record = emptyProjectRecord()
    record.draft.sources.html = "a".repeat(MAX_RECORD_LENGTH)
    expect(() => writeProjectRecord(localStorage, null, record)).toThrow(/too large/)
    expect(localStorage.getItem(PROJECTS_KEY)).toBeNull()
})

it("debounces text-only saves, flushes on pagehide, and restores all languages", () => {
    vi.useFakeTimers()
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    edit(workspace, "<p>draft</p>")
    edit(workspace, "p {}", "css")
    edit(workspace, "const n = 1", "javascript")
    expect(localStorage.getItem(PROJECTS_KEY)).toBeNull()
    vi.advanceTimersByTime(300)
    expect(localStorage.getItem(PROJECTS_KEY)).toContain("draft")
    const session = workspace.getSession()
    session.setState("html", session.getState("html").update({ selection: { anchor: 1 } }).state)
    expect(vi.getTimerCount()).toBe(0)
    edit(workspace, "latest")
    window.dispatchEvent(new Event("pagehide"))
    expect(createProjectWorkspace().getSession().getSnapshot()).toEqual({ html: "latest", css: "p {}", javascript: "const n = 1" })
    stop()
    expect(vi.getTimerCount()).toBe(0)
})

it("saves immutable copies and opens fresh sessions; renames and deletes only the selected copy", () => {
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    edit(workspace, "original")
    workspace.renameDraft("First")
    expect(workspace.saveCopy()).toBe(true)
    const id = workspace.getSnapshot().saved[0].id
    edit(workspace, "changed")
    expect(workspace.getSnapshot().saved[0].sources.html).toBe("original")
    const old = workspace.getSession()
    expect(workspace.open(id)).toBe(true)
    expect(workspace.getSession()).not.toBe(old)
    expect(workspace.getSession().getSnapshot().html).toBe("original")
    expect(workspace.renameSaved(id, "Renamed")).toBe(true)
    expect(workspace.getSnapshot().draft.name).toBe("Renamed")
    expect(workspace.getSnapshot().saved[0].name).toBe("Renamed")
    workspace.remove(id)
    expect(workspace.getSnapshot().saved).toHaveLength(0)
    expect(workspace.getSession().getSnapshot().html).toBe("original")
    workspace.newWork()
    expect(workspace.getSession().getSnapshot().html).toBe("")
    stop()
})

it("retains draft, saved sources and links on failed writes, and can retry quota errors", () => {
    vi.useFakeTimers()
    let fail = false
    const storage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => { if (fail) throw new Error("quota"); localStorage.setItem(key, value) } }
    const workspace = createProjectWorkspace({ getStorage: () => storage })
    const stop = workspace.connect()
    edit(workspace, "keep me")
    workspace.saveCopy()
    const id = workspace.getSnapshot().draft.savedId
    fail = true
    const session = workspace.getSession()
    expect(workspace.newWork()).toBe(false)
    expect(workspace.getSession()).toBe(session)
    expect(workspace.saveCopy("failed copy")).toBe(false)
    expect(workspace.getSnapshot().saved).toHaveLength(1)
    expect(workspace.getSnapshot().draft.savedId).toBe(id)
    edit(workspace, "latest unsaved")
    vi.advanceTimersByTime(300)
    expect(workspace.getSnapshot().error).toBe(true)
    expect(workspace.saveChanges()).toBe(false)
    expect(workspace.getSnapshot().saved[0].sources.html).toBe("keep me")
    fail = false
    expect(workspace.retry()).toBe(true)
    expect(JSON.parse(localStorage.getItem(PROJECTS_KEY)).draft.sources.html).toBe("latest unsaved")
    stop()
})

it.each(["invalid", "future", "denied"])("keeps editing usable without overwriting %s storage", (kind) => {
    const raw = kind === "future" ? '{"version":9}' : "{broken"
    localStorage.setItem(PROJECTS_KEY, raw)
    const workspace = createProjectWorkspace({ getStorage: () => { if (kind === "denied") throw new Error("denied"); return localStorage } })
    const stop = workspace.connect()
    edit(workspace, "still editable")
    expect(workspace.getSnapshot().error).toBe(true)
    expect(workspace.retry()).toBe(false)
    expect(workspace.newWork()).toBe(false)
    expect(localStorage.getItem(PROJECTS_KEY)).toBe(raw)
    stop()
})

it("does not overwrite another tab's changes, including clearing site data", () => {
    vi.useFakeTimers()
    const first = createProjectWorkspace()
    const second = createProjectWorkspace()
    const stopFirst = first.connect()
    const stopSecond = second.connect()
    edit(first, "first tab")
    first.retry()
    edit(second, "second tab")
    expect(second.retry()).toBe(false)
    expect(JSON.parse(localStorage.getItem(PROJECTS_KEY)).draft.sources.html).toBe("first tab")
    window.dispatchEvent(new StorageEvent("storage", { key: PROJECTS_KEY }))
    expect(second.getSnapshot().message).toContain("another tab")
    localStorage.clear()
    window.dispatchEvent(new StorageEvent("storage", { key: null }))
    expect(first.getSnapshot().message).toContain("another tab")
    expect(first.retry()).toBe(false)
    stopFirst(); stopSecond()
    expect(localStorage.getItem(PROJECTS_KEY)).toBeNull()
})

it("updates only the linked copy, retains identity across refresh and detaches on deletion", () => {
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    expect(workspace.saveChanges()).toBe(false)
    edit(workspace, "first")
    workspace.saveCopy()
    const firstId = workspace.getSnapshot().draft.savedId
    edit(workspace, "second")
    workspace.saveCopy()
    const secondId = workspace.getSnapshot().draft.savedId
    workspace.open(firstId)
    edit(workspace, "updated first")
    workspace.renameDraft("Updated")
    expect(workspace.saveChanges()).toBe(true)
    expect(workspace.getSnapshot().saved).toHaveLength(2)
    expect(workspace.getSnapshot().saved.find(project => project.id === secondId).sources.html).toBe("second")
    const restored = createProjectWorkspace()
    expect(restored.getSnapshot().draft.savedId).toBe(firstId)
    expect(restored.getSnapshot().saved.find(project => project.id === firstId)).toMatchObject({ name: "Updated", sources: { html: "updated first" } })
    workspace.remove(firstId)
    expect(workspace.getSnapshot().draft.savedId).toBeNull()
    expect(workspace.getSession().getSnapshot().html).toBe("updated first")
    expect(workspace.saveChanges()).toBe(false)
    stop()
})

it("preserves legacy drafts without links/times and rejects invalid links/times", () => {
    const old = emptyProjectRecord()
    delete old.draft.savedId
    delete old.draft.updatedAt
    expect(parseProjectRecord(JSON.stringify(old)).draft).toMatchObject({ savedId: null, updatedAt: null })
    old.draft.updatedAt = "invalid"
    expect(() => parseProjectRecord(JSON.stringify(old))).toThrow(/time/)
    delete old.draft.updatedAt
    old.draft.savedId = "missing"
    expect(() => parseProjectRecord(JSON.stringify(old))).toThrow(/link/)
})

it("Save creates an initial linked copy then updates it; Save As can name a new copy", () => {
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    edit(workspace, "first")
    expect(workspace.save()).toBe(true)
    const firstId = workspace.getSnapshot().draft.savedId
    edit(workspace, "second")
    expect(workspace.save()).toBe(true)
    expect(workspace.getSnapshot().saved).toHaveLength(1)
    expect(workspace.getSnapshot().saved[0]).toMatchObject({ id: firstId, sources: { html: "second" } })
    expect(workspace.saveCopy("Other copy")).toBe(true)
    expect(workspace.getSnapshot().saved).toHaveLength(2)
    expect(workspace.getSnapshot().draft.name).toBe("Other copy")
    expect(workspace.getSnapshot().draft.savedId).not.toBe(firstId)
    stop()
})

it("persists the draft edit time independently of the saved version", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-28T10:00:00Z"))
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    edit(workspace, "saved")
    workspace.save()
    const savedTime = workspace.getSnapshot().saved[0].updatedAt
    vi.setSystemTime(new Date("2026-10-28T11:00:00Z"))
    edit(workspace, "later draft")
    vi.advanceTimersByTime(300)
    const draftTime = workspace.getSnapshot().draft.updatedAt
    expect(draftTime).not.toBe(savedTime)
    expect(workspace.getSnapshot().saved[0].updatedAt).toBe(savedTime)
    expect(createProjectWorkspace().getSnapshot().draft.updatedAt).toBe(draftTime)
    workspace.save()
    expect(workspace.getSnapshot().saved[0].updatedAt).toBe(draftTime)
    stop()
})

it("persists reordered IDs without changing edit times or draft linkage, rejects invalid moves", () => {
    const workspace = createProjectWorkspace()
    const stop = workspace.connect()
    workspace.saveCopy("First")
    workspace.saveCopy("Second")
    workspace.saveCopy("Third")
    const before = workspace.getSnapshot().saved
    const draft = workspace.getSnapshot().draft
    expect(workspace.move("missing", before[0].id)).toBe(false)
    expect(workspace.move(before[0].id, before[0].id)).toBe(false)
    expect(workspace.move(before[2].id, before[0].id)).toBe(true)
    expect(workspace.getSnapshot().saved).toEqual([before[2], before[0], before[1]])
    expect(workspace.getSnapshot().draft).toEqual(draft)
    expect(createProjectWorkspace().getSnapshot().saved).toEqual([before[2], before[0], before[1]])
    stop()
})

it("keeps stored/displayed order intact on a failed reorder write", () => {
    let fail = false
    const storage = { getItem: key => localStorage.getItem(key), setItem: (key, value) => { if (fail) throw new Error("quota"); localStorage.setItem(key, value) } }
    const workspace = createProjectWorkspace({ getStorage: () => storage })
    workspace.saveCopy("First")
    workspace.saveCopy("Second")
    const before = workspace.getSnapshot().saved
    fail = true
    expect(workspace.move(before[0].id, before[1].id)).toBe(false)
    expect(workspace.getSnapshot().saved).toBe(before)
    expect(createProjectWorkspace().getSnapshot().saved).toEqual(before)
})
