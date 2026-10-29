import { useEffect, useRef, useState } from "react"

import Button from "../../components/ui/Button.jsx"
import ProjectIcon from "./ProjectIcon.jsx"

export default function SaveAsForm({ name, onSave, onClose }) {
    const [value, setValue] = useState(name)
    const [error, setError] = useState("")
    const input = useRef(null)
    useEffect(() => { input.current?.select() }, [])
    return (
        <form className="project-rename-form" aria-label="Save As" onSubmit={event => {
            event.preventDefault()
            if (!value.trim()) { setError("Enter a name."); return }
            if (onSave(value.trim())) onClose()
            else setError("Copy was not saved. Check the project save status.")
        }}>
            <input ref={input} aria-label="New copy name" maxLength={100} value={value} onChange={event => setValue(event.target.value)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onClose() } }} />
            <Button type="submit" className="project-icon-button" aria-label="Create copy" title="Create copy"><ProjectIcon type="copy" /></Button>
            <Button className="project-icon-button project-cancel-button" aria-label="Cancel" title="Cancel" onClick={onClose}><ProjectIcon type="cancel" /></Button>
            {error && <span role="alert" className="project-name-error">{error}</span>}
        </form>
    )
}
