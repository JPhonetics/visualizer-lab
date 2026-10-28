import { redo, undo } from "@codemirror/commands"
import { describe, expect, it } from "vitest"

import createEditorSession from "../../src/features/editor/editorSession.js"

it("retains separate documents and selections", () => {
    const session = createEditorSession()
    session.setState("html", session.getState("html").update({
        changes: { from: 0, insert: "<h1>Hello</h1>" },
        selection: { anchor: 4 },
    }).state)
    session.setState("css", session.getState("css").update({ changes: { from: 0, insert: "h1 { color: green; }" } }).state)
    expect(session.getState("html").doc.toString()).toBe("<h1>Hello</h1>")
    expect(session.getState("html").selection.main.anchor).toBe(4)
    expect(session.getState("css").doc.toString()).toContain("green")
    expect(session.getState("javascript").doc.toString()).toBe("")
})

describe("per-language history", () => {
    it("retains undo/redo when another document is used", () => {
        const session = createEditorSession()
        session.setState("html", session.getState("html").update({ changes: { from: 0, insert: "hello" } }).state)
        session.setState("css", session.getState("css").update({ changes: { from: 0, insert: "body {}" } }).state)
        const commandTarget = () => ({
            state: session.getState("html"),
            dispatch: (transaction) => session.setState("html", transaction.state),
        })
        expect(undo(commandTarget())).toBe(true)
        expect(session.getState("html").doc.toString()).toBe("")
        expect(session.getState("css").doc.toString()).toBe("body {}")
        expect(redo(commandTarget())).toBe(true)
        expect(session.getState("html").doc.toString()).toBe("hello")
    })

    it("starts fresh in a new workspace session", () => {
        const first = createEditorSession()
        first.setState("javascript", first.getState("javascript").update({ changes: { from: 0, insert: "alert(1)" } }).state)
        expect(createEditorSession().getState("javascript").doc.toString()).toBe("")
    })
})

it("publishes cached source snapshots only for changed text and cleans subscriptions", () => {
    const session = createEditorSession()
    const snapshots = []
    const unsubscribe = session.subscribe(() => snapshots.push(session.getSnapshot()))
    const empty = session.getSnapshot()
    expect(session.getSnapshot()).toBe(empty)
    session.setState("html", session.getState("html").update({ changes: { from: 0, insert: "hello" } }).state)
    const updated = session.getSnapshot()
    expect(updated).toEqual({ html: "hello", css: "", javascript: "" })
    expect(snapshots).toHaveLength(1)
    session.setState("html", session.getState("html").update({ selection: { anchor: 1 } }).state)
    expect(session.getSnapshot()).toBe(updated)
    expect(snapshots).toHaveLength(1)
    unsubscribe()
    session.setState("css", session.getState("css").update({ changes: { from: 0, insert: "p {}" } }).state)
    expect(snapshots).toHaveLength(1)
})
