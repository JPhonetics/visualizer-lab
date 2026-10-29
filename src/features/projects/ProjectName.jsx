import { useEffect, useRef, useState } from "react"

import Button from "../../components/ui/Button.jsx"
import ProjectIcon from "./ProjectIcon.jsx"

// Inline editing also works in embedded browsers that suppress window.prompt.
export default function ProjectName({ name, label, onRename }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState(name)
    const [error, setError] = useState("")
    const input = useRef(null)
    const trigger = useRef(null)
    useEffect(() => { if (editing) input.current?.select() }, [editing])
    const begin = () => { setValue(name); setError(""); setEditing(true) }
    const finish = () => { setEditing(false); requestAnimationFrame(() => trigger.current?.focus()) }
    return (
        <div className="project-name-control">
            <Button ref={trigger} className="project-name project-name-trigger" aria-label={label} title={`${name} — double-click or press Enter to rename`} hidden={editing}
                onDoubleClick={begin}
                onClick={event => { if (event.detail === 0) begin() }}
                onKeyDown={event => { if (event.key === "F2") { event.preventDefault(); begin() } }}
            >{name}</Button>
            {editing && (
                <form className="project-rename-form" onSubmit={event => {
                    event.preventDefault()
                    if (!value.trim() || value.length > 100) { setError("Use 1–100 characters."); return }
                    if (onRename(value.trim())) finish()
                    else setError("Name was not saved. Check the project save status.")
                }}>
                    <input ref={input} aria-label={label} value={value} maxLength={100} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); finish() } }} />
                    <Button type="submit" className="project-icon-button project-apply-button" aria-label="Apply" title="Apply"><ProjectIcon type="approve" /></Button>
                    <Button className="project-icon-button project-cancel-button" aria-label="Cancel" title="Cancel" onClick={finish}><ProjectIcon type="cancel" /></Button>
                    {error && <span className="project-name-error" role="alert">{error}</span>}
                </form>
            )}
        </div>
    )
}
