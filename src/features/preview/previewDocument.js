// Parse in an inert, detached document: no user HTML is attached to the app DOM.
// Serialization is consumed only by the sandboxed iframe. The CSS switch controls
// the CSS editor layer; inline HTML styles remain part of the HTML document.
export default function createPreviewDocument({ html = "", css = "", javascript = "" }, {
    isCssEnabled = true,
    isJsEnabled = true,
} = {}) {
    const document = new DOMParser().parseFromString(html, "text/html")
    if (!document.head.querySelector("meta[charset]")) {
        const charset = document.createElement("meta")
        charset.setAttribute("charset", "UTF-8")
        document.head.prepend(charset)
    }
    if (!document.head.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement("meta")
        viewport.name = "viewport"
        viewport.content = "width=device-width, initial-scale=1.0"
        document.head.append(viewport)
    }
    if (isCssEnabled && css) {
        const style = document.createElement("style")
        style.dataset.editorLayer = "css"
        // Raw-text closing tags must not terminate the generated layer early.
        style.textContent = css.replace(/<\/style/gi, "<\\/style")
        document.head.append(style)
    }
    if (isJsEnabled && javascript) {
        const script = document.createElement("script")
        script.dataset.editorLayer = "javascript"
        script.textContent = javascript.replace(/<\/script/gi, "<\\/script")
        document.body.append(script)
    }
    return "<!doctype html>\n" + document.documentElement.outerHTML
}
