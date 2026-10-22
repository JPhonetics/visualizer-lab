// ==============================
// WORKSPACE DIVIDER
// ==============================

/*
    Summary:
    WorkspaceDivider is the draggable boundary between Editor
    and Preview.

    It does not own either panel's size.

    AppShell owns the shared layout state and performs the resize
    calculations.

    When Editor or Preview is collapsed, AppShell disables this
    divider because the collapsed panel should be restored before
    resizing resumes.

    Key concepts:

    Pointer Events
    -> provide one interaction model for mouse, pen, and touch.

    Pointer Capture
    -> keeps the drag attached to this divider even when the
       pointer crosses Preview's iframe.

    Props
    -> AppShell supplies both resize behavior and whether resizing
       is currently allowed.

    Used by:
    AppShell.jsx

    Uses:
    Browser Pointer Events API

    See:
    AppShell.jsx
    -> performs Editor / Preview resize calculations.

    CollapsedPanelRail.jsx
    -> restores a collapsed panel before resizing resumes.
*/


function WorkspaceDivider({
    isDisabled = false,
    onResizeStart,
}) {

    // ==============================
    // START RESIZE
    // ==============================

    function handlePointerDown(event) {

        /*
            A collapsed workspace is intentionally not resizable.

            The user restores the collapsed panel using its rail
            first.
        */
        if (isDisabled) {
            return
        }


        /*
            Pointer Capture keeps this resize alive even when the
            pointer moves over Preview's iframe.

            Without this, the iframe can interrupt pointermove or
            pointerup and make the divider appear stuck.
        */
        event.currentTarget.setPointerCapture(
            event.pointerId,
        )

        onResizeStart(event)
    }


    return (
        <div
            className={`workspace-divider ${
                isDisabled
                    ? "workspace-divider-disabled"
                    : ""
            }`}
            title={
                isDisabled
                    ? undefined
                    : "Resize panels"
            }
            onPointerDown={
                handlePointerDown
            }
        />
    )
}

export default WorkspaceDivider