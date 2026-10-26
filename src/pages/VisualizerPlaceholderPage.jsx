import { useEffect } from "react"

import TopBar from "../components/layout/TopBar.jsx"

// ==============================
// VISUALIZER PLACEHOLDER PAGE
// ==============================

/*
    Summary:
    VisualizerPlaceholderPage represents a visualizer route that
    exists but whose full workspace has not been built yet.

    Currently:

    JavaScript
    Python

    We intentionally do NOT reuse the Frontend workspace for
    these visualizers yet because their eventual editor layouts
    and behavior may be different.

    Key concepts:

    Props
    -> one reusable page can represent multiple visualizers.

    useEffect
    -> updates the browser tab title when this page is mounted.

    Shared layout
    -> TopBar remains consistent across Visualizer Lab.

    Used by:
    App.jsx

    Uses:
    TopBar.jsx

    See:
    AppShell.jsx
    -> current Frontend workspace.
*/


function VisualizerPlaceholderPage({
    description,
    title,
}) {

    // ==============================
    // BROWSER TAB TITLE
    // ==============================

    /*
        Page-specific information comes first:

        JavaScript - Visualizer Lab

        instead of:

        Visualizer Lab - JavaScript

        This makes browser tabs easier to distinguish when several
        Visualizer Lab pages are open.
    */
    useEffect(() => {
        document.title =
            `${title} - Visualizer Lab`
    }, [
        title,
    ])


    return (
        <div className="app-shell">
            <TopBar />

            <main className="visualizer-placeholder">
                <div className="visualizer-placeholder-content">

                    <h1>
                        {title}
                    </h1>

                    <p>
                        {description}
                    </p>

                    <p>
                        This visualizer will be built after the
                        Frontend foundation is complete.
                    </p>

                </div>
            </main>
        </div>
    )
}

export default VisualizerPlaceholderPage