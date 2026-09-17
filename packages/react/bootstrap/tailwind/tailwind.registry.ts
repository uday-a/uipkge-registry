import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineRegistryItem } from "../../lib/define-registry";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slurp = (p: string) => readFileSync(join(__dirname, p), "utf8").trim();

/** Parse a CSS declaration block (no surrounding selector) into Record<token, value>. */
function parseTokens(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

export default defineRegistryItem({
  name: "tailwind",
  type: "registry:style",
  title: "Tailwind v4 OKLCH tokens",
  description:
    "Tailwind v4 design tokens (light + dark), motion tokens, base layer styling, and shadow utilities. Identical token set to the Vue/Nuxt registry — tokens are framework-neutral. Ships the full canonical tailwind.css as `files` content; the cssVars block stays as a merge safety net for consumers with a pre-existing globals.css.",
  // The shipped tailwind.css is the single source of truth (a copy of the
  // canonical styles/tailwind.css). For Next.js App Router this lands at
  // app/globals.css — the consumer imports it from the root layout.
  files: [{ path: "tailwind.css", target: "~/app/globals.css" }],
  dependencies: [],
  cssVars: {
    theme: parseTokens(slurp("parts/theme.css")),
    light: parseTokens(slurp("parts/light.css")),
    dark: parseTokens(slurp("parts/dark.css")),
  },
});
