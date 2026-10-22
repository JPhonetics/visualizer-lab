import { useState } from "react"

import Button from "../ui/Button.jsx"
import Panel from "./Panel.jsx"

// ==============================
// EDITOR PANEL
// ==============================

/*
    Summary:
    EditorPanel contains the code-editing side of Visualizer Lab.

    The current foundation provides tabs for:

    HTML
    CSS
    JavaScript

    CodeMirror will eventually replace the placeholder editor
    content.

    EditorPanel does NOT own whether the entire Editor is
    collapsed.

    AppShell owns that workspace-level state and passes an
    onCollapse callback into this component.

    Key concepts:

    Local state
    -> activeLanguage belongs specifically to EditorPanel.

    Props
    -> onCollapse lets EditorPanel request a workspace-level
       layout change without owning that layout state.

    Event handlers
    -> language tab buttons update the active editor.

    Used by:
    AppShell.jsx

    Uses:
    Button.jsx
    Panel.jsx

    See:
    AppShell.jsx
    -> owns Editor / Preview layout and collapse state.

    CollapsedPanelRail.jsx
    -> replaces EditorPanel while Editor is collapsed.

    src/styles/app-shell.css
    -> folder tabs and lightweight collapse control styling.
*/


function EditorPanel({
    onCollapse,
}) {

    // ==============================
    // ACTIVE LANGUAGE
    // ==============================

    /*
        activeLanguage determines which editor tab is selected.

        Current options:

        html
        css
        javascript

        This is temporary working state and currently resets to
        HTML when the application reloads.
    */
    const [activeLanguage, setActiveLanguage] =
        useState("html")


    // ==============================
    // EDITOR HEADER
    // ==============================

    const editorHeader = (
        <div className="editor-header-layout">

            {/* ==============================
                LANGUAGE TABS
                ============================== */}

            <div
                className="editor-tabs"
                role="tablist"
                aria-label="Editor language"
            >
                <Button
                    className={`editor-tab ${
                        activeLanguage === "html"
                            ? "active"
                            : ""
                    }`}
                    role="tab"
                    aria-selected={
                        activeLanguage === "html"
                    }
                    onClick={() =>
                        setActiveLanguage("html")
                    }
                >
                    HTML
                </Button>

                <Button
                    className={`editor-tab ${
                        activeLanguage === "css"
                            ? "active"
                            : ""
                    }`}
                    role="tab"
                    aria-selected={
                        activeLanguage === "css"
                    }
                    onClick={() =>
                        setActiveLanguage("css")
                    }
                >
                    CSS
                </Button>

                <Button
                    className={`editor-tab ${
                        activeLanguage === "javascript"
                            ? "active"
                            : ""
                    }`}
                    role="tab"
                    aria-selected={
                        activeLanguage
                            === "javascript"
                    }
                    onClick={() =>
                        setActiveLanguage(
                            "javascript",
                        )
                    }
                >
                    JavaScript
                </Button>
            </div>


            {/* ==============================
                EDITOR ACTIONS
                ============================== */}

            <div className="panel-controls editor-header-actions">

                <Button>
                    Format
                </Button>

                <Button>
                    Help
                </Button>


                {/*
                    Editor collapses toward the left side of the
                    workspace.

                    ‹ therefore shows the direction the panel will
                    move when this control is clicked.

                    Once collapsed, the rail reverses the arrow to:

                    ›

                    because that is the direction Editor expands.
                */}
                <Button
                    className="panel-collapse-button"
                    title="Collapse Editor"
                    aria-label="Collapse Editor"
                    onClick={onCollapse}
                >
                    ‹
                </Button>

            </div>

        </div>
    )


    return (
        <Panel
            header={editorHeader}
            className="editor-panel"
        >
            <div className="editor-placeholder">
                {activeLanguage} Editor
            </div>
        </Panel>
    )
}

export default EditorPanel