import Button from "../../components/ui/Button.jsx"
import DeviceIcon from "./DeviceIcon.jsx"
import ZoomControl from "./ZoomControl.jsx"

// ==============================
// PREVIEW TOOLBAR
// ==============================

/*
    Summary:
    PreviewToolbar renders the reusable controls for interacting
    with a rendered Preview.

    It does NOT own Preview state.

    Instead, its current values and event handlers are supplied
    through props.

    The toolbar supports two presentation contexts:

    panel
    -> used inside the normal PreviewPanel header.

    floating
    -> used by the standalone Visualized page.

    VisualizedPage now places its title and viewport dimensions
    in a separate collapsible header tab above the controls.

    Because of that, showTitle can hide the normal centered title
    group without creating a second toolbar implementation.

    Key concepts:

    Presentational component
    -> receives state and behavior instead of owning them.

    Props
    -> customize controls, content, and presentation.

    Conditional rendering
    -> controls and title sections can be omitted when they do
       not make sense in a particular context.

    Used by:
    PreviewPanel.jsx
    VisualizedPage.jsx

    Uses:
    Button.jsx
    ZoomControl.jsx

    See:
    usePreviewControls.js
    -> owns the state used by these controls.

    usePreviewSize.js
    -> supplies viewport dimensions.

    VisualizedPage.jsx
    -> renders its own Visualized header tab.
*/


function PreviewToolbar({
    currentDevice,
    isCssEnabled,
    isJsEnabled,
    onCollapse,
    onCssToggle,
    onDeviceChange,
    onJsToggle,
    onOpenNewTab,
    onReload,
    onZoomChange,
    previewSize,
    showCollapse = true,
    showOpenNewTab = true,
    showTitle = true,
    title = "Preview",
    variant = "panel",
    zoom,
}) {
    return (
        <div
            className={`preview-header-layout preview-toolbar-${variant}`}
        >

            {/* ==============================
                RENDER CONTROLS
                ============================== */}

            <div className="panel-controls">

                {showCollapse && (
                    <Button
                        className="panel-collapse-button"
                        title="Collapse Preview"
                        aria-label="Collapse Preview"
                        onClick={onCollapse}
                    >
                        ›
                    </Button>
                )}

                <Button
                    className={`preview-toggle ${
                        isCssEnabled
                            ? "active"
                            : ""
                    }`}
                    aria-pressed={isCssEnabled}
                    onClick={onCssToggle}
                >
                    CSS
                </Button>

                <Button
                    className={`preview-toggle ${
                        isJsEnabled
                            ? "active"
                            : ""
                    }`}
                    aria-pressed={isJsEnabled}
                    onClick={onJsToggle}
                >
                    JS
                </Button>

                <Button
                    className="icon-button"
                    title="Reload preview"
                    aria-label="Reload preview"
                    onClick={onReload}
                >
                    ↻
                </Button>

            </div>


            {/* ==============================
                VIEWPORT INFORMATION
                ============================== */}

            {showTitle && (
                <div
                    className="preview-title-group"
                >
                    {title && (
                        <strong className="preview-title">
                            {title}
                        </strong>
                    )}

                    <span
                        className="preview-size"
                        title="Preview viewport size in CSS pixels"
                    >
                        {previewSize.width}
                        {" × "}
                        {previewSize.height}
                    </span>
                </div>
            )}


            {/* ==============================
                VIEW CONTROLS
                ============================== */}

            {/* Announce device changes independently of continuously measured sizes. */}
            <span className="screen-reader-only" role="status" aria-atomic="true">
                {currentDevice.label} preview selected.
                {currentDevice.width
                    ? ` Width capped at ${currentDevice.width} CSS pixels.`
                    : " Width follows available space."}
            </span>

            <div className="panel-controls">

                <Button
                    className="icon-button"
                    title={`${currentDevice.label} preview`}
                    aria-label={`${currentDevice.label} preview. Click to change device.`}
                    onClick={onDeviceChange}
                >
                    <DeviceIcon deviceId={currentDevice.id} />
                </Button>

                <ZoomControl
                    zoom={zoom}
                    onZoomChange={onZoomChange}
                />

                {showOpenNewTab && (
                    <Button
                        className="icon-button"
                        title="Open New Tab"
                        aria-label="Open New Tab"
                        onClick={onOpenNewTab}
                    >
                        ↗
                    </Button>
                )}

            </div>

        </div>
    )
}

export default PreviewToolbar