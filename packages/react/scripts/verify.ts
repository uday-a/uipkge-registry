import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { verifyRegistry } from '../../shared/scripts/verify-registry.ts'
import { checkUseClient, reportUseClient } from './check-use-client.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function main() {
  await verifyRegistry({
    framework: process.env.REGISTRY_FRAMEWORK ?? 'react',
    root: ROOT,
    itemSchema: 'https://ui.shadcn.com/schema/registry-item.json',
    indexSchema: 'https://ui.shadcn.com/schema/registry.json',
  })

  // React-only: shipped source that needs a client boundary must carry it, or
  // Next.js App Router consumers fail to build on install.
  const violations = await checkUseClient(ROOT)
  reportUseClient(violations)
  if (violations.length) process.exit(1)
}

main().catch((e) => {
  console.error('[verify] crashed:', e)
  process.exit(2)
})
