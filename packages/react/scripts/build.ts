import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildRegistry } from '../../shared/scripts/build-registry.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

buildRegistry({
  // React mirror lives at /r/react/<name>.json on the same origin as Vue
  // (the astro-site cutover dropped the react.uipkge.dev subdomain plan).
  framework: process.env.REGISTRY_FRAMEWORK ?? 'react',
  root: ROOT,
  // React targets the upstream shadcn (not shadcn-vue) registry schema.
  itemSchema: 'https://ui.shadcn.com/schema/registry-item.json',
  indexSchema: 'https://ui.shadcn.com/schema/registry.json',
  indexName: 'uipkge-react',
  // Retired canonical host that old sidecars may still hardcode in
  // registryDependencies; rewritten to the active SITE by the pipeline.
  legacyDepBase: 'https://react.uipkge.dev/r/',
  // For Next.js App Router (canonical target) components live at the
  // project-root `components/` and helpers at `lib/` -- no `app/` segment,
  // unlike the Nuxt mirror. Bare targets just get the `~/` anchor;
  // `~/`-prefixed targets (bootstrap items) pass through.
  normalizeTarget: (rawTarget) => (rawTarget.startsWith('~/') ? rawTarget : `~/${rawTarget}`),
}).catch((err) => {
  console.error('[registry] build failed:', err)
  process.exit(1)
})
