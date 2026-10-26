// ==============================
// SHARED BUTTON
// ==============================

// Summary:
// Button is Visualizer Lab's reusable wrapper around the native
// HTML <button> element.
//
// Instead of rebuilding the same button structure throughout
// the application, components use this shared component and
// customize it through props.
//
// Key concepts:
//
// Props
// -> values or functions passed into a component by its parent.
//
// children
// -> a special React prop containing whatever is placed between
//    <Button> and </Button>.
//
// Rest properties (...props)
// -> collects any additional button properties so they can be
//    forwarded to the native HTML <button>.
//
// Default values
// -> className, type, and variant receive fallback values when
//    the parent does not provide them.
//
// Used by:
// TopBar.jsx
// Sidebar.jsx
// EditorPanel.jsx
// PreviewPanel.jsx
// ThemeControl.jsx
// ZoomControl.jsx
//
// Uses:
// Native HTML <button>
//
// See:
// src/styles/app-shell.css
// -> .button
// -> .button-accent
// -> .icon-button


function Button({
    children,
    className = "",
    type = "button",
    variant = "default",
    ...props
}) {

    // ==============================
    // PROPS DESTRUCTURING
    // ==============================

    // The function parameter above uses object destructuring.
    //
    // React normally gives a component one props object:
    //
    // function Button(props) {
    //     props.children
    //     props.className
    // }
    //
    // Destructuring lets us pull the properties we need directly:
    //
    // {
    //     children,
    //     className,
    //     type,
    //     variant
    // }
    //
    // This keeps the component easier to read.


    // ==============================
    // DEFAULT PROP VALUES
    // ==============================

    // className = ""
    // -> prevents an undefined class from being added when a
    //    component does not need extra styling.
    //
    // type = "button"
    // -> prevents buttons from accidentally submitting a form.
    //
    // Native HTML buttons inside a <form> default to:
    //
    // type="submit"
    //
    // Since most Visualizer Lab buttons are interface controls,
    // "button" is the safer default.
    //
    // variant = "default"
    // -> gives every button a predictable visual variant unless
    //    another one is requested.


    // ==============================
    // REST PROPERTIES
    // ==============================

    // ...props collects everything that was passed to Button
    // that we did not explicitly destructure.
    //
    // Examples:
    //
    // onClick
    // title
    // disabled
    // aria-label
    // aria-expanded
    // aria-selected
    // aria-pressed
    //
    // Later:
    //
    // {...props}
    //
    // spreads those properties onto the real HTML button.
    //
    // This makes Button reusable without us needing to manually
    // define every possible native button property.


    // ==============================
    // BUTTON CLASSES
    // ==============================

    // Template literals let us combine shared and custom classes.
    //
    // Example:
    //
    // variant="accent"
    // className="top-bar-support"
    //
    // becomes approximately:
    //
    // button button-accent top-bar-support
    //
    // .button
    // -> shared base styling.
    //
    // .button-${variant}
    // -> reusable visual variant.
    //
    // className
    // -> feature/component-specific styling.

    return (
        <button
            type={type}
            className={`button button-${variant} ${className}`}
            {...props}
        >
            {/* 
                children is whatever the parent placed between
                the Button tags.

                Example:

                <Button>
                    Reload
                </Button>

                children
                -> "Reload"
            */}
            {children}
        </button>
    )
}

export default Button