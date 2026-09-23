import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./app/App.jsx"
import "./index.css"

// ==============================
// REACT STARTING POINT
// ==============================

// index.html has <div id="root"></div>.
// React attaches our application to that root here.
//
// See:
// src/app/App.jsx -> the main application component.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)