import { useEffect, useState } from "react"

import Button from "../../components/ui/Button.jsx"

// ==============================
// THEME CONTROL
// ==============================

// Summary:
// ThemeControl manages the application's color theme.
//
// The user can cycle between:
//
// System
// Light
// Dark
//
// "System" follows the operating system/browser preference.
//
// Key concepts:
//
// useState
// -> stores the user's selected theme preference.
//
// useEffect
// -> applies the selected theme to the document and watches
//    the operating system when System mode is selected.
//
// localStorage
// -> remembers the user's theme after a browser refresh.
//
// matchMedia()
// -> browser API used to check whether the operating system
//    currently prefers dark mode.
//
// Used by:
// TopBar.jsx
//
// Uses:
// Button.jsx
//
// See:
// src/index.css
// -> defines the actual Light and Dark CSS variables.


// ==============================
// THEME SETTINGS
// ==============================

// Keeping the valid options in one array gives us one source
// of truth for:
//
// validation
// cycling between themes
// future Settings controls.

const THEME_OPTIONS = [
    "system",
    "light",
    "dark",
]

const THEME_STORAGE_KEY = "visualizerLab.theme"


// ==============================
// READ SAVED THEME
// ==============================

// localStorage returns strings.
//
// If the user previously selected a valid theme, return it.
//
// If no saved value exists, or somehow an invalid value was
// stored, default back to:
//
// system
//
// This keeps the application from starting in a broken state.

function getSavedTheme() {
    try {
        const savedTheme = localStorage.getItem(
            THEME_STORAGE_KEY,
        )

        return THEME_OPTIONS.includes(savedTheme)
            ? savedTheme
            : "system"
    } catch {
        return "system"
    }
}


// ==============================
// GET SYSTEM THEME
// ==============================

// window.matchMedia() lets JavaScript ask the browser whether
// a CSS media query currently matches.
//
// prefers-color-scheme is provided by the browser and reflects
// the user's operating-system/browser appearance preference.
//
// true
// -> system prefers dark.
//
// false
// -> system prefers light.

function getSystemTheme() {
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches

    return prefersDark
        ? "dark"
        : "light"
}


function ThemeControl() {

    // ==============================
    // THEME PREFERENCE STATE
    // ==============================

    // We use a lazy useState initializer here.
    //
    // React calls getSavedTheme() when this component is first
    // created instead of calling it during every render.

    const [themePreference, setThemePreference] = useState(
        getSavedTheme,
    )


    // ==============================
    // APPLY THEME
    // ==============================

    // This effect runs whenever themePreference changes.
    //
    // It performs three jobs:
    //
    // 1. determine which actual theme should be displayed
    // 2. apply that theme to <html>
    // 3. save the user's preference
    //
    // If System is selected, it also listens for operating
    // system theme changes while Visualizer Lab is open.

    useEffect(() => {
        const systemThemeQuery = window.matchMedia(
            "(prefers-color-scheme: dark)",
        )


        // ==============================
        // RESOLVE + APPLY THEME
        // ==============================

        // themePreference describes what the USER selected.
        //
        // resolvedTheme describes what the browser should
        // actually display.
        //
        // Example:
        //
        // preference = "system"
        // system currently prefers dark
        //
        // resolvedTheme = "dark"

        function applyTheme() {
            const resolvedTheme =
                themePreference === "system"
                    ? getSystemTheme()
                    : themePreference

            // document.documentElement represents the <html>
            // element for the current page.
            //
            // This produces:
            //
            // <html data-theme="dark">
            //
            // CSS can then target:
            //
            // :root[data-theme="dark"]
            //
            // See:
            // src/index.css

            document.documentElement.dataset.theme =
                resolvedTheme

            // Keep the preference available separately from the
            // resolved theme.
            //
            // This can be useful later when Settings needs to
            // know whether the user selected System specifically.

            document.documentElement.dataset.themePreference =
                themePreference
        }


        applyTheme()

        try {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                themePreference,
            )
        } catch {
            // Theme still works for this session when storage is unavailable.
        }


        // ==============================
        // WATCH SYSTEM APPEARANCE
        // ==============================

        // We only need to watch the operating system while the
        // user's preference is System.
        //
        // If they explicitly selected Light or Dark, operating
        // system changes should not override their choice.

        if (themePreference === "system") {
            systemThemeQuery.addEventListener(
                "change",
                applyTheme,
            )
        }


        // ==============================
        // EFFECT CLEANUP
        // ==============================

        // Remove the listener when:
        //
        // the component disappears
        // or
        // themePreference changes
        //
        // This prevents multiple copies of the same listener
        // from accumulating.

        return () => {
            systemThemeQuery.removeEventListener(
                "change",
                applyTheme,
            )
        }
    }, [themePreference])


    // ==============================
    // CYCLE THEME
    // ==============================

    // Each click moves to the next option:
    //
    // System -> Light -> Dark -> System
    //
    // indexOf() finds the current theme's position.
    //
    // % THEME_OPTIONS.length wraps us back to index 0 after
    // reaching the final option.

    function handleThemeChange() {
        const currentIndex = THEME_OPTIONS.indexOf(
            themePreference,
        )

        const nextIndex =
            (currentIndex + 1) % THEME_OPTIONS.length

        setThemePreference(
            THEME_OPTIONS[nextIndex],
        )
    }


    // ==============================
    // THEME ICON
    // ==============================

    // We derive the icon directly from themePreference.
    //
    // This does not need another useState because the value can
    // always be calculated from existing state.

    const themeIcon = {
        dark: "☾",
        light: "☀",
        system: "◐",
    }[themePreference]


    // Capitalize the first letter for tooltips:
    //
    // system
    // -> System

    const themeLabel =
        themePreference.charAt(0).toUpperCase()
        + themePreference.slice(1)


    return (
        <Button
            className="icon-button"
            title={`Theme: ${themeLabel}`}
            aria-label={`Theme: ${themeLabel}. Click to change theme.`}
            onClick={handleThemeChange}
        >
            {themeIcon}
        </Button>
    )
}

export default ThemeControl