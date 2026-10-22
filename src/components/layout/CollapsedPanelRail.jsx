import Button from "../ui/Button.jsx"

// ==============================
// COLLAPSED PANEL RAIL
// ==============================

/*
    Summary:
    CollapsedPanelRail represents an Editor or Preview panel that
    has been collapsed but should remain visible in the workspace.

    The rail shows:

    an expand arrow
    the panel name stacked vertically

    The entire rail is clickable.

    We intentionally stack individual letters instead of rotating
    the full word.

    That keeps labels such as:

    Editor
    Preview

    readable without requiring the user to turn their head.

    Key concepts:

    Reusable component
    -> Editor and Preview use one shared rail implementation.

    Props
    -> customize the label, expansion direction, and behavior.

    Array.map()
    -> converts each character in the label into its own span.

    Semantic button
    -> the entire rail remains keyboard accessible.

    Used by:
    AppShell.jsx

    Uses:
    Button.jsx

    See:
    AppShell.jsx
    -> decides when this rail replaces EditorPanel or
       PreviewPanel.

    src/styles/app-shell.css
    -> controls rail width and stacked-letter presentation.
*/


function CollapsedPanelRail({
    expandDirection,
    label,
    onExpand,
}) {

    // ==============================
    // EXPAND ARROW
    // ==============================

    /*
        The arrow points in the direction the panel will expand.

        Editor:
        -> expands right
        -> ›

        Preview:
        -> expands left
        -> ‹
    */
    const expandIcon =
        expandDirection === "right"
            ? "›"
            : "‹"


    return (
        <Button
            className="collapsed-panel-rail"
            title={`Expand ${label}`}
            aria-label={`Expand ${label}`}
            onClick={onExpand}
        >

            {/* ==============================
                EXPAND ARROW
                ============================== */}

            <span
                className="collapsed-panel-arrow"
                aria-hidden="true"
            >
                {expandIcon}
            </span>


            {/* ==============================
                STACKED PANEL LABEL
                ============================== */}

            {/*
                split("")
                -> converts a string into individual characters.

                Example:

                "Editor"

                becomes:

                ["E", "d", "i", "t", "o", "r"]

                map()
                -> creates one <span> for each character.

                The surrounding label is hidden from assistive
                technology because the parent Button already has
                a complete aria-label such as:

                "Expand Editor"
            */}
            <span
                className="collapsed-panel-label"
                aria-hidden="true"
            >
                {label
                    .split("")
                    .map((character, index) => (
                        <span
                            key={`${character}-${index}`}
                            className="collapsed-panel-letter"
                        >
                            {character}
                        </span>
                    ))
                }
            </span>

        </Button>
    )
}

export default CollapsedPanelRail