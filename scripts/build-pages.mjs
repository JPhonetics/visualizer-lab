import { copyFile, mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { build } from "vite"

import { pagesBasePath, pagesEntryRoutes } from "../pages.config.js"

await build({ base: pagesBasePath })

for (const route of pagesEntryRoutes) {
    const directory = resolve("dist", route)
    await mkdir(directory, { recursive: true })
    await copyFile("dist/index.html", resolve(directory, "index.html"))
}

// Pages serves this document at the original unknown URL. Absolute, base-prefixed
// assets boot BrowserRouter there; its existing unknown-route redirect takes over.
await copyFile("dist/index.html", "dist/404.html")
await writeFile("dist/.nojekyll", "")
