import { useState } from "react"

// ==============================
// PREVIEW CONTROLS HOOK
// ==============================

/*
    Summary:
    usePreviewControls owns reusable Preview state and behavior.

    It is a custom React hook.

    React does NOT provide this hook built in.

    The hook owns:

    CSS enabled state
    JavaScript enabled state
    device mode
    zoom
    iframe reload state

    It can also receive initial values.

    That allows PreviewPanel to use normal defaults while a
    VisualizedPage opened in a new tab can begin with the same
    Preview configuration as the original tab.

    Key concepts:

    Custom hook
    -> reusable state and behavior without rendering UI.

    Initial values
    -> let different callers begin with different state.

    Lazy initialization
    -> calculates initial state only when React first creates it.

    Derived value
    -> currentDevice comes from deviceIndex rather than being
       stored as duplicate state.

    Used by:
    PreviewPanel.jsx
    VisualizedPage.jsx

    See:
    PreviewToolbar.jsx
    -> displays controls backed by this hook.

    PreviewViewport.jsx
    -> consumes device, zoom, and reload values.
*/


// ==============================
// DEVICE MODES
// ==============================

const DEVICE_MODES = [
    {
        icon: "🖥",
        id: "desktop",
        label: "Desktop",
        width: null,
    },
    {
        icon: "▯",
        id: "tablet",
        label: "Tablet",
        width: 768,
    },
    {
        icon: "📱",
        id: "phone",
        label: "Phone",
        width: 390,
    },
]


// ==============================
// ZOOM LIMITS
// ==============================

const MAXIMUM_ZOOM = 200

const MINIMUM_ZOOM = 50


// ==============================
// DEVICE LOOKUP
// ==============================

/*
    Finds the array index matching a device ID.

    If the supplied ID is invalid, fall back to Desktop.

    This keeps malformed URL values from breaking Preview.
*/
function getDeviceIndex(deviceId) {
    const matchingIndex =
        DEVICE_MODES.findIndex(
            (device) =>
                device.id === deviceId,
        )

    return matchingIndex >= 0
        ? matchingIndex
        : 0
}


// ==============================
// ZOOM VALIDATION
// ==============================

function getValidZoom(zoom) {
    const numericZoom =
        Number(zoom)

    if (!Number.isFinite(numericZoom)) {
        return 100
    }

    return Math.min(
        MAXIMUM_ZOOM,
        Math.max(
            MINIMUM_ZOOM,
            Math.round(numericZoom),
        ),
    )
}


function usePreviewControls({
    initialDeviceId = "desktop",
    initialIsCssEnabled = true,
    initialIsJsEnabled = true,
    initialZoom = 100,
} = {}) {

    // ==============================
    // RENDER LAYERS
    // ==============================

    const [isCssEnabled, setIsCssEnabled] =
        useState(
            initialIsCssEnabled,
        )

    const [isJsEnabled, setIsJsEnabled] =
        useState(
            initialIsJsEnabled,
        )


    // ==============================
    // DEVICE MODE
    // ==============================

    /*
        Passing a function to useState creates a lazy initializer.

        React only needs to search DEVICE_MODES when this state is
        first created.
    */
    const [deviceIndex, setDeviceIndex] =
        useState(() =>
            getDeviceIndex(
                initialDeviceId,
            ),
        )


    // ==============================
    // RELOAD KEY
    // ==============================

    const [previewReloadKey, setPreviewReloadKey] =
        useState(0)


    // ==============================
    // ZOOM
    // ==============================

    const [zoom, setZoom] =
        useState(() =>
            getValidZoom(
                initialZoom,
            ),
        )


    // ==============================
    // CURRENT DEVICE
    // ==============================

    const currentDevice =
        DEVICE_MODES[deviceIndex]


    // ==============================
    // CSS TOGGLE
    // ==============================

    function handleCssToggle() {
        setIsCssEnabled(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // JAVASCRIPT TOGGLE
    // ==============================

    function handleJsToggle() {
        setIsJsEnabled(
            (currentState) =>
                !currentState,
        )
    }


    // ==============================
    // DEVICE CHANGE
    // ==============================

    function handleDeviceChange() {
        setDeviceIndex(
            (currentIndex) =>
                (currentIndex + 1)
                % DEVICE_MODES.length,
        )
    }


    // ==============================
    // RELOAD PREVIEW
    // ==============================

    function handlePreviewReload() {
        setPreviewReloadKey(
            (currentKey) =>
                currentKey + 1,
        )
    }


    return {
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
    }
}

export default usePreviewControls