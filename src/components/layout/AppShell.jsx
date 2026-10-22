import {
    useEffect,
    useRef,
} from "react"

import CollapsedPanelRail from "./CollapsedPanelRail.jsx"
import EditorPanel from "./EditorPanel.jsx"
import PreviewPanel from "./PreviewPanel.jsx"
import Sidebar from "./Sidebar.jsx"
import TopBar from "./TopBar.jsx"
import WorkspaceDivider from "./WorkspaceDivider.jsx"

import useLocalStorageState from "../../hooks/useLocalStorageState.js"
import keyboardResize from "../../utils/keyboardResize.js"

// ==============================
// APPLICATION SHELL
// ==============================

/*
    Summary:
    AppShell controls the overall Frontend workspace layout for
    Visualizer Lab.

    Current structure:

    TopBar

    Workspace:
    Sidebar | Editor | Divider | Preview

    Editor and Preview can also collapse into narrow vertical
    rails.

    AppShell owns layout state that affects multiple parts of the
    workspace:

    Sidebar width
    Sidebar expanded / collapsed
    Editor / Preview split
    Editor / Preview collapsed state

    Persistent layout values use:

    useLocalStorageState()

    Resizing is optimized so high-frequency pointer movement does
    NOT continuously update React state or localStorage.

    During a drag:

    pointermove
    -> stores the newest pointer position.

    requestAnimationFrame()
    -> updates the CSS Grid directly.

    pointerup
    -> saves the final value into React state / localStorage once.

    Key concepts:

    useEffect
    -> connects temporary browser event listeners and updates the
       browser tab title.

    useRef
    -> stores DOM references and mutable resize information
       without causing React renders.

    requestAnimationFrame
    -> synchronizes visual resize work with browser painting.

    CSS Grid
    -> controls Sidebar / Editor / Divider / Preview sizing.

    Derived layout
    -> grid columns are calculated from persistent state rather
       than storing duplicate layout information.

    Used by:
    App.jsx

    Uses:
    CollapsedPanelRail.jsx
    EditorPanel.jsx
    PreviewPanel.jsx
    Sidebar.jsx
    TopBar.jsx
    useLocalStorageState.js
    WorkspaceDivider.jsx

    See:
    Sidebar.jsx
    -> starts Sidebar resizing and owns its internal Templates
       layout.

    WorkspaceDivider.jsx
    -> starts Editor / Preview resizing.

    CollapsedPanelRail.jsx
    -> replaces Editor or Preview while that panel is collapsed.

    src/styles/app-shell.css
    -> visual workspace layout.
*/


// ==============================
// LAYOUT CONSTANTS
// ==============================

/*
    Editor, Preview, and Workspace all use the same collapsed rail
    width so the interface feels consistent.
*/
const COLLAPSED_PANEL_WIDTH = 36

const COLLAPSED_SIDEBAR_WIDTH = 36

const DEFAULT_EDITOR_WIDTH = 50

const DEFAULT_SIDEBAR_WIDTH = 220

const DIVIDER_WIDTH = 4

const MAXIMUM_EDITOR_WIDTH = 75

const MAXIMUM_SIDEBAR_WIDTH = 360

const MINIMUM_EDITOR_WIDTH = 25

const MINIMUM_SIDEBAR_WIDTH = 180


// ==============================
// STORAGE KEYS
// ==============================

const STORAGE_KEYS = {
    collapsedPanel:
        "visualizerLab.collapsedPanel",

    editorWidth:
        "visualizerLab.editorWidth",

    sidebarExpanded:
        "visualizerLab.sidebarExpanded",

    sidebarWidth:
        "visualizerLab.sidebarWidth",
}


// ==============================
// CREATE WORKSPACE COLUMNS
// ==============================

