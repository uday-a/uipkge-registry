// Local typecheck shim (not shipped — the sidecar `files` list controls what
// consumers install, and SvelteKit/Vite projects already declare `*.css` via
// `vite/client` types). Lets svelte-check resolve the global Leaflet/Mapbox
// CSS imports in this package.
declare module '*.css'
