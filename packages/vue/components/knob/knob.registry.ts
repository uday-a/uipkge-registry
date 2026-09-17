import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'knob',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Circular dial input. Drag to rotate, keyboard accessible, SVG-rendered. Useful for compact numeric controls (volume, brightness, gauges).',
  files: [
    { path: 'Knob.vue', target: 'components/ui/knob/Knob.vue' },
    { path: 'index.ts', target: 'components/ui/knob/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
