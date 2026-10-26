import { defineConfig, devices } from "@playwright/test"

import { pagesBasePath } from "./pages.config.js"

export default defineConfig({
    testDir: "./tests/e2e",
    testMatch: "**/pages.spec.js",
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        baseURL: `http://127.0.0.1:4179${pagesBasePath}`,
        trace: "retain-on-failure",
    },
    projects: [{ name: "pages-chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: "npm run preview:pages",
        url: `http://127.0.0.1:4179${pagesBasePath}`,
        reuseExistingServer: false,
    },
})
