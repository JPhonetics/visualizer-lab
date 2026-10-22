// ==============================
// SHARED PANEL
// ==============================

// Panel provides the shared structure used by the main
// Editor and Preview areas.
//
// Instead of rebuilding the same structure multiple times,
// EditorPanel and PreviewPanel reuse this component.
//
// This is React composition:
//
// Panel
// -> provides the common structure.
//
// Props
// -> provide the differences.
//
// children
// -> provides the content placed inside the panel.
//
// Props:
//
// header
// -> content displayed across the top of the panel.
//
// children
// -> content displayed inside the main panel area.
//
// className
// -> lets a specific panel add its own CSS class.
//
// Used by:
//
// See:
// EditorPanel.jsx
// PreviewPanel.jsx
//
// Shared panel styling:
//
// See:
// src/styles/app-shell.css

function Panel({ header, children, className = ""}) {
    return (
        <section className={`panel ${className}`}>
            <header className="panel-header">
                {header}
            </header>

            <div className="panel-content">
                {children}
            </div>
        </section>
    )
}

export default Panel