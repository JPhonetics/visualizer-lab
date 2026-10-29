import { useRef, useState, useSyncExternalStore } from "react"

import Button from "../../components/ui/Button.jsx"
import ProjectIcon from "./ProjectIcon.jsx"
import ProjectName from "./ProjectName.jsx"
import SaveAsForm from "./SaveAsForm.jsx"
import ProjectEditTime from "./ProjectEditTime.jsx"
import SavedProjects from "./SavedProjects.jsx"

// Project edits use inline fields; destructive replacement still asks for confirmation.
export default function ProjectControls({ projects }) {
    const state = useSyncExternalStore(projects.subscribe, projects.getSnapshot)
    const [search, setSearch] = useState("")
    const [savingAs, setSavingAs] = useState(false)
    const saveAsButton = useRef(null)
    const [reordering, setReordering] = useState(false)
    const savedHeading = useRef(null)
    const saved = state.saved.filter(project => project.name.toLowerCase().includes(search.toLowerCase()))
    const currentSavedIndex = state.saved.findIndex(project => project.id === state.draft.savedId)
    const confirmReplace = () => window.confirm("Replace Current Work? Use Save or Save As first if you want to keep it. This also resets undo history.")
    return (
        <>
            <div className="sidebar-search-area">
                <input className="sidebar-search" type="search" placeholder="Search saved work" aria-label="Search saved work" disabled={reordering} value={search} onChange={event => setSearch(event.target.value)} />
            </div>
            <div className="sidebar-work-area">
                <section className="sidebar-section project-controls" aria-labelledby="current-work-heading">
                    <div className="project-section-heading">
                        <h2 id="current-work-heading">Current Work</h2>
                        <Button className="project-icon-button" aria-label="New work" title="New work" onClick={() => { if (confirmReplace() && projects.newWork()) setSavingAs(false) }}><ProjectIcon type="new" /></Button>
                    </div>
                    <div className="current-project-row">
                        <div className="numbered-project-name">
                            {currentSavedIndex >= 0 && <span className="project-order-number" title="Linked Saved Work row">{currentSavedIndex + 1}.</span>}
                            <ProjectName name={state.draft.name} label="Rename current work" onRename={projects.renameDraft} />
                        </div>
                        <div className="project-actions">
                            <Button className="project-icon-button" aria-label="Save" title={state.draft.savedId ? "Save changes to the opened copy" : "Save Current Work as a new saved copy"} onClick={() => projects.save()}><ProjectIcon type="save" /></Button>
                            <Button ref={saveAsButton} className="project-icon-button" aria-label="Save As" title="Save As a new copy" onClick={() => setSavingAs(true)}><ProjectIcon type="saveAs" /></Button>
                        </div>
                        <ProjectEditTime value={state.draft.updatedAt} />
                    </div>
                    {savingAs && <SaveAsForm name={state.draft.name} onSave={projects.saveCopy} onClose={() => { setSavingAs(false); requestAnimationFrame(() => saveAsButton.current?.focus()) }} />}
                    {state.error && <p className="project-status" aria-label="Project save status" role="alert">{state.message}</p>}
                    {state.error && state.canRetry && <Button onClick={() => projects.retry()}>Retry saving</Button>}
                </section>
                <section className="sidebar-section project-controls saved-work-section" aria-labelledby="saved-work-heading">
                    <div className="project-section-heading">
                        <h2 id="saved-work-heading" ref={savedHeading} tabIndex={-1}>Saved Work</h2>
                        <Button className="project-icon-button" aria-label="Reorder saved work" aria-pressed={reordering} disabled={!!search || state.saved.length < 2} title={search ? "Clear search to reorder all saved work" : reordering ? "Finish reordering" : "Reorder saved work"} onClick={() => setReordering(value => !value)}><ProjectIcon type="reorder" /></Button>
                    </div>
                    {saved.length === 0 && <p className="sidebar-placeholder">{state.saved.length ? "No matching saved work." : "No saved work yet."}</p>}
                    <SavedProjects projects={projects} saved={saved} allSaved={state.saved} reordering={reordering} onOpen={id => { if (confirmReplace() && projects.open(id)) setSavingAs(false) }} onDelete={project => { if (window.confirm(`Delete saved copy “${project.name}”? Current Work is kept.`) && projects.remove(project.id)) savedHeading.current?.focus() }} />
                </section>
            </div>
        </>
    )
}
