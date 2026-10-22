import { useEffect, useRef, useState } from "react"

import Button from "../../components/ui/Button.jsx"

// ==============================
// ZOOM CONTROL
// ==============================

// Summary:
// ZoomControl provides the magnifying-glass button and compact
// popup used to change Preview magnification.
//
// The popup contains:
//
// current zoom value
// editable numeric zoom
// range slider
// minimum / maximum values
// Reset to 100 button
//
// The current value has two visual states:
//
// Not editing:
// -> 100%
//
// Editing:
// -> 100
//
// The percentage symbol is presentation only.
//
// The user never needs to type, delete, or manage the % symbol.
//
// Key concepts:
//
// Props
// -> values or functions passed into a component by its parent.
//
// Local state
// -> tracks behavior that belongs only to ZoomControl.
//
// Controlled input
// -> React decides what value appears inside the input.
//
// Derived value
// -> displayedZoomValue is calculated from existing state
//    instead of being stored separately.
//
// useRef
// -> gives us access to the ZoomControl DOM element.
//
// useEffect
// -> synchronizes the editable value with Preview zoom and
//    temporarily adds browser event listeners while the popup
//    is open.
//
// Used by:
// PreviewPanel.jsx
//
// Uses:
// Button.jsx
//
// See:
// PreviewPanel.jsx
// -> owns the actual Preview zoom state.
// -> passes zoom and setZoom into this component.
//
// src/styles/app-shell.css
// -> .zoom-control
// -> .zoom-popup
// -> .zoom-value-input
// -> .zoom-slider-row
// -> .zoom-slider
// -> .zoom-limit
// -> .zoom-reset


// ==============================
// ZOOM LIMITS
// ==============================

// These constants define the zoom range available to the user.
//
// Keeping these values in one place prevents us from repeating
// "magic numbers" throughout the component.
//
// If we later decide to support a different range:
//
// 25 - 300
//
// for example, we know exactly where that rule is defined.

const MAXIMUM_ZOOM = 200
const MINIMUM_ZOOM = 50


