import {
    useEffect,
    useMemo,
    useState,
} from "react"
import { useSearchParams } from "react-router-dom"

import createPreviewDocument from "../features/preview/previewDocument.js"
import PreviewToolbar from "../features/preview/PreviewToolbar.jsx"
import PreviewViewport from "../features/preview/PreviewViewport.jsx"
import usePreviewControls from "../features/preview/usePreviewControls.js"
import usePreviewSize from "../features/preview/usePreviewSize.js"

import useVisualizedSources from "../features/preview/useVisualizedSources.js"

import "../styles/visualized-page.css"

// ==============================
// VISUALIZED PAGE
// ==============================

/*
    Summary:
    VisualizedPage is the standalone rendered view opened from
    Preview's Open New Tab control.

    The rendered Preview occupies the entire browser viewport.

    A compact floating control area sits near the bottom of the
    page.

    Above that control area is a Visualized tab.

    Clicking the Visualized tab:

    expanded
    -> hides the controls.

    collapsed
    -> shows only the rounded Visualized tab.

    Clicking it again restores the controls.

    The title tab always remains visible.

    Key concepts:

    Local UI state
    -> isControlsExpanded only affects this page instance.

    Conditional rendering
    -> the control bar is only rendered when expanded.

    Overlay UI
    -> controls float above the Preview and do not consume layout
       space.

    Used by:
    App.jsx

    Route:
    /frontend/visualized

    Uses:
    previewDocument.js
    PreviewToolbar.jsx
    PreviewViewport.jsx
    usePreviewControls.js
    usePreviewSize.js

    See:
    PreviewPanel.jsx
    -> opens this standalone page.
*/


function VisualizedPage() {

    // ==============================
    // URL SETTINGS
    // ==============================

    const [searchParams] =
        useSearchParams()


    // ==============================
    // CONTROL BAR VISIBILITY
    // ==============================

    /*
        This state is intentionally NOT persisted.

        Every newly opened Visualized page begins with the controls
        visible.

        The user can then collapse them when they want an
        unobstructed view.
    */
    const [
        isControlsExpanded,
        setIsControlsExpanded,
    ] = useState(true)


    // ==============================
    // INITIAL PREVIEW SETTINGS
    // ==============================

    const initialIsCssEnabled =
        searchParams.get("css")
        !== "false"

    const initialIsJsEnabled =
        searchParams.get("js")
        !== "false"

    const initialDeviceId =
        searchParams.get("device")
        ?? "desktop"

    const initialZoom =
        searchParams.get("zoom")
        ?? 100


    // ==============================
    // PREVIEW CONTROLS
    // ==============================

    const {
        currentDevice,
        handleCssToggle,
        handleDeviceChange,
        handleJsToggle,
        handlePreviewReload,
        isCssEnabled,
        isJsEnabled,
        previewReloadKey,
        setZoom,
        zoom,
    } = usePreviewControls({
        initialDeviceId,
        initialIsCssEnabled,
        initialIsJsEnabled,
        initialZoom,
    })


    const snapshot = useVisualizedSources(searchParams.get("snapshot"))
    const documentContent = useMemo(() => createPreviewDocument(snapshot.sources ?? {}, {
        isCssEnabled,
        isJsEnabled,
    }), [snapshot.sources, isCssEnabled, isJsEnabled])


    // ==============================
    // LIVE PREVIEW SIZE
    // ==============================

    const {
        previewSize,
        previewViewportRef,
    } = usePreviewSize()


    // ==============================
    // TOGGLE CONTROL BAR
    // ==============================

    function handleControlsToggle() {
        setIsControlsExpanded(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // BROWSER TAB TITLE
    // ==============================

    useEffect(() => {
        document.title =
            "Visualized - Visualizer Lab"
    }, [])


    return (
        <main className="visualized-page">

            {/* ==============================
                FULL-PAGE PREVIEW
                ============================== */}

            <div className="visualized-preview-area">
                {snapshot.status === "empty" && (
                    <p className="visualized-source-note">Open this view from the workspace to preview your code.</p>
                )}
                {snapshot.status === "unavailable" && (
                    <p className="visualized-source-note" role="alert">
                        This preview snapshot is unavailable. Reopen it from the workspace.
                    </p>
                )}
                <PreviewViewport
                    currentDevice={currentDevice}
                    isJsEnabled={isJsEnabled}
                    documentContent={
                        documentContent
                    }
                    previewReloadKey={
                        previewReloadKey
                    }
                    previewViewportRef={
                        previewViewportRef
                    }
                    zoom={zoom}
                />
            </div>


            {/* ==============================
                FLOATING VISUALIZED CONTROLS
                ============================== */}

            <div
                className={`visualized-control-dock ${
                    isControlsExpanded
                        ? "expanded"
                        : "collapsed"
                }`}
            >

                {/* ==============================
                    VISUALIZED TAB
                    ============================== */}

                {/*
                    When expanded:
                    -> the tab only shows "Visualized".
                    -> the pixel dimensions live inside PreviewToolbar.

                    When collapsed:
                    -> PreviewToolbar is hidden.
                    -> the dimensions move into this tab so viewport
                    information remains visible.
                */}
                <button
                    className="visualized-tab"
                    type="button"
                    aria-expanded={isControlsExpanded}
                    onClick={handleControlsToggle}
                >
                    <span className="visualized-tab-title">
                        Visualized
                    </span>

                    {!isControlsExpanded && (
                        <span className="visualized-tab-size">
                            {previewSize.width}
                            {" × "}
                            {previewSize.height}
                        </span>
                    )}
                </button>


                {/* ==============================
                    CONTROL BAR
                    ============================== */}

                {isControlsExpanded && (
                    <div className="visualized-toolbar-shell">
                        <PreviewToolbar
                            currentDevice={currentDevice}
                            isCssEnabled={isCssEnabled}
                            isJsEnabled={isJsEnabled}
                            onCssToggle={handleCssToggle}
                            onDeviceChange={handleDeviceChange}
                            onJsToggle={handleJsToggle}
                            onReload={handlePreviewReload}
                            onZoomChange={setZoom}
                            previewSize={previewSize}
                            showCollapse={false}
                            showOpenNewTab={false}
                            showTitle={true}
                            title=""
                            variant="floating"
                            zoom={zoom}
                        />
                    </div>
                )}

            </div>

        </main>
    )
}

export default VisualizedPage