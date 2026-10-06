/**
 * Checks the built registry (public/r/angular) for imports an item uses but
 * doesn't declare. Both break a consumer who installs the item on its own:
 *
 *  - an npm package that isn't in the item's `dependencies`
 *    (e.g. data-table importing @angular/cdk without declaring it)
 *  - another registry item (`@/ui/popper/...`) that isn't reachable through
 *    its `registryDependencies`
 *
 * Packages every `ng new` app already has are exempt. Run after `build`.
 */
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

interface Item {
  name: string
  type: string
  files: { target?: string; content?: string }[]
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
}

const OUT = join(resolve(dirname(fileURLToPath(import.meta.url)), '..'), 'public', 'r', 'angular')

/** In every Angular CLI app from `ng new`. */
const BASELINE = new Set([
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/platform-browser',
  '@angular/router',
  'rxjs',
  'tslib',
])

const IMPORT =
  /(?:import|export)\s[^'"`;]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g

/** `@scope/pkg/sub` -> `@scope/pkg`, `pkg/sub` -> `pkg`. */
const packageOf = (spec: string) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]!)
/** `lucide-angular@^1.0.0` -> `lucide-angular`. */
const bareName = (dep: string) => dep.replace(/(?!^)@.*$/, '')
const depName = (url: string) =>
  url
    .split('/')
    .pop()!
    .replace(/\.json$/, '')

/** Comments can mention imports (`… import from 'sonner'`) without making them. */
const stripComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

export function importsOf(code: string): string[] {
  const out: string[] = []
  for (const m of stripComments(code).matchAll(IMPORT)) out.push((m[1] ?? m[2] ?? m[3])!)
  return out
}

/** `@/ui/popper/popper` -> `src/app/components/ui/popper/popper`; `@/lib/x` -> `src/lib/x`. */
function aliasTarget(spec: string): string | null {
  if (spec.startsWith('@/ui/')) return `src/app/components/ui/${spec.slice(5)}`
  if (spec.startsWith('@/lib/')) return `src/lib/${spec.slice(6)}`
  if (spec.startsWith('@/app/')) return `src/app/${spec.slice(6)}`
  return null
}

async function main(): Promise<void> {
  const names = (await readdir(OUT)).filter((f) => f.endsWith('.json') && f !== 'registry.json')
  const items = new Map<string, Item>()
  for (const f of names) {
    const item = JSON.parse(await readFile(join(OUT, f), 'utf8')) as Item
    items.set(item.name, item)
  }

  // Which item owns a file (target without extension), to resolve `@/ui/...` imports.
  const owner = new Map<string, string>()
  for (const item of items.values()) {
    for (const f of item.files) {
      if (!f.target) continue
      const t = f.target.replace(/^~\//, '').replace(/\.(ts|js)$/, '')
      owner.set(t, item.name)
      if (t.endsWith('/index')) owner.set(t.slice(0, -'/index'.length), item.name)
    }
  }

  const closure = (name: string, seen = new Set<string>()): Set<string> => {
    if (seen.has(name)) return seen
    seen.add(name)
    for (const d of items.get(name)?.registryDependencies ?? []) closure(depName(d), seen)
    return seen
  }

  const problems: string[] = []
  for (const item of items.values()) {
    const declared = new Set([...(item.dependencies ?? []), ...(item.devDependencies ?? [])].map(bareName))
    const reachable = closure(item.name)
    // Packages declared anywhere in the dependency closure get installed too.
    const installed = new Set([...reachable].flatMap((n) => (items.get(n)?.dependencies ?? []).map(bareName)))
    const missingPkgs = new Set<string>()
    const missingItems = new Set<string>()
    for (const f of item.files) {
      if (!f.content || !/\.(ts|js)$/.test(f.target ?? '')) continue
      for (const spec of importsOf(f.content)) {
        if (spec.startsWith('.')) continue
        const aliased = aliasTarget(spec)
        if (aliased) {
          const dep = owner.get(aliased) ?? owner.get(`${aliased}/index`)
          // utils (cn) comes from `init`, so every project has it.
          if (dep && dep !== 'utils' && !reachable.has(dep)) missingItems.add(dep)
          continue
        }
        if (spec.startsWith('@/')) continue
        const pkg = packageOf(spec)
        if (!BASELINE.has(pkg) && !declared.has(pkg) && !installed.has(pkg)) missingPkgs.add(pkg)
      }
    }
    if (missingPkgs.size)
      problems.push(`${item.name}: imports ${[...missingPkgs].join(', ')} but doesn't list it in "dependencies"`)
    if (missingItems.size)
      problems.push(
        `${item.name}: imports ${[...missingItems].join(', ')} but doesn't list it in "registryDependencies"`,
      )
  }

  if (problems.length) {
    console.error(
      `[check-imports] ${problems.length} item(s) with undeclared imports:\n${problems.map((p) => `  - ${p}`).join('\n')}`,
    )
    process.exit(1)
  }
  console.log(`[check-imports] ${items.size} items: every import is declared.`)
}

if (import.meta.main) void main()
