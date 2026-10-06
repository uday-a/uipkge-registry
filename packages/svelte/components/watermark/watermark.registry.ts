import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'watermark',
  type: 'registry:ui',
  categories: ['display', 'utility'],
  framework: 'svelte',
  description:
    'Overlay watermark that repeats text or an image across the content area at a configurable angle. Supports rotate angle, gap between repeats, opacity, font size/color/weight, z-index, and pointer-event control. Wrap any content via children.',
  files: [
    { path: 'Watermark.svelte', target: 'components/ui/watermark/Watermark.svelte' },
    { path: 'index.ts', target: 'components/ui/watermark/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
