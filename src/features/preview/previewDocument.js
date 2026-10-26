// ==============================
// PREVIEW DOCUMENT
// ==============================

/*
    Summary:
    previewDocument currently provides the temporary document
    rendered inside Visualizer Lab's Preview iframe.

    Both:

    PreviewPanel
    VisualizedPage

    need to render the same document.

    Keeping it here prevents the two Preview environments from
    defining duplicate iframe content.

    This is temporary.

    Once the real editors exist, this file will likely evolve
    into document-generation logic that combines:

    HTML
    CSS
    JavaScript

    into the final iframe document.

    Used by:
    PreviewPanel.jsx
    VisualizedPage.jsx

    See:
    PreviewFrame.jsx
    -> places this document inside the sandboxed iframe.

    PreviewViewport.jsx
    -> provides this document to PreviewFrame.
*/

const PREVIEW_DOCUMENT = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />

        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />

        <style>
            * {
                box-sizing: border-box;
            }

            html,
            body {
                margin: 0;
                min-height: 100%;
            }

            body {
                padding: 20px;
                font-family: Arial, Helvetica, sans-serif;
            }
        </style>
    </head>

    <body>
        Preview
    </body>
</html>
`

export default PREVIEW_DOCUMENT