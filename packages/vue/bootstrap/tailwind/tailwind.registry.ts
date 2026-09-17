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
    "Tailwind v4 design tokens (light + dark), motion tokens, base layer styling, and shadow utilities. Ships the full canonical tailwind.css as the `files` content so a re-pull with `--overwrite` lands a working setup. The cssVars block stays as a safety net for first-install scenarios where the CLI merges tokens into a consumer's pre-existing tailwind.css. The `css` (@layer base) field is intentionally omitted to avoid duplicating the @layer base block already present in the shipped file when the CLI merges.",
  // The shipped `tailwind.css` is a symlink to packages/registry/styles/tailwind.css
  // (the single source of truth). That makes re-pull with -o safe: the
  // consumer gets a full 300+ line working file instead of a 10-line stub
  // that would silently delete their theme tokens. The `cssVars` block
  // below is kept as a safety net for first-install scenarios where the
  // consumer already has a tailwind.css and chose not to overwrite -- the
  // CLI still merges our tokens into their existing @theme/:root/.dark
  // blocks. The merge is idempotent against our own canonical content
  // because the parts/*.css files mirror the canonical's token blocks.
  //
  // We'd prefer `files: []` so consumers with custom tailwind.css never
  // see the overwrite prompt, but shadcn-vue's CLI rejects empty files
  // arrays with `Validation failed: resolvedPaths: Required`. So we ship
  // the full file and rely on the user choosing skip-vs-overwrite.
  files: [{ path: "tailwind.css", target: "~/app/assets/css/tailwind.css" }],
  dependencies: ["tailwindcss", "tw-animate-css"],
  cssVars: {
    theme: parseTokens(slurp("parts/theme.css")),
    light: parseTokens(slurp("parts/light.css")),
    dark: parseTokens(slurp("parts/dark.css")),
  },
});
