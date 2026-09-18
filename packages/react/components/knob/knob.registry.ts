import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'knob',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Circular dial input. Drag to rotate, keyboard accessible, SVG-rendered. Useful for compact numeric controls (volume, brightness, gauges).',
  files: [
    { path: 'Knob.tsx', target: 'components/ui/knob/Knob.tsx' },
    { path: 'index.ts', target: 'components/ui/knob/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
