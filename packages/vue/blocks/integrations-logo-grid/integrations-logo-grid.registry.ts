import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-logo-grid',
  title: 'Integrations — Logo Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Integration marquee grid: category chips filter a wall of square logo tiles with hover labels, over a count line and a request-an-integration prompt.',
  framework: 'vue',
  files: [{ path: 'IntegrationsLogoGrid.vue', target: 'components/blocks/IntegrationsLogoGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
