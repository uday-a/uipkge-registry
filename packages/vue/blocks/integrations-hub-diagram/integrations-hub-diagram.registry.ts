import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-hub-diagram',
  title: 'Integrations — Hub Diagram',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Radial integration diagram: a central platform node connected by drawn SVG spokes to eight orbiting service nodes, with a legend splitting sources from destinations.',
  framework: 'vue',
  files: [{ path: 'IntegrationsHubDiagram.vue', target: 'components/blocks/IntegrationsHubDiagram.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
