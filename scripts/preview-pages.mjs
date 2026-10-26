import { readFile, stat } from "node:fs/promises"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"

import { pagesBasePath } from "../pages.config.js"

// Test-only static host: configured base, directory redirects and real 404 status.
// Deliberately no Vite SPA fallback, so routing tests exercise the Pages artifact.
const root = resolve("dist")
await stat(resolve(root, "404.html"))
const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
}

createServer(async (request, response) => {
    const url = new URL(request.url, "http://127.0.0.1")
    if (url.pathname === pagesBasePath.slice(0, -1)) {
        response.writeHead(301, { Location: pagesBasePath + url.search }).end()
        return
    }
    if (!url.pathname.startsWith(pagesBasePath)) {
        response.writeHead(404).end("Outside project")
        return
    }

    try {
        const path = resolve(root, decodeURIComponent(url.pathname.slice(pagesBasePath.length)))
        if (path !== root && !path.startsWith(root + sep)) {
            response.writeHead(400).end("Invalid path")
            return
        }
        let file = path
        if ((await stat(path)).isDirectory()) {
            if (!url.pathname.endsWith("/")) {
                response.writeHead(301, { Location: url.pathname + "/" + url.search }).end()
                return
            }
            file = resolve(path, "index.html")
        }
        const body = await readFile(file)
        response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" }).end(body)
    } catch {
        response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(await readFile(resolve(root, "404.html")))
    }
}).listen(4179, "127.0.0.1", () => {
    console.log(`Pages artifact: http://127.0.0.1:4179${pagesBasePath}`)
})
