// Runs before first paint (loaded synchronously in <head>) so the page never
// flashes the wrong theme. A file, not an inline script, because the
// Content-Security-Policy only allows scripts from our own origin.
;(function () {
    var mode = null
    try {
        mode = localStorage.getItem('cc-theme')
    } catch {
        mode = null
    }
    var dark =
        mode === 'dark' ||
        (mode !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
})()
