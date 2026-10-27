import { lazy, Suspense } from "react"
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom"

import HomeRedirect from "../pages/HomeRedirect.jsx"
import VisualizedPage from "../pages/VisualizedPage.jsx"
import VisualizerPlaceholderPage from "../pages/VisualizerPlaceholderPage.jsx"

import "../styles/app-shell.css"

// Standalone Preview does not need to download the editor workspace.
const AppShell = lazy(() => import("../components/layout/AppShell.jsx"))

// ==============================
// APPLICATION
// ==============================

/*
    Summary:
    App defines the page-level routing for Visualizer Lab.

    Current routes:

    /
    -> redirects to the implemented Frontend workspace.

    /frontend
    -> Frontend visualizer workspace.

    /frontend/visualized
    -> standalone Frontend Preview.

    /javascript
    -> JavaScript visualizer placeholder.

    /python
    -> Python visualizer placeholder.

    Unknown routes
    -> return to /, which redirects to Frontend.

    Key concepts:

    BrowserRouter
    -> uses normal browser URLs such as:

       /frontend
       /javascript
       /python

       instead of hash-based URLs such as:

       /#/frontend

    Routes
    -> contains the application's route definitions.

    Route
    -> maps a URL path to a React element.

    Navigate
    -> performs a React Router redirect.

    Used by:
    main.jsx

    Uses:
    AppShell.jsx
    HomeRedirect.jsx
    VisualizedPage.jsx
    VisualizerPlaceholderPage.jsx

    See:
    TopBar.jsx
    -> lets the user navigate between visualizers.

    HomeRedirect.jsx
    -> opens the implemented Frontend workspace.

    Deployment note:
    BrowserRouter uses Vite's base path for project hosting.
    The Pages build emits static route entry files and an app-aware
    404.html, keeping direct routes functional without hash URLs.

    That lets React Router handle routes such as:

    /frontend
    /javascript
    /python

    when someone refreshes the browser directly on that URL.
*/


function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>

                {/* ==============================
                    ROOT
                    ============================== */}

                <Route
                    path="/"
                    element={
                        <HomeRedirect />
                    }
                />


                {/* ==============================
                    FRONTEND
                    ============================== */}

                <Route
                    path="/frontend"
                    element={
                        <Suspense fallback={<main role="status">Loading workspace…</main>}>
                            <AppShell />
                        </Suspense>
                    }
                />


                <Route
                    path="/frontend/visualized"
                    element={
                        <VisualizedPage />
                    }
                />


                {/* ==============================
                    JAVASCRIPT
                    ============================== */}

                <Route
                    path="/javascript"
                    element={
                        <VisualizerPlaceholderPage
                            description="Explore how JavaScript code behaves and changes step by step."
                            title="JavaScript"
                        />
                    }
                />


                {/* ==============================
                    PYTHON
                    ============================== */}

                <Route
                    path="/python"
                    element={
                        <VisualizerPlaceholderPage
                            description="Explore Python concepts and see how code changes affect results."
                            title="Python"
                        />
                    }
                />


                {/* ==============================
                    UNKNOWN ROUTES
                    ============================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}

export default App