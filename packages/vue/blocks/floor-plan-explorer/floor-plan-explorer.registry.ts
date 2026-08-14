import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'floor-plan-explorer',
  type: 'registry:block',
  categories: ['real-estate', 'app', 'hospitality', 'dashboard'],
  description:
    'Architectural unit floor plan inspector and residential layout explorer with 2D CAD-styled blueprint canvas, interactive room highlight pins, dimensional callouts, room breakdown specs, and building unit availability table.',
  framework: 'vue',
  files: [{ path: 'FloorPlanExplorer.vue', target: 'components/blocks/FloorPlanExplorer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
