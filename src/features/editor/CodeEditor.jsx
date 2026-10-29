import { EditorView } from "@codemirror/view"
import { useEffect, useRef } from "react"

import "./editor.css"

// React owns the mount point; CodeMirror owns its DOM and transactions. Every
// transaction is retained in the session. The project controller batches source
// persistence separately; selection-only transactions do not schedule saves.
function CodeEditor({ language, session }) {
    const containerRef = useRef(null)

    useEffect(() => {
        const view = new EditorView({
            parent: containerRef.current,
            state: session.getState(language),
            dispatchTransactions(transactions, editor) {
                editor.update(transactions)
                session.setState(language, editor.state)
            },
        })

        return () => view.destroy()
    }, [language, session])

    return <div className="code-editor" ref={containerRef} />
}

export default CodeEditor
