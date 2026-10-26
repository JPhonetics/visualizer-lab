import { describe, expect, it, vi } from "vitest"

import keyboardResize from "../../src/utils/keyboardResize.js"

describe.each([
    ["sidebar", 220, 180, 360, 10, "ArrowRight", "ArrowLeft"],
    ["editor", 50, 25, 75, 5, "ArrowRight", "ArrowLeft"],
    ["templates", 180, 120, 240, 10, "ArrowUp", "ArrowDown"],
])("%s keyboard resizing", (_, value, minimum, maximum, step, increaseKey, decreaseKey) => {
    const options = { value, minimum, maximum, step, increaseKey, decreaseKey }

    it.each(["increase", "decrease", "minimum", "maximum", "unrelated"])("handles %s", (action) => {
        const keys = { increase: increaseKey, decrease: decreaseKey, minimum: "Home", maximum: "End", unrelated: "Tab" }
        const expected = { increase: value + step, decrease: value - step, minimum, maximum, unrelated: null }
        const event = { key: keys[action], preventDefault: vi.fn() }
        expect(keyboardResize(event, options)).toBe(expected[action])
        expect(event.preventDefault).toHaveBeenCalledTimes(action === "unrelated" ? 0 : 1)
    })

    it("cannot move past either limit", () => {
        for (const [bound, key] of [[minimum, decreaseKey], [maximum, increaseKey]]) {
            expect(keyboardResize({ key, preventDefault() {} }, { ...options, value: bound })).toBe(bound)
        }
    })
})
