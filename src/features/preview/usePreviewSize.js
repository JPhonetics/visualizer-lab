import { useEffect, useRef, useState } from "react"

// ==============================
// PREVIEW SIZE HOOK
// ==============================

/*
    Summary:
    usePreviewSize measures the actual responsive Preview viewport.

    It provides:

    previewViewportRef
    -> attaches to the DOM element being measured.

    previewSize
    -> contains its current width and height in CSS pixels.

    ResizeObserver watches the element itself instead of watching
    specific causes of resizing.

    That means the same observer handles:

    browser resizing
    Sidebar resizing
    Editor / Preview resizing
    device-mode changes
    collapsed-panel changes

    requestAnimationFrame() limits measurement updates to one per
    browser-rendered frame.

    Key concepts:

    Custom hook
    -> packages reusable React behavior.

    useRef
    -> connects React to the actual Preview DOM element.

    ResizeObserver
    -> reacts whenever that element's dimensions change.

    requestAnimationFrame()
    -> prevents multiple rapid observer notifications from
       producing unnecessary updates in the same visual frame.

    Functional state update
    -> lets us compare the next dimensions with the current ones
       before triggering another render.

    Used by:
    PreviewPanel.jsx

    Future use:
    VisualizedPage.jsx

    See:
    PreviewViewport.jsx
    -> receives previewViewportRef and attaches it to the real
       responsive viewport.

    PreviewToolbar.jsx
    -> displays previewSize.
*/


function usePreviewSize() {

    // ==============================
    // PREVIEW DIMENSIONS
    // ==============================

    const [previewSize, setPreviewSize] =
        useState({
            height: 0,
            width: 0,
        })


    // ==============================
    // REFERENCES
    // ==============================

    /*
        previewViewportRef
        -> points to the responsive viewport DOM element.

        previewSizeAnimationFrameRef
        -> stores the ID of a measurement already scheduled for
           the next browser frame.
    */
    const previewViewportRef =
        useRef(null)

    const previewSizeAnimationFrameRef =
        useRef(null)


    // ==============================
    // WATCH PREVIEW DIMENSIONS
    // ==============================

    useEffect(() => {
        const previewViewport =
            previewViewportRef.current

        if (!previewViewport) {
            return
        }


        // ==============================
        // MEASURE PREVIEW
        // ==============================

        function updatePreviewSize() {
            const bounds =
                previewViewport
                    .getBoundingClientRect()

            const nextHeight =
                Math.round(
                    bounds.height,
                )

            const nextWidth =
                Math.round(
                    bounds.width,
                )


            /*
                Avoid updating state when the dimensions have not
                actually changed.

                Returning the existing object allows React to skip
                an unnecessary render.
            */
            setPreviewSize(
                (currentSize) => {

                    if (
                        currentSize.height
                            === nextHeight
                        &&
                        currentSize.width
                            === nextWidth
                    ) {
                        return currentSize
                    }

                    return {
                        height: nextHeight,
                        width: nextWidth,
                    }
                },
            )
        }


        // ==============================
        // SCHEDULE MEASUREMENT
        // ==============================

        /*
            ResizeObserver can fire several times rapidly.

            Only schedule another measurement if one is not
            already waiting for the next visual frame.
        */
        function schedulePreviewSizeUpdate() {
            if (
                previewSizeAnimationFrameRef.current
                !== null
            ) {
                return
            }

            previewSizeAnimationFrameRef.current =
                requestAnimationFrame(() => {

                    previewSizeAnimationFrameRef.current =
                        null

                    updatePreviewSize()
                })
        }


        /*
            Measure once immediately so the UI does not begin at:

            0 × 0
        */
        updatePreviewSize()


        // ==============================
        // RESIZE OBSERVER
        // ==============================

        const resizeObserver =
            new ResizeObserver(() => {
                schedulePreviewSizeUpdate()
            })

        resizeObserver.observe(
            previewViewport,
        )


        // ==============================
        // CLEANUP
        // ==============================

        return () => {
            resizeObserver.disconnect()

            if (
                previewSizeAnimationFrameRef.current
                !== null
            ) {
                cancelAnimationFrame(
                    previewSizeAnimationFrameRef.current,
                )

                previewSizeAnimationFrameRef.current =
                    null
            }
        }
    }, [])


    return {
        previewSize,
        previewViewportRef,
    }
}

export default usePreviewSize