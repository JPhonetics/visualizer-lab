import PreviewFrame from "./PreviewFrame.jsx"

// ==============================
// PREVIEW VIEWPORT
// ==============================

/*
    Summary:
    PreviewViewport renders the actual responsive Preview area.

    It is responsible for:

    device width
    zoom presentation
    Preview iframe
    reload key
    attaching the viewport measurement ref

    It does NOT own control state.

    Device and zoom values are passed in through props.

    This allows the exact same rendered viewport to be reused by:

    PreviewPanel
    VisualizedPage

    Key concepts:

    Props
    -> provide current Preview configuration.

    Derived values
    -> device width and zoom sizing are calculated from props.

    Ref forwarding through a prop
    -> previewViewportRef comes from usePreviewSize and is attached
       to the actual DOM element being measured.

    CSS transform
    -> visually scales rendered Preview content.

    React key
    -> changing previewReloadKey recreates PreviewFrame.

    Used by:
    PreviewPanel.jsx

    Future use:
    VisualizedPage.jsx

    Uses:
    PreviewFrame.jsx

    See:
    usePreviewControls.js
    -> supplies device, zoom, and reload state.

    usePreviewSize.js
    -> creates previewViewportRef.

    PreviewToolbar.jsx
    -> controls the state represented here.
*/


function PreviewViewport({
    currentDevice,
    documentContent,
    previewReloadKey,
    previewViewportRef,
    zoom,
}) {

    // ==============================
    // DEVICE WIDTH
    // ==============================

    /*
        Desktop:
        -> 100%

        Tablet:
        -> up to 768px

        Phone:
        -> up to 390px
    */
    const previewViewportStyle = {
        maxWidth: currentDevice.width
            ? `${currentDevice.width}px`
            : "100%",
    }


    // ==============================
    // ZOOM VALUES
    // ==============================

    const previewScale =
        zoom / 100


    /*
        Zoom above 100% needs additional scrollable surface area.

        Zoom below 100% should not shrink the responsive viewport
        itself.
    */
    const previewSurfaceSize =
        Math.max(
            100,
            zoom,
        )


    const previewContentSize =
        previewScale > 1
            ? 100 / previewScale
            : 100


    return (
        <div className="preview-stage">

            {/* ==============================
                RESPONSIVE VIEWPORT
                ============================== */}

            {/*
                This element represents the true responsive
                viewport.

                usePreviewSize measures this exact DOM element.

                Zoom occurs inside it, so zoom does not change the
                responsive width × height readout.
            */}
            <div
                ref={previewViewportRef}
                className={`preview-viewport preview-device-${currentDevice.id}`}
                style={previewViewportStyle}
            >

                {/* ==============================
                    ZOOM SURFACE
                    ============================== */}

                <div
                    className="preview-zoom-surface"
                    style={{
                        height:
                            `${previewSurfaceSize}%`,

                        width:
                            `${previewSurfaceSize}%`,
                    }}
                >

                    {/* ==============================
                        SCALED CONTENT
                        ============================== */}

                    <div
                        className="preview-content"
                        style={{
                            height:
                                `${previewContentSize}%`,

                            transform:
                                `scale(${previewScale})`,

                            transformOrigin:
                                "top left",

                            width:
                                `${previewContentSize}%`,
                        }}
                    >

                        {/* ==============================
                            ISOLATED RUNTIME
                            ============================== */}

                        {/*
                            Changing previewReloadKey changes the
                            React key.

                            React destroys the old PreviewFrame and
                            creates a new iframe.
                        */}
                        <PreviewFrame
                            key={previewReloadKey}
                            documentContent={
                                documentContent
                            }
                        />

                    </div>

                </div>

            </div>

        </div>
    )
}

export default PreviewViewport