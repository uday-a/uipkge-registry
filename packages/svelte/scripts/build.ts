import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRegistry } from '../../shared/scripts/build-registry'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

buildRegistry({
  framework: process.env.REGISTRY_FRAMEWORK ?? 'svelte',
  root: ROOT,
  itemSchema: 'https://uipkge.dev/schema/registry-item.json',
  indexSchema: 'https://uipkge.dev/schema/registry.json',
  indexName: 'uipkge-svelte',
  excludeConsumerFiles: [],
  // SvelteKit layout is `src/lib`-rooted (the `$lib` alias). Sidecars declare
  // bare targets:
  //   - `components/...` / `lib/...` -> `~/src/lib/...`
  //   - `~/...`                      -> passthrough (bootstrap items)
  normalizeTarget: (rawTarget) => (rawTarget.startsWith('~/') ? rawTarget : `~/src/lib/${rawTarget.replace(/^lib\//, '')}`),
}).catch((err) => {
  console.error('[registry-svelte] build failed:', err)
  process.exit(1)
})
