import { expect, it } from "vitest"

import createPreviewDocument from "../../src/features/preview/previewDocument.js"

const parse = (html) => new DOMParser().parseFromString(html, "text/html")

it("assembles fragments and full documents without running them in the app", () => {
    const result = parse(createPreviewDocument({
        html: '<!doctype html><html><head><title>Example</title></head><body><h1>Hello</h1><script>window.previewEscaped = true</script></body></html>',
        css: "h1 { color: green; }",
        javascript: "document.title = 'Script title'",
    }))
    expect(result.title).toBe("Example")
    expect(result.querySelector("h1").textContent).toBe("Hello")
    expect(result.querySelector("style[data-editor-layer]").textContent).toContain("green")
    expect(result.querySelector("script[data-editor-layer]").textContent).toContain("Script title")
    expect(result.querySelector('meta[name="viewport"]')).not.toBeNull()
    expect(window.previewEscaped).toBeUndefined()
})

it("omits disabled editor layers while retaining HTML markup", () => {
    const result = parse(createPreviewDocument({
        html: '<p style="color:red">HTML styling</p>',
        css: "p { color: green; }",
        javascript: "alert(1)",
    }, { isCssEnabled: false, isJsEnabled: false }))
    expect(result.querySelector("p").getAttribute("style")).toBe("color:red")
    expect(result.querySelector("[data-editor-layer]")).toBeNull()
})

it("does not let closing-tag text terminate generated script or style layers", () => {
    const result = parse(createPreviewDocument({
        html: "<p>Content</p>",
        css: 'p::after { content: "</style><h1>not HTML</h1>"; }',
        javascript: 'const example = "</script><h1>not HTML</h1>";',
    }))
    expect(result.querySelectorAll("h1")).toHaveLength(0)
    expect(result.querySelectorAll("script")).toHaveLength(1)
    expect(result.querySelectorAll("style")).toHaveLength(1)
    expect(result.querySelector("script").textContent).toContain("<\\/script")
})
