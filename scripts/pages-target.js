import { pagesDomain } from "../pages.config.js"

// A domain-root artifact must not be published at GitHub's /repository/ URL.
export function validatePagesTarget(value) {
    const target = new URL(value)
    if (target.hostname !== pagesDomain || target.pathname !== "/") {
        throw new Error(`Set the repository Pages custom domain to ${pagesDomain} before publishing.`)
    }
    return target
}
