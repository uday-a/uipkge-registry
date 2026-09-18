/**
 * CI lint: catch demos that self-reference their own filename.
 *
 * Background: Vue's `<script setup>` SFCs implicitly take their filename as
 * their component name. A template tag matching that name resolves to the
 * SFC itself before any auto-imported component of the same name takes
 * priority. So if `apps/astro-site/src/demos/vue/grid.vue` writes `<Grid>`
 * but the registry has no `Grid.vue` (only `Container.vue` etc.), Vue
 * compiles a recursive component reference and the page hydrates with a
 * stack-overflow loop — see the historical /components/grid crash.
 *
 * This script walks every demo, finds tags whose PascalCase name matches
 * the demo's own kebab-case filename, and fails if neither
 *   - an auto-importable component file with that PascalCase name exists, nor
 *   - the demo's `<script setup>` block explicitly imports a same-named binding
 * is present. Either is enough to override the SFC self-resolution.
 *
 * Run automatically as part of `npm run build:registry`.
 */
import { readFile } from 'node:fs/promises'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../../..')
// Astro vue demos (the registry-site Nuxt app was dropped in the cutover).
const DEMOS = join(REPO_ROOT, 'apps/astro-site/src/demos/vue')
const APP_COMPONENTS = join(REPO_ROOT, 'apps/astro-site/src/components')
const REGISTRY_COMPONENTS = join(REPO_ROOT, 'packages/registry-vue/components')
const REGISTRY_BLOCKS = join(REPO_ROOT, 'packages/registry-vue/blocks')

function kebabToPascal(s: string): string {
  return s
    .split('-')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join('')
}

function* walkVueFiles(dir: string): Generator<string> {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) yield* walkVueFiles(full)
    else if (entry.endsWith('.vue')) yield full
  }
}

async function main() {
  // Build the set of resolvable component names. In the Astro site, vue demos
  // use explicit imports (no Nuxt filename auto-import), but a same-named file
  // existing in any scan path means the demo can import it; the explicit-import
  // check below is the real guard. Globally-registered children also live under
  // these roots (registered in apps/astro-site/src/vue-app.ts).
  const autoImportable = new Set<string>()
  for (const root of [APP_COMPONENTS, REGISTRY_COMPONENTS, REGISTRY_BLOCKS]) {
    for (const file of walkVueFiles(root)) {
      const stem = file
        .split('/')
        .pop()!
        .replace(/\.vue$/, '')
      autoImportable.add(stem)
    }
  }

  const issues: string[] = []
  for (const demo of walkVueFiles(DEMOS)) {
    const name = demo
      .split('/')
      .pop()!
      .replace(/\.vue$/, '')
    const pascal = kebabToPascal(name)
    if (!pascal) continue

    const src = await readFile(demo, 'utf8')
    // Tag usage: `<Pascal>` or `<Pascal ...>` or `<Pascal/>`
    const tagRe = new RegExp(`<\\s*${pascal}(\\s|/|>)`)
    if (!tagRe.test(src)) continue

    if (autoImportable.has(pascal)) continue

    // Check for explicit import in <script setup>
    const importRe = new RegExp(`import\\s*\\{[^}]*\\b${pascal}\\b`)
    if (importRe.test(src)) continue

    issues.push(
      `apps/astro-site/src/demos/vue/${name}.vue uses <${pascal}> but neither ${pascal}.vue exists in any component scan path nor is ${pascal} explicitly imported`,
    )
  }

  if (issues.length) {
    console.error('\n[check-demo-self-ref] crash risk: SFC will recursively reference itself\n')
    for (const i of issues) console.error(`  - ${i}`)
    console.error(`\n  Fix one of:`)
    console.error(`    1. Add a Pascal-cased .vue file to packages/registry-vue/components/<name>/`)
    console.error(
      `    2. Add an explicit \`import { Pascal } from '@/components/ui/<name>'\` to the demo's <script setup>`,
    )
    console.error()
    process.exit(1)
  }

  console.log(`[check-demo-self-ref] ok — scanned ${[...walkVueFiles(DEMOS)].length} demo files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
