import { useHref } from "react-router-dom"

import Panel from "./Panel.jsx"
import PREVIEW_DOCUMENT from "../../features/preview/previewDocument.js"
import PreviewToolbar from "../../features/preview/PreviewToolbar.jsx"
import PreviewViewport from "../../features/preview/PreviewViewport.jsx"
import usePreviewControls from "../../features/preview/usePreviewControls.js"
import usePreviewSize from "../../features/preview/usePreviewSize.js"

// ==============================
// PREVIEW PANEL
// ==============================

/*
    Summary:
    PreviewPanel places the reusable Preview feature inside the
    main Visualizer Lab workspace.

    Most Preview behavior now lives in reusable feature files:

    usePreviewControls
    -> CSS / JS / device / zoom / reload state.

    usePreviewSize
    -> live responsive viewport measurement.

    PreviewToolbar
    -> controls and dimension readout.

    PreviewViewport
    -> device sizing, zoom, and iframe presentation.

    PreviewPanel is responsible primarily for composition and for
    behavior specific to the main application workspace:

    Collapse Preview
    Open Visualized in a new tab

    Key concepts:

    Composition
    -> combines smaller focused components and hooks.

    useHref
    -> asks React Router to build the correct URL for a route.

    URLSearchParams
    -> encodes the current Preview configuration into the new
       Visualized tab's URL.

    window.open()
    -> opens that route in a separate browser tab.

    Used by:
    AppShell.jsx

    Uses:
    Panel.jsx
    previewDocument.js
    PreviewToolbar.jsx
    PreviewViewport.jsx
    usePreviewControls.js
    usePreviewSize.js

    See:
    VisualizedPage.jsx
    -> reads the settings supplied in the URL and displays the
       standalone Preview.
*/


function PreviewPanel({
    onCollapse,
}) {

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
    } = usePreviewControls()


    // ==============================
    // PREVIEW DIMENSIONS
    // ==============================

    const {
        previewSize,
        previewViewportRef,
    } = usePreviewSize()


    // ==============================
    // VISUALIZED URL
    // ==============================

    /*
        URLSearchParams converts the current Preview configuration
        into a standard query string.

        Example:

        ?device=tablet&zoom=125&css=true&js=false

        This lets the new browser tab recreate the same initial
        viewing configuration without sharing React state between
        two browser tabs.
    */
    const visualizedSearch =
        new URLSearchParams({
            css:
                String(isCssEnabled),

            device:
                currentDevice.id,

            js:
                String(isJsEnabled),

            zoom:
                String(zoom),
        })


    /*
        useHref() lets React Router build the route URL using the
        application router.
    */
    const visualizedHref =
        useHref({
            pathname:
                "/frontend/visualized",

            search:
                `?${visualizedSearch.toString()}`,
        })


    // ==============================
    // OPEN NEW TAB
    // ==============================

    function handleOpenNewTab() {

        /*
            noopener
            -> prevents the new page from controlling the opener
               through window.opener.

            noreferrer
            -> also removes referrer information.

            The new tab is still the same Visualizer Lab app; it
            simply starts at the Visualized route.
        */
        window.open(
            visualizedHref,
            "_blank",
            "noopener,noreferrer",
        )
    }


    // ==============================
    // PREVIEW HEADER
    // ==============================

    const previewHeader = (
        <PreviewToolbar
            currentDevice={currentDevice}
            isCssEnabled={isCssEnabled}
            isJsEnabled={isJsEnabled}
            onCollapse={onCollapse}
            onCssToggle={handleCssToggle}
            onDeviceChange={handleDeviceChange}
            onJsToggle={handleJsToggle}
            onOpenNewTab={handleOpenNewTab}
            onReload={handlePreviewReload}
            onZoomChange={setZoom}
            previewSize={previewSize}
            zoom={zoom}
        />
    )


    return (
        <Panel
            header={previewHeader}
            className="preview-panel"
        >
            <PreviewViewport
                currentDevice={currentDevice}
                documentContent={
                    PREVIEW_DOCUMENT
                }
                previewReloadKey={
                    previewReloadKey
                }
                previewViewportRef={
                    previewViewportRef
                }
                zoom={zoom}
            />
        </Panel>
    )
}

export default PreviewPanel