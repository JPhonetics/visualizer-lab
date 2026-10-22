import {
    useEffect,
    useRef,
    useState,
} from "react"
import {
    useLocation,
    useNavigate,
} from "react-router-dom"

import ThemeControl from "../../features/theme/ThemeControl.jsx"
import Button from "../ui/Button.jsx"

// ==============================
// TOP BAR
// ==============================

// Summary:
// TopBar displays the current Visualizer, its description,
// Theme controls, and support button.
//
// The Visualizer selector is already structured as a dropdown,
// even though Frontend is currently the only available option.
//
// That means future visualizers can be added by inserting another
// object into VISUALIZERS rather than rebuilding the dropdown.
//
// Key concepts:
//
// useState
// -> tracks whether the dropdown is open.
//
// useRef
// -> references the dropdown container so clicks outside of it
//    can close the dropdown.
//
// useEffect
// -> temporarily listens for outside pointer events.
//
// useLocation
// -> tells us which route is currently active.
//
// useNavigate
// -> changes routes without refreshing the browser.
//
// Array.map()
// -> creates one dropdown button for each Visualizer.
//
// Used by:
// AppShell.jsx
// VisualizerPlaceholderPage.jsx
//
// Uses:
// Button.jsx
// ThemeControl.jsx
// React Router
//
// See:
// App.jsx
// -> defines the routes used by the Visualizer selector.
//
// src/styles/app-shell.css
// -> TopBar and dropdown presentation.


// ==============================
// AVAILABLE VISUALIZERS
// ==============================

/*
    For now, Frontend is the only Visualizer that is actually
    available.

    Later we can add:

    JavaScript
    Python
    SQL

    by adding more objects to this array.

    The dropdown itself does not need to be redesigned.
*/
const VISUALIZERS = [
    {
        description:
            "Visualize how HTML, CSS, and JavaScript work together.",
        id: "frontend",
        label: "Frontend",
        path: "/frontend",
    },
]


// ==============================
// FIND ACTIVE VISUALIZER
// ==============================

/*
    pathname is the current browser route.

    Example:

    /frontend
    /frontend/visualized

    startsWith() allows both of those routes to still identify
    Frontend as the active Visualizer.

    The fallback uses Frontend because it is currently our only
    available Visualizer.
*/
function getActiveVisualizer(pathname) {
    return (
        VISUALIZERS.find(
            (visualizer) =>
                pathname.startsWith(
                    visualizer.path,
                ),
        )
        ?? VISUALIZERS[0]
    )
}


function TopBar() {

    // ==============================
    // ROUTING
    // ==============================

    const location = useLocation()

    const navigate = useNavigate()


    // ==============================
    // ACTIVE VISUALIZER
    // ==============================

    const activeVisualizer =
        getActiveVisualizer(
            location.pathname,
        )


    // ==============================
    // DROPDOWN STATE
    // ==============================

    const [
        isVisualizerMenuOpen,
        setIsVisualizerMenuOpen,
    ] = useState(false)


    // ==============================
    // DROPDOWN DOM REFERENCE
    // ==============================

    /*
        visualizerSelectorRef points to the wrapper containing:

        Frontend button
        +
        dropdown

        We use this reference to determine whether a pointer click
        happened inside or outside of the selector.
    */
    const visualizerSelectorRef =
        useRef(null)


    // ==============================
    // TOGGLE DROPDOWN
    // ==============================

    function handleVisualizerMenuToggle() {
        setIsVisualizerMenuOpen(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // SELECT VISUALIZER
    // ==============================

    /*
        Clicking a dropdown option:

        1. Navigates to that Visualizer.
        2. Closes the dropdown.

        Frontend is currently the only option, but this function
        already supports future Visualizers.
    */
    function handleVisualizerSelect(
        visualizer,
    ) {
        navigate(
            visualizer.path,
        )

        setIsVisualizerMenuOpen(false)
    }


    // ==============================
    // CLOSE ON OUTSIDE CLICK
    // ==============================

    useEffect(() => {
        if (!isVisualizerMenuOpen) {
            return
        }


        function handlePointerDown(event) {
            const selector =
                visualizerSelectorRef.current

            if (!selector) {
                return
            }


            /*
                contains() checks whether the clicked DOM element
                lives somewhere inside our Visualizer selector.

                If it does, we leave the menu alone.

                If it does not, we close the menu.
            */
            if (
                !selector.contains(
                    event.target,
                )
            ) {
                setIsVisualizerMenuOpen(false)
            }
        }


        window.addEventListener(
            "pointerdown",
            handlePointerDown,
        )


        return () => {
            window.removeEventListener(
                "pointerdown",
                handlePointerDown,
            )
        }
    }, [
        isVisualizerMenuOpen,
    ])


    return (
        <header className="top-bar">

            {/* ==============================
                LEFT SIDE
                ============================== */}

            <div className="top-bar-left">

                {/* ==============================
                    VISUALIZER DROPDOWN
                    ============================== */}

                <div
                    ref={visualizerSelectorRef}
                    className="visualizer-selector"
                >
                    <Button
                        className="visualizer-select"
                        aria-expanded={
                            isVisualizerMenuOpen
                        }
                        aria-controls="visualizer-menu"
                        onClick={
                            handleVisualizerMenuToggle
                        }
                    >
                        <span>
                            {activeVisualizer.label}
                        </span>

                        <span
                            className="visualizer-select-arrow"
                            aria-hidden="true"
                        >
                            ▼
                        </span>
                    </Button>


                    {isVisualizerMenuOpen && (
                        <div
                            id="visualizer-menu"
                            className="visualizer-menu"
                        >
                            {VISUALIZERS.map(
                                (visualizer) => (
                                    <button
                                        key={visualizer.id}
                                        className={`visualizer-menu-item ${
                                            visualizer.id
                                            === activeVisualizer.id
                                                ? "active"
                                                : ""
                                        }`}
                                        type="button"
                                        aria-current={
                                            visualizer.id
                                            === activeVisualizer.id
                                                ? "page"
                                                : undefined
                                        }
                                        onClick={() =>
                                            handleVisualizerSelect(
                                                visualizer,
                                            )
                                        }
                                    >
                                        {visualizer.label}
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>


                {/* ==============================
                    CURRENT VISUALIZER DESCRIPTION
                    ============================== */}

                <span className="top-bar-description">
                    {activeVisualizer.description}
                </span>

            </div>


            {/* ==============================
                RIGHT SIDE
                ============================== */}

            <div className="top-bar-actions">

                <ThemeControl />

                <Button className="button-accent">
                    ☕ Coffee
                </Button>

            </div>

        </header>
    )
}

export default TopBar