// Shared outline icons keep compact project actions consistent with device controls.
export default function ProjectIcon({ type }) {
    const paths = {
        copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
        reorder: <path d="M7 3v18m-4-4 4 4 4-4M17 21V3m-4 4 4-4 4 4" />,
        top: <path d="m6 11 6-6 6 6M6 18l6-6 6 6" />,
        up: <path d="m6 14 6-6 6 6" />,
        down: <path d="m6 10 6 6 6-6" />,
        approve: <path d="m5 12 4 4L19 6" />,
        cancel: <path d="m6 6 12 12M18 6 6 18" />,
        open: <path d="M3 7V5a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v2M3 7h6l2 2h10l-3 11H3Z" />,
        save: <><path d="M4 3h13l4 4v14H3V3ZM7 3v6h10V3M7 21v-8h10v8" /></>,
        saveAs: <><path d="M3 3h13l3 3v5M3 3v18h7M7 3v6h8V3M7 21v-8h4M13 18h8M17 14v8" /></>,
        new: <><path d="M13 2H4v20h16V9ZM13 2v7h7M8 15h8M12 11v8" /></>,
        delete: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
    }
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>
}
