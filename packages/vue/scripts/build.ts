import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRegistry } from '../../shared/scripts/build-registry.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

buildRegistry({
  // Registry items are namespaced by framework: /r/vue/<name>.json.
  framework: process.env.REGISTRY_FRAMEWORK ?? 'vue',
  root: ROOT,
  itemSchema: 'https://shadcn-vue.com/schema/registry-item.json',
  indexSchema: 'https://shadcn-vue.com/schema/registry.json',
  indexName: 'uipkge',
  // `page.vue` files live in block dirs for the docs preview pipeline
  // (per-block demo routes under /view/<block>). They are NOT consumer
  // assets -- shipping them would activate Nuxt's pages router on install,
  // silently breaking the consumer's app.vue rendering at `/`.
  excludeConsumerFiles: ['page.vue'],
  // For Nuxt 4 (canonical target -- srcDir is `app/`), most files land under
  // `app/`. Sidecars declare bare targets in three shapes:
  //   - `components/...`  -> `~/app/components/...` (ui/blocks)
  //   - `app/pages/...`   -> `~/app/pages/...` (demo pages)
  //   - `~/...`           -> passthrough (bootstrap items)
  normalizeTarget: (rawTarget) =>
    rawTarget.startsWith('~/') ? rawTarget : rawTarget.startsWith('app/') ? `~/${rawTarget}` : `~/app/${rawTarget}`,
}).catch((err) => {
  console.error('[registry] build failed:', err)
  process.exit(1)
})