function ZoomControl({
    onZoomChange,
    zoom,
}) {

    // ==============================
    // POPUP STATE
    // ==============================

    // isOpen controls whether the Zoom popup is currently shown.
    //
    // false:
    // -> only the magnifying-glass button is visible.
    //
    // true:
    // -> the Zoom popup is visible.

    const [isOpen, setIsOpen] = useState(false)


    // ==============================
    // EDITING STATE
    // ==============================

    // isEditing tells us whether the user is actively editing
    // the zoom value.
    //
    // false:
    // -> display "100%"
    //
    // true:
    // -> display "100"
    //
    // The actual Preview zoom remains numeric in both cases.

    const [isEditing, setIsEditing] = useState(false)


    // ==============================
    // TEMPORARY INPUT VALUE
    // ==============================

    // zoomInput stores the temporary value being typed.
    //
    // This is intentionally separate from the real zoom prop.
    //
    // Example:
    //
    // The user wants to type:
    //
    // 125
    //
    // During typing, the input briefly contains:
    //
    // 1
    // 12
    // 125
    //
    // If we immediately validated every partial value, typing
    // "1" could instantly clamp the field to our minimum of 50.
    //
    // Keeping a temporary string allows the user to finish
    // typing before we validate and apply the value.

    const [zoomInput, setZoomInput] = useState(
        String(zoom),
    )


    // ==============================
    // ZOOM CONTROL DOM REFERENCE
    // ==============================

    // useRef creates an object that React keeps between renders.
    //
    // After React renders:
    //
    // ref={zoomControlRef}
    //
    // zoomControlRef.current points to the actual DOM element.
    //
    // We use that reference to determine whether a pointer click
    // happened inside or outside ZoomControl.

    const zoomControlRef = useRef(null)


    // ==============================
    // SYNCHRONIZE INPUT WITH ZOOM
    // ==============================

    // The real zoom value belongs to PreviewPanel.
    //
    // Zoom can change without the editable field being used.
    //
    // Examples:
    //
    // slider movement
    // Reset to 100
    // future keyboard shortcut
    //
    // Whenever zoom changes, keep zoomInput synchronized.

    useEffect(() => {
        setZoomInput(String(zoom))
    }, [zoom])


    // ==============================
    // CLOSE POPUP FROM OUTSIDE
    // ==============================

    // This effect only installs browser event listeners while
    // the popup is open.
    //
    // We listen on document because a click outside ZoomControl
    // would never reach an event listener attached only to the
    // Zoom popup itself.

    useEffect(() => {
        if (!isOpen) {
            return
        }


        // ==============================
        // OUTSIDE POINTER CLICK
        // ==============================

        function handleDocumentPointerDown(event) {
            const zoomControl = zoomControlRef.current

            // React refs begin as null before the DOM element has
            // been attached.
            //
            // If the element is unavailable, there is nothing
            // useful for us to check.

            if (!zoomControl) {
                return
            }


            // .contains() is a browser DOM method.
            //
            // It checks whether event.target exists somewhere
            // inside the ZoomControl element.
            //
            // If the user clicked:
            //
            // the zoom button
            // the value field
            // the slider
            // the reset button
            //
            // then event.target is still inside ZoomControl and
            // the popup should remain open.

            if (zoomControl.contains(event.target)) {
                return
            }


            // Anything else counts as an outside click.

            setIsEditing(false)
            setIsOpen(false)
        }


        // ==============================
        // ESCAPE KEY
        // ==============================

        function handleDocumentKeyDown(event) {

            // Escape is a familiar keyboard shortcut for closing
            // temporary UI such as:
            //
            // menus
            // popups
            // dialogs

            if (event.key === "Escape") {
                setIsEditing(false)

                // Restore the last valid zoom in case the user
                // was halfway through typing something.

                setZoomInput(String(zoom))

                setIsOpen(false)
            }
        }


        // ==============================
        // ADD BROWSER EVENT LISTENERS
        // ==============================

        document.addEventListener(
            "pointerdown",
            handleDocumentPointerDown,
        )

        document.addEventListener(
            "keydown",
            handleDocumentKeyDown,
        )


        // ==============================
        // EFFECT CLEANUP
        // ==============================

        // A useEffect can return a cleanup function.
        //
        // React runs it before this effect is replaced or when
        // the component disappears.
        //
        // Removing browser listeners is important.
        //
        // Without cleanup, reopening the popup repeatedly could
        // leave multiple copies of the listeners attached.

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleDocumentPointerDown,
            )

            document.removeEventListener(
                "keydown",
                handleDocumentKeyDown,
            )
        }
    }, [
        isOpen,
        zoom,
    ])


    // ==============================
    // CLAMP ZOOM
    // ==============================

    // "Clamp" means forcing a number to stay inside an allowed
    // range.
    //
    // Our range is:
    //
    // 50 - 200
    //
    // Examples:
    //
    // 25
    // -> 50
    //
    // 125
    // -> 125
    //
    // 300
    // -> 200
    //
    // Math.max()
    // -> protects the minimum.
    //
    // Math.min()
    // -> protects the maximum.

    function clampZoom(value) {
        return Math.min(
            MAXIMUM_ZOOM,
            Math.max(MINIMUM_ZOOM, value),
        )
    }


    // ==============================
    // APPLY EDITED VALUE
    // ==============================

    // zoomInput is stored as text while the user is editing.
    //
    // Before changing the actual Preview zoom, we:
    //
    // 1. make sure the input is not empty
    // 2. convert it to a number
    // 3. verify that number is valid
    // 4. round it to a whole percentage
    // 5. clamp it between 50 and 200
    // 6. send it back to PreviewPanel

    function applyZoomInput() {

        // An empty string should return to the current zoom.
        //
        // We do not want:
        //
        // ""
        //
        // to accidentally become:
        //
        // 0
        //
        // and then clamp to 50.

        if (zoomInput.trim() === "") {
            setZoomInput(String(zoom))

            return
        }


        // Number() converts the text value into a JavaScript
        // number.
        //
        // Example:
        //
        // "125"
        // -> 125

        const parsedZoom = Number(zoomInput)


        // Number.isFinite() protects us from invalid numeric
        // values such as:
        //
        // NaN
        // Infinity

        if (!Number.isFinite(parsedZoom)) {
            setZoomInput(String(zoom))

            return
        }


        // Math.round() keeps zoom percentages as whole numbers.
        //
        // clampZoom() then guarantees the final value stays
        // inside our allowed range.

        const limitedZoom = clampZoom(
            Math.round(parsedZoom),
        )


        // Update the temporary field immediately.

        setZoomInput(String(limitedZoom))


        // onZoomChange was passed into ZoomControl by
        // PreviewPanel.
        //
        // Calling it sends the new zoom value back to the parent.

        onZoomChange(limitedZoom)
    }


    // ==============================
    // INPUT FOCUS
    // ==============================

    function handleZoomInputFocus(event) {

        // The idle field displays:
        //
        // 100%
        //
        // Once editing begins, switch it to:
        //
        // 100
        //
        // so the user only edits the numeric portion.

        setIsEditing(true)

        setZoomInput(String(zoom))


        // select() highlights the entire value.
        //
        // This allows the user to click:
        //
        // 100%
        //
        // and immediately type:
        //
        // 125
        //
        // without manually deleting the previous value.

        event.currentTarget.select()
    }


    // ==============================
    // INPUT BLUR
    // ==============================

    // "Blur" means the input lost keyboard focus.
    //
    // Examples:
    //
    // clicking somewhere else
    // pressing Enter and calling .blur()
    //
    // When editing finishes:
    //
    // 1. validate/apply the number
    // 2. leave editing mode
    //
    // The field then goes back to showing:
    //
    // 100%

    function handleZoomInputBlur() {
        applyZoomInput()

        setIsEditing(false)
    }


    // ==============================
    // INPUT CHANGE
    // ==============================

    function handleZoomInputChange(event) {

        // event.target
        // -> the input that triggered this event.
        //
        // event.target.value
        // -> the current text inside the input.


        // /\D/g is a regular expression.
        //
        // \D
        // -> matches anything that is NOT a digit.
        //
        // g
        // -> means search globally instead of stopping after
        //    the first match.
        //
        // replace(/\D/g, "")
        // -> removes any non-numeric characters.
        //
        // We can therefore use:
        //
        // type="text"
        //
        // for displaying "100%" while still limiting editing to
        // numeric characters.

        const numericValue =
            event.target.value.replace(/\D/g, "")

        setZoomInput(numericValue)
    }


    // ==============================
    // INPUT KEYBOARD
    // ==============================

    function handleZoomInputKeyDown(event) {

        // Pressing Enter finishes editing.
        //
        // blur() removes focus from the input.
        //
        // That automatically triggers:
        //
        // handleZoomInputBlur()
        //
        // which validates and applies the value.

        if (event.key === "Enter") {
            event.currentTarget.blur()
        }
    }


    // ==============================
    // SLIDER CHANGE
    // ==============================

    function handleSliderChange(event) {

        // HTML range inputs return their value as a string.
        //
        // Number() converts that string to a number before we
        // send it to PreviewPanel.

        const newZoom = clampZoom(
            Number(event.target.value),
        )

        onZoomChange(newZoom)
    }


    // ==============================
    // RESET ZOOM
    // ==============================

    // Reset returns magnification to Visualizer Lab's default:
    //
    // 100%
    //
    // ZoomControl does not own the real zoom state.
    //
    // PreviewPanel does.
    //
    // So we ask the parent to update zoom by calling:
    //
    // onZoomChange(100)
    //
    // The slider and editable field then update automatically
    // because both already depend on the zoom prop.

    function handleZoomReset() {
        onZoomChange(100)
    }


    // ==============================
    // POPUP TOGGLE
    // ==============================

    function handleZoomToggle() {

        // The callback form of setState is useful when the new
        // value depends on the previous value.
        //
        // true
        // -> false
        //
        // false
        // -> true

        setIsOpen(
            (currentState) => !currentState,
        )
    }


    // ==============================
    // DISPLAYED ZOOM VALUE
    // ==============================

    // displayedZoomValue is a derived value.
    //
    // We do not need another useState because it can always be
    // calculated from existing values.
    //
    // While editing:
    //
    // 100
    //
    // Not editing:
    //
    // 100%

    const displayedZoomValue = isEditing
        ? zoomInput
        : `${zoom}%`


    return (
        <div
            ref={zoomControlRef}
            className="zoom-control"
        >

            {/* ==============================
                ZOOM BUTTON
                ============================== */}

            <Button
                className="icon-button"
                title="Preview zoom"
                aria-label="Preview zoom"
                aria-expanded={isOpen}
                onClick={handleZoomToggle}
            >
                🔍
            </Button>


            {/* ==============================
                ZOOM POPUP
                ============================== */}

            {/* 
                Conditional rendering:

                isOpen && (...)

                means React only creates the popup while
                isOpen is true.
            */}
            {isOpen && (
                <div className="zoom-popup">

                    {/* ==============================
                        CURRENT ZOOM
                        ============================== */}

                    {/* 
                        We intentionally use:

                        type="text"

                        instead of:

                        type="number"

                        because a number input cannot display:

                        100%

                        inputMode="numeric" still tells compatible
                        devices that numeric input is expected.

                        The value stays centered in BOTH states:

                        100%
                        100
                    */}
                    <input
                        className="zoom-value-input"
                        type="text"
                        inputMode="numeric"
                        value={displayedZoomValue}
                        aria-label="Preview zoom percentage"
                        onBlur={handleZoomInputBlur}
                        onChange={handleZoomInputChange}
                        onFocus={handleZoomInputFocus}
                        onKeyDown={handleZoomInputKeyDown}
                    />


                    {/* ==============================
                        ZOOM SLIDER
                        ============================== */}

                    <div className="zoom-slider-row">

                        {/* 
                            The limits intentionally do not display
                            percentage symbols.

                            The Zoom popup already establishes that
                            these values represent percentages.

                            Keeping them as:

                            50
                            200

                            makes the control visually cleaner.
                        */}
                        <span className="zoom-limit">
                            {MINIMUM_ZOOM}
                        </span>

                        <input
                            className="zoom-slider"
                            type="range"
                            min={MINIMUM_ZOOM}
                            max={MAXIMUM_ZOOM}
                            step="1"
                            value={zoom}
                            aria-label="Preview zoom"
                            onChange={handleSliderChange}
                        />

                        <span className="zoom-limit">
                            {MAXIMUM_ZOOM}
                        </span>

                    </div>


                    {/* ==============================
                        RESET ZOOM
                        ============================== */}

                    {/* 
                        Reset is still a real <button> for accessibility and
                        keyboard interaction.

                        We style it like a lightweight text action because resetting
                        Zoom is useful, but it should not visually compete with the
                        slider or editable value.

                        disabled becomes true while Zoom is already at 100%.
                    */}
                    <Button
                        className="zoom-reset"
                        disabled={zoom === 100}
                        onClick={handleZoomReset}
                    >
                        Reset to 100
                    </Button>

                </div>
            )}

        </div>
    )
}

export default ZoomControl