import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logo-ticker-infinite',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Infinite marquee brand partner ticker with sector category filters, speed and pause controls, and interactive telemetry hover cards.',
  framework: 'vue',
  files: [{ path: 'LogoTickerInfinite.vue', target: 'components/blocks/LogoTickerInfinite.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/card.json'],
})
