import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-tabs-multi-language',
  title: 'Code — Multi-Language Tabs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Code sample switcher with a language tab row, a copy control reporting its own success state, and a caption line naming the endpoint the sample calls.',
  framework: 'vue',
  files: [{ path: 'CodeTabsMultiLanguage.vue', target: 'components/blocks/CodeTabsMultiLanguage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
