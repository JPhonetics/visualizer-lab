import { Navigate } from "react-router-dom"

// Frontend is the only implemented visualizer. Ignore legacy saved choices
// until another workspace is available; routing must also work without storage.
function HomeRedirect() {
    return (
        <Navigate
            to="/frontend"
            replace
        />
    )
}

export default HomeRedirect
