import { useEffect, useRef, useState } from "react"

import Button from "../ui/Button.jsx"
import useLocalStorageState from "../../hooks/useLocalStorageState.js"
import keyboardResize from "../../utils/keyboardResize.js"

// ==============================
// SIDEBAR
// ==============================

/*
    Summary:
    Sidebar is the collapsible workspace-navigation area on the
    left side of Visualizer Lab.

    The upper area contains:

    Search
    Current Work
    Saved Work

    Templates is docked separately at the bottom.

    AppShell owns settings that affect the entire workspace:

    Sidebar expanded/collapsed
    Sidebar width

    Sidebar owns settings that affect only its internal layout:

    Templates expanded/collapsed
    Templates height

    Resize interactions use Pointer Capture.

    Pointer Capture keeps the drag attached to the resize handle
    even if the pointer moves outside the handle or across the
    Preview iframe.

    Templates resizing also follows our optimized resize pattern:

    dragging
    -> update the DOM directly.

    drag finishes
    -> commit React state once.

    Key concepts:

    Props
    -> AppShell passes Sidebar-wide behavior into this component.

    useLocalStorageState
    -> persists completed Templates preferences.

    useRef
    -> stores DOM references and temporary resize values without
       causing React renders.

    requestAnimationFrame()
    -> limits temporary visual updates to the browser's paint
       cycle.

    Pointer Capture
    -> keeps pointer events attached to the resize handle for the
       complete drag interaction.

    Used by:
    AppShell.jsx

    Uses:
    Button.jsx
    useLocalStorageState.js

    See:
    AppShell.jsx
    -> owns Sidebar width and overall expansion.

    useLocalStorageState.js
    -> persists completed Templates preferences.

    src/styles/app-shell.css
    -> Sidebar and Templates presentation.
*/


// ==============================
// TEMPLATE HEIGHT RULES
// ==============================

const DEFAULT_TEMPLATES_HEIGHT = 180

const MAXIMUM_TEMPLATES_HEIGHT = 360

const MINIMUM_TEMPLATES_HEIGHT = 120


// ==============================
// TEMPLATE STORAGE KEYS
// ==============================

const STORAGE_KEYS = {
    templatesExpanded:
        "visualizerLab.templatesExpanded",

    templatesHeight:
        "visualizerLab.templatesHeight",
}


