import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'virtual-tour-panorama',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'media'],
  description:
    '360-degree immersive room virtual tour panorama viewer with interactive viewpoint hotspots, laser measurement overlays, and architectural floor plan minimap.',
  framework: 'vue',
  files: [{ path: 'VirtualTourPanorama.vue', target: 'components/blocks/VirtualTourPanorama.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
