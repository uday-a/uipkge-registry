/**
 * Builds the Lit registry: registry.json (the site's index) and
 * public/r/lit/<name>.json (one manifest per item, same shape as the other
 * frameworks' manifests).
 *
 * Items are derived from the source tree instead of per-component sidecars:
 * every src/components/<name>/ folder (and every chart in
 * src/components/charts/<name>.ts) whose name is a React registry item. Title,
 * description and categories are copied from the React item — the site's
 * translations are keyed by that English text. Shared helpers (src/lib,
 * src/styles/shadow.css) ship as one `lit-core` item every element depends on.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = resolve(ROOT, '..', '..')
const SRC = join(ROOT, 'src')
const OUT = join(ROOT, 'public', 'r', 'lit')
const SITE = process.env.REGISTRY_SITE ?? 'https://uipkge.dev'
const DEP_BASE = `${SITE}/r/lit/`

interface ReactItem {
  name: string
  title?: string
  description?: string
  categories?: string[]
  type: string
  deprecated?: boolean | string
  replacedBy?: string
}
interface BuiltFile {
  path: string
  content: string
  type: string
  target: string
}

// packages/registry-react here; packages/react in the exported uipkge-registry.
const reactRegistry = ['packages/registry-react', 'packages/react']
  .map((p) => join(REPO, p, 'registry.json'))
  .find((p) => existsSync(p))!
const reactItems: ReactItem[] = JSON.parse(await readFile(reactRegistry, 'utf8')).items
const reactByName = new Map(reactItems.map((i) => [i.name, i]))

const humanize = (n: string) =>
  n
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')

async function listFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await listFiles(p)))
    else if (/\.(ts|css)$/.test(e.name) && !/\.(test|spec)\.ts$/.test(e.name)) out.push(p)
  }
  return out.sort()
}

async function toFile(abs: string): Promise<BuiltFile> {
  const rel = relative(SRC, abs)
  return {
    path: relative(REPO, abs),
    content: await readFile(abs, 'utf8'),
    // registry:file + target: the shadcn CLI writes the file at `target`
    // verbatim (registry:ui files would be forced into the ui alias dir).
    type: 'registry:file',
    // Consumers keep the package layout under src/uip/ so relative imports
    // between elements and src/lib keep working unchanged.
    target: `src/uip/${rel}`,
  }
}

/** npm packages imported by the files (bare specifiers → package names). */
function npmDeps(files: BuiltFile[]): string[] {
  const deps = new Set<string>()
  for (const f of files)
    for (const m of f.content.matchAll(/(?:from\s+|import\s*\(\s*|import\s+)['"]([^'"./][^'"]*)['"]/g)) {
      const spec = m[1]
      const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
      deps.add(pkg)
    }
  return [...deps].sort()
}

/** Other Lit items imported through relative paths (../<name>/…). */
function itemDeps(files: BuiltFile[], names: Set<string>, self: string, chartNames: string[]): string[] {
  if (self === 'charts') {
    return chartNames.sort().map((d) => `${DEP_BASE}${d}.json`)
  }
  const deps = new Set<string>(['lit-core'])
  // Named `from` imports and bare side-effect imports (blocks pull <uip-*>
  // tags this way so standalone installs self-register).
  const patterns = [
    /from\s+['"]\.\.\/(?:\.\.\/components\/)?([a-z0-9-]+)\//g,
    /import\s+['"]\.\.\/(?:\.\.\/components\/)?([a-z0-9-]+)\//g,
  ]
  // Chart files live one level deeper (components/charts/<name>.ts) — the
  // patterns above would catch only the `charts` umbrella (which ships no
  // files), so match the specific chart item instead.
  const chartPatterns = [/from\s+['"]\.\.\/\.\.\/components\/charts\/([a-z0-9-]+)/g, /import\s+['"]\.\.\/\.\.\/components\/charts\/([a-z0-9-]+)/g]
  for (const f of files) {
    for (const re of patterns)
      for (const m of f.content.matchAll(re)) if (names.has(m[1]) && m[1] !== self && m[1] !== 'charts') deps.add(m[1])
    for (const re of chartPatterns) for (const m of f.content.matchAll(re)) if (names.has(m[1]) && m[1] !== self) deps.add(m[1])
  }
  return [...deps].sort().map((d) => `${DEP_BASE}${d}.json`)
}

// ---- collect items ---------------------------------------------------------
type Draft = { name: string; files: string[] }
const drafts: Draft[] = []
for (const e of await readdir(join(SRC, 'components'), { withFileTypes: true })) {
  if (!e.isDirectory() || e.name === 'charts') continue
  drafts.push({ name: e.name, files: await listFiles(join(SRC, 'components', e.name)) })
}
// Blocks live in src/blocks/<name>/ (mirroring registry-vue/registry-react).
// They are name-matched against the React registry exactly like components,
// but keep their registry:block / registry:page type (and deprecation).
const blocksDir = join(SRC, 'blocks')
if (existsSync(blocksDir)) {
  for (const e of await readdir(blocksDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue
    drafts.push({ name: e.name, files: await listFiles(join(blocksDir, e.name)) })
  }
}
const chartLib = await listFiles(join(SRC, 'components', 'charts', 'lib'))
const chartNames: string[] = []
for (const f of await readdir(join(SRC, 'components', 'charts'))) {
  if (!f.endsWith('.ts')) continue
  const chartName = f.slice(0, -3)
  chartNames.push(chartName)
  drafts.push({ name: chartName, files: [join(SRC, 'components', 'charts', f), ...chartLib] })
}
drafts.push({ name: 'charts', files: [] })
// React ships some parts inside another item (ButtonGroup lives in `button`).
const MERGE_INTO: Record<string, string> = { 'button-group': 'button' }
for (const [from, into] of Object.entries(MERGE_INTO)) {
  const src = drafts.find((d) => d.name === from)
  const dst = drafts.find((d) => d.name === into)
  if (src && dst) {
    dst.files.push(...src.files)
    drafts.splice(drafts.indexOf(src), 1)
  }
}
// Every item must be a real React item (so the site has metadata and parity
// pages); anything else is an internal helper and is reported, not shipped.
const skipped = drafts.filter((d) => !reactByName.has(d.name)).map((d) => d.name)
const kept = drafts.filter((d) => reactByName.has(d.name))
const names = new Set(kept.map((d) => d.name))

const items: Record<string, unknown>[] = []
const core = await Promise.all([...(await listFiles(join(SRC, 'lib'))), join(SRC, 'styles', 'shadow.css')].map(toFile))
// The page-level theme (tokens for light/.dark, Tailwind + tw-animate) — the
// same canonical sheet the other frameworks' init installs. Consumers import it
// from their app CSS; the elements read the tokens through their shadow roots.
core.push({
  path: 'packages/shared/styles/tailwind.css',
  content: await readFile(join(REPO, 'packages/shared/styles/tailwind.css'), 'utf8'),
  type: 'registry:file',
  target: 'src/uip/styles/tokens.css',
})
items.push({
  name: 'lit-core',
  title: 'Lit Core',
  type: 'registry:lib',
  description: 'Shared runtime for uipkge Lit elements: Tailwind shadow stylesheet, theme bridge, positioning, icons and cn().',
  files: core,
  dependencies: npmDeps(core),
  registryDependencies: [],
})
for (const d of kept.sort((a, b) => a.name.localeCompare(b.name))) {
  const react = reactByName.get(d.name)!
  const files = await Promise.all(d.files.map(toFile))
  items.push({
    name: d.name,
    title: react.title ?? humanize(d.name),
    // Blocks keep their React type (registry:block / registry:page); the
    // site builds block pages, sidebars and search entries off it.
    type: react.type,
    description: react.description,
    categories: react.categories,
    ...(react.deprecated !== undefined ? { deprecated: react.deprecated } : {}),
    ...(react.replacedBy !== undefined ? { replacedBy: react.replacedBy } : {}),
    files,
    dependencies: npmDeps(files),
    registryDependencies: itemDeps(files, names, d.name, chartNames),
  })
}

// ---- write -----------------------------------------------------------------
if (existsSync(OUT)) await rm(OUT, { recursive: true })
await mkdir(OUT, { recursive: true })
const withSchema = (i: Record<string, unknown>) => ({ $schema: `${SITE}/schema/registry-item.json`, ...i })
for (const i of items) await writeFile(join(OUT, `${i.name}.json`), JSON.stringify(withSchema(i), null, 2) + '\n')
const index = { $schema: `${SITE}/schema/registry.json`, name: 'uipkge-lit', homepage: SITE, items: items.map(withSchema) }
await writeFile(join(ROOT, 'registry.json'), JSON.stringify(index, null, 2) + '\n')
await writeFile(
  join(OUT, 'registry.json'),
  JSON.stringify({ ...index, items: items.map(({ files: _f, ...rest }) => withSchema(rest)) }, null, 2) + '\n',
)
console.log(`[registry-lit] ${items.length} items -> public/r/lit (skipped, not React items: ${skipped.join(', ') || 'none'})`)
