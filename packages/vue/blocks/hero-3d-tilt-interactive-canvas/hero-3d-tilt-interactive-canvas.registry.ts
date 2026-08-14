import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-3d-tilt-interactive-canvas',
  type: 'registry:block',
  categories: ['hero', 'marketing'],
  framework: 'vue',
  description:
    'Hero section with hardware-accelerated 3D tilt perspective card, specular light glare, and multi-layer z-depth primitives.',
  files: [
    {
      path: 'Hero3dTiltInteractiveCanvas.vue',
      target: 'components/blocks/hero-3d-tilt-interactive-canvas/Hero3dTiltInteractiveCanvas.vue',
    },
    { path: 'index.ts', target: 'components/blocks/hero-3d-tilt-interactive-canvas/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
