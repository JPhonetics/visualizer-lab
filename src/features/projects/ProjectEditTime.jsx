// Render browser-local date/time without announcing every autosave as a live region.
export default function ProjectEditTime({ value }) {
    if (!value) return <span className="project-edit-time">No edits yet</span>
    return <time className="project-edit-time" dateTime={value} title={new Date(value).toLocaleString()}>Last edited: {new Date(value).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}</time>
}
