import { useEffect, useState } from "react"

// ==============================
// LOCAL STORAGE STATE HOOK
// ==============================

// Summary:
// useLocalStorageState is a custom React hook that combines
// normal React state with browser localStorage persistence.
//
// React does NOT provide useLocalStorageState built in.
//
// We created this hook because several Visualizer Lab settings
// need the same repeated behavior:
//
// read saved value
// -> use it as React state
// -> update state normally
// -> save changes back to localStorage
//
// It intentionally returns the same basic shape as useState:
//
// [value, setValue]
//
// That means using this custom hook should feel familiar if we
// already understand:
//
// const [value, setValue] = useState(...)
//
// Key concepts:
//
// Custom hook
// -> a reusable JavaScript function that combines React hooks
//    and shared behavior.
//
// useState
// -> stores the current value in React.
//
// useEffect
// -> saves the latest value after React state changes.
//
// Lazy initialization
// -> reads localStorage only when the initial state is created.
//
// JSON serialization
// -> converts JavaScript values into strings that localStorage
//    can store.
//
// Error handling
// -> falls back safely if browser storage cannot be read or
//    written.
//
// Used by:
// AppShell.jsx
// Sidebar.jsx
//
// Future uses may include:
// other persistent Visualizer Lab preferences.
//
// Uses:
// useState
// useEffect
// browser localStorage
// JSON.parse()
// JSON.stringify()


function useLocalStorageState(
    key,
    defaultValue,
) {

    // ==============================
    // PERSISTED REACT STATE
    // ==============================

    /*
        useState normally receives an initial value:

        useState(220)

        Here we give useState a FUNCTION instead:

        useState(() => { ... })

        This is called a lazy initializer.

        React runs this function when the state is first created
        instead of executing the storage lookup during every
        component render.

        That makes this a good place to read localStorage.
    */
    const [value, setValue] = useState(() => {

        try {

            // localStorage.getItem()
            // -> looks for an existing browser value using the
            //    provided storage key.
            //
            // Example:
            //
            // key:
            // "visualizerLab.sidebarWidth"
            //
            // saved value:
            // "220"

            const savedValue =
                localStorage.getItem(key)


            /*
                localStorage returns null when the key has never
                been saved.

                In that case, use the default value provided by
                the component.

                Example:

                useLocalStorageState(
                    "visualizerLab.sidebarWidth",
                    220,
                )

                If nothing is stored yet:

                value
                -> 220
            */
            if (savedValue === null) {
                return defaultValue
            }


            /*
                localStorage can only store strings.

                JSON.parse() converts the stored string back into
                its original JavaScript type.

                Examples:

                "220"
                -> 220

                "true"
                -> true

                "\"dark\""
                -> "dark"

                This is why the same hook can persist different
                kinds of values without separate number/boolean
                helper functions.
            */
            return JSON.parse(savedValue)

        } catch {

            /*
                Browser storage can occasionally fail.

                Examples:

                corrupted saved data
                blocked storage
                unexpected JSON

                A persistence problem should not prevent
                Visualizer Lab from loading.

                If reading fails, fall back to the normal default.
            */
            return defaultValue
        }
    })


    // ==============================
    // SAVE STATE CHANGES
    // ==============================

    /*
        This effect runs whenever:

        key
        or
        value

        changes.

        JSON.stringify() converts the current JavaScript value
        into a string that localStorage can store.

        Examples:

        220
        -> "220"

        true
        -> "true"

        "dark"
        -> "\"dark\""

        The component still interacts with normal JavaScript
        values. Serialization stays hidden inside this hook.
    */
    useEffect(() => {

        try {
            localStorage.setItem(
                key,
                JSON.stringify(value),
            )
        } catch {

            /*
                We intentionally do not crash the application if
                localStorage cannot be written.

                React state still works for the current session;
                only persistence across refreshes is unavailable.
            */
        }

    }, [
        key,
        value,
    ])


    // ==============================
    // HOOK RETURN VALUE
    // ==============================

    /*
        We return the same basic structure as useState:

        [currentValue, setterFunction]

        This means a component can write:

        const [sidebarWidth, setSidebarWidth] =
            useLocalStorageState(...)

        and then use:

        sidebarWidth
        setSidebarWidth(...)

        exactly like normal React state.

        That familiar interface is one reason custom hooks are
        powerful: reusable behavior can still feel like standard
        React.
    */
    return [
        value,
        setValue,
    ]
}

export default useLocalStorageState