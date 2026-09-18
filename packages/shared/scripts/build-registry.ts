/**
 * Shared registry build pipeline for packages/registry-*.
 *
 * Each framework registry calls `buildRegistry()` with a small config; all the
 * machinery (glob -> sidecar import -> JSON emit -> index + catalog) lives here
 * so the pipelines cannot drift apart.
 *
 * Per-framework differences stay in the calling script:
 *  - framework segment + schema URLs + index name
 *  - `normalizeTarget` (Nuxt wants `~/app/...`, Next.js wants `~/...`)
 *  - `excludeConsumerFiles` (Vue filters preview-only `page.vue` files)
 *  - `legacyDepBase` (React rewrites sidecars that hardcode the retired
 *    react.uipkge.dev host)
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import fg from 'fast-glob'

/** Structural subset of the sidecar's RegistryItem the pipeline reads. */
interface RegistryItemLike {
  name: string
  title?: string
  description?: string
  type: string
  categories?: string[]
  deprecated?: boolean | string
  replacedBy?: string
  files: { path: string; target: string }[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  cssVars?: unknown
  css?: unknown
  tailwind?: unknown
}

export interface RegistryBuildConfig {
  /** Output namespace: items emit to public/r/<framework>/<name>.json. */
  framework: string
  /** Absolute path of the registry package root. */
  root: string
  itemSchema: string
  indexSchema: string
  /** `name` field of the top-level registry.json index. */
  indexName: string
  /** Source filenames that must NOT ship to consumers (e.g. 'page.vue'). */
  excludeConsumerFiles?: string[]
  /** Map a sidecar's bare target to the consumer's install path. */
  normalizeTarget: (rawTarget: string) => string
  /**
   * Retired canonical dep host that old sidecars may still hardcode. Matching
   * deps are rewritten to the active SITE so local builds emit reachable URLs.
   */
  legacyDepBase?: string
}

interface BuiltFile {
  path: string
  content: string
  type: string
  target: string
}

interface BuiltItem {
  $schema: string
  name: string
  title: string
  description?: string
  type: string
  categories?: string[]
  deprecated?: boolean | string
  replacedBy?: string
  files?: BuiltFile[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  cssVars?: unknown
  css?: unknown
  tailwind?: unknown
}

function humanizeName(name: string): string {
  return name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export async function buildRegistry(cfg: RegistryBuildConfig) {
  const ROOT = cfg.root
  const REPO_ROOT = resolve(ROOT, '..', '..')
  const PUBLIC_R = join(ROOT, 'public', 'r')
  const OUT_DIR = join(PUBLIC_R, cfg.framework)
  const INDEX_FILE = join(ROOT, 'registry.json')

  const SITE = process.env.REGISTRY_SITE ?? 'https://uipkge.dev'
  // Sidecars author registryDependencies as flat `${SITE}/r/<dep>.json` URLs.
  // The framework segment is injected here (single source of truth) so
  // sidecars stay framework-agnostic.
  const DEP_BASE = `${SITE}/r/`
  const DEP_BASE_NS = `${SITE}/r/${cfg.framework}/`
  const excluded = new Set(cfg.excludeConsumerFiles ?? [])

  async function loadItem(registryFile: string): Promise<BuiltItem> {
    const mod = (await import(pathToFileURL(registryFile).href)) as { default: RegistryItemLike }
    const item = mod.default
    const itemDir = dirname(registryFile)

    // Filter preview-only source files out of the consumer-facing JSON; the
    // files stay on disk for the docs site. (Vue: `page.vue` would activate
    // Nuxt's pages router on install and break the consumer's app.vue.)
    const consumerFiles = item.files.filter((f) => !excluded.has(f.path))

    const files: BuiltFile[] = await Promise.all(
      consumerFiles.map(async (f) => {
        const sourcePath = join(itemDir, f.path)
        const content = await readFile(sourcePath, 'utf8')
        // path = repo-relative source (locatable in the registry).
        // target = consumer destination. Bare targets bypass the consumer's
        // components.json aliases, so `normalizeTarget` anchors them at `~/`.
        return {
          path: relative(REPO_ROOT, sourcePath),
          content,
          type: item.type,
          target: cfg.normalizeTarget(f.target),
        }
      }),
    )

    const out: BuiltItem = {
      $schema: cfg.itemSchema,
      name: item.name,
      title: item.title ?? humanizeName(item.name),
      type: item.type,
      // Arrays always emitted (possibly empty) for predictable consumer code.
      files,
      dependencies: item.dependencies ?? [],
      devDependencies: item.devDependencies ?? [],
      // Normalize cross-registry deps to `${SITE}/r/<framework>/<dep>.json`:
      //  - already namespaced -> leave as-is
      //  - flat `${SITE}/r/<dep>.json` -> inject the framework segment
      //  - legacyDepBase (retired prod host) -> rewrite to the active SITE so
      //    LOCAL builds emit localhost URLs that `shadcn add` can fetch.
      registryDependencies: (item.registryDependencies ?? []).map((dep) => {
        if (dep.startsWith(DEP_BASE_NS)) return dep
        if (dep.startsWith(DEP_BASE)) return dep.replace(DEP_BASE, DEP_BASE_NS)
        if (cfg.legacyDepBase && dep.startsWith(cfg.legacyDepBase)) {
          return dep.replace(cfg.legacyDepBase, DEP_BASE_NS)
        }
        return dep
      }),
    }
    if (item.description) out.description = item.description
    if (item.categories?.length) out.categories = item.categories
    // Deprecation is informational only: the JSON keeps serving so existing
    // install URLs never 404. The docs site badges these and links replacedBy.
    if (item.deprecated !== undefined) out.deprecated = item.deprecated
    if (item.replacedBy) out.replacedBy = item.replacedBy
    if (item.cssVars) out.cssVars = item.cssVars
    if (item.css) out.css = item.css
    if (item.tailwind) out.tailwind = item.tailwind
    return out
  }

  // Wipe the whole /r tree (drops any stale flat or other-framework JSON)
  // then recreate the framework-namespaced output dir.
  await rm(PUBLIC_R, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  const registryFiles = await fg(
    ['components/**/*.registry.ts', 'blocks/**/*.registry.ts', 'bootstrap/**/*.registry.ts'],
    { cwd: ROOT, absolute: true },
  )
  if (registryFiles.length === 0) {
    console.warn('[registry] no *.registry.ts files found -- registry is empty')
  }

  // fast-glob walks the filesystem in inode order, which changes every
  // time you add/remove a file. Sort by source path so the per-file
  // build log is deterministic. The final items[] is re-sorted below
  // before writing the index.
  registryFiles.sort()

  const items: BuiltItem[] = []
  for (const file of registryFiles) {
    const item = await loadItem(file)
    const out = join(OUT_DIR, `${item.name}.json`)
    await writeFile(out, JSON.stringify(item, null, 2))
    items.push(item)
    console.log(`[registry] built ${relative(ROOT, out)}`)
  }

  // Alphabetical by name so registry.json (and everything derived from
  // it -- llms.txt, the API index) stays stable across rebuilds.
  items.sort((a, b) => a.name.localeCompare(b.name))

  const index = {
    $schema: cfg.indexSchema,
    name: cfg.indexName,
    homepage: SITE,
    items,
  }
  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2))
  console.log(`[registry] index -> ${relative(ROOT, INDEX_FILE)} (${items.length} items)`)

  const catalog = {
    $schema: cfg.indexSchema,
    name: 'uipkge',
    homepage: SITE,
    items: items.map((item) => ({
      ...item,
      files: item.files?.map(({ content: _content, ...file }) => file),
    })),
  }
  const catalogFile = join(OUT_DIR, 'registry.json')
  await writeFile(catalogFile, JSON.stringify(catalog, null, 2))
  console.log(`[registry] catalog -> ${relative(ROOT, catalogFile)}`)
}
