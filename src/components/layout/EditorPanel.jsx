import { useId, useRef, useState } from "react"

import CodeEditor from "../../features/editor/CodeEditor.jsx"
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

    CodeMirror renders the active workspace-owned document.
    Preview wiring is a separate roadmap phase.

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


const LANGUAGES = ["html", "css", "javascript"]


function EditorPanel({
    onCollapse,
    session,
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


    const tabsId = useId()
    const tabRefs = useRef({})

    function handleTabKeyDown(event, language) {
        const index = LANGUAGES.indexOf(language)
        let nextIndex

        switch (event.key) {
            case "ArrowRight":
                nextIndex = (index + 1) % LANGUAGES.length
                break
            case "ArrowLeft":
                nextIndex = (index + LANGUAGES.length - 1) % LANGUAGES.length
                break
            case "Home":
                nextIndex = 0
                break
            case "End":
                nextIndex = LANGUAGES.length - 1
                break
            default:
                return
        }

        event.preventDefault()
        const nextLanguage = LANGUAGES[nextIndex]
        setActiveLanguage(nextLanguage)
        tabRefs.current[nextLanguage]?.focus()
    }


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
                {LANGUAGES.map((language) => (
                    <Button
                        key={language}
                        ref={(node) => { tabRefs.current[language] = node }}
                        id={`${tabsId}-${language}-tab`}
                        className={`editor-tab ${activeLanguage === language ? "active" : ""}`}
                        role="tab"
                        aria-selected={activeLanguage === language}
                        aria-controls={`${tabsId}-${language}-panel`}
                        tabIndex={activeLanguage === language ? 0 : -1}
                        onClick={() => setActiveLanguage(language)}
                        onKeyDown={(event) => handleTabKeyDown(event, language)}
                    >
                        {language === "javascript" ? "JavaScript" : language.toUpperCase()}
                    </Button>
                ))}
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
            <p id="frontend-editor-note" className="editor-stage-note">
                Current Work saves locally. Preview updates after a short pause.
            </p>
            {LANGUAGES.map((language) => (
                <div
                    key={language}
                    id={`${tabsId}-${language}-panel`}
                    className="editor-language-panel"
                    role="tabpanel"
                    aria-labelledby={`${tabsId}-${language}-tab`}
                    hidden={activeLanguage !== language}
                >
                    {activeLanguage === language && (
                        <CodeEditor language={language} session={session} />
                    )}
                </div>
            ))}
        </Panel>
    )
}

export default EditorPanel