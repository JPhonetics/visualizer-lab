import { validatePagesTarget } from "./pages-target.js"

// Read the repository's actual Pages settings, as supplied by configure-pages.
const target = validatePagesTarget(process.env.PAGES_URL)
console.log(`Pages target confirmed: ${target.origin}/`)
