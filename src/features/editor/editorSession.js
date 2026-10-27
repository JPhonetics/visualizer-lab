import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language"
import { EditorState } from "@codemirror/state"
import { drawSelection, EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from "@codemirror/view"
import { tags } from "@lezer/highlight"

const LANGUAGES = { html, css, javascript }
const LABELS = { html: "HTML", css: "CSS", javascript: "JavaScript" }

const highlighting = HighlightStyle.define([
    { tag: tags.keyword, color: "var(--editor-keyword)" },
    { tag: [tags.string, tags.attributeValue], color: "var(--editor-string)" },
    { tag: [tags.number, tags.bool, tags.null], color: "var(--editor-number)" },
    { tag: [tags.tagName, tags.typeName], color: "var(--editor-tag)" },
    { tag: tags.attributeName, color: "var(--editor-attribute)" },
    { tag: tags.comment, color: "var(--color-text-muted)", fontStyle: "italic" },
])

// Immutable states keep each document's text, selection and undo history. The
// workspace owns the session so destroying a collapsed view never loses edits.
export default function createEditorSession() {
    const states = new Map(Object.entries(LANGUAGES).map(([language, support]) => [
        language,
        EditorState.create({
            doc: "",
            extensions: [
                support(),
                history(),
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                drawSelection(),
                bracketMatching(),
                indentOnInput(),
                indentUnit.of("    "),
                EditorState.tabSize.of(4),
                syntaxHighlighting(highlighting),
                // Tab intentionally remains available for keyboard focus traversal.
                keymap.of([...defaultKeymap, ...historyKeymap]),
                EditorView.contentAttributes.of({
                    "aria-label": `${LABELS[language]} code editor`,
                    "aria-describedby": "frontend-editor-note",
                }),
            ],
        }),
    ]))

    return {
        getState(language) {
            return states.get(language)
        },
        setState(language, state) {
            states.set(language, state)
        },
    }
}
