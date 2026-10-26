import { describe, expect, it } from "vitest"

import { validatePagesTarget } from "../../scripts/pages-target.js"

describe("deployment target guard", () => {
    it("accepts the custom domain at its root", () => {
        expect(validatePagesTarget("https://visualizerlab.dev/").origin).toBe("https://visualizerlab.dev")
    })

    it.each([
        "https://jphonetics.github.io/visualizer-lab/",
        "https://visualizerlab.dev/visualizer-lab/",
        "https://another-domain.example/",
        "https://visualizerlab.com/",
        "",
    ])("rejects an unconfigured or incompatible target: %s", (url) => {
        expect(() => validatePagesTarget(url)).toThrow()
    })
})
