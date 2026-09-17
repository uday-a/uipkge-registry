import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-ascii-terminal-stream',
  type: 'registry:block',
  categories: ['hero', 'marketing'],
  framework: 'vue',
  description: 'Retro-futuristic ASCII terminal stream hero section with command runner and AST telemetry logs.',
  files: [
    {
      path: 'HeroAsciiTerminalStream.vue',
      target: 'components/blocks/hero-ascii-terminal-stream/HeroAsciiTerminalStream.vue',
    },
    { path: 'index.ts', target: 'components/blocks/hero-ascii-terminal-stream/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
