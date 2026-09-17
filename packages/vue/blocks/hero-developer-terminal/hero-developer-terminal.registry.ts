import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-developer-terminal',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Developer-first hero section with split value proposition and an interactive live CLI terminal sandbox with preset command switching and copy controls.',
  framework: 'vue',
  files: [{ path: 'HeroDeveloperTerminal.vue', target: 'components/blocks/HeroDeveloperTerminal.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
