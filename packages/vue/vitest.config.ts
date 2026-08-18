import path from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'

const root = path.resolve(__dirname)

// Mirrors the registryAtAlias Vite plugin used by the Astro site so block
// imports (`@/components/blocks/*`, `@/composables/*`) resolve under vitest.
function registryAtAlias(): Plugin {
  return {
    name: 'uipkge-registry-at-alias',
    enforce: 'pre' as const,
    async resolveId(source: string, importer?: string) {
      if (!source.startsWith('@/') && !source.startsWith('~/')) return null
      const rest = source.slice(2)

      // @/composables/<useCamel> -> bootstrap/<use-kebab>/<useCamel>.ts
      // (e.g. @/composables/useKanban -> bootstrap/use-kanban/useKanban.ts)
      if (rest.startsWith('composables/')) {
        const comp = rest.slice('composables/'.length).replace(/\.(ts|js)$/, '')
        const dir = comp.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
        const r = await this.resolve(path.join(root, 'bootstrap', dir, `${comp}.ts`), importer, {
          skipSelf: true,
        })
        return r?.id ?? null
      }

      // ~/composables/<useCamel> (Nuxt-style alias used by sidebar blocks)
      // -> bootstrap/<use-kebab>/<useCamel>.ts
      if (source.startsWith('~/composables/')) {
        const comp = source.slice('~/composables/'.length).replace(/\.(ts|js)$/, '')
        const dir = comp.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
        const r = await this.resolve(path.join(root, 'bootstrap', dir, `${comp}.ts`), importer, {
          skipSelf: true,
        })
        return r?.id ?? null
      }

      // @/components/blocks/<dir>/<File> -> blocks/<dir>/<File>
      // @/components/blocks/<File> (flat) -> blocks/<kebab-dir>/<File>
      if (rest.startsWith('components/blocks/')) {
        let name = rest.slice('components/blocks/'.length)
        if (!name.includes('/')) {
          const file = name.replace(/\.(vue|tsx?)$/, '')
          const dir = file.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
          name = `${dir}/${name}`
        }
        const r = await this.resolve(path.join(root, 'blocks', name), importer, { skipSelf: true })
        return r?.id ?? null
      }

      return null
    },
  }
}

export default defineConfig({
  plugins: [vue(), registryAtAlias()],
  resolve: {
    alias: [
      // Consumer path: @/components/ui/button -> packages/registry-vue/components/button
      { find: /^@\/components\/ui\/(.*)$/, replacement: path.join(root, 'components/$1') },
      { find: /^@\/lib\/(.*)$/, replacement: path.join(root, 'lib/$1') },
      { find: '@/lib/utils', replacement: path.join(root, 'lib/utils.ts') },
    ],
  },
  test: {
    name: 'registry-vue',
    environment: 'happy-dom',
    setupFiles: [path.join(root, 'components/data-table/__tests__/setup.ts')],
    include: ['components/**/__tests__/**/*.{spec,test}.ts', 'bootstrap/**/__tests__/**/*.{spec,test}.ts'],
    css: false,
    globals: false,
    testTimeout: 15000,
  },
})
