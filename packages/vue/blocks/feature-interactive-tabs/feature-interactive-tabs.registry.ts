import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-interactive-tabs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Master-detail architectural feature workbench with interactive source snippets, copy action, telemetry stats, and verified technical checks.',
  framework: 'vue',
  files: [{ path: 'FeatureInteractiveTabs.vue', target: 'components/blocks/FeatureInteractiveTabs.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
