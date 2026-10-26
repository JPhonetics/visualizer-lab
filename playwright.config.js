import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: "http://127.0.0.1:4178",
        trace: "retain-on-failure",
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    // Test the built artifact, with an isolated port and no reused dev server.
    webServer: {
        command: "npm run preview -- --host 127.0.0.1 --port 4178 --strictPort",
        url: "http://127.0.0.1:4178",
        reuseExistingServer: false,
    },
})
