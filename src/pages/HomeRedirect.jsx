import { Navigate } from "react-router-dom"

// ==============================
// HOME REDIRECT
// ==============================

/*
    Summary:
    HomeRedirect decides which visualizer should open when the
    user visits:

    /

    Instead of always forcing Frontend, it restores the user's
    most recently selected visualizer.

    Example:

    Last visualizer:
    JavaScript

    Visit:
    /

    Redirect:
    /javascript

    Key concepts:

    localStorage
    -> browser storage that survives refreshes and future visits.

    Navigate
    -> React Router component that redirects to another route.

    Validation
    -> saved browser data should not automatically be trusted.

       We confirm that the stored visualizer still exists before
       using it.

    Used by:
    App.jsx

    See:
    TopBar.jsx
    -> stores the most recently selected visualizer.
*/


// ==============================
// STORAGE
// ==============================

const LAST_VISUALIZER_KEY =
    "visualizerLab.lastVisualizer"


// ==============================
// VALID VISUALIZERS
// ==============================

const VALID_VISUALIZERS = [
    "frontend",
    "javascript",
    "python",
]


function HomeRedirect() {

    // ==============================
    // READ SAVED VISUALIZER
    // ==============================

    const savedVisualizer =
        localStorage.getItem(
            LAST_VISUALIZER_KEY,
        )


    // ==============================
    // VALIDATE SAVED VALUE
    // ==============================

    const visualizer =
        VALID_VISUALIZERS.includes(
            savedVisualizer,
        )
            ? savedVisualizer
            : "frontend"


    return (
        <Navigate
            to={`/${visualizer}`}
            replace
        />
    )
}

export default HomeRedirect