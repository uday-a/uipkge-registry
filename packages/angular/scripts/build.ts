import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRegistry } from '../../shared/scripts/build-registry'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

buildRegistry({
  framework: process.env.REGISTRY_FRAMEWORK ?? 'angular',
  root: ROOT,
  itemSchema: 'https://uipkge.dev/schema/registry-item.json',
  indexSchema: 'https://uipkge.dev/schema/registry.json',
  indexName: 'uipkge-angular',
  excludeConsumerFiles: [],
  // Angular CLI layout is `src/`-rooted (components under
  // `src/app/components/`), not Nuxt's `app/` dir. Sidecars declare bare
  // targets in one shape:
  //   - `components/...` -> `~/src/app/components/...` (ui/blocks)
  //   - `~/...`          -> passthrough (bootstrap items)
  normalizeTarget: (rawTarget) => (rawTarget.startsWith('~/') ? rawTarget : `~/src/app/${rawTarget}`),
}).catch((err) => {
  console.error('[registry-angular] build failed:', err)
  process.exit(1)
})
