// ==============================
// PREVIEW FRAME
// ==============================

// Summary:
// PreviewFrame is the isolated browser environment where the
// user's HTML, CSS, and JavaScript will eventually run.
//
// It uses an HTML <iframe> rather than rendering user code
// directly inside the Visualizer Lab React application.
//
// This separation protects the main application from code
// written inside the Preview.
//
// Key concepts:
//
// iframe
// -> embeds a separate webpage inside the current webpage.
//
// srcDoc
// -> allows us to provide an entire HTML document as a string
//    instead of loading another URL.
//
// sandbox
// -> restricts what the embedded page is allowed to do.
//
// Component remounting
// -> PreviewPanel can change this component's React key to
//    completely destroy and recreate the iframe.
//
// Used by:
// PreviewPanel.jsx
//
// Uses:
// Native HTML <iframe>
//
// See:
// PreviewPanel.jsx
// -> owns Reload behavior.
// -> chooses device size.
// -> applies Preview zoom.
//
// Future:
// The documentContent prop will eventually be generated from:
//
// HTML editor
// CSS editor
// JavaScript editor


function PreviewFrame({
    documentContent,
}) {
    return (
        <iframe
            className="preview-frame"
            title="Visualizer Lab Preview"
            sandbox="allow-scripts"
            srcDoc={documentContent}
        />
    )
}

export default PreviewFrame