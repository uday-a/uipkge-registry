// Nitro server plugin -- injects an inline <script> into the SSR HTML
// head so the dark class lands on <html> BEFORE the browser paints.
// Also reads the cookie first so the SSR pass and the inline script
// agree on the initial theme; reading localStorage here would
// disagree with the server, which has no localStorage access.
//
// 'system' theme readers still need matchMedia (client-only). That's
// fine -- the script runs synchronously, so the dark class is set
// before <body> paints either way.
import { defineNitroPlugin } from "nitropack/runtime";

const SCRIPT =
  'try{var m=document.cookie.match(/(?:^|; )uipkge-theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (html) => {
    html.head.push(`<script>${SCRIPT}</script>`);
  });
});
