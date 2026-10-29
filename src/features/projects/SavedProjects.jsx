import { useRef, useState } from "react"

import Button from "../../components/ui/Button.jsx"
import ProjectEditTime from "./ProjectEditTime.jsx"
import ProjectIcon from "./ProjectIcon.jsx"
import ProjectName from "./ProjectName.jsx"

// Stored array order defines display numbers. Reordering never changes project IDs
// or edit timestamps. Native drag/drop and explicit keyboard buttons share a move.
export default function SavedProjects({ projects, saved, allSaved, reordering, onOpen, onDelete }) {
    const draggedId = useRef(null)
    const pressedControl = useRef(false)
    const [announcement, setAnnouncement] = useState("")
    const [draggingId, setDraggingId] = useState(null)
    const [dropId, setDropId] = useState(null)
    const [movedId, setMovedId] = useState(null)
    const rows = useRef(new Map())
    function clearDrag() {
        draggedId.current = null
        setDraggingId(null)
        setDropId(null)
    }
    function move(project, target) {
        if (target && projects.move(project.id, target.id)) {
            setMovedId(project.id)
            setAnnouncement(`${project.name}: ${allSaved.indexOf(project) + 1} → ${allSaved.indexOf(target) + 1}.`)
            requestAnimationFrame(() => {
                const row = rows.current.get(project.id)
                row?.scrollIntoView({ block: "nearest", inline: "nearest" })
                // Moving a DOM row can lose focus, or disable the pressed boundary
                // arrow. Keep keyboard users on the moved tile.
                if (row && (!row.contains(document.activeElement) || document.activeElement.disabled)) row.focus({ preventScroll: true })
            })
        }
    }
    return (
        <>
            {reordering && <p className="project-reorder-help">Drag a tile or use the up/down buttons to reorder.</p>}
            <p className="screen-reader-only" role="status" aria-label="Saved work order" aria-atomic="true">{reordering && draggingId && dropId && draggingId !== dropId
                ? `Drop at position ${allSaved.findIndex(project => project.id === dropId) + 1}`
                : announcement}</p>
            <ol className={`saved-projects${reordering ? " is-reordering" : ""}`} aria-label="Saved work list" tabIndex={0}>
                {saved.map(project => {
                    const index = allSaved.findIndex(item => item.id === project.id)
                    const dropSide = draggingId && dropId === project.id && draggingId !== project.id
                        ? allSaved.findIndex(item => item.id === draggingId) > index ? "before" : "after"
                        : null
                    const rowClass = reordering ? [draggingId === project.id && "is-dragging", movedId === project.id && "is-moved", dropSide && `is-drop-${dropSide}`].filter(Boolean).join(" ") : ""
                    return (
                        <li key={project.id} ref={node => { if (node) rows.current.set(project.id, node); else rows.current.delete(project.id) }} className={rowClass} tabIndex={reordering ? 0 : undefined} aria-label={reordering ? project.name : undefined} draggable={reordering} onPointerDownCapture={event => { pressedControl.current = !!event.target.closest("button") }} onDragStart={event => {
                            // Arrow buttons retain their own interaction inside a draggable tile.
                            if (!reordering || pressedControl.current) { event.preventDefault(); return }
                            draggedId.current = project.id
                            setDraggingId(project.id)
                            setMovedId(null)
                            event.dataTransfer.effectAllowed = "move"
                            event.dataTransfer.setData("text/plain", project.id)
                        }} onDragEnd={clearDrag} title={`Updated ${new Date(project.updatedAt).toLocaleString()}`} onDragOver={event => { if (reordering && draggedId.current) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setDropId(project.id) } }} onDrop={event => {
                            if (!reordering || !draggedId.current) return
                            event.preventDefault()
                            const dragged = allSaved.find(item => item.id === draggedId.current)
                            if (dragged) move(dragged, project)
                            clearDrag()
                        }}>
                            <div className="saved-project-details">
                                <div className="numbered-project-name">
                                    <span className="project-order-number">{index + 1}.</span>
                                    {reordering ? <span className="project-name" title={project.name}>{project.name}</span> : <ProjectName name={project.name} label={`Rename ${project.name}`} onRename={name => projects.renameSaved(project.id, name)} />}
                                </div>
                                <ProjectEditTime value={project.updatedAt} />
                            </div>
                            <div className="project-actions">
                                {reordering ? <>
                                    <Button className="project-icon-button" aria-label={`Move ${project.name} to top`} title="Move to top" disabled={index === 0} onClick={() => move(project, allSaved[0])}><ProjectIcon type="top" /></Button>
                                    <Button className="project-icon-button" aria-label={`Move ${project.name} up`} title="Move up" disabled={index === 0} onClick={() => move(project, allSaved[index - 1])}><ProjectIcon type="up" /></Button>
                                    <Button className="project-icon-button" aria-label={`Move ${project.name} down`} title="Move down" disabled={index === allSaved.length - 1} onClick={() => move(project, allSaved[index + 1])}><ProjectIcon type="down" /></Button>
                                </> : <>
                                    <Button className="project-icon-button" title={`Open ${project.name}`} aria-label={`Open ${project.name}`} onClick={() => onOpen(project.id)}><ProjectIcon type="open" /></Button>
                                    <Button className="project-icon-button" title={`Delete ${project.name}`} aria-label={`Delete ${project.name}`} onClick={() => onDelete(project)}><ProjectIcon type="delete" /></Button>
                                </>}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </>
    )
}