function Sidebar({
    isExpanded,
    onResizeStart,
    onResizeKeyDown,
    width,
    minimumWidth,
    maximumWidth,
    onToggle,
}) {

    // ==============================
    // RESIZE STATUS
    // ==============================

    /*
        This changes only when the Templates resize interaction
        starts or ends.

        It is not used to store every temporary height during
        the drag.
    */
    const [isTemplatesResizing, setIsTemplatesResizing] =
        useState(false)


    // ==============================
    // PERSISTENT TEMPLATE STATE
    // ==============================

    /*
        These are completed user preferences.

        They survive browser refreshes.
    */
    const [templatesExpanded, setTemplatesExpanded] =
        useLocalStorageState(
            STORAGE_KEYS.templatesExpanded,
            true,
        )

    const [templatesHeight, setTemplatesHeight] =
        useLocalStorageState(
            STORAGE_KEYS.templatesHeight,
            DEFAULT_TEMPLATES_HEIGHT,
        )


    // ==============================
    // DOM REFERENCES
    // ==============================

    /*
        sidebarRef
        -> actual Sidebar DOM element.

        templatesDockRef
        -> actual Templates dock DOM element.

        Directly changing templatesDockRef.style.height lets the
        dock follow the pointer without rendering Sidebar on
        every movement.
    */
    const sidebarRef =
        useRef(null)

    const templatesDockRef =
        useRef(null)


    // ==============================
    // TEMPLATE RESIZE REFERENCES
    // ==============================

    /*
        templatesResizeBoundsRef
        -> geometry captured once when the drag starts.

        templatesResizeValueRef
        -> latest calculated Templates height.

        templatesAnimationFrameRef
        -> currently scheduled browser animation frame.

        pendingTemplatePointerYRef
        -> newest pointer position waiting to be processed.
    */
    const templatesResizeBoundsRef =
        useRef({
            bottom: 0,
            maximumHeight:
                MAXIMUM_TEMPLATES_HEIGHT,
        })

    const templatesResizeValueRef =
        useRef(templatesHeight)

    const templatesAnimationFrameRef =
        useRef(null)

    const pendingTemplatePointerYRef =
        useRef(null)


    const [templatesMaximumHeight, setTemplatesMaximumHeight] =
        useState(MAXIMUM_TEMPLATES_HEIGHT)

    function getTemplatesMaximumHeight() {
        return Math.min(
            MAXIMUM_TEMPLATES_HEIGHT,
            Math.max(
                MINIMUM_TEMPLATES_HEIGHT,
                (sidebarRef.current?.getBoundingClientRect().height ?? 540) - 180,
            ),
        )
    }

    function handleTemplatesResizeFocus() {
        const maximum = getTemplatesMaximumHeight()
        setTemplatesMaximumHeight(maximum)
        // A saved height may exceed the space in a newly shortened window.
        if (templatesHeight > maximum) {
            setTemplatesHeight(maximum)
        }
    }

    function handleTemplatesResizeKeyDown(event) {
        if (isTemplatesResizing) {
            return
        }

        const maximum = getTemplatesMaximumHeight()

        const nextHeight = keyboardResize(event, {
            value: templatesHeight,
            minimum: MINIMUM_TEMPLATES_HEIGHT,
            maximum,
            step: 10,
            increaseKey: "ArrowUp",
            decreaseKey: "ArrowDown",
        })

        if (nextHeight !== null) {
            setTemplatesMaximumHeight(maximum)
            setTemplatesHeight(nextHeight)
        }
    }


    // ==============================
    // TEMPLATE TOGGLE
    // ==============================

    function handleTemplatesToggle() {
        setTemplatesExpanded(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // SIDEBAR WIDTH RESIZE START
    // ==============================

    function handleSidebarResizeStart(event) {

        /*
            Pointer Capture keeps this resize interaction attached
            to the Sidebar resize handle even if the pointer moves
            across other parts of the application.

            This is especially important because Preview contains
            an iframe.

            Without pointer capture, the iframe can interrupt the
            parent's pointermove / pointerup events.

            event.pointerId identifies the specific mouse, pen, or
            touch pointer that started the interaction.
        */
        event.currentTarget.setPointerCapture(
            event.pointerId,
        )


        /*
            AppShell still owns the actual Sidebar width.

            We pass the original pointer event to AppShell so its
            resize logic can start normally.
        */
        onResizeStart(event)
    }


    // ==============================
    // START TEMPLATE RESIZE
    // ==============================

    function handleTemplatesResizeStart(event) {
        const sidebar =
            sidebarRef.current

        if (!sidebar) {
            return
        }

        event.preventDefault()


        /*
            Capture the pointer for the full Templates drag.

            Templates already behaved well because the pointer
            usually stayed inside Sidebar, but using the same
            pointer-capture pattern keeps all Visualizer Lab
            resize interactions consistent.
        */
        event.currentTarget.setPointerCapture(
            event.pointerId,
        )


        const sidebarBounds =
            sidebar.getBoundingClientRect()


        /*
            Templates should never consume the entire Sidebar.

            Reserve approximately 180px for:

            Sidebar header
            Search
            Current Work / Saved Work
        */
        const maximumHeight = getTemplatesMaximumHeight()
        setTemplatesMaximumHeight(Math.max(maximumHeight, templatesHeight))


        /*
            Capture all geometry required by this drag once.

            We do not need getBoundingClientRect() on every
            pointer movement.
        */
        templatesResizeBoundsRef.current = {
            bottom:
                sidebarBounds.bottom,

            maximumHeight,
        }

        templatesResizeValueRef.current =
            templatesHeight

        setIsTemplatesResizing(true)
    }


    // ==============================
    // TEMPLATE VERTICAL RESIZE
    // ==============================

    useEffect(() => {
        if (!isTemplatesResizing) {
            return
        }


        function calculateTemplatesHeight(
            clientY,
        ) {
            const {
                bottom,
                maximumHeight,
            } =
                templatesResizeBoundsRef.current


            /*
                Templates is attached to the bottom of Sidebar.

                bottom
                -
                pointer Y

                gives us the proposed Templates height.
            */
            const newTemplatesHeight =
                bottom - clientY


            return Math.min(
                maximumHeight,
                Math.max(
                    MINIMUM_TEMPLATES_HEIGHT,
                    newTemplatesHeight,
                ),
            )
        }


        function applyTemplatesHeight(
            height,
        ) {
            const templatesDock =
                templatesDockRef.current

            if (!templatesDock) {
                return
            }


            /*
                High-frequency temporary visual update.

                No React setter.
                No localStorage write.
            */
            templatesDock.style.height =
                `${height}px`
        }


        function updateTemplatesResize() {
            templatesAnimationFrameRef.current =
                null

            const clientY =
                pendingTemplatePointerYRef.current

            if (clientY === null) {
                return
            }

            const nextHeight =
                calculateTemplatesHeight(
                    clientY,
                )

            templatesResizeValueRef.current =
                nextHeight

            applyTemplatesHeight(
                nextHeight,
            )

            pendingTemplatePointerYRef.current =
                null
        }


        function handlePointerMove(event) {
            pendingTemplatePointerYRef.current =
                event.clientY

            if (
                templatesAnimationFrameRef.current
                !== null
            ) {
                return
            }

            templatesAnimationFrameRef.current =
                requestAnimationFrame(
                    updateTemplatesResize,
                )
        }


        function finishTemplatesResize(event) {

            /*
                If the browser still has an animation frame
                waiting, cancel it because we are about to apply
                the exact final position ourselves.
            */
            if (
                templatesAnimationFrameRef.current
                !== null
            ) {
                cancelAnimationFrame(
                    templatesAnimationFrameRef.current,
                )

                templatesAnimationFrameRef.current =
                    null
            }


            const finalHeight =
                calculateTemplatesHeight(
                    event.clientY,
                )

            templatesResizeValueRef.current =
                finalHeight

            applyTemplatesHeight(
                finalHeight,
            )


            /*
                Commit once when dragging ends.

                useLocalStorageState then persists the completed
                height.
            */
            setTemplatesHeight(
                finalHeight,
            )

            pendingTemplatePointerYRef.current =
                null

            setIsTemplatesResizing(false)
        }


        window.addEventListener(
            "pointermove",
            handlePointerMove,
        )

        window.addEventListener(
            "pointerup",
            finishTemplatesResize,
        )

        window.addEventListener(
            "pointercancel",
            finishTemplatesResize,
        )


        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove,
            )

            window.removeEventListener(
                "pointerup",
                finishTemplatesResize,
            )

            window.removeEventListener(
                "pointercancel",
                finishTemplatesResize,
            )

            if (
                templatesAnimationFrameRef.current
                !== null
            ) {
                cancelAnimationFrame(
                    templatesAnimationFrameRef.current,
                )

                templatesAnimationFrameRef.current =
                    null
            }
        }
    }, [
        isTemplatesResizing,
        setTemplatesHeight,
    ])


    return (
        <aside
            ref={sidebarRef}
            className={`sidebar ${
                isExpanded
                    ? "sidebar-expanded"
                    : "sidebar-collapsed"
            } ${
                isTemplatesResizing
                    ? "templates-resizing"
                    : ""
            }`}
        >

            {/* ==============================
                SIDEBAR HEADER
                ============================== */}

            <div className="sidebar-header">

                {isExpanded && (
                    <strong>
                        Workspace
                    </strong>
                )}


                {/*
                    This remains a real button even though it is
                    visually styled as a lightweight icon.

                    Styling controls how something looks.

                    HTML semantics control what something is.

                    Using a real button preserves:

                    keyboard focus
                    Enter / Space activation
                    accessibility semantics
                */}
                <Button
                    className="sidebar-toggle"
                    title={
                        isExpanded
                            ? "Collapse Workspace"
                            : "Expand Workspace"
                    }
                    aria-label={
                        isExpanded
                            ? "Collapse Workspace"
                            : "Expand Workspace"
                    }
                    aria-expanded={
                        isExpanded
                    }
                    onClick={onToggle}
                >
                    ☰
                </Button>

            </div>


            {/* ==============================
                COLLAPSED WORKSPACE LABEL
                ============================== */}

            {!isExpanded && (
                <div
                    className="collapsed-sidebar-label"
                    aria-hidden="true"
                >
                    {"Workspace"
                        .split("")
                        .map((character, index) => (
                            <span
                                key={`${character}-${index}`}
                                className="collapsed-sidebar-letter"
                            >
                                {character}
                            </span>
                        ))
                    }
                </div>
            )}


            {/* ==============================
                EXPANDED SIDEBAR CONTENT
                ============================== */}

            {isExpanded && (
                <div className="sidebar-main">

                    {/* ==============================
                        SEARCH
                        ============================== */}

                    <div className="sidebar-search-area">
                        <input
                            id="workspace-search"
                            className="sidebar-search"
                            type="search"
                            placeholder="Search work & templates"
                            aria-label="Search work and templates"
                        />
                    </div>


                    {/* ==============================
                        WORK AREA
                        ============================== */}

                    <div className="sidebar-work-area">

                        <section className="sidebar-section">
                            <h2>
                                Current Work
                            </h2>

                            <div
                                className="current-work sidebar-item"
                                title="Untitled"
                            >
                                Untitled
                            </div>
                        </section>


                        <section className="sidebar-section">
                            <h2>
                                Saved Work
                            </h2>

                            <div className="sidebar-placeholder">
                                No saved work yet.
                            </div>
                        </section>

                    </div>


                    {/* ==============================
                        TEMPLATE DOCK
                        ============================== */}

                    <section
                        ref={templatesDockRef}
                        className={`templates-dock ${
                            templatesExpanded
                                ? "templates-expanded"
                                : "templates-collapsed"
                        }`}
                        style={
                            templatesExpanded
                                ? {
                                    height:
                                        `${templatesHeight}px`,
                                }
                                : undefined
                        }
                    >

                        {/* ==============================
                            TEMPLATE RESIZE HANDLE
                            ============================== */}

                        {templatesExpanded && (
                            <div
                                className="templates-resize-handle"
                                title="Resize Templates"
                                role="separator"
                                aria-label="Templates height"
                                aria-orientation="horizontal"
                                aria-valuemin={MINIMUM_TEMPLATES_HEIGHT}
                                aria-valuemax={templatesMaximumHeight}
                                aria-valuenow={templatesHeight}
                                aria-valuetext={`${templatesHeight} pixels`}
                                tabIndex={0}
                                onFocus={handleTemplatesResizeFocus}
                                onKeyDown={handleTemplatesResizeKeyDown}
                                onPointerDown={
                                    handleTemplatesResizeStart
                                }
                            />
                        )}


                        {/* ==============================
                            TEMPLATE HEADER
                            ============================== */}

                        <div className="templates-header">
                            <strong>
                                Templates
                            </strong>


                            {/*
                                Like the Sidebar hamburger, this
                                stays a semantic button while
                                being styled as a lightweight
                                disclosure control.

                                aria-expanded exposes the current
                                state to accessibility tools.
                            */}
                            <Button
                                className="templates-toggle"
                                title={
                                    templatesExpanded
                                        ? "Minimize Templates"
                                        : "Expand Templates"
                                }
                                aria-label={
                                    templatesExpanded
                                        ? "Minimize Templates"
                                        : "Expand Templates"
                                }
                                aria-expanded={
                                    templatesExpanded
                                }
                                onClick={
                                    handleTemplatesToggle
                                }
                            >
                                {templatesExpanded
                                    ? "▾"
                                    : "▴"}
                            </Button>
                        </div>


                        {/* ==============================
                            TEMPLATE CONTENT
                            ============================== */}

                        {templatesExpanded && (
                            <div className="templates-content">
                                <div className="sidebar-placeholder">
                                    Templates coming soon.
                                </div>
                            </div>
                        )}

                    </section>

                </div>
            )}


            {/* ==============================
                SIDEBAR WIDTH HANDLE
                ============================== */}

            {isExpanded && (
                <div
                    className="sidebar-resize-handle"
                    title="Resize sidebar"
                    role="separator"
                    aria-label="Workspace sidebar width"
                    aria-orientation="vertical"
                    aria-valuemin={minimumWidth}
                    aria-valuemax={maximumWidth}
                    aria-valuenow={width}
                    aria-valuetext={`${width} pixels`}
                    tabIndex={0}
                    onKeyDown={onResizeKeyDown}
                    onPointerDown={
                        handleSidebarResizeStart
                    }
                />
            )}

        </aside>
    )
}

export default Sidebar