/*
    This helper creates the CSS Grid column definition for the
    current workspace state.

    Normal:

    Sidebar | Editor | Divider | Preview

    Editor collapsed:

    Sidebar | Editor rail | Divider | Preview

    Preview collapsed:

    Sidebar | Editor | Divider | Preview rail

    The saved editorWidth is NOT changed when a panel collapses.

    That means restoring the panel also restores the user's
    previous Editor / Preview split.
*/
function createWorkspaceColumns(
    sidebarWidth,
    editorWidth,
    collapsedPanel,
) {
    if (
        collapsedPanel
        === "editor"
    ) {
        return `
            ${sidebarWidth}px
            ${COLLAPSED_PANEL_WIDTH}px
            ${DIVIDER_WIDTH}px
            minmax(0, 1fr)
        `
    }

    if (
        collapsedPanel
        === "preview"
    ) {
        return `
            ${sidebarWidth}px
            minmax(0, 1fr)
            ${DIVIDER_WIDTH}px
            ${COLLAPSED_PANEL_WIDTH}px
        `
    }

    return `
        ${sidebarWidth}px
        minmax(0, ${editorWidth}fr)
        ${DIVIDER_WIDTH}px
        minmax(0, ${100 - editorWidth}fr)
    `
}


function AppShell() {

    // ==============================
    // PERSISTENT WORKSPACE STATE
    // ==============================

    /*
        collapsedPanel can be:

        null
        -> both Editor and Preview are open.

        "editor"
        -> Editor is collapsed.

        "preview"
        -> Preview is collapsed.

        One value is safer than two booleans because it prevents
        Editor and Preview from both becoming collapsed at the
        same time.
    */
    const [
        collapsedPanel,
        setCollapsedPanel,
    ] = useLocalStorageState(
        STORAGE_KEYS.collapsedPanel,
        null,
    )

    const [
        editorWidth,
        setEditorWidth,
    ] = useLocalStorageState(
        STORAGE_KEYS.editorWidth,
        DEFAULT_EDITOR_WIDTH,
    )

    const [
        sidebarExpanded,
        setSidebarExpanded,
    ] = useLocalStorageState(
        STORAGE_KEYS.sidebarExpanded,
        true,
    )

    const [
        sidebarWidth,
        setSidebarWidth,
    ] = useLocalStorageState(
        STORAGE_KEYS.sidebarWidth,
        DEFAULT_SIDEBAR_WIDTH,
    )


    // ==============================
    // DOM REFERENCES
    // ==============================

    /*
        workspaceRef
        -> the actual CSS Grid DOM element.

        During resizing we update:

        workspace.style.gridTemplateColumns

        directly.

        That avoids asking React to rerender the entire workspace
        on every pointer movement.
    */
    const workspaceRef =
        useRef(null)


    // ==============================
    // SIDEBAR RESIZE REFERENCES
    // ==============================

    /*
        These refs hold temporary information for one Sidebar drag.

        Refs are useful here because changing them does NOT trigger
        React renders.
    */
    const sidebarAnimationFrameRef =
        useRef(null)

    const sidebarResizeBoundsRef =
        useRef(null)

    const sidebarResizeValueRef =
        useRef(sidebarWidth)

    const pendingSidebarPointerXRef =
        useRef(null)


    // ==============================
    // WORKSPACE RESIZE REFERENCES
    // ==============================

    const editorAnimationFrameRef =
        useRef(null)

    const editorResizeBoundsRef =
        useRef(null)

    const editorResizeValueRef =
        useRef(editorWidth)

    const pendingEditorPointerXRef =
        useRef(null)


    // ==============================
    // BROWSER TAB TITLE
    // ==============================

    /*
        Visualizer Lab uses:

        Page - Site

        Examples:

        Frontend - Visualizer Lab
        JavaScript - Visualizer Lab
        Visualized - Visualizer Lab
    */
    useEffect(() => {
        document.title =
            "Frontend - Visualizer Lab"
    }, [])


    // ==============================
    // CURRENT SIDEBAR WIDTH
    // ==============================

    const currentSidebarWidth =
        sidebarExpanded
            ? sidebarWidth
            : COLLAPSED_SIDEBAR_WIDTH


    // ==============================
    // APPLY WORKSPACE COLUMNS
    // ==============================

    /*
        This helper updates the live DOM grid during a resize.

        It is intentionally separate from persistent state.

        The visual result changes immediately, while localStorage
        waits until the drag finishes.
    */
    function applyWorkspaceColumns(
        nextSidebarWidth,
        nextEditorWidth,
    ) {
        const workspace =
            workspaceRef.current

        if (!workspace) {
            return
        }

        workspace.style.gridTemplateColumns =
            createWorkspaceColumns(
                nextSidebarWidth,
                nextEditorWidth,
                collapsedPanel,
            )
    }


    function handleSidebarResizeKeyDown(event) {
        if (!sidebarExpanded || sidebarResizeBoundsRef.current) {
            return
        }

        const nextWidth = keyboardResize(event, {
            value: sidebarWidth,
            minimum: MINIMUM_SIDEBAR_WIDTH,
            maximum: MAXIMUM_SIDEBAR_WIDTH,
            step: 10,
            increaseKey: "ArrowRight",
            decreaseKey: "ArrowLeft",
        })

        if (nextWidth !== null) {
            setSidebarWidth(nextWidth)
        }
    }

    function handleWorkspaceResizeKeyDown(event) {
        if (collapsedPanel !== null || editorResizeBoundsRef.current) {
            return
        }

        const nextWidth = keyboardResize(event, {
            value: editorWidth,
            minimum: MINIMUM_EDITOR_WIDTH,
            maximum: MAXIMUM_EDITOR_WIDTH,
            step: 5,
            increaseKey: "ArrowRight",
            decreaseKey: "ArrowLeft",
        })

        if (nextWidth !== null) {
            setEditorWidth(nextWidth)
        }
    }


    // ==============================
    // SIDEBAR TOGGLE
    // ==============================

    function handleSidebarToggle() {
        setSidebarExpanded(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // EDITOR COLLAPSE
    // ==============================

    function handleEditorCollapse() {
        setCollapsedPanel(
            "editor",
        )
    }


    // ==============================
    // PREVIEW COLLAPSE
    // ==============================

    function handlePreviewCollapse() {
        setCollapsedPanel(
            "preview",
        )
    }


    // ==============================
    // RESTORE COLLAPSED PANEL
    // ==============================

    function handlePanelRestore() {
        setCollapsedPanel(
            null,
        )
    }


    // ==============================
    // START SIDEBAR RESIZE
    // ==============================

    function handleSidebarResizeStart(event) {
        if (!sidebarExpanded) {
            return
        }

        event.preventDefault()

        const workspace =
            workspaceRef.current

        if (!workspace) {
            return
        }

        /*
            Capture geometry ONCE at the beginning of the drag.

            getBoundingClientRect() can cause browser layout work.

            There is no need to recalculate the same workspace
            left edge on every pointermove.
        */
        const bounds =
            workspace
                .getBoundingClientRect()

        sidebarResizeBoundsRef.current = {
            left: bounds.left,
        }

        sidebarResizeValueRef.current =
            sidebarWidth

        pendingSidebarPointerXRef.current =
            event.clientX


        // ==============================
        // SIDEBAR POINTER MOVE
        // ==============================

        function handlePointerMove(pointerEvent) {
            pendingSidebarPointerXRef.current =
                pointerEvent.clientX

            if (
                sidebarAnimationFrameRef.current
                !== null
            ) {
                return
            }

            sidebarAnimationFrameRef.current =
                requestAnimationFrame(() => {
                    sidebarAnimationFrameRef.current =
                        null

                    const clientX =
                        pendingSidebarPointerXRef.current

                    const resizeBounds =
                        sidebarResizeBoundsRef.current

                    if (
                        clientX === null
                        || !resizeBounds
                    ) {
                        return
                    }

                    const proposedWidth =
                        clientX
                        - resizeBounds.left

                    const nextSidebarWidth =
                        Math.min(
                            MAXIMUM_SIDEBAR_WIDTH,
                            Math.max(
                                MINIMUM_SIDEBAR_WIDTH,
                                proposedWidth,
                            ),
                        )

                    sidebarResizeValueRef.current =
                        nextSidebarWidth

                    applyWorkspaceColumns(
                        nextSidebarWidth,
                        editorWidth,
                    )
                })
        }


        // ==============================
        // FINISH SIDEBAR RESIZE
        // ==============================

        function finishSidebarResize(
            pointerEvent,
        ) {
            pendingSidebarPointerXRef.current =
                pointerEvent.clientX

            const resizeBounds =
                sidebarResizeBoundsRef.current

            if (resizeBounds) {
                const proposedWidth =
                    pointerEvent.clientX
                    - resizeBounds.left

                const finalSidebarWidth =
                    Math.min(
                        MAXIMUM_SIDEBAR_WIDTH,
                        Math.max(
                            MINIMUM_SIDEBAR_WIDTH,
                            proposedWidth,
                        ),
                    )

                sidebarResizeValueRef.current =
                    finalSidebarWidth

                applyWorkspaceColumns(
                    finalSidebarWidth,
                    editorWidth,
                )

                /*
                    This is the only persistent update for the
                    entire drag.
                */
                setSidebarWidth(
                    finalSidebarWidth,
                )
            }

            if (
                sidebarAnimationFrameRef.current
                !== null
            ) {
                cancelAnimationFrame(
                    sidebarAnimationFrameRef.current,
                )

                sidebarAnimationFrameRef.current =
                    null
            }

            sidebarResizeBoundsRef.current =
                null

            pendingSidebarPointerXRef.current =
                null

            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            )

            window.removeEventListener(
                "pointerup",
                finishSidebarResize,
            )

            window.removeEventListener(
                "pointercancel",
                finishSidebarResize,
            )
        }


        window.addEventListener(
            "pointermove",
            handlePointerMove,
        )

        window.addEventListener(
            "pointerup",
            finishSidebarResize,
        )

        window.addEventListener(
            "pointercancel",
            finishSidebarResize,
        )
    }


    // ==============================
    // START EDITOR / PREVIEW RESIZE
    // ==============================

    function handleWorkspaceResizeStart(event) {

        /*
            There is no meaningful Editor / Preview split to resize
            while either panel is collapsed.
        */
        if (collapsedPanel !== null) {
            return
        }

        event.preventDefault()

        const workspace =
            workspaceRef.current

        if (!workspace) {
            return
        }

        const bounds =
            workspace
                .getBoundingClientRect()

        /*
            Editor and Preview share whatever remains after:

            Sidebar
            +
            divider

            are removed from the total workspace width.
        */
        const availableWidth =
            bounds.width
            - currentSidebarWidth
            - DIVIDER_WIDTH

        editorResizeBoundsRef.current = {
            availableWidth,
            left:
                bounds.left
                + currentSidebarWidth,
        }

        editorResizeValueRef.current =
            editorWidth

        pendingEditorPointerXRef.current =
            event.clientX


        // ==============================
        // CALCULATE EDITOR WIDTH
        // ==============================

        function calculateEditorWidth(
            clientX,
        ) {
            const resizeBounds =
                editorResizeBoundsRef.current

            if (!resizeBounds) {
                return editorResizeValueRef.current
            }

            const editorPixels =
                clientX
                - resizeBounds.left

            /*
                Convert pixels to the Editor's percentage of the
                shared Editor / Preview space.

                Formula:

                part / whole * 100
            */
            const proposedEditorWidth =
                (
                    editorPixels
                    / resizeBounds.availableWidth
                )
                * 100

            return Math.min(
                MAXIMUM_EDITOR_WIDTH,
                Math.max(
                    MINIMUM_EDITOR_WIDTH,
                    proposedEditorWidth,
                ),
            )
        }


        // ==============================
        // EDITOR POINTER MOVE
        // ==============================

        function handlePointerMove(pointerEvent) {
            pendingEditorPointerXRef.current =
                pointerEvent.clientX

            if (
                editorAnimationFrameRef.current
                !== null
            ) {
                return
            }

            editorAnimationFrameRef.current =
                requestAnimationFrame(() => {
                    editorAnimationFrameRef.current =
                        null

                    const clientX =
                        pendingEditorPointerXRef.current

                    if (clientX === null) {
                        return
                    }

                    const nextEditorWidth =
                        calculateEditorWidth(
                            clientX,
                        )

                    editorResizeValueRef.current =
                        nextEditorWidth

                    applyWorkspaceColumns(
                        currentSidebarWidth,
                        nextEditorWidth,
                    )
                })
        }


        // ==============================
        // FINISH EDITOR RESIZE
        // ==============================

        function finishWorkspaceResize(
            pointerEvent,
        ) {
            const finalEditorWidth =
                calculateEditorWidth(
                    pointerEvent.clientX,
                )

            editorResizeValueRef.current =
                finalEditorWidth

            applyWorkspaceColumns(
                currentSidebarWidth,
                finalEditorWidth,
            )

            /*
                Persist once after the drag finishes.
            */
            setEditorWidth(
                finalEditorWidth,
            )

            if (
                editorAnimationFrameRef.current
                !== null
            ) {
                cancelAnimationFrame(
                    editorAnimationFrameRef.current,
                )

                editorAnimationFrameRef.current =
                    null
            }

            editorResizeBoundsRef.current =
                null

            pendingEditorPointerXRef.current =
                null

            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            )

            window.removeEventListener(
                "pointerup",
                finishWorkspaceResize,
            )

            window.removeEventListener(
                "pointercancel",
                finishWorkspaceResize,
            )
        }


        window.addEventListener(
            "pointermove",
            handlePointerMove,
        )

        window.addEventListener(
            "pointerup",
            finishWorkspaceResize,
        )

        window.addEventListener(
            "pointercancel",
            finishWorkspaceResize,
        )
    }


    // ==============================
    // WORKSPACE GRID
    // ==============================

    const workspaceStyle = {
        gridTemplateColumns:
            createWorkspaceColumns(
                currentSidebarWidth,
                editorWidth,
                collapsedPanel,
            ),
    }


    return (
        <div className="app-shell">

            <TopBar />

            <main
                ref={workspaceRef}
                className="workspace"
                style={workspaceStyle}
            >

                {/* ==============================
                    WORKSPACE SIDEBAR
                    ============================== */}

                <Sidebar
                    isExpanded={sidebarExpanded}
                    width={sidebarWidth}
                    minimumWidth={MINIMUM_SIDEBAR_WIDTH}
                    maximumWidth={MAXIMUM_SIDEBAR_WIDTH}
                    onResizeKeyDown={handleSidebarResizeKeyDown}
                    onResizeStart={
                        handleSidebarResizeStart
                    }
                    onToggle={
                        handleSidebarToggle
                    }
                />


                {/* ==============================
                    EDITOR
                    ============================== */}

                {collapsedPanel === "editor"
                    ? (
                        <CollapsedPanelRail
                            expandDirection="right"
                            label="Editor"
                            onExpand={
                                handlePanelRestore
                            }
                        />
                    )
                    : (
                        <EditorPanel
                            onCollapse={
                                handleEditorCollapse
                            }
                        />
                    )
                }


                {/* ==============================
                    EDITOR / PREVIEW DIVIDER
                    ============================== */}

                <WorkspaceDivider
                    value={editorWidth}
                    minimum={MINIMUM_EDITOR_WIDTH}
                    maximum={MAXIMUM_EDITOR_WIDTH}
                    onKeyDown={handleWorkspaceResizeKeyDown}
                    isDisabled={
                        collapsedPanel !== null
                    }
                    onResizeStart={
                        handleWorkspaceResizeStart
                    }
                />


                {/* ==============================
                    PREVIEW
                    ============================== */}

                {collapsedPanel === "preview"
                    ? (
                        <CollapsedPanelRail
                            expandDirection="left"
                            label="Preview"
                            onExpand={
                                handlePanelRestore
                            }
                        />
                    )
                    : (
                        <PreviewPanel
                            onCollapse={
                                handlePreviewCollapse
                            }
                        />
                    )
                }

            </main>

        </div>
    )
}

export default AppShell